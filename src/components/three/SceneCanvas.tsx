"use client";

import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, NoToneMapping } from "three";
import { useQualityTier } from "@/hooks/useQualityTier";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Scene } from "./Scene";

/** Único Canvas de la web, fijo detrás del contenido. Solo se monta en cliente. */
export default function SceneCanvas() {
  const quality = useQualityTier();
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={quality.dpr}
        camera={{ position: [0, 0, 8], fov: 35 }}
        gl={{
          antialias: quality.antialias,
          powerPreference: "high-performance",
          // con postprocesado el tone mapping lo hace el efecto ToneMapping
          toneMapping: quality.postprocessing ? NoToneMapping : ACESFilmicToneMapping,
        }}
      >
        <Scene quality={quality} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
