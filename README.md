# PaperPulse 📊

**PaperPulse** is a bibliometric comparison engine designed to contrast the impact profiles of academic publications side-by-side in a "Face-off" style dashboard.

By entering two DOIs, PaperPulse generates an interactive dashboard that fetches real-time data from multiple open knowledge bases. It provides insights into citation dynamics, alternative metrics, concept taxonomies, and Open Science indicators.

### 🌐 Integrated APIs
- **[OpenAlex](https://openalex.org/):** Metadata, concept taxonomy, Open Access status, and baseline citation counts.
- **[Semantic Scholar](https://www.semanticscholar.org/):** Highly influential citations, intelligent summaries (TLDR), and recent traction.
- **[Dimensions](https://www.dimensions.ai/):** Alternative metrics such as Relative Citation Ratio (RCR), Field Citation Ratio (FCR), and recent citations.

### 🛠️ Tech Stack
- **Framework:** Nuxt 3 (Vue 3, Composition API)
- **Styling & UI:** Tailwind CSS + Nuxt UI
- **Charts:** ECharts
- **Architecture:** Client-side fetching coupled with a Nuxt Nitro Proxy layer to bypass CORS restrictions for specific APIs.

---

## 🚀 Quick Start (Local Setup)

Ensure you have **Node.js 18+** and **pnpm** installed.

**1. Clone and install dependencies:**
```bash
git clone <REPOSITORY_URL>
cd paperpulse
pnpm install
```

**2. Environment variables (Optional):**
Create a `.env` file for your API keys to prevent rate-limiting:
```env
NUXT_PUBLIC_OPEN_ALEX_API_KEY=your_openalex_key
NUXT_SEMANTIC_SCHOLAR_API_KEY=your_semanticscholar_key
```

**3. Run the development server:**
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

**4. Build for production:**
```bash
pnpm build
node .output/server/index.mjs
```
