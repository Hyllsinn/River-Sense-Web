import { MapPin } from "lucide-react";

import { FishActivity } from "./FishActivity";
import { Stations } from "./Stations";
import { Weather } from "./Weather";
import { demo } from "./snapshot";
import "./styles.css";

export function MobilePreview() {
  const { place, river, bundle, thermal, weather } = demo;
  return (
    <figure className="mobile-demo-frame">
      <figcaption id="river-demo-caption" className="mobile-demo-caption">
        Aperçu interactif · Données fictives et figées
      </figcaption>
      <div
        className="mobile-demo mobile-demo-scroll"
        role="region"
        aria-labelledby="river-demo-caption"
        tabIndex={0}
      >
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
      </div>
    </figure>
  );
}
