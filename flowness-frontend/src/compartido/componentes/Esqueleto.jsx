// Siluetas que titilan mientras se cargan los datos (en vez de "Cargando…")

export function EsqueletoTarjeta({ imagen = 'aspect-video' }) {
  return (
    <div className="card">
      <div className={`esqueleto rounded-none ${imagen}`} />
      <div className="p-5 space-y-3">
        <div className="esqueleto h-4 w-2/3" />
        <div className="esqueleto h-3 w-full" />
        <div className="esqueleto h-3 w-4/5" />
        <div className="esqueleto h-10 w-full rounded-full mt-4" />
      </div>
    </div>
  )
}

export function EsqueletoGrilla({ cantidad = 3, imagen, className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' }) {
  return (
    <div className={className} aria-label="Cargando" role="status">
      {Array.from({ length: cantidad }).map((_, i) => <EsqueletoTarjeta key={i} imagen={imagen} />)}
    </div>
  )
}
