import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const KAJIADO_COUNTY_CODE = 34

const constituencies = [
  { code: 183, name: 'Kajiado North' },
  { code: 184, name: 'Kajiado Central' },
  { code: 185, name: 'Kajiado East' },
  { code: 186, name: 'Kajiado West' },
  { code: 187, name: 'Kajiado South' },
]

const wards = [
  { code: 911, name: 'Olkeri', constituencyCode: 183, registeredVoters: 31549 },
  { code: 912, name: 'Ongata Rongai', constituencyCode: 183, registeredVoters: 27576 },
  { code: 913, name: 'Nkaimurunya', constituencyCode: 183, registeredVoters: 33207 },
  { code: 914, name: 'Oloolua', constituencyCode: 183, registeredVoters: 19810 },
  { code: 915, name: 'Ngong', constituencyCode: 183, registeredVoters: 22738 },
  { code: 916, name: 'Purko', constituencyCode: 184, registeredVoters: 4848 },
  { code: 917, name: 'Ildamat', constituencyCode: 184, registeredVoters: null },
  { code: 918, name: 'Dalalekutuk', constituencyCode: 184, registeredVoters: null },
  { code: 919, name: 'Matapato North', constituencyCode: 184, registeredVoters: null },
  { code: 920, name: 'Matapato South', constituencyCode: 184, registeredVoters: null },
  { code: 921, name: 'Kaputiei North', constituencyCode: 185, registeredVoters: null },
  { code: 922, name: 'Kitengela', constituencyCode: 185, registeredVoters: null },
  { code: 923, name: 'Oloosirkon/Sholinke', constituencyCode: 185, registeredVoters: null },
  { code: 924, name: 'Kenyawa-Poka', constituencyCode: 185, registeredVoters: null },
  { code: 925, name: 'Imaroro', constituencyCode: 185, registeredVoters: null },
  { code: 926, name: 'Keekonyokie', constituencyCode: 186, registeredVoters: null },
  { code: 927, name: 'Iloodokilani', constituencyCode: 186, registeredVoters: null },
  { code: 928, name: 'Magadi', constituencyCode: 186, registeredVoters: null },
  { code: 929, name: "Ewuaso Oonkidong'i", constituencyCode: 186, registeredVoters: null },
  { code: 930, name: 'Mosiro', constituencyCode: 186, registeredVoters: 4214 },
  { code: 931, name: 'Entonet/Lenkisim', constituencyCode: 187, registeredVoters: 12775 },
  { code: 932, name: 'Mbirikani/Eselenkei', constituencyCode: 187, registeredVoters: 10725 },
  { code: 933, name: 'Kuku', constituencyCode: 187, registeredVoters: 18515 },
  { code: 934, name: 'Rombo', constituencyCode: 187, registeredVoters: 17467 },
  { code: 935, name: 'Kimana', constituencyCode: 187, registeredVoters: 11579 },
]

async function main() {
  console.log('Seeding Kajiado County (constituencies and wards)...\n')

  // 1. Upsert Kajiado County
  await prisma.county.upsert({
    where: { countyCode: KAJIADO_COUNTY_CODE },
    update: { countyName: 'Kajiado' },
    create: {
      countyCode: KAJIADO_COUNTY_CODE,
      countyName: 'Kajiado',
    },
  })
  console.log('✓ Kajiado County (34)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: KAJIADO_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: KAJIADO_COUNTY_CODE,
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

  console.log('\n✅ Kajiado County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Kajiado:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
