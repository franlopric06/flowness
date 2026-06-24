import { Routes, Route } from 'react-router-dom'
import Header from './layout/Header'
import Footer from './layout/Footer'
import Inicio from './pages/Inicio'
import Cursos from './pages/Cursos'
import Contacto from './pages/Contacto'
import SobreMi from './pages/SobreMi'
import Galeria from './pages/Galeria'
import Login from './pages/Login'
import ElMetodo from './pages/ElMetodo'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/sobre-mi" element={<SobreMi />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/ingresar" element={<Login />} />
        <Route path="/metodo" element={<ElMetodo />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App