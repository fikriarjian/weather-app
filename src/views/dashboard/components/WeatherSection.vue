<template>
  <div
    class="relative flex flex-col h-67 w-full items-center justify-center gap-10 lg:gap-0 lg:justify-between overflow-hidden rounded-3xl bg-cover bg-center bg-no-repeat px-5 lg:flex-row sm:h-71.5 sm:rounded-4xl sm:px-12"
    :style="{ backgroundImage: `url(${BgTodayLarge})` }"
  >
    <div
      class="flex flex-col text-center xl:text-left xl:justify-between gap-2 xl:flex-1"
    >
      <h1 class="text-3xl font-bold text-neutral-0">{{ props.city }}</h1>
      <span class="mt-1 text-sm text-neutral-200 sm:text-base">{{
        props.dayDate
      }}</span>
    </div>
    <div
      class="flex flex-row items-center justify-center gap-4 xl:gap-1 sm:gap-4"
    >
      <img
        :src="props.icons"
        alt=""
        class="h-18 w-18 sm:h-32 sm:w-32 lg:h-36 lg:w-36"
      />
      <h1
        class="text-[64px] leading-none font-bold italic text-neutral-0 sm:text-[62px] lg:text-[72pt]"
      >
        {{ props.degrees }}{{ props.temperatureUnit === "°F" ? "°F" : "°C" }}
      </h1>
    </div>
  </div>
</template>
<script setup lang="ts">
import BgTodayLarge from "@/assets/images/bg-today-large.svg";

const props = defineProps<{
  city?: string;
  dayDate?: string;
  degrees?: number;
  icons?: string;
  temperatureUnit?: string;
}>();
</script>
