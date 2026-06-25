import SobreMiComponent from '../components/SobreMi'
import SEO from '../components/SEO'

function SobreMi() {
  return (
     <>
      <SEO
        titulo="Sobre mí"
        descripcion="Conocé a Flor Verazay, kinesióloga creadora del método Flowness. Su historia, formación y filosofía de trabajo."
        url="/sobre-mi"
      />
    <div className="pt-24 min-hscreen md:pt-28">
      <SobreMiComponent />
    </div>
    </>
  )
}

export default SobreMi