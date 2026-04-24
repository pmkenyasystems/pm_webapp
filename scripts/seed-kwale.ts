import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const KWALE_COUNTY_CODE = 2

const constituencies = [
  { code: 7, name: 'Msambweni' },
  { code: 8, name: 'Lunga Lunga' },
  { code: 9, name: 'Matuga' },
  { code: 10, name: 'Kinango' },
]

const wards = [
  { code: 31, name: 'Gombato Bongwe', constituencyCode: 7, registeredVoters: 20551 },
  { code: 32, name: 'Ukunda', constituencyCode: 7, registeredVoters: 24331 },
  { code: 33, name: 'Kinondo', constituencyCode: 7, registeredVoters: 13463 },
  { code: 34, name: 'Ramisi', constituencyCode: 7, registeredVoters: null },
  { code: 35, name: 'Pongwe/Kikoneni', constituencyCode: 8, registeredVoters: null },
  { code: 36, name: 'Dzombo', constituencyCode: 8, registeredVoters: null },
  { code: 37, name: 'Mwereni', constituencyCode: 8, registeredVoters: null },
  { code: 38, name: 'Vanga', constituencyCode: 8, registeredVoters: null },
  { code: 39, name: 'Tsimba Golini', constituencyCode: 9, registeredVoters: null },
  { code: 40, name: 'Waa', constituencyCode: 9, registeredVoters: null },
  { code: 41, name: 'Tiwi', constituencyCode: 9, registeredVoters: null },
  { code: 42, name: 'Kubo South', constituencyCode: 9, registeredVoters: null },
  { code: 43, name: 'Mkongani', constituencyCode: 9, registeredVoters: null },
  { code: 44, name: 'Ndavaya', constituencyCode: 10, registeredVoters: null },
  { code: 45, name: 'Puma', constituencyCode: 10, registeredVoters: null },
  { code: 46, name: 'Kinango', constituencyCode: 10, registeredVoters: null },
  { code: 47, name: 'Mackinnon Road', constituencyCode: 10, registeredVoters: null },
  { code: 48, name: 'Chengoni/Samburu', constituencyCode: 10, registeredVoters: null },
  { code: 49, name: 'Mwavumbo', constituencyCode: 10, registeredVoters: null },
  { code: 50, name: 'Kasemeni', constituencyCode: 10, registeredVoters: null },
]

async function main() {
  console.log('Seeding Kwale County (constituencies and wards)...\n')

  // 1. Upsert Kwale County
  await prisma.county.upsert({
    where: { countyCode: KWALE_COUNTY_CODE },
    update: { countyName: 'Kwale' },
    create: {
      countyCode: KWALE_COUNTY_CODE,
      countyName: 'Kwale',
    },
  })
  console.log('✓ Kwale County (2)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: KWALE_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: KWALE_COUNTY_CODE,
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

  console.log('\n✅ Kwale County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Kwale:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
