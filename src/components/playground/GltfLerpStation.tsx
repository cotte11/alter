"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Color, MathUtils, type Mesh, type MeshStandardMaterial, type Object3D } from "three";
import { Slider } from "./Slider";
import { ConceptNote } from "./ConceptNote";

const MODEL_URL = "/models/playground-can.glb";
useGLTF.preload(MODEL_URL);

// Los mismos valores que usa Can.tsx real (ver src/components/three/products/Can.tsx):
// ring.rotation.x = -open * 1.1, tab.rotation.x = open * 0.4.
const RING_OPEN_X = -1.1;
const TAB_OPEN_X = 0.4;

interface Node {
  name: string;
  type: string;
  depth: number;
}

function listNodes(root: Object3D): Node[] {
  const out: Node[] = [];
  const walk = (obj: Object3D, depth: number) => {
    out.push({ name: obj.name || "(sin nombre)", type: obj.type, depth });
    obj.children.forEach((c) => walk(c, depth + 1));
  };
  walk(root, 0);
  return out;
}

function LoadedCan({ mixRef, selected }: { mixRef: RefObject<number>; selected: string | null }) {
  const { scene } = useGLTF(MODEL_URL);

  // Un ref, no un useMemo: acá adentro los vamos a MUTAR cada frame (rotación,
  // color), y un ref es la forma correcta de guardar algo mutable fuera de React.
  const partsRef = useRef<{ body?: Mesh; tab?: Mesh; ring?: Mesh }>({});
  useEffect(() => {
    partsRef.current = {
      body: scene.getObjectByName("body") as Mesh | undefined,
      tab: scene.getObjectByName("tab") as Mesh | undefined,
      ring: scene.getObjectByName("ring") as Mesh | undefined,
    };
  }, [scene]);
  const colorA = useMemo(() => new Color("#d8dbe0"), []);
  const colorB = useMemo(() => new Color("#ff5da2"), []);

  useFrame(() => {
    const mix = mixRef.current;
    const parts = partsRef.current;
    if (parts.ring) parts.ring.rotation.x = MathUtils.lerp(0, RING_OPEN_X, mix);
    if (parts.tab) parts.tab.rotation.x = MathUtils.lerp(0, TAB_OPEN_X, mix);
    const bodyMat = parts.body?.material as MeshStandardMaterial | undefined;
    bodyMat?.color.copy(colorA).lerp(colorB, mix);

    // Inspector: resalta SOLO la pieza seleccionada por nombre. Mismo método
    // que usa Can.tsx (scene.getObjectByName), acá disparado por un click.
    for (const [name, obj] of Object.entries(parts)) {
      const mat = obj?.material as MeshStandardMaterial | undefined;
      if (!mat) continue;
      mat.emissive.set(name === selected ? "#22d3ee" : "#000000");
      mat.emissiveIntensity = name === selected ? 0.7 : 0;
    }
  });

  return <primitive object={scene} />;
}

/** Estación 4: cargar un .glb real con useGLTF, leer su estructura, e interpolar entre dos poses a mano. */
export function GltfLerpStation() {
  const [selected, setSelected] = useState<string | null>(null);
  const [mix, setMix] = useState(0);
  const mixRef = useRef(mix);
  useEffect(() => {
    mixRef.current = mix;
  }, [mix]);

  const { scene } = useGLTF(MODEL_URL);
  const nodes = useMemo(() => listNodes(scene), [scene]);
  const knownParts = ["body", "tab", "ring"];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="relative h-[65svh] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 lg:h-[70svh]">
        <Canvas camera={{ position: [0, 0, 4.5], fov: 35 }} dpr={[1, 2]}>
          <color attach="background" args={["#0b0b10"]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 4, 5]} intensity={1.1} />
          <Suspense fallback={null}>
            <LoadedCan mixRef={mixRef} selected={selected} />
          </Suspense>
          <OrbitControls enableDamping dampingFactor={0.08} minDistance={2} maxDistance={10} />
        </Canvas>
      </div>

      <div className="flex flex-col gap-4">
        <ConceptNote title="useGLTF carga el árbol tal cual viene del GLB">
          <code>useGLTF(&quot;{MODEL_URL}&quot;)</code> devuelve una <code>scene</code>: el mismo grafo de objetos
          que armó quien exportó el archivo (acá, un script; en el sitio real, Cinema 4D). Este .glb de práctica
          respeta el mismo contrato que <code>can.glb</code>: hijos <code>body</code>, <code>tab</code>,{" "}
          <code>ring</code>.
        </ConceptNote>
        <ConceptNote title="getObjectByName, en vivo">
          Tocá un nombre de la lista y se resalta en la escena — es exactamente{" "}
          <code>scene.getObjectByName(nombre)</code>, el mismo método que usa <code>Can.tsx</code> para encontrar{" "}
          <code>tab</code>/<code>ring</code> sin importar si el modelo es el placeholder o el GLB real.
        </ConceptNote>
        <ConceptNote title="Interpolar es lo que hace channels">
          El slider de abajo mezcla dos poses (cerrada → abierta) con <code>MathUtils.lerp</code> y{" "}
          <code>Color.lerp</code>, a mano, en un <code>useFrame</code>. Es la misma idea que <code>channels.open</code>
          /<code>channels.labelCan</code> en el sitio real — ahí el número lo escribe GSAP con el scroll; acá lo
          escribís vos con el slider.
        </ConceptNote>

        <div className="flex flex-col gap-2 rounded-lg border border-white/10 p-3">
          <p className="text-xs font-medium tracking-wide text-foreground/50 uppercase">Estructura del GLB</p>
          <ul className="flex flex-col gap-0.5 font-mono text-sm">
            {nodes.map((n, i) => (
              <li key={i} style={{ paddingLeft: `${n.depth * 14}px` }}>
                <button
                  type="button"
                  disabled={!knownParts.includes(n.name)}
                  onClick={() => setSelected((prev) => (prev === n.name ? null : n.name))}
                  className={`rounded px-1.5 py-0.5 text-left transition-colors ${
                    selected === n.name
                      ? "bg-cyan-400/20 text-cyan-300"
                      : knownParts.includes(n.name)
                        ? "text-foreground/70 hover:bg-white/10"
                        : "text-foreground/30"
                  }`}
                >
                  {n.name} <span className="text-foreground/30">· {n.type}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-white/10 p-3">
          <p className="text-xs font-medium tracking-wide text-foreground/50 uppercase">Interpolar poses</p>
          <Slider label="Cerrada → abierta" value={mix} min={0} max={1} step={0.01} onChange={setMix} />
        </div>
      </div>
    </div>
  );
}
