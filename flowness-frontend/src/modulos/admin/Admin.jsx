import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Layers, Clapperboard, GraduationCap, Images, Megaphone, Star, UserRound, Settings, Users, ShieldAlert, ExternalLink } from 'lucide-react'
import { avisar } from '../../compartido/utilidades/avisos'
import { tabContent } from '../../compartido/utilidades/animaciones'
import EstadoVacio from '../../compartido/componentes/EstadoVacio'
import AdminFases from './AdminFases'
import AdminClases from './AdminClases'
import AdminFormacion from './AdminFormacion'
import AdminGaleria from './AdminGaleria'
import AdminAvisos from './secciones/AdminAvisos'
import AdminResenas from './secciones/AdminResenas'
import AdminSobreMi from './secciones/AdminSobreMi'
import AdminConfiguracion from './secciones/AdminConfiguracion'
import AdminUsuarios from './secciones/AdminUsuarios'

// Los avisos de éxito / error se muestran con el sistema de avisos del sitio
const mostrarMsg = (texto, tipo = 'exito') => avisar(texto, tipo)

// Cada pestaña del panel: nombre, ícono y el componente que la dibuja
const SECCIONES = [
  ['Fases', Layers, AdminFases],
  ['Clases', Clapperboard, AdminClases],
  ['Formación', GraduationCap, AdminFormacion],
  ['Galería', Images, AdminGaleria],
  ['Avisos', Megaphone, AdminAvisos],
  ['Reseñas', Star, AdminResenas],
  ['Sobre mí', UserRound, AdminSobreMi],
  ['Configuración', Settings, AdminConfiguracion],
  ['Usuarios', Users, AdminUsuarios],
]

// Panel de administración: encabezado, pestañas y la sección elegida
function Admin() {
  const [seccion, setSeccion] = useState('Fases')
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  if (usuario.rol !== 'ADMIN') {
    return (
      <main className="contenedor pt-32 min-h-screen">
        <EstadoVacio icono={ShieldAlert} error titulo="Acceso denegado" texto="Esta sección es solo para la administración del sitio.">
          <Link to="/" className="btn btn-secundario">Ir al inicio</Link>
        </EstadoVacio>
      </main>
    )
  }

  const Seccion = SECCIONES.find(([nombre]) => nombre === seccion)[2]

  return (
    <main className="min-h-screen pt-20 md:pt-24">
      <div className="contenedor pb-20">
        <div className="flex flex-wrap items-end justify-between gap-3 mt-4 mb-6">
          <div>
            <p className="etiqueta mb-1">Hola, {usuario.nombre?.split(' ')[0]}</p>
            <h1 className="titulo text-verde text-4xl md:text-5xl">Panel de administración</h1>
          </div>
          <Link to="/" target="_blank" className="btn btn-chico btn-secundario"><ExternalLink size={14} /> Ver sitio</Link>
        </div>

        {/* Pestañas: en el celular se deslizan de costado */}
        <nav className="sticky top-16 md:top-20 z-20 -mx-5 px-5 md:mx-0 md:px-0 py-3 mb-6 bg-crema/90 backdrop-blur-md">
          <div className="flex gap-2 overflow-x-auto no-scrollbar md:flex-wrap">
            {SECCIONES.map(([nombre, Icono]) => {
              const activa = seccion === nombre
              return (
                <button key={nombre} onClick={() => setSeccion(nombre)}
                  className={`relative shrink-0 inline-flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.14em] uppercase px-4 py-2.5 rounded-full transition-colors ${
                    activa ? 'text-blanco' : 'text-verde bg-blanco border border-verde/30 hover:border-verde'
                  }`}>
                  {activa && <motion.span layoutId="pestanaAdmin" className="absolute inset-0 bg-verde rounded-full -z-0" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <Icono size={15} className="relative" /><span className="relative">{nombre}</span>
                </button>
              )
            })}
          </div>
        </nav>

        <AnimatePresence mode="wait">
          <motion.section key={seccion} {...tabContent}>
            <Seccion mostrarMsg={mostrarMsg} />
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  )
}

export default Admin
