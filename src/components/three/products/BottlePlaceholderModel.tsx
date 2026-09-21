import { useMemo, type Ref } from "react";
import { LatheGeometry, CylinderGeometry, Vector2, type MeshStandardMaterial } from "three";
import { AluminiumMaterial } from "../materials";

/**
 * PLACEHOLDER de la botella 500 ml. Se reemplaza por `useGLTF("/models/bottle.glb")`.
 * Contrato de nombres con el GLB real: `body`, `cap` (hijos directos; el pivote de
 * `cap` en el centro de su base). Unidades: alto total ≈ 2.66.
 */
export const BOTTLE_CAP_Y = 1.16; // base de la tapa

export function BottlePlaceholderModel({ bodyMaterialRef }: { bodyMaterialRef: Ref<MeshStandardMaterial> }) {
  const { body, cap } = useMemo(() => {
    const profile = [
      [0, -1.3],
      [0.34, -1.3],
      [0.4, -1.25],
      [0.42, -1.15],
      [0.42, 0.35],
      [0.4, 0.6],
      [0.3, 0.8],
      [0.2, 0.95],
      [0.17, 1.05],
      [0.17, BOTTLE_CAP_Y],
      [0, BOTTLE_CAP_Y],
    ].map(([x, y]) => new Vector2(x, y));
    return {
      body: new LatheGeometry(profile, 48),
      cap: new CylinderGeometry(0.2, 0.2, 0.2, 32).translate(0, 0.1, 0),
    };
  }, []);

  return (
    <>
      <mesh name="body" geometry={body}>
        <AluminiumMaterial ref={bodyMaterialRef} />
      </mesh>
      <mesh name="cap" geometry={cap} position={[0, BOTTLE_CAP_Y, 0]}>
        <AluminiumMaterial roughness={0.22} />
      </mesh>
    </>
  );
}
