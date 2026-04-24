import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const HOMA_BAY_COUNTY_CODE = 43

const constituencies = [
  { code: 245, name: 'Kasipul' },
  { code: 246, name: 'Kabondo Kasipul' },
  { code: 247, name: 'Karachuonyo' },
  { code: 248, name: 'Rangwe' },
  { code: 249, name: 'Homa Bay Town' },
  { code: 250, name: 'Ndhiwa' },
  { code: 251, name: 'Suba North' },
  { code: 252, name: 'Suba South' },
]

const wards = [
  { code: 1221, name: 'West Kasipul', constituencyCode: 245, registeredVoters: 14303 },
  { code: 1222, name: 'South Kasipul', constituencyCode: 245, registeredVoters: 14318 },
  { code: 1223, name: 'Central Kasipul', constituencyCode: 245, registeredVoters: 15476 },
  { code: 1224, name: 'East Kamagak', constituencyCode: 245, registeredVoters: 9074 },
  { code: 1225, name: 'West Kamagak', constituencyCode: 245, registeredVoters: 14342 },
  { code: 1226, name: 'Kabondo East', constituencyCode: 246, registeredVoters: 17062 },
  { code: 1227, name: 'Kabondo West', constituencyCode: 246, registeredVoters: 16927 },
  { code: 1228, name: 'Kokwanyo/Kakelo', constituencyCode: 246, registeredVoters: 15402 },
  { code: 1229, name: 'Kojwach', constituencyCode: 246, registeredVoters: 10519 },
  { code: 1230, name: 'West Karachuonyo', constituencyCode: 247, registeredVoters: 11870 },
  { code: 1231, name: 'North Karachuonyo', constituencyCode: 247, registeredVoters: 13731 },
  { code: 1232, name: 'Central', constituencyCode: 247, registeredVoters: 12560 },
  { code: 1233, name: 'Kanyaluo', constituencyCode: 247, registeredVoters: 11255 },
  { code: 1234, name: 'Kibiri', constituencyCode: 247, registeredVoters: 12053 },
  { code: 1235, name: 'Wangchieng', constituencyCode: 247, registeredVoters: 19362 },
  { code: 1236, name: 'Kendu Bay Town', constituencyCode: 247, registeredVoters: 13350 },
  { code: 1237, name: 'West Gem', constituencyCode: 248, registeredVoters: 12456 },
  { code: 1238, name: 'East Gem', constituencyCode: 248, registeredVoters: 13448 },
  { code: 1239, name: 'Kagan', constituencyCode: 248, registeredVoters: 16000 },
  { code: 1240, name: 'Kochia', constituencyCode: 248, registeredVoters: 16982 },
  { code: 1241, name: 'Homa Bay Central', constituencyCode: 249, registeredVoters: 21119 },
  { code: 1242, name: 'Homa Bay Arujo', constituencyCode: 249, registeredVoters: 13283 },
  { code: 1243, name: 'Homa Bay West', constituencyCode: 249, registeredVoters: 8283 },
  { code: 1244, name: 'Homa Bay East', constituencyCode: 249, registeredVoters: 15650 },
  { code: 1245, name: 'Kwabwai', constituencyCode: 250, registeredVoters: 16085 },
  { code: 1246, name: 'Kanyadoto', constituencyCode: 250, registeredVoters: 9315 },
  { code: 1247, name: 'Kanyikela', constituencyCode: 250, registeredVoters: 5350 },
  { code: 1248, name: 'Kabuoch North', constituencyCode: 250, registeredVoters: 19358 },
  { code: 1249, name: 'Kabuoch South/Pala', constituencyCode: 250, registeredVoters: 13741 },
  { code: 1250, name: 'Kanyamwa Kologi', constituencyCode: 250, registeredVoters: 13399 },
  { code: 1251, name: 'Kanyamwa Kosewe', constituencyCode: 250, registeredVoters: 19486 },
  { code: 1252, name: 'Mfangano Island', constituencyCode: 251, registeredVoters: 10569 },
  { code: 1253, name: 'Rusinga Island', constituencyCode: 251, registeredVoters: 14320 },
  { code: 1254, name: 'Kasgunga', constituencyCode: 251, registeredVoters: 12876 },
  { code: 1255, name: 'Gembe', constituencyCode: 251, registeredVoters: 9941 },
  { code: 1256, name: 'Lambwe', constituencyCode: 251, registeredVoters: 12968 },
  { code: 1257, name: 'Gwassi South', constituencyCode: 252, registeredVoters: 18433 },
  { code: 1258, name: 'Gwassi North', constituencyCode: 252, registeredVoters: 15405 },
  { code: 1259, name: 'Kaksingri West', constituencyCode: 252, registeredVoters: 13960 },
  { code: 1260, name: 'Ruma-Kaksingri', constituencyCode: 252, registeredVoters: 7040 },
]

async function main() {
  console.log('Seeding Homa Bay County (constituencies and wards)...\n')

  // 1. Upsert Homa Bay County
  await prisma.county.upsert({
    where: { countyCode: HOMA_BAY_COUNTY_CODE },
    update: { countyName: 'Homa Bay' },
    create: {
      countyCode: HOMA_BAY_COUNTY_CODE,
      countyName: 'Homa Bay',
    },
  })
  console.log('✓ Homa Bay County (43)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: HOMA_BAY_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: HOMA_BAY_COUNTY_CODE,
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

  console.log('\n✅ Homa Bay County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Homa Bay:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
