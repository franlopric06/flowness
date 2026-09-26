import { useState } from 'react'
import { DESTINOS } from '../../../compartido/utilidades/destinos'
import { tipoDeAviso } from '../../../compartido/utilidades/tiposAviso'
import { useConfiguracion } from '../../../compartido/hooks/useConfiguracion'
import TarjetaAviso from '../../inicio/secciones/novedades/TarjetaAviso'
import { estiloLabel, botonCancelar } from '../componentes/estilos'
import MensajeError from '../componentes/MensajeError'
import BotonGuardar from '../componentes/BotonGuardar'
import CampoImagen from '../componentes/CampoImagen'
import SelectorTipo from './SelectorTipo'

const EJEMPLOS = {
  NOVEDAD: 'Ej: "Nuevas clases de movilidad de cadera"',
  CLASE_GRATIS: 'Ej: "Esta semana la clase de columna es gratis"',
  PROMO: 'Ej: "Comprando 2 clases, la segunda te la regalo"',
}

// Formulario para crear o editar un aviso, con la vista previa al lado
function FormularioAviso({ inicial, editando, alGuardar, alCancelar }) {
  const [form, setForm] = useState(inicial)
  const [guardando, setGuardando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')
  const { whatsapp_numero: whatsapp } = useConfiguracion()
  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }))

  // Al cambiar el tipo, si todavía no eligió botón, se sugiere uno
  const cambiarTipo = (tipo) => setForm((f) => ({ ...f, tipo, destino: f.destino || tipoDeAviso(tipo).destino }))

  const guardar = async () => {
    setError('')
    if (!form.titulo.trim()) return setError('Poné un título para el aviso.')
    if (form.destino === 'link' && !/^(https?:\/\/|\/)/i.test(form.enlace.trim())) return setError('El link tiene que empezar con https:// o con /')
    if (form.destino === 'whatsapp' && !whatsapp) return setError('Primero cargá el número de WhatsApp en Configuración.')
    setGuardando(true)
    try {
      await alGuardar(form)
    } catch (err) {
      setError(err.message)
      setGuardando(false)
    }
  }

  return (
    <div className="card p-5 md:p-6 mb-6">
      <h3 className="text-sm font-semibold mb-4 text-texto">{editando ? 'Editar aviso' : 'Nuevo aviso'}</h3>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          <SelectorTipo valor={form.tipo} alCambiar={cambiarTipo} />
          <div>
            <label className={estiloLabel}>Título</label>
            <input value={form.titulo} onChange={(e) => cambiar('titulo', e.target.value)} maxLength={120}
              placeholder={EJEMPLOS[form.tipo]} className="input" />
          </div>
          <div>
            <label className={estiloLabel}>Texto (opcional)</label>
            <textarea rows={3} value={form.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} maxLength={600} className="input" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={estiloLabel}>Botón</label>
              <select value={form.destino} onChange={(e) => cambiar('destino', e.target.value)} className="input">
                {DESTINOS.map(([valor, texto]) => <option key={valor} value={valor}>{texto}</option>)}
              </select>
            </div>
            <div>
              <label className={estiloLabel}>Se muestra hasta (opcional)</label>
              <input type="date" value={form.hasta} onChange={(e) => cambiar('hasta', e.target.value)} className="input" />
            </div>
            {form.destino === 'link' && (
              <div className="sm:col-span-2">
                <label className={estiloLabel}>Link</label>
                <input value={form.enlace} onChange={(e) => cambiar('enlace', e.target.value)} placeholder="https://... o /formacion/nivel-1" className="input" />
              </div>
            )}
          </div>
          <CampoImagen etiqueta="Imagen (opcional)" valor={form.imagenUrl} alCambiar={(url) => cambiar('imagenUrl', url)}
            alError={setError} alSubir={setSubiendo} />
          <p className="text-piedra text-xs">Si ponés una fecha, el aviso se oculta solo después de ese día.</p>
        </div>

        <div>
          <label className={estiloLabel}>Así se ve en el Inicio</label>
          <div className="pointer-events-none">
            <TarjetaAviso aviso={{ ...form, titulo: form.titulo || 'Título del aviso' }} whatsapp={whatsapp} />
          </div>
        </div>
      </div>

      <MensajeError texto={error} className="mt-4" />
      <div className="flex gap-2 mt-5">
        <BotonGuardar guardando={guardando} disabled={subiendo} onClick={guardar} texto={editando ? 'Guardar cambios' : 'Publicar aviso'} />
        <button type="button" onClick={alCancelar} className={botonCancelar}>Cancelar</button>
      </div>
    </div>
  )
}

export default FormularioAviso
