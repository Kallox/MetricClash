<script setup lang="ts">
import type { DimensionsMetrics } from '~/types'

const props = defineProps<{
  variant: 'a' | 'b'
  data: DimensionsMetrics | null
}>()

const colorClass = computed(() =>
  props.variant === 'a' ? 'text-blue-500' : 'text-emerald-500'
)

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
      Dimensions Metrics
    </h4>

    <!-- Signals Container -->
    <div v-if="data" class="grid grid-cols-2 gap-4 mt-6">
      <!-- RCR -->
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Relative Cit. Ratio</div>
        <div class="text-xl font-bold flex items-baseline gap-1">
          <span :class="colorClass">{{ data.relativeCitationRatio }}</span>
        </div>
      </div>
      
      <!-- FCR -->
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Field Cit. Ratio</div>
        <div class="text-xl font-bold flex items-baseline gap-1">
          <span :class="colorClass">{{ data.fieldCitationRatio }}</span>
        </div>
      </div>

      <!-- Recent Citations -->
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Recent Citations</div>
        <div class="text-xl font-bold flex items-baseline gap-1">
          <span :class="colorClass">{{ formatNumber(data.recentCitations) }}</span>
        </div>
      </div>

      <!-- Total Citations -->
      <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
        <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Citations</div>
        <div class="text-xl font-bold flex items-baseline gap-1">
          <span :class="colorClass">{{ formatNumber(data.timesCited) }}</span>
        </div>
      </div>
    </div>
    
    <div v-else class="text-sm text-gray-400 italic mt-6">
      No Dimensions data available.
    </div>
  </div>
</template>
