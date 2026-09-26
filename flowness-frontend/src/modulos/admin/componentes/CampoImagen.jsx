import { useState } from 'react'
import { Loader2, Upload, X } from 'lucide-react'
import { estiloLabel, botonBorde, botonQuitar } from './estilos'
import * as api from '../admin.servicio'

// Campo para subir una imagen (portada de clase o de nivel) con vista previa
function CampoImagen({ etiqueta, valor, alCambiar, alError, alSubir }) {
  const [subiendo, setSubiendo] = useState(false)

  const subir = async (archivo) => {
    if (!archivo) return
    setSubiendo(true)
    alSubir?.(true)
    try {
      const { url, error } = await api.subirImagen(archivo)
      if (!url) throw new Error(error)
      alCambiar(url)
    } catch (err) {
      alError?.(`No se pudo subir la imagen. ${err.message || ''}`)
    } finally {
      setSubiendo(false)
      alSubir?.(false)
    }
  }

  return (
    <div>
      <label className={estiloLabel}>{etiqueta}</label>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:items-center">
        {valor && <img src={valor} alt="" className="h-20 aspect-video object-cover rounded-lg border border-terracota/20" />}
        <label className={`${botonBorde} cursor-pointer`}>
          {subiendo ? <><Loader2 size={14} className="animate-spin" /> Subiendo…</> : <><Upload size={14} /> Subir imagen</>}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={subiendo}
            onChange={(e) => { subir(e.target.files[0]); e.target.value = '' }} />
        </label>
        {valor && <button type="button" onClick={() => alCambiar('')} className={botonQuitar}><X size={13} /> Quitar</button>}
      </div>
    </div>
  )
}

export default CampoImagen
