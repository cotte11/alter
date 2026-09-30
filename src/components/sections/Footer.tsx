export function Footer() {
  return (
    <footer className="relative bg-[#0b0b10] px-6 py-12 text-xs text-white/50 md:px-16">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/alter-logo.svg" alt="ALTER" className="h-auto w-28" />
      <p className="mt-4 max-w-2xl">[Legales por completar: consumo responsable, contenido de cafeína, restricciones de edad, etc.]</p>
      <p className="mt-6">© {new Date().getFullYear()} ALTER. Todos los derechos reservados.</p>
    </footer>
  );
}
