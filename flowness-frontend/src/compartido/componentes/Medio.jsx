import { Play } from 'lucide-react'
import IconoInstagram from './IconoInstagram'
import { imagenReducida, urlEmbedInstagram } from '../utilidades/medios'

// Tarjeta de la galería: foto o video, subido o de Instagram.
// Todas tienen el mismo tamaño y formato (4:5), así se ven parejas
// sin importar cómo sea la foto o el video original.
//   clase: 'foto' | 'video'
//   alAbrir: (opcional) para abrir la foto en grande
function Medio({ item, clase = 'foto', alAbrir, className = '' }) {
  const titulo = item.descripcion || (clase === 'foto' ? 'Foto de Flowness' : 'Video de Flowness')
  let contenido

  if (item.tipo === 'INSTAGRAM') {
    const embed = urlEmbedInstagram(item.url)
    contenido = embed && (
      <>
        <iframe src={embed} title={titulo} loading="lazy" scrolling="no" allowFullScreen className="medio-ig" />
        <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-blanco/90 text-terracota flex items-center justify-center pointer-events-none shadow-suave">
          <IconoInstagram size={14} />
        </span>
        {/* En las fotos, una capa transparente arriba permite abrirla en grande */}
        {clase === 'foto' && alAbrir && (
          <button onClick={alAbrir} aria-label={`Ver ${titulo}`} className="absolute inset-0 w-full h-full" />
        )}
      </>
    )
  } else if (clase === 'video') {
    // Cloudinary genera la imagen de portada cambiando la extensión a .jpg
    const portada = item.url.replace(/\.[a-z0-9]+$/i, '.jpg')
    contenido = (
      <video src={item.url} poster={portada} controls playsInline preload="metadata" controlsList="nodownload"
        className="absolute inset-0 w-full h-full object-cover bg-black" title={titulo} />
    )
  } else {
    const imagen = (
      <img src={imagenReducida(item.url, 600)} alt={item.descripcion || ''} loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
    )
    contenido = alAbrir
      ? <button onClick={alAbrir} aria-label={`Ver ${titulo}`} className="group absolute inset-0 w-full h-full">{imagen}</button>
      : <div className="group absolute inset-0">{imagen}</div>
  }

  if (!contenido) return null

  return (
    <figure className={`medio ${className}`}>
      <div className="medio-caja shadow-suave">
        {contenido}
        {clase === 'video' && item.tipo !== 'INSTAGRAM' && (
          <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-blanco/90 text-verde flex items-center justify-center pointer-events-none shadow-suave">
            <Play size={13} fill="currentColor" />
          </span>
        )}
      </div>
      {item.descripcion && <figcaption className="text-texto/70 text-xs mt-2 line-clamp-2">{item.descripcion}</figcaption>}
    </figure>
  )
}

export default Medio
