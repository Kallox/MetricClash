export interface CrossrefData {
  citationCount: number
}

export async function fetchCrossrefData(doi: string): Promise<CrossrefData> {
  const url = `https://api.crossref.org/works/${doi}`

  const response = await $fetch<{ message: { 'is-referenced-by-count'?: number } }>(url, {
    timeout: 8000,
    headers: {
      Accept: 'application/json',
      // Crossref asks for a User-Agent / mailto for their "polite pool" (faster rate limits)
      'User-Agent': 'PaperPulse/1.0 (https://github.com/PaperPulse; mailto:paperpulse@example.com)'
    }
  })

  return {
    citationCount: response.message?.['is-referenced-by-count'] ?? 0
  }
}
