// Poses y estados del envase por sección. Es el ÚNICO lugar que hay que tocar
// para ajustar la coreografía: la lógica (useScrollChoreography) solo lee esto.
//
// Cómo funciona:
//  - `pose`: estado al llegar a la sección. Al entrar (la sección sube desde
//    abajo del viewport hasta su tope) se interpola desde el estado FINAL de la
//    sección anterior hasta `pose`.
//  - `during`: canales que cambian mientras la sección está "fija" en pantalla
//    (abrir anilla, desenroscar tapa, cambiar sabor...). Estado final = pose + during.
//  - Los canales no indicados toman el valor de BASE_CHANNELS (no heredan de la
//    sección anterior: cada pose es explícita).

export type Channels = {
  // transformación del envase (unidades de mundo / radianes)
  px: number;
  py: number;
  pz: number;
  rx: number;
  ry: number;
  rz: number;
  scale: number;
  spin: number; // velocidad de giro continuo sobre su eje (rad/s)
  // estados del envase
  open: number; // 0 cerrada → 1 anilla abierta (lata)
  unscrew: number; // 0 tapa puesta → 1 tapa desenroscada (botella)
  labelCan: number; // 0 sabor A → 1 sabor B (latas)
  labelBottle: number; // 0 sabor A → 1 sabor B (botellas)
  // qué se muestra
  bottle: number; // 0 lata → 1 botella
  line: number; // 0 envase único → 1 los 4 envases juntos
};

export const BASE_CHANNELS: Channels = {
  px: 0,
  py: 0,
  pz: 0,
  rx: 0,
  ry: 0,
  rz: 0,
  scale: 1,
  spin: 0,
  open: 0,
  unscrew: 0,
  labelCan: 0,
  labelBottle: 0,
  bottle: 0,
  line: 0,
};

export type SectionId =
  | "hero"
  | "carnaval-1"
  | "carnaval-2"
  | "carnaval-3"
  | "carnaval-4"
  | "linea";

export interface SectionConfig {
  id: SectionId;
  /** Alto de la sección en svh. Sin valor = alto según contenido. */
  heightVh?: number;
  pose: Partial<Channels>;
  during?: Partial<Channels>;
  /** Overrides para viewport < 768px. */
  mobile?: { pose?: Partial<Channels>; during?: Partial<Channels> };
}

const MOBILE_PRODUCT = { px: 0, py: 0.9, scale: 0.85 };

export const SECTIONS: SectionConfig[] = [
  {
    id: "hero",
    heightVh: 100,
    pose: { rx: 0.12, rz: 0.08, scale: 1.3, spin: 0.8 },
    mobile: { pose: { scale: 1 } },
  },
  {
    id: "carnaval-1",
    heightVh: 250,
    pose: { px: 1.7, py: -0.1, rx: 0.1, ry: -0.6, rz: 0.15, scale: 1.5, spin: 0.35 },
    during: { open: 1 },
    mobile: { pose: MOBILE_PRODUCT },
  },
  {
    id: "carnaval-2",
    heightVh: 250,
    pose: { px: -1.7, rx: 0.1, ry: 0.5, rz: -0.15, scale: 1.5, spin: 0.35, open: 1 },
    during: { labelCan: 1 },
    mobile: { pose: MOBILE_PRODUCT },
  },
  {
    id: "carnaval-3",
    heightVh: 300,
    pose: { px: 1.7, rx: 0.08, ry: -0.5, rz: 0.1, scale: 1.3, spin: 0.3, bottle: 1, labelCan: 1 },
    during: { unscrew: 1 },
    mobile: { pose: { ...MOBILE_PRODUCT, scale: 0.75 } },
  },
  {
    id: "carnaval-4",
    heightVh: 250,
    pose: { px: -1.7, rx: 0.08, ry: 0.5, rz: -0.1, scale: 1.3, spin: 0.3, bottle: 1, labelCan: 1 },
    during: { labelBottle: 1 },
    mobile: { pose: { ...MOBILE_PRODUCT, scale: 0.75 } },
  },
  {
    id: "linea",
    pose: { py: -0.3, scale: 1, bottle: 1, labelCan: 1, labelBottle: 1, line: 1 },
    mobile: { pose: { py: 1.2 } },
  },
];

export const resolvePose = (s: SectionConfig, mobile: boolean): Channels => ({
  ...BASE_CHANNELS,
  ...s.pose,
  ...(mobile ? s.mobile?.pose : undefined),
});

/** Estado al terminar la sección (pose + during). */
export const resolveEnd = (s: SectionConfig, mobile: boolean): Channels => ({
  ...resolvePose(s, mobile),
  ...s.during,
  ...(mobile ? s.mobile?.during : undefined),
});
