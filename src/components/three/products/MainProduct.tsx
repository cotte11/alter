"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { flavorsByFormat } from "@/config/flavors";
import { channels, runtime } from "@/lib/scrollState";
import { Can } from "./Can";
import { Bottle } from "./Bottle";

const [canA, canB] = flavorsByFormat("can");
const [bottleA, bottleB] = flavorsByFormat("bottle");

/** El envase protagonista: aplica la pose del scroll y alterna lata ↔ botella. */
export function MainProduct({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<Group>(null);
  const can = useRef<Group>(null);
  const bottle = useRef<Group>(null);

  useFrame((_, dt) => {
    const c = channels;
    const r = root.current;
    if (!r || !can.current || !bottle.current) return;

    if (!reducedMotion) runtime.spin += c.spin * Math.min(dt, 0.05);

    r.position.set(c.px, c.py, c.pz);
    r.rotation.order = "XZY"; // tilt por fuera, giro sobre el eje propio
    r.rotation.set(c.rx, c.ry + runtime.spin, c.rz);

    const alone = 1 - c.line;
    const canK = Math.max(0, (1 - c.bottle) * alone);
    const bottleK = Math.max(0, c.bottle * alone);
    can.current.visible = canK > 0.001;
    bottle.current.visible = bottleK > 0.001;
    can.current.scale.setScalar(c.scale * canK);
    bottle.current.scale.setScalar(c.scale * bottleK);
    // Transición de formato (placeholder): la lata sube y sale, la botella entra desde abajo.
    can.current.position.y = c.bottle * 1.5;
    bottle.current.position.y = (1 - c.bottle) * -1.5;
  });

  return (
    <group ref={root}>
      <group ref={can}>
        <Can flavors={[canA, canB]} animated />
      </group>
      <group ref={bottle}>
        <Bottle flavors={[bottleA, bottleB]} animated />
      </group>
    </group>
  );
}
