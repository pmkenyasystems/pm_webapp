import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const KITUI_COUNTY_CODE = 15

const constituencies = [
  { code: 67, name: 'Mwingi North' },
  { code: 68, name: 'Mwingi West' },
  { code: 69, name: 'Mwingi Central' },
  { code: 70, name: 'Kitui West' },
  { code: 71, name: 'Kitui Rural' },
  { code: 72, name: 'Kitui Central' },
  { code: 73, name: 'Kitui East' },
  { code: 74, name: 'Kitui South' },
]

const wards = [
  { code: 331, name: 'Ngomeni', constituencyCode: 67, registeredVoters: 9131 },
  { code: 332, name: 'Kyuso', constituencyCode: 67, registeredVoters: 19921 },
  { code: 333, name: 'Mumoni', constituencyCode: 67, registeredVoters: 15877 },
  { code: 334, name: 'Tseikuru', constituencyCode: 67, registeredVoters: 16471 },
  { code: 335, name: 'Tharaka', constituencyCode: 67, registeredVoters: 7429 },
  { code: 336, name: 'Kyome/Thaana', constituencyCode: 68, registeredVoters: 14979 },
  { code: 337, name: 'Nguutani', constituencyCode: 68, registeredVoters: 15121 },
  { code: 338, name: 'Migwani', constituencyCode: 68, registeredVoters: 14678 },
  { code: 339, name: 'Kiomo/Kyethani', constituencyCode: 68, registeredVoters: 12360 },
  { code: 340, name: 'Central', constituencyCode: 69, registeredVoters: 14525 },
  { code: 341, name: 'Kivou', constituencyCode: 69, registeredVoters: 12301 },
  { code: 342, name: 'Nguni', constituencyCode: 69, registeredVoters: 13165 },
  { code: 343, name: 'Nuu', constituencyCode: 69, registeredVoters: 12729 },
  { code: 344, name: 'Mui', constituencyCode: 69, registeredVoters: 11039 },
  { code: 345, name: 'Waita', constituencyCode: 69, registeredVoters: 10472 },
  { code: 346, name: 'Mutonguni', constituencyCode: 70, registeredVoters: 17979 },
  { code: 347, name: 'Kauwi', constituencyCode: 70, registeredVoters: 15767 },
  { code: 348, name: 'Matinyani', constituencyCode: 70, registeredVoters: 14279 },
  { code: 349, name: 'Kwa Mutonga/Kithumula', constituencyCode: 70, registeredVoters: 11022 },
  { code: 350, name: 'Kisasi', constituencyCode: 71, registeredVoters: 13840 },
  { code: 351, name: 'Mbitini', constituencyCode: 71, registeredVoters: 12048 },
  { code: 352, name: 'Kwavonza/Yatta', constituencyCode: 71, registeredVoters: 18020 },
  { code: 353, name: 'Kanyangi', constituencyCode: 71, registeredVoters: 11092 },
  { code: 354, name: 'Miambani', constituencyCode: 72, registeredVoters: 11759 },
  { code: 355, name: 'Township', constituencyCode: 72, registeredVoters: 19538 },
  { code: 356, name: 'Kyangwithya West', constituencyCode: 72, registeredVoters: 15931 },
  { code: 357, name: 'Mulango', constituencyCode: 72, registeredVoters: 15135 },
  { code: 358, name: 'Kyangwithya East', constituencyCode: 72, registeredVoters: 15401 },
  { code: 359, name: 'Zombe/Mwitika', constituencyCode: 73, registeredVoters: 13152 },
  { code: 360, name: 'Nzambani', constituencyCode: 73, registeredVoters: 11723 },
  { code: 361, name: 'Chuluni', constituencyCode: 73, registeredVoters: 12622 },
  { code: 362, name: 'Voo/Kyamatu', constituencyCode: 73, registeredVoters: 10003 },
  { code: 363, name: 'Endau/Malalani', constituencyCode: 73, registeredVoters: 7897 },
  { code: 364, name: 'Mutito/Kaliku', constituencyCode: 73, registeredVoters: 9980 },
  { code: 365, name: 'Ikanga/Kyatune', constituencyCode: 74, registeredVoters: null },
  { code: 366, name: 'Mutomo', constituencyCode: 74, registeredVoters: null },
  { code: 367, name: 'Mutha', constituencyCode: 74, registeredVoters: null },
  { code: 368, name: 'Ikutha', constituencyCode: 74, registeredVoters: null },
  { code: 369, name: 'Kanziko', constituencyCode: 74, registeredVoters: null },
  { code: 370, name: 'Athi', constituencyCode: 74, registeredVoters: null },
]

async function main() {
  console.log('Seeding Kitui County (constituencies and wards)...\n')

  // 1. Upsert Kitui County
  await prisma.county.upsert({
    where: { countyCode: KITUI_COUNTY_CODE },
    update: { countyName: 'Kitui' },
    create: {
      countyCode: KITUI_COUNTY_CODE,
      countyName: 'Kitui',
    },
  })
  console.log('✓ Kitui County (15)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: KITUI_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: KITUI_COUNTY_CODE,
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

  console.log('\n✅ Kitui County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Kitui:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
