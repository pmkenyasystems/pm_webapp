import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const KERICHO_COUNTY_CODE = 35

const constituencies = [
  { code: 188, name: 'Kipkelion East' },
  { code: 189, name: 'Kipkelion West' },
  { code: 190, name: 'Ainamoi' },
  { code: 191, name: 'Bureti' },
  { code: 192, name: 'Belgut' },
  { code: 193, name: 'Sigowet/Soin' },
]

const wards = [
  { code: 936, name: 'Londiani', constituencyCode: 188, registeredVoters: 14597 },
  { code: 937, name: 'Kedowa/Kimugul', constituencyCode: 188, registeredVoters: 21798 },
  { code: 938, name: 'Chepseon', constituencyCode: 188, registeredVoters: 18219 },
  { code: 939, name: 'Tendeno/Sorget', constituencyCode: 188, registeredVoters: 9065 },
  { code: 940, name: 'Kunyak', constituencyCode: 189, registeredVoters: 8876 },
  { code: 941, name: 'Kamasian', constituencyCode: 189, registeredVoters: 11827 },
  { code: 942, name: 'Kipkelion', constituencyCode: 189, registeredVoters: 15140 },
  { code: 943, name: 'Chilchila', constituencyCode: 189, registeredVoters: 17117 },
  { code: 944, name: 'Kapsoit', constituencyCode: 190, registeredVoters: 16117 },
  { code: 945, name: 'Ainamoi', constituencyCode: 190, registeredVoters: 10473 },
  { code: 946, name: 'Kapkugerwet', constituencyCode: 190, registeredVoters: 17635 },
  { code: 947, name: 'Kipchebor', constituencyCode: 190, registeredVoters: 16520 },
  { code: 948, name: 'Kipchimchim', constituencyCode: 190, registeredVoters: 7969 },
  { code: 949, name: 'Kapsaos', constituencyCode: 190, registeredVoters: 16310 },
  { code: 950, name: 'Kisiara', constituencyCode: 191, registeredVoters: 12486 },
  { code: 951, name: 'Tebesonik', constituencyCode: 191, registeredVoters: 11471 },
  { code: 952, name: 'Cheboin', constituencyCode: 191, registeredVoters: 13297 },
  { code: 953, name: 'Chemosot', constituencyCode: 191, registeredVoters: 16344 },
  { code: 954, name: 'Litein', constituencyCode: 191, registeredVoters: 15858 },
  { code: 955, name: 'Cheplanget', constituencyCode: 191, registeredVoters: 13560 },
  { code: 956, name: 'Kapkatet', constituencyCode: 191, registeredVoters: 12304 },
  { code: 957, name: 'Waldai', constituencyCode: 192, registeredVoters: 20119 },
  { code: 958, name: 'Kabianga', constituencyCode: 192, registeredVoters: 21052 },
  { code: 959, name: 'Cheptororiet/Seretut', constituencyCode: 192, registeredVoters: 11964 },
  { code: 960, name: 'Chaik', constituencyCode: 192, registeredVoters: 10584 },
  { code: 961, name: 'Kapsuser', constituencyCode: 192, registeredVoters: 11456 },
  { code: 962, name: 'Sigowet', constituencyCode: 193, registeredVoters: 18986 },
  { code: 963, name: 'Kaplelartet', constituencyCode: 193, registeredVoters: 16262 },
  { code: 964, name: 'Soliat', constituencyCode: 193, registeredVoters: 9682 },
  { code: 965, name: 'Soin', constituencyCode: 193, registeredVoters: 10979 },
]

async function main() {
  console.log('Seeding Kericho County (constituencies and wards)...\n')

  // 1. Upsert Kericho County
  await prisma.county.upsert({
    where: { countyCode: KERICHO_COUNTY_CODE },
    update: { countyName: 'Kericho' },
    create: {
      countyCode: KERICHO_COUNTY_CODE,
      countyName: 'Kericho',
    },
  })
  console.log('✓ Kericho County (35)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: KERICHO_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: KERICHO_COUNTY_CODE,
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

  console.log('\n✅ Kericho County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Kericho:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
