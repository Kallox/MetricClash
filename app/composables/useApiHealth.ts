export function useApiHealth() {
  const openAlexOnline = ref(false)
  const semanticScholarOnline = ref(false)

  async function checkHealth() {
    // Check OpenAlex (direct browser call)
    try {
      await $fetch('https://api.openalex.org/works?per_page=1', {
        timeout: 5000
      })
      openAlexOnline.value = true
    }
    catch {
      openAlexOnline.value = false
    }

    // Check Semantic Scholar (via Nitro proxy)
    try {
      await $fetch('/api/semantic-scholar', {
        query: { doi: '10.1038/s41586-020-2649-2' },
        timeout: 5000
      })
      semanticScholarOnline.value = true
    }
    catch {
      semanticScholarOnline.value = false
    }
  }

  // Run health check on first call
  if (import.meta.client) {
    checkHealth()
  }

  return { openAlexOnline, semanticScholarOnline, checkHealth }
}
