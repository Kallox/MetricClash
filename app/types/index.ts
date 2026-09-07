export interface Author {
  name: string
  position: 'first' | 'middle' | 'last'
}

export interface PaperMetadata {
  doi: string
  title: string
  authors: Author[]
  venue: string
  year: number
  oaStatus: 'gold' | 'green' | 'bronze' | 'hybrid' | 'closed'
  oaUrl: string | null
  pdfUrl: string | null
}

export interface CitationDynamics {
  totalCitations: number
  growthPercentage: number
  citPerYear: number
  influentialCitations: number
  selfCitations: number
  selfCitationPercentage: number
  countsByYear: { year: number; count: number }[]
  peakYear: number
  peakCount: number
}

export interface CrossSourceEntry {
  source: 'OpenAlex' | 'Semantic Scholar' | 'Crossref'
  citations: number
  coverage: number
}

export interface ConceptTag {
  name: string
  level: number
  score: number
}

export interface OpenScienceItem {
  label: string
  available: boolean
  icon: string
}

export interface OpenScienceChecklist {
  items: OpenScienceItem[]
  score: number
  total: number
}

export interface DimensionsMetrics {
  timesCited: number
  recentCitations: number
  relativeCitationRatio: number
  fieldCitationRatio: number
}

export interface PaperProfile {
  metadata: PaperMetadata
  citations: CitationDynamics
  crossSource: CrossSourceEntry[]
  concepts: ConceptTag[]
  openScience: OpenScienceChecklist
  tldr: string | null
  dimensions: DimensionsMetrics | null
}

export interface ComparisonResult {
  paperA: PaperProfile
  paperB: PaperProfile
  peakGap: number
  retrievedAt: Date
}
