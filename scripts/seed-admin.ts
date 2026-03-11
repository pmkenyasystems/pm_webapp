import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating sample admin users...')

  // Hash default passwords
  const defaultPassword = 'admin123'
  const hashedPassword = await bcrypt.hash(defaultPassword, 10)

  // Create super admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@pmkenya.org' },
    update: {
      name: 'Super Admin',
      password: hashedPassword,
      role: 'super_admin',
      modules: null, // Super admin has access to all modules
    },
    create: {
      email: 'superadmin@pmkenya.org',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'super_admin',
      modules: null, // Super admin has access to all modules
    },
  })

  console.log('✅ Super Admin created successfully!')
  console.log('\nSuper Admin Details:')
  console.log(`  Name: ${superAdmin.name}`)
  console.log(`  Email: ${superAdmin.email}`)
  console.log(`  Role: ${superAdmin.role}`)
  console.log(`  Modules: All (super admin has access to all modules)`)
  console.log(`\nLogin Credentials:`)
  console.log(`  Email: ${superAdmin.email}`)
  console.log(`  Password: ${defaultPassword}`)

  // Create regular admin with specific modules
  const adminModules = JSON.stringify(['news', 'events', 'members'])
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pmkenya.org' },
    update: {
      name: 'Regular Admin',
      password: hashedPassword,
      role: 'admin',
      modules: adminModules,
    },
    create: {
      email: 'admin@pmkenya.org',
      password: hashedPassword,
      name: 'Regular Admin',
      role: 'admin',
      modules: adminModules,
    },
  })

  console.log('\n✅ Regular Admin created successfully!')
  console.log('\nRegular Admin Details:')
  console.log(`  Name: ${admin.name}`)
  console.log(`  Email: ${admin.email}`)
  console.log(`  Role: ${admin.role}`)
  console.log(`  Modules: ${admin.modules ? JSON.parse(admin.modules).join(', ') : 'None'}`)
  console.log(`\nLogin Credentials:`)
  console.log(`  Email: ${admin.email}`)
  console.log(`  Password: ${defaultPassword}`)

  console.log('\n⚠️  Please change the passwords after first login!')
}

main()
  .catch((e) => {
    console.error('Error creating sample admins:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

