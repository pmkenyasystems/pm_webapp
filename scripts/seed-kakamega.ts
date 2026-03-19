import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const KAKAMEGA_COUNTY_CODE = 37

const constituencies = [
  { code: 199, name: 'Lugari' },
  { code: 200, name: 'Likuyani' },
  { code: 201, name: 'Malava' },
  { code: 202, name: 'Lurambi' },
  { code: 203, name: 'Navakholo' },
  { code: 204, name: 'Mumias West' },
  { code: 205, name: 'Mumias East' },
  { code: 206, name: 'Matungu' },
  { code: 207, name: 'Butere' },
  { code: 208, name: 'Khwisero' },
  { code: 209, name: 'Shinyalu' },
  { code: 210, name: 'Ikolomani' },
]

const wards = [
  { code: 991, name: 'Mautuma', constituencyCode: 199, registeredVoters: 13465 },
  { code: 992, name: 'Lugari', constituencyCode: 199, registeredVoters: 15331 },
  { code: 993, name: 'Lumakanda', constituencyCode: 199, registeredVoters: null },
  { code: 994, name: 'Chekalini', constituencyCode: 199, registeredVoters: null },
  { code: 995, name: 'Kivaywa', constituencyCode: 199, registeredVoters: null },
  { code: 996, name: 'Lwandeti', constituencyCode: 199, registeredVoters: null },
  { code: 997, name: 'Likuyani', constituencyCode: 200, registeredVoters: null },
  { code: 998, name: 'Sango', constituencyCode: 200, registeredVoters: null },
  { code: 999, name: 'Nzoia', constituencyCode: 200, registeredVoters: null },
  { code: 1000, name: 'Sinoko', constituencyCode: 200, registeredVoters: null },
  { code: 1001, name: 'Kongoni', constituencyCode: 200, registeredVoters: null },
  { code: 1002, name: 'West Kabras', constituencyCode: 201, registeredVoters: null },
  { code: 1003, name: 'Chemuche', constituencyCode: 201, registeredVoters: null },
  { code: 1004, name: 'East Kabras', constituencyCode: 201, registeredVoters: null },
  { code: 1005, name: 'Shirugu-Mugai', constituencyCode: 201, registeredVoters: null },
  { code: 1006, name: 'South Kabras', constituencyCode: 201, registeredVoters: null },
  { code: 1007, name: 'Butali/Chegulo', constituencyCode: 201, registeredVoters: null },
  { code: 1008, name: 'Manda-Shivanga', constituencyCode: 201, registeredVoters: null },
  { code: 1009, name: 'Butsotso East', constituencyCode: 202, registeredVoters: null },
  { code: 1010, name: 'Butsotso South', constituencyCode: 202, registeredVoters: null },
  { code: 1011, name: 'Butsotso Central', constituencyCode: 202, registeredVoters: null },
  { code: 1012, name: 'Sheywe', constituencyCode: 202, registeredVoters: null },
  { code: 1013, name: 'Mahiakalo', constituencyCode: 202, registeredVoters: null },
  { code: 1014, name: 'Shirere', constituencyCode: 202, registeredVoters: null },
  { code: 1015, name: 'Ingotse-Matioli', constituencyCode: 203, registeredVoters: null },
  { code: 1016, name: 'Shinoyi-Shikomari-Esumeyia', constituencyCode: 203, registeredVoters: null },
  { code: 1017, name: 'Bunyala West', constituencyCode: 203, registeredVoters: null },
  { code: 1018, name: 'Bunyala East', constituencyCode: 203, registeredVoters: null },
  { code: 1019, name: 'Bunyala Central', constituencyCode: 203, registeredVoters: null },
  { code: 1020, name: 'Mumias Central', constituencyCode: 204, registeredVoters: null },
  { code: 1021, name: 'Mumias North', constituencyCode: 204, registeredVoters: null },
  { code: 1022, name: 'Etenje', constituencyCode: 204, registeredVoters: null },
  { code: 1023, name: 'Musanda', constituencyCode: 204, registeredVoters: null },
  { code: 1024, name: 'Lusheya/Lubinu', constituencyCode: 205, registeredVoters: null },
  { code: 1025, name: 'Malaha/Isongo/Makunga', constituencyCode: 205, registeredVoters: null },
  { code: 1026, name: 'East Wanga', constituencyCode: 205, registeredVoters: null },
  { code: 1027, name: 'Koyonzo', constituencyCode: 206, registeredVoters: null },
  { code: 1028, name: 'Kholera', constituencyCode: 206, registeredVoters: null },
  { code: 1029, name: 'Khalaba', constituencyCode: 206, registeredVoters: null },
  { code: 1030, name: 'Mayoni', constituencyCode: 206, registeredVoters: null },
  { code: 1031, name: 'Namamali', constituencyCode: 206, registeredVoters: null },
  { code: 1032, name: 'Marama West', constituencyCode: 207, registeredVoters: null },
  { code: 1033, name: 'Marama Central', constituencyCode: 207, registeredVoters: null },
  { code: 1034, name: 'Marenyo-Shianda', constituencyCode: 207, registeredVoters: null },
  { code: 1035, name: 'Marama North', constituencyCode: 207, registeredVoters: null },
  { code: 1036, name: 'Marama South', constituencyCode: 207, registeredVoters: null },
  { code: 1037, name: 'Kisa North', constituencyCode: 208, registeredVoters: null },
  { code: 1038, name: 'Kisa East', constituencyCode: 208, registeredVoters: null },
  { code: 1039, name: 'Kisa West', constituencyCode: 208, registeredVoters: null },
  { code: 1040, name: 'Kisa Central', constituencyCode: 208, registeredVoters: null },
  { code: 1041, name: 'Isukha North', constituencyCode: 209, registeredVoters: null },
  { code: 1042, name: 'Isukha Central', constituencyCode: 209, registeredVoters: null },
  { code: 1043, name: 'Isukha South', constituencyCode: 209, registeredVoters: null },
  { code: 1044, name: 'Isukha East', constituencyCode: 209, registeredVoters: null },
  { code: 1045, name: 'Isukha West', constituencyCode: 209, registeredVoters: null },
  { code: 1046, name: 'Murhanda', constituencyCode: 209, registeredVoters: null },
  { code: 1047, name: 'Idakho South', constituencyCode: 210, registeredVoters: null },
  { code: 1048, name: 'Idakho East', constituencyCode: 210, registeredVoters: null },
  { code: 1049, name: 'Idakho North', constituencyCode: 210, registeredVoters: null },
  { code: 1050, name: 'Idakho Central', constituencyCode: 210, registeredVoters: null },
]

async function main() {
  console.log('Seeding Kakamega County (constituencies and wards)...\n')

  // 1. Upsert Kakamega County
  await prisma.county.upsert({
    where: { countyCode: KAKAMEGA_COUNTY_CODE },
    update: { countyName: 'Kakamega' },
    create: {
      countyCode: KAKAMEGA_COUNTY_CODE,
      countyName: 'Kakamega',
    },
  })
  console.log('✓ Kakamega County (37)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: KAKAMEGA_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: KAKAMEGA_COUNTY_CODE,
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

  console.log('\n✅ Kakamega County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Kakamega:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
