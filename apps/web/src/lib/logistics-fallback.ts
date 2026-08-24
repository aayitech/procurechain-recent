import type { PortCondition, PortConditionsPayload } from '@/types/logistics';

/**
 * Fallback used only when our own API is unreachable. Open-Meteo is a free,
 * no-key, CORS-friendly API — safe to call directly from the browser, same
 * pattern as the Frankfurter FX fallback. Real live weather data, not
 * sample/synthetic data.
 */
const TRADE_ROUTE_POINTS = [
  { id: 'SUEZ_CANAL', name: 'Suez Canal', region: 'Egypt', lat: 30.5852, lon: 32.2654, kind: 'canal' },
  { id: 'PANAMA_CANAL', name: 'Panama Canal', region: 'Panama', lat: 9.082, lon: -79.7674, kind: 'canal' },
  { id: 'STRAIT_OF_HORMUZ', name: 'Strait of Hormuz', region: 'Iran / Oman', lat: 26.5667, lon: 56.25, kind: 'strait' },
  { id: 'SINGAPORE_STRAIT', name: 'Singapore Strait / Port of Singapore', region: 'Singapore', lat: 1.2646, lon: 103.8198, kind: 'port' },
  { id: 'PORT_SHANGHAI', name: 'Port of Shanghai', region: 'China', lat: 31.2304, lon: 121.4737, kind: 'port' },
  { id: 'PORT_ROTTERDAM', name: 'Port of Rotterdam', region: 'Netherlands', lat: 51.9496, lon: 4.1453, kind: 'port' },
  { id: 'PORT_LOS_ANGELES', name: 'Port of Los Angeles', region: 'United States', lat: 33.7405, lon: -118.2668, kind: 'port' },
  { id: 'PORT_HOUSTON', name: 'Port of Houston', region: 'United States', lat: 29.7355, lon: -95.2769, kind: 'port' },
  { id: 'PORT_SANTOS', name: 'Port of Santos', region: 'Brazil', lat: -23.9608, lon: -46.3339, kind: 'port' },
  { id: 'PORT_DURBAN', name: 'Port of Durban', region: 'South Africa', lat: -29.8587, lon: 31.0218, kind: 'port' },
] as const;

const WEATHER_CODE_TEXT: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

const HIGH_WIND_GUST_KMH = 60;
const HEAVY_PRECIPITATION_MM = 8;

async function fetchOne(point: (typeof TRADE_ROUTE_POINTS)[number]): Promise<PortCondition> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(point.lat));
  url.searchParams.set('longitude', String(point.lon));
  url.searchParams.set('current', 'temperature_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m');
  url.searchParams.set('timezone', 'UTC');

  const unavailable: PortCondition = {
    id: point.id,
    name: point.name,
    region: point.region,
    kind: point.kind,
    temperatureC: null,
    windSpeedKmh: null,
    windGustsKmh: null,
    precipitationMm: null,
    weatherCode: null,
    weatherDescription: 'Unavailable',
    operationalFlag: 'unavailable',
    observedAt: null,
  };

  try {
    const response = await fetch(url.toString());
    if (!response.ok) return unavailable;

    const body = (await response.json()) as {
      current?: {
        time?: string;
        temperature_2m?: number;
        precipitation?: number;
        weather_code?: number;
        wind_speed_10m?: number;
        wind_gusts_10m?: number;
      };
    };

    const current = body.current;
    if (!current) return unavailable;

    const windGusts = current.wind_gusts_10m ?? null;
    const precipitation = current.precipitation ?? null;
    const operationalFlag: PortCondition['operationalFlag'] =
      (windGusts !== null && windGusts >= HIGH_WIND_GUST_KMH) ||
      (precipitation !== null && precipitation >= HEAVY_PRECIPITATION_MM)
        ? 'elevated'
        : 'normal';

    return {
      id: point.id,
      name: point.name,
      region: point.region,
      kind: point.kind,
      temperatureC: current.temperature_2m ?? null,
      windSpeedKmh: current.wind_speed_10m ?? null,
      windGustsKmh: windGusts,
      precipitationMm: precipitation,
      weatherCode: current.weather_code ?? null,
      weatherDescription:
        current.weather_code !== undefined ? (WEATHER_CODE_TEXT[current.weather_code] ?? 'Unknown') : 'Unavailable',
      operationalFlag,
      observedAt: current.time ?? null,
    };
  } catch {
    return unavailable;
  }
}

export async function fetchFallbackPortConditions(): Promise<PortConditionsPayload> {
  const points = await Promise.all(TRADE_ROUTE_POINTS.map(fetchOne));
  return { generatedAt: new Date().toISOString(), points };
}
