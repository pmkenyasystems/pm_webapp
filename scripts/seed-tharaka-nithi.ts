import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const THARAKA_NITHI_COUNTY_CODE = 13

const constituencies = [
  { code: 60, name: 'Maara' },
  { code: 61, name: "Chuka/Igambang'ombe" },
  { code: 62, name: 'Tharaka' },
]

const wards = [
  { code: 296, name: 'Mitheru', constituencyCode: 60, registeredVoters: 10862 },
  { code: 297, name: 'Muthambi', constituencyCode: 60, registeredVoters: 12753 },
  { code: 298, name: 'Mwimbi', constituencyCode: 60, registeredVoters: 15145 },
  { code: 299, name: 'Ganga', constituencyCode: 60, registeredVoters: 12691 },
  { code: 300, name: 'Chogoria', constituencyCode: 60, registeredVoters: 21797 },
  { code: 301, name: 'Mariani', constituencyCode: 61, registeredVoters: 10573 },
  { code: 302, name: 'Karingani', constituencyCode: 61, registeredVoters: 19043 },
  { code: 303, name: 'Magumoni', constituencyCode: 61, registeredVoters: 22846 },
  { code: 304, name: 'Mugwe', constituencyCode: 61, registeredVoters: 15913 },
  { code: 305, name: "Igambang'ombe", constituencyCode: 61, registeredVoters: 16299 },
  { code: 306, name: 'Gatunga', constituencyCode: 62, registeredVoters: 13891 },
  { code: 307, name: 'Mukothima', constituencyCode: 62, registeredVoters: 13297 },
  { code: 308, name: 'Nkondi', constituencyCode: 62, registeredVoters: 9543 },
  { code: 309, name: 'Chiakariga', constituencyCode: 62, registeredVoters: 18715 },
  { code: 310, name: 'Marimanti', constituencyCode: 62, registeredVoters: 18564 },
]

async function main() {
  console.log('Seeding Tharaka-Nithi County (constituencies and wards)...\n')

  // 1. Upsert Tharaka-Nithi County
  await prisma.county.upsert({
    where: { countyCode: THARAKA_NITHI_COUNTY_CODE },
    update: { countyName: 'Tharaka-Nithi' },
    create: {
      countyCode: THARAKA_NITHI_COUNTY_CODE,
      countyName: 'Tharaka-Nithi',
    },
  })
  console.log('✓ Tharaka-Nithi County (13)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: THARAKA_NITHI_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: THARAKA_NITHI_COUNTY_CODE,
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

  console.log('\n✅ Tharaka-Nithi County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Tharaka-Nithi:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
