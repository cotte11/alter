import { FLAVORS } from "@/config/flavors";
import { FlavorCopy } from "./FlavorCopy";
import { SectionShell } from "./SectionShell";

export function Carnival3() {
  return (
    <SectionShell id="carnaval-3" align="left">
      <FlavorCopy flavor={FLAVORS[2]} index={3} note="De lata a botella; la tapa se desenrosca con el scroll. Texto placeholder." />
    </SectionShell>
  );
}
