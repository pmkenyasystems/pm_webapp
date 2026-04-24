import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const NAROK_COUNTY_CODE = 33

const constituencies = [
  { code: 177, name: 'Kilgoris' },
  { code: 178, name: 'Emurua Dikirr' },
  { code: 179, name: 'Narok North' },
  { code: 180, name: 'Narok East' },
  { code: 181, name: 'Narok South' },
  { code: 182, name: 'Narok West' },
]

const wards = [
  { code: 881, name: 'Kilgoris Central', constituencyCode: 177, registeredVoters: null },
  { code: 882, name: 'Keyian', constituencyCode: 177, registeredVoters: null },
  { code: 883, name: 'Angata Barikoi', constituencyCode: 177, registeredVoters: null },
  { code: 884, name: 'Shankoe', constituencyCode: 177, registeredVoters: null },
  { code: 885, name: 'Kimintet', constituencyCode: 177, registeredVoters: null },
  { code: 886, name: 'Lolgorian', constituencyCode: 177, registeredVoters: null },
  { code: 887, name: 'Ilkerin', constituencyCode: 178, registeredVoters: null },
  { code: 888, name: 'Ololmasani', constituencyCode: 178, registeredVoters: null },
  { code: 889, name: 'Mogondo', constituencyCode: 178, registeredVoters: null },
  { code: 890, name: 'Kapsasian', constituencyCode: 178, registeredVoters: null },
  { code: 891, name: 'Olpusimoru', constituencyCode: 179, registeredVoters: 9260 },
  { code: 892, name: 'Olokurto', constituencyCode: 179, registeredVoters: 11038 },
  { code: 893, name: 'Narok Town', constituencyCode: 179, registeredVoters: 29452 },
  { code: 894, name: 'Nkareta', constituencyCode: 179, registeredVoters: 9611 },
  { code: 895, name: 'Olorropil', constituencyCode: 179, registeredVoters: 13829 },
  { code: 896, name: 'Melili', constituencyCode: 179, registeredVoters: 15475 },
  { code: 897, name: 'Mosiro', constituencyCode: 180, registeredVoters: null },
  { code: 898, name: 'Ildamat', constituencyCode: 180, registeredVoters: null },
  { code: 899, name: 'Keekonyokie', constituencyCode: 180, registeredVoters: null },
  { code: 900, name: 'Suswa', constituencyCode: 180, registeredVoters: null },
  { code: 901, name: 'Majimoto/Naroosura', constituencyCode: 181, registeredVoters: null },
  { code: 902, name: "Ololulung'a", constituencyCode: 181, registeredVoters: null },
  { code: 903, name: 'Melelo', constituencyCode: 181, registeredVoters: null },
  { code: 904, name: 'Loita', constituencyCode: 181, registeredVoters: null },
  { code: 905, name: 'Sogoo', constituencyCode: 181, registeredVoters: null },
  { code: 906, name: 'Sagamian', constituencyCode: 181, registeredVoters: null },
  { code: 907, name: 'Ilmotiok', constituencyCode: 182, registeredVoters: null },
  { code: 908, name: 'Mara', constituencyCode: 182, registeredVoters: null },
  { code: 909, name: 'Siana', constituencyCode: 182, registeredVoters: null },
  { code: 910, name: 'Naikarra', constituencyCode: 182, registeredVoters: null },
]

async function main() {
  console.log('Seeding Narok County (constituencies and wards)...\n')

  // 1. Upsert Narok County
  await prisma.county.upsert({
    where: { countyCode: NAROK_COUNTY_CODE },
    update: { countyName: 'Narok' },
    create: {
      countyCode: NAROK_COUNTY_CODE,
      countyName: 'Narok',
    },
  })
  console.log('✓ Narok County (33)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: NAROK_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: NAROK_COUNTY_CODE,
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

  console.log('\n✅ Narok County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Narok:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
