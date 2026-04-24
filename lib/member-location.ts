import type { PrismaClient } from '@prisma/client'

/** Hyphens treated like spaces (e.g. Trans Nzoia ↔ Trans-Nzoia). */
function normLoose(s: string | null | undefined): string {
  if (s == null || s === '') return ''
  return String(s)
    .trim()
    .toUpperCase()
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
}

export type ResolvedMemberLocation = {
  countyCode: number | null
  constituencyCode: number | null
  wardCode: number | null
}

/** Parse IPPMS / free-text location strings into DB codes (matches County / Constituency / Ward). */
export async function resolveMemberLocationFromStrings(
  prisma: PrismaClient,
  countyRaw: unknown,
  constituencyRaw: unknown,
  wardRaw: unknown
): Promise<ResolvedMemberLocation> {
  const [counties, constituencies, wards] = await Promise.all([
    prisma.county.findMany(),
    prisma.constituency.findMany(),
    prisma.ward.findMany({ include: { constituency: true } }),
  ])

  const countyByNormLoose = new Map<string, (typeof counties)[0]>()
  for (const c of counties) {
    countyByNormLoose.set(normLoose(c.countyName), c)
  }

  const constByCountyAndName = new Map<string, (typeof constituencies)[0]>()
  for (const c of constituencies) {
    constByCountyAndName.set(`${c.countyCode}|${normLoose(c.constituencyName)}`, c)
  }

  const wardByConstAndName = new Map<string, (typeof wards)[0]>()
  for (const w of wards) {
    wardByConstAndName.set(`${w.constituencyCode}|${normLoose(w.wardName)}`, w)
  }

  const cName = countyRaw != null ? String(countyRaw).trim() : ''
  const coName = constituencyRaw != null ? String(constituencyRaw).trim() : ''
  const wName = wardRaw != null ? String(wardRaw).trim() : ''

  let countyCode: number | null = null
  let constituencyCode: number | null = null
  let wardCode: number | null = null

  // County: name or numeric code string
  if (cName) {
    const byNorm = countyByNormLoose.get(normLoose(cName))
    if (byNorm) {
      countyCode = byNorm.countyCode
    } else if (/^[0-9]+$/.test(cName)) {
      const n = parseInt(cName, 10)
      const hit = counties.find((x) => x.countyCode === n)
      if (hit) countyCode = hit.countyCode
    }
  }

  // Constituency: match within county when possible; or by global constituency code
  if (coName) {
    if (/^[0-9]+$/.test(coName)) {
      const n = parseInt(coName, 10)
      const co = constituencies.find((x) => x.constituencyCode === n)
      if (co) {
        constituencyCode = co.constituencyCode
        if (countyCode == null) countyCode = co.countyCode
      }
    } else if (countyCode != null) {
      const co = constByCountyAndName.get(`${countyCode}|${normLoose(coName)}`)
      if (co) constituencyCode = co.constituencyCode
    }
  }

  // Ward: match within constituency; or by global ward code
  if (wName) {
    if (/^[0-9]+$/.test(wName)) {
      const n = parseInt(wName, 10)
      const w = wards.find((x) => x.wardCode === n)
      if (w) {
        wardCode = w.wardCode
        constituencyCode = w.constituencyCode
        const co = constituencies.find((x) => x.constituencyCode === w.constituencyCode)
        if (co && countyCode == null) countyCode = co.countyCode
      }
    } else if (constituencyCode != null) {
      const w = wardByConstAndName.get(`${constituencyCode}|${normLoose(wName)}`)
      if (w) wardCode = w.wardCode
    }
  }

  return { countyCode, constituencyCode, wardCode }
}
