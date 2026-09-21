// Datos de los 4 sabores. Todo es PLACEHOLDER: completar nombres, carnavales,
// paletas y texturas cuando estén definidos.

export type Format = "can" | "bottle";

export interface FlavorPalette {
  primary: string; // color dominante de la etiqueta
  secondary: string;
  accent: string;
}

export interface Flavor {
  id: string;
  name: string;
  carnival: string;
  country: string;
  format: Format;
  volumeMl: number;
  palette: FlavorPalette;
  /** Ruta pública de la textura de etiqueta (aún no existe el archivo). */
  labelTexture: string;
}

export const FLAVORS: Flavor[] = [
  {
    id: "sabor-1",
    name: "Sabor 1",
    carnival: "Carnaval por definir",
    country: "País por definir",
    format: "can",
    volumeMl: 250,
    palette: { primary: "#ff2d95", secondary: "#ffd400", accent: "#00e5ff" },
    labelTexture: "/textures/labels/sabor-1.webp",
  },
  {
    id: "sabor-2",
    name: "Sabor 2",
    carnival: "Carnaval por definir",
    country: "País por definir",
    format: "can",
    volumeMl: 250,
    palette: { primary: "#00c98d", secondary: "#ff8a00", accent: "#fff275" },
    labelTexture: "/textures/labels/sabor-2.webp",
  },
  {
    id: "sabor-3",
    name: "Sabor 3",
    carnival: "Carnaval por definir",
    country: "País por definir",
    format: "bottle",
    volumeMl: 500,
    palette: { primary: "#ff6a00", secondary: "#7a1fff", accent: "#ffe14d" },
    labelTexture: "/textures/labels/sabor-3.webp",
  },
  {
    id: "sabor-4",
    name: "Sabor 4",
    carnival: "Carnaval por definir",
    country: "País por definir",
    format: "bottle",
    volumeMl: 500,
    palette: { primary: "#7a3cff", secondary: "#ff3d5a", accent: "#4dfff0" },
    labelTexture: "/textures/labels/sabor-4.webp",
  },
];

export const flavorsByFormat = (format: Format) =>
  FLAVORS.filter((f) => f.format === format);
