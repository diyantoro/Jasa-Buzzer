// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.

// Prevent Vite dev server from crashing or logging false 500s when browser aborts connection on page reload/HMR
function isClientAbort(err: unknown): boolean {
  if (!err) return false;
  if (typeof err === "string" && /aborted|ECONNRESET|client closed|socket closed|ERR_STREAM_PREMATURE_CLOSE/i.test(err)) {
    return true;
  }
  const seen = new Set<unknown>();
  let cur: unknown = err;
  while (cur && typeof cur === "object" && !seen.has(cur)) {
    seen.add(cur);
    const candidate = cur as {
      code?: unknown;
      name?: unknown;
      message?: unknown;
      cause?: unknown;
      status?: unknown;
      unhandled?: unknown;
    };
    if (
      candidate.code === "ECONNRESET" ||
      candidate.code === "ERR_STREAM_PREMATURE_CLOSE" ||
      candidate.name === "AbortError" ||
      (typeof candidate.message === "string" &&
        /aborted|ECONNRESET|client closed|socket closed|ERR_STREAM_PREMATURE_CLOSE|premature close/i.test(candidate.message))
    ) {
      return true;
    }
    cur = candidate.cause;
  }
  return false;
}

if (typeof process !== "undefined" && typeof process.on === "function") {
  const origConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    if (args.some((arg) => isClientAbort(arg))) {
      // Harmless client connection abort during browser page reload or HMR navigation
      return;
    }
    origConsoleError(...args);
  };

  process.on("unhandledRejection", (reason: unknown) => {
    if (isClientAbort(reason)) {
      // Harmless client connection abort during browser page reload or HMR
      return;
    }
  });

  process.on("uncaughtException", (err: unknown) => {
    if (isClientAbort(err)) {
      // Harmless client socket abort
      return;
    }
    origConsoleError("Uncaught Exception in dev server:", err);
  });
}

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    plugins: [
      {
        name: "suppress-client-abort",
        configureServer(server) {
          server.httpServer?.on("clientError", (err: unknown, socket: any) => {
            if (isClientAbort(err) || socket.destroyed) return;
            socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
          });
        },
      },
    ],
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
