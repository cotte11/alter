"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#sabor-lucifer", label: "Sabores" },
  { href: "#composicion", label: "Composición" },
];

/**
 * Navbar fija, siempre visible sobre el Canvas. Desktop: links + CTA en línea.
 * Mobile: hamburguesa que abre un menú a pantalla completa. Los links son anclas a secciones.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 md:px-14 md:py-5">
      <a href="#hero" aria-label="ALTER — inicio" onClick={close} className="relative z-50">
        <Image src="/brand/alter-logo.svg" alt="ALTER" width={184} height={80} className="h-auto w-16 md:w-28" priority />
      </a>

      {/* Desktop */}
      <nav className="hidden items-center gap-10 md:flex">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="text-sm font-bold uppercase tracking-wider text-white">
            {l.label}
          </a>
        ))}
        <a href="#familia" className="rounded-md bg-[#ff7a00] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white">
          Ordenar
        </a>
      </nav>

      {/* Mobile: botón hamburguesa (se transforma en X) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls="menu-mobile"
        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[6px] md:hidden"
      >
        <span className={`h-[2px] w-6 bg-white transition-transform duration-300 ${open ? "translate-y-[8px] rotate-45" : ""}`} />
        <span className={`h-[2px] w-6 bg-white transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
        <span className={`h-[2px] w-6 bg-white transition-transform duration-300 ${open ? "-translate-y-[8px] -rotate-45" : ""}`} />
      </button>

      {/* Mobile: menú a pantalla completa */}
      <div
        id="menu-mobile"
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-black/95 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={close} tabIndex={open ? 0 : -1} className="font-display text-5xl uppercase text-white">
            {l.label}
          </a>
        ))}
        <a
          href="#familia"
          onClick={close}
          tabIndex={open ? 0 : -1}
          className="mt-4 rounded-md bg-[#ff7a00] px-10 py-4 text-base font-bold uppercase tracking-wide text-white"
        >
          Ordenar
        </a>
      </div>
    </header>
  );
}
