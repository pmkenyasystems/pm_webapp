import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const VIHIGA_COUNTY_CODE = 38

const constituencies = [
  { code: 211, name: 'Vihiga' },
  { code: 212, name: 'Sabatia' },
  { code: 213, name: 'Hamisi' },
  { code: 214, name: 'Luanda' },
  { code: 215, name: 'Emuhaya' },
]

const wards = [
  { code: 1051, name: 'Lugaga-Wamuluma', constituencyCode: 211, registeredVoters: 17381 },
  { code: 1052, name: 'South Maragoli', constituencyCode: 211, registeredVoters: 11192 },
  { code: 1053, name: 'Central Maragoli', constituencyCode: 211, registeredVoters: 13114 },
  { code: 1054, name: 'Mungoma', constituencyCode: 211, registeredVoters: 10602 },
  { code: 1055, name: 'Lyaduywa/Izava', constituencyCode: 212, registeredVoters: 14899 },
  { code: 1056, name: 'West Sabatia', constituencyCode: 212, registeredVoters: 11930 },
  { code: 1057, name: 'Chavakali', constituencyCode: 212, registeredVoters: null },
  { code: 1058, name: 'North Maragoli', constituencyCode: 212, registeredVoters: null },
  { code: 1059, name: 'Wodanga', constituencyCode: 212, registeredVoters: null },
  { code: 1060, name: 'Busali', constituencyCode: 212, registeredVoters: null },
  { code: 1061, name: 'Shiru', constituencyCode: 213, registeredVoters: null },
  { code: 1062, name: 'Gisambai', constituencyCode: 213, registeredVoters: null },
  { code: 1063, name: 'Shamakhokho', constituencyCode: 213, registeredVoters: null },
  { code: 1064, name: 'Banja', constituencyCode: 213, registeredVoters: null },
  { code: 1065, name: 'Muhudu', constituencyCode: 213, registeredVoters: null },
  { code: 1066, name: 'Tambua', constituencyCode: 213, registeredVoters: null },
  { code: 1067, name: 'Jepkoyai', constituencyCode: 213, registeredVoters: null },
  { code: 1068, name: 'Luanda Township', constituencyCode: 214, registeredVoters: null },
  { code: 1069, name: 'Wemilabi', constituencyCode: 214, registeredVoters: null },
  { code: 1070, name: 'Mwibona', constituencyCode: 214, registeredVoters: null },
  { code: 1071, name: 'Luanda South', constituencyCode: 214, registeredVoters: null },
  { code: 1072, name: 'Emabungo', constituencyCode: 214, registeredVoters: null },
  { code: 1073, name: 'North East Bunyore', constituencyCode: 215, registeredVoters: null },
  { code: 1074, name: 'Central Bunyore', constituencyCode: 215, registeredVoters: null },
  { code: 1075, name: 'West Bunyore', constituencyCode: 215, registeredVoters: null },
]

async function main() {
  console.log('Seeding Vihiga County (constituencies and wards)...\n')

  // 1. Upsert Vihiga County
  await prisma.county.upsert({
    where: { countyCode: VIHIGA_COUNTY_CODE },
    update: { countyName: 'Vihiga' },
    create: {
      countyCode: VIHIGA_COUNTY_CODE,
      countyName: 'Vihiga',
    },
  })
  console.log('✓ Vihiga County (38)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: VIHIGA_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: VIHIGA_COUNTY_CODE,
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

  console.log('\n✅ Vihiga County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Vihiga:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
