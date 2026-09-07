<template>
  <div class="space-y-8">
    <!-- Paper cards skeleton -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div v-for="i in 2" :key="i" class="rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <div class="flex gap-2">
          <div class="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div class="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
        <div class="h-7 w-3/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div class="h-4 w-full rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div class="h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div class="h-3 w-1/3 rounded bg-gray-100 dark:bg-gray-800 animate-pulse mt-4" />
      </div>
    </div>

    <!-- Citation dynamics skeleton -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div v-for="i in 2" :key="i" class="space-y-4">
        <div class="h-4 w-36 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div class="rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse h-32" />
        <div class="grid grid-cols-2 gap-4">
          <div class="h-20 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
          <div class="h-20 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>
    </div>

    <!-- Chart skeleton -->
    <div class="rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
      <div class="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div class="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div class="h-80 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
      <div class="grid grid-cols-3 gap-4">
        <div class="h-16 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div class="h-16 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div class="h-16 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
    </div>

    <!-- Open science skeleton -->
    <div class="rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
      <div class="h-4 w-52 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <div v-for="i in 2" :key="i" class="space-y-3">
          <div class="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div v-for="j in 4" :key="j" class="h-10 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>
    </div>
  </div>
</template>
