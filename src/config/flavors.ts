// Los 4 sabores/personajes de ALTER. Datos confirmados por el cliente (ver GUION.md,
// CLAUDE2.md). El orden [lucifer, supay, pujllay, marimonda] es intencional: determina qué
// sabor cae en `labelCan`/`labelBottle` 0/1 en `poses.ts` (ver comentario ahí).

export type Format = "can" | "bottle";

export interface FlavorPalette {
  primary: string; // color dominante de la etiqueta
  secondary: string;
  accent: string;
}

export interface Flavor {
  id: string;
  /** Nombre del personaje de carnaval (no el sabor real de la bebida). */
  name: string;
  /** Sabor real de la bebida. */
  taste: string;
  /** "[Carnaval a definir]" para los que el cliente todavía no confirmó, ver GUION.md. */
  carnival: string;
  country: string;
  format: Format;
  volumeMl: number;
  palette: FlavorPalette;
  /** Ruta pública de la textura de etiqueta (archivo aún no existe). */
  labelTexture: string;
  /** Ruta pública del personaje recortado en PNG con alfa (archivo aún no existe). */
  characterImage: string;
  /**
   * Ilustración de fondo de la sección Personajes (ver GUION.md, "fondo por variable
   * CSS"). Opcional: solo existe para los sabores ya entregados por el cliente; el
   * resto usa el tinte de color de `palette.primary` como placeholder (ver Personajes.tsx).
   */
  backgroundImage?: string;
  /**
   * Opacidad (0..1) del fondo en la escena 3D (ver PersonajeBackdropPlane.tsx).
   * Default 0.28 si no se especifica. Cada ilustración tiene su propio brillo
   * general (una pieza oscura como la de Supay se ve bien más fuerte que una
   * saturada/luminosa como la de Marimonda a la MISMA opacidad), así que es por
   * sabor en vez de una constante global.
   */
  backgroundOpacity?: number;
  traits: string[];
  description: string;
  /** Línea de cierre tipo "Esta noche soy X." */
  ctaLine: string;
}

export const FORMAT_TAGLINE: Record<Format, string> = {
  can: "Para la previa.",
  bottle: "Para aguantar todo el corso.",
};

export const FLAVORS: Flavor[] = [
  {
    id: "lucifer",
    name: "Lucifer",
    taste: "Manzana",
    carnival: "Carnaval de Oruro, Bolivia",
    country: "Bolivia",
    format: "can",
    volumeMl: 275,
    palette: { primary: "#009544", secondary: "#00542a", accent: "#7be89a" },
    labelTexture: "/textures/lucifer.png",
    characterImage: "/characters/lucifer.png",
    traits: ["liderazgo", "desafío"],
    description: "El que encabeza la diablada. No sigue a nadie: los demás lo siguen a él.",
    ctaLine: "Esta noche soy Lucifer.",
  },
  {
    id: "supay",
    name: "Supay",
    taste: "Frutilla",
    carnival: "Diablada Pillareña, Ecuador",
    country: "Ecuador",
    format: "can",
    volumeMl: 275,
    palette: { primary: "#e20917", secondary: "#8a060e", accent: "#ff7d84" },
    labelTexture: "/textures/supay.png",
    characterImage: "/characters/supay.png",
    backgroundImage: "/backgrounds/supay.png",
    traits: ["intensidad", "lo prohibido", "el lado oscuro"],
    description:
      "El diablo de los Andes. El dueño de lo que pasa bajo tierra y de lo que no te animás a decir.",
    ctaLine: "Esta noche soy Supay.",
  },
  {
    id: "pujllay",
    name: "Pujllay",
    taste: "Arándano",
    carnival: "Carnaval de Humahuaca, Jujuy, Argentina",
    country: "Argentina",
    format: "bottle",
    volumeMl: 500,
    palette: { primary: "#33a5de", secondary: "#1c6690", accent: "#a9e2ff" },
    labelTexture: "/textures/pujllay.png",
    characterImage: "/characters/pujllay.png",
    traits: ["juego", "celebración", "energía sin cortes"],
    description: "Pujllay es jugar. Espuelas, sombrero de cuernos y ganas de que la fiesta no termine.",
    ctaLine: "Esta noche soy Pujllay.",
  },
  {
    id: "marimonda",
    name: "Marimonda",
    taste: "Limón",
    carnival: "Carnaval de Barranquilla, Colombia",
    country: "Colombia",
    format: "bottle",
    volumeMl: 500,
    palette: { primary: "#fcc000", secondary: "#a67c00", accent: "#ffe89a" },
    labelTexture: "/textures/marimonda.png",
    characterImage: "/characters/marimonda.png",
    backgroundImage: "/backgrounds/marimonda.png",
    backgroundOpacity: 0.08,
    traits: ["irreverencia", "burla"],
    description:
      "Nació para burlarse de los que se toman demasiado en serio. Trompa larga, corbata y cero vergüenza.",
    ctaLine: "Esta noche soy Marimonda.",
  },
];

export const flavorsByFormat = (format: Format) => FLAVORS.filter((f) => f.format === format);
export const flavorById = (id: string) => FLAVORS.find((f) => f.id === id);
