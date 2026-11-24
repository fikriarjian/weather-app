<template>
  <button
    :class="[
      variantClasses[props.variant || 'neutral'],
      disabledClasses,
      'inline-flex items-center justify-center text-center font-medium border transition-colors duration-150 focus:outline focus:outline-offset-2',
      variantSize[props.size || 'sm'],
      variantRounded[props.rounded || 'lg'],
    ]"
    :disabled="props.disabled"
    :type="props.type || 'button'"
  >
    <div
      :class="[
        'flex items-center',
        props.icon && props.iconPosition === 'right' && 'flex-row-reverse',
      ]"
    >
      <i
        v-if="props.icon"
        class="text-sm font-medium"
        :class="[props.icon, props.iconPosition === 'right' ? 'ms-2' : 'me-2']"
      />
      <slot />
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "blue" | "neutral";
  icon?: string;
  iconPosition?: "left" | "right";
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  rounded?: "base" | "sm" | "md" | "lg" | "xl" | "full";
}>();

const variantSize: Record<string, string> = {
  xs: "text-xs px-3 py-1.5",
  sm: "text-sm px-3 py-2",
  base: "text-base px-4 py-2.5",
  lg: "text-lg px-5 py-3",
  xl: "text-xl px-6 py-3.5",
};

const variantRounded: Record<string, string> = {
  base: "rounded-base",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const variantClasses: Record<string, string> = {
  blue: "bg-blue-500 border-blue-500 text-neutral-0 hover:bg-blue-700 hover:border-blue-700 focus:outline-blue-500",
  neutral: "bg-neutral-700 border-neutral-700 text-neutral-0 hover:bg-neutral-800 hover:border-neutral-800 focus:outline-neutral-700"
};

const disabledClasses = computed(() => {
  return props.disabled
    ? "cursor-not-allowed opacity-50 pointer-events-none"
    : "cursor-pointer";
});
</script>
