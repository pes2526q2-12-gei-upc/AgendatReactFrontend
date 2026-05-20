import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const defaultApiBaseUrl =
    mode === "development" ? "http://localhost:8080" : "";
  const devProxyTarget = env.URL_BACKEND?.replace(/\/$/, "");

  return {
    plugins: [react()],
    server: devProxyTarget
      ? {
          proxy: {
            "/api/proxy": {
              target: env.URL_BACKEND,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api\/proxy/, ""),
            },
          },
        }
      : undefined,
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
