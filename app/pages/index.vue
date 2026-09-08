<script setup lang="ts">
const { loading, error, data, compare } = useBibliometrics()

const doiA = ref('')
const doiB = ref('')

const doiRegex = /^10\.\d{4,9}\/[^\s]+$/i
const isDoiAValid = computed(() => doiRegex.test(doiA.value.trim()))
const isDoiBValid = computed(() => doiRegex.test(doiB.value.trim()))
const canSubmit = computed(() => isDoiAValid.value && isDoiBValid.value && !loading.value)

const showResults = computed(() => data.value !== null || loading.value || error.value !== null)

async function handleCompare() {
  if (!canSubmit.value) return
  await compare(doiA.value.trim(), doiB.value.trim())
}

function resetQuery() {
  doiA.value = ''
  doiB.value = ''
  data.value = null
  error.value = null
}

function swapDois() {
  const temp = doiA.value
  doiA.value = doiB.value
  doiB.value = temp
}
</script>

<template>
  <div>
    <!-- Results bar -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="showResults && data"
        class="sticky top-16 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md"
      >
        <UContainer>
          <div class="flex items-center justify-between py-3">
            <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Comparison Results
            </span>

            <div class="flex items-center gap-2">
              <UBadge variant="subtle" color="primary" size="xs" class="gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Paper A · {{ data.paperA.metadata.venue }} {{ data.paperA.metadata.year }}
              </UBadge>
              <UBadge variant="subtle" color="neutral" size="xs" class="gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Paper B · {{ data.paperB.metadata.venue }} {{ data.paperB.metadata.year }}
              </UBadge>
            </div>

            <UButton
              label="New Query"
              icon="i-lucide-arrow-left"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="resetQuery"
            />
          </div>
        </UContainer>
      </div>
    </Transition>

    <!-- Hero Section -->
    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 translate-y-8"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0 max-h-[800px]"
      leave-to-class="opacity-0 -translate-y-8 max-h-0"
    >
      <section
        v-if="!showResults"
        class="py-10 md:py-16 overflow-hidden"
      >
        <UContainer class="flex flex-col items-center text-center">
          <!-- Version badge -->
          <div class="inline-flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 mb-8">
            <span class="w-2 h-2 rounded-full bg-emerald-500" />
            <span class="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">
              Bibliometric Comparison Engine · V1.0
            </span>
          </div>

          <!-- Heading -->
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white max-w-4xl leading-tight">
            Compare Research Impact Across Publications
          </h1>

          <!-- Subtitle -->
          <p class="mt-6 text-lg text-gray-500 dark:text-gray-400 max-w-4xl leading-relaxed">
            Enter two DOIs to retrieve citation dynamics, cross-source coverage,
            concept taxonomies, and open science indicators — sourced from
            OpenAlex and Semantic Scholar.
          </p>

          <!-- Input Card -->
          <div class="mt-12 w-full max-w-2xl">
            <UCard class="shadow-xl ring-1 ring-gray-200 dark:ring-gray-800">
              <div class="flex flex-col gap-4 p-2">
                <!-- DOI A -->
                <div class="relative">
                  <UInput
                    v-model="doiA"
                    placeholder="10.48550/arXiv.1706.03762"
                    size="xl"
                    class="w-full"
                    :ui="{ base: 'pl-12' }"
                  />
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                    A
                  </span>
                </div>

                <!-- Swap button -->
                <div class="flex justify-center">
                  <button
                    type="button"
                    class="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    @click="swapDois"
                  >
                    <UIcon name="i-lucide-arrow-up-down" class="text-lg" />
                  </button>
                </div>

                <!-- DOI B -->
                <div class="relative">
                  <UInput
                    v-model="doiB"
                    placeholder="10.18653/v1/N19-1423"
                    size="xl"
                    class="w-full"
                    :ui="{ base: 'pl-12' }"
                  />
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                    B
                  </span>
                </div>

                <!-- Submit -->
                <UButton
                  block
                  size="xl"
                  :loading="loading"
                  :disabled="!canSubmit"
                  class="mt-2"
                  @click="handleCompare"
                >
                  <UIcon name="i-lucide-arrow-right" />
                  Analyze & Compare Profiles
                </UButton>

                <!-- Card footer -->
                <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span class="text-xs text-gray-400">
                    OpenAlex · Semantic Scholar
                  </span>
                  <span class="flex items-center gap-1.5 text-xs text-gray-400">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    APIs Online
                  </span>
                </div>
              </div>
            </UCard>
          </div>
        </UContainer>
      </section>
    </Transition>

    <!-- Results Section -->
    <Transition
      enter-active-class="transition-all duration-500 ease-out delay-200"
      enter-from-class="opacity-0 translate-y-8"
      enter-to-class="opacity-100 translate-y-0"
    >
      <section v-if="showResults" class="py-8">
        <UContainer>
          <SkeletonDashboard v-if="loading" />
          <ErrorState
            v-else-if="error"
            :message="error"
            :on-retry="() => handleCompare()"
          />
          <CompareDashboard
            v-else-if="data"
            :data="data"
          />
        </UContainer>
      </section>
    </Transition>
  </div>
</template>
