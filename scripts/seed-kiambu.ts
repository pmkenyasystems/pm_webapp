import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const KIAMBU_COUNTY_CODE = 22

const constituencies = [
  { code: 111, name: 'Gatundu South' },
  { code: 112, name: 'Gatundu North' },
  { code: 113, name: 'Juja' },
  { code: 114, name: 'Thika Town' },
  { code: 115, name: 'Ruiru' },
  { code: 116, name: 'Githunguri' },
  { code: 117, name: 'Kiambu' },
  { code: 118, name: 'Kiambaa' },
  { code: 119, name: 'Kabete' },
  { code: 120, name: 'Kikuyu' },
  { code: 121, name: 'Limuru' },
  { code: 122, name: 'Lari' },
]

const wards = [
  { code: 551, name: 'Kiamwangi', constituencyCode: 111, registeredVoters: 13808 },
  { code: 552, name: 'Kiganjo', constituencyCode: 111, registeredVoters: 19067 },
  { code: 553, name: 'Ndarugu', constituencyCode: 111, registeredVoters: 14486 },
  { code: 554, name: 'Ngenda', constituencyCode: 111, registeredVoters: 32499 },
  { code: 555, name: 'Gituamba', constituencyCode: 112, registeredVoters: 19246 },
  { code: 556, name: 'Githobokoni', constituencyCode: 112, registeredVoters: 15208 },
  { code: 557, name: 'Chania', constituencyCode: 112, registeredVoters: 18345 },
  { code: 558, name: "Mang'u", constituencyCode: 112, registeredVoters: 19011 },
  { code: 559, name: 'Murera', constituencyCode: 113, registeredVoters: 35502 },
  { code: 560, name: 'Theta', constituencyCode: 113, registeredVoters: 26458 },
  { code: 561, name: 'Juja', constituencyCode: 113, registeredVoters: 29191 },
  { code: 562, name: 'Witeithie', constituencyCode: 113, registeredVoters: 27222 },
  { code: 563, name: 'Kalimoni', constituencyCode: 113, registeredVoters: 16265 },
  { code: 564, name: 'Township', constituencyCode: 114, registeredVoters: 30361 },
  { code: 565, name: 'Kamenu', constituencyCode: 114, registeredVoters: 56193 },
  { code: 566, name: 'Hospital', constituencyCode: 114, registeredVoters: 40780 },
  { code: 567, name: 'Gatuanyaga', constituencyCode: 114, registeredVoters: 15249 },
  { code: 568, name: 'Ngoliba', constituencyCode: 114, registeredVoters: 13435 },
  { code: 569, name: 'Gitothua', constituencyCode: 115, registeredVoters: 20443 },
  { code: 570, name: 'Biashara', constituencyCode: 115, registeredVoters: 26904 },
  { code: 571, name: 'Gatongora', constituencyCode: 115, registeredVoters: 21304 },
  { code: 572, name: 'Kahawa Sukari', constituencyCode: 115, registeredVoters: 14037 },
  { code: 573, name: 'Kahawa Wendani', constituencyCode: 115, registeredVoters: 16211 },
  { code: 574, name: 'Kiuu', constituencyCode: 115, registeredVoters: 27624 },
  { code: 575, name: 'Mwiki', constituencyCode: 115, registeredVoters: 22238 },
  { code: 576, name: 'Mwihoko', constituencyCode: 115, registeredVoters: 23327 },
  { code: 577, name: 'Githunguri', constituencyCode: 116, registeredVoters: 25650 },
  { code: 578, name: 'Githiga', constituencyCode: 116, registeredVoters: 20776 },
  { code: 579, name: 'Ikinu', constituencyCode: 116, registeredVoters: 18524 },
  { code: 580, name: 'Komothai', constituencyCode: 116, registeredVoters: 23738 },
  { code: 581, name: 'Ngewa', constituencyCode: 116, registeredVoters: 15904 },
  { code: 582, name: "Ting'ang'a", constituencyCode: 117, registeredVoters: 17925 },
  { code: 583, name: 'Ndumberi', constituencyCode: 117, registeredVoters: 20950 },
  { code: 584, name: 'Riabai', constituencyCode: 117, registeredVoters: 22239 },
  { code: 585, name: 'Township', constituencyCode: 117, registeredVoters: 25872 },
  { code: 586, name: 'Cianda', constituencyCode: 118, registeredVoters: 14561 },
  { code: 587, name: 'Karuri', constituencyCode: 118, registeredVoters: 24984 },
  { code: 588, name: 'Ndenderu', constituencyCode: 118, registeredVoters: 23356 },
  { code: 589, name: 'Muchatha', constituencyCode: 118, registeredVoters: 21638 },
  { code: 590, name: 'Kihara', constituencyCode: 118, registeredVoters: 19729 },
  { code: 591, name: 'Gitaru', constituencyCode: 119, registeredVoters: 17465 },
  { code: 592, name: 'Muguga', constituencyCode: 119, registeredVoters: 19057 },
  { code: 593, name: 'Nyathuna', constituencyCode: 119, registeredVoters: 16220 },
  { code: 594, name: 'Kabete', constituencyCode: 119, registeredVoters: 21992 },
  { code: 595, name: 'Uthiru', constituencyCode: 119, registeredVoters: 17041 },
  { code: 596, name: 'Karai', constituencyCode: 120, registeredVoters: 17867 },
  { code: 597, name: 'Nachu', constituencyCode: 120, registeredVoters: 17440 },
  { code: 598, name: 'Sigona', constituencyCode: 120, registeredVoters: 21291 },
  { code: 599, name: 'Kikuyu', constituencyCode: 120, registeredVoters: 23541 },
  { code: 600, name: 'Kinoo', constituencyCode: 120, registeredVoters: 18619 },
  { code: 601, name: 'Bibirioni', constituencyCode: 121, registeredVoters: 15310 },
  { code: 602, name: 'Limuru Central', constituencyCode: 121, registeredVoters: 18728 },
  { code: 603, name: 'Ndeiya', constituencyCode: 121, registeredVoters: 16692 },
  { code: 604, name: 'Limuru East', constituencyCode: 121, registeredVoters: 20854 },
  { code: 605, name: 'Ngecha Tigoni', constituencyCode: 121, registeredVoters: 21435 },
  { code: 606, name: 'Kinale', constituencyCode: 122, registeredVoters: 15225 },
  { code: 607, name: 'Kijabe', constituencyCode: 122, registeredVoters: 17998 },
  { code: 608, name: 'Nyanduma', constituencyCode: 122, registeredVoters: 17736 },
  { code: 609, name: 'Kamburu', constituencyCode: 122, registeredVoters: 15813 },
  { code: 610, name: 'Lari/Kirenga', constituencyCode: 122, registeredVoters: 20381 },
]

async function main() {
  console.log('Seeding Kiambu County (constituencies and wards)...\n')

  // 1. Upsert Kiambu County
  await prisma.county.upsert({
    where: { countyCode: KIAMBU_COUNTY_CODE },
    update: { countyName: 'Kiambu' },
    create: {
      countyCode: KIAMBU_COUNTY_CODE,
      countyName: 'Kiambu',
    },
  })
  console.log('✓ Kiambu County (22)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: KIAMBU_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: KIAMBU_COUNTY_CODE,
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

  console.log('\n✅ Kiambu County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Kiambu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
