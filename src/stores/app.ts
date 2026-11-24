import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isShowMainLoader = ref(false)
  const temperatureUnit = ref<'celsius' | 'fahrenheit'>('celsius')
  const windUnit = ref<'kmh' | 'mph'>('kmh')
  const precipitationUnit = ref<'mm' | 'in'>('mm')
  const selectedLocation = ref({
    name: 'Jakarta',
    admin1: '' as string | undefined,
    country: 'Indonesia' as string | undefined,
    latitude: -6.200000,
    longitude: 106.816666,
  })

  const showLoader = () => {
    isShowMainLoader.value = true
  }

  const hideLoader = () => {
    isShowMainLoader.value = false
  }

  return { isShowMainLoader, temperatureUnit, windUnit, precipitationUnit, selectedLocation, showLoader, hideLoader }
})