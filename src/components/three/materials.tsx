import type { ThreeElements } from "@react-three/fiber";

/**
 * Aluminio definido en código (los GLB no exportan materiales desde Cinema 4D).
 * Al integrar los GLB reales, aplicar estos mismos valores a los materiales
 * de `body`, `tab`, `ring` y `cap`.
 */
export function AluminiumMaterial(props: ThreeElements["meshStandardMaterial"]) {
  return <meshStandardMaterial color="#d8dbe0" metalness={1} roughness={0.28} envMapIntensity={1.2} {...props} />;
}
