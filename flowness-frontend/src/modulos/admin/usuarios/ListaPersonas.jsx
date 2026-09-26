import { useCallback, useEffect, useState } from 'react'
import { ChevronRight, UsersRound } from 'lucide-react'
import { avisar } from '../../../compartido/utilidades/avisos'
import Buscador from './Buscador'
import { fechaCorta, formatearPrecio } from './formato'
import * as api from '../admin.servicio'

// Pestaña "Personas": todas las cuentas, con lo que compró cada una
function ListaPersonas({ alVerPersona }) {
  const [filtros, setFiltros] = useState({ buscar: '', compradores: '' })
  const [lista, setLista] = useState(null)

  const buscar = useCallback((texto) => setFiltros((f) => (f.buscar === texto ? f : { ...f, buscar: texto })), [])

  useEffect(() => {
    api.obtenerUsuarios(filtros).then(setLista).catch(() => avisar('No se pudieron cargar las personas', 'error'))
  }, [filtros])

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <Buscador alBuscar={buscar} placeholder="Buscar por nombre o email" />
        <label className="inline-flex items-center gap-2 text-sm text-texto/80 cursor-pointer">
          <input type="checkbox" checked={filtros.compradores === '1'} className="accent-verde w-4 h-4"
            onChange={(e) => setFiltros((f) => ({ ...f, compradores: e.target.checked ? '1' : '' }))} />
          Solo quienes compraron
        </label>
      </div>

      {!lista ? (
        <div className="esqueleto h-64 rounded-xl" />
      ) : lista.length === 0 ? (
        <div className="card p-8 text-center">
          <UsersRound size={30} className="text-terracota mx-auto mb-3" />
          <p className="text-piedra text-sm">No hay personas con esa búsqueda.</p>
        </div>
      ) : (
        <>
          <p className="text-piedra text-xs mb-2">{lista.length} {lista.length === 1 ? 'persona' : 'personas'}</p>
          <ul className="card divide-y divide-terracota/10">
            {lista.map((u) => (
              <li key={u.id}>
                <button type="button" onClick={() => alVerPersona(u.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-crema/60 transition-colors">
                  <span className="w-9 h-9 shrink-0 rounded-full bg-verde/15 text-verde flex items-center justify-center font-semibold text-sm">
                    {u.nombre?.[0]?.toUpperCase() || '?'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-texto truncate">
                      {u.nombre} {u.rol === 'ADMIN' && <span className="chip chip-verde ml-1">Admin</span>}
                    </p>
                    <p className="text-xs text-piedra truncate">{u.email} · desde {fechaCorta(u.creadoEn)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {u.comprasAprobadas > 0 ? (
                      <>
                        <p className="text-sm font-semibold text-texto">{formatearPrecio(u.totalGastado)}</p>
                        <p className="text-xs text-piedra">{u.comprasAprobadas} {u.comprasAprobadas === 1 ? 'compra' : 'compras'}</p>
                      </>
                    ) : <p className="text-xs text-piedra">Sin compras</p>}
                  </div>
                  <ChevronRight size={16} className="text-piedra shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default ListaPersonas
