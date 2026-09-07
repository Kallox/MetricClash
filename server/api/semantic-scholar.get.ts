export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const doi = query.doi as string

  if (!doi) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required query parameter: doi'
    })
  }

  const config = useRuntimeConfig()
  const apiKey = config.semanticScholarApiKey

  const fields = [
    'title',
    'authors',
    'venue',
    'year',
    'citationCount',
    'influentialCitationCount',
    'isOpenAccess',
    'openAccessPdf',
    'tldr',
    's2FieldsOfStudy',
    'externalIds'
  ].join(',')

  const url = `https://api.semanticscholar.org/graph/v1/paper/DOI:${doi}?fields=${fields}`

  const headers: Record<string, string> = {}
  if (apiKey) {
    headers['x-api-key'] = apiKey
  }

  try {
    const data = await $fetch(url, { headers })
    return data
  }
  catch (error: any) {
    const status = error?.response?.status || error?.statusCode || 500

    if (status === 404) {
      throw createError({
        statusCode: 404,
        statusMessage: `Paper not found on Semantic Scholar for DOI: ${doi}`
      })
    }

    if (status === 429) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Semantic Scholar API rate limited. Please wait and try again.'
      })
    }

    throw createError({
      statusCode: status,
      statusMessage: `Semantic Scholar API error: ${error?.message || 'Unknown error'}`
    })
  }
})
