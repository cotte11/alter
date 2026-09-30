import type { Flavor } from "@/config/flavors";
import { FORMAT_TAGLINE } from "@/config/flavors";

/** Bloque de texto de un personaje/sabor en la sección "Sabores". */
export function PersonajeCopy({ flavor }: { flavor: Flavor }) {
  return (
    <>
      <p className="text-sm uppercase tracking-[0.3em]" style={{ color: flavor.palette.accent }}>
        {flavor.traits.join(" · ")}
      </p>
      <h2
        className="mt-3 font-display drop-shadow-[0_4px_0_rgba(0,0,0,0.35)] text-6xl uppercase leading-none md:text-8xl"
        style={{ color: "#fff" }}
      >
        {flavor.name}
      </h2>
      <p className="mt-2 text-lg font-semibold">{flavor.carnival}</p>
      <p className="mt-4 text-white/70">{flavor.description}</p>
      <p className="mt-4 text-sm text-white/50">
        {flavor.volumeMl} ml · {flavor.format === "can" ? "Lata" : "Botella"}. {FORMAT_TAGLINE[flavor.format]}
      </p>
      <p className="mt-6 text-xl font-semibold uppercase tracking-wide">{flavor.ctaLine}</p>
    </>
  );
}
