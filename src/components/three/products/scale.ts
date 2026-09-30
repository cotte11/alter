/**
 * Un único factor real→escena para lata y botella: convierte los metros reales
 * del GLB a unidades de escena UNA sola vez, así se preserva la proporción real
 * entre ambas (lata ≈13,15 cm, botella ≈22,24 cm → la lata queda ≈59% del alto
 * de la botella). Usar factores separados por objeto rompe esa proporción.
 *
 * 13.08 es un punto medio entre anclar a la botella (11.06, la lata quedaría
 * igual que antes) y anclar a la lata (15.1, la botella quedaría igual que
 * antes): agranda la botella ~18% y achica la lata ~13% respecto de como
 * estaban con los factores independientes.
 */
export const PRODUCT_SCALE = 13.08;

/**
 * Giro (rad) que hace falta para que la cara con el personaje y la marca mire a la cámara
 * cuando el envase tiene rotación 0. Objeto mutable a propósito (ajustable desde
 * `window.__alter.frontYaw` en dev).
 */
export const FRONT_YAW = { can: Math.PI / 2, bottle: -Math.PI / 2 - 0.35 };
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  const w = window as unknown as { __alter?: Record<string, unknown> };
  w.__alter = { ...(w.__alter ?? {}), frontYaw: FRONT_YAW };
}
