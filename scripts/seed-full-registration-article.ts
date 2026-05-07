import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating Full Registration article...')

  const adminUser = await prisma.user.findFirst({
    where: {
      OR: [
        { role: 'super_admin' },
        { role: 'admin' },
      ],
    },
  })

  if (!adminUser) {
    console.error('❌ No admin user found. Please create an admin user first.')
    return
  }

  console.log(`✓ Using author: ${adminUser.email}`)

  const title = "PM Party Receives Full Registration — The Kenyan Renaissance Begins"
  const slug = 'prm-full-registration-kenyan-renaissance-begins'

  const content = `
<p style="margin-bottom:1.25rem;">On <strong>22nd April 2026</strong>, the Office of the Registrar of Political Parties (ORPP) formally issued the <strong>Certificate of Full Registration</strong> to the <strong>People's Movement Party (PM Party)</strong>. This landmark moment closes the final chapter of our registration journey and opens the first page of a new era for Kenya.</p>

<h2 style="margin-top:2rem;margin-bottom:1rem;">A Historic Milestone for Kenya</h2>

<p style="margin-bottom:1.25rem;">Full registration is more than a legal formality — it is the state's formal recognition that PM Party has met every requirement to compete for power, represent Kenyans, and drive the transformation our nation deserves. After years of grassroots organizing, county-by-county mobilisation, and the unwavering commitment of tens of thousands of Kenyans, this certificate is a testament to the collective will of a people ready for change.</p>

<p style="margin-bottom:1.25rem;">The Registrar's confirmation came after rigorous verification of our membership rolls, party constitution, governing structures, and county presence across all 47 counties — evidence that PM Party is a truly national movement rooted in every corner of the Republic.</p>

<h2 style="margin-top:2rem;margin-bottom:1rem;">What Full Registration Means</h2>

<ul style="margin-bottom:1.25rem;padding-left:1.5rem;list-style-type:disc;">
  <li style="margin-bottom:0.5rem;"><strong>Electoral participation:</strong> PM Party can now field candidates in every elective position — from ward representative to President of the Republic of Kenya.</li>
  <li style="margin-bottom:0.5rem;"><strong>National recognition:</strong> We stand as a fully constituted political party with all the rights, responsibilities, and protections afforded under Kenyan law.</li>
  <li style="margin-bottom:0.5rem;"><strong>Accountability structures:</strong> Our constitution, elected officials, and governance framework are now on public record — demonstrating the transparency that has always defined our movement.</li>
  <li style="margin-bottom:0.5rem;"><strong>Coalition standing:</strong> PM Party is positioned to negotiate, partner, and lead coalitions in the national interest.</li>
</ul>

<h2 style="margin-top:2rem;margin-bottom:1rem;">The Kenyan Renaissance Has Begun</h2>

<p style="margin-bottom:1.25rem;">PM Party was founded on a single, audacious conviction: that Kenya's best days are ahead. We believe in a Kenya where public service is a calling, not a privilege; where every child — regardless of county, tribe, or economic class — has access to quality education and healthcare; where the economy works for the many, not the few; and where leaders are held accountable to the people who elect them.</p>

<p style="margin-bottom:1.25rem;">The Kenyan Renaissance is not a slogan. It is a programme — a commitment to rebuild our institutions, restore public trust, and reimagine what governance can look like when it is truly of the people, by the people, and for the people.</p>

<p style="margin-bottom:1.25rem;">With full registration, that programme now has the institutional platform it needs. The Renaissance is no longer a promise. It has begun.</p>

<h2 style="margin-top:2rem;margin-bottom:1rem;">Message from the Leadership</h2>

<blockquote style="border-left:4px solid #1a3a8f;padding:1rem 1.25rem;margin:1.5rem 0;background:#f8f9ff;border-radius:0 4px 4px 0;">
  <p style="margin-bottom:0.75rem;font-style:italic;">"This certificate does not belong to any individual. It belongs to every Kenyan who signed a membership form, attended a branch meeting, shared our vision with a neighbour, or simply dared to believe that Kenya can be better. Today we celebrate together. Tomorrow we get to work."</p>
  <p style="margin-bottom:0;font-weight:600;">— PM Party National Leadership</p>
</blockquote>

<h2 style="margin-top:2rem;margin-bottom:1rem;">What Comes Next</h2>

<p style="margin-bottom:1rem;">The issuance of our full registration certificate sets the stage for the next phase of PM Party's growth:</p>

<ol style="margin-bottom:1.25rem;padding-left:1.5rem;list-style-type:decimal;">
  <li style="margin-bottom:0.75rem;"><strong>National Convention</strong> — We will convene our inaugural National Delegates' Congress to ratify our electoral strategy and elect the party's national leadership.</li>
  <li style="margin-bottom:0.75rem;"><strong>Policy Launch</strong> — Our flagship policy framework, the <em>Renaissance Blueprint</em>, will be formally presented to Kenyans in the coming weeks.</li>
  <li style="margin-bottom:0.75rem;"><strong>County Structures</strong> — We are strengthening our county, constituency, and ward offices across all 47 counties to ensure every Kenyan has a PM Party home near them.</li>
  <li style="margin-bottom:0.75rem;"><strong>Aspirant Nominations</strong> — PM Party will open its formal nominations process, giving qualified Kenyans the opportunity to fly our flag in forthcoming elections.</li>
</ol>

<h2 style="margin-top:2rem;margin-bottom:1rem;">Join the Kenyan Renaissance</h2>

<p style="margin-bottom:1.25rem;">Kenya's renewal will not come from politicians alone. It will come from you — teachers, farmers, engineers, traders, students, mothers and fathers — who decide that the status quo is not acceptable and that a better Kenya is worth fighting for.</p>

<p style="margin-bottom:1.5rem;">PM Party is your party. Be part of the change you want to see.</p>

<div style="background:#f0f4ff;border-left:4px solid #1a3a8f;padding:1.25rem 1.5rem;margin:2rem 0;border-radius:4px;">
  <p style="font-weight:700;font-size:1.1rem;margin-bottom:0.75rem;">Join PM Party Today</p>
  <p style="margin-bottom:1rem;">Become an official member of the People's Movement Party and help shape the future of Kenya. Membership is open to every Kenyan citizen aged 18 and above who shares our values of integrity, service, and national renewal.</p>
  <a href="/membership/register" style="display:inline-block;background:#1a3a8f;color:#fff;padding:10px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">Register as a Member →</a>
</div>

<p style="margin-top:1.5rem;font-style:italic;"><em>Together, we are the Renaissance.</em></p>
`

  const excerpt =
    "On 22nd April 2026, the Office of the Registrar of Political Parties issued the Certificate of Full Registration to PM Party — officially marking the beginning of the Kenyan Renaissance."

  const existingArticle = await prisma.article.findUnique({ where: { slug } })

  if (existingArticle) {
    console.log('⚠️  Article exists. Updating content, title, and image...')
    const updated = await prisma.article.update({
      where: { slug },
      data: {
        title,
        content,
        excerpt,
        imageUrl: '/images/news/full_reg.jpeg',
        published: true,
        publishedAt: new Date('2026-04-22T10:00:00Z'),
      },
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
      imageUrl: '/images/news/full_reg.jpeg',
      authorId: adminUser.id,
      published: true,
      publishedAt: new Date('2026-04-22T10:00:00Z'),
    },
  })

  console.log('✅ Article created successfully!')
  console.log(`   Title: ${article.title}`)
  console.log(`   Slug: ${article.slug}`)
  console.log(`   Published: ${article.published}`)
  console.log(`   Published At: ${article.publishedAt}`)
  console.log(`   Image: ${article.imageUrl}`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
