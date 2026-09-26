// Tarjeta con título para cada parte de Configuración
function Bloque({ titulo, Icono, children }) {
  return (
    <section className="card p-5 md:p-6">
      <h3 className="flex items-center gap-2 text-verde font-semibold text-sm tracking-[0.14em] uppercase mb-4">
        {Icono && <Icono size={16} />} {titulo}
      </h3>
      {children}
    </section>
  )
}

export default Bloque
