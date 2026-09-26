import { useConfiguracionLista } from '../hooks/useConfiguracion'
import { leerMedios, itemsDeLaFranja } from '../utilidades/mediosDePago'
import { leerPromos, promosVigentes } from '../utilidades/promociones'
import BarraPromos from './pagos/BarraPromos'
import FranjaMedios from './pagos/FranjaMedios'

// Franja de pagos del sitio: arriba las promociones vigentes y abajo los
// medios de pago. Las dos cosas se eligen en Configuración del panel.
function MediosDePago({ className = '' }) {
  // Espera a tener la configuración para no mostrar primero lo de por defecto
  const config = useConfiguracionLista()
  if (!config) return <div className={`h-[3.25rem] border-y border-terracota/15 bg-blanco ${className}`} aria-hidden="true" />

  const items = itemsDeLaFranja(leerMedios(config))
  const promos = promosVigentes(leerPromos(config))

  if (items.length === 0 && promos.length === 0) return null

  return (
    <section className={`bg-blanco border-y border-terracota/15 ${className}`} aria-label="Promociones y medios de pago">
      <BarraPromos promos={promos} whatsapp={config.whatsapp_numero} />
      <FranjaMedios items={items} />
    </section>
  )
}

export default MediosDePago
