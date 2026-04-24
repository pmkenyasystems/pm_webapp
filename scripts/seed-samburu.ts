import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SAMBURU_COUNTY_CODE = 25

const constituencies = [
  { code: 133, name: 'Samburu West' },
  { code: 134, name: 'Samburu North' },
  { code: 135, name: 'Samburu East' },
]

const wards = [
  { code: 661, name: 'Lodokejek', constituencyCode: 133, registeredVoters: 7458 },
  { code: 662, name: 'Suguta Marmar', constituencyCode: 133, registeredVoters: 7199 },
  { code: 663, name: 'Maralal', constituencyCode: 133, registeredVoters: 17580 },
  { code: 664, name: 'Loosuk', constituencyCode: 133, registeredVoters: 5280 },
  { code: 665, name: 'Poro', constituencyCode: 133, registeredVoters: 5873 },
  { code: 666, name: 'El-Barta', constituencyCode: 134, registeredVoters: 5678 },
  { code: 667, name: 'Nachola', constituencyCode: 134, registeredVoters: 3194 },
  { code: 668, name: 'Ndoto', constituencyCode: 134, registeredVoters: 6088 },
  { code: 669, name: 'Nyiro', constituencyCode: 134, registeredVoters: 5779 },
  { code: 670, name: 'Angata Nanyokie', constituencyCode: 134, registeredVoters: 4204 },
  { code: 671, name: 'Baawa', constituencyCode: 134, registeredVoters: 4887 },
  { code: 672, name: 'Waso', constituencyCode: 135, registeredVoters: 6707 },
  { code: 673, name: 'Wamba West', constituencyCode: 135, registeredVoters: 6816 },
  { code: 674, name: 'Wamba East', constituencyCode: 135, registeredVoters: 8017 },
  { code: 675, name: 'Wamba North', constituencyCode: 135, registeredVoters: 5254 },
]

async function main() {
  console.log('Seeding Samburu County (constituencies and wards)...\n')

  // 1. Upsert Samburu County
  await prisma.county.upsert({
    where: { countyCode: SAMBURU_COUNTY_CODE },
    update: { countyName: 'Samburu' },
    create: {
      countyCode: SAMBURU_COUNTY_CODE,
      countyName: 'Samburu',
    },
  })
  console.log('✓ Samburu County (25)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: SAMBURU_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: SAMBURU_COUNTY_CODE,
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

  console.log('\n✅ Samburu County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Samburu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
