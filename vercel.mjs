import { deploymentEnv, routes } from "@vercel/config/v1";

const localBackendUrl = process.env.URL_BACKEND?.replace(/\/$/, "");
const backendUrl = localBackendUrl || deploymentEnv("URL_BACKEND");

export const config = {
  rewrites: [
    routes.rewrite("/api/proxy/:path*", `${backendUrl}/:path*`),
  ],
};
