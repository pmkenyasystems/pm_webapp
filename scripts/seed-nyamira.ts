import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const NYAMIRA_COUNTY_CODE = 46

const constituencies = [
  { code: 270, name: 'Kitutu Masaba' },
  { code: 271, name: 'West Mugirango' },
  { code: 272, name: 'North Mugirango' },
  { code: 273, name: 'Borabu' },
]

const wards = [
  { code: 1346, name: 'Rigoma', constituencyCode: 270, registeredVoters: 19808 },
  { code: 1347, name: 'Gachuba', constituencyCode: 270, registeredVoters: 16245 },
  { code: 1348, name: 'Kemera', constituencyCode: 270, registeredVoters: 18264 },
  { code: 1349, name: 'Magombo', constituencyCode: 270, registeredVoters: 13683 },
  { code: 1350, name: 'Manga', constituencyCode: 270, registeredVoters: 19212 },
  { code: 1351, name: 'Gesima', constituencyCode: 270, registeredVoters: 19057 },
  { code: 1352, name: 'Nyamaiya', constituencyCode: 271, registeredVoters: 16431 },
  { code: 1353, name: 'Bogichora', constituencyCode: 271, registeredVoters: 21267 },
  { code: 1354, name: 'Bosamaro', constituencyCode: 271, registeredVoters: 20028 },
  { code: 1355, name: 'Bonyamatuta', constituencyCode: 271, registeredVoters: 15455 },
  { code: 1356, name: 'Township', constituencyCode: 271, registeredVoters: 15018 },
  { code: 1357, name: 'Itibo', constituencyCode: 272, registeredVoters: 13950 },
  { code: 1358, name: 'Bomwagamo', constituencyCode: 272, registeredVoters: 10152 },
  { code: 1359, name: 'Bokeira', constituencyCode: 272, registeredVoters: 13595 },
  { code: 1360, name: 'Magwagwa', constituencyCode: 272, registeredVoters: 12780 },
  { code: 1361, name: 'Ekerenyo', constituencyCode: 272, registeredVoters: 14273 },
  { code: 1362, name: 'Mekenene', constituencyCode: 273, registeredVoters: 10730 },
  { code: 1363, name: 'Kiabonyoru', constituencyCode: 273, registeredVoters: 22625 },
  { code: 1364, name: 'Nyansiongo', constituencyCode: 273, registeredVoters: 16050 },
  { code: 1365, name: 'Esise', constituencyCode: 273, registeredVoters: 14660 },
]

async function main() {
  console.log('Seeding Nyamira County (constituencies and wards)...\n')

  // 1. Upsert Nyamira County
  await prisma.county.upsert({
    where: { countyCode: NYAMIRA_COUNTY_CODE },
    update: { countyName: 'Nyamira' },
    create: {
      countyCode: NYAMIRA_COUNTY_CODE,
      countyName: 'Nyamira',
    },
  })
  console.log('✓ Nyamira County (46)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: NYAMIRA_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: NYAMIRA_COUNTY_CODE,
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

  console.log('\n✅ Nyamira County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Nyamira:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
