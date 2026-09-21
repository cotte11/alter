"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { FLAVORS } from "@/config/flavors";
import { channels, runtime } from "@/lib/scrollState";
import { Can } from "./Can";
import { Bottle } from "./Bottle";

const SPACING = 1.7;

/** Los 4 envases juntos (sección "Línea completa"). Aparece con el canal `line`. */
export function LineUp({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<Group>(null);
  const items = useRef<(Group | null)[]>([]);
  const viewportWidth = useThree((s) => s.viewport.width);

  useFrame((_, dt) => {
    const r = root.current;
    if (!r) return;
    r.visible = channels.line > 0.001;
    // se ajusta al ancho visible (en mobile los envases se achican)
    const fit = Math.min(1, viewportWidth / (SPACING * 4.2));
    r.scale.setScalar(channels.line * fit);
    r.position.y = channels.py;

    if (!reducedMotion) runtime.lineSpin += dt * 0.5;
    items.current.forEach((g, i) => g && (g.rotation.y = runtime.lineSpin + i * 0.8));
  });

  return (
    <group ref={root} visible={false}>
      {FLAVORS.map((f, i) => (
        <group
          key={f.id}
          ref={(el) => {
            items.current[i] = el;
          }}
          position={[(i - 1.5) * SPACING, 0, 0]}
        >
          {f.format === "can" ? <Can flavors={[f, f]} /> : <Bottle flavors={[f, f]} />}
        </group>
      ))}
    </group>
  );
}
