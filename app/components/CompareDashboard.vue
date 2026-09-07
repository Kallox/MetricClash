<script setup lang="ts">
import type { ComparisonResult } from '~/types'

defineProps<{
  data: ComparisonResult
}>()
</script>

<template>
  <div class="space-y-12 pb-12">
    
    <!-- 1. Paper Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <PaperCard :paper="data.paperA" variant="a" />
      <PaperCard :paper="data.paperB" variant="b" />
    </div>

    <!-- 2. Citation Dynamics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <CitationDynamics :citations="data.paperA.citations" variant="a" />
      <CitationDynamics :citations="data.paperB.citations" variant="b" />
    </div>

    <!-- 3. Cross-Source Aggregation -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <CrossSourceTable :sources="data.paperA.crossSource" variant="a" />
      <CrossSourceTable :sources="data.paperB.crossSource" variant="b" />
    </div>

    <!-- 4. Primary Concepts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <ConceptTags :concepts="data.paperA.concepts" variant="a" />
      <ConceptTags :concepts="data.paperB.concepts" variant="b" />
    </div>

    <!-- 4.5 Dimensions Metrics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-12 border-t border-gray-100 dark:border-gray-800 pt-12">
      <DimensionsMetrics variant="a" :data="data.paperA.dimensions" />
      <DimensionsMetrics variant="b" :data="data.paperB.dimensions" />
    </div>

    <!-- 5. Citation Timeline (Full Width) -->
    <div class="w-full pt-4">
      <CitationTimeline :paper-a="data.paperA" :paper-b="data.paperB" />
    </div>

    <!-- 6. Open Science Checklist (Full Width wrapper) -->
    <div class="w-full pt-4">
      <OpenScienceChecklist :paper-a="data.paperA" :paper-b="data.paperB" />
    </div>
    
  </div>
</template>
