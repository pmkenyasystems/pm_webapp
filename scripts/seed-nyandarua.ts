import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const NYANDARUA_COUNTY_CODE = 18

const constituencies = [
  { code: 89, name: 'Kinangop' },
  { code: 90, name: 'Kipipiri' },
  { code: 91, name: 'Ol Kalou' },
  { code: 92, name: 'Ol Jorok' },
  { code: 93, name: 'Ndaragwa' },
]

const wards = [
  { code: 441, name: 'Engineer', constituencyCode: 89, registeredVoters: 16199 },
  { code: 442, name: 'Gathara', constituencyCode: 89, registeredVoters: 18144 },
  { code: 443, name: 'North Kinangop', constituencyCode: 89, registeredVoters: 11265 },
  { code: 444, name: 'Murungaru', constituencyCode: 89, registeredVoters: 15669 },
  { code: 445, name: 'Njabini/Kiburu', constituencyCode: 89, registeredVoters: 12793 },
  { code: 446, name: 'Nyakio', constituencyCode: 89, registeredVoters: 15177 },
  { code: 447, name: 'Githabai', constituencyCode: 89, registeredVoters: 11473 },
  { code: 448, name: 'Magumu', constituencyCode: 89, registeredVoters: 14827 },
  { code: 449, name: 'Wanjohi', constituencyCode: 90, registeredVoters: 17474 },
  { code: 450, name: 'Kipipiri', constituencyCode: 90, registeredVoters: 14364 },
  { code: 451, name: 'Geta', constituencyCode: 90, registeredVoters: 11098 },
  { code: 452, name: 'Githioro', constituencyCode: 90, registeredVoters: 11692 },
  { code: 453, name: 'Karau', constituencyCode: 91, registeredVoters: 13594 },
  { code: 454, name: 'Kanjuiri Range', constituencyCode: 91, registeredVoters: 15596 },
  { code: 455, name: 'Mirangine', constituencyCode: 91, registeredVoters: 14695 },
  { code: 456, name: 'Kaimbaga', constituencyCode: 91, registeredVoters: 13540 },
  { code: 457, name: 'Rurii', constituencyCode: 91, registeredVoters: 15572 },
  { code: 458, name: 'Gathanji', constituencyCode: 92, registeredVoters: 12792 },
  { code: 459, name: 'Gatimu', constituencyCode: 92, registeredVoters: 14875 },
  { code: 460, name: 'Weru', constituencyCode: 92, registeredVoters: 18548 },
  { code: 461, name: 'Charagita', constituencyCode: 92, registeredVoters: 13932 },
  { code: 462, name: 'Leshau/Pondo', constituencyCode: 93, registeredVoters: 13842 },
  { code: 463, name: 'Kiriita', constituencyCode: 93, registeredVoters: 12977 },
  { code: 464, name: 'Central', constituencyCode: 93, registeredVoters: 18113 },
  { code: 465, name: 'Shamata', constituencyCode: 93, registeredVoters: 12914 },
]

async function main() {
  console.log('Seeding Nyandarua County (constituencies and wards)...\n')

  // 1. Upsert Nyandarua County
  await prisma.county.upsert({
    where: { countyCode: NYANDARUA_COUNTY_CODE },
    update: { countyName: 'Nyandarua' },
    create: {
      countyCode: NYANDARUA_COUNTY_CODE,
      countyName: 'Nyandarua',
    },
  })
  console.log('✓ Nyandarua County (18)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: NYANDARUA_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: NYANDARUA_COUNTY_CODE,
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

  console.log('\n✅ Nyandarua County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Nyandarua:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
