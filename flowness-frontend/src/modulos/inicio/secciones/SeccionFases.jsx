import TituloSeccion from '../../../compartido/componentes/TituloSeccion'
import FasesEnVideo from '../FasesEnVideo'

// "El método": las fases de Flowness sobre fondo verde
function SeccionFases({ fases }) {
  if (!fases.length) return null
  return (
    <section id="metodo" className="patron-marca bg-verde py-20 md:py-28 mt-16 scroll-mt-20">
      <div className="contenedor">
        <TituloSeccion claro
          etiqueta="El método"
          titulo={`Las ${fases.length} fases de Flowness`}
          texto="Cada clase recorre estas fases, una después de la otra. Así, en cada práctica trabajás el cuerpo y la mente de forma completa."
        />
        <FasesEnVideo fases={fases} />
      </div>
    </section>
  )
}

export default SeccionFases
