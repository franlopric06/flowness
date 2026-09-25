import { useEffect, useRef, useState } from 'react'
import { videoMuestra, portadaVideo } from '../utilidades/medios'

// Video corto que se reproduce solo, sin sonido y en bucle, pero SOLO
// mientras está a la vista: cuando sale de la pantalla se pausa (así el
// celular no se pone lento ni gasta datos de más). Si la persona pidió
// "reducir movimiento" en su equipo, muestra la imagen fija.
//   src: video subido a Cloudinary · portada: imagen opcional mientras carga
function VideoMuestra({ src, portada, ancho = 720, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const reducir = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const el = ref.current
    if (!el || reducir) return
    const observador = new IntersectionObserver(([entrada]) => setVisible(entrada.isIntersecting), { threshold: 0.35 })
    observador.observe(el)
    return () => observador.disconnect()
  }, [reducir])

  useEffect(() => {
    const el = ref.current
    if (!el || reducir) return
    if (visible) el.play().catch(() => {})
    else el.pause()
  }, [visible, reducir])

  return (
    <video ref={ref} src={videoMuestra(src, ancho)} poster={portada || portadaVideo(src, ancho)}
      muted loop playsInline preload={visible ? 'auto' : 'metadata'} aria-hidden="true" tabIndex={-1}
      disablePictureInPicture
      className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${className}`} />
  )
}

export default VideoMuestra
