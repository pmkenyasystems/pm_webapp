import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MAKUENI_COUNTY_CODE = 17

const constituencies = [
  { code: 83, name: 'Mbooni' },
  { code: 84, name: 'Kilome' },
  { code: 85, name: 'Kaiti' },
  { code: 86, name: 'Makueni' },
  { code: 87, name: 'Kibwezi West' },
  { code: 88, name: 'Kibwezi East' },
]

const wards = [
  { code: 411, name: 'Tulimani', constituencyCode: 83, registeredVoters: 18803 },
  { code: 412, name: 'Mbooni', constituencyCode: 83, registeredVoters: 16441 },
  { code: 413, name: 'Kithungo/Kitundu', constituencyCode: 83, registeredVoters: 13472 },
  { code: 414, name: 'Kiteta/Kisau', constituencyCode: 83, registeredVoters: 20020 },
  { code: 415, name: 'Waia-Kako', constituencyCode: 83, registeredVoters: 13127 },
  { code: 416, name: 'Kalawa', constituencyCode: 83, registeredVoters: 14166 },
  { code: 417, name: 'Kasikeu', constituencyCode: 84, registeredVoters: 23435 },
  { code: 418, name: 'Mukaa', constituencyCode: 84, registeredVoters: 14484 },
  { code: 419, name: 'Kiima Kiu/Kalanzoni', constituencyCode: 84, registeredVoters: 21259 },
  { code: 420, name: 'Ukia', constituencyCode: 85, registeredVoters: 22344 },
  { code: 421, name: 'Kee', constituencyCode: 85, registeredVoters: 12212 },
  { code: 422, name: 'Kilungu', constituencyCode: 85, registeredVoters: 16858 },
  { code: 423, name: 'Ilima', constituencyCode: 85, registeredVoters: 13774 },
  { code: 424, name: 'Wote', constituencyCode: 86, registeredVoters: 19472 },
  { code: 425, name: 'Muvau/Kikuumini', constituencyCode: 86, registeredVoters: 13583 },
  { code: 426, name: 'Mavindini', constituencyCode: 86, registeredVoters: 11154 },
  { code: 427, name: 'Kitise/Kithuki', constituencyCode: 86, registeredVoters: 11691 },
  { code: 428, name: 'Kathonzweni', constituencyCode: 86, registeredVoters: 14661 },
  { code: 429, name: 'Nzaui/Kilili/Kalamba', constituencyCode: 86, registeredVoters: 18381 },
  { code: 430, name: 'Mbitini', constituencyCode: 86, registeredVoters: 13770 },
  { code: 431, name: 'Makindu', constituencyCode: 87, registeredVoters: 22953 },
  { code: 432, name: 'Nguumo', constituencyCode: 87, registeredVoters: 14185 },
  { code: 433, name: 'Kikumbulyu North', constituencyCode: 87, registeredVoters: 9889 },
  { code: 434, name: 'Kikumbulyu South', constituencyCode: 87, registeredVoters: 14056 },
  { code: 435, name: 'Nguu/Masumba', constituencyCode: 87, registeredVoters: 13747 },
  { code: 436, name: 'Emali/Mulala', constituencyCode: 87, registeredVoters: 16724 },
  { code: 437, name: 'Masongaleni', constituencyCode: 88, registeredVoters: 14271 },
  { code: 438, name: 'Mtito Andei', constituencyCode: 88, registeredVoters: 17622 },
  { code: 439, name: 'Thange', constituencyCode: 88, registeredVoters: 17020 },
  { code: 440, name: 'Ivingoni/Nzambani', constituencyCode: 88, registeredVoters: 15827 },
]

async function main() {
  console.log('Seeding Makueni County (constituencies and wards)...\n')

  // 1. Upsert Makueni County
  await prisma.county.upsert({
    where: { countyCode: MAKUENI_COUNTY_CODE },
    update: { countyName: 'Makueni' },
    create: {
      countyCode: MAKUENI_COUNTY_CODE,
      countyName: 'Makueni',
    },
  })
  console.log('✓ Makueni County (17)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: MAKUENI_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: MAKUENI_COUNTY_CODE,
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

  console.log('\n✅ Makueni County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Makueni:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
