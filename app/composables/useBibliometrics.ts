import type { ComparisonResult, PaperProfile } from '~/types'
import { fetchOpenAlexPaper } from './useOpenAlex'
import { fetchSemanticScholarPaper } from './useSemanticScholar'
import { fetchDimensionsData, type DimensionsData } from './useDimensions'
import { fetchCrossrefData, type CrossrefData } from './useCrossref'

const profileCache = new Map<string, PaperProfile>()

export function useBibliometrics() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<ComparisonResult | null>(null)

  async function compare(doiA: string, doiB: string) {
    loading.value = true
    error.value = null
    data.value = null

    try {
      let paperA = profileCache.get(doiA)
      let paperB = profileCache.get(doiB)

      const fetchA = !paperA
      const fetchB = !paperB

      // Run all necessary API calls in parallel
      const [oaA, oaB, s2A, s2B, dimA, dimB, crA, crB] = await Promise.allSettled([
        fetchA ? fetchOpenAlexPaper(doiA) : Promise.reject('cached'),
        fetchB ? fetchOpenAlexPaper(doiB) : Promise.reject('cached'),
        fetchA ? fetchSemanticScholarPaper(doiA) : Promise.reject('cached'),
        fetchB ? fetchSemanticScholarPaper(doiB) : Promise.reject('cached'),
        fetchA ? fetchDimensionsData(doiA) : Promise.reject('cached'),
        fetchB ? fetchDimensionsData(doiB) : Promise.reject('cached'),
        fetchA ? fetchCrossrefData(doiA) : Promise.reject('cached'),
        fetchB ? fetchCrossrefData(doiB) : Promise.reject('cached')
      ])

      const s2DataA = s2A.status === 'fulfilled' ? s2A.value : null
      const s2DataB = s2B.status === 'fulfilled' ? s2B.value : null
      const dimDataA = dimA.status === 'fulfilled' ? dimA.value : null
      const dimDataB = dimB.status === 'fulfilled' ? dimB.value : null
      const crDataA = crA.status === 'fulfilled' ? crA.value : null
      const crDataB = crB.status === 'fulfilled' ? crB.value : null

      // OpenAlex is the primary source — if it fails, fallback to Semantic Scholar
      if (!paperA) {
        let openAlexA
        if (oaA.status === 'fulfilled') {
          openAlexA = oaA.value
        } else if (s2DataA) {
          openAlexA = fallbackOpenAlex(s2DataA, doiA)
        } else {
          throw new Error(`Could not fetch Paper A from OpenAlex or Semantic Scholar`)
        }
        paperA = mergeProfile(openAlexA, s2DataA, dimDataA, crDataA)
        calculateCoverage(paperA)
        profileCache.set(doiA, paperA)
      }

      if (!paperB) {
        let openAlexB
        if (oaB.status === 'fulfilled') {
          openAlexB = oaB.value
        } else if (s2DataB) {
          openAlexB = fallbackOpenAlex(s2DataB, doiB)
        } else {
          throw new Error(`Could not fetch Paper B from OpenAlex or Semantic Scholar`)
        }
        paperB = mergeProfile(openAlexB, s2DataB, dimDataB, crDataB)
        calculateCoverage(paperB)
        profileCache.set(doiB, paperB)
      }

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

function fallbackOpenAlex(s2: import('./useSemanticScholar').SemanticScholarResult, doi: string): import('./useOpenAlex').OpenAlexResult {
  return {
    metadata: {
      doi,
      title: s2.title,
      authors: s2.authors.map((a, i) => ({
        name: a.name,
        position: i === 0 ? 'first' : i === s2.authors.length - 1 ? 'last' : 'middle'
      })),
      venue: s2.venue,
      year: s2.year,
      oaStatus: s2.isOpenAccess ? 'gold' : 'closed',
      oaUrl: s2.openAccessPdf?.url || null,
      pdfUrl: s2.openAccessPdf?.url || null
    },
    citations: {
      totalCitations: s2.citationCount,
      growthPercentage: 0,
      citPerYear: Math.round(s2.citationCount / Math.max(1, new Date().getFullYear() - s2.year)),
      influentialCitations: s2.influentialCitationCount,
      selfCitations: 0,
      selfCitationPercentage: 0,
      countsByYear: [],
      peakYear: s2.year,
      peakCount: 0
    },
    crossSource: {
      source: 'OpenAlex',
      citations: 0, // Fallback implies it wasn't found in OpenAlex
      coverage: 0
    },
    concepts: s2.s2FieldsOfStudy.map(c => ({
      name: c.category,
      level: 1,
      score: 1.0
    })),
    openScience: {
      items: [
        { label: 'Open Access PDF', available: !!s2.openAccessPdf, icon: 'i-lucide-file-text' },
        { label: 'Open Data Repository', available: false, icon: 'i-lucide-database' },
        { label: 'Code / Repository', available: false, icon: 'i-lucide-code' },
        { label: 'Preprint Available', available: false, icon: 'i-lucide-file-archive' }
      ],
      score: !!s2.openAccessPdf ? 1 : 0,
      total: 4
    }
  }
}

function mergeProfile(
  oa: Awaited<ReturnType<typeof fetchOpenAlexPaper>>,
  s2: Awaited<ReturnType<typeof fetchSemanticScholarPaper>> | null,
  dim: DimensionsData | null,
  cr: CrossrefData | null
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
      citations: cr?.citationCount ?? 0,
      coverage: 0
    }
  ]

  return {
    metadata: oa.metadata,
    citations,
    crossSource,
    concepts: oa.concepts,
    openScience: oa.openScience,
    tldr: s2?.tldr || null,
    dimensions: dim ? {
      timesCited: dim.times_cited,
      recentCitations: dim.recent_citations,
      relativeCitationRatio: dim.relative_citation_ratio,
      fieldCitationRatio: dim.field_citation_ratio
    } : null
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
