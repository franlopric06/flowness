import { useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react'
import { botonRedondo } from './estilos'

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

export default VideoPropio
