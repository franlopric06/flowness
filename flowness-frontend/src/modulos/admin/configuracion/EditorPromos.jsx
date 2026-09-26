import { Plus } from 'lucide-react'
import BarraPromos from '../../../compartido/componentes/pagos/BarraPromos'
import { PROMO_NUEVA, promosVigentes } from '../../../compartido/utilidades/promociones'
import { confirmar } from '../../../compartido/utilidades/dialogos'
import { estiloLabel, botonBorde } from '../componentes/estilos'
import FilaPromo from './FilaPromo'

// Lista de promociones que se muestran arriba de la franja de pagos
function EditorPromos({ promos, whatsapp, alCambiar }) {
  const agregar = () => alCambiar([...promos, PROMO_NUEVA()])
  const cambiarUna = (id, promo) => alCambiar(promos.map((p) => (p.id === id ? promo : p)))
  const quitar = async (promo) => {
    if (promo.texto && !(await confirmar('¿Eliminar esta promoción?', { textoConfirmar: 'Eliminar' }))) return
    alCambiar(promos.filter((p) => p.id !== promo.id))
  }

  const vigentes = promosVigentes(promos)

  return (
    <div>
      <p className="text-piedra text-xs mb-4">
        Son avisos que se ven arriba de los medios de pago (en el Inicio, Clases y Formación). Si hay varias, van rotando.
        Ojo: el aviso no cambia el precio; si hacés un descuento, cambiá también el precio de la clase o el curso.
      </p>

      <div className="space-y-3 mb-4">
        {promos.map((promo) => (
          <FilaPromo key={promo.id} promo={promo} alCambiar={(p) => cambiarUna(promo.id, p)} alQuitar={() => quitar(promo)} />
        ))}
      </div>
      <button type="button" onClick={agregar} className={botonBorde}><Plus size={14} /> Nueva promoción</button>

      {vigentes.length > 0 && (
        <div className="mt-5">
          <label className={estiloLabel}>Así se ve</label>
          <div className="rounded-xl overflow-hidden pointer-events-none">
            <BarraPromos promos={vigentes} whatsapp={whatsapp} />
          </div>
        </div>
      )}
    </div>
  )
}

export default EditorPromos
