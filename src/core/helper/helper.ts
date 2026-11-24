import SunnyIcon from "@/assets/images/icon-sunny.webp";
import OvercastIcon from "@/assets/images/icon-overcast.webp";
import DrizzleIcon from "@/assets/images/icon-drizzle.webp";
import FogIcon from "@/assets/images/icon-fog.webp";
import PartlyCloudlyIcon from "@/assets/images/icon-partly-cloudy.webp";
import RainIcon from "@/assets/images/icon-rain.webp";
import SnowIcon from "@/assets/images/icon-snow.webp";
import StormIcon from "@/assets/images/icon-storm.webp";

export const weatherIcons = {
  sunny: SunnyIcon,
  overcast: OvercastIcon,
  drizzle: DrizzleIcon,
  fog: FogIcon,
  partlyCloudy: PartlyCloudlyIcon,
  rain: RainIcon,
  snow: SnowIcon,
  storm: StormIcon,
};

export function getWeatherIcon(code: number) {
  if (code === 0) return weatherIcons.sunny;
  if (code === 1 || code === 2) return weatherIcons.partlyCloudy;
  if (code === 3) return weatherIcons.overcast;
  if (code === 45 || code === 48) return weatherIcons.fog;
  if (code >= 51 && code <= 57) return weatherIcons.drizzle;
  if (code >= 61 && code <= 67) return weatherIcons.rain;
  if (code >= 71 && code <= 77) return weatherIcons.snow;
  if (code >= 95) return weatherIcons.storm;
  return weatherIcons.overcast;
}

export function celsiusToFahrenheit(value: number) {
  return (value * 9) / 5 + 32;
}

export function kmhToMph(value: number) {
  return value * 0.621371;
}

export function mmToInches(value: number) {
  return value / 25.4;
}

export function formatTemperature(
  value: number,
  temperatureUnit: "celsius" | "fahrenheit",
) {
  return Math.round(
    temperatureUnit === "fahrenheit" ? celsiusToFahrenheit(value) : value,
  );
}

export function formatDayLabel(
  date: string,
  weekday: "long" | "short",
) {
  return new Intl.DateTimeFormat("en-US", { weekday }).format(
    new Date(`${date}T12:00:00`),
  );
}

export function formatHourLabel(time: string) {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric" }).format(
    new Date(time),
  );
}