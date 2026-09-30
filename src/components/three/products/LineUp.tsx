"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import { FLAVORS } from "@/config/flavors";
import { channels, runtime } from "@/lib/scrollState";
import { Can } from "./Can";
import { Bottle } from "./Bottle";
import { PRODUCT_SCALE } from "./scale";

// Alto real (m) de cada GLB → unidades de escena. Las botellas "guían": el resto se alinea a su base.
const CAN_HEIGHT = 0.1315 * PRODUCT_SCALE;
const BOTTLE_HEIGHT = 0.2224 * PRODUCT_SCALE;
const PRODUCT_WIDTH = 0.95; // diámetro aprox. en escena, para que quepan en su columna
const CAMERA_Z = 8; // ver SceneCanvas

const BOTTLE_SCREEN_HEIGHT = 0.5; // alto de la botella como fracción del alto visible
const BOTTOM_MARGIN = 0.2; // aire inferior (ahí va el CTA), fracción del alto visible
const HOVER_LIFT = 0.03; // cuánto se levanta el envase bajo el mouse (fracción del alto visible)

/**
 * Los 4 envases de frente, uno por columna (estilo "character select"), con la base alineada
 * al margen inferior. Las columnas coinciden con las del fondo (BackLayer). Bajo el mouse el
 * envase se levanta un poco (`runtime.hoverK`). Aparece con el canal `line`.
 */
export function LineUp() {
  const root = useRef<Group>(null);
  const items = useRef<(Group | null)[]>([]);
  const viewport = useThree((s) => s.viewport);

  useFrame(() => {
    const r = root.current;
    if (!r) return;
    const k = channels.line;
    r.visible = k > 0.001;
    if (!r.visible) return;

    const count = FLAVORS.length;
    const baseColW = viewport.width / count;
    // la botella no puede ser más ancha que su columna (mobile)
    const s = Math.min((viewport.height * BOTTLE_SCREEN_HEIGHT) / BOTTLE_HEIGHT, (baseColW * 0.8) / PRODUCT_WIDTH);
    const baseY = -viewport.height / 2 + viewport.height * BOTTOM_MARGIN;

    // aparece subiendo desde abajo
    r.position.y = (1 - k) * -viewport.height * 0.4;

    items.current.forEach((g, i) => {
      if (!g) return;
      const x = (i + 0.5) * baseColW - viewport.width / 2;
      const hk = runtime.hoverK[i] ?? 0;
      const scale = s * k;
      const h = FLAVORS[i].format === "bottle" ? BOTTLE_HEIGHT : CAN_HEIGHT;
      g.scale.setScalar(scale);
      g.position.set(x, baseY + (h * scale) / 2 + hk * viewport.height * HOVER_LIFT, 0);
      // de frente a la cámara aunque la columna esté a un costado (perspectiva)
      g.rotation.y = -Math.atan(x / CAMERA_Z);
    });
  });

  return (
    <group ref={root} visible={false}>
      {FLAVORS.map((f, i) => (
        <group
          key={f.id}
          ref={(el) => {
            items.current[i] = el;
          }}
        >
          {f.format === "can" ? <Can flavors={[f, f]} /> : <Bottle flavors={[f, f]} />}
        </group>
      ))}
    </group>
  );
}
