import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const NYERI_COUNTY_CODE = 19

const constituencies = [
  { code: 94, name: 'Tetu' },
  { code: 95, name: 'Kieni' },
  { code: 96, name: 'Mathira' },
  { code: 97, name: 'Othaya' },
  { code: 98, name: 'Mukurweini' },
  { code: 99, name: 'Nyeri Town' },
]

const wards = [
  { code: 466, name: 'Dedan Kimanthi', constituencyCode: 94, registeredVoters: 14401 },
  { code: 467, name: 'Wamagana', constituencyCode: 94, registeredVoters: 22275 },
  { code: 468, name: 'Aguthi-Gaaki', constituencyCode: 94, registeredVoters: 18310 },
  { code: 469, name: 'Mweiga', constituencyCode: 95, registeredVoters: 12064 },
  { code: 470, name: 'Naromoru Kiamathaga', constituencyCode: 95, registeredVoters: 17731 },
  { code: 471, name: 'Mwiyogo/Endarasha', constituencyCode: 95, registeredVoters: 12691 },
  { code: 472, name: 'Mugunda', constituencyCode: 95, registeredVoters: 16080 },
  { code: 473, name: 'Gatarakwa', constituencyCode: 95, registeredVoters: 12086 },
  { code: 474, name: 'Thegu River', constituencyCode: 95, registeredVoters: 16778 },
  { code: 475, name: 'Kabaru', constituencyCode: 95, registeredVoters: 13280 },
  { code: 476, name: 'Gakawa', constituencyCode: 95, registeredVoters: 13863 },
  { code: 477, name: 'Ruguru', constituencyCode: 96, registeredVoters: 14670 },
  { code: 478, name: 'Magutu', constituencyCode: 96, registeredVoters: 13383 },
  { code: 479, name: 'Iriaini', constituencyCode: 96, registeredVoters: 18020 },
  { code: 480, name: 'Konyu', constituencyCode: 96, registeredVoters: 13428 },
  { code: 481, name: 'Kirimukuyu', constituencyCode: 96, registeredVoters: 18171 },
  { code: 482, name: 'Karatina Town', constituencyCode: 96, registeredVoters: 26820 },
  { code: 483, name: 'Mahiga', constituencyCode: 97, registeredVoters: 15138 },
  { code: 484, name: 'Iria-ini', constituencyCode: 97, registeredVoters: 19309 },
  { code: 485, name: 'Chinga', constituencyCode: 97, registeredVoters: 15143 },
  { code: 486, name: 'Karima', constituencyCode: 97, registeredVoters: 12289 },
  { code: 487, name: 'Gikondi', constituencyCode: 98, registeredVoters: 12644 },
  { code: 488, name: 'Rugi', constituencyCode: 98, registeredVoters: 13959 },
  { code: 489, name: 'Mukurwe-ini West', constituencyCode: 98, registeredVoters: 12801 },
  { code: 490, name: 'Mukurwe-ini Central', constituencyCode: 98, registeredVoters: 19130 },
  { code: 491, name: 'Kiganjo/Mathari', constituencyCode: 99, registeredVoters: 15985 },
  { code: 492, name: 'Rware', constituencyCode: 99, registeredVoters: 29246 },
  { code: 493, name: 'Gatitu/Muruguru', constituencyCode: 99, registeredVoters: 11363 },
  { code: 494, name: "Ruring'u", constituencyCode: 99, registeredVoters: 13780 },
  { code: 495, name: 'Kamakwa/Mukaro', constituencyCode: 99, registeredVoters: 16794 },
]

async function main() {
  console.log('Seeding Nyeri County (constituencies and wards)...\n')

  // 1. Upsert Nyeri County
  await prisma.county.upsert({
    where: { countyCode: NYERI_COUNTY_CODE },
    update: { countyName: 'Nyeri' },
    create: {
      countyCode: NYERI_COUNTY_CODE,
      countyName: 'Nyeri',
    },
  })
  console.log('✓ Nyeri County (19)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: NYERI_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: NYERI_COUNTY_CODE,
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

  console.log('\n✅ Nyeri County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Nyeri:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
