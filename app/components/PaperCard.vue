<script setup lang="ts">
import type { PaperProfile } from '~/types'

const props = defineProps<{
  paper: PaperProfile
  variant: 'a' | 'b'
}>()

const borderColor = computed(() =>
  props.variant === 'a' ? 'border-l-blue-500' : 'border-l-emerald-500'
)

const badgeColor = computed(() =>
  props.variant === 'a' ? 'primary' : 'success' as const
)

const oaBadgeColor = computed(() => {
  const status = props.paper.metadata.oaStatus
  if (status === 'gold') return 'warning'
  if (status === 'green') return 'success'
  if (status === 'bronze') return 'warning'
  if (status === 'hybrid') return 'info'
  return 'neutral'
})

const oaLabel = computed(() => {
  const status = props.paper.metadata.oaStatus
  return status.charAt(0).toUpperCase() + status.slice(1) + ' OA'
})

const displayAuthors = computed(() => {
  const authors = props.paper.metadata.authors
  const shown = authors.slice(0, 4).map((a) => {
    const parts = a.name.split(' ')
    if (parts.length >= 2) {
      const last = parts[parts.length - 1]
      const initials = parts.slice(0, -1).map(p => p[0] + '.').join(' ')
      return `${last}, ${initials}`
    }
    return a.name
  })
  const extra = authors.length - 4
  if (extra > 0) {
    shown.push(`+${extra} more`)
  }
  return shown.join(', ')
})
</script>

<template>
  <div
    class="rounded-xl border border-gray-200 dark:border-gray-800 p-6 border-l-4 transition-all duration-200 hover:shadow-md"
    :class="borderColor"
  >
    <!-- Badges -->
    <div class="flex items-center gap-2 mb-4">
      <UBadge :color="badgeColor" variant="outline" size="xs" class="font-semibold uppercase tracking-wider">
        Paper {{ variant.toUpperCase() }}
      </UBadge>
      <UBadge v-if="paper.metadata.oaStatus !== 'closed'" :color="oaBadgeColor" variant="subtle" size="xs">
        <span class="w-1.5 h-1.5 rounded-full bg-current mr-1" />
        {{ oaLabel }}
      </UBadge>
    </div>

    <!-- Title -->
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white leading-snug mb-3">
      {{ paper.metadata.title }}
    </h3>

    <!-- Authors -->
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
      {{ displayAuthors }}
    </p>

    <!-- Venue + Year -->
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ paper.metadata.venue }}
        </p>
        <p class="text-xs text-gray-400">
          {{ paper.metadata.year }}
        </p>
      </div>
    </div>

    <!-- DOI -->
    <p class="mt-4 text-xs text-gray-400 font-mono">
      doi:{{ paper.metadata.doi }}
    </p>
  </div>
</template>
