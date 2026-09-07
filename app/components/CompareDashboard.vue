<script setup lang="ts">
import type { ComparisonResult } from '~/types'

defineProps<{
  data: ComparisonResult
}>()
</script>

<template>
  <div class="py-4 text-center text-gray-400">
    <!-- Placeholder: dashboard components will be implemented in Part 4 -->
    <p class="text-sm">Dashboard data loaded successfully. Components coming in Part 4.</p>
    <pre class="mt-4 text-left text-xs bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-auto">{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>
