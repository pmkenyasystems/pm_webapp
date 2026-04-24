import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TANA_RIVER_COUNTY_CODE = 4

const constituencies = [
  { code: 18, name: 'Garsen' },
  { code: 19, name: 'Galole' },
  { code: 20, name: 'Bura' },
]

const wards = [
  { code: 86, name: 'Kipini East', constituencyCode: 18, registeredVoters: 7898 },
  { code: 87, name: 'Garsen South', constituencyCode: 18, registeredVoters: 9990 },
  { code: 88, name: 'Kipini West', constituencyCode: 18, registeredVoters: 9180 },
  { code: 89, name: 'Garsen Central', constituencyCode: 18, registeredVoters: 8256 },
  { code: 90, name: 'Garsen West', constituencyCode: 18, registeredVoters: 10999 },
  { code: 91, name: 'Garsen North', constituencyCode: 18, registeredVoters: 9130 },
  { code: 92, name: 'Kinakomba', constituencyCode: 19, registeredVoters: 8318 },
  { code: 93, name: 'Mikinduni', constituencyCode: 19, registeredVoters: 7570 },
  { code: 94, name: 'Chewani', constituencyCode: 19, registeredVoters: 14333 },
  { code: 95, name: 'Wayu', constituencyCode: 19, registeredVoters: 9744 },
  { code: 96, name: 'Chewele', constituencyCode: 20, registeredVoters: 8109 },
  { code: 97, name: 'Hirimani', constituencyCode: 20, registeredVoters: 10750 },
  { code: 98, name: 'Bangale', constituencyCode: 20, registeredVoters: 10129 },
  { code: 99, name: 'Sala', constituencyCode: 20, registeredVoters: 8806 },
  { code: 100, name: 'Madogo', constituencyCode: 20, registeredVoters: 7884 },
]

async function main() {
  console.log('Seeding Tana River County (constituencies and wards)...\n')

  // 1. Upsert Tana River County
  await prisma.county.upsert({
    where: { countyCode: TANA_RIVER_COUNTY_CODE },
    update: { countyName: 'Tana River' },
    create: {
      countyCode: TANA_RIVER_COUNTY_CODE,
      countyName: 'Tana River',
    },
  })
  console.log('✓ Tana River County (4)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: TANA_RIVER_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: TANA_RIVER_COUNTY_CODE,
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

  console.log('\n✅ Tana River County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Tana River:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
