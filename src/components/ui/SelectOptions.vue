<template>
  <div>
    <label
      v-if="props.label || $slots.label"
      :for="props.labelFor"
      :id="props.labelFor"
      class="block mb-2 text-medium font-normal text-[#888EA8]"
      :class="{ 'text-[#C0280C]': props.required && props.submitted }"
    >
      <slot name="label">
        {{ props.label }}
        <span v-if="props.required && props.submitted" class="ml-1">*</span>
      </slot>
    </label>

    <div class="relative w-full rounded-xl" :class="[variantClasses[props.variant]]" ref="dropdownRef">
      <!-- Input Display -->
      <div
        class="rounded-xl px-3 py-2 flex justify-between items-center gap-2 cursor-pointer active:ring active:ring-neutral-0"
        :class="[
          'text-medium font-normal',
          props.disabled
            ? 'bg-gray-200 text-[#818898] cursor-not-allowed! opacity-60'
            : [variantClasses[props.variant], 'text-neutral-0 cursor-pointer'],
          props.required
            ? 'border border-[#C0280C]!'
            : ['border', borderVariantClasses[props.variant]],
          props.submitted
            ? 'border border-[#C0280C]!'
            : ['border', borderVariantClasses[props.variant]],
        ]"
        @click="toggleDropdown"
      >
        <slot name="groupStart"></slot>
        <span class="text-neutral-0 text-medium font-normal">{{
          selectedLabel
        }}</span>
        <i
          class="ti ti-chevron-down text-lg text-neutral-0 transition-transform duration-300"
          :class="{ 'rotate-180': isVisible }"
        ></i>
      </div>

      <!-- Dropdown List -->
      <transition name="fade">
        <div
          v-if="isVisible"
          class="min-w-xs absolute w-full mt-1 right-0 rounded-xl z-50 shadow-md p-2 border border-neutral-600"
          :class="[bgDropdownVariant[props.variant], { 'max-h-80 overflow-y-auto': props.scrollable }]"
          role="listbox"
          :aria-multiselectable="props.multiple"
        >
          <slot name="header-title"></slot>
          <!-- Search Input -->
          <div :class="{ 'p-2': props.search }">
            <input
              v-if="props.search"
              v-model="searchQuery"
              type="text"
              class="border border-[#E0E6ED] rounded-xl py-2 px-3 text-neutral-0 text-medium font-normal focus:outline-none focus:border-[#E0E6ED] focus:ring focus:ring-[#E0E6ED] block w-full"
              placeholder="Cari Data"
              :disabled="isLoading"
            />
            <div v-if="isLoading" class="text-center py-2">
              <!-- spinner -->
            </div>
          </div>
          <!-- Option Items -->

          <template
            v-for="(group, groupIndex) in groupedOptions"
            :key="group.label"
          >
            <p
              v-if="props.groupKey && group.label"
              class="px-4 pt-2 pb-1 text-base font-semibold text-neutral-300"
            >
              {{ group.label }}
            </p>
            <div
              v-for="option in group.options"
              :key="getNestedValue(option, props.valueKey)"
              @click="selectOption(option)"
              class="w-full px-4 py-2 mt-1 rounded-xl flex justify-between items-center gap-2 text-medium font-normal text-neutral-0 hover:text-neutral-0 cursor-pointer active:ring active:ring-neutral-0"
              role="option"
              :aria-selected="isSelected(option)"
              :class="[hoverVariantClasses[props.variant],{
                'bg-neutral-600 text-neutral-0': isSelected(option),
              }]"
            >
              {{ getNestedValue(option, props.labelKey) }}
              <span
                v-if="props.multiple"
                aria-hidden="true"
                class="w-4 h-4 shrink-0 flex items-center justify-center"
                :class="{
                  'text-white': isSelected(option),
                }"
              >
                <i v-if="isSelected(option)" class="ti ti-check text-xs"></i>
              </span>
            </div>
            <hr
              v-if="
                props.groupKey &&
                group.label &&
                groupIndex < groupedOptions.length - 1
              "
              class="border-neutral-300 my-2"
            />
          </template>
          <div
            v-if="filteredOptions.length === 0"
            class="p-4 text-center text-medium font-normal"
          >
            No Data
          </div>
        </div>
      </transition>
    </div>

    <p v-if="props.required && isEmpty" class="text-[#C0280C] mt-2 text-small">
      {{ props.requiredMessage || "Kolom ini wajib diisi" }}
    </p>
    <p v-if="props.errorMessage" class="text-[#C0280C] mt-2 text-small">
      {{ props.errorMessage }}
    </p>
  </div>
</template>
<script setup lang="ts">
import {
  ref,
  computed,
  defineProps,
  defineEmits,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";

interface Option {
  [key: string]: any;
}

interface Props {
  options: Option[];
  modelValue:
    | Option
    | string
    | number
    | boolean
    | null
    | undefined
    | Array<Option | string | number | boolean>;
  labelKey: string;
  valueKey: string;
  maxOptions?: number;
  scrollable?: boolean;
  disabled?: boolean;
  placeholder: string;
  labelFor?: string;
  label?: string;
  required?: boolean;
  requiredMessage?: string;
  errorMessage?: string;
  returnObject?: boolean;
  submitted?: boolean;
  search?: boolean;
  multiple?: boolean;
  groupKey?: string;
  variant?: 'neutral700' | 'neutral600';
}

const props = withDefaults(defineProps<Props>(), {
  maxOptions: 20,
  scrollable: false,
  disabled: false,
  options: () => [],
  multiple: false,
  variant: 'neutral700'
});

const emit = defineEmits<{
  (
    e: "update:modelValue",
    value:
      | Option
      | string
      | number
      | boolean
      | null
      | undefined
      | Array<Option | string | number | boolean>,
  ): void;
  (e: "update:options", value: Option[]): void;
}>();

const variantClasses: Record<string, string> = {
  neutral600: "bg-neutral-600 ",
  neutral700: "bg-neutral-700"
}

const bgDropdownVariant: Record<string, string> = {
  neutral600: "bg-neutral-800",
  neutral700: "bg-neutral-700"
}

const borderVariantClasses: Record<string, string> = {
  neutral600: "border-neutral-600",
  neutral700: "border-neutral-700",
}

const hoverVariantClasses: Record<string, string> = {
  neutral600: "hover:bg-neutral-700",
  neutral700: "hover:bg-neutral-600"
} 

const dropdownRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const searchQuery = ref("");
const selected = ref<Props["modelValue"]>(props.modelValue);
const isLoading = ref(false);

const getNestedValue = (obj: any, path: string): any => {
  return path.split(".").reduce((acc: any, key: string) => acc?.[key], obj);
};

const toggleDropdown = () => {
  if (!props.disabled) isVisible.value = !isVisible.value;
};

const handleClickOutside = (e: MouseEvent) => {
  if (!dropdownRef.value?.contains(e.target as Node)) {
    isVisible.value = false;
    searchQuery.value = "";
  }
};

const filteredOptions = computed(() => {
  const filtered = props.options.filter((option) => {
    const label =
      getNestedValue(option, props.labelKey)?.toString().toLowerCase() || "";
    return label.includes(searchQuery.value.toLowerCase());
  });
  return props.scrollable ? filtered : filtered.slice(0, props.maxOptions);
});

const groupedOptions = computed(() => {
  const groups = new Map<string, Option[]>();

  for (const option of filteredOptions.value) {
    const groupLabel = props.groupKey
      ? String(getNestedValue(option, props.groupKey) ?? "")
      : "";
    const groupOptions = groups.get(groupLabel) ?? [];
    groupOptions.push(option);
    groups.set(groupLabel, groupOptions);
  }

  return Array.from(groups, ([label, options]) => ({ label, options }));
});

const selectOption = (option: Option) => {
  const optionValue = props.returnObject
    ? option
    : getNestedValue(option, props.valueKey);

  if (props.multiple) {
    const currentSelection = Array.isArray(selected.value)
      ? [...selected.value]
      : [];

    const groupKey = props.groupKey;
    if (groupKey) {
      const selectedIndex = currentSelection.findIndex((value) =>
        isSameOption(value, option),
      );

      if (selectedIndex !== -1) {
        currentSelection.splice(selectedIndex, 1);
      } else {
        const optionGroup = getNestedValue(option, groupKey);
        const updatedSelection = currentSelection.filter((value) => {
          const selectedOption = props.options.find((item) =>
            isSameOption(value, item),
          );
          return (
            !selectedOption ||
            getNestedValue(selectedOption, groupKey) !== optionGroup
          );
        });

        updatedSelection.push(optionValue);
        currentSelection.splice(
          0,
          currentSelection.length,
          ...updatedSelection,
        );
      }

      selected.value = currentSelection;
      emit("update:modelValue", currentSelection);
      return;
    }

    const selectedIndex = currentSelection.findIndex((value) =>
      isSameOption(value, option),
    );

    if (selectedIndex === -1) {
      currentSelection.push(optionValue);
    } else {
      currentSelection.splice(selectedIndex, 1);
    }

    selected.value = currentSelection;
    emit("update:modelValue", currentSelection);
    return;
  }

  selected.value = optionValue;
  emit("update:modelValue", selected.value);
  isVisible.value = false;
  searchQuery.value = "";
};

const selectedLabel = computed(() => {
  if (props.multiple) {
    const values = Array.isArray(selected.value) ? selected.value : [];
    if (values.length === 0) return props.placeholder;

    return (
      values
        .map((value) => getOptionLabel(value))
        .filter(
          (label) => label !== null && label !== undefined && label !== "",
        )
        .join(", ") || props.placeholder
    );
  }

  if (Array.isArray(selected.value)) return props.placeholder;
  if (selected.value === null || selected.value === undefined)
    return props.placeholder;

  return getOptionLabel(selected.value) || props.placeholder;
});

const getOptionLabel = (value: Option | string | number | boolean) => {
  if (typeof value === "object" && value !== null) {
    return getNestedValue(value, props.labelKey);
  }

  const match = props.options.find(
    (option) => getNestedValue(option, props.valueKey) === value,
  );
  return match ? getNestedValue(match, props.labelKey) : null;
};

const isSameOption = (
  value: Option | string | number | boolean,
  option: Option,
) => {
  if (typeof value === "object" && value !== null) {
    const selectedKey = getNestedValue(value, props.valueKey);
    const optionKey = getNestedValue(option, props.valueKey);

    if (selectedKey !== undefined && optionKey !== undefined) {
      return selectedKey === optionKey;
    }

    return JSON.stringify(value) === JSON.stringify(option);
  }

  return value === getNestedValue(option, props.valueKey);
};

const isSelected = (option: Option) => {
  if (Array.isArray(selected.value)) {
    return (
      props.multiple &&
      selected.value.some((value) => isSameOption(value, option))
    );
  }

  return (
    selected.value !== null &&
    selected.value !== undefined &&
    isSameOption(selected.value, option)
  );
};

const isEmpty = computed(() => {
  if (props.multiple) {
    return !Array.isArray(selected.value) || selected.value.length === 0;
  }

  return (
    selected.value === null ||
    selected.value === undefined ||
    selected.value === ""
  );
});

watch(
  () => props.modelValue,
  (val) => {
    selected.value = val;
  },
);

onMounted(() => window.addEventListener("click", handleClickOutside));
onBeforeUnmount(() => window.removeEventListener("click", handleClickOutside));
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
