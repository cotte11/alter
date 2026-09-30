import Link from "next/link";
import { getStation, type StationId } from "@/config/playgroundStations";

interface Props {
  stationId: StationId;
  children: React.ReactNode;
}

/** Encabezado común a toda estación: volver, número/título, descripción. */
export function StationShell({ stationId, children }: Props) {
  const station = getStation(stationId);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 md:px-10">
      <Link href="/playground" className="text-sm text-foreground/50 hover:text-foreground">
        ← Volver al playground
      </Link>
      <h1 className="mt-2 text-2xl font-semibold md:text-3xl">
        {station.order}. {station.title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-foreground/60 md:text-base">{station.description}</p>

      <div className="mt-10">{children}</div>
    </main>
  );
}
