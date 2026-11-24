<template>
  <div
    class="flex flex-col gap-2 rounded-3xl bg-neutral-800 px-4 py-6 sm:px-6 sm:rounded-4xl"
  >
    <div class="flex flex-row items-center justify-between gap-4">
      <span class="text-neutral-0 font-semibold text-lg">Hourly forecast</span>
      <SelectOptions
        v-model="selectedDay"
        :options="availableDays"
        label-key="label"
        value-key="value"
        placeholder="Select Days"
        variant="neutral600"
      />
    </div>

    <div
      v-for="(x, index) in (props.forecast?.length ? props.forecast : dayWeather)"
      :key="index"
      class="w-full flex flex-row justify-between items-center bg-neutral-700 border border-neutral-600 rounded-xl py-2.5 px-4"
    >
      <div class="flex flex-row items-center gap-1">
        <img :src="x.icons" alt="" class="h-10 w-10" />
        <span class="uppercase text-neutral-0">{{ x.time }}</span>
      </div>
      <span class="text-neutral-0">{{ x.degrees }}{{ temperatureSymbol }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import SelectOptions from "@/components/ui/SelectOptions.vue";
import SunnyIcon from "@/assets/images/icon-sunny.webp";
import OvercastIcon from "@/assets/images/icon-overcast.webp";
import DrizzleIcon from "@/assets/images/icon-drizzle.webp";
import FogIcon from "@/assets/images/icon-fog.webp";
import PartlyCloudlyIcon from "@/assets/images/icon-partly-cloudy.webp";
import RainIcon from "@/assets/images/icon-rain.webp";
import SnowIcon from "@/assets/images/icon-snow.webp";
import StormIcon from "@/assets/images/icon-storm.webp";

const props = withDefaults(defineProps<{
  label?: string;
  value?: string;
  icons?: string;
  time?: string;
  degrees?: number;
  forecast?: Array<{ icons: string; time: string; degrees: number }>;
  days?: Array<{ label: string; value: string }>;
  temperatureUnit?: string;
}>(), {
  forecast: () => [],
  days: () => [],
});

const emit = defineEmits<{ "update:selectedDay": [value: string] }>();
const selectedDay = ref(props.days[0]?.value ?? "");
const temperatureSymbol = computed(() => props.temperatureUnit ?? "°C");
const availableDays = computed(() => props.days.length ? props.days : day);

watch(selectedDay, (value) => {
  if (typeof value === "string") emit("update:selectedDay", value);
});

watch(
  () => props.days,
  (days) => {
    if (days.length && !days.some((day) => day.value === selectedDay.value)) {
      selectedDay.value = days[0].value;
    }
  },
);

const day = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" },
];

const dayWeather = [
  { icons: SunnyIcon, time: "3 PM", degrees: 20 },
  { icons: OvercastIcon, time: "4 PM", degrees: 78 },
  { icons: DrizzleIcon, time: "5 PM", degrees: 54 },
  { icons: FogIcon, time: "6 PM", degrees: 23 },
  { icons: PartlyCloudlyIcon, time: "7 PM", degrees: 23 },
  { icons: RainIcon, time: "8 PM", degrees: -10 },
  { icons: SnowIcon, time: "9 PM", degrees: 22 },
  { icons: StormIcon, time: "10 PM", degrees: 28 },
];

</script>
