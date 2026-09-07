<script setup lang="ts">
defineProps<{
  message: string
  onRetry: () => void
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-24 text-center">
    <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
      <UIcon name="i-lucide-alert-circle" class="text-3xl text-red-500" />
    </div>

    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      Something went wrong
    </h2>

    <p class="text-gray-500 dark:text-gray-400 max-w-md mb-8">
      {{ message }}
    </p>

    <UButton
      label="Try Again"
      icon="i-lucide-refresh-cw"
      size="lg"
      @click="onRetry"
    />
  </div>
</template>
