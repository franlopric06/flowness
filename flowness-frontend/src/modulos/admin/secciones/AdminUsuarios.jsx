import { useCargar } from '../componentes/useCargar'
import * as api from '../admin.servicio'

// Sección "Usuarios" del panel: la lista de personas registradas
function AdminUsuarios() {
  const [usuarios] = useCargar(api.obtenerUsuarios, [])
  const lista = usuarios || []

  return (
    <div>
      <h2 className="titulo text-verde text-3xl mb-5">Usuarios <span className="text-piedra text-xl">· {lista.length}</span></h2>
      <ul className="card divide-y divide-terracota/10">
        {lista.map((u) => (
          <li key={u.id} className="flex items-center gap-3 px-4 py-3">
            <span className="w-9 h-9 shrink-0 rounded-full bg-verde/15 text-verde flex items-center justify-center font-semibold text-sm">
              {u.nombre?.[0]?.toUpperCase() || '?'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-texto truncate">{u.nombre}</p>
              <p className="text-xs text-piedra truncate">{u.email}</p>
            </div>
            <span className={`chip ${u.rol === 'ADMIN' ? 'chip-verde' : 'bg-terracota/15 text-terracota'}`}>{u.rol === 'ADMIN' ? 'Admin' : 'Alumna/o'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminUsuarios
