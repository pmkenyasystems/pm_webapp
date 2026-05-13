import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const membershipCategories = [
  { title: 'Ordinary Membership',      fee: 20.00,       timeline: 0 },
  { title: 'Life Membership',          fee: 20000.00,    timeline: 5 },
  { title: 'Bronze Life Membership',   fee: 50000.00,    timeline: 5 },
  { title: 'Silver Life Membership',   fee: 100000.00,   timeline: 5 },
  { title: 'Gold Life Membership',     fee: 1000000.00,  timeline: 5 },
  { title: 'Diamond Life Membership',  fee: 5000000.00,  timeline: 5 },
  { title: 'Platinum Life Membership', fee: 20000000.00, timeline: 5 },
]

async function main() {
  console.log('Seeding membership categories...')

  for (const category of membershipCategories) {
    try {
      await prisma.membershipCategory.upsert({
        where: { title: category.title },
        update: {
          fee: category.fee,
          timeline: category.timeline,
        },
        create: {
          title: category.title,
          fee: category.fee,
          timeline: category.timeline,
        },
      })
      console.log(`✓ ${category.title} - KSh ${category.fee.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
    } catch (error: any) {
      console.error(`✗ Error seeding ${category.title}:`, error.message)
    }
  }

  console.log('\n✅ Membership categories seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding membership categories:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

