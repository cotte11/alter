import { FLAVORS } from "@/config/flavors";
import { FlavorCopy } from "./FlavorCopy";
import { SectionShell } from "./SectionShell";

export function Carnival2() {
  return (
    <SectionShell id="carnaval-2" align="right">
      <FlavorCopy flavor={FLAVORS[1]} index={2} note="La etiqueta cambia de sabor con el scroll. Texto placeholder." />
    </SectionShell>
  );
}
