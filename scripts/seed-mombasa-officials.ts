/**
 * Seed Mombasa County officials: Chairperson, Treasurer, Secretary.
 * Run: npx tsx scripts/seed-mombasa-officials.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MOMBASA_COUNTY_CODE = 1

const officials = [
  { role: 'Chairperson', name: 'Joseph Peter Wafubwa' },
  { role: 'Treasurer', name: 'Lucy Kitawa Mwashindo' },
  { role: 'Secretary', name: 'Boniface Kithimba Kioko' },
]

async function main() {
  console.log('Seeding Mombasa County officials...\n')

  for (const o of officials) {
    await prisma.countyOfficial.upsert({
      where: {
        countyCode_role: { countyCode: MOMBASA_COUNTY_CODE, role: o.role },
      },
      update: { name: o.name },
      create: {
        countyCode: MOMBASA_COUNTY_CODE,
        role: o.role,
        name: o.name,
      },
    })
    console.log(`  ${o.role}: ${o.name}`)
  }

  console.log('\n✅ Mombasa County officials seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
