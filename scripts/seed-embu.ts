import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const EMBU_COUNTY_CODE = 14

const constituencies = [
  { code: 63, name: 'Manyatta' },
  { code: 64, name: 'Runyenjes' },
  { code: 65, name: 'Mbeere South' },
  { code: 66, name: 'Mbeere North' },
]

const wards = [
  { code: 311, name: 'Ruguru/Ngandori', constituencyCode: 63, registeredVoters: 18449 },
  { code: 312, name: 'Kithimu', constituencyCode: 63, registeredVoters: 11824 },
  { code: 313, name: 'Nginda', constituencyCode: 63, registeredVoters: 18342 },
  { code: 314, name: 'Mbeti North', constituencyCode: 63, registeredVoters: 17844 },
  { code: 315, name: 'Kirimari', constituencyCode: 63, registeredVoters: 29617 },
  { code: 316, name: 'Gaturi South', constituencyCode: 63, registeredVoters: 10512 },
  { code: 317, name: 'Gaturi North', constituencyCode: 64, registeredVoters: 14872 },
  { code: 318, name: 'Kagaari South', constituencyCode: 64, registeredVoters: 13564 },
  { code: 319, name: 'Central Ward', constituencyCode: 64, registeredVoters: 17035 },
  { code: 320, name: 'Kagaari North', constituencyCode: 64, registeredVoters: 17286 },
  { code: 321, name: 'Kyeni North', constituencyCode: 64, registeredVoters: 15314 },
  { code: 322, name: 'Kyeni South', constituencyCode: 64, registeredVoters: 17255 },
  { code: 323, name: 'Mwea', constituencyCode: 65, registeredVoters: 17232 },
  { code: 324, name: 'Makima', constituencyCode: 65, registeredVoters: 11753 },
  { code: 325, name: 'Mbeti South', constituencyCode: 65, registeredVoters: 19083 },
  { code: 326, name: 'Mavuria', constituencyCode: 65, registeredVoters: 20627 },
  { code: 327, name: 'Kiambere', constituencyCode: 65, registeredVoters: 8569 },
  { code: 328, name: 'Nthawa', constituencyCode: 66, registeredVoters: 18882 },
  { code: 329, name: 'Muminji', constituencyCode: 66, registeredVoters: 9849 },
  { code: 330, name: 'Evurore', constituencyCode: 66, registeredVoters: 26393 },
]

async function main() {
  console.log('Seeding Embu County (constituencies and wards)...\n')

  // 1. Upsert Embu County
  await prisma.county.upsert({
    where: { countyCode: EMBU_COUNTY_CODE },
    update: { countyName: 'Embu' },
    create: {
      countyCode: EMBU_COUNTY_CODE,
      countyName: 'Embu',
    },
  })
  console.log('✓ Embu County (14)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: EMBU_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: EMBU_COUNTY_CODE,
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

  console.log('\n✅ Embu County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Embu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
