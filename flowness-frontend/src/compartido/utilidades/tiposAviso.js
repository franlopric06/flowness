import { Megaphone, Gift, BadgePercent } from 'lucide-react'

// Tipos de aviso: cómo se ven y qué botón sugieren por defecto
export const TIPOS_AVISO = {
  NOVEDAD: { nombre: 'Novedad', Icono: Megaphone, chip: 'bg-terracota/20 text-texto', icono: 'bg-terracota/20 text-terracota', destino: '' },
  CLASE_GRATIS: { nombre: 'Clase gratis', Icono: Gift, chip: 'chip-verde', icono: 'bg-verde/15 text-verde', destino: 'clases' },
  PROMO: { nombre: 'Promo', Icono: BadgePercent, chip: 'bg-verde-oscuro text-blanco', icono: 'bg-verde-oscuro/15 text-verde-oscuro', destino: 'whatsapp' },
}

export const tipoDeAviso = (tipo) => TIPOS_AVISO[tipo] || TIPOS_AVISO.NOVEDAD

// Texto del botón según a dónde lleva y el tipo de aviso
export function textoBotonAviso({ destino, tipo }) {
  if (destino === 'whatsapp') return 'Consultar por WhatsApp'
  if (destino === 'clases') return tipo === 'CLASE_GRATIS' ? 'Ver la clase gratis' : 'Ver clases'
  if (destino === 'formacion') return 'Ver la formación'
  return 'Ver más'
}
