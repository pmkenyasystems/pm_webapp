import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const IMAGE_URL = '/images/news/prov_cert.png'

async function main() {
  // Try common slugs for the provisional certificate article
  const slugs = ['pm-provisional-certificate', 'provisional-certifate', 'provisional-certificate']
  let updated = false

  for (const slug of slugs) {
    const article = await prisma.article.findUnique({
      where: { slug },
    })
    if (article) {
      await prisma.article.update({
        where: { slug },
        data: { imageUrl: IMAGE_URL },
      })
      console.log(`✅ Updated article "${article.title}" (slug: ${slug}) with image: ${IMAGE_URL}`)
      updated = true
      break
    }
  }

  if (!updated) {
    // Fallback: find by title containing "provisional" and "certificate"
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: 'Provisional', mode: 'insensitive' } },
          { title: { contains: 'provisional', mode: 'insensitive' } },
        ],
      },
    })
    for (const article of articles) {
      await prisma.article.update({
        where: { id: article.id },
        data: { imageUrl: IMAGE_URL },
      })
      console.log(`✅ Updated article "${article.title}" (id: ${article.id}) with image: ${IMAGE_URL}`)
      updated = true
    }
  }

  if (!updated) {
    console.log('⚠️  No provisional certificate article found in the database.')
    console.log('   Create one first (e.g. run scripts/create-article.ts) then run this script again.')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
