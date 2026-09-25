import { Routes, Route } from 'react-router-dom'
import Header from '../compartido/layout/Encabezado'
import Footer from '../compartido/layout/PiePagina'
import ScrollAlTope from '../compartido/componentes/ScrollAlTope'
import PopupFlowness from '../compartido/componentes/PopupFlowness'
import BotonWhatsapp from '../compartido/componentes/BotonWhatsapp'
import Inicio from '../modulos/inicio/Inicio'
import Clases from '../modulos/clases/Clases'
import Formacion from '../modulos/formacion/Formacion'
import CursoDetalle from '../modulos/formacion/CursoDetalle'
import SobreMi from '../modulos/sobre-mi/SobreMi'
import Galeria from '../modulos/galeria/Galeria'
import Contacto from '../modulos/contacto/Contacto'
import Ingresar from '../modulos/auth/Ingresar'
import MiCuenta from '../modulos/cuenta/MiCuenta'
import PagoExitoso from '../modulos/pagos/PagoExitoso'
import PagoFallido from '../modulos/pagos/PagoFallido'
import Admin from '../modulos/admin/Admin'

function App() {
  return (
    <>
      <ScrollAlTope />
      <Header />
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={
          <>
            <PopupFlowness />
            <BotonWhatsapp />
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/clases" element={<Clases />} />
              <Route path="/formacion" element={<Formacion />} />
              <Route path="/formacion/:slug" element={<CursoDetalle />} />
              <Route path="/sobre-mi" element={<SobreMi />} />
              <Route path="/galeria" element={<Galeria />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/ingresar" element={<Ingresar />} />
              <Route path="/mi-cuenta" element={<MiCuenta />} />
              <Route path="/pago-exitoso" element={<PagoExitoso />} />
              <Route path="/pago-fallido" element={<PagoFallido />} />
            </Routes>
          </>
        } />
      </Routes>
      <Footer />
    </>
  )
}

export default App
