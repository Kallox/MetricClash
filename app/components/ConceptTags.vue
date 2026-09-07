<script setup lang="ts">
import type { ConceptTag } from '~/types'

const props = defineProps<{
  concepts: ConceptTag[]
  variant: 'a' | 'b'
}>()

const primaryColor = computed(() =>
  props.variant === 'a' ? 'primary' : 'success'
)

// Split concepts into level 2 (primary) and level 0 (broad)
const level2Concepts = computed(() => {
  return props.concepts.filter(c => c.level >= 1).slice(0, 8)
})

const level0Concepts = computed(() => {
  return props.concepts
    .filter(c => c.level === 0)
    .map(c => c.name)
    .join(' · ')
})
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <h4 class="text-xs font-semibold uppercase tracking-widest text-gray-400">
      Primary Concepts &middot; OpenAlex L2
    </h4>

    <!-- Tags Container -->
    <div class="flex flex-wrap gap-2">
      <UBadge
        v-for="(concept, index) in level2Concepts"
        :key="concept.name"
        :color="primaryColor"
        :variant="index === 0 ? 'solid' : 'outline'"
        size="sm"
        class="rounded-full"
      >
        {{ concept.name }}
      </UBadge>
      
      <span v-if="level2Concepts.length === 0" class="text-sm text-gray-500 italic">
        No specific concepts identified
      </span>
    </div>

    <!-- Broad concepts footer -->
    <div v-if="level0Concepts" class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="name in level0Concepts.split(' · ')" 
          :key="name"
          class="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded"
        >
          {{ name }}
        </span>
      </div>
    </div>
  </div>
</template>
