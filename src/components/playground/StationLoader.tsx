"use client";

import dynamic from "next/dynamic";
import type { StationId } from "@/config/playgroundStations";

const loading = () => (
  <p className="flex h-[40svh] items-center justify-center text-sm text-foreground/50">Cargando escena…</p>
);

// Un dynamic() estático por estación (ssr:false: R3F necesita WebGL, no existe
// en el servidor). Se declaran todos acá para que el code-splitting de
// Next siga funcionando: cada estación pesa lo suyo y solo se descarga la
// que realmente se visita.
const STATIONS = {
  transformar: dynamic(() => import("./TransformStation").then((m) => m.TransformStation), { ssr: false, loading }),
  luces: dynamic(() => import("./LightingStation").then((m) => m.LightingStation), { ssr: false, loading }),
  jerarquias: dynamic(() => import("./HierarchyStation").then((m) => m.HierarchyStation), { ssr: false, loading }),
  "cargar-glb": dynamic(() => import("./GltfLerpStation").then((m) => m.GltfLerpStation), { ssr: false, loading }),
} satisfies Record<StationId, ReturnType<typeof dynamic>>;

export function StationLoader({ station }: { station: StationId }) {
  const Station = STATIONS[station];
  return <Station />;
}
