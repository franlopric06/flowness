import { Play, Maximize2 } from 'lucide-react'
import VerPerfil from './medio/VerPerfil'
import VideoPropio from './medio/VideoPropio'
import { botonRedondo } from './medio/estilos'
import { imagenReducida, urlEmbedInstagram } from '../utilidades/medios'

// Tarjeta de la galería: foto o video, subido o traído de Instagram.
// Todas tienen el mismo tamaño y formato (4:5), así se ven parejas.
//   clase: 'foto' | 'video'
//   alAbrir: (opcional) abre la foto en grande
function Medio({ item, clase = 'foto', alAbrir, className = '' }) {
  const titulo = item.descripcion || (clase === 'foto' ? 'Foto de Flowness' : 'Video de Flowness')
  const deInstagram = item.tipo === 'INSTAGRAM' || !!item.enlace
  let contenido

  if (item.tipo === 'INSTAGRAM') {
    // Recuadro de Instagram (cuando la cuenta todavía no está conectada).
    // Una capa arriba evita que al tocarlo te lleve a Instagram.
    const embed = urlEmbedInstagram(item.url)
    contenido = embed && (
      <>
        <iframe src={embed} title={titulo} loading="lazy" scrolling="no" tabIndex={-1} className="medio-ig pointer-events-none" />
        {alAbrir
          ? (
            <button onClick={alAbrir} aria-label={`Ver ${titulo}`} className="absolute inset-0 w-full h-full">
              {clase === 'video' && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <span className="w-14 h-14 rounded-full bg-blanco/90 text-verde flex items-center justify-center shadow-media">
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </span>
                </span>
              )}
            </button>
          )
          : <span className="absolute inset-0" />}
      </>
    )
  } else if (clase === 'video') {
    contenido = <VideoPropio item={item} titulo={titulo} />
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
        {deInstagram && <VerPerfil />}
        {alAbrir && (clase === 'foto' || item.tipo === 'INSTAGRAM') && (
          <button onClick={alAbrir} aria-label="Ver en pantalla completa" className={`absolute bottom-2 right-2 ${botonRedondo}`}>
            <Maximize2 size={15} />
          </button>
        )}
      </div>
      {item.descripcion && <figcaption className="text-texto/70 text-xs mt-2 line-clamp-2">{item.descripcion}</figcaption>}
    </figure>
  )
}

export default Medio
