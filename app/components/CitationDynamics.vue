<script setup lang="ts">
import type { CitationDynamics } from '~/types'

const props = defineProps<{
  citations: CitationDynamics
  variant: 'a' | 'b'
}>()

const textColor = computed(() =>
  props.variant === 'a' ? 'text-blue-500' : 'text-emerald-500'
)

// Helper to format numbers like 1.2K, 97.4K
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
      Citation Dynamics
    </h4>

    <!-- Highlighted Card -->
    <div class="rounded-xl bg-slate-900 text-white p-6 shadow-lg relative overflow-hidden">
      <!-- subtle background glow based on variant -->
      <div 
        class="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none"
        :class="variant === 'a' ? 'bg-blue-500' : 'bg-emerald-500'"
      />
      
      <div class="relative z-10">
        <p class="text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">
          Total Citations
        </p>
        
        <div class="flex items-baseline justify-between mb-1">
          <span class="text-4xl font-bold tracking-tight">
            {{ formatNumber(citations.totalCitations) }}
          </span>
          <span v-if="citations.growthPercentage > 0" class="text-sm font-medium text-emerald-400 flex items-center">
            <UIcon name="i-lucide-arrow-up" class="mr-0.5 w-3 h-3" />
            {{ citations.growthPercentage }}%
          </span>
        </div>
        
        <p class="text-xs text-gray-400">
          all time &middot; all sources
        </p>
      </div>
    </div>

    <!-- 2-col Grid for Cit/Year and Influential -->
    <div class="grid grid-cols-2 gap-4">
      <div class="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <p class="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2">
          Cit / Year
        </p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {{ formatNumber(citations.citPerYear) }}
        </p>
        <p class="text-xs text-gray-400">avg annual</p>
      </div>
      
      <div class="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
        <p class="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2">
          Influential
        </p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {{ formatNumber(citations.influentialCitations) }}
        </p>
        <p class="text-xs text-gray-400">high-impact cit.</p>
      </div>
    </div>

    <!-- Self-citations -->
    <div class="flex items-center justify-between text-sm py-2 px-1">
      <span class="text-gray-500 dark:text-gray-400">Self-citations</span>
      <span class="text-gray-900 dark:text-white font-medium">
        {{ formatNumber(citations.selfCitations) }}
        <span class="text-gray-400 font-normal ml-1">({{ citations.selfCitationPercentage }}%)</span>
      </span>
    </div>
  </div>
</template>
