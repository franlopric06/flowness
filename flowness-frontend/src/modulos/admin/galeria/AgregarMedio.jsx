import { useState } from 'react'
import { Upload, Plus, Loader2, Link2 } from 'lucide-react'
import { esLinkInstagram } from '../../../compartido/utilidades/medios'
import { estiloLabel, botonVerde } from '../componentes/estilos'
import MensajeError from '../componentes/MensajeError'
import { CONFIG, MB, mayuscula, terminacion } from './configMedios'

// Formulario para agregar fotos o videos: desde el equipo o con link de Instagram
function AgregarMedio({ clase, instagramConectado, mostrarMsg, alCambiar }) {
  const c = CONFIG[clase]
  const [origen, setOrigen] = useState('ARCHIVO') // 'ARCHIVO' | 'INSTAGRAM'
  const [link, setLink] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [subiendo, setSubiendo] = useState(null) // { actual, total, progreso }
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const agregarInstagram = async () => {
    setError('')
    if (!esLinkInstagram(link)) return setError(`Pegá el link de ${c.articulo === 'la' ? 'una publicación' : 'un reel'} de Instagram (${c.ejemploLink}).`)
    setGuardando(true)
    try {
      await c.crear({ tipo: 'INSTAGRAM', url: link.trim(), descripcion })
      setLink('')
      setDescripcion('')
      mostrarMsg(`${mayuscula(c.singular)} de Instagram agregad${terminacion(c)}`)
      alCambiar()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  const subirArchivos = async (archivos) => {
    setError('')
    const lista = [...archivos].filter((a) => a.type.startsWith(c.tipoMime))
    if (lista.length === 0) return setError(`El archivo tiene que ser ${c.articulo === 'la' ? 'una imagen' : 'un video'}.`)
    let fallidas = 0
    for (let i = 0; i < lista.length; i++) {
      setSubiendo({ actual: i + 1, total: lista.length, progreso: 0 })
      try {
        if (lista[i].size > c.maxMB * MB) throw new Error(`pesa más de ${c.maxMB} MB`)
        const respuesta = await c.subir(lista[i], (p) => setSubiendo((s) => s && { ...s, progreso: p }))
        if (!respuesta?.url) throw new Error(respuesta?.error || 'no se pudo subir')
        await c.crear({ tipo: 'ARCHIVO', url: respuesta.url, descripcion: lista.length === 1 ? descripcion : '' })
      } catch (err) {
        fallidas++
        console.error(`No se pudo subir ${c.articulo} ${c.singular}:`, err.message)
      }
    }
    setSubiendo(null)
    setDescripcion('')
    if (fallidas === lista.length) {
      setError(`No se pudo subir. Revisá que no pese más de ${c.maxMB} MB y probá de nuevo.`)
    } else {
      mostrarMsg(fallidas
        ? `Se subieron ${lista.length - fallidas} de ${lista.length} ${c.plural} (las de más de ${c.maxMB} MB no se suben)`
        : lista.length === 1 ? `${mayuscula(c.singular)} subid${terminacion(c)}` : `${lista.length} ${c.plural} subidas`,
      fallidas ? 'alerta' : 'exito')
    }
    alCambiar()
  }

  return (
    <div className="bg-crema rounded-2xl p-4 mb-6">
      <p className="text-sm font-semibold text-texto mb-3">Agregar {c.singular}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {[['ARCHIVO', 'Subir desde el equipo', Upload], ['INSTAGRAM', 'Link de Instagram', Link2]].map(([clave, texto, Icono]) => (
          <button key={clave} onClick={() => { setOrigen(clave); setError('') }}
            className={`btn btn-chico ${origen === clave ? 'btn-primario' : 'bg-blanco border border-verde text-verde'}`}>
            <Icono size={14} /> {texto}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {origen === 'INSTAGRAM' && (
          <div>
            <label className={estiloLabel}>Link de Instagram</label>
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder={c.ejemploLink} className="input bg-blanco" />
            <p className="text-piedra text-[11px] mt-1 px-1">
              En Instagram: tocá los tres puntitos de la publicación → Copiar enlace. La cuenta tiene que ser pública.
            </p>
          </div>
        )}
        <div>
          <label className={estiloLabel}>Descripción (opcional)</label>
          <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="input bg-blanco" />
        </div>
      </div>

      <MensajeError texto={error} className="mt-3" />

      <div className="mt-4">
        {origen === 'INSTAGRAM' ? (
          <button onClick={agregarInstagram} disabled={guardando} className={botonVerde}>
            {guardando ? <><Loader2 size={14} className="animate-spin" /> {instagramConectado ? 'Trayendo de Instagram…' : 'Guardando…'}</> : <><Plus size={14} /> Agregar</>}
          </button>
        ) : (
          <>
            <label className={`${botonVerde} cursor-pointer ${subiendo ? 'opacity-50 pointer-events-none' : ''}`}>
              {subiendo
                ? <><Loader2 size={14} className="animate-spin" /> Subiendo{subiendo.total > 1 ? ` ${subiendo.actual} de ${subiendo.total}` : ''}… {subiendo.progreso ? `${subiendo.progreso}%` : ''}</>
                : <><Upload size={14} /> Elegir {c.varios ? c.plural : c.singular}</>}
              <input type="file" accept={c.acepta} multiple={c.varios} className="hidden"
                onChange={(e) => { subirArchivos(e.target.files); e.target.value = '' }} />
            </label>
            {subiendo && (
              <div className="h-1.5 rounded-full bg-arena/60 overflow-hidden mt-3 max-w-xs">
                <div className="h-full bg-verde rounded-full transition-[width] duration-300" style={{ width: `${subiendo.progreso || 5}%` }} />
              </div>
            )}
            <p className="text-piedra text-[11px] mt-2">{c.ayudaArchivo}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default AgregarMedio
