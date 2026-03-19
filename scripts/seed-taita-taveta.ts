import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TAITA_TAVETA_COUNTY_CODE = 6

const constituencies = [
  { code: 23, name: 'Taveta' },
  { code: 24, name: 'Wundanyi' },
  { code: 25, name: 'Mwatate' },
  { code: 26, name: 'Voi' },
]

const wards = [
  { code: 111, name: 'Chala', constituencyCode: 23, registeredVoters: 9682 },
  { code: 112, name: 'Mahoo', constituencyCode: 23, registeredVoters: 6817 },
  { code: 113, name: 'Bomani', constituencyCode: 23, registeredVoters: 10441 },
  { code: 114, name: 'Mboghoni', constituencyCode: 23, registeredVoters: 8103 },
  { code: 115, name: 'Mata', constituencyCode: 23, registeredVoters: 5988 },
  { code: 116, name: 'Wundanyi/Mbale', constituencyCode: 24, registeredVoters: 12988 },
  { code: 117, name: 'Werugha', constituencyCode: 24, registeredVoters: 6085 },
  { code: 118, name: 'Wumingu/Kishushe', constituencyCode: 24, registeredVoters: 8007 },
  { code: 119, name: 'Mwanda/Mgange', constituencyCode: 24, registeredVoters: 7928 },
  { code: 120, name: "Rong'e", constituencyCode: 25, registeredVoters: 7080 },
  { code: 121, name: 'Mwatate', constituencyCode: 25, registeredVoters: 10082 },
  { code: 122, name: 'Bura', constituencyCode: 25, registeredVoters: 9937 },
  { code: 123, name: 'Chawia', constituencyCode: 25, registeredVoters: 9208 },
  { code: 124, name: 'Wusi/Kishamba', constituencyCode: 25, registeredVoters: 8104 },
  { code: 125, name: 'Mbololo', constituencyCode: 26, registeredVoters: 15880 },
  { code: 126, name: 'Sagalla', constituencyCode: 26, registeredVoters: 7067 },
  { code: 127, name: 'Kaloleni', constituencyCode: 26, registeredVoters: 17547 },
  { code: 128, name: 'Marungu', constituencyCode: 26, registeredVoters: 6681 },
  { code: 129, name: 'Kasigau', constituencyCode: 26, registeredVoters: 7829 },
  { code: 130, name: 'Ngolia', constituencyCode: 26, registeredVoters: 6373 },
]

async function main() {
  console.log('Seeding Taita/Taveta County (constituencies and wards)...\n')

  // 1. Upsert Taita/Taveta County
  await prisma.county.upsert({
    where: { countyCode: TAITA_TAVETA_COUNTY_CODE },
    update: { countyName: 'Taita/Taveta' },
    create: {
      countyCode: TAITA_TAVETA_COUNTY_CODE,
      countyName: 'Taita/Taveta',
    },
  })
  console.log('✓ Taita/Taveta County (6)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: TAITA_TAVETA_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: TAITA_TAVETA_COUNTY_CODE,
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

  console.log('\n✅ Taita/Taveta County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Taita/Taveta:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
