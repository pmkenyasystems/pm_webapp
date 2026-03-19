import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MIGORI_COUNTY_CODE = 44

const constituencies = [
  { code: 253, name: 'Rongo' },
  { code: 254, name: 'Awendo' },
  { code: 255, name: 'Suna East' },
  { code: 256, name: 'Suna West' },
  { code: 257, name: 'Uriri' },
  { code: 258, name: 'Nyatike' },
  { code: 259, name: 'Kuria West' },
  { code: 260, name: 'Kuria East' },
]

const wards = [
  { code: 1261, name: 'North Kamagambo', constituencyCode: 253, registeredVoters: 10426 },
  { code: 1262, name: 'Central Kamagambo', constituencyCode: 253, registeredVoters: 19077 },
  { code: 1263, name: 'East Kamagambo', constituencyCode: 253, registeredVoters: 16141 },
  { code: 1264, name: 'South Kamagambo', constituencyCode: 253, registeredVoters: 13537 },
  { code: 1265, name: 'North Sakwa', constituencyCode: 254, registeredVoters: 11768 },
  { code: 1266, name: 'South Sakwa', constituencyCode: 254, registeredVoters: 17750 },
  { code: 1267, name: 'West Sakwa', constituencyCode: 254, registeredVoters: 11831 },
  { code: 1268, name: 'Central Sakwa', constituencyCode: 254, registeredVoters: 14623 },
  { code: 1269, name: 'God Jope', constituencyCode: 255, registeredVoters: 10344 },
  { code: 1270, name: 'Suna Central', constituencyCode: 255, registeredVoters: 18244 },
  { code: 1271, name: 'Kakrao', constituencyCode: 255, registeredVoters: 16948 },
  { code: 1272, name: 'Kwa', constituencyCode: 255, registeredVoters: 8929 },
  { code: 1273, name: 'Wiga', constituencyCode: 256, registeredVoters: 13692 },
  { code: 1274, name: 'Wasweta II', constituencyCode: 256, registeredVoters: 12007 },
  { code: 1275, name: 'Ragana - Oruba', constituencyCode: 256, registeredVoters: 20216 },
  { code: 1276, name: 'Wasimbete', constituencyCode: 256, registeredVoters: 10771 },
  { code: 1277, name: 'West Kanyamkago', constituencyCode: 257, registeredVoters: 14886 },
  { code: 1278, name: 'North Kanyamkago', constituencyCode: 257, registeredVoters: 16336 },
  { code: 1279, name: 'Central Kanyamkago', constituencyCode: 257, registeredVoters: 10295 },
  { code: 1280, name: 'South Kanyamkago', constituencyCode: 257, registeredVoters: 16057 },
  { code: 1281, name: 'East Kanyamkago', constituencyCode: 257, registeredVoters: 7489 },
  { code: 1282, name: "Kachien'g", constituencyCode: 258, registeredVoters: 10551 },
  { code: 1283, name: 'Kanyasa', constituencyCode: 258, registeredVoters: 7748 },
  { code: 1284, name: 'North Kadem', constituencyCode: 258, registeredVoters: 15113 },
  { code: 1285, name: 'Macalder/Kanyarwanda', constituencyCode: 258, registeredVoters: 13187 },
  { code: 1286, name: 'Kaler', constituencyCode: 258, registeredVoters: 5727 },
  { code: 1287, name: 'Got Kachola', constituencyCode: 258, registeredVoters: 10923 },
  { code: 1288, name: 'Muhuru', constituencyCode: 258, registeredVoters: 10183 },
  { code: 1289, name: 'Bukira East', constituencyCode: 259, registeredVoters: 8957 },
  { code: 1290, name: 'Bukira Centrl/Ikerege', constituencyCode: 259, registeredVoters: 7865 },
  { code: 1291, name: 'Isibania', constituencyCode: 259, registeredVoters: 9169 },
  { code: 1292, name: 'Makerero', constituencyCode: 259, registeredVoters: 6056 },
  { code: 1293, name: 'Masaba', constituencyCode: 259, registeredVoters: 9214 },
  { code: 1294, name: 'Tagare', constituencyCode: 259, registeredVoters: 9780 },
  { code: 1295, name: 'Nyamosense/Komosoko', constituencyCode: 259, registeredVoters: 11203 },
  { code: 1296, name: 'Gokeharaka/Getambwega', constituencyCode: 260, registeredVoters: 7962 },
  { code: 1297, name: 'Ntimaru West', constituencyCode: 260, registeredVoters: 8628 },
  { code: 1298, name: 'Ntimaru East', constituencyCode: 260, registeredVoters: 5591 },
  { code: 1299, name: 'Nyabasi East', constituencyCode: 260, registeredVoters: 8930 },
  { code: 1300, name: 'Nyabasi West', constituencyCode: 260, registeredVoters: 10865 },
]

async function main() {
  console.log('Seeding Migori County (constituencies and wards)...\n')

  // 1. Upsert Migori County
  await prisma.county.upsert({
    where: { countyCode: MIGORI_COUNTY_CODE },
    update: { countyName: 'Migori' },
    create: {
      countyCode: MIGORI_COUNTY_CODE,
      countyName: 'Migori',
    },
  })
  console.log('✓ Migori County (44)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: MIGORI_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: MIGORI_COUNTY_CODE,
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

  console.log('\n✅ Migori County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Migori:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
