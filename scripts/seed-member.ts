import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating sample member...')

  // Get Life Membership category
  const lifeMembership = await prisma.membershipCategory.findUnique({
    where: { title: 'Life Membership' },
  })

  if (!lifeMembership) {
    console.error('❌ Life Membership category not found. Please run seed-membership-categories.ts first.')
    return
  }

  // Hash a default password
  const defaultPassword = 'password123'
  const hashedPassword = await bcrypt.hash(defaultPassword, 10)

  // Create sample member
  const member = await prisma.member.upsert({
    where: { idNumber: '12345678' }, // Using ID number as unique identifier
    update: {
      // Update existing member if found
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+254712345678',
      password: hashedPassword,
      membershipCategoryId: lifeMembership.id,
    },
    create: {
      ippmsId: 'IPPMS001',
      membershipNo: 'PM-001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+254712345678',
      idNumber: '12345678',
      dateOfBirth: new Date('1990-01-15'),
      gender: 'Male',
      religion: 'Christian',
      ethnicity: 'Kikuyu',
      address: '123 Main Street, Nairobi',
      county: 'Nairobi',
      constituency: 'Westlands',
      ward: 'Kitisuru',
      youth: false,
      pwd: false,
      status: 'active',
      password: hashedPassword,
      membershipCategoryId: lifeMembership.id,
    },
  })

  console.log('✅ Sample member created successfully!')
  console.log('\nMember Details:')
  console.log(`  Name: ${member.firstName} ${member.lastName}`)
  console.log(`  ID Number: ${member.idNumber}`)
  console.log(`  Email: ${member.email}`)
  console.log(`  Phone: ${member.phone}`)
  console.log(`  Membership No: ${member.membershipNo}`)
  console.log(`  Membership Category: Life Membership`)
  console.log(`\nLogin Credentials:`)
  console.log(`  ID Number: ${member.idNumber}`)
  console.log(`  Password: ${defaultPassword}`)
  console.log(`\n⚠️  Please change the password after first login!`)
}

main()
  .catch((e) => {
    console.error('Error creating sample member:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

