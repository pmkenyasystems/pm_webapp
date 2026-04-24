import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const UASIN_GISHU_COUNTY_CODE = 27

const constituencies = [
  { code: 141, name: 'Soy' },
  { code: 142, name: 'Turbo' },
  { code: 143, name: 'Moiben' },
  { code: 144, name: 'Ainabkoi' },
  { code: 145, name: 'Kapseret' },
  { code: 146, name: 'Kesses' },
]

const wards = [
  { code: 701, name: "Moi's Bridge", constituencyCode: 141, registeredVoters: 12754 },
  { code: 702, name: 'Kapkures', constituencyCode: 141, registeredVoters: 9020 },
  { code: 703, name: 'Ziwa', constituencyCode: 141, registeredVoters: 17523 },
  { code: 704, name: 'Segero/Barsombe', constituencyCode: 141, registeredVoters: 13972 },
  { code: 705, name: 'Kipsomba', constituencyCode: 141, registeredVoters: 9928 },
  { code: 706, name: 'Soy', constituencyCode: 141, registeredVoters: 11500 },
  { code: 707, name: 'Kuinet/Kapsuswa', constituencyCode: 141, registeredVoters: 18005 },
  { code: 708, name: 'Ngenyilel', constituencyCode: 142, registeredVoters: 13131 },
  { code: 709, name: 'Tapsagoi', constituencyCode: 142, registeredVoters: 16483 },
  { code: 710, name: 'Kamagut', constituencyCode: 142, registeredVoters: 16462 },
  { code: 711, name: 'Kiplombe', constituencyCode: 142, registeredVoters: 26347 },
  { code: 712, name: 'Kapsaos', constituencyCode: 142, registeredVoters: 16119 },
  { code: 713, name: 'Huruma', constituencyCode: 142, registeredVoters: 31660 },
  { code: 714, name: 'Tembelio', constituencyCode: 143, registeredVoters: 15237 },
  { code: 715, name: 'Sergoit', constituencyCode: 143, registeredVoters: 10267 },
  { code: 716, name: 'Karuna/Meibeki', constituencyCode: 143, registeredVoters: 12979 },
  { code: 717, name: 'Moiben', constituencyCode: 143, registeredVoters: 14350 },
  { code: 718, name: 'Kimumu', constituencyCode: 143, registeredVoters: 25044 },
  { code: 719, name: 'Kapsoya', constituencyCode: 144, registeredVoters: 23578 },
  { code: 720, name: 'Kaptagat', constituencyCode: 144, registeredVoters: 19923 },
  { code: 721, name: 'Ainabkoi/Olare', constituencyCode: 144, registeredVoters: 19105 },
  { code: 722, name: 'Simat/Kapseret', constituencyCode: 145, registeredVoters: 15275 },
  { code: 723, name: 'Kipkenyo', constituencyCode: 145, registeredVoters: 15509 },
  { code: 724, name: 'Ngeria', constituencyCode: 145, registeredVoters: 11103 },
  { code: 725, name: 'Megun', constituencyCode: 145, registeredVoters: 8159 },
  { code: 726, name: 'Langas', constituencyCode: 145, registeredVoters: 24763 },
  { code: 727, name: 'Racecourse', constituencyCode: 146, registeredVoters: 20872 },
  { code: 728, name: 'Cheptiret/Kipchamo', constituencyCode: 146, registeredVoters: 16723 },
  { code: 729, name: 'Tulwet/Chuiyat', constituencyCode: 146, registeredVoters: 20134 },
  { code: 730, name: 'Tarakwa', constituencyCode: 146, registeredVoters: 20213 },
]

async function main() {
  console.log('Seeding Uasin Gishu County (constituencies and wards)...\n')

  // 1. Upsert Uasin Gishu County
  await prisma.county.upsert({
    where: { countyCode: UASIN_GISHU_COUNTY_CODE },
    update: { countyName: 'Uasin Gishu' },
    create: {
      countyCode: UASIN_GISHU_COUNTY_CODE,
      countyName: 'Uasin Gishu',
    },
  })
  console.log('✓ Uasin Gishu County (27)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: UASIN_GISHU_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: UASIN_GISHU_COUNTY_CODE,
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

  console.log('\n✅ Uasin Gishu County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Uasin Gishu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
