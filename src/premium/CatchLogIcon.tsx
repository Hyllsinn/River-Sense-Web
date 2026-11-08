import { useId } from "react";

const cameraBody =
  "M5 13h5l2-4h8l2 4h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V15a2 2 0 0 1 2-2Z";

/** A single emblem: the tilted camera hides the notebook's rear contours. */
export function CatchLogIcon({ className }: { className?: string }) {
  const maskId = useId();

  return (
    <svg
      viewBox="0 0 48 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask id={maskId} x="0" y="0" width="48" height="40" maskUnits="userSpaceOnUse">
          <rect width="48" height="40" fill="white" stroke="none" />
          <path d={cameraBody} transform="rotate(-14 17 21)" fill="black" stroke="black" />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <g transform="rotate(14 33 20)">
          <rect x="24" y="6" width="18" height="28" rx="2.5" />
          <path d="M38 7v26M28 13h6M28 18h6M28 23h6M41 12h3M41 20h3M41 28h3" />
        </g>
      </g>
      <g transform="rotate(-14 17 21)">
        <path d={cameraBody} />
        <circle cx="17" cy="23" r="6" />
        <path d="M15 12h2" />
        <circle cx="8" cy="18" r="0.8" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
