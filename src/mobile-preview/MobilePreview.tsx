import { BatteryFull, MapPin, Signal, Wifi } from "lucide-react";

import { FishActivity } from "./FishActivity";
import { Stations } from "./Stations";
import { Weather } from "./Weather";
import { demo } from "./snapshot";
import "./styles.css";

export function MobilePreview() {
  const { place, river, bundle, thermal, weather } = demo;
  return (
    <figure className="mobile-demo-frame">
      <div className="mobile-demo-phone">
        <div className="mobile-demo-screen">
          <div className="mobile-demo-status" aria-hidden="true">
            <span>9:41</span>
            <span className="mobile-demo-camera" />
            <span className="mobile-demo-status-icons">
              <Signal size={12} />
              <Wifi size={12} />
              <BatteryFull size={16} />
            </span>
          </div>
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
          <div className="mobile-demo-gesture" aria-hidden="true" />
        </div>
      </div>
      <figcaption id="river-demo-caption" className="mobile-demo-caption">
        Aperçu interactif
      </figcaption>
    </figure>
  );
}
