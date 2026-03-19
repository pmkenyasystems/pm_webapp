import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ELGEYO_MARAKWET_COUNTY_CODE = 28

const constituencies = [
  { code: 147, name: 'Marakwet East' },
  { code: 148, name: 'Marakwet West' },
  { code: 149, name: 'Keiyo North' },
  { code: 150, name: 'Keiyo South' },
]

const wards = [
  { code: 731, name: 'Kapyego', constituencyCode: 147, registeredVoters: 8415 },
  { code: 732, name: 'Sambirir', constituencyCode: 147, registeredVoters: 13394 },
  { code: 733, name: 'Endo', constituencyCode: 147, registeredVoters: 14238 },
  { code: 734, name: 'Embobut / Embulot', constituencyCode: 147, registeredVoters: 7625 },
  { code: 735, name: 'Lelan', constituencyCode: 148, registeredVoters: 10081 },
  { code: 736, name: 'Sengwer', constituencyCode: 148, registeredVoters: 9603 },
  { code: 737, name: "Cherang'any/Chebororwa", constituencyCode: 148, registeredVoters: 9679 },
  { code: 738, name: 'Moiben/Kuserwo', constituencyCode: 148, registeredVoters: 10775 },
  { code: 739, name: 'Kapsowar', constituencyCode: 148, registeredVoters: 13187 },
  { code: 740, name: 'Arror', constituencyCode: 148, registeredVoters: 5243 },
  { code: 741, name: 'Emsoo', constituencyCode: 149, registeredVoters: 6461 },
  { code: 742, name: 'Kamariny', constituencyCode: 149, registeredVoters: 17416 },
  { code: 743, name: 'Kapchemutwa', constituencyCode: 149, registeredVoters: 15672 },
  { code: 744, name: 'Tambach', constituencyCode: 149, registeredVoters: 9698 },
  { code: 745, name: 'Kaptarakwa', constituencyCode: 150, registeredVoters: 10426 },
  { code: 746, name: 'Chepkorio', constituencyCode: 150, registeredVoters: 14294 },
  { code: 747, name: 'Soy North', constituencyCode: 150, registeredVoters: 9194 },
  { code: 748, name: 'Soy South', constituencyCode: 150, registeredVoters: 10367 },
  { code: 749, name: 'Kabiemit', constituencyCode: 150, registeredVoters: 10136 },
  { code: 750, name: 'Metkei', constituencyCode: 150, registeredVoters: 7980 },
]

async function main() {
  console.log('Seeding Elgeyo-Marakwet County (constituencies and wards)...\n')

  // 1. Upsert Elgeyo-Marakwet County
  await prisma.county.upsert({
    where: { countyCode: ELGEYO_MARAKWET_COUNTY_CODE },
    update: { countyName: 'Elgeyo-Marakwet' },
    create: {
      countyCode: ELGEYO_MARAKWET_COUNTY_CODE,
      countyName: 'Elgeyo-Marakwet',
    },
  })
  console.log('✓ Elgeyo-Marakwet County (28)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: ELGEYO_MARAKWET_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: ELGEYO_MARAKWET_COUNTY_CODE,
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

  console.log('\n✅ Elgeyo-Marakwet County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Elgeyo-Marakwet:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
