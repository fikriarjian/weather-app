<template>
  <WeatherPage
    v-if="status !== 'error'"
    ref="weatherPageRef"
    @status="status = $event"
  />
  <ErrorPage v-if="status === 'error'" @retry="retryWeather" />
</template>
<script setup lang="ts">
import { ref } from "vue";
import ErrorPage from "@/views/dashboard/components/ErrorPage.vue";
import WeatherPage from "@/views/dashboard/components/WeatherPage.vue";

type WeatherStatus = "loading" | "ready" | "error";

const status = ref<WeatherStatus>("loading");
const weatherPageRef = ref<{ retryWeather: () => Promise<void> } | null>(null);

async function retryWeather() {
  status.value = "loading";
  await weatherPageRef.value?.retryWeather();
}
</script>
