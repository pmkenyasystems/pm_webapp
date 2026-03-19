import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const NAKURU_COUNTY_CODE = 32

const constituencies = [
  { code: 166, name: 'Molo' },
  { code: 167, name: 'Njoro' },
  { code: 168, name: 'Naivasha' },
  { code: 169, name: 'Gilgil' },
  { code: 170, name: 'Kuresoi South' },
  { code: 171, name: 'Kuresoi North' },
  { code: 172, name: 'Subukia' },
  { code: 173, name: 'Rongai' },
  { code: 174, name: 'Bahati' },
  { code: 175, name: 'Nakuru Town West' },
  { code: 176, name: 'Nakuru Town East' },
]

const wards = [
  { code: 826, name: 'Mariashoni', constituencyCode: 166, registeredVoters: 9669 },
  { code: 827, name: 'Elburgon', constituencyCode: 166, registeredVoters: 24416 },
  { code: 828, name: 'Turi', constituencyCode: 166, registeredVoters: 15172 },
  { code: 829, name: 'Molo', constituencyCode: 166, registeredVoters: 27770 },
  { code: 830, name: 'Mau Narok', constituencyCode: 167, registeredVoters: 22346 },
  { code: 831, name: 'Mauche', constituencyCode: 167, registeredVoters: 17605 },
  { code: 832, name: 'Kihingo', constituencyCode: 167, registeredVoters: 10237 },
  { code: 833, name: 'Nesuit', constituencyCode: 167, registeredVoters: null },
  { code: 834, name: 'Lare', constituencyCode: 167, registeredVoters: null },
  { code: 835, name: 'Njoro', constituencyCode: 167, registeredVoters: null },
  { code: 836, name: 'Biashara', constituencyCode: 168, registeredVoters: null },
  { code: 837, name: 'Hellsgate', constituencyCode: 168, registeredVoters: null },
  { code: 838, name: 'Lake View', constituencyCode: 168, registeredVoters: null },
  { code: 839, name: 'Mai Mahiu', constituencyCode: 168, registeredVoters: null },
  { code: 840, name: 'Maeilla', constituencyCode: 168, registeredVoters: null },
  { code: 841, name: 'Olkaria', constituencyCode: 168, registeredVoters: null },
  { code: 842, name: 'Naivasha East', constituencyCode: 168, registeredVoters: null },
  { code: 843, name: 'Viwandani', constituencyCode: 168, registeredVoters: null },
  { code: 844, name: 'Gilgil', constituencyCode: 169, registeredVoters: null },
  { code: 845, name: 'Elementaita', constituencyCode: 169, registeredVoters: null },
  { code: 846, name: 'Mbaruk/Eburu', constituencyCode: 169, registeredVoters: null },
  { code: 847, name: 'Malewa West', constituencyCode: 169, registeredVoters: null },
  { code: 848, name: 'Murindati', constituencyCode: 169, registeredVoters: null },
  { code: 849, name: 'Amalo', constituencyCode: 170, registeredVoters: null },
  { code: 850, name: 'Keringet', constituencyCode: 170, registeredVoters: null },
  { code: 851, name: 'Kiptagich', constituencyCode: 170, registeredVoters: null },
  { code: 852, name: 'Tinet', constituencyCode: 170, registeredVoters: null },
  { code: 853, name: 'Kiptororo', constituencyCode: 171, registeredVoters: null },
  { code: 854, name: 'Nyota', constituencyCode: 171, registeredVoters: null },
  { code: 855, name: 'Sirikwa', constituencyCode: 171, registeredVoters: null },
  { code: 856, name: 'Kamara', constituencyCode: 171, registeredVoters: null },
  { code: 857, name: 'Subukia', constituencyCode: 172, registeredVoters: null },
  { code: 858, name: 'Waseges', constituencyCode: 172, registeredVoters: null },
  { code: 859, name: 'Kabazi', constituencyCode: 172, registeredVoters: null },
  { code: 860, name: 'Menengai West', constituencyCode: 173, registeredVoters: null },
  { code: 861, name: 'Soin', constituencyCode: 173, registeredVoters: null },
  { code: 862, name: 'Visoi', constituencyCode: 173, registeredVoters: null },
  { code: 863, name: 'Mosop', constituencyCode: 173, registeredVoters: null },
  { code: 864, name: 'Solai', constituencyCode: 173, registeredVoters: null },
  { code: 865, name: 'Dundori', constituencyCode: 174, registeredVoters: null },
  { code: 866, name: 'Kabatini', constituencyCode: 174, registeredVoters: null },
  { code: 867, name: 'Kiamaina', constituencyCode: 174, registeredVoters: null },
  { code: 868, name: 'Lanet/Umoja', constituencyCode: 174, registeredVoters: null },
  { code: 869, name: 'Bahati', constituencyCode: 174, registeredVoters: null },
  { code: 870, name: 'Barut', constituencyCode: 175, registeredVoters: 6699 },
  { code: 871, name: 'London', constituencyCode: 175, registeredVoters: 22421 },
  { code: 872, name: 'Kaptembwo', constituencyCode: 175, registeredVoters: 37748 },
  { code: 873, name: 'Kapkures', constituencyCode: 175, registeredVoters: 10590 },
  { code: 874, name: 'Rhoda', constituencyCode: 175, registeredVoters: 14108 },
  { code: 875, name: 'Shaabab', constituencyCode: 175, registeredVoters: 20561 },
  { code: 876, name: 'Biashara', constituencyCode: 176, registeredVoters: null },
  { code: 877, name: 'Kivumbini', constituencyCode: 176, registeredVoters: null },
  { code: 878, name: 'Flamingo', constituencyCode: 176, registeredVoters: null },
  { code: 879, name: 'Menengai', constituencyCode: 176, registeredVoters: null },
  { code: 880, name: 'Nakuru East', constituencyCode: 176, registeredVoters: null },
]

async function main() {
  console.log('Seeding Nakuru County (constituencies and wards)...\n')

  // 1. Upsert Nakuru County
  await prisma.county.upsert({
    where: { countyCode: NAKURU_COUNTY_CODE },
    update: { countyName: 'Nakuru' },
    create: {
      countyCode: NAKURU_COUNTY_CODE,
      countyName: 'Nakuru',
    },
  })
  console.log('✓ Nakuru County (32)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: NAKURU_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: NAKURU_COUNTY_CODE,
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

  console.log('\n✅ Nakuru County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Nakuru:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
