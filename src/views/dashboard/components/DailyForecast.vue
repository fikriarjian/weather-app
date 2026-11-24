<template>
    <div class="flex h-41.5 flex-col items-center justify-between rounded-xl border border-neutral-600 bg-neutral-700 p-3 sm:p-4">
        <span class="text-base font-base text-neutral-0 sm:text-lg">{{ day }}</span>
        <img :src="icons" alt="" class="h-12 w-12 sm:h-14 sm:w-14">
        <div class="flex justify-between w-full">
            <h1 class="text-md font-base text-neutral-0">{{ value }}{{ temperatureUnit }}</h1>
            <h1 class="text-md font-base text-neutral-0">{{ value2 }}{{ temperatureUnit }}</h1>
        </div>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
    day?: string
    value?: number
    value2?: number
    icons?: string
    temperatureUnit?: string
}>()
</script>