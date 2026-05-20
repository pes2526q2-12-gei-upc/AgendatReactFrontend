const backendUrl = process.env.URL_BACKEND?.replace(/\/$/, "");

if (!backendUrl) {
  throw new Error("URL_BACKEND must be defined for Vercel proxy rewrites.");
}

export const config = {
  rewrites: [
    {
      source: "/api/proxy/:path*",
      destination: `${backendUrl}/:path*`,
    },
  ],
};
