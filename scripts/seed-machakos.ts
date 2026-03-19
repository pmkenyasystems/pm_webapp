import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MACHAKOS_COUNTY_CODE = 16

const constituencies = [
  { code: 75, name: 'Masinga' },
  { code: 76, name: 'Yatta' },
  { code: 77, name: 'Kangundo' },
  { code: 78, name: 'Matungulu' },
  { code: 79, name: 'Kathiani' },
  { code: 80, name: 'Mavoko' },
  { code: 81, name: 'Machakos Town' },
  { code: 82, name: 'Mwala' },
]

const wards = [
  { code: 371, name: 'Kivaa', constituencyCode: 75, registeredVoters: 18277 },
  { code: 372, name: 'Masinga Central', constituencyCode: 75, registeredVoters: 18410 },
  { code: 373, name: 'Ekalakala', constituencyCode: 75, registeredVoters: 11265 },
  { code: 374, name: 'Muthesya', constituencyCode: 75, registeredVoters: 8874 },
  { code: 375, name: 'Ndithini', constituencyCode: 75, registeredVoters: 12053 },
  { code: 376, name: 'Ndalani', constituencyCode: 76, registeredVoters: 16093 },
  { code: 377, name: 'Matuu', constituencyCode: 76, registeredVoters: 16826 },
  { code: 378, name: 'Kithimani', constituencyCode: 76, registeredVoters: 19497 },
  { code: 379, name: 'Ikombe', constituencyCode: 76, registeredVoters: 18283 },
  { code: 380, name: 'Katangi', constituencyCode: 76, registeredVoters: 11698 },
  { code: 381, name: 'Kangundo North', constituencyCode: 77, registeredVoters: 14938 },
  { code: 382, name: 'Kangundo Central', constituencyCode: 77, registeredVoters: 16502 },
  { code: 383, name: 'Kangundo East', constituencyCode: 77, registeredVoters: 13340 },
  { code: 384, name: 'Kangundo West', constituencyCode: 77, registeredVoters: 16016 },
  { code: 385, name: 'Tala', constituencyCode: 78, registeredVoters: 18614 },
  { code: 386, name: 'Matungulu North', constituencyCode: 78, registeredVoters: 12504 },
  { code: 387, name: 'Matungulu East', constituencyCode: 78, registeredVoters: 12826 },
  { code: 388, name: 'Matungulu West', constituencyCode: 78, registeredVoters: 22817 },
  { code: 389, name: 'Kyeleni', constituencyCode: 78, registeredVoters: 9080 },
  { code: 390, name: 'Mitaboni', constituencyCode: 79, registeredVoters: 16756 },
  { code: 391, name: 'Kathiani Central', constituencyCode: 79, registeredVoters: 15070 },
  { code: 392, name: 'Upper Kaewa/Iveti', constituencyCode: 79, registeredVoters: 14314 },
  { code: 393, name: 'Lower Kaewa/Kaani', constituencyCode: 79, registeredVoters: 14084 },
  { code: 394, name: 'Athi River', constituencyCode: 80, registeredVoters: 44603 },
  { code: 395, name: 'Kinanie', constituencyCode: 80, registeredVoters: 14831 },
  { code: 396, name: 'Muthwani', constituencyCode: 80, registeredVoters: 24402 },
  { code: 397, name: 'Syokimau/Mulolongo', constituencyCode: 80, registeredVoters: 48327 },
  { code: 398, name: 'Kalama', constituencyCode: 81, registeredVoters: 17173 },
  { code: 399, name: 'Mua', constituencyCode: 81, registeredVoters: 15242 },
  { code: 400, name: 'Mutituni', constituencyCode: 81, registeredVoters: 14486 },
  { code: 401, name: 'Machakos Central', constituencyCode: 81, registeredVoters: 28309 },
  { code: 402, name: 'Mumbuni North', constituencyCode: 81, registeredVoters: 13778 },
  { code: 403, name: 'Muvuti/Kiima-Kimwe', constituencyCode: 81, registeredVoters: 17404 },
  { code: 404, name: 'Kola', constituencyCode: 81, registeredVoters: 10975 },
  { code: 405, name: 'Mbiuni', constituencyCode: 82, registeredVoters: 16671 },
  { code: 406, name: 'Makutano/Mwala', constituencyCode: 82, registeredVoters: 17815 },
  { code: 407, name: 'Masii', constituencyCode: 82, registeredVoters: 18523 },
  { code: 408, name: 'Muthetheni', constituencyCode: 82, registeredVoters: 12571 },
  { code: 409, name: 'Wamunyu', constituencyCode: 82, registeredVoters: 14342 },
  { code: 410, name: 'Kibauni', constituencyCode: 82, registeredVoters: 9976 },
]

async function main() {
  console.log('Seeding Machakos County (constituencies and wards)...\n')

  // 1. Upsert Machakos County
  await prisma.county.upsert({
    where: { countyCode: MACHAKOS_COUNTY_CODE },
    update: { countyName: 'Machakos' },
    create: {
      countyCode: MACHAKOS_COUNTY_CODE,
      countyName: 'Machakos',
    },
  })
  console.log('✓ Machakos County (16)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: MACHAKOS_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: MACHAKOS_COUNTY_CODE,
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

  console.log('\n✅ Machakos County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Machakos:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
