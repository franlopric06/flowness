import { useEffect, useState } from 'react'
import { Wallet, ShoppingBag, Users, UserPlus, Clock, Receipt } from 'lucide-react'
import { avisar } from '../../../compartido/utilidades/avisos'
import TarjetaMetrica from './TarjetaMetrica'
import GraficoMeses from './GraficoMeses'
import { formatearPrecio, nombreMes } from './formato'
import * as api from '../admin.servicio'

// Compara con el mes pasado: "+25% que agosto"
function comparacion(actual, anterior, mesAnterior) {
  if (!anterior) return actual ? `Primer mes con ventas` : 'Todavía sin ventas este mes'
  const cambio = Math.round(((actual - anterior) / anterior) * 100)
  return `${cambio >= 0 ? '+' : ''}${cambio}% que ${nombreMes(mesAnterior, true).split(' ')[0]}`
}

// Pestaña "Resumen": los números del negocio
function ResumenVentas() {
  const [m, setM] = useState(null)

  useEffect(() => {
    api.obtenerMetricas().then(setM).catch(() => avisar('No se pudieron calcular las métricas', 'error'))
  }, [])

  if (!m) return <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[1, 2, 3, 4].map((i) => <div key={i} className="esqueleto h-28 rounded-xl" />)}</div>

  const mesPasado = m.porMes[m.porMes.length - 2]?.mes

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <TarjetaMetrica Icono={Wallet} titulo={`Ventas de ${nombreMes(m.mes, true).split(' ')[0]}`} valor={formatearPrecio(m.ventasMes.total)}
          detalle={`${m.ventasMes.cantidad} ${m.ventasMes.cantidad === 1 ? 'compra' : 'compras'} · ${comparacion(m.ventasMes.total, m.ventasMesPasado.total, mesPasado)}`} />
        <TarjetaMetrica Icono={ShoppingBag} titulo="Ventas totales" valor={formatearPrecio(m.ventasTotales.total)}
          detalle={`${m.ventasTotales.cantidad} compras pagadas`} />
        <TarjetaMetrica Icono={Users} titulo="Personas registradas" valor={m.usuarios.total}
          detalle={`${m.compradores} ${m.compradores === 1 ? 'compró' : 'compraron'} algo`} />
        <TarjetaMetrica Icono={UserPlus} titulo="Nuevas este mes" valor={m.usuarios.nuevosMes} detalle="se registraron en el sitio" />
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-5">
        <GraficoMeses porMes={m.porMes} />

        <div className="card p-4 md:p-6">
          <p className="font-semibold text-texto text-sm mb-4">Lo más vendido</p>
          {m.masVendidos.length === 0 ? (
            <p className="text-piedra text-sm">Todavía no hay ventas.</p>
          ) : (
            <ol className="space-y-3">
              {m.masVendidos.map((p, i) => (
                <li key={p.clave} className="flex items-center gap-3">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-verde/15 text-verde text-xs font-semibold flex items-center justify-center">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-texto truncate">{p.nombre}</p>
                    <p className="text-piedra text-xs">{p.tipo} · {p.cantidad} {p.cantidad === 1 ? 'venta' : 'ventas'}</p>
                  </div>
                  <span className="text-sm font-semibold text-texto">{formatearPrecio(p.total)}</span>
                </li>
              ))}
            </ol>
          )}
          <div className="mt-5 pt-4 border-t border-terracota/15 space-y-2 text-sm">
            <p className="flex items-center gap-2 text-texto/70"><Receipt size={15} className="text-verde shrink-0" /> Ticket promedio <strong className="text-texto ml-auto">{formatearPrecio(m.ticketPromedio)}</strong></p>
            <p className="flex items-center gap-2 text-texto/70"><Clock size={15} className="text-verde shrink-0" /> Pagos pendientes <strong className="text-texto ml-auto">{m.pagosPendientes}</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumenVentas
