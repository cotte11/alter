"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, MeshStandardMaterial } from "three";
import type { Flavor } from "@/config/flavors";
import { channels } from "@/lib/scrollState";
import { useLabelTextures } from "../labelMaterial";
import { BOTTLE_CAP_LIFT, BOTTLE_CAP_Y, BOTTLE_CENTER_OFFSET, BottleModel } from "./BottleModel";
import { FRONT_YAW, PRODUCT_SCALE } from "./scale";

const CAP_TURNS = 3; // vueltas completas de la tapa

interface Props {
  /** Sabor A y B (el cambio A→B lo controla el canal `labelBottle`). */
  flavors: [Flavor, Flavor];
  /** true = lee el estado del scroll; false = estático (línea completa). */
  animated?: boolean;
}

/** Comportamiento de la botella sobre el GLB real. Busca `cap` por nombre (ver BottleModel.tsx). */
export function Bottle({ flavors, animated = false }: Props) {
  const group = useRef<Group>(null);
  const overlayMat = useRef<MeshStandardMaterial>(null);
  const [mapA, mapB] = useLabelTextures(flavors[0].labelTexture, flavors[1].labelTexture);

  useFrame(() => {
    const unscrew = animated ? channels.unscrew : 0;
    // el cruce ocurre solo en el tramo medio del giro (la etiqueta pasa de espaldas)
    const mix = animated ? Math.min(1, Math.max(0, (channels.labelBottle - 0.35) / 0.3)) : 1;
    if (group.current) group.current.rotation.y = FRONT_YAW.bottle;
    const cap = group.current?.getObjectByName("cap");
    if (cap) {
      cap.rotation.y = unscrew * CAP_TURNS * Math.PI * 2;
      cap.position.y = BOTTLE_CAP_Y + unscrew * BOTTLE_CAP_LIFT;
    }

    if (overlayMat.current) overlayMat.current.opacity = 1 - mix;
  });

  return (
    <group ref={group} name="bottle">
      <group scale={PRODUCT_SCALE} position={[0, BOTTLE_CENTER_OFFSET, 0]}>
        <BottleModel
          labelMaterial={<meshStandardMaterial map={mapB} metalness={0.3} roughness={0.45} />}
          labelOverlayMaterial={
            <meshStandardMaterial ref={overlayMat} map={mapA} metalness={0.3} roughness={0.45} transparent depthWrite={false} />
          }
        />
      </group>
    </group>
  );
}
