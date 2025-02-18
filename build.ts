import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { type BuildOptions, build } from "esbuild";

(async () => {
  const pkgPath = fileURLToPath(new URL("./package.json", import.meta.url));
  const pkgData = await readFile(pkgPath, "utf8");
  const packageJson = JSON.parse(pkgData);
  const { dependencies } = packageJson;

  const entryFile = "./src/index.ts";
  const shared: BuildOptions = {
    bundle: true,
    entryPoints: [entryFile],
    logLevel: "info",
    minify: true,
    sourcemap: true,
    external: Object.keys(dependencies),
  };

  await build({
    ...shared,
    format: "esm",
    outfile: "./dist/index.mjs",
  });
})();
