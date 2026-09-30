"use client";

import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Lightformer, Environment } from "@react-three/drei";
import { MathUtils, type MeshStandardMaterial } from "three";
import { CanPlaceholderModel } from "@/components/three/products/CanPlaceholderModel";
import { AluminiumMaterial } from "@/components/three/materials";
import { Slider } from "./Slider";
import { ConceptNote } from "./ConceptNote";

const DEFAULTS = { px: 0, py: 0, pz: 0, rx: 0, ry: 0, rz: 0, scale: 1 };

/**
 * Estación 1: mover a mano posición / rotación / escala de un mesh, y ver
 * en vivo qué representa cada eje. A diferencia del sitio real (que anima
 * el envase leyendo `channels` en un `useFrame`, ver docs del proyecto),
 * acá los sliders escriben directo en estado de React: es más lento a alta
 * frecuencia, pero más fácil de leer cuando recién estás aprendiendo qué
 * hace cada número.
 */
export function TransformStation() {
  const [t, setT] = useState(DEFAULTS);
  const bodyMat = useRef<MeshStandardMaterial>(null);

  const set = (key: keyof typeof t) => (value: number) => setT((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="relative h-[65svh] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 lg:h-[70svh]">
        <Canvas camera={{ position: [0, 0, 5], fov: 35 }} dpr={[1, 2]}>
          <color attach="background" args={["#0b0b10"]} />
          <ambientLight intensity={0.35} />
          <directionalLight position={[3, 4, 5]} intensity={1.1} />
          {/* Mismo entorno procedural que usa el sitio real, para que el aluminio se vea creíble. */}
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={4} position={[0, 5, -4]} scale={[12, 3, 1]} />
            <Lightformer form="ring" intensity={2} position={[0, -3, 4]} scale={6} />
          </Environment>

          {/* Ejes: X = rojo, Y = verde, Z = azul. La grilla marca el plano X-Z. */}
          <axesHelper args={[2.2]} />
          <gridHelper args={[6, 12, "#4a4a58", "#22222a"]} position={[0, -1.05, 0]} />

          <group position={[t.px, t.py, t.pz]} rotation={[t.rx, t.ry, t.rz]} scale={t.scale}>
            <CanPlaceholderModel bodyMaterial={<AluminiumMaterial ref={bodyMat} />} />
          </group>

          <OrbitControls enableDamping dampingFactor={0.08} minDistance={2.5} maxDistance={10} />
        </Canvas>
        <p className="pointer-events-none absolute bottom-3 left-3 text-xs text-foreground/40">
          Arrastrá con el mouse para orbitar la cámara alrededor del objeto.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <ConceptNote title="Coordenadas 3D">
          Cada objeto tiene una posición (x, y, z), una rotación por eje (en radianes) y una escala. El eje{" "}
          <span className="text-red-400">X rojo</span> va a la derecha, el <span className="text-green-400">Y verde</span>{" "}
          hacia arriba, el <span className="text-blue-400">Z azul</span> hacia la cámara.
        </ConceptNote>
        <ConceptNote title="Mesh = geometría + material">
          Cada pieza de la lata (<code>body</code>, <code>tab</code>, <code>ring</code> en{" "}
          <code>CanPlaceholderModel.tsx</code>) es un <code>&lt;mesh&gt;</code>: una <code>geometry</code> (la forma,
          los vértices) más un <code>material</code> (cómo reacciona a la luz — acá el aluminio definido en{" "}
          <code>materials.tsx</code>).
        </ConceptNote>
        <ConceptNote title="Cámara">
          El <code>OrbitControls</code> de drei no mueve el objeto: mueve la <em>cámara</em> alrededor de un punto. La
          cámara es un objeto más de la escena, con su propia posición y su campo de visión (<code>fov</code>).
        </ConceptNote>

        <div className="flex flex-col gap-3 rounded-lg border border-white/10 p-3">
          <p className="text-xs font-medium tracking-wide text-foreground/50 uppercase">Posición</p>
          <Slider label="X" value={t.px} min={-2} max={2} step={0.05} onChange={set("px")} />
          <Slider label="Y" value={t.py} min={-2} max={2} step={0.05} onChange={set("py")} />
          <Slider label="Z" value={t.pz} min={-2} max={2} step={0.05} onChange={set("pz")} />

          <p className="mt-2 text-xs font-medium tracking-wide text-foreground/50 uppercase">Rotación</p>
          <Slider
            label="X"
            value={MathUtils.radToDeg(t.rx)}
            min={-180}
            max={180}
            step={1}
            unit="°"
            onChange={(v) => set("rx")(MathUtils.degToRad(v))}
          />
          <Slider
            label="Y"
            value={MathUtils.radToDeg(t.ry)}
            min={-180}
            max={180}
            step={1}
            unit="°"
            onChange={(v) => set("ry")(MathUtils.degToRad(v))}
          />
          <Slider
            label="Z"
            value={MathUtils.radToDeg(t.rz)}
            min={-180}
            max={180}
            step={1}
            unit="°"
            onChange={(v) => set("rz")(MathUtils.degToRad(v))}
          />

          <p className="mt-2 text-xs font-medium tracking-wide text-foreground/50 uppercase">Escala</p>
          <Slider label="Uniforme" value={t.scale} min={0.3} max={2.2} step={0.05} unit="x" onChange={set("scale")} />

          <button
            type="button"
            onClick={() => setT(DEFAULTS)}
            className="mt-2 self-start rounded-md border border-white/15 px-3 py-1.5 text-xs text-foreground/70 hover:bg-white/5"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
