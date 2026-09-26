import { estiloLabel } from '../componentes/estilos'
import CampoVideoMuestra from '../CampoVideoMuestra'

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

// Textos de la portada, datos de contacto y video de fondo
function CamposSitio({ valor, cambiar }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
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
    </div>
  )
}

export default CamposSitio
