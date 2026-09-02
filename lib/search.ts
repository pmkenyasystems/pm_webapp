import { allOrganisations } from './committees'
import { EVENTS } from './events'

export interface SearchItem {
  title: string
  description: string
  url: string
  type: string
  keywords?: string
}

const STATIC_PAGES: SearchItem[] = [
  { title: 'Home', description: "PM Party — People's Renaissance Movement.", url: '/', type: 'Page' },
  { title: 'About Us', description: 'Our vision, mission and ideology.', url: '/about', type: 'Page' },
  { title: 'Our Manifesto', description: 'The Big Five Agenda for Kenya: Jobs, Corruption, Constitutionalism, Public Debt and Tribalism.', url: '/about/manifesto', type: 'Page' },
  { title: 'Party Leadership', description: 'Meet the people leading the movement, nationally and by county.', url: '/about/leadership', type: 'Page' },
  { title: 'Leadership Structure', description: 'How the party is organised, from national to polling station level.', url: '/about/leadership-structure', type: 'Page' },
  { title: 'News & Updates', description: 'Latest articles and news from the party.', url: '/articles', type: 'Page' },
  { title: 'Events', description: 'Upcoming rallies, tours and party events.', url: '/events', type: 'Page' },
  { title: 'Party Organs', description: 'Standing committees and party organs: recruitment, resource mobilization, legal affairs, youth league, women league and more.', url: '/#committees', type: 'Page' },
  { title: 'Become a Member', description: 'Register as a member of the People’s Renaissance Movement.', url: '/membership/register', type: 'Page' },
  { title: 'Member Login', description: 'Log in to your membership portal account.', url: '/membership/login', type: 'Page' },
  { title: 'Apply as Aspirant', description: 'Apply to vie for a party position: President, Governor, Senator, MP, Woman Representative, MCA and more.', url: '/aspirants/apply', type: 'Page' },
  { title: 'Donate', description: 'Support the movement with a donation via M-Pesa or card.', url: '/donate', type: 'Page' },
  { title: 'Volunteer', description: 'Sign up to volunteer with the party.', url: '/volunteer', type: 'Page' },
  { title: 'National Delegates Convention (NDC)', description: 'Information and registration for the NDC.', url: '/ndc', type: 'Page' },
  { title: 'Contact Us', description: 'Get in touch with the People’s Renaissance Movement.', url: '/contact', type: 'Page' },
]

function organisationItems(): SearchItem[] {
  return allOrganisations.map((c) => ({
    title: c.title,
    description: c.description,
    url: `/${c.id}`,
    type: 'Party Organ',
    keywords: (c.members ?? []).map((m) => `${m.name} ${m.role}`).join(' '),
  }))
}

function eventItems(): SearchItem[] {
  return EVENTS.map((e) => ({
    title: `${e.title} — ${e.subtitle}`,
    description: `${e.dateLabel} · ${e.location}`,
    url: '/events',
    type: 'Event',
    keywords: [e.description, e.location, ...e.stops.map((s) => s.label)].join(' '),
  }))
}

export function getStaticSearchItems(): SearchItem[] {
  return [...STATIC_PAGES, ...organisationItems(), ...eventItems()]
}

function normalize(text: string): string {
  return text.toLowerCase()
}

export function scoreItem(item: SearchItem, query: string): number {
  const q = normalize(query)
  const title = normalize(item.title)
  const description = normalize(item.description)
  const keywords = normalize(item.keywords ?? '')

  if (title === q) return 100
  if (title.startsWith(q)) return 80
  if (title.includes(q)) return 60
  if (description.includes(q)) return 35
  if (keywords.includes(q)) return 20
  return 0
}

export function rankItems(items: SearchItem[], query: string, limit = 20): SearchItem[] {
  return items
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.item)
}
