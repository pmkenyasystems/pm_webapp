import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const LAIKIPIA_COUNTY_CODE = 31

const constituencies = [
  { code: 163, name: 'Laikipia West' },
  { code: 164, name: 'Laikipia East' },
  { code: 165, name: 'Laikipia North' },
]

const wards = [
  { code: 811, name: 'Ol-Moran', constituencyCode: 163, registeredVoters: 10012 },
  { code: 812, name: 'Rumuruti Township', constituencyCode: 163, registeredVoters: 13241 },
  { code: 813, name: 'Githiga', constituencyCode: 163, registeredVoters: 16143 },
  { code: 814, name: 'Marmanet', constituencyCode: 163, registeredVoters: 26627 },
  { code: 815, name: 'Igwamiti', constituencyCode: 163, registeredVoters: 43194 },
  { code: 816, name: 'Salama', constituencyCode: 163, registeredVoters: 9648 },
  { code: 817, name: 'Ngobit', constituencyCode: 164, registeredVoters: null },
  { code: 818, name: 'Tigithi', constituencyCode: 164, registeredVoters: null },
  { code: 819, name: 'Thingithu', constituencyCode: 164, registeredVoters: null },
  { code: 820, name: 'Nanyuki', constituencyCode: 164, registeredVoters: null },
  { code: 821, name: 'Umande', constituencyCode: 164, registeredVoters: null },
  { code: 822, name: 'Sosian', constituencyCode: 165, registeredVoters: null },
  { code: 823, name: 'Segera', constituencyCode: 165, registeredVoters: null },
  { code: 824, name: 'Mugogodo West', constituencyCode: 165, registeredVoters: null },
  { code: 825, name: 'Mugogodo East', constituencyCode: 165, registeredVoters: null },
]

async function main() {
  console.log('Seeding Laikipia County (constituencies and wards)...\n')

  // 1. Upsert Laikipia County
  await prisma.county.upsert({
    where: { countyCode: LAIKIPIA_COUNTY_CODE },
    update: { countyName: 'Laikipia' },
    create: {
      countyCode: LAIKIPIA_COUNTY_CODE,
      countyName: 'Laikipia',
    },
  })
  console.log('✓ Laikipia County (31)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: LAIKIPIA_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: LAIKIPIA_COUNTY_CODE,
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

  console.log('\n✅ Laikipia County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Laikipia:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
