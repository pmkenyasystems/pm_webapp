import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const MURANGA_COUNTY_CODE = 21

const constituencies = [
  { code: 104, name: 'Kangema' },
  { code: 105, name: 'Mathioya' },
  { code: 106, name: 'Kiharu' },
  { code: 107, name: 'Kigumo' },
  { code: 108, name: 'Maragwa' },
  { code: 109, name: 'Kandara' },
  { code: 110, name: 'Gatanga' },
]

const wards = [
  { code: 516, name: 'Kanyenya-ini', constituencyCode: 104, registeredVoters: 15567 },
  { code: 517, name: 'Muguru', constituencyCode: 104, registeredVoters: 23583 },
  { code: 518, name: 'Rwathia', constituencyCode: 104, registeredVoters: 12852 },
  { code: 519, name: 'Gitugi', constituencyCode: 105, registeredVoters: 20421 },
  { code: 520, name: 'Kiru', constituencyCode: 105, registeredVoters: 22212 },
  { code: 521, name: 'Kamacharia', constituencyCode: 105, registeredVoters: 15469 },
  { code: 522, name: 'Wangu', constituencyCode: 106, registeredVoters: 17355 },
  { code: 523, name: 'Mugoiri', constituencyCode: 106, registeredVoters: 19001 },
  { code: 524, name: 'Mbiri', constituencyCode: 106, registeredVoters: 20473 },
  { code: 525, name: 'Township', constituencyCode: 106, registeredVoters: 24462 },
  { code: 526, name: 'Murarandia', constituencyCode: 106, registeredVoters: 17998 },
  { code: 527, name: 'Gaturi', constituencyCode: 106, registeredVoters: 20100 },
  { code: 528, name: 'Kahumbu', constituencyCode: 107, registeredVoters: 11652 },
  { code: 529, name: 'Muthithi', constituencyCode: 107, registeredVoters: 14559 },
  { code: 530, name: 'Kigumo', constituencyCode: 107, registeredVoters: 15527 },
  { code: 531, name: 'Kangari', constituencyCode: 107, registeredVoters: 22170 },
  { code: 532, name: 'Kinyona', constituencyCode: 107, registeredVoters: 18701 },
  { code: 533, name: 'Kimorori/Wempa', constituencyCode: 108, registeredVoters: 26433 },
  { code: 534, name: 'Makuyu', constituencyCode: 108, registeredVoters: 16588 },
  { code: 535, name: 'Kambiti', constituencyCode: 108, registeredVoters: 13186 },
  { code: 536, name: 'Kamahuha', constituencyCode: 108, registeredVoters: 16236 },
  { code: 537, name: 'Ichagaki', constituencyCode: 108, registeredVoters: 13524 },
  { code: 538, name: 'Nginda', constituencyCode: 108, registeredVoters: 16416 },
  { code: 539, name: "Ng'araria", constituencyCode: 109, registeredVoters: 13776 },
  { code: 540, name: 'Muruka', constituencyCode: 109, registeredVoters: 16240 },
  { code: 541, name: 'Kagundu-ini', constituencyCode: 109, registeredVoters: 19129 },
  { code: 542, name: 'Gaichanjiru', constituencyCode: 109, registeredVoters: 16280 },
  { code: 543, name: 'Ithiru', constituencyCode: 109, registeredVoters: 18335 },
  { code: 544, name: 'Ruchu', constituencyCode: 109, registeredVoters: 21388 },
  { code: 545, name: 'Ithanga', constituencyCode: 110, registeredVoters: 11310 },
  { code: 546, name: 'Kakuzi/Mitubiri', constituencyCode: 110, registeredVoters: 15291 },
  { code: 547, name: 'Mugumo-ini', constituencyCode: 110, registeredVoters: 14252 },
  { code: 548, name: 'Kihumbu-ini', constituencyCode: 110, registeredVoters: 17142 },
  { code: 549, name: 'Gatanga', constituencyCode: 110, registeredVoters: 16842 },
  { code: 550, name: 'Kariara', constituencyCode: 110, registeredVoters: 26459 },
]

async function main() {
  console.log("Seeding Murang'a County (constituencies and wards)...\n")

  // 1. Upsert Murang'a County
  await prisma.county.upsert({
    where: { countyCode: MURANGA_COUNTY_CODE },
    update: { countyName: "Murang'a" },
    create: {
      countyCode: MURANGA_COUNTY_CODE,
      countyName: "Murang'a",
    },
  })
  console.log("✓ Murang'a County (21)")

  // 2. Upsert constituencies
  for (const c of constituencies) {
    await prisma.constituency.upsert({
      where: { constituencyCode: c.code },
      update: {
        constituencyName: c.name,
        countyCode: MURANGA_COUNTY_CODE,
      },
      create: {
        constituencyCode: c.code,
        constituencyName: c.name,
        countyCode: MURANGA_COUNTY_CODE,
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

  console.log("\n✅ Murang'a County data seeded successfully!")
}

main()
  .catch((e) => {
    console.error("Error seeding Murang'a:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
