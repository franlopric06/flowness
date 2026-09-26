import { useCallback, useEffect, useState } from 'react'
import { avisar } from '../../../compartido/utilidades/avisos'

// Pide datos al servidor al abrir una sección del panel.
// Devuelve [datos, recargar]. Si falla, muestra el aviso de error.
export function useCargar(pedir, inicial = null) {
  const [datos, setDatos] = useState(inicial)
  const recargar = useCallback(() =>
    pedir()
      .then(setDatos)
      .catch(() => avisar('No se pudieron cargar los datos', 'error')), [pedir])
  useEffect(() => { recargar() }, [recargar])
  return [datos, recargar]
}
