/**
 * Create/update member: Neville Muchalwa Masheti (ID 28499602)
 * Usage: npx tsx scripts/create-masheti-member.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const KAKAMEGA_COUNTY = '37'
const IKOLOMANI_CONSTITUENCY = '210'
const IDAKHO_SOUTH_WARD = '1047'

async function main() {
  // Date 05/04/1991 as DD/MM/YYYY => 5 April 1991
  const dateOfBirth = new Date(1991, 3, 5) // month is 0-indexed

  const defaultPassword = 'ChangeMe123!'
  const hashedPassword = await bcrypt.hash(defaultPassword, 10)

  const member = await prisma.member.upsert({
    where: { idNumber: '28499602' },
    update: {
      surname: 'Masheti',
      otherNames: 'Neville Muchalwa',
      dateOfBirth,
      youth: true,
      pwd: false,
      religion: 'Christianity',
      email: 'mashetin.91@gmail.com',
      phone: '0713976532',
      county: KAKAMEGA_COUNTY,
      constituency: IKOLOMANI_CONSTITUENCY,
      ward: IDAKHO_SOUTH_WARD,
    },
    create: {
      idNumber: '28499602',
      surname: 'Masheti',
      otherNames: 'Neville Muchalwa',
      dateOfBirth,
      youth: true,
      pwd: false,
      religion: 'Christianity',
      email: 'mashetin.91@gmail.com',
      phone: '0713976532',
      county: KAKAMEGA_COUNTY,
      constituency: IKOLOMANI_CONSTITUENCY,
      ward: IDAKHO_SOUTH_WARD,
      status: 'active',
      password: hashedPassword,
    },
  })

  console.log('Member created/updated successfully.')
  console.log('  ID Number:', member.idNumber)
  console.log('  Name:', member.surname, member.otherNames)
  console.log('  Email:', member.email)
  console.log('  Phone:', member.phone)
  console.log('  County:', member.county, '| Constituency:', member.constituency, '| Ward:', member.ward)
  console.log('  DOB:', member.dateOfBirth?.toISOString().slice(0, 10))
  console.log('  Youth:', member.youth, '| PWD:', member.pwd, '| Religion:', member.religion)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
