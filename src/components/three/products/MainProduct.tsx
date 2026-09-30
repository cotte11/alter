"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { flavorsByFormat } from "@/config/flavors";
import { channels, runtime } from "@/lib/scrollState";
import { Can } from "./Can";
import { Bottle } from "./Bottle";

const SWAY_ANGLE = 0.5; // rad (~29°) hacia cada lado
const SWAY_PERIOD = 7; // s por ciclo completo (derecha → centro → izquierda → centro)

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

    // Vaivén lento: sale de frente, va a un lado, vuelve al centro, va al otro y vuelve (un seno).
    // La amplitud se apaga mientras el scroll mueve al envase, así siempre llega de frente.
    const step = Math.min(dt, 0.05);
    if (!reducedMotion && runtime.swayOn) runtime.swayT += step;
    const ampTarget = runtime.swayOn && !reducedMotion ? 1 : 0;
    runtime.swayAmp += (ampTarget - runtime.swayAmp) * Math.min(1, step * (ampTarget ? 1.5 : 8));
    const sway = runtime.swayAmp * SWAY_ANGLE * Math.sin((runtime.swayT / SWAY_PERIOD) * Math.PI * 2);

    r.position.set(c.px, c.py, c.pz);
    r.rotation.order = "XZY"; // tilt por fuera, giro sobre el eje propio
    r.rotation.set(c.rx, c.ry + sway, c.rz);

    // En "Composición" el switch lata/botella (runtime.compFormat) manda sobre el scroll.
    const bottleMix = c.bottle + (runtime.compFormat - c.bottle) * c.composicion;
    const alone = 1 - c.line;
    const canK = Math.max(0, (1 - bottleMix) * alone);
    const bottleK = Math.max(0, bottleMix * alone);
    can.current.visible = canK > 0.001;
    bottle.current.visible = bottleK > 0.001;
    can.current.scale.setScalar(c.scale * canK);
    bottle.current.scale.setScalar(c.scale * bottleK);
    // Transición de formato (placeholder): la lata sube y sale, la botella entra desde abajo.
    can.current.position.y = bottleMix * 1.5;
    bottle.current.position.y = (1 - bottleMix) * -1.5;
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
