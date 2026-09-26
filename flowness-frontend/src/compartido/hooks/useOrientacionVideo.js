import { useEffect, useState } from 'react'
import { obtenerIdYoutube } from '../utilidades/video'

// Averigua si un video es vertical (tipo reel) u horizontal, para acomodar
// el diseño y que no queden franjas negras a los costados.
// Devuelve 'vertical', 'horizontal' o null mientras lo averigua.
export function useOrientacionVideo(url) {
  const [resultado, setResultado] = useState({ url: null, orientacion: null })

  useEffect(() => {
    if (!url || obtenerIdYoutube(url)) return
    // Archivo de video: se leen solo sus datos (medidas), sin descargarlo entero
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    const listo = (orientacion) => setResultado({ url, orientacion })
    video.onloadedmetadata = () => listo(video.videoHeight > video.videoWidth ? 'vertical' : 'horizontal')
    video.onerror = () => listo('horizontal')
    video.src = url
    return () => { video.onloadedmetadata = null; video.onerror = null; video.removeAttribute('src'); video.load() }
  }, [url])

  if (!url) return null
  // YouTube: los "shorts" son verticales, el resto horizontales
  if (obtenerIdYoutube(url)) return /\/shorts\//i.test(url) ? 'vertical' : 'horizontal'
  return resultado.url === url ? resultado.orientacion : null
}
