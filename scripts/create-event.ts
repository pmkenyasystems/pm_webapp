import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Check if event already exists
  const existingEvent = await prisma.event.findUnique({
    where: { slug: 'website-launch' },
  })

  if (existingEvent) {
    console.log('Event already exists:', existingEvent)
    return
  }

  // Create Website Launch event
  const event = await prisma.event.create({
    data: {
      title: 'Website Launch',
      slug: 'website-launch',
      description: 'Join us for the official launch of the People\'s Renaissance Movement website and digital platform. This marks a significant milestone in our journey to connect with Kenyans and build a better future together.',
      imageUrl: '/images/events/website_launch.png',
      location: 'Riara Valley Gardens, Riara Road, Lavington, Nairobi (Party HQ)',
      startDate: new Date('2026-01-24T10:00:00'),
      isPublic: true,
    },
  })

  console.log('Event created successfully:', event)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

