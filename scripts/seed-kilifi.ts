import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const KILIFI_COUNTY_CODE = 3

const constituencies = [
  { code: 11, name: 'Kilifi North' },
  { code: 12, name: 'Kilifi South' },
  { code: 13, name: 'Kaloleni' },
  { code: 14, name: 'Rabai' },
  { code: 15, name: 'Ganze' },
  { code: 16, name: 'Malindi' },
  { code: 17, name: 'Magarini' },
]

const wards = [
  { code: 51, name: 'Tezo', constituencyCode: 11, registeredVoters: 14830 },
  { code: 52, name: 'Sokoni', constituencyCode: 11, registeredVoters: 23955 },
  { code: 53, name: 'Kibarani', constituencyCode: 11, registeredVoters: 15655 },
  { code: 54, name: 'Dabaso', constituencyCode: 11, registeredVoters: 13717 },
  { code: 55, name: 'Matsangoni', constituencyCode: 11, registeredVoters: 15168 },
  { code: 56, name: 'Watamu', constituencyCode: 11, registeredVoters: 15341 },
  { code: 57, name: 'Mnarani', constituencyCode: 11, registeredVoters: 18076 },
  { code: 58, name: 'Junju', constituencyCode: 12, registeredVoters: 15747 },
  { code: 59, name: 'Mwarakaya', constituencyCode: 12, registeredVoters: 12714 },
  { code: 60, name: 'Shimo La Tewa', constituencyCode: 12, registeredVoters: 32052 },
  { code: 61, name: 'Chasimba', constituencyCode: 12, registeredVoters: 14090 },
  { code: 62, name: 'Mtepeni', constituencyCode: 12, registeredVoters: 23093 },
  { code: 63, name: 'Mariakani', constituencyCode: 13, registeredVoters: 21332 },
  { code: 64, name: 'Kayafungo', constituencyCode: 13, registeredVoters: 14897 },
  { code: 65, name: 'Kaloleni', constituencyCode: 13, registeredVoters: null },
  { code: 66, name: 'Mwanamwinga', constituencyCode: 13, registeredVoters: null },
  { code: 67, name: 'Mwawesa', constituencyCode: 14, registeredVoters: null },
  { code: 68, name: 'Ruruma', constituencyCode: 14, registeredVoters: null },
  { code: 69, name: 'Kambe/Ribe', constituencyCode: 14, registeredVoters: null },
  { code: 70, name: 'Rabai/Kisurutini', constituencyCode: 14, registeredVoters: null },
  { code: 71, name: 'Ganze', constituencyCode: 15, registeredVoters: 8020 },
  { code: 72, name: 'Bamba', constituencyCode: 15, registeredVoters: 10751 },
  { code: 73, name: 'Jaribuni', constituencyCode: 15, registeredVoters: 6822 },
  { code: 74, name: 'Sokoke', constituencyCode: 15, registeredVoters: 11970 },
  { code: 75, name: 'Jilore', constituencyCode: 16, registeredVoters: null },
  { code: 76, name: 'Kakuyuni', constituencyCode: 16, registeredVoters: null },
  { code: 77, name: 'Ganda', constituencyCode: 16, registeredVoters: null },
  { code: 78, name: 'Malindi Town', constituencyCode: 16, registeredVoters: null },
  { code: 79, name: 'Shella', constituencyCode: 16, registeredVoters: null },
  { code: 80, name: 'Maarafa', constituencyCode: 17, registeredVoters: null },
  { code: 81, name: 'Magarini', constituencyCode: 17, registeredVoters: null },
  { code: 82, name: 'Gongoni', constituencyCode: 17, registeredVoters: null },
  { code: 83, name: 'Adu', constituencyCode: 17, registeredVoters: null },
  { code: 84, name: 'Garshi', constituencyCode: 17, registeredVoters: null },
  { code: 85, name: 'Sabaki', constituencyCode: 17, registeredVoters: null },
]

async function main() {
  console.log('Seeding Kilifi County (constituencies and wards)...\n')

  // 1. Upsert Kilifi County
  await prisma.county.upsert({
    where: { countyCode: KILIFI_COUNTY_CODE },
    update: { countyName: 'Kilifi' },
    create: {
      countyCode: KILIFI_COUNTY_CODE,
      countyName: 'Kilifi',
    },
  })
  console.log('✓ Kilifi County (3)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: KILIFI_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: KILIFI_COUNTY_CODE,
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

  console.log('\n✅ Kilifi County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Kilifi:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
