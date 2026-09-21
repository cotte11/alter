// Optimiza los GLB exportados desde Cinema 4D con gltf-transform.
//   entrada: assets-source/glb-raw/*.glb
//   salida:  public/models/*.glb
//
// Uso: npm run optimize:models [-- --draco] [-- --texture-size 1024]
//
// IMPORTANTE: se desactivan flatten/join/instance/palette/simplify porque
// destruirían los objetos con nombre (body, tab, ring, cap) y sus pivotes.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { basename, dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const inDir = join(root, "assets-source", "glb-raw");
const outDir = join(root, "public", "models");
const args = process.argv.slice(2);

const useDraco = args.includes("--draco");
const sizeIdx = args.indexOf("--texture-size");
const textureSize = sizeIdx >= 0 ? args[sizeIdx + 1] : "2048";

if (!existsSync(inDir)) {
  mkdirSync(inDir, { recursive: true });
  console.log(`Creada ${inDir}. Poné ahí los GLB exportados de Cinema 4D y volvé a correr el script.`);
  process.exit(0);
}

const files = readdirSync(inDir).filter((f) => f.toLowerCase().endsWith(".glb"));
if (files.length === 0) {
  console.log(`No hay .glb en ${inDir}.`);
  process.exit(0);
}
mkdirSync(outDir, { recursive: true });

// KTX2 requiere el binario `toktx` (KTX-Software). Sin él, se usa WebP.
const hasToktx = spawnSync("toktx", ["--version"], { shell: true }).status === 0;
const textureCompress = hasToktx ? "ktx2" : "webp";
if (!hasToktx) console.warn("⚠ `toktx` no está instalado: texturas en WebP en vez de KTX2 (https://github.com/KhronosGroup/KTX-Software).");

const require = createRequire(import.meta.url);
const cli = join(dirname(require.resolve("@gltf-transform/cli")), "..", "bin", "cli.js");

for (const file of files) {
  const out = join(outDir, basename(file));
  console.log(`\n→ ${file}`);
  const res = spawnSync(
    process.execPath,
    [
      cli,
      "optimize",
      join(inDir, file),
      out,
      "--compress", useDraco ? "draco" : "meshopt",
      "--texture-compress", textureCompress,
      "--texture-size", textureSize,
      "--flatten", "false",
      "--join", "false",
      "--instance", "false",
      "--palette", "false",
      "--simplify", "false",
    ],
    { stdio: "inherit" },
  );
  if (res.status !== 0) process.exit(res.status ?? 1);
}
console.log("\n✔ Modelos optimizados en public/models/");
