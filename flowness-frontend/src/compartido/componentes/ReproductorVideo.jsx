import { obtenerIdYoutube } from '../utilidades/video'

// Muestra un video de YouTube (No listado) o un archivo de video directo.
// Usa youtube-nocookie para no cargar cookies de seguimiento de YouTube.
// vertical: para videos tipo reel (9:16), así no quedan franjas negras.
function ReproductorVideo({ url, titulo = 'Video', vertical = false }) {
  const formato = vertical ? 'aspect-[9/16]' : 'aspect-video'

  if (!url) {
    return (
      <div className={`${formato} w-full rounded-xl bg-arena/40 flex items-center justify-center`}>
        <p className="text-piedra text-sm">El video estará disponible próximamente.</p>
      </div>
    )
  }

  const idYoutube = obtenerIdYoutube(url)

  if (idYoutube) {
    return (
      <div className={`${formato} w-full overflow-hidden rounded-xl bg-black`}>
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

  return <video src={url} controls playsInline controlsList="nodownload" className={`${formato} w-full rounded-xl bg-black ${vertical ? 'object-cover' : ''}`} />
}

export default ReproductorVideo
