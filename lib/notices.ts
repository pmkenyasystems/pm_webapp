export interface StatutoryNotice {
  slug: string
  form: string
  rule: string
  title: string
  dated: string
  pdf: string
}

export const STATUTORY_NOTICES: StatutoryNotice[] = [
  {
    slug: 'change-of-party-officials',
    form: 'Form PP.7',
    rule: 'r.5(2)',
    title: 'Notice of Change of Party Officials',
    dated: '11th August 2026',
    pdf: '/docs/notices/Form-PP7-Notice-of-Change-of-Party-Officials.pdf',
  },
  {
    slug: 'change-of-head-office-location',
    form: 'Form PP.8',
    rule: 'r.6(2)',
    title: 'Notice of Change of Location of Head Office',
    dated: '11th August 2026',
    pdf: '/docs/notices/Form-PP8-Notice-of-Change-of-Head-Office.pdf',
  },
  {
    slug: 'change-of-constitution-or-rules',
    form: 'Form PP.11',
    rule: 'r.7(2)',
    title: 'Notice of Change of Constitution or Rules',
    dated: '11th August 2026',
    pdf: '/docs/notices/Form-PP11-Notice-of-Change-of-Constitution.pdf',
  },
]
