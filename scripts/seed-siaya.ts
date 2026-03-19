import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SIAYA_COUNTY_CODE = 41

const constituencies = [
  { code: 232, name: 'Ugenya' },
  { code: 233, name: 'Ugunja' },
  { code: 234, name: 'Alego Usonga' },
  { code: 235, name: 'Gem' },
  { code: 236, name: 'Bondo' },
  { code: 237, name: 'Rarieda' },
]

const wards = [
  { code: 1156, name: 'West Ugenya', constituencyCode: 232, registeredVoters: 18973 },
  { code: 1157, name: 'Ukwala', constituencyCode: 232, registeredVoters: 14870 },
  { code: 1158, name: 'North Ugenya', constituencyCode: 232, registeredVoters: 16987 },
  { code: 1159, name: 'East Ugenya', constituencyCode: 232, registeredVoters: 18197 },
  { code: 1160, name: 'Sidindi', constituencyCode: 233, registeredVoters: 14980 },
  { code: 1161, name: 'Sigomere', constituencyCode: 233, registeredVoters: 18052 },
  { code: 1162, name: 'Ugunja', constituencyCode: 233, registeredVoters: 27082 },
  { code: 1163, name: 'Usonga', constituencyCode: 234, registeredVoters: 9273 },
  { code: 1164, name: 'West Alego', constituencyCode: 234, registeredVoters: 19154 },
  { code: 1165, name: 'Central Alego', constituencyCode: 234, registeredVoters: 18893 },
  { code: 1166, name: 'Siaya Township', constituencyCode: 234, registeredVoters: 26832 },
  { code: 1167, name: 'North Alego', constituencyCode: 234, registeredVoters: 19005 },
  { code: 1168, name: 'South East Alego', constituencyCode: 234, registeredVoters: 28845 },
  { code: 1169, name: 'North Gem', constituencyCode: 235, registeredVoters: 19321 },
  { code: 1170, name: 'West Gem', constituencyCode: 235, registeredVoters: 14228 },
  { code: 1171, name: 'Central Gem', constituencyCode: 235, registeredVoters: 13633 },
  { code: 1172, name: 'Yala Township', constituencyCode: 235, registeredVoters: 13874 },
  { code: 1173, name: 'East Gem', constituencyCode: 235, registeredVoters: 13952 },
  { code: 1174, name: 'South Gem', constituencyCode: 235, registeredVoters: 18560 },
  { code: 1175, name: 'West Yimbo', constituencyCode: 236, registeredVoters: 15638 },
  { code: 1176, name: 'Central Sakwa', constituencyCode: 236, registeredVoters: 13782 },
  { code: 1177, name: 'South Sakwa', constituencyCode: 236, registeredVoters: 14827 },
  { code: 1178, name: 'Yimbo East', constituencyCode: 236, registeredVoters: 17008 },
  { code: 1179, name: 'West Sakwa', constituencyCode: 236, registeredVoters: 21323 },
  { code: 1180, name: 'North Sakwa', constituencyCode: 236, registeredVoters: 21457 },
  { code: 1181, name: 'East Asembo', constituencyCode: 237, registeredVoters: 21741 },
  { code: 1182, name: 'West Asembo', constituencyCode: 237, registeredVoters: 21599 },
  { code: 1183, name: 'North Uyoma', constituencyCode: 237, registeredVoters: 13158 },
  { code: 1184, name: 'South Uyoma', constituencyCode: 237, registeredVoters: 11140 },
  { code: 1185, name: 'West Uyoma', constituencyCode: 237, registeredVoters: 17211 },
]

async function main() {
  console.log('Seeding Siaya County (constituencies and wards)...\n')

  // 1. Upsert Siaya County
  await prisma.county.upsert({
    where: { countyCode: SIAYA_COUNTY_CODE },
    update: { countyName: 'Siaya' },
    create: {
      countyCode: SIAYA_COUNTY_CODE,
      countyName: 'Siaya',
    },
  })
  console.log('✓ Siaya County (41)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: SIAYA_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: SIAYA_COUNTY_CODE,
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

  console.log('\n✅ Siaya County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Siaya:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
