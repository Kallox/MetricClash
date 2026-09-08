export interface DimensionsData {
  times_cited: number;
  recent_citations: number;
  relative_citation_ratio: number;
  field_citation_ratio: number;
}

export async function fetchDimensionsData(doi: string): Promise<DimensionsData | null> {
  try {
    const url = `https://metrics-api.dimensions.ai/doi/${doi}`;
    
    const data = await $fetch<DimensionsData>(url, {
      timeout: 5000,
      headers: {
        Accept: 'application/json'
      }
    });
    
    return data;
  } catch (err) {
    console.warn(`Could not fetch Dimensions data for ${doi}, returning fallback/placeholder.`, err);
    
    return null;
  }
}
