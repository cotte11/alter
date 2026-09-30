import { BASE_CHANNELS, type Channels } from "@/config/poses";

/**
 * Estado mutable compartido entre ScrollTrigger (escribe) y la escena 3D
 * (lee en useFrame). Vive fuera de React a propósito: evita re-renders.
 */
export const channels: Channels = { ...BASE_CHANNELS };

/** Valores que la escena acumula por frame (no los toca el scroll). `compFormat`: formato elegido en Composición (0 lata, 1 botella). */
export const runtime = {
  /** Vaivén del envase: tiempo desde que la sección quedó fija, y amplitud suavizada (0 = de frente). */
  swayT: 0,
  swayAmp: 0,
  /** true mientras el envase está "asentado" en una sección (lo maneja useScrollChoreography). */
  swayOn: true,
  compFormat: 1,
  /** Pantalla final: columna bajo el mouse (-1 ninguna) y "calor" suavizado de hover de cada columna (0..1). */
  hover: -1,
  hoverK: [0, 0, 0, 0] as number[],
};

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  const w = window as unknown as { __alter?: Record<string, unknown> };
  w.__alter = { ...(w.__alter ?? {}), channels, runtime };
}
