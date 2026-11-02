#!/usr/bin/env node
// Regenerates src/v4-eos/schemas/layoutSchemas.json from the production
// Iceberg monorepo (the unzipped iceberg-commerce-main archive).
//
// Usage:
//   NODE_PATH=<dir with lodash + query-string> \
//     node scripts/build-layout-schemas.cjs <path to iceberg-commerce-main>
//
// How it works: bundles elements-peacock's core/schemas.ts with esbuild, calls
// getSchemas('peacock') and keeps the `section` schemas (the layout list).
// Imports that are not in the archive are handled as follows:
//   - @nowtv/<pkg>/lib/...  -> packages/<pkg>/src/... (monorepo source)
//   - @gst-gc/peacock-toolkit (private, not in archive) -> empty stub.
//     Values built from it come out empty (e.g. font-size option lists).
//   - other npm packages (lodash, query-string, ...) -> NODE_PATH.

const fs = require("fs");
const os = require("os");
const path = require("path");
const esbuild = require("esbuild");

const SOURCE = process.argv[2];
if (!SOURCE) {
  console.error("Usage: node scripts/build-layout-schemas.cjs <path to iceberg-commerce-main>");
  process.exit(1);
}
const ROOT = path.resolve(SOURCE);
const PEACOCK = path.join(ROOT, "packages", "iceberg-commerce-elements-peacock");
const OUT_FILE = path.join(__dirname, "..", "src", "v4-eos", "schemas", "layoutSchemas.json");
// Only these keys are kept; they are the ones the V4 schema engine reads.
const KEYS = ["_id", "name", "editorOptions", "globalLayoutOptionData", "optionData"];

if (!fs.existsSync(path.join(PEACOCK, "src", "core", "schemas.ts"))) {
  console.error(`Not an Iceberg monorepo (missing ${PEACOCK}/src/core/schemas.ts)`);
  process.exit(1);
}

const work = fs.mkdtempSync(path.join(os.tmpdir(), "layout-schemas-"));
const tsconfig = path.join(work, "tsconfig.json");
fs.writeFileSync(
  tsconfig,
  JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      module: "commonjs",
      moduleResolution: "node",
      jsx: "react",
      esModuleInterop: true,
      resolveJsonModule: true,
      baseUrl: PEACOCK,
      paths: { "@elements/core/*": ["src/core/*"] },
    },
  }),
);

const entry = path.join(work, "entry.ts");
const sectionsFile = path.join(work, "sections.json");
fs.writeFileSync(
  entry,
  `import { getSchemas } from ${JSON.stringify(path.join(PEACOCK, "src/core/schemas"))};
import fs from "fs";
const { type } = getSchemas("peacock");
fs.writeFileSync(${JSON.stringify(sectionsFile)}, JSON.stringify(Object.values(type.section)));
`,
);

const stubbed = new Set();
const plugin = {
  name: "layout-schema-deps",
  setup(build) {
    build.onResolve({ filter: /^@nowtv\/[^/]+/ }, async (args) => {
      const [, pkg, ...rest] = args.path.match(/^@nowtv\/([^/]+)(?:\/(.*))?$/);
      const pkgRoot = path.join(ROOT, "packages", pkg);
      const sub = (rest.join("/") || "").replace(/^lib\//, "src/");
      const target = sub ? path.join(pkgRoot, sub) : path.join(pkgRoot, "src", "index.ts");
      const result = await build.resolve(target, { resolveDir: args.resolveDir, kind: args.kind });
      return result.errors.length ? { errors: result.errors } : result;
    });
    build.onResolve({ filter: /^@gst-gc\/peacock-toolkit/ }, (args) => {
      stubbed.add(args.importer.replace(ROOT, ""));
      return { path: args.path, namespace: "stub" };
    });
    build.onLoad({ filter: /.*/, namespace: "stub" }, () => ({
      contents:
        "const p = new Proxy(function(){}, { get: () => p, apply: () => p, construct: () => p }); module.exports = new Proxy({ __esModule: true, default: p, iconNames: [] }, { get: (t, k) => (k in t ? t[k] : p) });",
      loader: "js",
    }));
  },
};

esbuild
  .build({
    entryPoints: [entry],
    bundle: true,
    platform: "node",
    format: "cjs",
    outfile: path.join(work, "bundle.cjs"),
    tsconfig,
    nodePaths: (process.env.NODE_PATH || "").split(path.delimiter).filter(Boolean),
    plugins: [plugin],
    loader: { ".png": "empty", ".jpg": "empty", ".webp": "empty", ".gif": "empty", ".svg": "text", ".css": "empty", ".html": "text", ".woff": "empty", ".woff2": "empty" },
    logLevel: "error",
  })
  .then(() => {
    require(path.join(work, "bundle.cjs"));
    const sections = JSON.parse(fs.readFileSync(sectionsFile, "utf8"));
    const out = {};
    for (const schema of sections) {
      out[schema._id] = Object.fromEntries(KEYS.map((k) => [k, schema[k]]));
    }
    fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 1) + "\n");
    console.log(`Wrote ${Object.keys(out).length} layout schemas to ${path.relative(process.cwd(), OUT_FILE)}`);
    if (stubbed.size) console.log("Stubbed (not in archive):", [...stubbed].join(", "));
  })
  .catch((err) => {
    console.error("Failed to build layout schemas:", err.errors ? err.errors.map((e) => e.text) : err);
    process.exit(1);
  })
  .finally(() => fs.rmSync(work, { recursive: true, force: true }));
