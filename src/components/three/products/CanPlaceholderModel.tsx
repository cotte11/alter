import { useMemo, type Ref } from "react";
import { LatheGeometry, TorusGeometry, CylinderGeometry, Vector2, type MeshStandardMaterial } from "three";
import { AluminiumMaterial } from "../materials";

/**
 * PLACEHOLDER de la lata 250 ml (slim). Se reemplaza por `useGLTF("/models/can.glb")`.
 * Contrato de nombres con el GLB real: `body`, `tab`, `ring` (hijos directos, con el
 * pivote de tab/ring en el remache). Unidades: alto total = 2.
 */
export const CAN_TOP_Y = 0.985; // altura de la tapa (donde está el remache)

export function CanPlaceholderModel({ bodyMaterialRef }: { bodyMaterialRef: Ref<MeshStandardMaterial> }) {
  const { body, tab, ring } = useMemo(() => {
    const R = 0.39;
    const profile = [
      [0, -1],
      [0.3, -1],
      [0.36, -0.96],
      [R, -0.9],
      [R, 0.86],
      [0.36, 0.94],
      [0.31, 0.98],
      [0.3, CAN_TOP_Y],
      [0, CAN_TOP_Y],
    ].map(([x, y]) => new Vector2(x, y));
    return {
      body: new LatheGeometry(profile, 48),
      // el origen de cada pieza móvil = su pivote (remache)
      tab: new CylinderGeometry(0.11, 0.11, 0.008, 24).scale(1, 1, 1.3).translate(0, 0.004, 0.13),
      ring: new TorusGeometry(0.09, 0.016, 8, 24).rotateX(Math.PI / 2).translate(0, 0.012, 0.13),
    };
  }, []);

  return (
    <>
      <mesh name="body" geometry={body}>
        <AluminiumMaterial ref={bodyMaterialRef} />
      </mesh>
      <mesh name="tab" geometry={tab} position={[0, CAN_TOP_Y, 0]}>
        <AluminiumMaterial />
      </mesh>
      <mesh name="ring" geometry={ring} position={[0, CAN_TOP_Y + 0.01, 0]}>
        <AluminiumMaterial roughness={0.2} />
      </mesh>
    </>
  );
}
