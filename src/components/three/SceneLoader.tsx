"use client";

import dynamic from "next/dynamic";

// El Canvas no se renderiza en servidor.
const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

export function SceneLoader() {
  return <SceneCanvas />;
}
