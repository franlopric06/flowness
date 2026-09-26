import { useState } from 'react'
import { formatearPrecio, nombreMes } from './formato'

const ALTO = 160 // px del área de las barras

// Ventas de los últimos meses en barras (una sola serie: no lleva leyenda).
// Al pasar el mouse o tocar una barra se ve el detalle. El mes actual lleva su número.
function GraficoMeses({ porMes }) {
  const [activo, setActivo] = useState(null)
  const maximo = Math.max(...porMes.map((m) => m.total), 1)
  const actual = porMes.length - 1

  return (
    <figure className="card p-4 md:p-6">
      <figcaption className="flex items-baseline justify-between gap-3 mb-4">
        <span className="font-semibold text-texto text-sm">Ventas por mes</span>
        <span className="text-piedra text-xs">últimos {porMes.length} meses</span>
      </figcaption>

      <div className="relative flex items-end gap-2 border-b border-piedra/30" style={{ height: ALTO + 28 }}>
        {porMes.map((m, i) => {
          const alto = m.total > 0 ? Math.max(4, Math.round((m.total / maximo) * ALTO)) : 0
          const mostrarValor = i === actual || activo === i
          return (
            <button key={m.mes} type="button" className="relative flex-1 h-full flex flex-col items-center justify-end outline-none group"
              onMouseEnter={() => setActivo(i)} onMouseLeave={() => setActivo(null)}
              onFocus={() => setActivo(i)} onBlur={() => setActivo(null)} onClick={() => setActivo(i)}
              aria-label={`${nombreMes(m.mes, true)}: ${formatearPrecio(m.total)}, ${m.cantidad} ${m.cantidad === 1 ? 'venta' : 'ventas'}`}>
              {mostrarValor && (
                <span className={`absolute z-10 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[0.7rem] leading-tight text-center ${
                  activo === i ? 'bg-texto text-blanco shadow-media' : 'text-texto font-semibold'}`}
                  style={{ bottom: alto + 6 }}>
                  {formatearPrecio(m.total)}
                  {activo === i && <span className="block text-blanco/70">{m.cantidad} {m.cantidad === 1 ? 'venta' : 'ventas'}</span>}
                </span>
              )}
              <span className={`w-full max-w-6 rounded-t transition-colors ${i === actual ? 'bg-verde-oscuro' : 'bg-verde-oscuro/70 group-hover:bg-verde-oscuro'}`}
                style={{ height: alto }} aria-hidden="true" />
            </button>
          )
        })}
      </div>
      <div className="flex gap-2 mt-2">
        {porMes.map((m, i) => (
          <span key={m.mes} className={`flex-1 text-center text-[0.7rem] capitalize ${i === actual ? 'text-texto font-semibold' : 'text-piedra'}`}>{nombreMes(m.mes)}</span>
        ))}
      </div>

      {/* La misma información en tabla, para lectores de pantalla */}
      <table className="sr-only">
        <caption>Ventas por mes</caption>
        <thead><tr><th>Mes</th><th>Total</th><th>Ventas</th></tr></thead>
        <tbody>{porMes.map((m) => <tr key={m.mes}><td>{nombreMes(m.mes, true)}</td><td>{formatearPrecio(m.total)}</td><td>{m.cantidad}</td></tr>)}</tbody>
      </table>
    </figure>
  )
}

export default GraficoMeses
