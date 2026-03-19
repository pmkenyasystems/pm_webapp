import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const KISUMU_COUNTY_CODE = 42

const constituencies = [
  { code: 238, name: 'Kisumu East' },
  { code: 239, name: 'Kisumu West' },
  { code: 240, name: 'Kisumu Central' },
  { code: 241, name: 'Seme' },
  { code: 242, name: 'Nyando' },
  { code: 243, name: 'Muhoroni' },
  { code: 244, name: 'Nyakach' },
]

const wards = [
  { code: 1186, name: 'Kajulu', constituencyCode: 238, registeredVoters: 26717 },
  { code: 1187, name: 'Kolwa East', constituencyCode: 238, registeredVoters: 15294 },
  { code: 1188, name: "Manyatta 'B'", constituencyCode: 238, registeredVoters: 15095 },
  { code: 1189, name: "Nyalenda 'A'", constituencyCode: 238, registeredVoters: 13765 },
  { code: 1190, name: 'Kolwa Central', constituencyCode: 238, registeredVoters: 22306 },
  { code: 1191, name: 'South West Kisumu', constituencyCode: 239, registeredVoters: 15592 },
  { code: 1192, name: 'Central Kisumu', constituencyCode: 239, registeredVoters: 21829 },
  { code: 1193, name: 'Kisumu North', constituencyCode: 239, registeredVoters: 17599 },
  { code: 1194, name: 'West Kisumu', constituencyCode: 239, registeredVoters: 13932 },
  { code: 1195, name: 'North West Kisumu', constituencyCode: 239, registeredVoters: 13975 },
  { code: 1196, name: 'Railways', constituencyCode: 240, registeredVoters: 25365 },
  { code: 1197, name: 'Migosi', constituencyCode: 240, registeredVoters: 18193 },
  { code: 1198, name: 'Shaurimoyo Kaloleni', constituencyCode: 240, registeredVoters: 17675 },
  { code: 1199, name: 'Market Milimani', constituencyCode: 240, registeredVoters: 29278 },
  { code: 1200, name: 'Kondele', constituencyCode: 240, registeredVoters: 23019 },
  { code: 1201, name: 'Nyalenda B', constituencyCode: 240, registeredVoters: 16619 },
  { code: 1202, name: 'West Seme', constituencyCode: 241, registeredVoters: 17896 },
  { code: 1203, name: 'Central Seme', constituencyCode: 241, registeredVoters: 14995 },
  { code: 1204, name: 'East Seme', constituencyCode: 241, registeredVoters: 13920 },
  { code: 1205, name: 'North Seme', constituencyCode: 241, registeredVoters: 15234 },
  { code: 1206, name: 'East Kano/Wawidhi', constituencyCode: 242, registeredVoters: 10146 },
  { code: 1207, name: 'Awasi/Onjiko', constituencyCode: 242, registeredVoters: 18448 },
  { code: 1208, name: 'Ahero', constituencyCode: 242, registeredVoters: 18131 },
  { code: 1209, name: 'Kabonyo/Kanyagwal', constituencyCode: 242, registeredVoters: 13012 },
  { code: 1210, name: 'Kobura', constituencyCode: 242, registeredVoters: 21020 },
  { code: 1211, name: 'Miwani', constituencyCode: 243, registeredVoters: 10846 },
  { code: 1212, name: 'Ombeyi', constituencyCode: 243, registeredVoters: 13969 },
  { code: 1213, name: "Masogo/Nyang'oma", constituencyCode: 243, registeredVoters: 18629 },
  { code: 1214, name: 'Chemelil', constituencyCode: 243, registeredVoters: 16933 },
  { code: 1215, name: 'Muhoroni/Koru', constituencyCode: 243, registeredVoters: 19388 },
  { code: 1216, name: 'South West Nyakach', constituencyCode: 244, registeredVoters: 10003 },
  { code: 1217, name: 'North Nyakach', constituencyCode: 244, registeredVoters: 21438 },
  { code: 1218, name: 'Central Nyakach', constituencyCode: 244, registeredVoters: 14199 },
  { code: 1219, name: 'West Nyakach', constituencyCode: 244, registeredVoters: 14900 },
  { code: 1220, name: 'South East Nyakach', constituencyCode: 244, registeredVoters: 17394 },
]

async function main() {
  console.log('Seeding Kisumu County (constituencies and wards)...\n')

  // 1. Upsert Kisumu County
  await prisma.county.upsert({
    where: { countyCode: KISUMU_COUNTY_CODE },
    update: { countyName: 'Kisumu' },
    create: {
      countyCode: KISUMU_COUNTY_CODE,
      countyName: 'Kisumu',
    },
  })
  console.log('✓ Kisumu County (42)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: KISUMU_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: KISUMU_COUNTY_CODE,
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

  console.log('\n✅ Kisumu County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Kisumu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
