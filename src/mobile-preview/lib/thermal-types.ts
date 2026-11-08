export type ThermalWeatherDay = {
  date: string;
  waterTemperatureC: number | null;
};

export type ThermalWeather = {
  status: "ready" | "estimated" | "calibration_pending" | "unavailable";
  availability?: "supported_period" | "outside_supported_period";
  latestWaterTemperatureC: number | null;
  history: ThermalWeatherDay[];
};
