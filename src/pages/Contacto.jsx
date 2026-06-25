import ContactoComponent from '../components/Contacto'
import SEO from '../components/SEO'

function Contacto() {
  return (
     <>
      <SEO
        titulo="Contacto"
        descripcion="Contactate con Flowness para consultas sobre clases online, cursos y formación en movilidad y flexibilidad."
        url="/contacto"
      />
    <div className="pt-14 min-hscreen md:pt-24">
      <ContactoComponent />
    </div>
    </>
  )
}

export default Contacto