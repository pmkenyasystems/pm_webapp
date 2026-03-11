import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Election data: [title, description, electionDate, isActive]
const elections = [
  {
    title: '2027 General Election',
    description: 'All levels',
    electionDate: new Date('2027-08-08'),
    isActive: true,
  },
  {
    title: 'By Election-Isiolo South',
    description: 'MP',
    electionDate: new Date('2026-05-07'),
    isActive: true,
  },
  {
    title: 'By Election-Kabras Ward',
    description: 'MCA',
    electionDate: new Date('2026-05-07'),
    isActive: true,
  },
]

async function main() {
  console.log('Seeding elections...')

  if (elections.length === 0) {
    console.log('⚠️  No elections to seed. Please add election data to the script.')
    return
  }

  for (const election of elections) {
    try {
      // Check if election already exists (by title and date)
      const existing = await prisma.election.findFirst({
        where: {
          title: election.title,
          electionDate: election.electionDate,
        },
      })

      if (existing) {
        // Update existing election
        await prisma.election.update({
          where: { id: existing.id },
          data: {
            description: election.description,
            isActive: election.isActive,
          },
        })
        console.log(`✓ Updated: ${election.title} (${election.electionDate.toLocaleDateString()})`)
      } else {
        // Create new election
        await prisma.election.create({
          data: {
            title: election.title,
            description: election.description,
            electionDate: election.electionDate,
            isActive: election.isActive,
          },
        })
        console.log(`✓ Created: ${election.title} (${election.electionDate.toLocaleDateString()})`)
      }
    } catch (error: any) {
      console.error(`✗ Error seeding ${election.title}:`, error.message)
    }
  }

  console.log('\n✅ Elections seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding elections:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

