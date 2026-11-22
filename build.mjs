import { cp, mkdir } from "node:fs/promises";
import { build, context } from "esbuild";

const serve = process.argv.includes("--serve");
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });

const options = {
  entryPoints: ["src/playground.js"],
  outfile: "dist/playground.js",
  bundle: true,
  format: "esm",
  minify: !serve,
  // Recast also supports Node, where it reads os.EOL.
  alias: { os: "os-browserify/browser.js" },
};

if (serve) {
  const bundler = await context(options);
  await bundler.watch();
  const { port } = await bundler.serve({
    servedir: "dist",
    host: "127.0.0.1",
    port: 4173,
  });
  console.log(`Demo running at http://127.0.0.1:${port}/`);
} else {
  await build(options);
}
