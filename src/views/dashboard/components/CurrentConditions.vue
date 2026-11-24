<template>
    <div class="flex h-28 flex-col justify-between rounded-xl border border-neutral-600 bg-neutral-700 p-4 sm:p-5">
        <span class="text-lg font-base text-neutral-300">{{ header }}</span>
        <h1 class="text-4xl font-base text-neutral-0">{{ value }}{{ conditions }}</h1>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
    header?: string
    value?: number
    conditions?: string
}>()
</script>