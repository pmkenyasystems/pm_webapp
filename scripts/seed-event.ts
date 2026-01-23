import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating sample event...')

  // Check if event already exists
  const existingEvent = await prisma.event.findFirst({
    where: {
      title: {
        contains: 'website',
        mode: 'insensitive',
      },
    },
  })

  if (existingEvent) {
    console.log('⚠️  Event with similar title already exists. Updating...')
    
    const updatedEvent = await prisma.event.update({
      where: { id: existingEvent.id },
      data: {
        title: 'Website & HQ Launch',
        description: 'Join us for the official launch of our website and headquarters at Renaissance Centre.',
        imageUrl: 'public/images/events/website_launch.png',
        location: 'Renaissance Centre',
        startDate: new Date('2026-02-14T10:00:00Z'),
        isPublic: true,
      },
    })
    
    console.log('✅ Event updated successfully!')
    console.log(`\nEvent Details:`)
    console.log(`  Title: ${updatedEvent.title}`)
    console.log(`  Date: ${updatedEvent.startDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`)
    console.log(`  Location: ${updatedEvent.location}`)
    console.log(`  Image URL: ${updatedEvent.imageUrl}`)
    return
  }

  // Create the event
  const event = await prisma.event.create({
    data: {
      title: 'Website & HQ Launch',
      description: 'Join us for the official launch of our website and headquarters at Renaissance Centre. This is a momentous occasion as we unveil our new digital presence and physical headquarters. All members, supporters, and well-wishers are invited to celebrate this milestone with us.',
      imageUrl: 'public/images/events/website_launch.png',
      location: 'Renaissance Centre',
      startDate: new Date('2026-02-14T10:00:00Z'), // 14th Feb 2026, 10:00 AM UTC
      isPublic: true,
    },
  })

  console.log('✅ Event created successfully!')
  console.log(`\nEvent Details:`)
  console.log(`  Title: ${event.title}`)
  console.log(`  Date: ${event.startDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`)
  console.log(`  Location: ${event.location}`)
  console.log(`  Image URL: ${event.imageUrl}`)
  console.log(`  Public: ${event.isPublic}`)
}

main()
  .catch((e) => {
    console.error('Error creating event:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

