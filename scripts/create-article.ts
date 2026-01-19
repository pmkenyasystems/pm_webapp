import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get or create an admin user for the article author
  let adminUser = await prisma.user.findFirst({
    where: { role: 'admin' },
  })

  if (!adminUser) {
    // Create a default admin user if none exists
    adminUser = await prisma.user.create({
      data: {
        email: 'admin@pmkenya.ke',
        password: 'temp_password', // This should be hashed in production
        name: 'Admin',
        role: 'admin',
      },
    })
  }

  // Check if article already exists
  const existingArticle = await prisma.article.findUnique({
    where: { slug: 'pm-provisional-certificate' },
  })

  if (existingArticle) {
    console.log('Article already exists:', existingArticle)
    return
  }

  // Create PM Provisional Certificate article
  const article = await prisma.article.create({
    data: {
      title: 'PM Provisional Certificate',
      slug: 'pm-provisional-certificate',
      content: `
        <h2>People's Renaissance Movement Receives Provisional Certificate</h2>
        <p>We are pleased to announce that People's Renaissance Movement has been officially registered and received its provisional certificate. This marks a significant milestone in our journey to bring positive change to Kenya.</p>
        <p>With this certificate, we are now officially recognized as a political party and can begin our operations to serve the people of Kenya. We are committed to transparency, accountability, and people-centered governance.</p>
        <p>This achievement would not have been possible without the support and dedication of our members, volunteers, and supporters across the country. Together, we will build a better Kenya.</p>
        <p><strong>The Change We Need, Mabadiliko Ni Sasa!</strong></p>
      `,
      excerpt: 'People\'s Renaissance Movement has been officially registered and received its provisional certificate, marking a significant milestone in our journey.',
      imageUrl: '/images/news/prov_cert.JPG',
      authorId: adminUser.id,
      published: true,
      publishedAt: new Date(),
    },
  })

  console.log('Article created successfully:', article)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

