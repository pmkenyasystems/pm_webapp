/**
 * Import members from an Excel file into the member table.
 * First row = headers; columns matched to Member fields by name (case-insensitive).
 * County / Constituency / Ward → countyCode / constituencyCode / wardCode (FKs).
 *
 * Usage:
 *   npx tsx scripts/import-members-xlsx.ts [path-to.xlsx]
 * Default: public/docs/transnzoia.xlsx
 * Examples: npm run import:nandi-xlsx | import:westpokot-xlsx | import:vihiga-xlsx | import:nairobi-xlsx | import:transnzoia-xlsx
 */

import * as path from 'path'
import * as XLSX from 'xlsx'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * For county/constituency/ward names: treat hyphens like spaces so
 * e.g. "Trans Nzoia" matches DB "Trans-Nzoia".
 */
function normLoose(s: string | null | undefined): string {
  if (s == null || s === '') return ''
  return String(s)
    .trim()
    .toUpperCase()
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
}

function parsePwd(val: unknown): boolean | null {
  if (val == null || val === '') return null
  const t = String(val).trim().toUpperCase()
  if (t === '-' || t === 'N' || t === 'NO' || t === 'FALSE' || t === '0') return false
  if (t === 'Y' || t === 'YES' || t === 'TRUE' || t === '1') return true
  return null
}

function parseGender(val: unknown): string | null {
  if (val == null || val === '') return null
  const t = String(val).trim()
  const u = t.toUpperCase()
  if (u.startsWith('M')) return 'Male'
  if (u.startsWith('F')) return 'Female'
  return t
}

function parseDateOfBirth(val: unknown): Date | null {
  if (val == null || val === '') return null
  if (val instanceof Date && !isNaN(val.getTime())) return val
  if (typeof val === 'number') {
    const utc = new Date(Math.round((val - 25569) * 86400 * 1000))
    return isNaN(utc.getTime()) ? null : utc
  }
  const s = String(val).trim()
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
  if (m) {
    let d = parseInt(m[1], 10)
    let mo = parseInt(m[2], 10)
    let y = parseInt(m[3], 10)
    if (y < 100) y += y < 50 ? 2000 : 1900
    const dt = new Date(y, mo - 1, d)
    return isNaN(dt.getTime()) ? null : dt
  }
  const d2 = new Date(s)
  return isNaN(d2.getTime()) ? null : d2
}

function toIdNumberString(val: unknown): string {
  if (val == null) return ''
  if (typeof val === 'number') return String(Math.trunc(val))
  return String(val).trim()
}

function buildHeaderMap(headerRow: unknown[]): Record<string, number> {
  const map: Record<string, number> = {}
  headerRow.forEach((cell, i) => {
    if (cell == null || cell === '') return
    const key = String(cell).trim().toLowerCase()
    map[key] = i
  })
  return map
}

function getCell(row: unknown[], headerMap: Record<string, number>, ...names: string[]): unknown {
  for (const n of names) {
    const idx = headerMap[n.toLowerCase()]
    if (idx !== undefined) return row[idx]
  }
  return undefined
}

const DEFAULT_XLSX = 'public/docs/transnzoia.xlsx'

async function main() {
  const filePath = path.resolve(process.cwd(), process.argv[2] || DEFAULT_XLSX)

  console.log('Reading:', filePath)
  const wb = XLSX.readFile(filePath, { cellDates: true, cellNF: false, cellText: false })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null, raw: true }) as unknown[][]

  if (rows.length < 2) {
    console.error('No data rows found')
    process.exit(1)
  }

  const headerMap = buildHeaderMap(rows[0])
  console.log('Headers mapped:', Object.keys(headerMap).join(', '))

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
    const key = `${c.countyCode}|${normLoose(c.constituencyName)}`
    constByCountyAndName.set(key, c)
  }

  const constByCode = new Map<number, (typeof constituencies)[0]>()
  for (const c of constituencies) {
    constByCode.set(c.constituencyCode, c)
  }

  const wardByConstAndName = new Map<string, (typeof wards)[0]>()
  const wardByCode = new Map<number, (typeof wards)[0]>()
  for (const w of wards) {
    wardByConstAndName.set(`${w.constituencyCode}|${normLoose(w.wardName)}`, w)
    wardByCode.set(w.wardCode, w)
  }

  function resolveLocation(
    countyRaw: unknown,
    constRaw: unknown,
    wardRaw: unknown
  ): { countyCode: number | null; constituencyCode: number | null; wardCode: number | null } {
    const cName = countyRaw != null ? String(countyRaw).trim() : ''
    const coName = constRaw != null ? String(constRaw).trim() : ''
    const wName = wardRaw != null ? String(wardRaw).trim() : ''

    let countyCode: number | null = null
    let constituencyCode: number | null = null
    let wardCode: number | null = null

    // County: loose name match or numeric code
    if (cName) {
      const byName = countyByNormLoose.get(normLoose(cName))
      if (byName) {
        countyCode = byName.countyCode
      } else if (/^[0-9]+$/.test(cName)) {
        const n = parseInt(cName, 10)
        const hit = counties.find((x) => x.countyCode === n)
        if (hit) countyCode = hit.countyCode
      }
    }

    // Constituency: within county by name, or global constituency code
    if (coName) {
      if (/^[0-9]+$/.test(coName)) {
        const n = parseInt(coName, 10)
        const co = constByCode.get(n)
        if (co) {
          constituencyCode = co.constituencyCode
          if (countyCode == null) countyCode = co.countyCode
        }
      } else if (countyCode != null) {
        const co = constByCountyAndName.get(`${countyCode}|${normLoose(coName)}`)
        if (co) constituencyCode = co.constituencyCode
      }
    }

    // Ward: within constituency by name, or global ward code
    if (wName) {
      if (/^[0-9]+$/.test(wName)) {
        const n = parseInt(wName, 10)
        const w = wardByCode.get(n)
        if (w) {
          wardCode = w.wardCode
          constituencyCode = w.constituencyCode
          const co = constByCode.get(w.constituencyCode)
          if (co && countyCode == null) countyCode = co.countyCode
        }
      } else if (constituencyCode != null) {
        const w = wardByConstAndName.get(`${constituencyCode}|${normLoose(wName)}`)
        if (w) wardCode = w.wardCode
      }
    }

    return { countyCode, constituencyCode, wardCode }
  }

  let upserted = 0
  let skipped = 0
  const errors: string[] = []

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r]
    if (!row || row.every((c) => c == null || c === '')) continue

    const idNumber = toIdNumberString(getCell(row, headerMap, 'idnumber', 'id_number', 'id no', 'idno'))
    if (!idNumber) {
      skipped++
      continue
    }

    const surname = String(getCell(row, headerMap, 'surname', 'last name') ?? '').trim()
    const otherNames = String(getCell(row, headerMap, 'othernames', 'other names', 'othername', 'first name') ?? '').trim()
    if (!surname || !otherNames) {
      errors.push(`Row ${r + 1}: missing surname or other names for ID ${idNumber}`)
      skipped++
      continue
    }

    const ippmsRaw = getCell(row, headerMap, 'ippmsid', 'ippms_id', 'membershipno', 'membership no')
    const ippmsId = ippmsRaw != null && String(ippmsRaw).trim() !== '' ? String(ippmsRaw).trim() : null

    const dateOfBirth = parseDateOfBirth(getCell(row, headerMap, 'dateofbirth', 'date of birth', 'dob', 'birthdate'))
    const gender = parseGender(getCell(row, headerMap, 'gender', 'sex'))
    const pwd = parsePwd(getCell(row, headerMap, 'pwd', 'disability'))

    const countyRaw = getCell(row, headerMap, 'county', 'countyname', 'county name')
    const constRaw = getCell(row, headerMap, 'constituency', 'constname', 'constituency name')
    const wardRaw = getCell(row, headerMap, 'ward', 'wardname', 'ward name')

    const loc = resolveLocation(countyRaw, constRaw, wardRaw)

    const data = {
      ippmsId,
      surname,
      otherNames,
      dateOfBirth,
      gender,
      pwd,
      countyCode: loc.countyCode,
      constituencyCode: loc.constituencyCode,
      wardCode: loc.wardCode,
    }

    try {
      await prisma.member.upsert({
        where: { idNumber },
        create: {
          idNumber,
          ...data,
          status: 'active',
        },
        update: data,
      })
      upserted++
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      errors.push(`Row ${r + 1} ID ${idNumber}: ${msg}`)
    }

    if (r % 100 === 0) {
      process.stdout.write(`\rProcessed ${r} / ${rows.length - 1}`)
    }
  }

  console.log('\nDone.')
  console.log({ upserted, skipped, errorCount: errors.length })
  if (errors.length > 0) {
    console.log('First errors:', errors.slice(0, 15))
    if (errors.length > 15) console.log(`... and ${errors.length - 15} more`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
