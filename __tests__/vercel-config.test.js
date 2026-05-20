const fs = require("node:fs");
const path = require("node:path");

describe("Vercel routing config", () => {
  test("defines proxy and SPA rewrites in vercel.json only", () => {
    const repoRoot = process.cwd();
    const configPath = path.join(repoRoot, "vercel.json");
    const legacyConfigPath = path.join(repoRoot, "vercel.mjs");

    expect(fs.existsSync(configPath)).toBe(true);
    expect(fs.existsSync(legacyConfigPath)).toBe(false);

    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    expect(config).toEqual({
      rewrites: [
        {
          source: "/api/proxy/:path*",
          destination: "http://nattech.fib.upc.edu:40410/:path*",
        },
        {
          source: "/(.*)",
          destination: "/index.html",
        },
      ],
    });
  });
});
