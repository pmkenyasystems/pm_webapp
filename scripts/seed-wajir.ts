import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const WAJIR_COUNTY_CODE = 8

const constituencies = [
  { code: 33, name: 'Wajir North' },
  { code: 34, name: 'Wajir East' },
  { code: 35, name: 'Tarbaj' },
  { code: 36, name: 'Wajir West' },
  { code: 37, name: 'Eldas' },
  { code: 38, name: 'Wajir South' },
]

const wards = [
  { code: 161, name: 'Gurar', constituencyCode: 33, registeredVoters: 3885 },
  { code: 162, name: 'Bute', constituencyCode: 33, registeredVoters: 3786 },
  { code: 163, name: 'Korondile', constituencyCode: 33, registeredVoters: 5317 },
  { code: 164, name: 'Malkagufu', constituencyCode: 33, registeredVoters: 4031 },
  { code: 165, name: 'Batalu', constituencyCode: 33, registeredVoters: 6364 },
  { code: 166, name: 'Danaba', constituencyCode: 33, registeredVoters: null },
  { code: 167, name: 'Godoma', constituencyCode: 33, registeredVoters: null },
  { code: 168, name: 'Wagberi', constituencyCode: 34, registeredVoters: 7353 },
  { code: 169, name: 'Township', constituencyCode: 34, registeredVoters: 10065 },
  { code: 170, name: 'Barwago', constituencyCode: 34, registeredVoters: 10302 },
  { code: 171, name: 'Khorof/Harar', constituencyCode: 34, registeredVoters: 8074 },
  { code: 172, name: 'Elben', constituencyCode: 35, registeredVoters: 3562 },
  { code: 173, name: 'Sarman', constituencyCode: 35, registeredVoters: 7416 },
  { code: 174, name: 'Tarbaj', constituencyCode: 35, registeredVoters: 9869 },
  { code: 175, name: 'Wargadud', constituencyCode: 35, registeredVoters: 4420 },
  { code: 176, name: 'Arbajahan', constituencyCode: 36, registeredVoters: 8593 },
  { code: 177, name: 'Hadado/Athibohol', constituencyCode: 36, registeredVoters: 7818 },
  { code: 178, name: 'Adamasajide', constituencyCode: 36, registeredVoters: 6541 },
  { code: 179, name: 'Ganyure/Wagalla', constituencyCode: 36, registeredVoters: 8382 },
  { code: 180, name: 'Eldas', constituencyCode: 37, registeredVoters: 4630 },
  { code: 181, name: 'Della', constituencyCode: 37, registeredVoters: 6188 },
  { code: 182, name: 'Lakoley South/Basir', constituencyCode: 37, registeredVoters: 3443 },
  { code: 183, name: 'Elnur/Tula Tula', constituencyCode: 37, registeredVoters: 9098 },
  { code: 184, name: 'Benane', constituencyCode: 38, registeredVoters: 11797 },
  { code: 185, name: 'Burder', constituencyCode: 38, registeredVoters: 4863 },
  { code: 186, name: 'Dadaja Bulla', constituencyCode: 38, registeredVoters: 5389 },
  { code: 187, name: 'Habasswein', constituencyCode: 38, registeredVoters: 11026 },
  { code: 188, name: 'Lagboghol South', constituencyCode: 38, registeredVoters: 7541 },
  { code: 189, name: 'Ibrahim Ure', constituencyCode: 38, registeredVoters: 6179 },
  { code: 190, name: 'Diif', constituencyCode: 38, registeredVoters: 11282 },
]

async function main() {
  console.log('Seeding Wajir County (constituencies and wards)...\n')

  // 1. Upsert Wajir County
  await prisma.county.upsert({
    where: { countyCode: WAJIR_COUNTY_CODE },
    update: { countyName: 'Wajir' },
    create: {
      countyCode: WAJIR_COUNTY_CODE,
      countyName: 'Wajir',
    },
  })
  console.log('✓ Wajir County (8)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: WAJIR_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: WAJIR_COUNTY_CODE,
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

  console.log('\n✅ Wajir County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Wajir:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
