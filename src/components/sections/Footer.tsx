export function Footer() {
  return (
    <footer className="relative bg-[#0b0b10] px-6 py-12 text-xs text-white/50 md:px-16">
      <p className="text-lg font-black uppercase tracking-[0.2em] text-white">ALTER</p>
      <p className="mt-4 max-w-2xl">[Legales por completar: consumo responsable, contenido de cafeína, restricciones de edad, etc.]</p>
      <p className="mt-6">© {new Date().getFullYear()} ALTER. Todos los derechos reservados.</p>
    </footer>
  );
}
