import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MOMBASA_COUNTY_CODE = 1

const constituencies = [
  { code: 1, name: 'Changamwe' },
  { code: 2, name: 'Jomvu' },
  { code: 3, name: 'Kisauni' },
  { code: 4, name: 'Nyali' },
  { code: 5, name: 'Likoni' },
  { code: 6, name: 'Mvita' },
]

const wards = [
  { code: 1, name: 'Port Reitz', constituencyCode: 1, registeredVoters: 17817 },
  { code: 2, name: 'Kipevu', constituencyCode: 1, registeredVoters: 16132 },
  { code: 3, name: 'Airport', constituencyCode: 1, registeredVoters: 18557 },
  { code: 4, name: 'Changamwe', constituencyCode: 1, registeredVoters: 18182 },
  { code: 5, name: 'Chaani', constituencyCode: 1, registeredVoters: 22873 },
  { code: 6, name: 'Jomvu Kuu', constituencyCode: 2, registeredVoters: 24243 },
  { code: 7, name: 'Miritini', constituencyCode: 2, registeredVoters: 18048 },
  { code: 8, name: 'Mikindani', constituencyCode: 2, registeredVoters: 32794 },
  { code: 9, name: 'Mjambere', constituencyCode: 3, registeredVoters: 22692 },
  { code: 10, name: 'Junda', constituencyCode: 3, registeredVoters: 25602 },
  { code: 11, name: 'Bamburi', constituencyCode: 3, registeredVoters: 20470 },
  { code: 12, name: 'Mwakirunge', constituencyCode: 3, registeredVoters: 6423 },
  { code: 13, name: 'Mtopanga', constituencyCode: 3, registeredVoters: 19474 },
  { code: 14, name: 'Magogoni', constituencyCode: 3, registeredVoters: 15105 },
  { code: 15, name: 'Shanzu', constituencyCode: 3, registeredVoters: 25510 },
  { code: 16, name: 'Frere Town', constituencyCode: 4, registeredVoters: 24849 },
  { code: 17, name: "Ziwa La Ng'ombe", constituencyCode: 4, registeredVoters: 23296 },
  { code: 18, name: 'Mkomani', constituencyCode: 4, registeredVoters: 24154 },
  { code: 19, name: 'Kongowea', constituencyCode: 4, registeredVoters: 28846 },
  { code: 20, name: 'Kadzandani', constituencyCode: 4, registeredVoters: 23108 },
  { code: 21, name: 'Mtongwe', constituencyCode: 5, registeredVoters: 13937 },
  { code: 22, name: 'Shika Adabu', constituencyCode: 5, registeredVoters: 15437 },
  { code: 23, name: 'Bofu', constituencyCode: 5, registeredVoters: 18188 },
  { code: 24, name: 'Likoni', constituencyCode: 5, registeredVoters: 13273 },
  { code: 25, name: 'Timbwani', constituencyCode: 5, registeredVoters: 33929 },
  { code: 26, name: 'Mji wa Kale/Makadara', constituencyCode: 6, registeredVoters: 22341 },
  { code: 27, name: 'Tudor', constituencyCode: 6, registeredVoters: 22926 },
  { code: 28, name: 'Tononoka', constituencyCode: 6, registeredVoters: 23379 },
  { code: 29, name: 'Shimanzi/Ganjoni', constituencyCode: 6, registeredVoters: 18556 },
  { code: 30, name: 'Majengo', constituencyCode: 6, registeredVoters: 31772 },
]

async function main() {
  console.log('Seeding Mombasa County (constituencies and wards)...\n')

  // 1. Upsert Mombasa County
  await prisma.county.upsert({
    where: { countyCode: MOMBASA_COUNTY_CODE },
    update: { countyName: 'Mombasa' },
    create: {
      countyCode: MOMBASA_COUNTY_CODE,
      countyName: 'Mombasa',
    },
  })
  console.log('✓ Mombasa County (1)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: MOMBASA_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: MOMBASA_COUNTY_CODE,
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

  console.log('\n✅ Mombasa County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Mombasa:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
