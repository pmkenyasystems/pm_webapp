import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MERU_COUNTY_CODE = 12

const constituencies = [
  { code: 51, name: 'Igembe South' },
  { code: 52, name: 'Igembe Central' },
  { code: 53, name: 'Igembe North' },
  { code: 54, name: 'Tigania West' },
  { code: 55, name: 'Tigania East' },
  { code: 56, name: 'North Imenti' },
  { code: 57, name: 'Buuri' },
  { code: 58, name: 'Central Imenti' },
  { code: 59, name: 'South Imenti' },
]

const wards = [
  { code: 251, name: 'Maua', constituencyCode: 51, registeredVoters: 17213 },
  { code: 252, name: 'Kiegoi/Antubochiu', constituencyCode: 51, registeredVoters: 16514 },
  { code: 253, name: 'Athiru Gaiti', constituencyCode: 51, registeredVoters: 14443 },
  { code: 254, name: 'Akachiu', constituencyCode: 51, registeredVoters: 14371 },
  { code: 255, name: 'Kanuni', constituencyCode: 51, registeredVoters: 14585 },
  { code: 256, name: "Akirang'ondu", constituencyCode: 52, registeredVoters: 15637 },
  { code: 257, name: 'Athiru Ruujine', constituencyCode: 52, registeredVoters: 19920 },
  { code: 258, name: 'Igembe East', constituencyCode: 52, registeredVoters: 19964 },
  { code: 259, name: 'Njia', constituencyCode: 52, registeredVoters: 21810 },
  { code: 260, name: 'Kangeta', constituencyCode: 52, registeredVoters: 16103 },
  { code: 261, name: 'Antuambui', constituencyCode: 53, registeredVoters: 17113 },
  { code: 262, name: 'Ntunene', constituencyCode: 53, registeredVoters: 11829 },
  { code: 263, name: 'Antubetwe Kiongo', constituencyCode: 53, registeredVoters: 15108 },
  { code: 264, name: 'Naathu', constituencyCode: 53, registeredVoters: 13879 },
  { code: 265, name: 'Amwathi', constituencyCode: 53, registeredVoters: 19121 },
  { code: 266, name: 'Athwana', constituencyCode: 54, registeredVoters: 9123 },
  { code: 267, name: 'Akithii', constituencyCode: 54, registeredVoters: 16709 },
  { code: 268, name: 'Kianjai', constituencyCode: 54, registeredVoters: 21037 },
  { code: 269, name: 'Nkomo', constituencyCode: 54, registeredVoters: 13030 },
  { code: 270, name: 'Mbeu', constituencyCode: 54, registeredVoters: 10384 },
  { code: 271, name: 'Thangatha', constituencyCode: 55, registeredVoters: 21025 },
  { code: 272, name: 'Mikinduri', constituencyCode: 55, registeredVoters: 18246 },
  { code: 273, name: 'Kiguchwa', constituencyCode: 55, registeredVoters: 11544 },
  { code: 274, name: 'Muthara', constituencyCode: 55, registeredVoters: 19902 },
  { code: 275, name: 'Karama', constituencyCode: 55, registeredVoters: 12810 },
  { code: 276, name: 'Municipality', constituencyCode: 56, registeredVoters: 23655 },
  { code: 277, name: 'Ntima East', constituencyCode: 56, registeredVoters: 14904 },
  { code: 278, name: 'Ntima West', constituencyCode: 56, registeredVoters: 19161 },
  { code: 279, name: 'Nyaki West', constituencyCode: 56, registeredVoters: 21192 },
  { code: 280, name: 'Nyaki East', constituencyCode: 56, registeredVoters: 17329 },
  { code: 281, name: 'Timau', constituencyCode: 57, registeredVoters: 22215 },
  { code: 282, name: 'Kisima', constituencyCode: 57, registeredVoters: 18075 },
  { code: 283, name: 'Kiirua/Naari', constituencyCode: 57, registeredVoters: 15690 },
  { code: 284, name: 'Ruiri/Rwarera', constituencyCode: 57, registeredVoters: 11521 },
  { code: 289, name: 'Kibirichia', constituencyCode: 57, registeredVoters: 14840 },
  { code: 285, name: 'Mwanganthia', constituencyCode: 58, registeredVoters: 15057 },
  { code: 286, name: 'Abothuguchi Central', constituencyCode: 58, registeredVoters: 24397 },
  { code: 287, name: 'Abothuguchi West', constituencyCode: 58, registeredVoters: 24723 },
  { code: 288, name: 'Kiagu', constituencyCode: 58, registeredVoters: 12318 },
  { code: 290, name: 'Mitunguu', constituencyCode: 59, registeredVoters: 14078 },
  { code: 291, name: 'Igoji East', constituencyCode: 59, registeredVoters: 18203 },
  { code: 292, name: 'Igoji West', constituencyCode: 59, registeredVoters: 12496 },
  { code: 293, name: 'Abogeta East', constituencyCode: 59, registeredVoters: 21169 },
  { code: 294, name: 'Abogeta West', constituencyCode: 59, registeredVoters: 19074 },
  { code: 295, name: 'Nkuene', constituencyCode: 59, registeredVoters: 30622 },
]

async function main() {
  console.log('Seeding Meru County (constituencies and wards)...\n')

  // 1. Upsert Meru County
  await prisma.county.upsert({
    where: { countyCode: MERU_COUNTY_CODE },
    update: { countyName: 'Meru' },
    create: {
      countyCode: MERU_COUNTY_CODE,
      countyName: 'Meru',
    },
  })
  console.log('✓ Meru County (12)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: MERU_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: MERU_COUNTY_CODE,
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

  console.log('\n✅ Meru County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Meru:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
