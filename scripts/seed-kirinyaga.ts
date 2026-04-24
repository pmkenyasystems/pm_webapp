import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const KIRINYAGA_COUNTY_CODE = 20

const constituencies = [
  { code: 100, name: 'Mwea' },
  { code: 101, name: 'Gichugu' },
  { code: 102, name: 'Ndia' },
  { code: 103, name: 'Kirinyaga Central' },
]

const wards = [
  { code: 496, name: 'Mutithi', constituencyCode: 100, registeredVoters: 19226 },
  { code: 497, name: 'Kangai', constituencyCode: 100, registeredVoters: 12568 },
  { code: 498, name: 'Thiba', constituencyCode: 100, registeredVoters: 15157 },
  { code: 499, name: 'Wamumu', constituencyCode: 100, registeredVoters: 12249 },
  { code: 500, name: 'Nyangati', constituencyCode: 100, registeredVoters: 17095 },
  { code: 501, name: 'Murinduko', constituencyCode: 100, registeredVoters: 18935 },
  { code: 502, name: 'Gathigiriri', constituencyCode: 100, registeredVoters: 11993 },
  { code: 503, name: 'Tebere', constituencyCode: 100, registeredVoters: 24491 },
  { code: 504, name: 'Kabare', constituencyCode: 101, registeredVoters: 27559 },
  { code: 505, name: 'Baragwi', constituencyCode: 101, registeredVoters: 16311 },
  { code: 506, name: 'Njukiini', constituencyCode: 101, registeredVoters: 16338 },
  { code: 507, name: 'Ngariama', constituencyCode: 101, registeredVoters: 13976 },
  { code: 508, name: 'Karumandi', constituencyCode: 101, registeredVoters: 18311 },
  { code: 509, name: 'Mukure', constituencyCode: 102, registeredVoters: 22087 },
  { code: 510, name: 'Kiine', constituencyCode: 102, registeredVoters: 27843 },
  { code: 511, name: 'Kariti', constituencyCode: 102, registeredVoters: 19813 },
  { code: 512, name: 'Mutira', constituencyCode: 103, registeredVoters: 18169 },
  { code: 513, name: 'Kanyeki-ine', constituencyCode: 103, registeredVoters: null },
  { code: 514, name: 'Kerugoya', constituencyCode: 103, registeredVoters: null },
  { code: 515, name: 'Inoi', constituencyCode: 103, registeredVoters: 17272 },
]

async function main() {
  console.log('Seeding Kirinyaga County (constituencies and wards)...\n')

  // 1. Upsert Kirinyaga County
  await prisma.county.upsert({
    where: { countyCode: KIRINYAGA_COUNTY_CODE },
    update: { countyName: 'Kirinyaga' },
    create: {
      countyCode: KIRINYAGA_COUNTY_CODE,
      countyName: 'Kirinyaga',
    },
  })
  console.log('✓ Kirinyaga County (20)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: KIRINYAGA_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: KIRINYAGA_COUNTY_CODE,
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

  console.log('\n✅ Kirinyaga County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Kirinyaga:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
