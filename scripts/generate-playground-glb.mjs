// Genera un GLB de práctica para la Estación 4 del playground: un objeto con
// la MISMA convención de nombres/pivotes que can.glb (ver CLAUDE.md) —
// "body", "tab", "ring", con tab/ring pivotando en el remache — pero armado
// en código, no en Cinema 4D, para no depender de tener el modelo real.
// Uso: node scripts/generate-playground-glb.mjs

import { Scene, Group, Mesh, CylinderGeometry, BoxGeometry, TorusGeometry, MeshStandardMaterial } from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// GLTFExporter (pensado para navegador) usa FileReader para el modo binario.
// Node no lo tiene: un polyfill mínimo sobre Blob.arrayBuffer() alcanza.
if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        this.onloadend?.();
      });
    }
  };
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../public/models/playground-can.glb");

const root = new Group();
root.name = "can";

const body = new Mesh(
  new CylinderGeometry(0.4, 0.4, 2, 32),
  new MeshStandardMaterial({ color: "#d8dbe0", metalness: 1, roughness: 0.3 }),
);
body.name = "body";

// Mismo truco que CanPlaceholderModel.tsx: la geometría se traslada, el mesh
// se queda "parado" en el pivote (el remache) para que rotar el objeto sea
// rotar alrededor de ese punto, no del centro de su propia forma.
const tabGeometry = new BoxGeometry(0.22, 0.02, 0.5).translate(0, 0, 0.22);
const tab = new Mesh(tabGeometry, new MeshStandardMaterial({ color: "#c9cdd3", metalness: 1, roughness: 0.35 }));
tab.name = "tab";
tab.position.set(0, 1, 0);

const ringGeometry = new TorusGeometry(0.16, 0.03, 8, 24).rotateX(Math.PI / 2).translate(0, 0, 0.22);
const ring = new Mesh(ringGeometry, new MeshStandardMaterial({ color: "#eef0f2", metalness: 1, roughness: 0.2 }));
ring.name = "ring";
ring.position.set(0, 1.02, 0);

root.add(body, tab, ring);

const scene = new Scene();
scene.add(root);

const exporter = new GLTFExporter();
const arrayBuffer = await exporter.parseAsync(scene, { binary: true });

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, Buffer.from(arrayBuffer));
console.log("GLB de práctica generado en", path.relative(process.cwd(), OUT));
