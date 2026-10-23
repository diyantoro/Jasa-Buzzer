// Captures the original Error out-of-band so server.ts can recover the stack
// when h3 has already swallowed the throw into a generic 500 Response.

let lastCapturedError: { error: unknown; at: number } | undefined;
const TTL_MS = 5_000;

function record(error: unknown) {
  lastCapturedError = { error, at: Date.now() };
}

export function isClientAbortError(error: unknown): boolean {
  if (!error) return false;
  if (typeof error === "string" && /aborted|client closed|socket closed|ECONNRESET|ERR_STREAM_PREMATURE_CLOSE/i.test(error)) {
    return true;
  }
  const seen = new Set<unknown>();
  let current: unknown = error;
  while (current && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    const candidate = current as { name?: unknown; code?: unknown; cause?: unknown; message?: unknown };
    if (
      candidate.name === "AbortError" ||
      candidate.code === "ECONNRESET" ||
      candidate.code === "ERR_STREAM_PREMATURE_CLOSE" ||
      (typeof candidate.message === "string" && /aborted|client closed|socket closed|connection reset|ERR_STREAM_PREMATURE_CLOSE|premature close/i.test(candidate.message))
    ) {
      return true;
    }
    current = candidate.cause;
  }
  return false;
}

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => record((event as ErrorEvent).error ?? event));
  globalThis.addEventListener("unhandledrejection", (event) => {
    const reason = (event as PromiseRejectionEvent).reason;
    record(reason);
    if (isClientAbortError(reason) && typeof event.preventDefault === "function") {
      event.preventDefault();
    }
  });
}

// In Node.js environment, prevent client connection aborts (ECONNRESET/aborted) from crashing the dev server
if (typeof process !== "undefined" && typeof process.on === "function") {
  process.on("unhandledRejection", (reason) => {
    record(reason);
    if (isClientAbortError(reason)) {
      // Harmless client connection abort during HMR or browser page refresh
      return;
    }
  });

  process.on("uncaughtException", (error) => {
    record(error);
    if (isClientAbortError(error)) {
      // Harmless client socket abort
      return;
    }
    console.error("Uncaught exception in server:", error);
  });
}

export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = undefined;
    return undefined;
  }
  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}

