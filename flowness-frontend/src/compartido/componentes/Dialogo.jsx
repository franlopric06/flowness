import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, PencilLine } from 'lucide-react'
import { escucharDialogos } from '../utilidades/dialogos'
import { fadeIn, scaleIn } from '../utilidades/animaciones'

// Ventana de confirmación / texto con el estilo de Flowness
function Dialogo() {
  const [dialogo, setDialogo] = useState(null)
  const [texto, setTexto] = useState('')

  useEffect(() => escucharDialogos((d) => {
    setTexto(d.valorInicial || '')
    setDialogo(d)
  }), [])

  const responder = (aceptar) => {
    if (!dialogo) return
    dialogo.resolver(dialogo.tipo === 'texto' ? (aceptar ? texto : null) : aceptar)
    setDialogo(null)
  }

  // Escape cancela
  useEffect(() => {
    if (!dialogo) return
    const alApretar = (e) => { if (e.key === 'Escape') responder(false) }
    window.addEventListener('keydown', alApretar)
    return () => window.removeEventListener('keydown', alApretar)
  })

  return (
    <AnimatePresence>
      {dialogo && (
        <motion.div {...fadeIn} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-black/50 flex items-end sm:items-center justify-center p-4"
          onClick={() => responder(false)}>
          <motion.div {...scaleIn} exit={{ opacity: 0, scale: 0.95 }} role="dialog" aria-modal="true"
            className="card w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3 mb-5">
              <span className={`icono-caja ${dialogo.tipo === 'texto' ? 'bg-verde/15 text-verde' : dialogo.peligro ? 'bg-error/10 text-error' : 'bg-verde/15 text-verde'}`}>
                {dialogo.tipo === 'texto' ? <PencilLine size={20} /> : <AlertTriangle size={20} />}
              </span>
              <p className="text-texto text-sm leading-relaxed pt-2">{dialogo.mensaje}</p>
            </div>
            {dialogo.tipo === 'texto' && (
              <input autoFocus value={texto} onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') responder(true) }} className="input mb-5" />
            )}
            <div className="flex gap-3 justify-end">
              <button onClick={() => responder(false)} className="btn btn-chico btn-secundario">Cancelar</button>
              <button autoFocus={dialogo.tipo !== 'texto'} onClick={() => responder(true)}
                className={`btn btn-chico ${dialogo.tipo === 'confirmar' && dialogo.peligro ? 'bg-error text-blanco hover:brightness-95' : 'btn-primario'}`}>
                {dialogo.textoConfirmar}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Dialogo
