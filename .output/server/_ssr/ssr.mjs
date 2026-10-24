import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/index.js
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
function isClientAbortError$1(error) {
	if (!error) return false;
	if (typeof error === "string" && /aborted|client closed|socket closed|ECONNRESET|ERR_STREAM_PREMATURE_CLOSE/i.test(error)) return true;
	const seen = /* @__PURE__ */ new Set();
	let current = error;
	while (current && typeof current === "object" && !seen.has(current)) {
		seen.add(current);
		const candidate = current;
		if (candidate.name === "AbortError" || candidate.code === "ECONNRESET" || candidate.code === "ERR_STREAM_PREMATURE_CLOSE" || typeof candidate.message === "string" && /aborted|client closed|socket closed|connection reset|ERR_STREAM_PREMATURE_CLOSE|premature close/i.test(candidate.message)) return true;
		current = candidate.cause;
	}
	return false;
}
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => {
		const reason = event.reason;
		record(reason);
		if (isClientAbortError$1(reason) && typeof event.preventDefault === "function") event.preventDefault();
	});
}
if (typeof processModule !== "undefined" && typeof processModule.on === "function") {
	processModule.on("unhandledRejection", (reason) => {
		record(reason);
		if (isClientAbortError$1(reason)) return;
	});
	processModule.on("uncaughtException", (error) => {
		record(error);
		if (isClientAbortError$1(error)) return;
		console.error("Uncaught exception in server:", error);
	});
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-DCVbxAm0.mjs").then((n) => n.t).then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(request, response) {
	if (response.status < 500) return response;
	if (request.signal.aborted) {
		consumeLastCapturedError();
		return new Response(null, {
			status: 499,
			statusText: "Client Closed Request"
		});
	}
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	const capturedError = consumeLastCapturedError();
	if (isClientAbortError(capturedError)) return new Response(null, {
		status: 499,
		statusText: "Client Closed Request"
	});
	console.error(capturedError ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isClientAbortError(error) {
	if (!error) return false;
	if (typeof error === "string" && /aborted|client closed|socket closed|ECONNRESET|ERR_STREAM_PREMATURE_CLOSE/i.test(error)) return true;
	const seen = /* @__PURE__ */ new Set();
	let current = error;
	while (current && typeof current === "object" && !seen.has(current)) {
		seen.add(current);
		const candidate = current;
		if (candidate.name === "AbortError" || candidate.code === "ECONNRESET" || candidate.code === "ERR_STREAM_PREMATURE_CLOSE" || typeof candidate.message === "string" && /aborted|client closed|socket closed|ERR_STREAM_PREMATURE_CLOSE|premature close/i.test(candidate.message)) return true;
		current = candidate.cause;
	}
	return false;
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
var server_default = { async fetch(request, env, ctx) {
	try {
		return await normalizeCatastrophicSsrResponse(request, await (await getServerEntry()).fetch(request, env, ctx));
	} catch (error) {
		if (request.signal.aborted || isClientAbortError(error)) return new Response(null, {
			status: 499,
			statusText: "Client Closed Request"
		});
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { server_default as default, isClientAbortError$1 as n, renderErrorPage as t };
