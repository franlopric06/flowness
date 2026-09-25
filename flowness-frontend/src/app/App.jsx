import { Routes, Route, useLocation } from 'react-router-dom'
import { MotionConfig, motion } from 'framer-motion'
import Header from '../compartido/layout/Encabezado'
import Footer from '../compartido/layout/PiePagina'
import ScrollAlTope from '../compartido/componentes/ScrollAlTope'
import PopupFlowness from '../compartido/componentes/PopupFlowness'
import BotonWhatsapp from '../compartido/componentes/BotonWhatsapp'
import Avisos from '../compartido/componentes/Avisos'
import Dialogo from '../compartido/componentes/Dialogo'
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
  const ubicacion = useLocation()
  const esAdmin = ubicacion.pathname.startsWith('/admin')
  // En la página de un curso hay una barra de compra fija abajo: no se tapan con los flotantes
  const sinFlotantes = esAdmin || ubicacion.pathname.startsWith('/formacion/')

  return (
    // reducedMotion="user": si la persona pidió "reducir movimiento" en su equipo, no se anima nada
    <MotionConfig reducedMotion="user">
      <ScrollAlTope />
      <Header />
      <Avisos />
      <Dialogo />
      {!sinFlotantes && <PopupFlowness />}
      {!sinFlotantes && <BotonWhatsapp />}

      {/* Transición suave al cambiar de página */}
      <motion.div
        key={ubicacion.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Routes location={ubicacion}>
          <Route path="/admin" element={<Admin />} />
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
      </motion.div>

      <Footer />
    </MotionConfig>
  )
}

export default App
