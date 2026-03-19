import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const BUSIA_COUNTY_CODE = 40

const constituencies = [
  { code: 225, name: 'Teso North' },
  { code: 226, name: 'Teso South' },
  { code: 227, name: 'Nambale' },
  { code: 228, name: 'Matayos' },
  { code: 229, name: 'Butula' },
  { code: 230, name: 'Funyula' },
  { code: 231, name: 'Budalangi' },
]

const wards = [
  { code: 1121, name: 'Malaba Central', constituencyCode: 225, registeredVoters: 13248 },
  { code: 1122, name: 'Malaba North', constituencyCode: 225, registeredVoters: 8401 },
  { code: 1123, name: "Ang'urai South", constituencyCode: 225, registeredVoters: 9821 },
  { code: 1124, name: "Ang'urai North", constituencyCode: 225, registeredVoters: 10148 },
  { code: 1125, name: "Ang'urai East", constituencyCode: 225, registeredVoters: 7764 },
  { code: 1126, name: 'Malaba South', constituencyCode: 225, registeredVoters: 10413 },
  { code: 1127, name: "Ang'orom", constituencyCode: 226, registeredVoters: 13730 },
  { code: 1128, name: 'Chakol South', constituencyCode: 226, registeredVoters: 15351 },
  { code: 1129, name: 'Chakol North', constituencyCode: 226, registeredVoters: 9450 },
  { code: 1130, name: 'Amukura West', constituencyCode: 226, registeredVoters: 8862 },
  { code: 1131, name: 'Amukura East', constituencyCode: 226, registeredVoters: 11549 },
  { code: 1132, name: 'Amukura Central', constituencyCode: 226, registeredVoters: 12326 },
  { code: 1133, name: 'Nambale Township', constituencyCode: 227, registeredVoters: 17638 },
  { code: 1134, name: 'Bukhayo North/Waltsi', constituencyCode: 227, registeredVoters: 10945 },
  { code: 1135, name: 'Bukhayo East', constituencyCode: 227, registeredVoters: 11614 },
  { code: 1136, name: 'Bukhayo Central', constituencyCode: 227, registeredVoters: 10348 },
  { code: 1137, name: 'Bukhayo West', constituencyCode: 228, registeredVoters: 17548 },
  { code: 1138, name: 'Mayenje', constituencyCode: 228, registeredVoters: 8184 },
  { code: 1139, name: 'Matayos South', constituencyCode: 228, registeredVoters: 15980 },
  { code: 1140, name: 'Busibwabo', constituencyCode: 228, registeredVoters: 6500 },
  { code: 1141, name: 'Burumba', constituencyCode: 228, registeredVoters: 19496 },
  { code: 1142, name: 'Marachi West', constituencyCode: 229, registeredVoters: 11575 },
  { code: 1143, name: 'Kingandole', constituencyCode: 229, registeredVoters: 9906 },
  { code: 1144, name: 'Marachi Central', constituencyCode: 229, registeredVoters: 11685 },
  { code: 1145, name: 'Marachi East', constituencyCode: 229, registeredVoters: 11105 },
  { code: 1146, name: 'Marachi North', constituencyCode: 229, registeredVoters: 12937 },
  { code: 1147, name: 'Elugulu', constituencyCode: 229, registeredVoters: 10169 },
  { code: 1148, name: 'Namboboto Nambuku', constituencyCode: 230, registeredVoters: 15900 },
  { code: 1149, name: 'Nangina', constituencyCode: 230, registeredVoters: 12527 },
  { code: 1150, name: "Ageng'a Nanguba", constituencyCode: 230, registeredVoters: 14284 },
  { code: 1151, name: 'Bwiri', constituencyCode: 230, registeredVoters: 11320 },
  { code: 1152, name: 'Bunyala Central', constituencyCode: 231, registeredVoters: 7725 },
  { code: 1153, name: 'Bunyala North', constituencyCode: 231, registeredVoters: 13637 },
  { code: 1154, name: 'Bunyala West', constituencyCode: 231, registeredVoters: 14863 },
  { code: 1155, name: 'Bunyala South', constituencyCode: 231, registeredVoters: 9807 },
]

async function main() {
  console.log('Seeding Busia County (constituencies and wards)...\n')

  // 1. Upsert Busia County
  await prisma.county.upsert({
    where: { countyCode: BUSIA_COUNTY_CODE },
    update: { countyName: 'Busia' },
    create: {
      countyCode: BUSIA_COUNTY_CODE,
      countyName: 'Busia',
    },
  })
  console.log('✓ Busia County (40)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: BUSIA_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: BUSIA_COUNTY_CODE,
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

  console.log('\n✅ Busia County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Busia:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
