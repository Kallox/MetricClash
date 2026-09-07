import type { ComparisonResult, PaperProfile } from '~/types'
import { fetchOpenAlexPaper } from './useOpenAlex'
import { fetchSemanticScholarPaper } from './useSemanticScholar'

export function useBibliometrics() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<ComparisonResult | null>(null)

  async function compare(doiA: string, doiB: string) {
    loading.value = true
    error.value = null
    data.value = null

    try {
      // Run all 4 API calls in parallel
      const [oaA, oaB, s2A, s2B] = await Promise.allSettled([
        fetchOpenAlexPaper(doiA),
        fetchOpenAlexPaper(doiB),
        fetchSemanticScholarPaper(doiA),
        fetchSemanticScholarPaper(doiB)
      ])

      // OpenAlex is required — fail if either paper not found
      if (oaA.status === 'rejected') {
        throw new Error(`Could not fetch Paper A from OpenAlex: ${oaA.reason?.message || 'Unknown error'}`)
      }
      if (oaB.status === 'rejected') {
        throw new Error(`Could not fetch Paper B from OpenAlex: ${oaB.reason?.message || 'Unknown error'}`)
      }

      const openAlexA = oaA.value
      const openAlexB = oaB.value

      // Semantic Scholar is optional — use defaults if failed
      const s2DataA = s2A.status === 'fulfilled' ? s2A.value : null
      const s2DataB = s2B.status === 'fulfilled' ? s2B.value : null

      // Build profiles by merging both sources
      const paperA = mergeProfile(openAlexA, s2DataA)
      const paperB = mergeProfile(openAlexB, s2DataB)

      // Calculate cross-source coverage percentages
      calculateCoverage(paperA)
      calculateCoverage(paperB)

      // Peak gap: difference of citations at the peak year
      const peakGap = Math.abs(paperA.citations.peakCount - paperB.citations.peakCount)

      data.value = {
        paperA,
        paperB,
        peakGap,
        retrievedAt: new Date()
      }
    }
    catch (err: any) {
      error.value = err.message || 'An unexpected error occurred'
    }
    finally {
      loading.value = false
    }
  }

  return { loading, error, data, compare }
}

function mergeProfile(
  oa: Awaited<ReturnType<typeof fetchOpenAlexPaper>>,
  s2: Awaited<ReturnType<typeof fetchSemanticScholarPaper>> | null
): PaperProfile {
  const citations = { ...oa.citations }

  // Enrich with Semantic Scholar data
  if (s2) {
    citations.influentialCitations = s2.influentialCitationCount
  }

  // Build cross-source entries
  const crossSource = [
    oa.crossSource,
    {
      source: 'Semantic Scholar' as const,
      citations: s2?.citationCount || 0,
      coverage: 0 // calculated later
    },
    {
      source: 'Crossref' as const,
      citations: 0, // placeholder
      coverage: 0
    }
  ]

  return {
    metadata: oa.metadata,
    citations,
    crossSource,
    concepts: oa.concepts,
    openScience: oa.openScience,
    tldr: s2?.tldr || null
  }
}

function calculateCoverage(profile: PaperProfile) {
  const maxCitations = Math.max(
    ...profile.crossSource
      .filter(s => s.citations > 0)
      .map(s => s.citations),
    1
  )

  for (const source of profile.crossSource) {
    if (source.citations > 0) {
      source.coverage = Math.round((source.citations / maxCitations) * 1000) / 10
    }
  }
}
