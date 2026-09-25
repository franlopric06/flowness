import { useState } from 'react'
import { Upload, Loader2, X, Film } from 'lucide-react'
import VideoMuestra from '../../compartido/componentes/VideoMuestra'
import { avisar } from '../../compartido/utilidades/avisos'
import * as api from './admin.servicio'

const MB = 1024 * 1024

// Campo del panel para subir el video corto de muestra de una tarjeta
// (fase, clase, nivel o portada). Se ve igual que en la página: sin sonido y en bucle.
function CampoVideoMuestra({ valor, alCambiar, etiqueta = 'Video corto de muestra (opcional)', ayuda, formato = 'aspect-video' }) {
  const [progreso, setProgreso] = useState(null)

  const subir = async (archivo) => {
    if (!archivo) return
    if (!archivo.type.startsWith('video/')) return avisar('El archivo tiene que ser un video', 'error')
    if (archivo.size > 100 * MB) return avisar('El video pesa más de 100 MB. Recortalo un poco.', 'error')
    setProgreso(0)
    const { url } = await api.subirVideo(archivo, setProgreso)
    setProgreso(null)
    if (url) {
      alCambiar(url)
      avisar('Video subido. Acordate de guardar.', 'info')
    }
  }

  return (
    <div>
      <label className="text-piedra text-[0.68rem] font-semibold tracking-[0.16em] uppercase block mb-1.5">{etiqueta}</label>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
        <div className={`relative w-40 ${formato} rounded-md overflow-hidden bg-arena/50 shrink-0 flex items-center justify-center`}>
          {valor ? <VideoMuestra src={valor} ancho={400} /> : <Film size={22} className="text-piedra" />}
        </div>
        <div className="flex flex-col gap-2">
          <label className={`btn btn-secundario btn-chico cursor-pointer ${progreso !== null ? 'opacity-60 pointer-events-none' : ''}`}>
            {progreso !== null
              ? <><Loader2 size={14} className="animate-spin" /> Subiendo… {progreso}%</>
              : <><Upload size={14} /> {valor ? 'Cambiar video' : 'Subir video'}</>}
            <input type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden"
              onChange={(e) => { subir(e.target.files[0]); e.target.value = '' }} />
          </label>
          {valor && (
            <button type="button" onClick={() => alCambiar('')} className="btn btn-chico text-error hover:bg-error/5"><X size={13} /> Quitar</button>
          )}
          <p className="text-piedra text-[11px] max-w-xs">
            {ayuda || 'De 10 a 20 segundos, lo más dinámico. Se muestra sin sonido y en bucle; si es más largo, se usan los primeros 20 segundos.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CampoVideoMuestra
