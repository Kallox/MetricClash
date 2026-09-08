<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'MetricClash — Bibliometric Comparison Engine'
const description = 'Compare research impact across publications. Analyze citation dynamics, cross-source coverage, concept taxonomies, and open science indicators using OpenAlex, Semantic Scholar, Crossref, and Dimensions.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})

const { openAlexOnline, semanticScholarOnline } = useApiHealth()
const allApisOnline = computed(() => openAlexOnline.value && semanticScholarOnline.value)

const apiSourcesList = [
  [
    { label: 'OpenAlex', icon: 'i-lucide-database', to: 'https://openalex.org', target: '_blank' },
    { label: 'Semantic Scholar', icon: 'i-lucide-book-open', to: 'https://semanticscholar.org', target: '_blank' },
    { label: 'Crossref', icon: 'i-lucide-link', to: 'https://crossref.org', target: '_blank' },
    { label: 'Dimensions', icon: 'i-lucide-bar-chart-2', to: 'https://dimensions.ai', target: '_blank' }
  ]
]
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-2.5 focus-visible:outline-2 outline-primary/25 rounded-md p-1 -ms-1"
        >
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <UIcon name="i-lucide-bar-chart-3" class="text-white text-lg" />
          </div>
          <span class="text-lg font-bold text-gray-900 dark:text-white">MetricClash</span>
        </NuxtLink>

        <UBadge
          variant="subtle"
          color="neutral"
          size="xs"
          class="font-mono tracking-wide hidden sm:inline-flex"
        >
          Literature Insight & Bibliometrics
        </UBadge>
      </template>

      <template #right>
        <UDropdownMenu :items="apiSourcesList" :content="{ align: 'end', side: 'bottom' }" class="hidden md:inline-flex">
          <UButton
            label="API Sources"
            color="neutral"
            variant="ghost"
            size="sm"
            trailing-icon="i-lucide-chevron-down"
          />
        </UDropdownMenu>

        <UColorModeButton />

        <UButton
          to="https://github.com/Kallox/MetricClash"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <UIcon name="i-lucide-bar-chart-3" class="text-white text-[10px]" />
            </div>
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">MetricClash</span>
          </div>
          <USeparator orientation="vertical" class="h-4" />
          <p class="text-sm text-muted">
            Data sourced from OpenAlex · Semantic Scholar · Crossref · Dimensions
          </p>
        </div>
      </template>

      <template #right>
        <div class="flex items-center gap-3 text-sm">
          <span class="flex items-center gap-1.5">
            <span
              class="w-2 h-2 rounded-full"
              :class="allApisOnline ? 'bg-emerald-500' : 'bg-amber-500'"
            />
            <span class="text-muted">
              {{ allApisOnline ? 'All APIs Operational' : 'API Issues' }}
            </span>
          </span>
        </div>
      </template>
    </UFooter>
  </UApp>
</template>
