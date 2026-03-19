import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const NANDI_COUNTY_CODE = 29

const constituencies = [
  { code: 151, name: 'Tinderet' },
  { code: 152, name: 'Aldai' },
  { code: 153, name: 'Nandi Hills' },
  { code: 154, name: 'Chesumei' },
  { code: 155, name: 'Emgwen' },
  { code: 156, name: 'Mosop' },
]

const wards = [
  { code: 751, name: 'Songhor/Soba', constituencyCode: 151, registeredVoters: 13872 },
  { code: 752, name: 'Tindiret', constituencyCode: 151, registeredVoters: 11466 },
  { code: 753, name: 'Chemelil/Chemase', constituencyCode: 151, registeredVoters: 13382 },
  { code: 754, name: 'Kapsimotwo', constituencyCode: 151, registeredVoters: 10617 },
  { code: 755, name: 'Kabwareng', constituencyCode: 152, registeredVoters: 10729 },
  { code: 756, name: 'Terik', constituencyCode: 152, registeredVoters: 10503 },
  { code: 757, name: 'Kemeloi-Maraba', constituencyCode: 152, registeredVoters: 16346 },
  { code: 758, name: 'Kobujoi', constituencyCode: 152, registeredVoters: 13293 },
  { code: 759, name: 'Kaptumo-Kaboi', constituencyCode: 152, registeredVoters: 12669 },
  { code: 760, name: 'Koyo-Ndurio', constituencyCode: 152, registeredVoters: 12853 },
  { code: 761, name: 'Nandi Hills', constituencyCode: 153, registeredVoters: 18328 },
  { code: 762, name: 'Chepkunyuk', constituencyCode: 153, registeredVoters: 19848 },
  { code: 763, name: "Ol'lessos", constituencyCode: 153, registeredVoters: 11254 },
  { code: 764, name: 'Kapchorua', constituencyCode: 153, registeredVoters: 8480 },
  { code: 765, name: "Chemundu/Kapng'etuny", constituencyCode: 154, registeredVoters: 14254 },
  { code: 766, name: 'Kosirai', constituencyCode: 154, registeredVoters: 15667 },
  { code: 767, name: 'Lelmokwo/Ngechek', constituencyCode: 154, registeredVoters: 15361 },
  { code: 768, name: 'Kaptel/Kamoiywo', constituencyCode: 154, registeredVoters: 16192 },
  { code: 769, name: 'Kiptuya', constituencyCode: 154, registeredVoters: 12727 },
  { code: 770, name: 'Chepkumia', constituencyCode: 155, registeredVoters: 12254 },
  { code: 771, name: 'Kapkangani', constituencyCode: 155, registeredVoters: 15487 },
  { code: 772, name: 'Kapsabet', constituencyCode: 155, registeredVoters: 23284 },
  { code: 773, name: 'Kilibwoni', constituencyCode: 155, registeredVoters: 15915 },
  { code: 774, name: 'Chepterwai', constituencyCode: 156, registeredVoters: 11598 },
  { code: 775, name: 'Kipkaren', constituencyCode: 156, registeredVoters: 13878 },
  { code: 776, name: 'Kurgung/Surungai', constituencyCode: 156, registeredVoters: 11289 },
  { code: 777, name: 'Kabiyet', constituencyCode: 156, registeredVoters: 15584 },
  { code: 778, name: 'Ndalat', constituencyCode: 156, registeredVoters: 13814 },
  { code: 779, name: 'Kabisaga', constituencyCode: 156, registeredVoters: 11623 },
]

async function main() {
  console.log('Seeding Nandi County (constituencies and wards)...\n')

  // 1. Upsert Nandi County
  await prisma.county.upsert({
    where: { countyCode: NANDI_COUNTY_CODE },
    update: { countyName: 'Nandi' },
    create: {
      countyCode: NANDI_COUNTY_CODE,
      countyName: 'Nandi',
    },
  })
  console.log('✓ Nandi County (29)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: NANDI_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: NANDI_COUNTY_CODE,
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

  console.log('\n✅ Nandi County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Nandi:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
