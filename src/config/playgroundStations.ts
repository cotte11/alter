// Config de las estaciones del playground (ver src/components/playground/).
// Un solo lugar para el título/descripción de cada una: lo usan la home
// (tarjetas) y el shell de cada estación (encabezado), igual que poses.ts
// centraliza la coreografía del sitio real.

export type StationId = "transformar" | "luces" | "jerarquias" | "cargar-glb";

export interface StationConfig {
  id: StationId;
  order: number;
  title: string;
  /** Una línea, para la tarjeta de la home. */
  tagline: string;
  /** Párrafo corto, para el encabezado de la estación. */
  description: string;
}

export const STATIONS: StationConfig[] = [
  {
    id: "transformar",
    order: 1,
    title: "Transformar el objeto",
    tagline: "Posición, rotación, escala — y la cámara que los mira.",
    description:
      "Mové a mano la posición, rotación y escala de la lata placeholder, y orbitá la cámara alrededor. La base: coordenadas 3D y mesh = geometría + material.",
  },
  {
    id: "luces",
    order: 2,
    title: "Luces, Environment y useFrame",
    tagline: "Ambient, directional, presets de Environment y un giro continuo.",
    description:
      "Compará luz ambiental vs. direccional, probá presets de Environment de drei contra el procedural del sitio real, y hacé girar el objeto con useFrame.",
  },
  {
    id: "jerarquias",
    order: 3,
    title: "Jerarquías y pivotes",
    tagline: "Un brazo con hombro, codo y muñeca: grupos anidados.",
    description:
      "Un group es un pivote: todo lo que cuelga de él rota alrededor de SU origen. Armá un brazo con grupos anidados y vas a entender por qué tab/ring/cap en los GLB reales necesitan el pivote en el lugar correcto.",
  },
  {
    id: "cargar-glb",
    order: 4,
    title: "Cargar un GLB + interpolar entre poses",
    tagline: "useGLTF, inspeccionar la escena, y el mismo truco que usa channels.",
    description:
      "Cargá un .glb de práctica (misma convención de nombres que can.glb: body/tab/ring), inspeccioná su estructura con getObjectByName, y mezclá dos poses a mano con lerp — lo que hace GSAP con channels, pero a la vista.",
  },
];

export const getStation = (id: StationId): StationConfig => {
  const station = STATIONS.find((s) => s.id === id);
  if (!station) throw new Error(`Estación de playground desconocida: ${id}`);
  return station;
};
