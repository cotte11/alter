"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo, type ReactNode } from "react";
import { Mesh, MeshStandardMaterial } from "three";
import { ALUMINIUM_PROPS } from "../materials";

/**
 * El origen del GLB casi coincide con el centro vertical real de la lata (de
 * -0.0605 a 0.0710 m, centro real en 0.00525 m) — el ajuste acá es chico, pero
 * se aplica por consistencia con `BOTTLE_CENTER_OFFSET` (ver BottleModel.tsx).
 */
export const CAN_CENTER_OFFSET = -0.0687;

interface Props {
  labelMaterial: ReactNode;
  labelOverlayMaterial?: ReactNode;
}

/**
 * GLB real de la lata (`assets-source/fbx/lata.fbx` convertido). Los nombres de
 * nodo no siguen el contrato `body`/`tab`/`ring` de CLAUDE.md (vienen en español,
 * fragmentados: `cuerpo_etiqueta`, `cuello_de_lata*`, `Loft_2`) y el modelo TODAVÍA
 * NO TIENE la anilla ni la pestaña — la animación de apertura (`Can.tsx`) queda sin
 * nada que mover hasta que se modele esa pieza.
 */
export function CanModel({ labelMaterial, labelOverlayMaterial }: Props) {
  const { scene } = useGLTF("/models/can.glb");

  const { root, labelMesh } = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      if (child.name === "cuerpo_etiqueta") {
        child.visible = false; // se reemplaza por las dos mallas de abajo (crossfade)
      } else {
        child.material = new MeshStandardMaterial(ALUMINIUM_PROPS);
      }
    });

    const found = cloned.getObjectByName("cuerpo_etiqueta");
    return { root: cloned, labelMesh: found instanceof Mesh ? found : null };
  }, [scene]);

  return (
    <>
      <primitive object={root} />
      {labelMesh && (
        <mesh
          geometry={labelMesh.geometry}
          position={[labelMesh.position.x, labelMesh.position.y, labelMesh.position.z]}
          rotation={[labelMesh.rotation.x, labelMesh.rotation.y, labelMesh.rotation.z]}
        >
          {labelMaterial}
        </mesh>
      )}
      {labelMesh && labelOverlayMaterial && (
        <mesh
          geometry={labelMesh.geometry}
          position={[labelMesh.position.x, labelMesh.position.y, labelMesh.position.z]}
          rotation={[labelMesh.rotation.x, labelMesh.rotation.y, labelMesh.rotation.z]}
          scale={1.004}
        >
          {labelOverlayMaterial}
        </mesh>
      )}
    </>
  );
}

useGLTF.preload("/models/can.glb");
