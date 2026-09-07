export interface SemanticScholarResult {
  citationCount: number
  influentialCitationCount: number
  tldr: string | null
  isOpenAccess: boolean
}

interface S2Response {
  citationCount?: number
  influentialCitationCount?: number
  tldr?: { text: string } | null
  isOpenAccess?: boolean
}

export async function fetchSemanticScholarPaper(doi: string): Promise<SemanticScholarResult> {
  const data = await $fetch<S2Response>('/api/semantic-scholar', {
    query: { doi }
  })

  return {
    citationCount: data.citationCount || 0,
    influentialCitationCount: data.influentialCitationCount || 0,
    tldr: data.tldr?.text || null,
    isOpenAccess: data.isOpenAccess || false
  }
}
