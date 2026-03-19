import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const KISII_COUNTY_CODE = 45

const constituencies = [
  { code: 261, name: 'Bonchari' },
  { code: 262, name: 'South Mugirango' },
  { code: 263, name: 'Bomachoge Borabu' },
  { code: 264, name: 'Bobasi' },
  { code: 265, name: 'Bomachoge Chache' },
  { code: 266, name: 'Nyaribari Masaba' },
  { code: 267, name: 'Nyaribari Chache' },
  { code: 268, name: 'Kitutu Chache North' },
  { code: 269, name: 'Kitutu Chache South' },
]

const wards = [
  { code: 1301, name: 'Bomariba', constituencyCode: 261, registeredVoters: 11167 },
  { code: 1302, name: 'Bogiakumu', constituencyCode: 261, registeredVoters: 17744 },
  { code: 1303, name: 'Bomorenda', constituencyCode: 261, registeredVoters: 17363 },
  { code: 1304, name: 'Riana', constituencyCode: 261, registeredVoters: 18356 },
  { code: 1305, name: 'Tabaka', constituencyCode: 262, registeredVoters: 16395 },
  { code: 1306, name: "Boikang'a", constituencyCode: 262, registeredVoters: 10127 },
  { code: 1307, name: 'Bogetenga', constituencyCode: 262, registeredVoters: 14408 },
  { code: 1308, name: 'Borabu / Chitago', constituencyCode: 262, registeredVoters: 17760 },
  { code: 1309, name: 'Moticho', constituencyCode: 262, registeredVoters: 12699 },
  { code: 1310, name: 'Getenga', constituencyCode: 262, registeredVoters: 7615 },
  { code: 1311, name: 'Bombaba Borabu', constituencyCode: 263, registeredVoters: 12474 },
  { code: 1312, name: 'Boochi Borabu', constituencyCode: 263, registeredVoters: 8650 },
  { code: 1313, name: 'Bokimonge', constituencyCode: 263, registeredVoters: 18795 },
  { code: 1314, name: 'Magenche', constituencyCode: 263, registeredVoters: 17072 },
  { code: 1315, name: 'Masige West', constituencyCode: 264, registeredVoters: 12614 },
  { code: 1316, name: 'Masige East', constituencyCode: 264, registeredVoters: 11667 },
  { code: 1317, name: 'Basi Central', constituencyCode: 264, registeredVoters: 13122 },
  { code: 1318, name: 'Nyacheki', constituencyCode: 264, registeredVoters: 16988 },
  { code: 1319, name: 'Basi Bogetaorio', constituencyCode: 264, registeredVoters: 16319 },
  { code: 1320, name: 'Bobasi Chache', constituencyCode: 264, registeredVoters: 12997 },
  { code: 1321, name: 'Sameta/Mokwerero', constituencyCode: 264, registeredVoters: 11884 },
  { code: 1322, name: 'Bobasi Boitangare', constituencyCode: 264, registeredVoters: 10469 },
  { code: 1323, name: 'Majoge Basi', constituencyCode: 265, registeredVoters: 13016 },
  { code: 1324, name: 'Boochi/Tendere', constituencyCode: 265, registeredVoters: 17987 },
  { code: 1325, name: 'Bosoti/Sengera', constituencyCode: 265, registeredVoters: 18298 },
  { code: 1326, name: 'Ichuni', constituencyCode: 266, registeredVoters: 15662 },
  { code: 1327, name: 'Nyamasibi', constituencyCode: 266, registeredVoters: 11782 },
  { code: 1328, name: 'Masimba', constituencyCode: 266, registeredVoters: 14188 },
  { code: 1329, name: 'Gesusu', constituencyCode: 266, registeredVoters: 14569 },
  { code: 1330, name: 'Kiamokama', constituencyCode: 266, registeredVoters: 12392 },
  { code: 1331, name: 'Bobaracho', constituencyCode: 267, registeredVoters: 19235 },
  { code: 1332, name: 'Kisii Central', constituencyCode: 267, registeredVoters: 24550 },
  { code: 1333, name: 'Keumbu', constituencyCode: 267, registeredVoters: 10022 },
  { code: 1334, name: 'Kiogoro', constituencyCode: 267, registeredVoters: 10510 },
  { code: 1335, name: 'Birongo', constituencyCode: 267, registeredVoters: 11320 },
  { code: 1336, name: 'Ibeno', constituencyCode: 267, registeredVoters: 12916 },
  { code: 1337, name: 'Monyerero', constituencyCode: 268, registeredVoters: 15350 },
  { code: 1338, name: 'Sensi', constituencyCode: 268, registeredVoters: 15165 },
  { code: 1339, name: 'Marani', constituencyCode: 268, registeredVoters: 15466 },
  { code: 1340, name: 'Kegogi', constituencyCode: 268, registeredVoters: 10989 },
  { code: 1341, name: 'Bogusero', constituencyCode: 269, registeredVoters: 12271 },
  { code: 1342, name: 'Bogeka', constituencyCode: 269, registeredVoters: 7774 },
  { code: 1343, name: 'Nyakoe', constituencyCode: 269, registeredVoters: 12178 },
  { code: 1344, name: 'Kitutu Central', constituencyCode: 269, registeredVoters: 24345 },
  { code: 1345, name: 'Nyatieko', constituencyCode: 269, registeredVoters: 10340 },
]

async function main() {
  console.log('Seeding Kisii County (constituencies and wards)...\n')

  // 1. Upsert Kisii County
  await prisma.county.upsert({
    where: { countyCode: KISII_COUNTY_CODE },
    update: { countyName: 'Kisii' },
    create: {
      countyCode: KISII_COUNTY_CODE,
      countyName: 'Kisii',
    },
  })
  console.log('✓ Kisii County (45)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: KISII_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: KISII_COUNTY_CODE,
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

  console.log('\n✅ Kisii County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Kisii:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
