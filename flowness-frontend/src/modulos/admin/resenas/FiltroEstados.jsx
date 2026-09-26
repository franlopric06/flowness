// Pestañas chicas para filtrar las reseñas por estado, con la cantidad de cada una
const FILTROS = [
  ['PENDIENTE', 'Por revisar'],
  ['APROBADA', 'Publicadas'],
  ['RECHAZADA', 'Rechazadas'],
  ['', 'Todas'],
]

function FiltroEstados({ valor, cantidades = {}, alCambiar }) {
  const total = Object.values(cantidades).reduce((s, n) => s + n, 0)
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {FILTROS.map(([estado, texto]) => {
        const activo = valor === estado
        const cantidad = estado ? cantidades[estado] || 0 : total
        return (
          <button key={texto} type="button" onClick={() => alCambiar(estado)} aria-pressed={activo}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold border transition-colors ${
              activo ? 'bg-verde text-blanco border-verde' : 'bg-blanco text-texto/70 border-piedra/40 hover:border-verde'
            }`}>
            {texto}
            <span className={`min-w-5 px-1.5 rounded-full text-[0.65rem] ${activo ? 'bg-blanco/25' : estado === 'PENDIENTE' && cantidad ? 'bg-terracota text-blanco' : 'bg-crema'}`}>
              {cantidad}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default FiltroEstados
