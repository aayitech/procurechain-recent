export interface PortCondition {
  id: string;
  name: string;
  region: string;
  kind: string;
  temperatureC: number | null;
  windSpeedKmh: number | null;
  windGustsKmh: number | null;
  precipitationMm: number | null;
  weatherCode: number | null;
  weatherDescription: string;
  operationalFlag: 'normal' | 'elevated' | 'unavailable';
  observedAt: string | null;
}

export interface PortConditionsPayload {
  generatedAt: string;
  points: PortCondition[];
}
