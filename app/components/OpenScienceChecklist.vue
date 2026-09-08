<script setup lang="ts">
import type { PaperProfile } from '~/types'

const props = defineProps<{
  paperA: PaperProfile
  paperB: PaperProfile
}>()
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h4 class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
        Open Science &amp; Reproducibility
      </h4>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
        Resource Availability Checklist
      </h2>
      <p class="text-xs text-gray-500 mt-1 font-mono">
        Linked artifacts verified via OpenAlex and registry lookups
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Paper A Checklist -->
      <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
        <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <UBadge color="primary" variant="subtle" size="xs">PAPER A</UBadge>
            <span class="font-medium text-sm text-gray-900 dark:text-white truncate max-w-[200px]">
              {{ paperA.metadata.title }}
            </span>
          </div>
          <div class="text-right">
            <span class="text-xs text-gray-400 uppercase tracking-widest block mb-1">Score</span>
            <span class="text-lg font-bold text-blue-500">{{ paperA.openScience.score }}/{{ paperA.openScience.total }}</span>
          </div>
        </div>
        
        <UProgress :model-value="(paperA.openScience.score / paperA.openScience.total) * 100" color="primary" class="mb-6" />

        <div class="space-y-4">
          <div v-for="item in paperA.openScience.items" :key="item.label" class="flex justify-between items-center">
            <div class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <UIcon :name="item.icon" class="text-gray-400 w-5 h-5" />
              <span>{{ item.label }}</span>
            </div>
            <UBadge :color="item.available ? 'success' : 'neutral'" variant="subtle" size="xs">
              {{ item.available ? 'Available' : 'Not Found' }}
            </UBadge>
          </div>
        </div>
      </div>

      <!-- Paper B Checklist -->
      <div class="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
        <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <UBadge color="success" variant="subtle" size="xs">PAPER B</UBadge>
            <span class="font-medium text-sm text-gray-900 dark:text-white truncate max-w-[200px]">
              {{ paperB.metadata.title }}
            </span>
          </div>
          <div class="text-right">
            <span class="text-xs text-gray-400 uppercase tracking-widest block mb-1">Score</span>
            <span class="text-lg font-bold text-emerald-500">{{ paperB.openScience.score }}/{{ paperB.openScience.total }}</span>
          </div>
        </div>
        
        <UProgress :model-value="(paperB.openScience.score / paperB.openScience.total) * 100" color="success" class="mb-6" />

        <div class="space-y-4">
          <div v-for="item in paperB.openScience.items" :key="item.label" class="flex justify-between items-center">
            <div class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <UIcon :name="item.icon" class="text-gray-400 w-5 h-5" />
              <span>{{ item.label }}</span>
            </div>
            <UBadge :color="item.available ? 'success' : 'neutral'" variant="subtle" size="xs">
              {{ item.available ? 'Available' : 'Not Found' }}
            </UBadge>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
