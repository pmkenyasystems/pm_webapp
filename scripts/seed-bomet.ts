import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const BOMET_COUNTY_CODE = 36

const constituencies = [
  { code: 194, name: 'Sotik' },
  { code: 195, name: 'Chepalungu' },
  { code: 196, name: 'Bomet East' },
  { code: 197, name: 'Bomet Central' },
  { code: 198, name: 'Konoin' },
]

const wards = [
  { code: 966, name: 'Ndanai/Abosi', constituencyCode: 194, registeredVoters: 17049 },
  { code: 967, name: 'Chemagel', constituencyCode: 194, registeredVoters: 18870 },
  { code: 968, name: 'Kipsonoi', constituencyCode: 194, registeredVoters: 17736 },
  { code: 969, name: 'Kapletundo', constituencyCode: 194, registeredVoters: 20992 },
  { code: 970, name: 'Rongena/Manaret', constituencyCode: 194, registeredVoters: 12034 },
  { code: 971, name: "Kong'asis", constituencyCode: 195, registeredVoters: 14005 },
  { code: 972, name: 'Nyangores', constituencyCode: 195, registeredVoters: 19286 },
  { code: 973, name: 'Sigor', constituencyCode: 195, registeredVoters: 15849 },
  { code: 974, name: 'Chebunyo', constituencyCode: 195, registeredVoters: 15982 },
  { code: 975, name: 'Siongiroi', constituencyCode: 195, registeredVoters: 15018 },
  { code: 976, name: 'Merigi', constituencyCode: 196, registeredVoters: 14673 },
  { code: 977, name: 'Kembu', constituencyCode: 196, registeredVoters: 12901 },
  { code: 978, name: 'Longisa', constituencyCode: 196, registeredVoters: 14576 },
  { code: 979, name: 'Kipreres', constituencyCode: 196, registeredVoters: 12101 },
  { code: 980, name: 'Chemaner', constituencyCode: 196, registeredVoters: 9389 },
  { code: 981, name: 'Silibwet Township', constituencyCode: 197, registeredVoters: 17882 },
  { code: 982, name: 'Ndaraweta', constituencyCode: 197, registeredVoters: 12233 },
  { code: 983, name: 'Singorwet', constituencyCode: 197, registeredVoters: 12483 },
  { code: 984, name: 'Chesoen', constituencyCode: 197, registeredVoters: 17516 },
  { code: 985, name: 'Mutarakwa', constituencyCode: 197, registeredVoters: 11295 },
  { code: 986, name: 'Chepchabas', constituencyCode: 198, registeredVoters: 9316 },
  { code: 987, name: 'Kimulot', constituencyCode: 198, registeredVoters: 12321 },
  { code: 988, name: 'Mogogosiek', constituencyCode: 198, registeredVoters: 18069 },
  { code: 989, name: 'Boito', constituencyCode: 198, registeredVoters: 17019 },
  { code: 990, name: 'Embomos', constituencyCode: 198, registeredVoters: null },
]

async function main() {
  console.log('Seeding Bomet County (constituencies and wards)...\n')

  // 1. Upsert Bomet County
  await prisma.county.upsert({
    where: { countyCode: BOMET_COUNTY_CODE },
    update: { countyName: 'Bomet' },
    create: {
      countyCode: BOMET_COUNTY_CODE,
      countyName: 'Bomet',
    },
  })
  console.log('✓ Bomet County (36)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: BOMET_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: BOMET_COUNTY_CODE,
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

  console.log('\n✅ Bomet County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Bomet:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
