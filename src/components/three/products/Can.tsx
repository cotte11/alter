"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, type Group, type MeshStandardMaterial } from "three";
import type { Flavor } from "@/config/flavors";
import { channels } from "@/lib/scrollState";
import { CAN_TOP_Y, CanPlaceholderModel } from "./CanPlaceholderModel";

interface Props {
  /** Sabor A y B (el cambio A→B lo controla el canal `labelCan`). */
  flavors: [Flavor, Flavor];
  /** true = lee el estado del scroll; false = estático (línea completa). */
  animated?: boolean;
}

/**
 * Comportamiento de la lata. Busca las piezas por NOMBRE (`tab`, `ring`), así que
 * funciona igual con el placeholder o con el GLB real.
 */
export function Can({ flavors, animated = false }: Props) {
  const group = useRef<Group>(null);
  const bodyMat = useRef<MeshStandardMaterial>(null);
  const colors = useMemo(
    () => [new Color(flavors[0].palette.primary), new Color(flavors[1].palette.primary)],
    [flavors],
  );

  useFrame(() => {
    const open = animated ? channels.open : 0;
    const mix = animated ? channels.labelCan : 1;
    const g = group.current;
    if (!g) return;

    const ring = g.getObjectByName("ring");
    const tab = g.getObjectByName("tab");
    if (ring) ring.rotation.x = -open * 1.1; // la anilla se levanta
    if (tab) tab.rotation.x = open * 0.4; // la pestaña se hunde
    if (tab) tab.position.y = CAN_TOP_Y - open * 0.01;

    // Placeholder del cambio de etiqueta: mezcla de color (luego: shader).
    bodyMat.current?.color.copy(colors[0]).lerp(colors[1], mix);
  });

  return (
    <group ref={group} name="can">
      <CanPlaceholderModel bodyMaterialRef={bodyMat} />
    </group>
  );
}
