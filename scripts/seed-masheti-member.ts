import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating sample member (Neville Masheti)...')

  const lifeMembership = await prisma.membershipCategory.findUnique({
    where: { title: 'Life Membership' },
  })

  if (!lifeMembership) {
    console.error('❌ Life Membership category not found. Please run: npx tsx scripts/seed-membership-categories.ts')
    process.exit(1)
  }

  const password = 'admin@2026'
  const hashedPassword = await bcrypt.hash(password, 10)

  const member = await prisma.member.upsert({
    where: { idNumber: '28499602' },
    update: {
      surname: 'Masheti',
      otherNames: 'Neville Muchalwa',
      phone: '0713976532',
      countyCode: 37,
      constituencyCode: 210,
      wardCode: 1047,
      password: hashedPassword,
      membershipCategoryId: lifeMembership.id,
      status: 'active',
    },
    create: {
      idNumber: '28499602',
      ippmsId: 'IPPMS-28499602',
      surname: 'Masheti',
      otherNames: 'Neville Muchalwa',
      phone: '0713976532',
      countyCode: 37,
      constituencyCode: 210,
      wardCode: 1047,
      status: 'active',
      password: hashedPassword,
      membershipCategoryId: lifeMembership.id,
    },
  })

  console.log('✅ Sample member created successfully!')
  console.log('\nMember Details:')
  console.log(`  Name: ${member.surname} ${member.otherNames}`)
  console.log(`  ID Number: ${member.idNumber}`)
  console.log(`  Phone: ${member.phone}`)
  console.log(
    `  countyCode: ${member.countyCode} | constituencyCode: ${member.constituencyCode} | wardCode: ${member.wardCode}`
  )
  console.log(`  Membership Category: Life Membership`)
  console.log('\nLogin Credentials (membership portal):')
  console.log(`  ID Number: ${member.idNumber}`)
  console.log(`  Password: admin@2026`)
}

main()
  .catch((e) => {
    console.error('Error creating sample member:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
