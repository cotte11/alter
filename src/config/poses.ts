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
  // estados del envase
  open: number; // 0 cerrada → 1 anilla abierta (lata)
  unscrew: number; // 0 tapa puesta → 1 tapa desenroscada (botella)
  labelCan: number; // 0 sabor A (Lucifer) → 1 sabor B (Supay)
  labelBottle: number; // 0 sabor A (Pujllay) → 1 sabor B (Marimonda)
  // qué se muestra
  bottle: number; // 0 lata → 1 botella
  line: number; // 0 envase único → 1 los 4 envases juntos, de frente (LineUp, cierre)
  // fondo y overlays
  bg: number; // índice continuo en BACKGROUND_STOPS (0 negro, 1..4 sabores, 5 cierre)
  heroText: number; // opacidad de la frase "Tu mejor versión" (capa detrás del envase)
  composicion: number; // 0..1: en "Composición" el switch lata/botella manda sobre `bottle`
};

export const BASE_CHANNELS: Channels = {
  px: 0,
  py: 0,
  pz: 0,
  rx: 0,
  ry: 0,
  rz: 0,
  scale: 1,
  open: 0,
  unscrew: 0,
  labelCan: 0,
  labelBottle: 0,
  bottle: 0,
  line: 0,
  bg: 0,
  heroText: 0,
  composicion: 0,
};

export type SectionId =
  | "hero"
  | "sabor-lucifer"
  | "sabor-supay"
  | "sabor-pujllay"
  | "sabor-marimonda"
  | "composicion"
  | "familia";

export interface SectionConfig {
  id: SectionId;
  /** Alto de la sección en svh. Sin valor = alto según contenido. */
  heightVh?: number;
  pose: Partial<Channels>;
  during?: Partial<Channels>;
  /** Overrides para viewport < 768px. */
  mobile?: { pose?: Partial<Channels>; during?: Partial<Channels> };
}

/**
 * Colores de fondo por índice del canal `bg` (se interpolan entre vecinos). Los sabores
 * usan su `palette.secondary` (ver flavors.ts); el orden debe coincidir con SECTIONS.
 */
export const BACKGROUND_STOPS = ["#000000", "#00542a", "#8a060e", "#1c6690", "#a67c00", "#0b0b10"];

const TURN = Math.PI * 2;
// Cada sabor suma una vuelta completa sobre su eje (siempre múltiplo de 2π: el envase llega de frente).
// El vaivén de izquierda a derecha NO está acá: lo aplica MainProduct (ver runtime.sway*).
const MOBILE_PRODUCT = { px: 0, py: 0.8, scale: 1.15 };
const MOBILE_BOTTLE = { px: 0, py: 0.8, scale: 0.85 };

// Lado del envase: derecha (px +), el texto va a la izquierda, y viceversa.
const CAN_RIGHT = { px: 1.7, rx: 0.05, rz: -0.06, scale: 1.4 };
const CAN_LEFT = { px: -1.7, rx: 0.05, rz: 0.06, scale: 1.4 };
const BOTTLE_RIGHT = { px: 1.7, rx: 0.05, rz: -0.06, scale: 1.3, bottle: 1 };
const BOTTLE_LEFT = { px: -1.7, rx: 0.05, rz: 0.06, scale: 1.3, bottle: 1 };

export const SECTIONS: SectionConfig[] = [
  {
    id: "hero",
    heightVh: 100,
    pose: { py: -0.1, rx: 0.1, rz: -0.25, scale: 1.5, bg: 0, heroText: 1 },
    mobile: { pose: { py: -0.2, scale: 1.2 } },
  },
  {
    id: "sabor-lucifer",
    heightVh: 150,
    pose: { ...CAN_RIGHT, ry: TURN, bg: 1 },
    mobile: { pose: MOBILE_PRODUCT },
  },
  {
    id: "sabor-supay",
    heightVh: 150,
    pose: { ...CAN_LEFT, ry: 2 * TURN, labelCan: 1, bg: 2 },
    mobile: { pose: MOBILE_PRODUCT },
  },
  {
    id: "sabor-pujllay",
    heightVh: 150,
    pose: { ...BOTTLE_RIGHT, ry: 3 * TURN, labelCan: 1, bg: 3 },
    mobile: { pose: MOBILE_BOTTLE },
  },
  {
    id: "sabor-marimonda",
    heightVh: 150,
    pose: { ...BOTTLE_LEFT, ry: 4 * TURN, labelCan: 1, labelBottle: 1, bg: 4 },
    mobile: { pose: MOBILE_BOTTLE },
  },
  {
    // Se queda con el último envase mostrado (Marimonda); el switch de formato lo maneja
    // `runtime.compFormat` (ver Composicion.tsx) mezclado por el canal `composicion`.
    id: "composicion",
    heightVh: 110,
    pose: { ...BOTTLE_LEFT, ry: 4 * TURN, labelCan: 1, labelBottle: 1, bg: 4, composicion: 1 },
    mobile: { pose: { ...MOBILE_BOTTLE, py: 1.4, scale: 0.45 } },
  },
  {
    id: "familia",
    pose: { py: 0, scale: 1, bottle: 1, labelCan: 1, labelBottle: 1, line: 1, bg: 5 },
    mobile: { pose: { py: 0.8, scale: 0.8 } },
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
