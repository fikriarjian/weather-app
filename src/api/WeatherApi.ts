import ApiService from "@/services/ApiService";
import type {
  LocationResult,
  WeatherResponse,
} from "@/core/interface/LocationResult";

const GEOCODING_API_URL =
  "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

export async function searchLocations(
  value: string,
): Promise<LocationResult[]> {
  const response = await ApiService.get<{ results?: LocationResult[] }>({
    resource: GEOCODING_API_URL,
    params: {
      name: value,
      count: 4,
      language: "en",
      format: "json",
    },
  });

  return response.data.results ?? [];
}

export async function getWeather(
  latitude: number,
  longitude: number,
): Promise<WeatherResponse> {
  const response = await ApiService.get<WeatherResponse>({
    resource: WEATHER_API_URL,
    params: {
      latitude,
      longitude,
      current:
        "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code",
      hourly: "temperature_2m,weather_code",
      daily: "weather_code,temperature_2m_max,temperature_2m_min",
      temperature_unit: "celsius",
      wind_speed_unit: "kmh",
      precipitation_unit: "mm",
      timezone: "auto",
      forecast_days: 7,
    },
  });

  return response.data;
}