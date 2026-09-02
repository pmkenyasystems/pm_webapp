export interface PartyEvent {
  slug: string
  title: string
  subtitle: string
  poster: string
  startDate: string // ISO date, used for sorting and "upcoming" checks
  endDate: string // ISO date, inclusive — same as startDate for single-day events
  dateLabel: string
  location: string
  description: string
  stops: { date?: string; label: string }[]
  speakers?: string[]
}

export const EVENTS: PartyEvent[] = [
  {
    slug: 'tharaka-nithi-tour',
    title: "People's Movement Tour",
    subtitle: 'Tharaka Nithi',
    poster: '/images/events/tharaka-nithi-tour.png',
    startDate: '2026-09-06',
    endDate: '2026-09-06',
    dateLabel: 'Sunday, 6th September 2026',
    location: 'Tharaka Nithi County',
    description:
      "Join the People's Movement as we tour Tharaka Nithi County, meeting residents at Kairuni PCEA Church, Chogoria, Marima, Ndagani, and Chuka.",
    stops: [
      { label: 'Kairuni PCEA Church' },
      { label: 'Chogoria' },
      { label: 'Marima' },
      { label: 'Ndagani' },
      { label: 'Chuka' },
    ],
  },
  {
    slug: 'coastal-tour',
    title: "People's Movement Coastal Tour",
    subtitle: "The Chairman's Homecoming",
    poster: '/images/events/coastal-tour.png',
    startDate: '2026-09-11',
    endDate: '2026-09-13',
    dateLabel: 'Friday 11th – Sunday 13th September 2026',
    location: 'Kilifi, Mombasa & Taita Taveta Counties',
    description:
      "PM Party's Coastal Tour marks the homecoming of PM Party Chairman Hon. Teddy Mwambire, with stops across Kilifi, Mombasa and Taita Taveta counties.",
    stops: [
      { date: 'Friday, 11th September', label: 'Kilifi County: Ganze, Mtwapa' },
      { date: 'Saturday, 12th September', label: 'Mombasa County' },
      { date: 'Sunday, 13th September', label: 'Taita Taveta County' },
    ],
    speakers: ['Hon. Caleb Amisi — Party Leader, PM Party', 'Hon. Teddy Mwambire — PM Party Chairman'],
  },
]

export function getUpcomingEvents(): PartyEvent[] {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return [...EVENTS]
    .filter((e) => new Date(e.startDate) >= now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
}

export function getAllEventsSorted(): PartyEvent[] {
  return [...EVENTS].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
}
