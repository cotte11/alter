import type { Flavor } from "@/config/flavors";

/** Bloque de texto placeholder de un sabor/carnaval. */
export function FlavorCopy({ flavor, index, note }: { flavor: Flavor; index: number; note: string }) {
  return (
    <>
      <p className="text-sm uppercase tracking-[0.3em]" style={{ color: flavor.palette.accent }}>
        Carnaval {index} · {flavor.country}
      </p>
      <h2 className="mt-3 text-5xl font-black uppercase leading-none md:text-7xl" style={{ color: flavor.palette.primary }}>
        {flavor.name}
      </h2>
      <p className="mt-2 text-lg font-semibold">{flavor.carnival}</p>
      <p className="mt-4 text-white/70">
        {flavor.volumeMl} ml · {flavor.format === "can" ? "Lata" : "Botella"}. {note}
      </p>
    </>
  );
}
