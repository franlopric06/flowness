import { useState } from 'react'
import { avisar } from '../../../compartido/utilidades/avisos'
import { estiloLabel } from '../componentes/estilos'
import { useCargar } from '../componentes/useCargar'
import BotonGuardar from '../componentes/BotonGuardar'
import CampoVideoMuestra from '../CampoVideoMuestra'
import * as api from '../admin.servicio'

const CAMPOS = [
  ['hero_titulo', 'Título de la portada'],
  ['hero_subtitulo', 'Subtítulo de la portada'],
  ['hero_descripcion', 'Descripción de la portada'],
  ['instagram_url', 'Link de Instagram'],
  ['whatsapp_numero', 'Número de WhatsApp (con código de país, sin +)'],
  ['popup_instagram', 'Usuario de Instagram para el cartel'],
  ['popup_texto', 'Texto del cartel de Instagram'],
]
const ANCHO_COMPLETO = ['hero_descripcion', 'popup_texto']

// Sección "Configuración" del panel: textos, contacto y video de portada
function AdminConfiguracion() {
  const [config, recargar] = useCargar(api.obtenerConfiguracion, {})
  const [form, setForm] = useState({})
  const [guardando, setGuardando] = useState(false)

  const valor = (clave) => form[clave] ?? config?.[clave] ?? ''
  const cambiar = (clave, v) => setForm((f) => ({ ...f, [clave]: v }))

  const guardar = async () => {
    if (Object.keys(form).length === 0) return avisar('No hiciste cambios todavía.', 'info')
    setGuardando(true)
    try {
      await api.actualizarConfiguracion(form)
      setForm({})
      await recargar()
      avisar('Configuración guardada')
    } catch { /* el aviso de error lo muestra el cliente de la API */ }
    setGuardando(false)
  }

  return (
    <div>
      <h2 className="titulo text-verde text-3xl mb-2">Configuración</h2>
      <p className="text-piedra text-xs mb-5">Textos y datos de contacto del sitio.</p>
      <div className="card p-5 md:p-6 grid md:grid-cols-2 gap-4">
        {CAMPOS.map(([clave, etiqueta]) => (
          <div key={clave} className={ANCHO_COMPLETO.includes(clave) ? 'md:col-span-2' : ''}>
            <label className={estiloLabel}>{etiqueta}</label>
            {clave === 'hero_descripcion' ? (
              <textarea rows={3} value={valor(clave)} onChange={(e) => cambiar(clave, e.target.value)} className="input" />
            ) : (
              <input value={valor(clave)} onChange={(e) => cambiar(clave, e.target.value)} className="input" />
            )}
          </div>
        ))}
        <div className="md:col-span-2 border-t border-terracota/15 pt-5">
          <CampoVideoMuestra valor={valor('hero_video')} alCambiar={(url) => cambiar('hero_video', url)}
            etiqueta="Video de fondo de la portada (opcional)"
            ayuda="Horizontal, de 10 a 20 segundos, de Florencia en movimiento. Se ve de fondo en la portada del Inicio, sin sonido y en bucle, con un velo verde encima para que se lean los textos." />
        </div>
        <div className="md:col-span-2">
          <BotonGuardar guardando={guardando} onClick={guardar} texto="Guardar configuración" />
        </div>
      </div>
    </div>
  )
}

export default AdminConfiguracion
