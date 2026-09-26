import { formatearPrecio } from '../../../compartido/utilidades/video'

// Tarjetas para elegir qué nivel de la formación se edita
function SelectorNivel({ cursos, elegido, alElegir }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      {cursos.map((c) => {
        const activo = c.id === elegido
        return (
          <button key={c.id} onClick={() => alElegir(c.id)}
            className={`text-left rounded-2xl p-4 border transition-all ${
              activo ? 'bg-verde text-blanco border-verde shadow-media' : 'bg-blanco border-terracota/20 hover:border-verde hover:-translate-y-0.5'
            }`}>
            <p className={`text-[10px] tracking-widest uppercase ${activo ? 'text-blanco/80' : 'text-terracota'}`}>{c.subtitulo || 'Nivel'}</p>
            <p className="titulo text-2xl">{c.nombre}</p>
            <p className={`text-[11px] mt-1 ${activo ? 'text-blanco/80' : 'text-piedra'}`}>
              {c.precio > 0 ? formatearPrecio(c.precio) : 'Sin precio (próximamente)'} · {c.lecciones.filter((l) => l.activo).length} lecciones · {c.ventas} ventas
              {!c.activo && ' · Oculto'}
            </p>
          </button>
        )
      })}
    </div>
  )
}

export default SelectorNivel
