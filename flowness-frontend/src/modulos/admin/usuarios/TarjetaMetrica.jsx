// Un número importante con su título y un dato chico debajo
function TarjetaMetrica({ titulo, valor, detalle, Icono }) {
  return (
    <div className="card p-4 md:p-5">
      <p className="flex items-center gap-2 text-piedra text-[0.68rem] font-semibold tracking-[0.14em] uppercase mb-2">
        {Icono && <Icono size={14} className="text-verde" />} {titulo}
      </p>
      <p className="text-texto text-2xl md:text-3xl font-semibold leading-tight">{valor}</p>
      {detalle && <p className="text-texto/60 text-xs mt-1">{detalle}</p>}
    </div>
  )
}

export default TarjetaMetrica
