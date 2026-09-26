import { useState } from 'react'
import { BadgePercent, CreditCard, Type } from 'lucide-react'
import { avisar } from '../../../compartido/utilidades/avisos'
import { leerMedios } from '../../../compartido/utilidades/mediosDePago'
import { leerPromos } from '../../../compartido/utilidades/promociones'
import { olvidarConfiguracion } from '../../../compartido/hooks/useConfiguracion'
import { useCargar } from '../componentes/useCargar'
import BotonGuardar from '../componentes/BotonGuardar'
import Bloque from '../configuracion/Bloque'
import EditorPromos from '../configuracion/EditorPromos'
import EditorMediosPago from '../configuracion/EditorMediosPago'
import CamposSitio from '../configuracion/CamposSitio'
import * as api from '../admin.servicio'

// Sección "Configuración" del panel: promociones, medios de pago, textos y contacto.
// Todo se guarda junto con un solo botón.
function AdminConfiguracion() {
  const [config, recargar] = useCargar(api.obtenerConfiguracion, {})
  const [form, setForm] = useState({})
  const [guardando, setGuardando] = useState(false)

  const valor = (clave) => form[clave] ?? config?.[clave] ?? ''
  const cambiar = (clave, v) => setForm((f) => ({ ...f, [clave]: v }))
  const hayCambios = Object.keys(form).length > 0

  // Promos y medios se guardan como texto JSON en la configuración
  const medios = leerMedios({ medios_pago: valor('medios_pago') })
  const promos = leerPromos({ promociones: valor('promociones') })

  const guardar = async () => {
    if (!hayCambios) return avisar('No hiciste cambios todavía.', 'info')
    setGuardando(true)
    try {
      await api.actualizarConfiguracion(form)
      setForm({})
      olvidarConfiguracion()
      await recargar()
      avisar('Configuración guardada')
    } catch { /* el aviso de error lo muestra el cliente de la API */ }
    setGuardando(false)
  }

  return (
    <div>
      <h2 className="titulo text-verde text-3xl mb-2">Configuración</h2>
      <p className="text-piedra text-xs mb-5">Promociones, medios de pago, textos y datos de contacto del sitio.</p>

      <div className="space-y-5">
        <Bloque titulo="Promociones" Icono={BadgePercent}>
          <EditorPromos promos={promos} whatsapp={valor('whatsapp_numero')}
            alCambiar={(lista) => cambiar('promociones', JSON.stringify(lista))} />
        </Bloque>
        <Bloque titulo="Medios de pago" Icono={CreditCard}>
          <EditorMediosPago valor={medios} alCambiar={(v) => cambiar('medios_pago', JSON.stringify(v))} />
        </Bloque>
        <Bloque titulo="Textos y contacto" Icono={Type}>
          <CamposSitio valor={valor} cambiar={cambiar} />
        </Bloque>
      </div>

      {/* Queda a la vista mientras haya cambios sin guardar */}
      <div className={`sticky bottom-4 z-10 mt-5 flex items-center justify-end gap-3 ${hayCambios ? 'card p-3 shadow-media' : ''}`}>
        {hayCambios && <span className="text-texto/70 text-xs mr-auto">Tenés cambios sin guardar</span>}
        <BotonGuardar guardando={guardando} onClick={guardar} texto="Guardar configuración" />
      </div>
    </div>
  )
}

export default AdminConfiguracion
