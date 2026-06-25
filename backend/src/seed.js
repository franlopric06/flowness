const prisma = require('./prisma')

async function main() {

  // Cursos
  await prisma.curso.createMany({
    data: [
      {
        nivel: '01',
        nombre: 'Flowness Esencial',
        descripcion: 'Para quienes inician su camino en el método Flowness. No se requieren conocimientos previos.',
        precio: 1500,
        duracion: '4 semanas',
        videos: 12
      },
      {
        nivel: '02',
        nombre: 'Flowness Avanza',
        descripcion: 'Para quienes buscan profundizar en el método. Trabajamos flexibilidad activa y control del movimiento.',
        precio: 20000,
        duracion: '6 semanas',
        videos: 18
      },
      {
        nivel: '03',
        nombre: 'Flowness Pro',
        descripcion: 'Para profesionales de la salud que quieren incorporar el método en su práctica.',
        precio: 28000,
        duracion: '8 semanas',
        videos: 24
      }
    ]
  })

  // Clases
  const clases = [
    { fase: '01', nombre: 'Consciencia Corporal', descripcion: 'Aprendé a escuchar las señales internas de tu cuerpo.', duracion: '60 min', precio_vivo: 3000, precio_grabada: 2000 },
    { fase: '02', nombre: 'Movilidad Articular', descripcion: 'Explorá los límites actuales de tu cuerpo de forma segura.', duracion: '60 min', precio_vivo: 3000, precio_grabada: 2000 },
    { fase: '03', nombre: 'Flexibilidad Activa', descripcion: 'Ganá amplitud de movimiento desde la fuerza muscular controlada.', duracion: '60 min', precio_vivo: 3000, precio_grabada: 2000 },
    { fase: '04', nombre: 'Control y Estabilidad', descripcion: 'Aprendé a moverte con precisión y eficiencia.', duracion: '60 min', precio_vivo: 3500, precio_grabada: 2500 },
    { fase: '05', nombre: 'Fluidez de Movimiento', descripcion: 'Conectá todas las fases para lograr un movimiento natural.', duracion: '60 min', precio_vivo: 3500, precio_grabada: 2500 },
    { fase: '06', nombre: 'Mindfulness en Movimiento', descripcion: 'Integrá la conciencia plena con cada patrón de movimiento.', duracion: '60 min', precio_vivo: 3500, precio_grabada: 2500 },
  ]

  for (const claseData of clases) {
    const clase = await prisma.clase.create({ data: claseData })

    // Horarios para cada clase
    const horarios = [
      { dia: 'Lunes', hora: '18:00' },
      { dia: 'Miércoles', hora: '10:00' },
      { dia: 'Viernes', hora: '18:00' },
    ]

    await prisma.horario.createMany({
      data: horarios.map(h => ({ ...h, claseId: clase.id }))
    })
  }

  console.log('Datos cargados correctamente ✓')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())