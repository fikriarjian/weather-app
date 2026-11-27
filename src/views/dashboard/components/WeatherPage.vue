<template>
  <div
    class="mx-auto flex w-full max-w-304 flex-col items-center gap-6 px-4 pb-10 sm:gap-8 sm:px-6 xl:px-0"
  >
    <h1
      class="text-center text-6xl leading-[1.12] font-semibold text-neutral-0 xl:text-4xl"
    >
      How's the sky looking today?
    </h1>

    <form
      class="relative flex w-full max-w-164 flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:gap-4"
      @submit.prevent="searchLocation"
    >
      <div class="relative grow">
        <i
          class="ti ti-search pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-neutral-300"
        />

        <input
          v-model="query"
          type="search"
          autocomplete="off"
          placeholder="Search for a place..."
          class="h-12 w-full appearance-none rounded-xl border border-transparent bg-neutral-800 px-12 pr-12 text-base text-neutral-0 caret-neutral-0 outline-none placeholder:text-neutral-300 focus:border-neutral-300 focus:ring-2 focus:ring-neutral-0/20 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          @focus="isDropdownOpen = query.trim().length > 0"
          @blur="closeDropdown"
          @keydown.down.prevent="moveSelection(1)"
          @keydown.up.prevent="moveSelection(-1)"
          @keydown.enter.prevent="selectHighlighted"
        />

        <button
          v-if="query"
          type="button"
          aria-label="Clear search"
          class="absolute right-4 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-neutral-0"
          @mousedown.prevent
          @click="clearSearch"
        >
          <i class="ti ti-x text-lg" />
        </button>

        <div
          v-if="isDropdownOpen"
          class="absolute left-0 top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-xl bg-neutral-800 p-2 shadow-2xl"
        >
          <div
            v-if="isLoading"
            role="status"
            class="flex h-12 items-center gap-2 rounded-md px-4 text-sm text-neutral-300"
          >
            <i class="ti ti-loader-2 animate-spin" aria-hidden="true" />
            <span>Search in progress</span>
          </div>

          <button
            v-else
            v-for="(location, index) in locations"
            :key="location.id"
            type="button"
            class="flex h-12 w-full items-center rounded-md px-4 text-left text-base text-neutral-0 transition-colors"
            :class="
              highlightedIndex === index
                ? 'bg-neutral-700'
                : 'hover:bg-neutral-700'
            "
            @mousedown.prevent
            @mouseenter="highlightedIndex = index"
            @click="selectLocation(location)"
          >
            {{ location.name
            }}{{ location.admin1 ? `, ${location.admin1}` : "" }}
          </button>

          <p
            v-if="query && locations.length === 0 && !isLoading"
            class="px-4 py-3 text-sm text-neutral-300"
          >
            No places found
          </p>
        </div>
      </div>

      <Button
        type="submit"
        variant="blue"
        size="lg"
        rounded="lg"
        class="h-12 min-w-32 shrink-0"
      >
        Search
      </Button>
    </form>

    <p
      v-if="hasNoResults"
      role="status"
      class="text-center text-lg font-semibold text-neutral-0"
    >
      No search result found!
    </p>

    <div
      v-else-if="isWeatherLoading && !weatherData"
      role="status"
      aria-label="Loading weather forecast"
      aria-busy="true"
      class="grid w-full grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      <div class="flex min-w-0 flex-col gap-6">
        <div
          class="flex h-67 w-full items-center justify-center rounded-3xl border border-neutral-600 bg-neutral-800 sm:h-71.5 sm:rounded-4xl"
        >
          <div class="flex flex-col items-center gap-2 text-neutral-200">
            <div class="flex gap-2" aria-hidden="true">
              <span class="size-2 rounded-full bg-neutral-200 animate-pulse" />
              <span class="size-2 rounded-full bg-neutral-200 animate-pulse [animation-delay:150ms]" />
              <span class="size-2 rounded-full bg-neutral-200 animate-pulse [animation-delay:300ms]" />
            </div>
            <span class="text-sm">Loading...</span>
          </div>
        </div>

        <div class="grid w-full grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
          <div
            v-for="label in ['Feels Like', 'Humidity', 'Wind', 'Precipitation']"
            :key="label"
            class="flex h-28 flex-col justify-between rounded-xl border border-neutral-600 bg-neutral-700 p-4 sm:p-5"
          >
            <span class="text-lg text-neutral-300">{{ label }}</span>
            <span class="text-4xl text-neutral-0">—</span>
          </div>
        </div>

        <div class="flex w-full flex-col gap-4">
          <h3 class="text-lg font-semibold text-neutral-0">Daily Forecast</h3>
          <div class="grid w-full grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            <div
              v-for="day in 7"
              :key="day"
              class="h-41.5 rounded-xl border border-neutral-600 bg-neutral-700"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 rounded-3xl bg-neutral-800 px-4 py-6 sm:rounded-4xl sm:px-6">
        <div class="mb-2 flex items-center justify-between gap-4">
          <span class="text-lg font-semibold text-neutral-0">Hourly forecast</span>
          <span class="h-6 w-11 rounded-md bg-neutral-700" aria-hidden="true" />
        </div>
        <div
          v-for="row in 8"
          :key="row"
          class="h-10 w-full rounded-xl border border-neutral-600 bg-neutral-700"
          aria-hidden="true"
        />
      </div>
    </div>

    <div
      v-else
      class="grid w-full grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      <div class="flex min-w-0 flex-col gap-6">
        <WeatherSection
          :city="weatherSections.city"
          :day-date="weatherSections.dayDate"
          :degrees="weatherSections.degrees"
          :icons="weatherSections.icons"
          :temperature-unit="temperatureSymbol"
        />
        <div class="grid w-full grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
          <template v-for="(x, index) in currentCoditionsValue" :key="index">
            <CurrentConditions
              :header="x.header"
              :value="x.value"
              :conditions="x.conditions"
            />
          </template>
        </div>
        <div class="flex w-full flex-col gap-4">
          <h3 class="text-lg font-semibold text-neutral-0">Daily Forecast</h3>
          <div
            class="grid w-full grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7"
          >
            <template v-for="(x, index) in dailyForecastValue" :key="index">
              <DailyForecast
                :day="x.day"
                :icons="x.icons"
                :value="x.value"
                :value2="x.value2"
                :temperature-unit="temperatureSymbol"
              />
            </template>
          </div>
        </div>
      </div>
      <HourlyForcast
        class="w-full lg:w-90"
        :forecast="hourlyForecast"
        :days="forecastDays"
        :temperature-unit="temperatureSymbol"
        @update:selected-day="selectedHourDay = $event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import Button from "@/components/ui/Button.vue";
import type { LocationResult, WeatherResponse } from "@/core/interface/LocationResult";
import WeatherSection from "@/views/dashboard/components/WeatherSection.vue";
import HourlyForcast from "@/views/dashboard/components/HourlyForcast.vue";
import CurrentConditions from "@/views/dashboard/components/CurrentConditions.vue";
import DailyForecast from "@/views/dashboard/components/DailyForecast.vue";
import { useAppStore } from "@/stores/app";
import { getWeather, searchLocations } from "@/api/WeatherApi";
import {
  formatDayLabel,
  formatHourLabel,
  formatTemperature,
  getWeatherIcon,
  kmhToMph,
  mmToInches,
  weatherIcons,
} from "@/core/helper/helper";

const appStore = useAppStore();
const emit = defineEmits<{
  status: [value: "loading" | "ready" | "error"];
}>();

const query = ref("");
const locations = ref<LocationResult[]>([]);
const isLoading = ref(false);
const hasNoResults = ref(false);
const isDropdownOpen = ref(false);
const highlightedIndex = ref(-1);
let searchTimer: number | undefined;
let searchRequestId = 0;
let weatherRefreshTimer: number | undefined;

const weatherData = ref<WeatherResponse>();
const selectedHourDay = ref("");
const isWeatherLoading = ref(false);

const temperatureSymbol = computed(() =>
  appStore.temperatureUnit === "fahrenheit" ? "°F" : "°C",
);

const formatTemperatureValue = (value: number) =>
  formatTemperature(value, appStore.temperatureUnit);

const weatherSections = computed(() => {
  const location = appStore.selectedLocation;
  const current = weatherData.value?.current;
  return {
    city: `${location.name}${location.admin1 ? `, ${location.admin1}` : location.country ? `, ${location.country}` : ""}`,
    dayDate: new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date()),
    degrees: current ? formatTemperatureValue(current.temperature_2m) : 0,
    icons: current ? getWeatherIcon(current.weather_code) : weatherIcons.sunny,
  };
});

const currentCoditionsValue = computed(() => {
  const current = weatherData.value?.current;
  return [
    {
      header: "Feels Like",
      value: current ? formatTemperatureValue(current.apparent_temperature) : 0,
      conditions: temperatureSymbol.value,
    },
    { header: "Humidity", value: current?.relative_humidity_2m ?? 0, conditions: "%" },
    {
      header: "Wind",
      value: current
        ? Math.round(appStore.windUnit === "mph" ? kmhToMph(current.wind_speed_10m) : current.wind_speed_10m)
        : 0,
      conditions: appStore.windUnit === "mph" ? "mph" : "km/h",
    },
    {
      header: "Precipitation",
      value: current
        ? Number((appStore.precipitationUnit === "in" ? mmToInches(current.precipitation) : current.precipitation).toFixed(2))
        : 0,
      conditions: appStore.precipitationUnit,
    },
  ];
});

const dailyForecastValue = computed(() =>
  (weatherData.value?.daily?.time ?? []).slice(0, 7).map((time, index) => {
    const daily = weatherData.value?.daily;
    return {
      day: formatDayLabel(time, "short"),
      icons: getWeatherIcon(daily?.weather_code[index] ?? 0),
      value: formatTemperatureValue(daily?.temperature_2m_max[index] ?? 0),
      value2: formatTemperatureValue(daily?.temperature_2m_min[index] ?? 0),
    };
  }),
);

const forecastDays = computed(() =>
  [...new Set((weatherData.value?.hourly?.time ?? []).map((time) => time.slice(0, 10)))].slice(0, 7).map((date) => ({
    label: formatDayLabel(date, "long"),
    value: date,
  })),
);

const hourlyForecast = computed(() => {
  const hourly = weatherData.value?.hourly;
  if (!hourly) return [];
  const targetDay = selectedHourDay.value || hourly.time[0]?.slice(0, 10);
  return hourly.time
    .map((time, index) => ({ time, index }))
    .filter(({ time }) => time.slice(0, 10) === targetDay)
    .filter((_, index) => index % 1 === 0)
    .slice(0, 8)
    .map(({ time, index }) => ({
      icons: getWeatherIcon(hourly.weather_code[index] ?? 0),
      time: formatHourLabel(time),
      degrees: formatTemperatureValue(hourly.temperature_2m[index] ?? 0),
    }));
});

watch(query, (value) => {
  if (searchTimer) window.clearTimeout(searchTimer);
  searchRequestId++;
  highlightedIndex.value = -1;

  if (!value.trim()) {
    locations.value = [];
    isLoading.value = false;
    hasNoResults.value = false;
    isDropdownOpen.value = false;
    return;
  }

  hasNoResults.value = false;
  locations.value = [];
  isLoading.value = true;
  isDropdownOpen.value = true;
  searchTimer = window.setTimeout(() => fetchLocations(value), 300);
});

async function fetchLocations(value: string) {
  isLoading.value = true;
  const requestId = ++searchRequestId;

  try {
    const results = await searchLocations(value);

    if (requestId !== searchRequestId || !query.value.trim()) return;

    locations.value = results;
    hasNoResults.value = results.length === 0;
    isDropdownOpen.value = results.length > 0;
  } catch {
    if (requestId !== searchRequestId) return;
    locations.value = [];
    hasNoResults.value = false;
    isDropdownOpen.value = false;
  } finally {
    if (requestId === searchRequestId) isLoading.value = false;
  }
}

async function fetchWeather() {
  if (isWeatherLoading.value) return;

  const location = appStore.selectedLocation;
  isWeatherLoading.value = true;
  emit("status", "loading");
  try {
    weatherData.value = await getWeather(
      location.latitude,
      location.longitude,
    );
    emit("status", "ready");
  } catch {
    weatherData.value = undefined;
    emit("status", "error");
  } finally {
    isWeatherLoading.value = false;
  }
}

watch(
  () => [appStore.selectedLocation.latitude, appStore.selectedLocation.longitude],
  fetchWeather,
);

watch(
  () => [appStore.temperatureUnit, appStore.windUnit, appStore.precipitationUnit],
  () => undefined,
);

fetchWeather();

weatherRefreshTimer = window.setInterval(fetchWeather, 5 * 60 * 1000);

function searchLocation() {
  if (locations.value.length > 0) {
    selectLocation(
      locations.value[highlightedIndex.value >= 0 ? highlightedIndex.value : 0],
    );
  } else if (query.value.trim()) {
    if (searchTimer) window.clearTimeout(searchTimer);
    isDropdownOpen.value = true;
    fetchLocations(query.value);
  }
}

function selectLocation(location: LocationResult) {
  hasNoResults.value = false;
  query.value = location.name;
  appStore.selectedLocation = {
    name: location.name,
    admin1: location.admin1,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
  };
  isDropdownOpen.value = false;
  highlightedIndex.value = -1;
}

function clearSearch() {
  if (searchTimer) window.clearTimeout(searchTimer);
  searchRequestId++;
  query.value = "";
  locations.value = [];
  hasNoResults.value = false;
  highlightedIndex.value = -1;
  isDropdownOpen.value = false;
  isLoading.value = false;
}

function selectHighlighted() {
  if (!isDropdownOpen.value || locations.value.length === 0) {
    searchLocation();
    return;
  }

  selectLocation(
    locations.value[highlightedIndex.value >= 0 ? highlightedIndex.value : 0],
  );
}

function moveSelection(direction: number) {
  if (locations.value.length === 0) return;

  if (highlightedIndex.value === -1) {
    highlightedIndex.value = direction > 0 ? 0 : locations.value.length - 1;
    return;
  }

  highlightedIndex.value =
    (highlightedIndex.value + direction + locations.value.length) %
    locations.value.length;
}

function closeDropdown() {
  window.setTimeout(() => {
    if (!isLoading.value) isDropdownOpen.value = false;
  }, 100);
}

onBeforeUnmount(() => {
  if (searchTimer) window.clearTimeout(searchTimer);
  if (weatherRefreshTimer) window.clearInterval(weatherRefreshTimer);
});

defineExpose({
  retryWeather: fetchWeather,
});
</script>
