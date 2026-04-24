import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MANDERA_COUNTY_CODE = 9

const constituencies = [
  { code: 39, name: 'Mandera West' },
  { code: 40, name: 'Banissa' },
  { code: 41, name: 'Mandera North' },
  { code: 42, name: 'Mandera South' },
  { code: 43, name: 'Mandera East' },
  { code: 44, name: 'Lafey' },
]

const wards = [
  { code: 191, name: 'Takaba South', constituencyCode: 39, registeredVoters: 6742 },
  { code: 192, name: 'Takaba', constituencyCode: 39, registeredVoters: 5683 },
  { code: 193, name: 'Lagsure', constituencyCode: 39, registeredVoters: 6746 },
  { code: 194, name: 'Dandu', constituencyCode: 39, registeredVoters: 9544 },
  { code: 195, name: 'Gither', constituencyCode: 39, registeredVoters: 8922 },
  { code: 196, name: 'Banissa', constituencyCode: 40, registeredVoters: 9898 },
  { code: 197, name: 'Derkhale', constituencyCode: 40, registeredVoters: 7068 },
  { code: 198, name: 'Guba', constituencyCode: 40, registeredVoters: 1539 },
  { code: 199, name: 'Malkamari', constituencyCode: 40, registeredVoters: 6440 },
  { code: 200, name: 'Kiliwehiri', constituencyCode: 40, registeredVoters: 7758 },
  { code: 201, name: 'Ashabito', constituencyCode: 41, registeredVoters: 7806 },
  { code: 202, name: 'Guticha', constituencyCode: 41, registeredVoters: 10038 },
  { code: 203, name: 'Morothile', constituencyCode: 41, registeredVoters: 2777 },
  { code: 204, name: 'Rhamu', constituencyCode: 41, registeredVoters: 15408 },
  { code: 205, name: 'Rhamu-Dimtu', constituencyCode: 41, registeredVoters: 9187 },
  { code: 206, name: 'Wargadud', constituencyCode: 42, registeredVoters: 7341 },
  { code: 207, name: 'Kutulo', constituencyCode: 42, registeredVoters: 7123 },
  { code: 208, name: 'Elwak South', constituencyCode: 42, registeredVoters: 6095 },
  { code: 209, name: 'Elwak North', constituencyCode: 42, registeredVoters: 6279 },
  { code: 210, name: 'Shimbir Fatuma', constituencyCode: 42, registeredVoters: 7853 },
  { code: 211, name: 'Arabia', constituencyCode: 43, registeredVoters: 4187 },
  { code: 212, name: 'Township', constituencyCode: 43, registeredVoters: 14790 },
  { code: 213, name: 'Neboi', constituencyCode: 43, registeredVoters: 11840 },
  { code: 214, name: 'Khalalio', constituencyCode: 43, registeredVoters: 11106 },
  { code: 215, name: 'Libehia', constituencyCode: 43, registeredVoters: 6296 },
  { code: 216, name: 'Sala', constituencyCode: 44, registeredVoters: 2412 },
  { code: 217, name: 'Fino', constituencyCode: 44, registeredVoters: 2786 },
  { code: 218, name: 'Lafey', constituencyCode: 44, registeredVoters: 4932 },
  { code: 219, name: 'Waranqara', constituencyCode: 44, registeredVoters: 3956 },
  { code: 220, name: 'Alungo Ginsa', constituencyCode: 44, registeredVoters: null },
]

async function main() {
  console.log('Seeding Mandera County (constituencies and wards)...\n')

  // 1. Upsert Mandera County
  await prisma.county.upsert({
    where: { countyCode: MANDERA_COUNTY_CODE },
    update: { countyName: 'Mandera' },
    create: {
      countyCode: MANDERA_COUNTY_CODE,
      countyName: 'Mandera',
    },
  })
  console.log('✓ Mandera County (9)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: MANDERA_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: MANDERA_COUNTY_CODE,
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

  console.log('\n✅ Mandera County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Mandera:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
