import { useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react'
import IconoInstagram from './IconoInstagram'
import { usePerfilInstagram } from '../hooks/usePerfilInstagram'
import { imagenReducida, urlEmbedInstagram } from '../utilidades/medios'

const botonRedondo = 'w-9 h-9 rounded-full bg-black/45 backdrop-blur text-blanco flex items-center justify-center hover:bg-black/60 transition-colors'

// Etiqueta "Ver perfil": lo único que lleva a Instagram
function VerPerfil() {
  const perfil = usePerfilInstagram()
  return (
    <a href={perfil} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
      className="absolute top-2 left-2 z-10 inline-flex items-center gap-1.5 rounded-full bg-blanco/90 backdrop-blur text-texto text-[0.62rem] font-semibold tracking-[0.1em] uppercase pl-1.5 pr-2.5 py-1 shadow-suave hover:bg-blanco">
      <span className="w-5 h-5 rounded-full bg-terracota text-blanco flex items-center justify-center"><IconoInstagram size={11} /></span>
      Ver perfil
    </a>
  )
}

// Video con controles propios: reproducir, silenciar y pantalla completa
function VideoPropio({ item, titulo }) {
  const video = useRef(null)
  const [reproduciendo, setReproduciendo] = useState(false)
  const [silenciado, setSilenciado] = useState(false)
  // Cloudinary genera la imagen de portada cambiando la extensión a .jpg
  const portada = item.url.replace(/\.[a-z0-9]+$/i, '.jpg')

  const alternar = () => {
    const v = video.current
    if (!v) return
    if (v.paused) {
      // Pausa los otros videos de la página para que no suenen juntos
      document.querySelectorAll('video').forEach((otro) => { if (otro !== v) otro.pause() })
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }

  const silenciar = (e) => {
    e.stopPropagation()
    const v = video.current
    v.muted = !v.muted
    setSilenciado(v.muted)
  }

  const pantallaCompleta = (e) => {
    e.stopPropagation()
    const v = video.current
    if (v.requestFullscreen) v.requestFullscreen().catch(() => {})
    else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen() // iPhone
  }

  return (
    <div className="absolute inset-0 cursor-pointer" onClick={alternar}>
      <video ref={video} src={item.url} poster={portada} playsInline preload="metadata" loop title={titulo}
        onPlay={() => setReproduciendo(true)} onPause={() => setReproduciendo(false)}
        className="absolute inset-0 w-full h-full object-cover bg-black" />
      {!reproduciendo && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/15">
          <span className="w-14 h-14 rounded-full bg-blanco/90 text-verde flex items-center justify-center shadow-media">
            <Play size={24} fill="currentColor" className="ml-1" />
          </span>
        </span>
      )}
      <div className="absolute bottom-2 right-2 flex gap-2">
        {reproduciendo && (
          <button onClick={(e) => { e.stopPropagation(); alternar() }} aria-label="Pausar" className={botonRedondo}><Pause size={16} /></button>
        )}
        <button onClick={silenciar} aria-label={silenciado ? 'Activar sonido' : 'Silenciar'} className={botonRedondo}>
          {silenciado ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button onClick={pantallaCompleta} aria-label="Pantalla completa" className={botonRedondo}><Maximize2 size={15} /></button>
      </div>
    </div>
  )
}

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
          ? <button onClick={alAbrir} aria-label={`Ver ${titulo}`} className="absolute inset-0 w-full h-full" />
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
        {clase === 'foto' && alAbrir && (
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
