import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Hourglass, XCircle, FileText, PlayCircle, GraduationCap, ExternalLink } from 'lucide-react'
import { fadeUp } from '../../../compartido/utilidades/animaciones'

// Pantalla después de pagar
function ResultadoPagoPropio({ resultado, compra, esCurso }) {
  const { status, boleta } = resultado
  const aprobado = status === 'approved'
  const rechazado = status === 'rejected'
  const Icono = aprobado ? CheckCircle2 : rechazado ? XCircle : Hourglass
  const color = aprobado ? 'bg-verde text-blanco' : rechazado ? 'bg-terracota text-blanco' : 'bg-arena text-texto'

  return (
    <motion.div {...fadeUp} className="card p-8 md:p-12 text-center max-w-xl mx-auto">
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        className={`mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center ${color}`}>
        <Icono size={38} strokeWidth={1.8} />
      </motion.span>
      <h2 className="titulo text-verde text-4xl mb-3">
        {aprobado ? '¡Pago aprobado!' : rechazado ? 'El pago no se aprobó' : boleta ? 'Te falta pagar la boleta' : 'Pago en revisión'}
      </h2>
      <p className="text-texto/75 text-sm leading-relaxed mb-8">
        {aprobado
          ? `Ya tenés acceso a ${compra.titulo}. ¡Que lo disfrutes!`
          : rechazado
            ? 'No se hizo ningún cobro. Revisá los datos de la tarjeta o probá con otro medio de pago.'
            : boleta
              ? 'Imprimí o mostrá la boleta en Rapipago o Pago Fácil. Cuando se acredite, se habilita solo en tu cuenta.'
              : 'Mercado Pago está revisando el pago. Apenas se apruebe, se habilita solo en tu cuenta.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {aprobado && (
          <Link to={compra.volver || '/mi-cuenta'} className="btn btn-primario btn-brillo">
            {esCurso ? <><GraduationCap size={16} /> Ir al curso</> : <><PlayCircle size={16} /> Ver la clase</>}
          </Link>
        )}
        {boleta && (
          <a href={boleta} target="_blank" rel="noreferrer" className="btn btn-primario"><FileText size={16} /> Ver boleta <ExternalLink size={13} /></a>
        )}
        {rechazado && (
          <button onClick={() => window.location.reload()} className="btn btn-primario">Probar de nuevo</button>
        )}
        <Link to="/mi-cuenta" className="btn btn-secundario">Mi cuenta</Link>
      </div>
    </motion.div>
  )
}

export default ResultadoPagoPropio
