"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer } from "@react-three/drei";
import type { Group, MeshStandardMaterial } from "three";
import { CanPlaceholderModel } from "@/components/three/products/CanPlaceholderModel";
import { AluminiumMaterial } from "@/components/three/materials";
import { Slider } from "./Slider";
import { ConceptNote } from "./ConceptNote";

const PRESETS = [
  "procedural",
  "sunset",
  "dawn",
  "night",
  "warehouse",
  "forest",
  "apartment",
  "studio",
  "city",
  "park",
  "lobby",
] as const;
type Preset = (typeof PRESETS)[number];

/** Grupo que gira solo, leyendo la velocidad de un ref (no de React state) en cada frame. */
function SpinningCan({ spinning, speedRef }: { spinning: boolean; speedRef: RefObject<number> }) {
  const group = useRef<Group>(null);
  const bodyMat = useRef<MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (!spinning || !group.current) return;
    // Igual que `runtime.spin` en el sitio real (src/lib/scrollState.ts): se acumula
    // frame a frame por fuera de React, así no hay un setState 60 veces por segundo.
    group.current.rotation.y += speedRef.current * delta;
  });

  return (
    <group ref={group}>
      <CanPlaceholderModel bodyMaterial={<AluminiumMaterial ref={bodyMat} />} />
    </group>
  );
}

/** Estación 2: luces, Environment de drei y el loop de render (`useFrame`). */
export function LightingStation() {
  const [ambient, setAmbient] = useState(0.35);
  const [directional, setDirectional] = useState(1.1);
  const [preset, setPreset] = useState<Preset>("procedural");
  const [spinning, setSpinning] = useState(true);
  const [speed, setSpeed] = useState(0.6);
  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Cargar un HDRI real (RGBLoader + PMREM) es mucho más pesado para la GPU que
  // el procedural: en GPUs/drivers limitados puede perder el contexto de WebGL.
  // Lo detectamos y avisamos en vez de dejar el canvas roto en silencio.
  const [contextLost, setContextLost] = useState(false);
  const onCanvasCreated = useCallback(({ gl }: { gl: { domElement: HTMLCanvasElement } }) => {
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      setContextLost(true);
    });
    canvas.addEventListener("webglcontextrestored", () => setContextLost(false));
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="relative h-[65svh] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 lg:h-[70svh]">
        <Canvas camera={{ position: [0, 0, 5], fov: 35 }} dpr={[1, 2]} onCreated={onCanvasCreated}>
          <color attach="background" args={["#0b0b10"]} />
          <ambientLight intensity={ambient} />
          <directionalLight position={[3, 4, 5]} intensity={directional} />

          {preset === "procedural" ? (
            // El mismo truco que usa el sitio real: paneles de luz generados por código
            // (Lightformer) en vez de descargar una imagen HDRI de 360°.
            <Environment resolution={256} frames={1}>
              <Lightformer form="rect" intensity={4} position={[0, 5, -4]} scale={[12, 3, 1]} />
              <Lightformer form="rect" intensity={2.5} position={[-6, 1, 2]} scale={[2, 8, 1]} color="#ff9ad5" />
              <Lightformer form="rect" intensity={2.5} position={[6, 1, 2]} scale={[2, 8, 1]} color="#8fe9ff" />
            </Environment>
          ) : (
            // Los presets de drei son fotos 360° (HDRI) reales, se descargan de un CDN.
            <Environment preset={preset} />
          )}

          <SpinningCan spinning={spinning} speedRef={speedRef} />
          <OrbitControls enableDamping dampingFactor={0.08} minDistance={2.5} maxDistance={10} />
        </Canvas>

        {contextLost && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 p-6 text-center">
            <p className="max-w-xs text-sm text-foreground/80">
              Se perdió el contexto de WebGL. Suele pasar con presets de Environment reales (HDRI) en GPUs o drivers
              limitados — por eso el sitio real usa el procedural.
            </p>
            <button
              type="button"
              onClick={() => {
                setPreset("procedural");
                window.location.reload();
              }}
              className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-foreground/80 hover:bg-white/10"
            >
              Recargar y volver a procedural
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <ConceptNote title="Luces">
          <code>ambientLight</code> ilumina parejo, sin dirección ni sombra. <code>directionalLight</code> simula el
          sol: tiene dirección pero no se atenúa con la distancia. Subí/bajá las intensidades y mirá cómo cambia el
          brillo del aluminio.
        </ConceptNote>
        <ConceptNote title="Environment (drei)">
          Además de las luces, las superficies metálicas necesitan algo para <em>reflejar</em>. <code>Environment</code>{" "}
          genera ese reflejo a partir de una imagen 360°: puede ser un preset real (HDRI descargado) o, como en el
          sitio, paneles de luz por código (opción &quot;procedural&quot;) para no depender de una descarga.
          <br />
          <br />
          Un HDRI real pide bastante más trabajo a la GPU (decodificar la imagen + generar el mapa prefiltrado,{" "}
          <code>PMREMGenerator</code>) que los paneles de código. En equipos con GPU/driver limitado eso puede
          perder el contexto de WebGL — es, en chico, la misma razón por la que el sitio real no usa presets
          descargados.
        </ConceptNote>
        <ConceptNote title="El loop de render (useFrame)">
          <code>useFrame</code> corre una función en cada frame (~60 veces por segundo), antes de pintar. Ahí es
          donde se anima algo por tiempo —como este giro— sin usar <code>setState</code> de React en cada frame.
        </ConceptNote>

        <div className="flex flex-col gap-3 rounded-lg border border-white/10 p-3">
          <Slider label="Ambient" value={ambient} min={0} max={2} step={0.05} onChange={setAmbient} />
          <Slider label="Directional" value={directional} min={0} max={3} step={0.05} onChange={setDirectional} />

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-foreground/60">Environment</span>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as Preset)}
              className="rounded-md border border-white/15 bg-black/30 px-2 py-1.5 text-foreground"
            >
              {PRESETS.map((p) => (
                <option key={p} value={p}>
                  {p === "procedural" ? "procedural (el del sitio)" : p}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-2 flex items-center gap-2 text-sm text-foreground/70">
            <input type="checkbox" checked={spinning} onChange={(e) => setSpinning(e.target.checked)} />
            Girar con useFrame
          </label>
          <Slider
            label="Velocidad"
            value={speed}
            min={0}
            max={3}
            step={0.1}
            unit=" rad/s"
            onChange={setSpeed}
          />
        </div>
      </div>
    </div>
  );
}
