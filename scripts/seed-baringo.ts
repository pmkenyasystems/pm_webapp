import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const BARINGO_COUNTY_CODE = 30

const constituencies = [
  { code: 157, name: 'Tiaty' },
  { code: 158, name: 'Baringo North' },
  { code: 159, name: 'Baringo Central' },
  { code: 160, name: 'Baringo South' },
  { code: 161, name: 'Mogotio' },
  { code: 162, name: 'Eldama Ravine' },
]

const wards = [
  { code: 781, name: 'Tirioko', constituencyCode: 157, registeredVoters: null },
  { code: 782, name: 'Kolowa', constituencyCode: 157, registeredVoters: null },
  { code: 783, name: 'Ribkwo', constituencyCode: 157, registeredVoters: null },
  { code: 784, name: 'Silale', constituencyCode: 157, registeredVoters: null },
  { code: 785, name: 'Loiyamorock', constituencyCode: 157, registeredVoters: null },
  { code: 786, name: 'Tangulbei/Korosi', constituencyCode: 157, registeredVoters: null },
  { code: 787, name: 'Churo/Amaya', constituencyCode: 157, registeredVoters: null },
  { code: 788, name: 'Barwessa', constituencyCode: 158, registeredVoters: 12693 },
  { code: 789, name: 'Kabartonjo', constituencyCode: 158, registeredVoters: 11270 },
  { code: 790, name: 'Saimo/Kipsaraman', constituencyCode: 158, registeredVoters: 11657 },
  { code: 791, name: 'Saimo/Soi', constituencyCode: 158, registeredVoters: 8284 },
  { code: 792, name: 'Bartabwa', constituencyCode: 158, registeredVoters: 6383 },
  { code: 793, name: 'Kabarnet', constituencyCode: 159, registeredVoters: 15204 },
  { code: 794, name: 'Sacho', constituencyCode: 159, registeredVoters: null },
  { code: 795, name: 'Tenges', constituencyCode: 159, registeredVoters: null },
  { code: 796, name: 'Ewalel/Chapchap', constituencyCode: 159, registeredVoters: null },
  { code: 797, name: 'Kapropita', constituencyCode: 159, registeredVoters: null },
  { code: 798, name: 'Marigat', constituencyCode: 160, registeredVoters: null },
  { code: 799, name: 'Ilchamus', constituencyCode: 160, registeredVoters: null },
  { code: 800, name: 'Mochongoi', constituencyCode: 160, registeredVoters: null },
  { code: 801, name: 'Mukutani', constituencyCode: 160, registeredVoters: null },
  { code: 802, name: 'Mogotio', constituencyCode: 161, registeredVoters: null },
  { code: 803, name: 'Emining', constituencyCode: 161, registeredVoters: null },
  { code: 804, name: 'Kisanana', constituencyCode: 161, registeredVoters: null },
  { code: 805, name: 'Lembus', constituencyCode: 162, registeredVoters: null },
  { code: 806, name: 'Lembus Kwen', constituencyCode: 162, registeredVoters: null },
  { code: 807, name: 'Ravine', constituencyCode: 162, registeredVoters: null },
  { code: 808, name: 'Mumberes/Maji Mazuri', constituencyCode: 162, registeredVoters: null },
  { code: 809, name: 'Lembus/Perkerra', constituencyCode: 162, registeredVoters: null },
  { code: 810, name: 'Koibatek', constituencyCode: 162, registeredVoters: null },
]

async function main() {
  console.log('Seeding Baringo County (constituencies and wards)...\n')

  // 1. Upsert Baringo County
  await prisma.county.upsert({
    where: { countyCode: BARINGO_COUNTY_CODE },
    update: { countyName: 'Baringo' },
    create: {
      countyCode: BARINGO_COUNTY_CODE,
      countyName: 'Baringo',
    },
  })
  console.log('✓ Baringo County (30)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: BARINGO_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: BARINGO_COUNTY_CODE,
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

  console.log('\n✅ Baringo County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Baringo:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
