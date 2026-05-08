import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminUser = await prisma.user.findFirst({
    where: { OR: [{ role: 'super_admin' }, { role: 'admin' }] },
  })

  if (!adminUser) {
    console.error('❌ No admin user found.')
    return
  }

  const VIDEO_ID = 'rocTLLLH3Ss'
  const title = 'PM Party Press Conference — Watch the Full Address'
  const slug = 'pm-party-press-conference-full-address'

  const content = `
<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;margin-bottom:1.5rem;">
  <iframe
    src="https://www.youtube.com/embed/${VIDEO_ID}"
    title="PM Party Press Conference"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
    style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:8px;"
  ></iframe>
</div>

<p style="margin-bottom:1.25rem;">The People's Movement (PM Party) held a press conference addressing the nation on key issues facing Kenya and outlining the party's vision for the Kenyan Renaissance.</p>

<p style="margin-bottom:1.25rem;">Watch the full address above and stay connected with PM Party as we continue building a movement that puts Kenyans first.</p>

<div style="background:#f0f4ff;border-left:4px solid #1a3a8f;padding:1.25rem 1.5rem;margin:2rem 0;border-radius:4px;">
  <p style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">Join the Kenyan Renaissance</p>
  <p style="margin-bottom:1rem;">Be part of the movement that is reshaping Kenya's future. Membership is open to every Kenyan citizen aged 18 and above.</p>
  <a href="/membership/register" style="display:inline-block;background:#1a3a8f;color:#fff;padding:10px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">Register as a Member →</a>
</div>
`

  const excerpt =
    'Watch the full PM Party press conference as the party leadership addresses the nation and outlines the vision for the Kenyan Renaissance.'

  const existing = await prisma.article.findUnique({ where: { slug } })

  if (existing) {
    const updated = await prisma.article.update({
      where: { slug },
      data: { title, content, excerpt, imageUrl: `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`, published: true },
    })
    console.log('✅ Article updated:', updated.slug)
    return
  }

  const article = await prisma.article.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      imageUrl: `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`,
      authorId: adminUser.id,
      published: true,
      publishedAt: new Date(),
    },
  })

  console.log('✅ Article created:', article.slug)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
