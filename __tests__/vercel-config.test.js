const fs = require("node:fs");
const path = require("node:path");

describe("Vercel routing config", () => {
  test("defines proxy and SPA routes in vercel.json only", () => {
    const repoRoot = process.cwd();
    const configPath = path.join(repoRoot, "vercel.json");
    const legacyConfigPath = path.join(repoRoot, "vercel.mjs");

    expect(fs.existsSync(configPath)).toBe(true);
    expect(fs.existsSync(legacyConfigPath)).toBe(false);

    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    expect(config).toEqual({
      $schema: "https://openapi.vercel.sh/vercel.json",
      routes: [
        {
          src: "^/api/proxy(?:/(.*))?$",
          dest: "http://nattech.fib.upc.edu:40410/$1",
        },
        {
          handle: "filesystem",
        },
        {
          src: "^/(.*)$",
          dest: "/index.html",
        },
      ],
    });
  });

  test("proxy source matches API paths with and without a trailing slash", () => {
    const config = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
    const proxyRoute = config.routes[0];

    const source = new RegExp(proxyRoute.src);

    expect(source.test("/api/proxy/api/users/login/")).toBe(true);
    expect(source.test("/api/proxy/api/users/login")).toBe(true);
  });
});
