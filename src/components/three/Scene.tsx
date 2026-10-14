"use client";

import { Suspense, useEffect } from "react";
import { markSceneReady } from "@/lib/loadState";
import { Environment, Lightformer } from "@react-three/drei";
import { Bloom, EffectComposer, ToneMapping } from "@react-three/postprocessing";
import type { QualitySettings } from "@/config/quality";
import { MainProduct } from "./products/MainProduct";
import { LineUp } from "./products/LineUp";

function SceneReady() {
  useEffect(() => {
    // un frame más para que la primera pasada de render ya esté en pantalla
    const id = requestAnimationFrame(() => markSceneReady());
    return () => cancelAnimationFrame(id);
  }, []);
  return null;
}

export function Scene({ quality, reducedMotion }: { quality: QualitySettings; reducedMotion: boolean }) {
  return (
    <>
      {/* Sin fondo propio: el color y la frase del hero viven en <BackLayer> (detrás del Canvas). */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />

      {/* Entorno procedural (sin descargas). Cambiar por un HDRI de public/hdri más adelante. */}
      <Environment resolution={quality.envResolution} frames={1}>
        <Lightformer form="rect" intensity={4} position={[0, 5, -4]} scale={[12, 3, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[-6, 1, 2]} scale={[2, 8, 1]} color="#ff9ad5" />
        <Lightformer form="rect" intensity={2.5} position={[6, 1, 2]} scale={[2, 8, 1]} color="#8fe9ff" />
        <Lightformer form="ring" intensity={2} position={[0, -3, 4]} scale={6} />
      </Environment>

      {/* Suspense: `useTexture` (etiquetas, fondos) suspende mientras cargan las texturas. */}
      <Suspense fallback={null}>
        <MainProduct reducedMotion={reducedMotion} />
        <LineUp />
        {/* Monta recién cuando todo lo anterior terminó de cargar: apaga la pantalla de carga. */}
        <SceneReady />
      </Suspense>

      {quality.postprocessing && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.35} luminanceThreshold={0.9} mipmapBlur />
          <ToneMapping />
        </EffectComposer>
      )}
    </>
  );
}
