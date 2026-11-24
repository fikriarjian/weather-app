<template>
  <header class="relative left-0 top-0 w-full">
    <div class="mx-auto flex max-w-304 items-center justify-between px-4 py-6 sm:px-6 sm:py-8 xl:px-0">
      <div>
        <img :src="Logo" alt="Logo" class="w-32 h-auto" />
      </div>
      <div>
        <SelectOptions
          v-model="selectedUnits"
          :options="unitOptions"
          label-key="label"
          value-key="value"
          group-key="group"
          placeholder="Units"
          :multiple="true"
        >
          <template #groupStart><i class="ti ti-settings"></i></template>
        </SelectOptions>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Logo from "@/assets/images/logo.svg";
import SelectOptions from "@/components/ui/SelectOptions.vue";
import { useAppStore } from "@/stores/app";
import { watch } from "vue";

const appStore = useAppStore();

const unitOptions = [
  { label: "Switch to Imperial", value: "sti" },
  { label: "Switch to Metric", value: "stm" },
  { group: "Temperature", label: "Celsius (°C)", value: "celsius" },
  { group: "Temperature", label: "Fahrenheit (°F)", value: "fahrenheit" },
  { group: "Wind Speed", label: "km/h", value: "kmh" },
  { group: "Wind Speed", label: "mph", value: "mph" },
  { group: "Precipitation", label: "Milimeters (mm)", value: "mm" },
  { group: "Precipitation", label: "Inches (in)", value: "in" },
];

const selectedUnits = ref<string[]>(["celsius", "kmh", "mm"]);

watch(selectedUnits, (values) => {
  if (values.includes("sti")) {
    appStore.temperatureUnit = "fahrenheit";
    appStore.windUnit = "mph";
    appStore.precipitationUnit = "in";
    selectedUnits.value = ["fahrenheit", "mph", "in"];
  } else if (values.includes("stm")) {
    appStore.temperatureUnit = "celsius";
    appStore.windUnit = "kmh";
    appStore.precipitationUnit = "mm";
    selectedUnits.value = ["celsius", "kmh", "mm"];
  } else {
    if (values.includes("celsius")) appStore.temperatureUnit = "celsius";
    if (values.includes("fahrenheit")) appStore.temperatureUnit = "fahrenheit";
    if (values.includes("kmh")) appStore.windUnit = "kmh";
    if (values.includes("mph")) appStore.windUnit = "mph";
    if (values.includes("mm")) appStore.precipitationUnit = "mm";
    if (values.includes("in")) appStore.precipitationUnit = "in";
  }
});
</script>
