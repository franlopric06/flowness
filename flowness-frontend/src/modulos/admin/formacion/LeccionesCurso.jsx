import { useState } from 'react'
import { Plus, Pencil, Eye, EyeOff, FileText, PlayCircle, VideoOff } from 'lucide-react'
import { botonVerde, botonBorde, botonGris } from '../componentes/estilos'
import FormularioLeccion from './FormularioLeccion'
import * as api from '../admin.servicio'

const LECCION_VACIA = { titulo: '', descripcion: '', videoUrl: '', pdfUrl: '', orden: '', activo: true }

const datosDeLeccion = (l) => ({
  titulo: l.titulo || '', descripcion: l.descripcion || '', videoUrl: l.videoUrl || '',
  pdfUrl: l.pdfUrl || '', orden: l.orden ?? '', activo: l.activo,
})

// Lista de lecciones de un nivel, con el formulario para agregar o editar
function LeccionesCurso({ curso, mostrarMsg, alGuardar }) {
  // null = formulario cerrado · { id: null } = nueva · { id: 5 } = editando la 5
  const [edicion, setEdicion] = useState(null)

  const nueva = () => setEdicion({ id: null, datos: { ...LECCION_VACIA, orden: curso.lecciones.length + 1 } })
  const editar = (leccion) => setEdicion({ id: leccion.id, datos: datosDeLeccion(leccion) })

  const guardar = async (form) => {
    if (edicion.id) await api.actualizarLeccion(edicion.id, form)
    else await api.crearLeccion(curso.id, form)
    mostrarMsg(edicion.id ? 'Lección actualizada' : 'Lección creada')
    setEdicion(null)
    alGuardar()
  }

  const cambiarVisibilidad = async (leccion) => {
    try {
      await api.actualizarLeccion(leccion.id, { activo: !leccion.activo })
      mostrarMsg(leccion.activo ? 'Lección ocultada' : 'Lección publicada')
      alGuardar()
    } catch { /* el aviso de error lo muestra el cliente de la API */ }
  }

  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="titulo text-verde text-2xl">
          Lecciones · {curso.lecciones.filter((l) => l.activo).length}{curso.totalVideos ? ` de ${curso.totalVideos}` : ''}
        </h3>
        {!edicion && <button onClick={nueva} className={botonVerde}><Plus size={14} /> Nueva lección</button>}
      </div>

      {edicion && (
        <FormularioLeccion key={edicion.id ?? 'nueva'} inicial={edicion.datos} editando={!!edicion.id}
          mostrarMsg={mostrarMsg} alGuardar={guardar} alCancelar={() => setEdicion(null)} />
      )}

      {curso.lecciones.length === 0 ? (
        <p className="text-piedra text-sm">Todavía no hay lecciones en este curso.</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {curso.lecciones.map((leccion) => (
            <li key={leccion.id} className={`flex flex-col sm:flex-row sm:items-center gap-2 border border-terracota/20 rounded-xl px-4 py-3 bg-blanco ${leccion.activo ? '' : 'opacity-60'}`}>
              <div className="flex-1 min-w-0">
                <p className="text-verde text-sm font-semibold truncate">{leccion.orden}. {leccion.titulo}</p>
                <p className="flex flex-wrap gap-3 text-[11px] text-piedra mt-0.5">
                  {leccion.videoUrl
                    ? <span className="flex items-center gap-1"><PlayCircle size={12} /> Video</span>
                    : <span className="flex items-center gap-1 text-error"><VideoOff size={12} /> Sin video</span>}
                  <span className="flex items-center gap-1"><FileText size={12} /> {leccion.pdfUrl ? 'PDF' : 'Sin PDF'}</span>
                  {!leccion.activo && <span className="flex items-center gap-1 text-error"><EyeOff size={12} /> Oculta</span>}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => editar(leccion)} className={botonBorde}><Pencil size={13} /> Editar</button>
                <button onClick={() => cambiarVisibilidad(leccion)} className={botonGris}>
                  {leccion.activo ? <><EyeOff size={13} /> Ocultar</> : <><Eye size={13} /> Publicar</>}
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default LeccionesCurso
