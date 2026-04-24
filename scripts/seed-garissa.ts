import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const GARISSA_COUNTY_CODE = 7

const constituencies = [
  { code: 27, name: 'Garissa Township' },
  { code: 28, name: 'Balambala' },
  { code: 29, name: 'Lagdera' },
  { code: 30, name: 'Dadaab' },
  { code: 31, name: 'Fafi' },
  { code: 32, name: 'Ijara' },
]

const wards = [
  { code: 131, name: 'Waberi', constituencyCode: 27, registeredVoters: 11657 },
  { code: 132, name: 'Galbet', constituencyCode: 27, registeredVoters: 16698 },
  { code: 133, name: 'Township', constituencyCode: 27, registeredVoters: 13419 },
  { code: 134, name: 'Iftin', constituencyCode: 27, registeredVoters: 11479 },
  { code: 135, name: 'Balambala', constituencyCode: 28, registeredVoters: 4414 },
  { code: 136, name: 'Danyere', constituencyCode: 28, registeredVoters: 3924 },
  { code: 137, name: 'Jara Jara', constituencyCode: 28, registeredVoters: 2729 },
  { code: 138, name: 'Saka', constituencyCode: 28, registeredVoters: 5413 },
  { code: 139, name: 'Sankuri', constituencyCode: 28, registeredVoters: 9605 },
  { code: 140, name: 'Modogashe', constituencyCode: 29, registeredVoters: 6388 },
  { code: 141, name: 'Benane', constituencyCode: 29, registeredVoters: 4463 },
  { code: 142, name: 'Goreale', constituencyCode: 29, registeredVoters: 2438 },
  { code: 143, name: 'Maalimin', constituencyCode: 29, registeredVoters: 5091 },
  { code: 144, name: 'Sabena', constituencyCode: 29, registeredVoters: 3394 },
  { code: 145, name: 'Baraki', constituencyCode: 29, registeredVoters: 5175 },
  { code: 146, name: 'Dertu', constituencyCode: 30, registeredVoters: 3744 },
  { code: 147, name: 'Dadaab', constituencyCode: 30, registeredVoters: 5657 },
  { code: 148, name: 'Labasigale', constituencyCode: 30, registeredVoters: 4331 },
  { code: 149, name: 'Damajale', constituencyCode: 30, registeredVoters: 9760 },
  { code: 150, name: 'Liboi', constituencyCode: 30, registeredVoters: 5362 },
  { code: 151, name: 'Abakaile', constituencyCode: 30, registeredVoters: 9331 },
  { code: 152, name: 'Bura', constituencyCode: 31, registeredVoters: 5272 },
  { code: 153, name: 'Dekaharia', constituencyCode: 31, registeredVoters: 4740 },
  { code: 154, name: 'Jarajila', constituencyCode: 31, registeredVoters: 3123 },
  { code: 155, name: 'Fafi', constituencyCode: 31, registeredVoters: 7050 },
  { code: 156, name: 'Nanighi', constituencyCode: 31, registeredVoters: 7150 },
  { code: 157, name: 'Hulugho', constituencyCode: 32, registeredVoters: 6266 },
  { code: 158, name: 'Sangailu', constituencyCode: 32, registeredVoters: 4919 },
  { code: 159, name: 'Ijara', constituencyCode: 32, registeredVoters: 7383 },
  { code: 160, name: 'Masalani', constituencyCode: 32, registeredVoters: 11098 },
]

async function main() {
  console.log('Seeding Garissa County (constituencies and wards)...\n')

  // 1. Upsert Garissa County
  await prisma.county.upsert({
    where: { countyCode: GARISSA_COUNTY_CODE },
    update: { countyName: 'Garissa' },
    create: {
      countyCode: GARISSA_COUNTY_CODE,
      countyName: 'Garissa',
    },
  })
  console.log('✓ Garissa County (7)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: GARISSA_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: GARISSA_COUNTY_CODE,
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

  console.log('\n✅ Garissa County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Garissa:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
