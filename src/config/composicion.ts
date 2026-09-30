// Datos de "Composición" por formato. VALORES INVENTADOS (placeholder): reemplazar por los
// reales del cliente antes de publicar.
import type { Format } from "./flavors";

export interface Stat {
  value: number;
  unit: string;
  label: string;
}

export const COMPOSICION: Record<Format, { title: string; stats: Stat[]; legal: string }> = {
  can: {
    title: "Lata · 275 ml",
    stats: [
      { value: 80, unit: "mg", label: "de cafeína natural de granos de café verde" },
      { value: 0, unit: "g", label: "de azúcar. Endulzada con stevia y un toque de eritritol" },
      { value: 12, unit: "kcal", label: "por lata, entra en cualquier plan" },
      { value: 3, unit: "B", label: "vitaminas: B3, B6 y B12" },
    ],
    legal: "No apto para niños, embarazadas ni personas sensibles a la cafeína. Máximo dos latas por día.",
  },
  bottle: {
    title: "Botella · 500 ml",
    stats: [
      { value: 145, unit: "mg", label: "de cafeína natural de granos de café verde" },
      { value: 0, unit: "g", label: "de azúcar. Endulzada con stevia y un toque de eritritol" },
      { value: 22, unit: "kcal", label: "por botella, para aguantar todo el corso" },
      { value: 3, unit: "B", label: "vitaminas: B3, B6 y B12" },
    ],
    legal: "No apto para niños, embarazadas ni personas sensibles a la cafeína. Máximo una botella por día.",
  },
};
