import { useState } from 'react'
import { esLinkInstagram } from '../../../compartido/utilidades/medios'
import { confirmar, pedirTexto } from '../../../compartido/utilidades/dialogos'
import AgregarMedio from './AgregarMedio'
import TarjetaMedioAdmin from './TarjetaMedioAdmin'
import { CONFIG, intercambiar, mayuscula, terminacion } from './configMedios'
import * as api from '../admin.servicio'

// Fotos o videos de la galería: formulario para agregar y la lista con sus acciones
function SeccionMedios({ clase, items, alCambiar, mostrarMsg, instagramConectado }) {
  const c = CONFIG[clase]
  const [trayendo, setTrayendo] = useState(null) // id del que se está trayendo de Instagram

  // Ejecuta un cambio y muestra el aviso; si falla, el cliente de la API ya avisa el error
  const aplicar = async (accion, mensaje) => {
    try {
      await accion()
      mostrarMsg(mensaje)
      alCambiar()
    } catch { /* aviso de error automático */ }
  }

  const accionesDe = (item, i) => ({
    mover: (paso) => aplicar(() => intercambiar(items, i, i + paso, c.actualizar), 'Orden actualizado'),

    editarDescripcion: async () => {
      const texto = await pedirTexto(`Descripción ${c.articulo === 'la' ? 'de la foto' : 'del video'} (opcional):`, item.descripcion || '')
      if (texto !== null) aplicar(() => c.actualizar(item.id, { descripcion: texto }), 'Descripción guardada')
    },

    cambiarLink: async () => {
      const nuevo = await pedirTexto('Nuevo link de Instagram:', item.url)
      if (nuevo === null || nuevo.trim() === item.url) return
      if (!esLinkInstagram(nuevo)) return mostrarMsg('Ese link no es de Instagram', 'error')
      aplicar(() => c.actualizar(item.id, { url: nuevo.trim() }), 'Link actualizado')
    },

    // Pasa algo que está como recuadro de Instagram a archivo real
    traerArchivo: async () => {
      setTrayendo(item.id)
      await aplicar(() => api.importarDeInstagram(c.claseApi, item.id), 'Listo: ahora se ve en la página con todos los controles')
      setTrayendo(null)
    },

    alternar: () => aplicar(
      () => c.actualizar(item.id, { activo: !item.activo }),
      item.activo ? `${mayuscula(c.singular)} ${c.oculta} del sitio` : `${mayuscula(c.singular)} ${c.visible} en el sitio`,
    ),

    eliminar: async () => {
      if (!(await confirmar(`¿Eliminar ${c.articulo === 'la' ? 'esta foto' : 'este video'}? No se puede deshacer.`, { textoConfirmar: 'Eliminar' }))) return
      aplicar(() => c.eliminar(item.id), `${mayuscula(c.singular)} eliminad${terminacion(c)}`)
    },
  })

  return (
    <div className="card p-5 md:p-6">
      <AgregarMedio clase={clase} instagramConectado={instagramConectado} mostrarMsg={mostrarMsg} alCambiar={alCambiar} />

      {/* Listado: se ve igual que en la página */}
      {items.length === 0 ? (
        <p className="text-piedra text-sm">Todavía no hay {c.plural}.</p>
      ) : (
        <div className="medios-chicos flex flex-wrap gap-4 justify-center sm:justify-start">
          {items.map((item, i) => (
            <TarjetaMedioAdmin key={item.id} item={item} clase={clase} esPrimero={i === 0} esUltimo={i === items.length - 1}
              trayendo={trayendo === item.id} instagramConectado={instagramConectado} acciones={accionesDe(item, i)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SeccionMedios
