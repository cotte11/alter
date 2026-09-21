import { BASE_CHANNELS, type Channels } from "@/config/poses";

/**
 * Estado mutable compartido entre ScrollTrigger (escribe) y la escena 3D
 * (lee en useFrame). Vive fuera de React a propósito: evita re-renders.
 */
export const channels: Channels = { ...BASE_CHANNELS };

/** Valores que la escena acumula por frame (no los toca el scroll). */
export const runtime = { spin: 0, lineSpin: 0 };

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") (window as unknown as { __alter: unknown }).__alter = { channels, runtime };
