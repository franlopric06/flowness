import { useState } from 'react'
import { Loader2, Upload, X } from 'lucide-react'
import ReproductorVideo from '../../../compartido/componentes/ReproductorVideo'
import { avisar } from '../../../compartido/utilidades/avisos'
import { estiloLabel, botonQuitar } from '../componentes/estilos'
import * as api from '../admin.servicio'

// Campo del video de la historia (link de YouTube o archivo subido)
function VideoHistoria({ valor, alCambiar }) {
  const [progreso, setProgreso] = useState(null)

  const subir = async (archivo) => {
    if (!archivo) return
    if (archivo.size > 100 * 1024 * 1024) return avisar('El video pesa más de 100 MB. Subilo a YouTube como No listado y pegá el link.', 'error')
    setProgreso(0)
    const { url } = await api.subirVideo(archivo, setProgreso)
    setProgreso(null)
    if (url) {
      alCambiar(url)
      avisar('Video subido. Tocá "Guardar" para aplicarlo.', 'info')
    }
  }

  return (
    <div className="md:col-span-2 border-t border-terracota/15 pt-5">
      <label className={estiloLabel}>Video de la historia (opcional)</label>
      <p className="text-piedra text-xs mb-3">Si cargás un video, se muestra en lugar de la foto: en "Sobre mí" y en el Inicio. Puede ser un link de YouTube (No listado o público) o un archivo.</p>
      <div className="grid md:grid-cols-[1fr_auto] gap-3 items-start">
        <input value={valor || ''} onChange={(e) => alCambiar(e.target.value)} placeholder="https://youtu.be/... o subí el archivo" className="input" />
        <div className="flex gap-2">
          <label className={`btn btn-chico btn-secundario cursor-pointer ${progreso !== null ? 'opacity-60 pointer-events-none' : ''}`}>
            {progreso !== null ? <><Loader2 size={14} className="animate-spin" /> {progreso}%</> : <><Upload size={14} /> Subir video</>}
            <input type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden"
              onChange={(e) => { subir(e.target.files[0]); e.target.value = '' }} />
          </label>
          {valor && <button onClick={() => alCambiar('')} className={botonQuitar}><X size={13} /> Quitar</button>}
        </div>
      </div>
      {valor && <div className="mt-4 max-w-md"><ReproductorVideo url={valor} titulo="Video de la historia" /></div>}
    </div>
  )
}

export default VideoHistoria
