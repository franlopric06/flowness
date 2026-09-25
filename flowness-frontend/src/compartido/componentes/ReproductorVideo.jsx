import { obtenerIdYoutube } from '../utilidades/video'

// Muestra un video de YouTube (No listado) o un archivo de video directo.
// Usa youtube-nocookie para no cargar cookies de seguimiento de YouTube.
function ReproductorVideo({ url, titulo = 'Video' }) {
  if (!url) {
    return (
      <div className="aspect-video w-full rounded-xl bg-[#F5F0EB] flex items-center justify-center">
        <p className="text-[#A9A9A2] text-sm">El video estará disponible próximamente.</p>
      </div>
    )
  }

  const idYoutube = obtenerIdYoutube(url)

  if (idYoutube) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${idYoutube}?rel=0&modestbranding=1`}
          title={titulo}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    )
  }

  return <video src={url} controls controlsList="nodownload" className="aspect-video w-full rounded-xl bg-black" />
}

export default ReproductorVideo
