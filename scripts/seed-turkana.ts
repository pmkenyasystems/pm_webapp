import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TURKANA_COUNTY_CODE = 23

const constituencies = [
  { code: 123, name: 'Turkana North' },
  { code: 124, name: 'Turkana West' },
  { code: 125, name: 'Turkana Central' },
  { code: 126, name: 'Loima' },
  { code: 127, name: 'Turkana South' },
  { code: 128, name: 'Turkana East' },
]

const wards = [
  { code: 611, name: 'Kaeris', constituencyCode: 123, registeredVoters: 6586 },
  { code: 612, name: 'Lake Zone', constituencyCode: 123, registeredVoters: 10896 },
  { code: 613, name: 'Lapur', constituencyCode: 123, registeredVoters: 7188 },
  { code: 614, name: 'Kaaleng/Kaikor', constituencyCode: 123, registeredVoters: 8148 },
  { code: 615, name: 'Kibish', constituencyCode: 123, registeredVoters: 3684 },
  { code: 616, name: 'Nakalale', constituencyCode: 123, registeredVoters: 6435 },
  { code: 617, name: 'Kakuma', constituencyCode: 124, registeredVoters: 12153 },
  { code: 618, name: 'Lopur', constituencyCode: 124, registeredVoters: 5697 },
  { code: 619, name: 'Letea', constituencyCode: 124, registeredVoters: 5348 },
  { code: 620, name: 'Songot', constituencyCode: 124, registeredVoters: 4733 },
  { code: 621, name: 'Kalobeyei', constituencyCode: 124, registeredVoters: 5099 },
  { code: 622, name: 'Lokichoggio', constituencyCode: 124, registeredVoters: 5490 },
  { code: 623, name: 'Nanaam', constituencyCode: 124, registeredVoters: 4153 },
  { code: 624, name: 'Kerio Delta', constituencyCode: 125, registeredVoters: 10672 },
  { code: 625, name: "Kang'atotha", constituencyCode: 125, registeredVoters: 7625 },
  { code: 626, name: 'Kalokol', constituencyCode: 125, registeredVoters: 9179 },
  { code: 627, name: 'Lodwar Township', constituencyCode: 125, registeredVoters: 17273 },
  { code: 628, name: 'Kanamkemer', constituencyCode: 125, registeredVoters: 11222 },
  { code: 629, name: 'Kotaruk/Lobei', constituencyCode: 126, registeredVoters: 8174 },
  { code: 630, name: 'Turkwel', constituencyCode: 126, registeredVoters: 19528 },
  { code: 631, name: 'Loima', constituencyCode: 126, registeredVoters: 3978 },
  { code: 632, name: 'Lokiriama/Lorengippi', constituencyCode: 126, registeredVoters: 4835 },
  { code: 633, name: 'Kaputir', constituencyCode: 127, registeredVoters: 4123 },
  { code: 634, name: 'Katilu', constituencyCode: 127, registeredVoters: 13254 },
  { code: 635, name: 'Lobokat', constituencyCode: 127, registeredVoters: 4259 },
  { code: 636, name: 'Kalapata', constituencyCode: 127, registeredVoters: 4329 },
  { code: 637, name: 'Lokichar', constituencyCode: 127, registeredVoters: 14467 },
  { code: 638, name: 'Kapedo/Napeitom', constituencyCode: 128, registeredVoters: 3721 },
  { code: 639, name: 'Katilia', constituencyCode: 128, registeredVoters: 6357 },
  { code: 640, name: 'Lokori/Kochodin', constituencyCode: 128, registeredVoters: 9922 },
]

async function main() {
  console.log('Seeding Turkana County (constituencies and wards)...\n')

  // 1. Upsert Turkana County
  await prisma.county.upsert({
    where: { countyCode: TURKANA_COUNTY_CODE },
    update: { countyName: 'Turkana' },
    create: {
      countyCode: TURKANA_COUNTY_CODE,
      countyName: 'Turkana',
    },
  })
  console.log('✓ Turkana County (23)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: TURKANA_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: TURKANA_COUNTY_CODE,
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

  console.log('\n✅ Turkana County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Turkana:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
