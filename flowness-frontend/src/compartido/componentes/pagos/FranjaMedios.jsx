// Franja que se desliza sola con los medios de pago.
// items: [{ id, Icono, texto }]
function FranjaMedios({ items }) {
  if (items.length === 0) return null

  const lista = items.map(({ id, Icono, texto }) => (
    <span key={id} className="inline-flex items-center gap-2 px-5 text-texto/75 text-xs font-medium tracking-wide whitespace-nowrap">
      <Icono size={16} className="text-verde" /> {texto}
      <span className="ml-5 w-1 h-1 rounded-full bg-terracota" aria-hidden="true" />
    </span>
  ))

  return (
    <div className="relative overflow-hidden py-4">
      <p className="sr-only">Medios de pago: {items.map((i) => i.texto).join(', ')}.</p>
      {/* El contenido se repite dos veces para que el movimiento no tenga cortes */}
      <div className="flex w-max animate-desplazar hover:[animation-play-state:paused]" aria-hidden="true">
        <div className="flex">{lista}</div>
        <div className="flex">{lista}</div>
      </div>
      <span className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-blanco to-transparent" />
      <span className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-blanco to-transparent" />
    </div>
  )
}

export default FranjaMedios
