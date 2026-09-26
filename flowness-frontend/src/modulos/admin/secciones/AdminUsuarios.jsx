import { useCallback, useState } from 'react'
import { ChartColumn, ShoppingBag, UsersRound } from 'lucide-react'
import ResumenVentas from '../usuarios/ResumenVentas'
import ListaCompras from '../usuarios/ListaCompras'
import ListaPersonas from '../usuarios/ListaPersonas'
import DetallePersona from '../usuarios/DetallePersona'

const VISTAS = [
  ['resumen', 'Resumen', ChartColumn],
  ['compras', 'Compras', ShoppingBag],
  ['personas', 'Personas', UsersRound],
]

// Sección "Usuarios" del panel: métricas, quién compró qué y la ficha de cada persona
function AdminUsuarios() {
  const [vista, setVista] = useState('resumen')
  const [personaAbierta, setPersonaAbierta] = useState(null)
  const cerrarPersona = useCallback(() => setPersonaAbierta(null), [])

  return (
    <div>
      <h2 className="titulo text-verde text-3xl mb-4">Usuarios y ventas</h2>

      <div className="inline-flex p-1 rounded-full bg-blanco border border-terracota/20 mb-5" role="tablist">
        {VISTAS.map(([clave, texto, Icono]) => (
          <button key={clave} type="button" role="tab" aria-selected={vista === clave} onClick={() => setVista(clave)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              vista === clave ? 'bg-verde text-blanco' : 'text-texto/70 hover:text-verde'}`}>
            <Icono size={14} /> {texto}
          </button>
        ))}
      </div>

      {vista === 'resumen' && <ResumenVentas />}
      {vista === 'compras' && <ListaCompras alVerPersona={setPersonaAbierta} />}
      {vista === 'personas' && <ListaPersonas alVerPersona={setPersonaAbierta} />}

      <DetallePersona id={personaAbierta} alCerrar={cerrarPersona} />
    </div>
  )
}

export default AdminUsuarios
