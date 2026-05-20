# Vercel Proxy Runbook

## Goal

Use Vercel as an HTTPS-facing proxy so the browser talks to Vercel over HTTPS while Vercel forwards API requests to the current backend at `http://nattech.fib.upc.edu:40410`.

This avoids the browser mixed-content block caused by an `https://` frontend calling an `http://` backend directly.

## Current repo state

The repo already has the two pieces needed for a proxy setup:

- `api/proxy.js`: a Vercel Function that forwards requests to `process.env.URL_BACKEND`
- `src/shared/api/client.js`: the frontend API client, which uses the injected global base URL

There is one caveat:

- `vite.config.js` currently injects `URL_BACKEND` into the browser build
- that is wrong for proxy mode, because the browser would still receive the raw `http://nattech...` URL

For proxy mode, the browser must use `/api/proxy`, while the Vercel Function must keep using `URL_BACKEND` internally.

## Required config split

### Client-side base URL

The browser should use:

```text
VITE_API_BASE_URL=/api/proxy
```

### Server-side backend URL

The Vercel Function should use:

```text
URL_BACKEND=http://nattech.fib.upc.edu:40410
```

## Required code change

`vite.config.js` must stop preferring `URL_BACKEND` for the client build.

Desired behavior:

- development: default to `http://localhost:8080`
- production on Vercel proxy: use `VITE_API_BASE_URL=/api/proxy`
- never expose `URL_BACKEND` to the browser bundle

Recommended version:

```js
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const defaultApiBaseUrl =
    mode === "development" ? "http://localhost:8080" : "";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    define: {
      "globalThis.__AGENDAT_API_BASE_URL__": JSON.stringify(
        env.VITE_API_BASE_URL || defaultApiBaseUrl,
      ),
    },
  };
});
```

## Deployment steps

### 1. Keep the backend unchanged

No backend or VM changes are required for this setup.

Current backend URL:

```text
http://nattech.fib.upc.edu:40410
```

### 2. Configure Vercel environment variables

In the Vercel project settings, add:

```text
URL_BACKEND=http://nattech.fib.upc.edu:40410
VITE_API_BASE_URL=/api/proxy
```

Apply them to:

- Production
- Preview

If you test locally with `vercel dev`, also add them to Development or pull them with `vercel env pull`.

### 3. Deploy the frontend

Once the client build uses `VITE_API_BASE_URL`, redeploy the project.

### 4. Verify the proxy endpoint directly

Open:

```text
https://<your-vercel-domain>/api/proxy/
```

or a known backend route, for example:

```text
https://<your-vercel-domain>/api/proxy/api/...
```

The exact path depends on how the backend routes are structured. The Vercel function strips the `/api/proxy` prefix and forwards the rest of the path to `URL_BACKEND`.

Examples:

```text
Browser request:
https://frontend.vercel.app/api/proxy/users/me

Forwarded backend request:
http://nattech.fib.upc.edu:40410/users/me
```

```text
Browser request:
https://frontend.vercel.app/api/proxy/api/events

Forwarded backend request:
http://nattech.fib.upc.edu:40410/api/events
```

### 5. Verify from the frontend

After deployment:

- log in normally
- open the browser network tab
- confirm API requests go to `/api/proxy/...`
- confirm there are no direct browser requests to `http://nattech.fib.upc.edu:40410`

## Why this works

The browser sees only:

```text
https://frontend.vercel.app/api/proxy/...
```

That is same-origin HTTPS traffic, so there is no mixed-content error.

Vercel then performs the server-to-server request to:

```text
http://nattech.fib.upc.edu:40410
```

Since that hop is not made by the browser, mixed-content rules do not apply.

## CORS impact

This setup usually avoids browser CORS issues because the browser is calling the same Vercel origin, not the backend origin directly.

The backend may still need adjustment if it has strict host validation or builds absolute URLs from request headers, but normal CORS preflight problems should disappear.

## Auth impact

This frontend stores the token in local storage and sends it in the `Authorization` header from `src/shared/api/client.js`.

The proxy forwards incoming headers, so token-based auth should continue to work without browser changes.

## Local development

For local development, keep using:

```text
http://localhost:8080
```

That is already the default in `vite.config.js` development mode.

If you want to test the Vercel-style proxy locally, use `vercel dev` with:

```text
URL_BACKEND=http://nattech.fib.upc.edu:40410
VITE_API_BASE_URL=/api/proxy
```

## Troubleshooting

### Frontend still calls `http://nattech...`

Cause:

- `vite.config.js` is still reading `URL_BACKEND` into the client bundle

Fix:

- remove `env.URL_BACKEND` from the client-side injected value

### Proxy returns `URL_BACKEND is not defined`

Cause:

- the Vercel Function does not have the runtime environment variable

Fix:

- add `URL_BACKEND` in Vercel Project Settings
- redeploy

### Proxy path is wrong

Cause:

- the backend route prefix does not match the frontend request path

Fix:

- check whether the backend expects `/api/...` or plain `/...`
- compare the browser URL after `/api/proxy` with the backend route structure

### Login works locally but not on Vercel

Check:

- whether `VITE_API_BASE_URL` is set to `/api/proxy`
- whether the deployment was rebuilt after setting variables
- whether the backend rejects forwarded `Host` or proxy headers

### File uploads or large request bodies fail

The current proxy implementation forwards request bodies directly. If uploads fail, inspect:

- Vercel Function limits
- backend upload limits
- whether the backend expects a specific `Content-Length` or multipart behavior

## Alternative: rewrite-based proxy

Vercel also supports proxying with external rewrites in `vercel.json`, but this repo already contains a function-based proxy in `api/proxy.js`.

For this project, the function approach is preferable because:

- it already exists
- it gives explicit control over headers and response forwarding
- it keeps the setup close to the current codebase

## Official references

- Vercel reverse proxy with rewrites: <https://vercel.com/kb/guide/vercel-reverse-proxy-rewrites-external>
- Vercel routing and external rewrites: <https://vercel.com/docs/routing>
- Vercel Node.js Functions: <https://vercel.com/docs/functions/runtimes/node-js>
- Vercel environment variables: <https://vercel.com/docs/environment-variables>
