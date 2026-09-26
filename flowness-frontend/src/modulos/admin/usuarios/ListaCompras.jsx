import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, Loader2, ShoppingBag } from 'lucide-react'
import { avisar } from '../../../compartido/utilidades/avisos'
import { botonBorde, botonIcono } from '../componentes/estilos'
import Buscador from './Buscador'
import FilaCompra from './FilaCompra'
import { descargarComprasCsv } from './descargarCsv'
import * as api from '../admin.servicio'

const ESTADOS = [['', 'Todos'], ['APROBADO', 'Pagados'], ['PENDIENTE', 'Pendientes'], ['RECHAZADO', 'Rechazados']]
const TIPOS = [['', 'Clases y formación'], ['clase', 'Solo clases'], ['curso', 'Solo formación']]

// Pestaña "Compras": quién compró qué, con búsqueda, filtros, páginas y descarga
function ListaCompras({ alVerPersona }) {
  const [filtros, setFiltros] = useState({ buscar: '', estado: '', tipo: '', pagina: 1 })
  const [datos, setDatos] = useState(null)
  const [descargando, setDescargando] = useState(false)

  const cambiar = (campo, valor) => setFiltros((f) => ({ ...f, [campo]: valor, pagina: campo === 'pagina' ? valor : 1 }))
  const buscar = useCallback((texto) => setFiltros((f) => (f.buscar === texto ? f : { ...f, buscar: texto, pagina: 1 })), [])

  useEffect(() => {
    api.obtenerCompras(filtros).then(setDatos).catch(() => avisar('No se pudieron cargar las compras', 'error'))
  }, [filtros])

  const descargar = async () => {
    setDescargando(true)
    try {
      const { compras } = await api.obtenerCompras({ ...filtros, pagina: '', todas: 1 })
      descargarComprasCsv(compras)
    } catch {
      avisar('No se pudo descargar', 'error')
    }
    setDescargando(false)
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <Buscador alBuscar={buscar} placeholder="Buscar por nombre, email, clase, curso o N° de pago" />
        <select value={filtros.estado} onChange={(e) => cambiar('estado', e.target.value)} className="input !w-auto" aria-label="Estado del pago">
          {ESTADOS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
        </select>
        <select value={filtros.tipo} onChange={(e) => cambiar('tipo', e.target.value)} className="input !w-auto" aria-label="Tipo de compra">
          {TIPOS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
        </select>
        <button type="button" onClick={descargar} disabled={descargando || !datos?.total} className={botonBorde}>
          {descargando ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Descargar (Excel)
        </button>
      </div>

      {!datos ? (
        <div className="esqueleto h-64 rounded-xl" />
      ) : datos.compras.length === 0 ? (
        <div className="card p-8 text-center">
          <ShoppingBag size={30} className="text-terracota mx-auto mb-3" />
          <p className="text-piedra text-sm">{filtros.buscar || filtros.estado || filtros.tipo ? 'No hay compras con esos filtros.' : 'Todavía no hay compras.'}</p>
        </div>
      ) : (
        <>
          <p className="text-piedra text-xs mb-2">{datos.total} {datos.total === 1 ? 'compra' : 'compras'}</p>
          <ul className="card divide-y divide-terracota/10">
            {datos.compras.map((c) => <FilaCompra key={c.id} compra={c} alVerPersona={alVerPersona} />)}
          </ul>
          {datos.paginas > 1 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <button type="button" onClick={() => cambiar('pagina', datos.pagina - 1)} disabled={datos.pagina <= 1} className={botonIcono} aria-label="Página anterior"><ChevronLeft size={16} /></button>
              <span className="text-sm text-texto/70">Página {datos.pagina} de {datos.paginas}</span>
              <button type="button" onClick={() => cambiar('pagina', datos.pagina + 1)} disabled={datos.pagina >= datos.paginas} className={botonIcono} aria-label="Página siguiente"><ChevronRight size={16} /></button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ListaCompras
