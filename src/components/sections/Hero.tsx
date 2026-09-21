import { SectionShell } from "./SectionShell";

export function Hero() {
  return (
    <SectionShell id="hero" align="center">
      <div className="flex h-[calc(100svh-6rem)] flex-col items-center justify-between py-10 md:h-svh md:py-14">
        <h1 className="text-6xl font-black uppercase tracking-[0.2em] md:text-8xl">ALTER</h1>
        <p className="animate-pulse text-sm uppercase tracking-[0.3em] text-white/70">Scrolleá para descubrir ↓</p>
      </div>
    </SectionShell>
  );
}
