<script setup lang="ts">
import type { CrossSourceEntry } from '~/types'

const props = defineProps<{
  sources: CrossSourceEntry[]
  variant: 'a' | 'b'
}>()

const progressColor = computed(() =>
  props.variant === 'a' ? 'primary' : 'success'
)

// Helper to format numbers
function formatNumber(num: number): string {
  if (num === 0) return '—'
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

function formatCoverage(coverage: number): string {
  if (coverage === 0) return '—'
  return coverage === 100 ? '100%' : `${coverage}%`
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <h4 class="text-xs font-semibold uppercase tracking-widest text-gray-400">
      Cross-Source Aggregation
    </h4>

    <!-- Table Container -->
    <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      <div class="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-800 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <div class="col-span-4">Source</div>
        <div class="col-span-5">Citations</div>
        <div class="col-span-3 text-right">Coverage</div>
      </div>
      
      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <div 
          v-for="source in sources" 
          :key="source.source"
          class="grid grid-cols-12 gap-4 items-center px-4 py-3"
        >
          <div class="col-span-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ source.source }}
          </div>
          
          <div class="col-span-5 flex flex-col justify-center">
            <span class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {{ formatNumber(source.citations) }}
            </span>
            <UProgress 
              :value="source.coverage" 
              :color="progressColor" 
              size="sm" 
              class="w-full"
            />
          </div>
          
          <div class="col-span-3 text-right">
            <UBadge 
              v-if="source.coverage > 0"
              :color="source.coverage === 100 ? 'success' : 'neutral'" 
              variant="subtle" 
              size="xs"
              class="font-mono"
            >
              {{ formatCoverage(source.coverage) }}
            </UBadge>
            <span v-else class="text-sm text-gray-400 font-mono">—</span>
          </div>
        </div>
      </div>
    </div>
    
    <p class="text-[10px] text-gray-400 italic">
      Coverage variance reflects indexing lag, corpus scope, and disambiguation across databases.
    </p>
  </div>
</template>
