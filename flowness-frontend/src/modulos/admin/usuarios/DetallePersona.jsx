import { useEffect, useState } from 'react'
import { Mail, CalendarDays, Star } from 'lucide-react'
import Modal from '../../../compartido/componentes/Modal'
import Estrellas from '../../../compartido/componentes/resenas/Estrellas'
import { avisar } from '../../../compartido/utilidades/avisos'
import { fechaCorta, fechaHora, formatearPrecio, productoDeCompra, ESTADO_PAGO } from './formato'
import * as api from '../admin.servicio'

// Ficha de una persona: sus datos, todo lo que compró (con el estado del pago) y sus reseñas
function DetallePersona({ id, alCerrar }) {
  const [persona, setPersona] = useState(null)

  useEffect(() => {
    if (!id) return
    api.obtenerUsuario(id).then(setPersona).catch(() => { avisar('No se pudo abrir la ficha', 'error'); alCerrar() })
  }, [id, alCerrar])

  const ficha = persona?.id === id ? persona : null

  return (
    <Modal abierto={!!id} alCerrar={alCerrar} titulo={ficha?.nombre || 'Cargando…'} ancho="max-w-2xl">
      {!ficha ? <div className="esqueleto h-48 rounded-xl" /> : (
        <div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-texto/80 mb-5">
            <a href={`mailto:${ficha.email}`} className="inline-flex items-center gap-2 text-verde hover:underline"><Mail size={15} /> {ficha.email}</a>
            <span className="inline-flex items-center gap-2"><CalendarDays size={15} className="text-verde" /> Registrada/o el {fechaCorta(ficha.creadoEn)}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="card p-4"><p className="text-piedra text-xs mb-1">Total pagado</p><p className="text-xl font-semibold text-texto">{formatearPrecio(ficha.totalGastado)}</p></div>
            <div className="card p-4"><p className="text-piedra text-xs mb-1">Compras pagadas</p><p className="text-xl font-semibold text-texto">{ficha.comprasAprobadas}</p></div>
          </div>

          <h3 className="font-semibold text-texto text-sm mb-2">Compras</h3>
          {ficha.compras.length === 0 ? <p className="text-piedra text-sm mb-6">Todavía no compró nada.</p> : (
            <ul className="card divide-y divide-terracota/10 mb-6">
              {ficha.compras.map((c) => {
                const estado = ESTADO_PAGO[c.estado] || ESTADO_PAGO.PENDIENTE
                return (
                  <li key={c.id} className="px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-texto truncate">{productoDeCompra(c)}</p>
                      <p className="text-xs text-piedra">{fechaHora(c.creadoEn)} · N° {c.id}{c.mpPagoId ? ` · MP ${c.mpPagoId}` : ''}</p>
                    </div>
                    <span className="text-sm font-semibold text-texto">{formatearPrecio(c.monto)}</span>
                    <span className={`chip ${estado.clase}`}>{estado.texto}</span>
                  </li>
                )
              })}
            </ul>
          )}

          {ficha.resenas?.length > 0 && (
            <>
              <h3 className="font-semibold text-texto text-sm mb-2 flex items-center gap-2"><Star size={14} className="text-terracota" /> Reseñas</h3>
              <ul className="space-y-2">
                {ficha.resenas.map((r) => (
                  <li key={r.id} className="flex items-center gap-3 text-sm">
                    <Estrellas valor={r.estrellas} tamano={14} />
                    <span className="text-texto/80 truncate">{r.curso?.nombre || r.clase?.nombre}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </Modal>
  )
}

export default DetallePersona
