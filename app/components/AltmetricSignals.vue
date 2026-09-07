<script setup lang="ts">
const props = defineProps<{
  variant: 'a' | 'b'
}>()

const progressColor = computed(() =>
  props.variant === 'a' ? 'primary' : 'success'
)

// Placeholder data for Altmetric Signals
const signals = [
  { label: 'Public Policy Mentions', value: 14, maxValue: 20, icon: 'i-lucide-landmark' },
  { label: 'News Coverage', value: 312, maxValue: 500, icon: 'i-lucide-newspaper' },
  { label: 'Social Media Traction', value: 48900, maxValue: 50000, icon: 'i-lucide-message-circle' },
  { label: 'Mendeley Readers', value: 12800, maxValue: 20000, icon: 'i-lucide-book-open' }
]

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <h4 class="text-xs font-semibold uppercase tracking-widest text-gray-400">
      Altmetric Signals
    </h4>

    <!-- Signals Container -->
    <div class="space-y-4 mt-6">
      <div v-for="signal in signals" :key="signal.label" class="space-y-1">
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <UIcon :name="signal.icon" class="text-gray-400" />
            <span>{{ signal.label }}</span>
          </div>
          <span class="font-semibold text-gray-900 dark:text-white">
            {{ formatNumber(signal.value) }}
          </span>
        </div>
        <UProgress 
          :value="signal.value" 
          :max="signal.maxValue" 
          :color="progressColor" 
          size="sm" 
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>
