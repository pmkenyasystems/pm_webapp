import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const TRANS_NZOIA_COUNTY_CODE = 26

const constituencies = [
  { code: 136, name: 'Kwanza' },
  { code: 137, name: 'Endebess' },
  { code: 138, name: 'Saboti' },
  { code: 139, name: 'Kiminini' },
  { code: 140, name: 'Cherangany' },
]

const wards = [
  { code: 676, name: 'Kapomboi', constituencyCode: 136, registeredVoters: 21873 },
  { code: 677, name: 'Kwanza', constituencyCode: 136, registeredVoters: 21487 },
  { code: 678, name: 'Keiyo', constituencyCode: 136, registeredVoters: 14969 },
  { code: 679, name: 'Bidii', constituencyCode: 136, registeredVoters: 17510 },
  { code: 680, name: 'Chepchoina', constituencyCode: 137, registeredVoters: 19068 },
  { code: 681, name: 'Endebess', constituencyCode: 137, registeredVoters: 15467 },
  { code: 682, name: 'Matumbei', constituencyCode: 137, registeredVoters: 16153 },
  { code: 683, name: 'Kinyoro', constituencyCode: 138, registeredVoters: 17994 },
  { code: 684, name: 'Matisi', constituencyCode: 138, registeredVoters: 26038 },
  { code: 685, name: 'Tuwani', constituencyCode: 138, registeredVoters: 20232 },
  { code: 686, name: 'Saboti', constituencyCode: 138, registeredVoters: 14202 },
  { code: 687, name: 'Machewa', constituencyCode: 138, registeredVoters: 8918 },
  { code: 688, name: 'Kiminini', constituencyCode: 139, registeredVoters: 17302 },
  { code: 689, name: 'Waitaluk', constituencyCode: 139, registeredVoters: 18759 },
  { code: 690, name: 'Sirende', constituencyCode: 139, registeredVoters: 12311 },
  { code: 691, name: 'Hospital', constituencyCode: 139, registeredVoters: 14565 },
  { code: 692, name: 'Sikhendu', constituencyCode: 139, registeredVoters: 11573 },
  { code: 693, name: 'Nabiswa', constituencyCode: 139, registeredVoters: 18730 },
  { code: 694, name: 'Sinyerere', constituencyCode: 140, registeredVoters: 11603 },
  { code: 695, name: 'Makutano', constituencyCode: 140, registeredVoters: 9318 },
  { code: 696, name: 'Kaplamai', constituencyCode: 140, registeredVoters: 13319 },
  { code: 697, name: 'Motosiet', constituencyCode: 140, registeredVoters: 15528 },
  { code: 698, name: 'Cherangany/Suwerwa', constituencyCode: 140, registeredVoters: 16734 },
  { code: 699, name: 'Chepsiro/Kiptoror', constituencyCode: 140, registeredVoters: 11725 },
  { code: 700, name: 'Sitatunga', constituencyCode: 140, registeredVoters: 13603 },
]

async function main() {
  console.log('Seeding Trans-Nzoia County (constituencies and wards)...\n')

  // 1. Upsert Trans-Nzoia County
  await prisma.county.upsert({
    where: { countyCode: TRANS_NZOIA_COUNTY_CODE },
    update: { countyName: 'Trans-Nzoia' },
    create: {
      countyCode: TRANS_NZOIA_COUNTY_CODE,
      countyName: 'Trans-Nzoia',
    },
  })
  console.log('✓ Trans-Nzoia County (26)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: TRANS_NZOIA_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: TRANS_NZOIA_COUNTY_CODE,
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

  console.log('\n✅ Trans-Nzoia County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Trans-Nzoia:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
