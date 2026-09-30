import { SectionShell } from "./SectionShell";

// Hero: lata de Lucifer rotando sola. La frase "Tu mejor versión" NO está acá: vive en
// <BackLayer> (capa detrás del Canvas) para que la lata pase por delante de las letras.
export function Hero() {
  return (
    <SectionShell id="hero" align="center">
      <h1 className="sr-only">ALTER — Tu mejor versión</h1>
      <p className="animate-pulse text-xs uppercase tracking-[0.3em] text-white/70 md:translate-y-[38svh]">
        Scrolleá para descubrir ↓
      </p>
    </SectionShell>
  );
}
