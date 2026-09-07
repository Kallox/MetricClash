# PaperPulse: Comparador Bibliométrico (100% Frontend)

## Descripción del Proyecto

PaperPulse es una aplicación web estática (SPA) diseñada para comparar perfiles de impacto de publicaciones académicas[cite: 2]. A partir de dos DOIs, la herramienta genera un panel comparativo lado a lado ("Face-off") que analiza la velocidad de citación, el impacto social, la accesibilidad y el contexto temático[cite: 2].

Todo el procesamiento y la obtención de datos ocurren directamente en el navegador del usuario, sin necesidad de un servidor o backend propio[cite: 2].

## Stack Tecnológico (Nuxt 3 - Client-Side Only)

El proyecto utilizará Nuxt 3 configurado como una aplicación de una sola página (`ssr: false`), donde el navegador asume todo el trabajo[cite: 2].

- **Framework Core:** Nuxt 3 (Vue.js 3, Composition API)[cite: 2].
- **Estilos y UI:** Tailwind CSS + Nuxt UI[cite: 2].
- **Visualización de Datos:** vue-chartjs o ECharts[cite: 2].
- **Gestor de Peticiones:** `useFetch` directamente desde los componentes (aprovechando el soporte CORS de las APIs académicas)[cite: 2].
- **Despliegue Estático:** GitHub Pages, Vercel o Netlify (alojamiento gratuito de archivos estáticos)[cite: 2].

## Integración de APIs (Llamadas directas desde el Cliente)

El navegador se comunicará directamente con estas fuentes abiertas que soportan CORS[cite: 2]:

1.  **OpenAlex API:** Metadatos, taxonomía, estado de acceso abierto y conteo de citas[cite: 2].
2.  **Semantic Scholar API:** Métricas de citas influyentes y tracción reciente[cite: 2].

## Arquitectura y Componentes Principales

- `nuxt.config.ts`: Configurado con `ssr: false` para asegurar que todo se ejecute en el cliente sin requerir un servidor Node.js[cite: 2].
- `pages/index.vue`: Layout principal con los inputs de DOI[cite: 2].
- `composables/useBibliometrics.ts`: Archivo clave con la lógica de negocio[cite: 2]. Aquí se ejecutarán los `fetch()` en paralelo a las APIs externas y se unificará el JSON antes de pasarlo a la interfaz[cite: 2].
- `components/CompareDashboard.vue`: Contenedor principal que recibe los datos procesados[cite: 2].
- `components/PaperColumn.vue`: Tarjeta visual con metadatos individuales[cite: 2].
- `components/MetricsComparison.vue`: Sección transversal con las gráficas alimentadas por los datos[cite: 2].

## Flujo de Datos (Sin Backend)

1. El usuario ingresa DOI A y DOI B[cite: 2].
2. El composable (`useBibliometrics`) ejecuta llamadas a las APIs externas directamente desde el navegador de forma asíncrona[cite: 2].
3. El propio cliente recibe, filtra y normaliza los datos de las distintas fuentes en memoria[cite: 2].
4. La interfaz reactiva de Vue actualiza el dashboard instantáneamente[cite: 2].
