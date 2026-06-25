const bcrypt = require('bcryptjs')
const prisma = require('./prisma')

async function main() {
  const hash = await bcrypt.hash('admin123', 10)
  await prisma.usuario.create({
    data: {
      nombre: 'Administradora',
      email: 'admin@flowness.com',
      password: hash,
      rol: 'admin'
    }
  })
  console.log('Admin creado correctamente')
  await prisma.$disconnect()
}

main().catch(console.error)