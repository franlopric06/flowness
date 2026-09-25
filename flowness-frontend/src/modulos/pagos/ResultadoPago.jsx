import { motion } from 'framer-motion'

// Pantalla de resultado de pago: ícono animado, título, texto y botones
function ResultadoPago({ icono: Icono, color, titulo, texto, children }) {
  return (
    <main className="relative isolate overflow-hidden min-h-screen flex items-center justify-center px-5 pt-24 pb-16 text-center">
      <span className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-verde/15 blur-3xl animate-respirar -z-10" aria-hidden="true" />
      <div className="max-w-md">
        <motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14 }}
          className={`relative mx-auto mb-8 w-24 h-24 rounded-full flex items-center justify-center ${color}`}>
          <span className={`absolute inset-0 rounded-full animate-ping-slow opacity-30 ${color}`} aria-hidden="true" />
          <Icono size={44} strokeWidth={1.8} />
        </motion.span>
        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="titulo text-verde text-4xl md:text-5xl mb-4">{titulo}</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-texto/75 text-sm md:text-base leading-relaxed mb-9">{texto}</motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-3 justify-center">
          {children}
        </motion.div>
      </div>
    </main>
  )
}

export default ResultadoPago
