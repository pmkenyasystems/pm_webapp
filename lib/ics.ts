import { PartyEvent } from './events'

function toIcsDate(dateStr: string): string {
  return dateStr.replace(/-/g, '')
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00`)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

// All-day VEVENT DTEND is exclusive, so it must be one day past the event's last day.
export function buildIcsContent(event: PartyEvent): string {
  const dtStart = toIcsDate(event.startDate)
  const dtEnd = toIcsDate(addDays(event.endDate, 1))
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const summary = escapeIcsText(`${event.title} — ${event.subtitle}`)
  const description = escapeIcsText(`${event.description}\n\nLocation: ${event.location}`)
  const location = escapeIcsText(event.location)

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PM Party//Events//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.slug}@pmparty.ke`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n')
}
