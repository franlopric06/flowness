import { urlEmbedInstagram } from '../utilidades/medios'

// Muestra un reel de la galería: link público de Instagram o video subido
function Reel({ reel, titulo = 'Reel' }) {
  if (reel.tipo === 'ARCHIVO') {
    // Cloudinary genera la imagen de portada cambiando la extensión a .jpg
    const portada = reel.url.replace(/\.[a-z0-9]+$/i, '.jpg')
    return (
      <div className="w-full aspect-[9/16] overflow-hidden rounded-2xl bg-black">
        <video src={reel.url} poster={portada} controls playsInline preload="metadata"
          controlsList="nodownload" className="h-full w-full object-cover" title={titulo} />
      </div>
    )
  }

  const embed = urlEmbedInstagram(reel.url)
  if (!embed) return null
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-blanco border border-terracota/20">
      <iframe src={embed} title={titulo} loading="lazy" scrolling="no" allowFullScreen
        className="block w-full h-[640px] border-0" />
    </div>
  )
}

export default Reel
