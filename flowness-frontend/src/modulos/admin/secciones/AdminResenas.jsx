import { useCallback, useEffect, useState } from 'react'
import { MessageSquareHeart } from 'lucide-react'
import { avisar } from '../../../compartido/utilidades/avisos'
import { confirmar, pedirTexto } from '../../../compartido/utilidades/dialogos'
import FiltroEstados from '../resenas/FiltroEstados'
import TarjetaResenaAdmin from '../resenas/TarjetaResenaAdmin'
import * as api from '../admin.servicio'

const MENSAJES = { APROBADA: 'Reseña publicada', RECHAZADA: 'Reseña rechazada' }

// Sección "Reseñas" del panel: revisar, publicar, destacar y responder opiniones
function AdminResenas() {
  const [filtro, setFiltro] = useState('PENDIENTE')
  const [datos, setDatos] = useState({ resenas: [], cantidades: {} })

  const cargar = useCallback(() =>
    api.obtenerResenasAdmin(filtro).then(setDatos).catch(() => avisar('No se pudieron cargar las reseñas', 'error')), [filtro])
  useEffect(() => { cargar() }, [cargar])

  const moderar = async (resena, cambios) => {
    try {
      await api.moderarResena(resena.id, cambios)
      avisar(MENSAJES[cambios.estado] || (cambios.destacada ? 'Ahora se ve en el Inicio' : 'Cambio guardado'))
      cargar()
    } catch { /* el aviso de error lo muestra el cliente de la API */ }
  }

  const responder = async (resena) => {
    const texto = await pedirTexto('Tu respuesta (se ve debajo de la reseña). Dejala vacía para borrarla.', resena.respuesta || '')
    if (texto === null || texto === undefined) return
    moderar(resena, { respuesta: texto })
  }

  const eliminar = async (resena) => {
    if (!(await confirmar('¿Eliminar esta reseña? No se puede deshacer.', { textoConfirmar: 'Eliminar' }))) return
    try {
      await api.eliminarResena(resena.id)
      avisar('Reseña eliminada')
      cargar()
    } catch { /* el aviso de error lo muestra el cliente de la API */ }
  }

  return (
    <div>
      <h2 className="titulo text-verde text-3xl mb-2">Reseñas</h2>
      <p className="text-piedra text-xs mb-5">
        Solo pueden opinar quienes compraron (o tienen la clase gratis). Nada se publica hasta que lo aprobás.
        Las que marques con "Mostrar en el Inicio" aparecen como testimonios.
      </p>

      <FiltroEstados valor={filtro} cantidades={datos.cantidades} alCambiar={setFiltro} />

      {datos.resenas.length === 0 ? (
        <div className="card p-8 text-center">
          <MessageSquareHeart size={32} className="text-terracota mx-auto mb-3" />
          <p className="text-piedra text-sm">{filtro === 'PENDIENTE' ? 'No hay reseñas por revisar. ¡Todo al día!' : 'No hay reseñas acá todavía.'}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {datos.resenas.map((r) => (
            <TarjetaResenaAdmin key={r.id} resena={r} alModerar={(cambios) => moderar(r, cambios)}
              alResponder={() => responder(r)} alEliminar={() => eliminar(r)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminResenas
