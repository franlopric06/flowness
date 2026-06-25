import { Helmet } from 'react-helmet-async'

function SEO({ titulo, descripcion, url }) {
  const base = 'https://flowness-git-main-fran-lopez-s-projects.vercel.app'

  return (
    <Helmet>
      {/* Titulo */}
      <title>{titulo} | Flowness</title>

      {/* Descripcion */}
      <meta name="description" content={descripcion} />

      {/* Canonical */}
      <link rel="canonical" href={`${base}${url}`} />

      {/* Open Graph */}
      <meta property="og:title" content={`${titulo} | Flowness`} />
      <meta property="og:description" content={descripcion} />
      <meta property="og:url" content={`${base}${url}`} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${base}/logo.png`} />

      {/* Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  )
}

export default SEO