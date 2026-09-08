export interface SemanticScholarResult {
  title: string
  authors: { name: string }[]
  venue: string
  year: number
  citationCount: number
  influentialCitationCount: number
  tldr: string | null
  isOpenAccess: boolean
  openAccessPdf: { url: string } | null
  s2FieldsOfStudy: { category: string }[]
}

interface S2Response {
  title?: string
  authors?: { name: string }[]
  venue?: string
  year?: number
  citationCount?: number
  influentialCitationCount?: number
  tldr?: { text: string } | null
  isOpenAccess?: boolean
  openAccessPdf?: { url: string } | null
  s2FieldsOfStudy?: { category: string }[]
}

export async function fetchSemanticScholarPaper(doi: string): Promise<SemanticScholarResult> {
  const data = await $fetch<S2Response>('/api/semantic-scholar', {
    query: { doi }
  })

  return {
    title: data.title || 'Untitled',
    authors: data.authors || [],
    venue: data.venue || 'Unknown venue',
    year: data.year || new Date().getFullYear(),
    citationCount: data.citationCount || 0,
    influentialCitationCount: data.influentialCitationCount || 0,
    tldr: data.tldr?.text || null,
    isOpenAccess: data.isOpenAccess || false,
    openAccessPdf: data.openAccessPdf || null,
    s2FieldsOfStudy: data.s2FieldsOfStudy || []
  }
}
