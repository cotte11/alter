"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, type Group, type MeshStandardMaterial } from "three";
import type { Flavor } from "@/config/flavors";
import { channels } from "@/lib/scrollState";
import { BOTTLE_CAP_Y, BottlePlaceholderModel } from "./BottlePlaceholderModel";

const CAP_TURNS = 3; // vueltas completas de la tapa

interface Props {
  /** Sabor A y B (el cambio A→B lo controla el canal `labelBottle`). */
  flavors: [Flavor, Flavor];
  /** true = lee el estado del scroll; false = estático (línea completa). */
  animated?: boolean;
}

/** Comportamiento de la botella. Busca `cap` por nombre. */
export function Bottle({ flavors, animated = false }: Props) {
  const group = useRef<Group>(null);
  const bodyMat = useRef<MeshStandardMaterial>(null);
  const colors = useMemo(
    () => [new Color(flavors[0].palette.primary), new Color(flavors[1].palette.primary)],
    [flavors],
  );

  useFrame(() => {
    const unscrew = animated ? channels.unscrew : 0;
    const mix = animated ? channels.labelBottle : 1;
    const cap = group.current?.getObjectByName("cap");
    if (cap) {
      cap.rotation.y = unscrew * CAP_TURNS * Math.PI * 2;
      cap.position.y = BOTTLE_CAP_Y + unscrew * 0.12;
    }
    bodyMat.current?.color.copy(colors[0]).lerp(colors[1], mix);
  });

  return (
    <group ref={group} name="bottle">
      <BottlePlaceholderModel bodyMaterialRef={bodyMat} />
    </group>
  );
}
