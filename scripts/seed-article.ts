import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating sample article...')

  // Get or find an admin user for the article author
  let adminUser = await prisma.user.findFirst({
    where: {
      OR: [
        { role: 'super_admin' },
        { role: 'admin' },
      ],
    },
  })

  if (!adminUser) {
    console.error('❌ No admin user found. Please create an admin user first.')
    console.log('   You can run: npx tsx scripts/seed-admin.ts')
    return
  }

  console.log(`✓ Using author: ${adminUser.email}`)

  // Generate slug from title
  const title = 'Provisional Certifate'
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  // Check if article already exists
  const existingArticle = await prisma.article.findUnique({
    where: { slug },
  })

  if (existingArticle) {
    console.log('⚠️  Article already exists with this slug. Updating...')
    
    const updatedArticle = await prisma.article.update({
      where: { slug },
      data: {
        title,
        imageUrl: 'public/images/articles/prov_cert.JPG',
        content: existingArticle.content || '<p>Provisional Certificate information.</p>',
        published: true,
        publishedAt: new Date(),
      },
    })
    
    console.log('✅ Article updated successfully!')
    console.log(`   Title: ${updatedArticle.title}`)
    console.log(`   Slug: ${updatedArticle.slug}`)
    console.log(`   Image URL: ${updatedArticle.imageUrl}`)
    return
  }

  // Create the article
  const article = await prisma.article.create({
    data: {
      title,
      slug,
      content: `
        <h2>Provisional Certificate</h2>
        <p>This is the provisional certificate for People's Renaissance Movement.</p>
        <p>We are pleased to share this important milestone with our members and supporters.</p>
      `,
      excerpt: 'Provisional Certificate for People\'s Renaissance Movement.',
      imageUrl: 'public/images/articles/prov_cert.JPG',
      authorId: adminUser.id,
      published: true,
      publishedAt: new Date(),
    },
  })

  console.log('✅ Article created successfully!')
  console.log(`\nArticle Details:`)
  console.log(`  Title: ${article.title}`)
  console.log(`  Slug: ${article.slug}`)
  console.log(`  Image URL: ${article.imageUrl}`)
  console.log(`  Published: ${article.published}`)
  console.log(`  Author: ${adminUser.email}`)
}

main()
  .catch((e) => {
    console.error('Error creating article:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

