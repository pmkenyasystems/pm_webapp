import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const WEST_POKOT_COUNTY_CODE = 24

const constituencies = [
  { code: 129, name: 'Kapenguria' },
  { code: 130, name: 'Sigor' },
  { code: 131, name: 'Kacheliba' },
  { code: 132, name: 'Pokot South' },
]

const wards = [
  { code: 641, name: 'Riwo', constituencyCode: 129, registeredVoters: 13552 },
  { code: 642, name: 'Kapenguria', constituencyCode: 129, registeredVoters: 12074 },
  { code: 643, name: 'Mnagei', constituencyCode: 129, registeredVoters: 18201 },
  { code: 644, name: 'Siyoi', constituencyCode: 129, registeredVoters: 8279 },
  { code: 645, name: 'Endugh', constituencyCode: 129, registeredVoters: 8360 },
  { code: 646, name: 'Sook', constituencyCode: 129, registeredVoters: 6074 },
  { code: 647, name: 'Sekerr', constituencyCode: 130, registeredVoters: 9432 },
  { code: 648, name: 'Masool', constituencyCode: 130, registeredVoters: 8187 },
  { code: 649, name: 'Lomut', constituencyCode: 130, registeredVoters: 12395 },
  { code: 650, name: 'Weiwei', constituencyCode: 130, registeredVoters: 13920 },
  { code: 651, name: 'Suam', constituencyCode: 131, registeredVoters: 8262 },
  { code: 652, name: 'Kodich', constituencyCode: 131, registeredVoters: 8354 },
  { code: 653, name: 'Kasei', constituencyCode: 131, registeredVoters: 7384 },
  { code: 654, name: 'Kapchok', constituencyCode: 131, registeredVoters: 7416 },
  { code: 655, name: 'Kiwawa', constituencyCode: 131, registeredVoters: 8658 },
  { code: 656, name: 'Alale', constituencyCode: 131, registeredVoters: 11072 },
  { code: 657, name: 'Chepareria', constituencyCode: 132, registeredVoters: 18494 },
  { code: 658, name: 'Batei', constituencyCode: 132, registeredVoters: 13075 },
  { code: 659, name: 'Lelan', constituencyCode: 132, registeredVoters: 15095 },
  { code: 660, name: 'Tapach', constituencyCode: 132, registeredVoters: 11742 },
]

async function main() {
  console.log('Seeding West Pokot County (constituencies and wards)...\n')

  // 1. Upsert West Pokot County
  await prisma.county.upsert({
    where: { countyCode: WEST_POKOT_COUNTY_CODE },
    update: { countyName: 'West Pokot' },
    create: {
      countyCode: WEST_POKOT_COUNTY_CODE,
      countyName: 'West Pokot',
    },
  })
  console.log('✓ West Pokot County (24)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: WEST_POKOT_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: WEST_POKOT_COUNTY_CODE,
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

  console.log('\n✅ West Pokot County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding West Pokot:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
