import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Position data: [positionTitle, positionLevel]
// Level mapping: 1 = National, 2 = Constituency, 3 = Ward
const positions = [
  { title: 'Governor', level: 'National' },
  { title: 'Senator', level: 'National' },
  { title: 'Women Rep', level: 'National' },
  { title: 'MP', level: 'Constituency' },
  { title: 'MCA', level: 'Ward' },
]

async function main() {
  console.log('Seeding positions...')

  if (positions.length === 0) {
    console.log('⚠️  No positions to seed. Please add position data to the script.')
    return
  }

  for (const position of positions) {
    try {
      // Check if position already exists
      const existing = await prisma.position.findFirst({
        where: {
          positionTitle: position.title,
          positionLevel: position.level,
        },
      })

      if (existing) {
        console.log(`⚠️  ${position.title} (Level: ${position.level}) already exists. Skipping.`)
        continue
      }

      // Create new position
      await prisma.position.create({
        data: {
          positionTitle: position.title,
          positionLevel: position.level,
        },
      })
      console.log(`✓ ${position.title} (Level: ${position.level})`)
    } catch (error: any) {
      console.error(`✗ Error seeding ${position.title}:`, error.message)
    }
  }

  console.log('\n✅ Positions seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding positions:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

