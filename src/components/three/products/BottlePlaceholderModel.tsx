import { useMemo, type ReactNode } from "react";
import { LatheGeometry, CylinderGeometry, Vector2 } from "three";
import { AluminiumMaterial } from "../materials";

/**
 * PLACEHOLDER de la botella 500 ml. Se reemplaza por `useGLTF("/models/bottle.glb")`.
 * Contrato de nombres con el GLB real: `body`, `cap` (hijos directos; el pivote de
 * `cap` en el centro de su base). Unidades: alto total ≈ 2.66.
 */
export const BOTTLE_CAP_Y = 1.16; // base de la tapa

interface Props {
  bodyMaterial: ReactNode;
  /** Malla extra, levemente más grande, para el crossfade de etiqueta (ver Bottle.tsx). */
  bodyOverlayMaterial?: ReactNode;
}

export function BottlePlaceholderModel({ bodyMaterial, bodyOverlayMaterial }: Props) {
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
        {bodyMaterial}
      </mesh>
      {bodyOverlayMaterial && (
        <mesh geometry={body} scale={1.004}>
          {bodyOverlayMaterial}
        </mesh>
      )}
      <mesh name="cap" geometry={cap} position={[0, BOTTLE_CAP_Y, 0]}>
        <AluminiumMaterial roughness={0.22} />
      </mesh>
    </>
  );
}
