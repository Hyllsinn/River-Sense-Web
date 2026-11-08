export type Point = {
  time: string;
  value: number;
  qualification?: number | null;
  method?: number | null;
  sourceStatus?: number | null;
};
export type HydroPart = {
  station: string;
  last: Point;
  daily: Record<string, Point>;
  points: Point[];
  start: string;
  end: string;
  relative?: {
    value: number;
    p25: number;
    p75: number;
    points: Point[];
    partialHistory?: boolean;
  } | null;
};
export type HydroBundle = {
  unmonitored?: boolean;
  insee: string;
  river: string;
  date: string;
  generatedAt: string;
  expiresAt: string;
  complete: boolean;
  parts: Partial<Record<"H" | "Q", HydroPart>>;
  thermal?: import("../thermal-types").ThermalWeather;
  fishFeeding?: import("../fish-feeding-display.types").FishFeedingDisplay;
};
export type HydroReply = {
  retryable?: boolean;
  status: "ready" | "partial" | "pending" | "limited" | "unavailable";
  bundle?: HydroBundle;
};
