// Tiers de calidad. `low` = mobile / equipos modestos.

export type QualityTier = "high" | "low";

export interface QualitySettings {
  tier: QualityTier;
  dpr: [number, number];
  antialias: boolean;
  postprocessing: boolean;
  particleCount: number; // para cuando se implementen las partículas
  maxTextureSize: number; // texturas de etiqueta / GLB
  envResolution: number;
}

export const QUALITY: Record<QualityTier, QualitySettings> = {
  high: {
    tier: "high",
    dpr: [1, 2],
    antialias: true,
    postprocessing: true,
    particleCount: 1500,
    maxTextureSize: 2048,
    envResolution: 512,
  },
  low: {
    tier: "low",
    dpr: [1, 1.5],
    antialias: false,
    postprocessing: false,
    particleCount: 300,
    maxTextureSize: 1024,
    envResolution: 128,
  },
};

/** Heurística simple. Forzable con ?quality=low|high (útil para probar). */
export function detectQualityTier(): QualityTier {
  if (typeof window === "undefined") return "high";
  const forced = new URLSearchParams(window.location.search).get("quality");
  if (forced === "low" || forced === "high") return forced;

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const weak = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  return coarse || narrow || weak ? "low" : "high";
}
