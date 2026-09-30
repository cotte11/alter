"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo, type ReactNode } from "react";
import { Mesh, MeshStandardMaterial } from "three";
import { ALUMINIUM_PROPS } from "../materials";

/** Pivote real de `botella_tapa` en el GLB (metros, antes de aplicar `PRODUCT_SCALE`). */
export const BOTTLE_CAP_Y = 0.1677;
/** Cuánto sube la tapa al destapar (proporcional al lift del placeholder: 0.12 / 2.46). */
export const BOTTLE_CAP_LIFT = 0.0109;
/**
 * El origen del GLB no está en el centro vertical real del envase (con tapa
 * incluida: de -0.0452 a 0.17721 m, centro real en 0.066 m). Este offset (en
 * unidades de escena, ya con `PRODUCT_SCALE` aplicado) baja la botella para que
 * su centro vertical quede en el origen del grupo — así, en LineUp, queda
 * centrada en el viewport igual que la lata en vez de sobresalir hacia arriba
 * (alinear por la base haría lo contrario: al ser más alta, se saldría por arriba).
 */
export const BOTTLE_CENTER_OFFSET = -0.8633;

interface Props {
  labelMaterial: ReactNode;
  labelOverlayMaterial?: ReactNode;
}

/**
 * GLB real de la botella (`assets-source/fbx/botella.fbx` convertido). Los nombres
 * de nodo no siguen el contrato `body`/`cap` de CLAUDE.md (vienen en español,
 * fragmentados: `botella_tapa`, `botella_tapa_estatico`, `botella_cuello_2`,
 * `botella_etiqueta`) — acá se renombra `botella_tapa` a `cap` para que `Bottle.tsx`
 * no tenga que cambiar. PENDIENTE: confirmar con quien modela — el pivote de la tapa
 * hoy queda cerca del centro de su alto, no en la base como pide el contrato, así
 * que el giro/subida no van a verse perfectos hasta corregirlo en Cinema 4D.
 */
export function BottleModel({ labelMaterial, labelOverlayMaterial }: Props) {
  const { scene } = useGLTF("/models/bottle.glb");

  const { root, labelMesh } = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      if (child.name === "botella_tapa") {
        child.name = "cap";
        child.material = new MeshStandardMaterial({ ...ALUMINIUM_PROPS, roughness: 0.22 });
      } else if (child.name === "botella_etiqueta") {
        child.visible = false; // se reemplaza por las dos mallas de abajo (crossfade)
      } else {
        child.material = new MeshStandardMaterial(ALUMINIUM_PROPS);
      }
    });

    const found = cloned.getObjectByName("botella_etiqueta");
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

useGLTF.preload("/models/bottle.glb");
