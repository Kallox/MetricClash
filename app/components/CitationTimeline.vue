<script setup lang="ts">
import { computed } from 'vue'
import type { PaperProfile } from '~/types'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent])

const props = defineProps<{
  paperA: PaperProfile
  paperB: PaperProfile
}>()

const chartOption = computed(() => {
  const countsA = props.paperA.citations.countsByYear
  const countsB = props.paperB.citations.countsByYear

  // Get all unique years across both papers
  const allYears = new Set([...countsA.map(c => c.year), ...countsB.map(c => c.year)])
  const years = Array.from(allYears).sort((a, b) => a - b)

  const dataA = years.map(y => {
    const entry = countsA.find(c => c.year === y)
    return entry ? entry.count : 0
  })

  const dataB = years.map(y => {
    const entry = countsB.find(c => c.year === y)
    return entry ? entry.count : 0
  })

  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e5e7eb',
      textStyle: { color: '#374151' }
    },
    legend: {
      data: ['Paper A', 'Paper B'],
      right: 0,
      top: 0,
      icon: 'circle'
    },
    grid: {
      left: '0%',
      right: '2%',
      bottom: '0%',
      top: '40px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: years,
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#6b7280' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
      axisLabel: {
        color: '#6b7280',
        formatter: (value: number) => {
          if (value >= 1000) return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
          return value
        }
      }
    },
    series: [
      {
        name: 'Paper A',
        type: 'line',
        smooth: true,
        showSymbol: true,
        symbolSize: 6,
        lineStyle: { width: 3 },
        color: '#3B82F6', // Blue
        data: dataA
      },
      {
        name: 'Paper B',
        type: 'line',
        smooth: true,
        showSymbol: true,
        symbolSize: 6,
        lineStyle: { width: 3 },
        color: '#10B981', // Emerald
        data: dataB
      }
    ]
  }
})

// Helper to format numbers
function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

const peakGap = computed(() => {
  return Math.abs(props.paperA.citations.peakCount - props.paperB.citations.peakCount)
})

const startYear = computed(() => {
  const years = chartOption.value.xAxis.data
  return years.length > 0 ? years[0] : 0
})

const endYear = computed(() => {
  const years = chartOption.value.xAxis.data
  return years.length > 0 ? years[years.length - 1] : 0
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
      <div>
        <h4 class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          Citation Timeline &middot; Annual Counts
        </h4>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Citations Over Time
        </h2>
        <p class="text-xs text-gray-500 mt-1 font-mono">
          Source: OpenAlex &middot; calendar-year aggregation &middot; {{ startYear }}–{{ endYear }}
        </p>
      </div>
    </div>

    <!-- Chart -->
    <div class="w-full h-[350px] bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      <ClientOnly>
        <VChart class="w-full h-full" :option="chartOption" autoresize />
        <template #fallback>
          <div class="w-full h-full flex items-center justify-center text-gray-400">
            <UIcon name="i-lucide-loader-2" class="animate-spin text-2xl" />
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
      <div class="text-center">
        <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Paper A Peak Year</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ paperA.citations.peakYear }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ formatNumber(paperA.citations.peakCount) }} citations</p>
      </div>
      
      <div class="text-center">
        <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Paper B Peak Year</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ paperB.citations.peakYear }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ formatNumber(paperB.citations.peakCount) }} citations</p>
      </div>
      
      <div class="text-center">
        <p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">&Delta; Peak Gap</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatNumber(peakGap) }}</p>
        <p class="text-xs text-gray-500 mt-1">citations &middot; same year</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure chart takes full height */
.echarts {
  width: 100%;
  height: 100%;
}
</style>
