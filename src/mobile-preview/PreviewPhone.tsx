import { BatteryFull, Signal, Wifi } from "lucide-react";
import { useId, type ReactNode } from "react";
import "./styles.css";

export function PreviewPhone({ caption, children }: { caption: string; children: ReactNode }) {
  const captionId = useId();
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
            aria-labelledby={captionId}
            tabIndex={0}
          >
            {children}
          </div>
          <div className="mobile-demo-gesture" aria-hidden="true" />
        </div>
      </div>
      <figcaption id={captionId} className="mobile-demo-caption">
        {caption}
      </figcaption>
    </figure>
  );
}
