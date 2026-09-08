import type { PaperMetadata, CitationDynamics, ConceptTag, OpenScienceChecklist, CrossSourceEntry } from '~/types'

interface OpenAlexWork {
  id: string
  title: string
  publication_year: number
  cited_by_count: number
  counts_by_year: { year: number; cited_by_count: number }[]
  authorships: {
    author_position: 'first' | 'middle' | 'last'
    author: { id: string; display_name: string }
  }[]
  primary_location: {
    source?: { display_name: string }
    pdf_url?: string
    is_oa?: boolean
  } | null
  locations: {
    source?: { display_name: string; type?: string }
    is_oa?: boolean
    pdf_url?: string
    version?: string
  }[]
  open_access: {
    is_oa: boolean
    oa_status: 'gold' | 'green' | 'bronze' | 'hybrid' | 'closed'
    oa_url: string | null
  }
  concepts: {
    display_name: string
    level: number
    score: number
  }[]
}

export interface OpenAlexResult {
  metadata: PaperMetadata
  citations: CitationDynamics
  crossSource: CrossSourceEntry
  concepts: ConceptTag[]
  openScience: OpenScienceChecklist
}

function buildMetadata(work: OpenAlexWork, doi: string): PaperMetadata {
  const authors = (work.authorships || []).map(a => ({
    name: a.author.display_name,
    position: a.author_position
  }))

  const venue = work.primary_location?.source?.display_name || 'Unknown venue'

  return {
    doi,
    title: work.title || 'Untitled',
    authors,
    venue,
    year: work.publication_year,
    oaStatus: work.open_access?.oa_status || 'closed',
    oaUrl: work.open_access?.oa_url || null,
    pdfUrl: work.primary_location?.pdf_url || null
  }
}

function buildCitations(work: OpenAlexWork, selfCitations: number, selfCitationPercentage: number): CitationDynamics {
  const countsByYear = (work.counts_by_year || [])
    .map(c => ({ year: c.year, count: c.cited_by_count }))
    .sort((a, b) => a.year - b.year)

  const total = work.cited_by_count || 0
  const currentYear = new Date().getFullYear()
  const yearsActive = Math.max(1, currentYear - work.publication_year)
  const citPerYear = Math.round(total / yearsActive)

  // Growth: compare last 2 years available
  let growthPercentage = 0
  if (countsByYear.length >= 2) {
    const recent = countsByYear[countsByYear.length - 1]?.count ?? 0
    const previous = countsByYear[countsByYear.length - 2]?.count ?? 0
    if (previous > 0) {
      growthPercentage = Math.round(((recent - previous) / previous) * 1000) / 10
    }
  }

  // Peak year
  let peakYear = work.publication_year
  let peakCount = 0
  for (const entry of countsByYear) {
    if (entry.count > peakCount) {
      peakCount = entry.count
      peakYear = entry.year
    }
  }

  return {
    totalCitations: total,
    growthPercentage,
    citPerYear,
    influentialCitations: 0, // filled by Semantic Scholar
    selfCitations,
    selfCitationPercentage,
    countsByYear,
    peakYear,
    peakCount
  }
}

function buildConcepts(work: OpenAlexWork): ConceptTag[] {
  return (work.concepts || [])
    .filter(c => c.score > 0.3)
    .sort((a, b) => b.score - a.score)
    .map(c => ({
      name: c.display_name,
      level: c.level,
      score: c.score
    }))
}

function buildOpenScience(work: OpenAlexWork): OpenScienceChecklist {
  const hasOaPdf = work.open_access?.is_oa === true
  const locations = work.locations || []

  const hasRepository = locations.some(
    l => l.source?.type === 'repository' && l.is_oa
  )
  const hasPreprint = locations.some(
    l => l.version === 'submittedVersion' || l.source?.type === 'repository'
  )
  // Code repository heuristic: check if any location mentions github/gitlab
  const hasCode = locations.some(
    l => l.source?.display_name?.toLowerCase().includes('github')
      || l.source?.display_name?.toLowerCase().includes('gitlab')
  )

  const items = [
    { label: 'Open Access PDF', available: hasOaPdf, icon: 'i-lucide-file-text' },
    { label: 'Open Data Repository', available: hasRepository, icon: 'i-lucide-database' },
    { label: 'Code / Repository', available: hasCode, icon: 'i-lucide-code' },
    { label: 'Preprint Available', available: hasPreprint, icon: 'i-lucide-file-archive' }
  ]

  const score = items.filter(i => i.available).length

  return { items, score, total: 4 }
}

export async function fetchOpenAlexPaper(doi: string): Promise<OpenAlexResult> {
  const config = useRuntimeConfig()
  const apiKey = config.public.openAlexApiKey

  const select = 'id,title,publication_year,cited_by_count,counts_by_year,authorships,primary_location,locations,open_access,concepts'
  let url = `https://api.openalex.org/works/doi:${doi}?select=${select}`

  if (apiKey) {
    url += `&api_key=${apiKey}`
  }

  const work = await $fetch<OpenAlexWork>(url)
  
  // Compute self-citations
  let selfCitations = 0
  let selfCitationPercentage = 0
  
  const workId = work.id?.split('/').pop()
  const authorIds = (work.authorships || [])
    .map(a => a.author.id?.split('/').pop())
    .filter(Boolean)
    
  if (workId && authorIds.length > 0 && work.cited_by_count > 0) {
    try {
      const filter = `cites:${workId},author.id:${authorIds.join('|')}`
      let scUrl = `https://api.openalex.org/works?filter=${filter}&select=id&per_page=1`
      if (apiKey) scUrl += `&api_key=${apiKey}`
      
      const scData = await $fetch<any>(scUrl)
      selfCitations = scData.meta?.count || 0
      selfCitationPercentage = Math.round((selfCitations / work.cited_by_count) * 1000) / 10
    } catch (e) {
      console.warn(`Failed to fetch self-citations for ${doi}`, e)
    }
  }

  return {
    metadata: buildMetadata(work, doi),
    citations: buildCitations(work, selfCitations, selfCitationPercentage),
    crossSource: {
      source: 'OpenAlex',
      citations: work.cited_by_count || 0,
      coverage: 100
    },
    concepts: buildConcepts(work),
    openScience: buildOpenScience(work)
  }
}
