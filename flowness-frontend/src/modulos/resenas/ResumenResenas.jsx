import Estrellas from '../../compartido/componentes/resenas/Estrellas'

// Cabecera de las reseñas: promedio grande, estrellas y cantidad
function ResumenResenas({ promedio, cantidad }) {
  if (!cantidad) return <p className="text-piedra text-sm">Todavía no hay opiniones publicadas.</p>
  return (
    <div className="flex items-center gap-4">
      <span className="titulo text-verde text-5xl leading-none">{String(promedio).replace('.', ',')}</span>
      <div>
        <Estrellas valor={promedio} tamano={18} />
        <p className="text-piedra text-xs mt-1">{cantidad} {cantidad === 1 ? 'opinión' : 'opiniones'} de alumnas y alumnos</p>
      </div>
    </div>
  )
}

export default ResumenResenas
