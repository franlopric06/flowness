import { useState } from 'react'
import { Plus } from 'lucide-react'
import { avisar } from '../../../compartido/utilidades/avisos'
import { confirmar } from '../../../compartido/utilidades/dialogos'
import { botonVerde } from '../componentes/estilos'
import { useCargar } from '../componentes/useCargar'
import FormularioAviso from '../avisos/FormularioAviso'
import FilaAviso from '../avisos/FilaAviso'
import { AVISO_VACIO, datosDeAviso } from '../avisos/datosAviso'
import * as api from '../admin.servicio'

// Sección "Avisos" del panel: novedades, clases gratis y promos que se ven en el Inicio
function AdminAvisos() {
  const [avisos, recargar] = useCargar(api.obtenerAvisos, [])
  // null = formulario cerrado · { id: null } = nuevo · { id: 5 } = editando el 5
  const [edicion, setEdicion] = useState(null)

  const nuevo = () => setEdicion({ id: null, datos: { ...AVISO_VACIO } })
  const editar = (aviso) => {
    setEdicion({ id: aviso.id, datos: datosDeAviso(aviso) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const guardar = async (form) => {
    if (edicion.id) await api.actualizarAviso(edicion.id, form)
    else await api.crearAviso(form)
    avisar(edicion.id ? 'Aviso actualizado' : 'Aviso publicado')
    setEdicion(null)
    recargar()
  }

  const cambiarVisibilidad = async (aviso) => {
    try {
      await api.actualizarAviso(aviso.id, { activo: !aviso.activo })
      avisar(aviso.activo ? 'Aviso ocultado' : 'Aviso visible')
      recargar()
    } catch { /* el aviso de error lo muestra el cliente de la API */ }
  }

  const eliminar = async (aviso) => {
    if (!(await confirmar(`¿Eliminar el aviso "${aviso.titulo}"? Si solo querés sacarlo un tiempo, usá "Ocultar".`, { textoConfirmar: 'Eliminar' }))) return
    try {
      await api.eliminarAviso(aviso.id)
      avisar('Aviso eliminado')
      recargar()
    } catch { /* el aviso de error lo muestra el cliente de la API */ }
  }

  const lista = avisos || []

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="titulo text-verde text-3xl">Avisos</h2>
        {!edicion && <button onClick={nuevo} className={botonVerde}><Plus size={14} /> Nuevo aviso</button>}
      </div>
      <p className="text-piedra text-xs mb-5">Se muestran debajo de la portada del Inicio: novedades, clases gratis y promos. Los más nuevos van primero.</p>

      {edicion && (
        <FormularioAviso key={edicion.id ?? 'nuevo'} inicial={edicion.datos} editando={!!edicion.id}
          alGuardar={guardar} alCancelar={() => setEdicion(null)} />
      )}

      {lista.length === 0 ? (
        <p className="text-piedra text-sm">Todavía no hay avisos. Tocá "Nuevo aviso" para crear el primero.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {lista.map((aviso) => (
            <FilaAviso key={aviso.id} aviso={aviso} alEditar={() => editar(aviso)}
              alCambiarVisibilidad={() => cambiarVisibilidad(aviso)} alEliminar={() => eliminar(aviso)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminAvisos
