import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      permissions: [
        'users.read','users.write','products.read','products.write',
        'orders.read','orders.write','uploads.write','audit.read'
      ]
    }
  })

  const passwordHash = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: passwordHash,
      name: 'Administrator',
      roles: { connect: [{ id: adminRole.id }] }
    }
  })

  await prisma.product.createMany({
    data: [
      { sku: 'SKU-001', name: 'Thùng carton S', price: 15000, stock: 120 },
      { sku: 'SKU-002', name: 'Túi nilon M',   price: 3000,  stock: 500 },
      { sku: 'SKU-003', name: 'Băng dính 5cm', price: 12000, stock: 220 }
    ],
    skipDuplicates: true
  })

  console.log('Seed completed for admin and sample products:', admin.email)
}

main().catch(e=>{console.error(e); process.exit(1)}).finally(()=>prisma.$disconnect())
