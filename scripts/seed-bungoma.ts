import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const BUNGOMA_COUNTY_CODE = 39

const constituencies = [
  { code: 216, name: 'Mt. Elgon' },
  { code: 217, name: 'Sirisia' },
  { code: 218, name: 'Kabuchai' },
  { code: 219, name: 'Bumula' },
  { code: 220, name: 'Kanduyi' },
  { code: 221, name: 'Webuye East' },
  { code: 222, name: 'Webuye West' },
  { code: 223, name: 'Kimilili' },
  { code: 224, name: 'Tongaren' },
]

const wards = [
  { code: 1076, name: 'Cheptais', constituencyCode: 216, registeredVoters: 13342 },
  { code: 1077, name: 'Chesikaki', constituencyCode: 216, registeredVoters: 11375 },
  { code: 1078, name: 'Chepyuk', constituencyCode: 216, registeredVoters: 11075 },
  { code: 1079, name: 'Kapkateny', constituencyCode: 216, registeredVoters: 12141 },
  { code: 1080, name: 'Kaptama', constituencyCode: 216, registeredVoters: 13714 },
  { code: 1081, name: 'Elgon', constituencyCode: 216, registeredVoters: 14512 },
  { code: 1082, name: 'Namwela', constituencyCode: 217, registeredVoters: 13686 },
  { code: 1083, name: 'Malakisi/South Kulisiru', constituencyCode: 217, registeredVoters: 17728 },
  { code: 1084, name: 'Lwandanyi', constituencyCode: 217, registeredVoters: 17303 },
  { code: 1085, name: 'Kabuchai/Chwele', constituencyCode: 218, registeredVoters: 18288 },
  { code: 1086, name: 'West Nalondo', constituencyCode: 218, registeredVoters: 16198 },
  { code: 1087, name: 'Bwake/Luuya', constituencyCode: 218, registeredVoters: 15366 },
  { code: 1088, name: 'Mukuyuni', constituencyCode: 218, registeredVoters: 17369 },
  { code: 1089, name: 'South Bukusu', constituencyCode: 219, registeredVoters: 11587 },
  { code: 1090, name: 'Bumula', constituencyCode: 219, registeredVoters: 13425 },
  { code: 1091, name: 'Khasoko', constituencyCode: 219, registeredVoters: 9270 },
  { code: 1092, name: 'Kabula', constituencyCode: 219, registeredVoters: 9817 },
  { code: 1093, name: 'Kimaeti', constituencyCode: 219, registeredVoters: 15546 },
  { code: 1094, name: 'West Bukusu', constituencyCode: 219, registeredVoters: 9769 },
  { code: 1095, name: 'Siboti', constituencyCode: 219, registeredVoters: 12633 },
  { code: 1096, name: 'Bukembe West', constituencyCode: 220, registeredVoters: 10831 },
  { code: 1097, name: 'Bukembe East', constituencyCode: 220, registeredVoters: 13035 },
  { code: 1098, name: 'Township', constituencyCode: 220, registeredVoters: 17919 },
  { code: 1099, name: 'Khalaba', constituencyCode: 220, registeredVoters: 14167 },
  { code: 1100, name: 'Musikoma', constituencyCode: 220, registeredVoters: 15826 },
  { code: 1101, name: "East Sang'alo", constituencyCode: 220, registeredVoters: 15555 },
  { code: 1102, name: 'Marakaru/Tuuti', constituencyCode: 220, registeredVoters: 16191 },
  { code: 1103, name: "West Sang'alo", constituencyCode: 220, registeredVoters: 14809 },
  { code: 1104, name: 'Mihuu', constituencyCode: 221, registeredVoters: 17438 },
  { code: 1105, name: 'Ndivisi', constituencyCode: 221, registeredVoters: 17755 },
  { code: 1106, name: 'Maraka', constituencyCode: 221, registeredVoters: 13757 },
  { code: 1107, name: 'Misikhu', constituencyCode: 222, registeredVoters: 14118 },
  { code: 1108, name: 'Sitikho', constituencyCode: 222, registeredVoters: 12540 },
  { code: 1109, name: 'Matulo', constituencyCode: 222, registeredVoters: 16304 },
  { code: 1110, name: 'Bokoli', constituencyCode: 222, registeredVoters: 15670 },
  { code: 1111, name: 'Kibingei', constituencyCode: 223, registeredVoters: 15664 },
  { code: 1112, name: 'Kimilili', constituencyCode: 223, registeredVoters: 19062 },
  { code: 1113, name: 'Maeni', constituencyCode: 223, registeredVoters: 11452 },
  { code: 1114, name: 'Kamukuywa', constituencyCode: 223, registeredVoters: 15409 },
  { code: 1115, name: 'Mbakalo', constituencyCode: 224, registeredVoters: 13311 },
  { code: 1116, name: 'Naitiri/Kabuyefwe', constituencyCode: 224, registeredVoters: 16232 },
  { code: 1117, name: 'Milima', constituencyCode: 224, registeredVoters: 15700 },
  { code: 1118, name: 'Ndalu/Tabani', constituencyCode: 224, registeredVoters: 11250 },
  { code: 1119, name: 'Tongaren', constituencyCode: 224, registeredVoters: 15124 },
  { code: 1120, name: 'Soysambu/Mitua', constituencyCode: 224, registeredVoters: 13335 },
]

async function main() {
  console.log('Seeding Bungoma County (constituencies and wards)...\n')

  // 1. Upsert Bungoma County
  await prisma.county.upsert({
    where: { countyCode: BUNGOMA_COUNTY_CODE },
    update: { countyName: 'Bungoma' },
    create: {
      countyCode: BUNGOMA_COUNTY_CODE,
      countyName: 'Bungoma',
    },
  })
  console.log('✓ Bungoma County (39)')

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: BUNGOMA_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: BUNGOMA_COUNTY_CODE,
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

  console.log('\n✅ Bungoma County data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding Bungoma:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
