import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const NAIROBI_COUNTY_CODE = 47

const constituencies = [
  { code: 274, name: 'Westlands' },
  { code: 275, name: 'Dagoretti North' },
  { code: 276, name: 'Dagoretti South' },
  { code: 277, name: 'Langata' },
  { code: 278, name: 'Kibra' },
  { code: 279, name: 'Roysambu' },
  { code: 280, name: 'Kasarani' },
  { code: 281, name: 'Ruaraka' },
  { code: 282, name: 'Embakasi South' },
  { code: 283, name: 'Embakasi North' },
  { code: 284, name: 'Embakasi Central' },
  { code: 285, name: 'Embakasi East' },
  { code: 286, name: 'Embakasi West' },
  { code: 287, name: 'Makadara' },
  { code: 288, name: 'Kamukunji' },
  { code: 289, name: 'Starehe' },
  { code: 290, name: 'Mathare' },
]

const wards = [
  { code: 1366, name: 'Kitisuru', constituencyCode: 274, registeredVoters: 29237 },
  { code: 1367, name: 'Parklands/Highridge', constituencyCode: 274, registeredVoters: 37144 },
  { code: 1368, name: 'Karura', constituencyCode: 274, registeredVoters: 29548 },
  { code: 1369, name: 'Kangemi', constituencyCode: 274, registeredVoters: 32551 },
  { code: 1370, name: 'Mountain View', constituencyCode: 274, registeredVoters: 32259 },
  { code: 1371, name: 'Kilimani', constituencyCode: 275, registeredVoters: 38927 },
  { code: 1372, name: 'Kawangware', constituencyCode: 275, registeredVoters: 28468 },
  { code: 1373, name: 'Gatina', constituencyCode: 275, registeredVoters: 34831 },
  { code: 1374, name: 'Kileleshwa', constituencyCode: 275, registeredVoters: 26343 },
  { code: 1375, name: 'Kabiro', constituencyCode: 275, registeredVoters: 29090 },
  { code: 1376, name: 'Mutu-Ini', constituencyCode: 276, registeredVoters: 13484 },
  { code: 1377, name: 'Ngando', constituencyCode: 276, registeredVoters: 24892 },
  { code: 1378, name: 'Riruta', constituencyCode: 276, registeredVoters: 37766 },
  { code: 1379, name: 'Uthiru/Ruthimitu', constituencyCode: 276, registeredVoters: 19657 },
  { code: 1380, name: 'Waithaka', constituencyCode: 276, registeredVoters: 19131 },
  { code: 1381, name: 'Karen', constituencyCode: 277, registeredVoters: 34450 },
  { code: 1382, name: 'Nairobi West', constituencyCode: 277, registeredVoters: 18386 },
  { code: 1383, name: 'Mugumu-Ini', constituencyCode: 277, registeredVoters: 37864 },
  { code: 1384, name: 'South C', constituencyCode: 277, registeredVoters: 33149 },
  { code: 1385, name: 'Nyayo Highrise', constituencyCode: 277, registeredVoters: 21800 },
  { code: 1386, name: 'Laini Saba', constituencyCode: 278, registeredVoters: 19378 },
  { code: 1387, name: 'Lindi', constituencyCode: 278, registeredVoters: 19082 },
  { code: 1388, name: 'Makina', constituencyCode: 278, registeredVoters: 28408 },
  { code: 1389, name: 'Woodley/Kenyatta Golf Course', constituencyCode: 278, registeredVoters: 28972 },
  { code: 1390, name: 'Sarangombe', constituencyCode: 278, registeredVoters: 32442 },
  { code: 1391, name: 'Githurai', constituencyCode: 279, registeredVoters: 35899 },
  { code: 1392, name: 'Kahawa West', constituencyCode: 279, registeredVoters: 38586 },
  { code: 1393, name: 'Zimmerman', constituencyCode: 279, registeredVoters: 30701 },
  { code: 1394, name: 'Roysambu', constituencyCode: 279, registeredVoters: 31158 },
  { code: 1395, name: 'Kahawa', constituencyCode: 279, registeredVoters: 17428 },
  { code: 1396, name: 'Clay City', constituencyCode: 280, registeredVoters: 34387 },
  { code: 1397, name: 'Mwiki', constituencyCode: 280, registeredVoters: 27837 },
  { code: 1398, name: 'Kasarani', constituencyCode: 280, registeredVoters: 27525 },
  { code: 1399, name: 'Njiru', constituencyCode: 280, registeredVoters: 28140 },
  { code: 1400, name: 'Ruai', constituencyCode: 280, registeredVoters: 37361 },
  { code: 1401, name: 'Baba Dogo', constituencyCode: 281, registeredVoters: 29419 },
  { code: 1402, name: 'Utalii', constituencyCode: 281, registeredVoters: 27599 },
  { code: 1403, name: 'Mathare North', constituencyCode: 281, registeredVoters: 29334 },
  { code: 1404, name: 'Lucky Summer', constituencyCode: 281, registeredVoters: 20690 },
  { code: 1405, name: 'Korogocho', constituencyCode: 281, registeredVoters: 17440 },
  { code: 1406, name: 'Imara Daima', constituencyCode: 282, registeredVoters: 38096 },
  { code: 1407, name: 'Kwa Njenga', constituencyCode: 282, registeredVoters: 28554 },
  { code: 1408, name: 'Kwa Reuben', constituencyCode: 282, registeredVoters: 33591 },
  { code: 1409, name: 'Pipeline', constituencyCode: 282, registeredVoters: 37900 },
  { code: 1410, name: 'Kware', constituencyCode: 282, registeredVoters: 29812 },
  { code: 1411, name: 'Kariobangi North', constituencyCode: 283, registeredVoters: 24500 },
  { code: 1412, name: 'Dandora Area I', constituencyCode: 283, registeredVoters: 20543 },
  { code: 1413, name: 'Dandora Area II', constituencyCode: 283, registeredVoters: 19761 },
  { code: 1414, name: 'Dandora Area III', constituencyCode: 283, registeredVoters: 21247 },
  { code: 1415, name: 'Dandora Area IV', constituencyCode: 283, registeredVoters: 27293 },
  { code: 1416, name: 'Kayole North', constituencyCode: 284, registeredVoters: 25563 },
  { code: 1417, name: 'Kayole Central', constituencyCode: 284, registeredVoters: 26855 },
  { code: 1418, name: 'Kayole South', constituencyCode: 284, registeredVoters: 41154 },
  { code: 1419, name: 'Komarock', constituencyCode: 284, registeredVoters: 33127 },
  { code: 1420, name: 'Matopeni/Spring Valley', constituencyCode: 284, registeredVoters: 19193 },
  { code: 1421, name: 'Upper Savannah', constituencyCode: 285, registeredVoters: 28928 },
  { code: 1422, name: 'Lower Savannah', constituencyCode: 285, registeredVoters: 30104 },
  { code: 1423, name: 'Embakasi', constituencyCode: 285, registeredVoters: 46291 },
  { code: 1424, name: 'Utawala', constituencyCode: 285, registeredVoters: 25707 },
  { code: 1425, name: 'Mihango', constituencyCode: 285, registeredVoters: 23569 },
  { code: 1426, name: 'Umoja I', constituencyCode: 286, registeredVoters: 40554 },
  { code: 1427, name: 'Umoja II', constituencyCode: 286, registeredVoters: 39562 },
  { code: 1428, name: 'Mowlem', constituencyCode: 286, registeredVoters: 23423 },
  { code: 1429, name: 'Kariobangi South', constituencyCode: 286, registeredVoters: 38339 },
  { code: 1430, name: 'Maringo/Hamza', constituencyCode: 287, registeredVoters: 39821 },
  { code: 1431, name: 'Viwandani', constituencyCode: 287, registeredVoters: 24650 },
  { code: 1432, name: 'Harambee', constituencyCode: 287, registeredVoters: 36498 },
  { code: 1433, name: 'Makongeni', constituencyCode: 287, registeredVoters: 28658 },
  { code: 1434, name: 'Pumwani', constituencyCode: 288, registeredVoters: 39130 },
  { code: 1435, name: 'Eastleigh North', constituencyCode: 288, registeredVoters: 27523 },
  { code: 1436, name: 'Eastleigh South', constituencyCode: 288, registeredVoters: 28019 },
  { code: 1437, name: 'Airbase', constituencyCode: 288, registeredVoters: 16352 },
  { code: 1438, name: 'California', constituencyCode: 288, registeredVoters: 17492 },
  { code: 1439, name: 'Nairobi Central', constituencyCode: 289, registeredVoters: 52186 },
  { code: 1440, name: 'Ngara', constituencyCode: 289, registeredVoters: 27816 },
  { code: 1441, name: 'Pangani', constituencyCode: 289, registeredVoters: 18494 },
  { code: 1442, name: 'Ziwani/Kariokor', constituencyCode: 289, registeredVoters: 16790 },
  { code: 1443, name: 'Landimawe', constituencyCode: 289, registeredVoters: 20436 },
  { code: 1444, name: 'Nairobi South', constituencyCode: 289, registeredVoters: 33853 },
  { code: 1445, name: 'Hospital', constituencyCode: 290, registeredVoters: 12512 },
  { code: 1446, name: 'Mabatini', constituencyCode: 290, registeredVoters: 20976 },
  { code: 1447, name: 'Huruma', constituencyCode: 290, registeredVoters: 23018 },
  { code: 1448, name: 'Ngei', constituencyCode: 290, registeredVoters: 24699 },
  { code: 1449, name: 'Mlango Kubwa', constituencyCode: 290, registeredVoters: 22765 },
  { code: 1450, name: 'Kiamaiko', constituencyCode: 290, registeredVoters: 19193 },
]

async function main() {
  console.log('Seeding Nairobi County (constituencies and wards)...\n')

  // 1. Upsert Nairobi County
  await prisma.county.upsert({
    where: { countyCode: NAIROBI_COUNTY_CODE },
    update: { countyName: 'Nairobi' },
    create: {
      countyCode: NAIROBI_COUNTY_CODE,
      countyName: 'Nairobi',
    },
  })
  console.log('✓ Nairobi County (47)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: NAIROBI_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: NAIROBI_COUNTY_CODE,
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

  console.log('\n✅ Nairobi County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Nairobi:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
