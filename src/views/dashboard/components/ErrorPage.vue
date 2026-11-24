<template>
  <div class="w-full flex flex-col gap-4 items-center text-neutral-0">
    <i class="ti ti-ban text-4xl text-neutral-300"></i>
    <h1 class="text-neutral-0 text-5xl font-bold">Something went wrong</h1>
    <p class="text-center">
      We couldn't connect to the server (API error). Please try <br />
      again in a few moments.
    </p>
    <Button
      type="button"
      icon-position="left"
      icon="ti ti-refresh"
      variant="neutral"
      @click="emit('retry')"
      >Retry</Button
    >
  </div>
</template>
<script lang="ts" setup>
import Button from "@/components/ui/Button.vue";

const emit = defineEmits<{
  retry: [];
}>();
</script>
