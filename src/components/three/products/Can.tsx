"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, MeshStandardMaterial } from "three";
import type { Flavor } from "@/config/flavors";
import { channels } from "@/lib/scrollState";
import { useLabelTextures } from "../labelMaterial";
import { CAN_CENTER_OFFSET, CanModel } from "./CanModel";
import { FRONT_YAW, PRODUCT_SCALE } from "./scale";

interface Props {
  /** Sabor A y B (el cambio A→B lo controla el canal `labelCan`). */
  flavors: [Flavor, Flavor];
  /** true = lee el estado del scroll; false = estático (línea completa). */
  animated?: boolean;
}

/**
 * Comportamiento de la lata sobre el GLB real. Busca `ring`/`tab` por nombre, pero
 * el modelo todavía no las tiene: la apertura no anima nada hasta que existan esas
 * piezas (ver aviso en CanModel.tsx).
 */
export function Can({ flavors, animated = false }: Props) {
  const group = useRef<Group>(null);
  const overlayMat = useRef<MeshStandardMaterial>(null);
  const [mapA, mapB] = useLabelTextures(flavors[0].labelTexture, flavors[1].labelTexture);

  useFrame(() => {
    const open = animated ? channels.open : 0;
    // el cruce ocurre solo en el tramo medio del giro (la etiqueta pasa de espaldas)
    const mix = animated ? Math.min(1, Math.max(0, (channels.labelCan - 0.35) / 0.3)) : 1;
    const g = group.current;
    if (!g) return;
    g.rotation.y = FRONT_YAW.can;

    const ring = g.getObjectByName("ring");
    const tab = g.getObjectByName("tab");
    if (ring) ring.rotation.x = -open * 1.1; // la anilla se levanta
    if (tab) tab.rotation.x = open * 0.4; // la pestaña se hunde

    // Etiqueta A tapa a B con una malla levemente más grande; su opacidad baja a
    // medida que `mix` avanza hacia B. Placeholder hasta el shader dedicado.
    if (overlayMat.current) overlayMat.current.opacity = 1 - mix;
  });

  return (
    <group ref={group} name="can">
      <group scale={PRODUCT_SCALE} position={[0, CAN_CENTER_OFFSET, 0]}>
        <CanModel
          labelMaterial={<meshStandardMaterial map={mapB} metalness={0.3} roughness={0.45} />}
          labelOverlayMaterial={
            <meshStandardMaterial ref={overlayMat} map={mapA} metalness={0.3} roughness={0.45} transparent depthWrite={false} />
          }
        />
      </group>
    </group>
  );
}
