/**
 * Create admin User for member 28499602 (Neville Muchalwa Masheti)
 * and set member + admin password to Craft@2015
 * Usage: npx tsx scripts/create-masheti-admin.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const ADMIN_EMAIL = 'mashetin.91@gmail.com'
const ADMIN_PASSWORD = 'Craft@2015'
const MEMBER_ID_NUMBER = '28499602'
const DISPLAY_NAME = 'Neville Muchalwa Masheti'

async function main() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)

  // 1. Update member password to Craft@2015
  const member = await prisma.member.findUnique({
    where: { idNumber: MEMBER_ID_NUMBER },
  })

  if (!member) {
    console.error('Member with ID 28499602 not found. Run create-masheti-member.ts first.')
    process.exit(1)
  }

  await prisma.member.update({
    where: { idNumber: MEMBER_ID_NUMBER },
    data: { password: hashedPassword },
  })
  console.log('Member password updated to Craft@2015 (membership portal login).')

  // 2. Create or update admin User (super_admin = full admin rights)
  const user = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      password: hashedPassword,
      name: DISPLAY_NAME,
      role: 'super_admin',
    },
    create: {
      email: ADMIN_EMAIL,
      password: hashedPassword,
      name: DISPLAY_NAME,
      role: 'super_admin',
    },
  })

  console.log('Admin user created/updated successfully.')
  console.log('  Email:', user.email)
  console.log('  Name:', user.name)
  console.log('  Role:', user.role)
  console.log('  Password: Craft@2015')
  console.log('\nLogin at /admin/login with the email and password above.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
