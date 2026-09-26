import prisma from '../../config/prisma.js'
import { mesDe, ultimosMeses } from './admin.fechas.js'

const MESES_GRAFICO = 6

const sumar = (lista) => lista.reduce((s, c) => s + c.monto, 0)

// Lo más vendido: agrupa las compras aprobadas por clase o curso
function masVendidos(aprobadas, cantidad = 5) {
  const grupos = new Map()
  for (const c of aprobadas) {
    const clave = c.cursoId ? `curso-${c.cursoId}` : `clase-${c.claseId}`
    const nombre = c.curso?.nombre || c.clase?.nombre || 'Sin nombre'
    const g = grupos.get(clave) || { clave, nombre, tipo: c.cursoId ? 'Formación' : 'Clase', cantidad: 0, total: 0 }
    g.cantidad += 1
    g.total += c.monto
    grupos.set(clave, g)
  }
  return [...grupos.values()].sort((a, b) => b.total - a.total).slice(0, cantidad)
}

// GET /api/admin/metricas — números del negocio para el panel.
// Se calculan sobre las compras aprobadas (el volumen de Flowness lo permite sin problema).
export const obtenerMetricas = async (req, res) => {
  try {
    const [aprobadas, pendientes, usuarios] = await Promise.all([
      prisma.compra.findMany({
        where: { estado: 'APROBADO' },
        select: { monto: true, creadoEn: true, usuarioId: true, claseId: true, cursoId: true, clase: { select: { nombre: true } }, curso: { select: { nombre: true } } },
      }),
      prisma.compra.count({ where: { estado: 'PENDIENTE' } }),
      prisma.usuario.findMany({ where: { rol: 'USUARIO' }, select: { creadoEn: true } }),
    ])

    const meses = ultimosMeses(MESES_GRAFICO)
    const esteMes = meses[meses.length - 1]
    const mesPasado = meses[meses.length - 2]
    const delMes = (mes) => aprobadas.filter((c) => mesDe(c.creadoEn) === mes)

    const ventasMes = delMes(esteMes)
    const ventasMesPasado = delMes(mesPasado)

    res.json({
      mes: esteMes,
      ventasMes: { total: sumar(ventasMes), cantidad: ventasMes.length },
      ventasMesPasado: { total: sumar(ventasMesPasado), cantidad: ventasMesPasado.length },
      ventasTotales: { total: sumar(aprobadas), cantidad: aprobadas.length },
      ticketPromedio: aprobadas.length ? Math.round(sumar(aprobadas) / aprobadas.length) : 0,
      compradores: new Set(aprobadas.map((c) => c.usuarioId)).size,
      pagosPendientes: pendientes,
      usuarios: {
        total: usuarios.length,
        nuevosMes: usuarios.filter((u) => mesDe(u.creadoEn) === esteMes).length,
      },
      porMes: meses.map((mes) => {
        const lista = delMes(mes)
        return { mes, total: sumar(lista), cantidad: lista.length }
      }),
      masVendidos: masVendidos(aprobadas),
    })
  } catch (err) {
    console.error('Error al calcular métricas:', err?.message || err)
    res.status(500).json({ error: 'Error al calcular las métricas' })
  }
}
