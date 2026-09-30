import { StationShell } from "@/components/playground/StationShell";
import { StationLoader } from "@/components/playground/StationLoader";

export default function Page() {
  return (
    <StationShell stationId="jerarquias">
      <StationLoader station="jerarquias" />
    </StationShell>
  );
}
