import type { ThreeElements } from "@react-three/fiber";

/**
 * Aluminio definido en código (los GLB no exportan materiales desde Cinema 4D).
 * `ALUMINIUM_PROPS` es la misma receta para uso imperativo (`new MeshStandardMaterial(...)`,
 * ver `CanModel`/`BottleModel`) donde no se puede usar el componente JSX.
 */
export const ALUMINIUM_PROPS = {
  color: "#d8dbe0",
  metalness: 0.85,
  roughness: 0.42,
  envMapIntensity: 1.2,
} as const;

export function AluminiumMaterial(props: ThreeElements["meshStandardMaterial"]) {
  return <meshStandardMaterial {...ALUMINIUM_PROPS} {...props} />;
}
