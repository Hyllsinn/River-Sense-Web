import { MapPin } from "lucide-react";

import { FishActivity } from "./FishActivity";
import { Stations } from "./Stations";
import { Weather } from "./Weather";
import { demo } from "./snapshot";
import { PreviewPhone } from "./PreviewPhone";

export function MobilePreview() {
  const { place, river, bundle, thermal, weather } = demo;
  return (
    <PreviewPhone caption="Aperçu interactif">
      <div className="panel flex min-w-0 items-center gap-2 p-4 text-xs tracking-[0.25em] text-primary uppercase">
        <MapPin className="size-3.5 shrink-0" aria-hidden />
        <span>
          {place} · {river}
        </span>
      </div>
      <FishActivity bundle={bundle} />
      <Stations
        bundle={bundle}
        thermal={thermal}
        waterTemp={thermal.latestWaterTemperatureC?.toFixed(1).replace(".", ",") ?? null}
      />
      <Weather days={weather} />
    </PreviewPhone>
  );
}
