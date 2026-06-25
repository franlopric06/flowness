import GaleriaComponent from '../components/Galeria'
import SEO from '../components/SEO'

function Galeria() {
  return (
     <>
      <SEO
        titulo="Galería"
        descripcion="Fotos y videos de muestra gratuitos del método Flowness. Conocé las seis fases antes de comenzar tu formación."
        url="/galeria"
      />
    <div className="pt-12 min-hscreen md:pt-24">
      <GaleriaComponent />
    </div>
    </>
  )
}

export default Galeria