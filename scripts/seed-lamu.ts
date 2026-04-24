import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const LAMU_COUNTY_CODE = 5

const constituencies = [
  { code: 21, name: 'Lamu East' },
  { code: 22, name: 'Lamu West' },
]

const wards = [
  { code: 101, name: 'Faza', constituencyCode: 21, registeredVoters: 16515 },
  { code: 102, name: 'Kiunga', constituencyCode: 21, registeredVoters: 4583 },
  { code: 103, name: 'Basuba', constituencyCode: 21, registeredVoters: 949 },
  { code: 104, name: 'Shella', constituencyCode: 22, registeredVoters: 3632 },
  { code: 105, name: 'Mkomani', constituencyCode: 22, registeredVoters: 12571 },
  { code: 106, name: 'Hindi', constituencyCode: 22, registeredVoters: 8533 },
  { code: 107, name: 'Mkunumbi', constituencyCode: 22, registeredVoters: 8866 },
  { code: 108, name: 'Hongwe', constituencyCode: 22, registeredVoters: 5071 },
  { code: 109, name: 'Witu', constituencyCode: 22, registeredVoters: 9697 },
  { code: 110, name: 'Bahari', constituencyCode: 22, registeredVoters: 11036 },
]

async function main() {
  console.log('Seeding Lamu County (constituencies and wards)...\n')

  // 1. Upsert Lamu County
  await prisma.county.upsert({
    where: { countyCode: LAMU_COUNTY_CODE },
    update: { countyName: 'Lamu' },
    create: {
      countyCode: LAMU_COUNTY_CODE,
      countyName: 'Lamu',
    },
  })
  console.log('✓ Lamu County (5)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: LAMU_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: LAMU_COUNTY_CODE,
      },
    })
    console.log(`  ✓ ${c.name} (${c.code})`)
  }

  // 3. Upsert wards
  for (const w of wards) {
    await prisma.ward.upsert({
      where: { wardCode: w.code },
      update: {
        wardName: w.name,
        constituencyCode: w.constituencyCode,
        registeredVoters: w.registeredVoters,
      },
      create: {
        wardCode: w.code,
        wardName: w.name,
        constituencyCode: w.constituencyCode,
        registeredVoters: w.registeredVoters,
      },
    })
  }
  console.log(`\n✓ ${wards.length} wards seeded.`)

  console.log('\n✅ Lamu County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Lamu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
