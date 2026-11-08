export type FishFeedingDisplayPoint = {
  hour: string;
  /** UTC instant; distinguishes repeated French hours at the autumn transition. */
  time?: string | undefined;
  value: number;
};

export type ActivityLoadState = {
  display?: FishFeedingDisplay | undefined;
  loading: boolean;
  selected: boolean;
};

export type FishFeedingDisplaySpecies = {
  speciesId: string;
  label: string;
  points: FishFeedingDisplayPoint[];
};

export type FishFeedingDisplayFamily = {
  activityGroup: string;
  label: string;
  points: FishFeedingDisplayPoint[];
  species: FishFeedingDisplaySpecies[];
};

export type FishFeedingDisplayDay = {
  targetDate: string;
  sunrise: string | null;
  sunset: string | null;
  points: FishFeedingDisplayPoint[];
  families: FishFeedingDisplayFamily[];
};

export type FishFeedingDisplay = {
  activityPolicy?: typeof FISH_ACTIVITY_POLICY;
  /** Catalogue version excludes cached river inventories from earlier releases. */
  selectionPolicy?: "catalogue_v2";
  /** Explicit user weights; absent means all thirteen catalogue species. */
  selectedSpeciesIds?: string[];
  modelVersion:
    | "demo"
    | "fishing_window_v1"
    | "fishing_window_v3"
    | "fishing_window_v4"
    | "fishing_window_v5"
    | "fishing_window_v6"
    | "fishing_window_standard_v1";
  waterbodyId: string;
  days: FishFeedingDisplayDay[];
};

/** Invalidates activity curves computed by an earlier policy. */
export const FISH_ACTIVITY_POLICY = "feeding_v7";
