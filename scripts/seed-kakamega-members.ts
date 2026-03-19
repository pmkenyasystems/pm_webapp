/**
 * Seed members from Kakamega County register (PDF or tab-separated TXT).
 * Usage: npx tsx scripts/seed-kakamega-members.ts [path-to-register.pdf-or-.txt]
 * If no path is given, uses scripts/data/kakamega-register.txt
 *
 * For PDF: ensure pdf-parse is installed (npm install pdf-parse).
 * Or export the PDF to plain text and pass the .txt path.
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const KAKAMEGA_COUNTY_CODE = '37'

// Constituency name (uppercase, normalized) -> code
const CONSTITUENCY_MAP: Record<string, string> = {
  LUGARI: '199',
  LIKUYANI: '200',
  MALAVA: '201',
  LURAMBI: '202',
  NAVAKHOLO: '203',
  'MUMIAS WEST': '204',
  'MUMIAS EAST': '205',
  MATUNGU: '206',
  BUTERE: '207',
  KHWISERO: '208',
  SHINYALU: '209',
  IKOLOMANI: '210',
}

// Ward name (uppercase, normalized: spaces to single, " - " to "-") -> code
const WARD_MAP: Record<string, string> = {
  MURHANDA: '1046',
  'ISUKHA WEST': '1045',
  'ISUKHA SOUTH': '1043',
  'ISUKHA NORTH': '1041',
  'ISUKHA EAST': '1044',
  'ISUKHA CENTRAL': '1042',
  'IDAKHO EAST': '1048',
  'IDAKHO SOUTH': '1047',
  'IDAKHO NORTH': '1049',
  'IDAKHO CENTRAL': '1050',
  'SHINOYI-SHIKOMARI-ESUMEYIA': '1016',
  'SHINOYI-SHIKOMARI-Esumeyia': '1016',
  'INGOSTSE-MATHIA': '1015',
  'INGOTSE-MATIOLI': '1015',
  'BUNYALA EAST': '1018',
  'BUNYALA WEST': '1017',
  'BUNYALA CENTRAL': '1019',
  'MUMIAS NORTH': '1021',
  'MUMIAS CENTRAL': '1020',
  'MALAHA/ISONGO/MAKUNGA': '1025',
  'EAST WANGA': '1026',
  NAMAMALI: '1031',
  MAYONI: '1030',
  KOYONZO: '1027',
  KHOLERA: '1028',
  KHALABA: '1029',
  'WEST KABRAS': '1002',
  'SOUTH KABRAS': '1006',
  'SHIRUGU-MUGAI': '1005',
  'MANDA-SHIVANGA': '1008',
  'BUTALI/CHEGULO': '1007',
  'EAST KABRAS': '1004',
  CHEMUCHE: '1003',
  SHIRERE: '1014',
  SHEYWE: '1012',
  'BUTSOTSO SOUTH': '1010',
  'BUTSOTSO EAST': '1009',
  'BUTSOTSO CENTRAL': '1011',
  LWANDETI: '996',
  LUMAKANDA: '993',
  LUGARI: '992',
  CHEVAYWA: '995', // Kivaywa
  KIVAYWA: '995',
  CHEKALINI: '994',
  SANGO: '998',
  NZOIA: '999',
  LIKUYANI: '997',
  KONGONI: '1001',
  SINOKO: '1000',
  'KISA EAST': '1038',
  'KISA CENTRAL': '1040',
  'KISA NORTH': '1037',
  'KISA WEST': '1039',
  'MARENYO - SHIANDA': '1034',
  'MARENYO-SHIANDA': '1034',
  'MARAMA WEST': '1032',
  'MARAMA CENTRAL': '1033',
  'MARAMA NORTH': '1035',
  'MARAMA SOUTH': '1036',
  MAUTUMA: '991',
  ETENJE: '1022',
  MUSANDA: '1023',
  'LUSHEYA/LUBINU': '1024',
  MAHIAKALO: '1013',
}

function normalize(s: string): string {
  return s
    .replace(/\s+/g, ' ')
    .replace(/\s*-\s*/g, '-')
    .trim()
    .toUpperCase()
}

function getConstituencyCode(name: string): string | null {
  const key = normalize(name)
  return CONSTITUENCY_MAP[key] ?? null
}

function getWardCode(name: string): string | null {
  const key = normalize(name)
  return WARD_MAP[key] ?? null
}

function parseLine(line: string): {
  idNumber: string
  surname: string
  otherNames: string
  dateOfBirth: Date | null
  gender: string | null
  countyName: string
  constName: string
  wardName: string
} | null {
  let cols = line.split(/\t/).map((c) => c.trim())
  if (cols.length < 10) {
    cols = line.split(/\s{2,}/).map((c) => c.trim())
  }
  if (cols.length < 10) return null

  let idNumber = (cols[3] || '').trim()
  let surname = cols[4] || ''
  let otherNames = cols[5] || ''
  if (idNumber && !/^\d+$/.test(idNumber)) {
    const match = (cols[3] || '').match(/(\d{7,})/)
    if (match) {
      idNumber = match[1]
      const rest = (cols[3] || '').replace(match[1], '').trim().replace(/\s+/g, ' ').trim()
      if (rest && !surname) surname = rest
    } else {
      const parts = (cols[3] || '').split(/\s+/)
      const numPart = parts.find((p) => /^\d{7,}$/.test(p))
      if (numPart) {
        idNumber = numPart
        const rest = parts.filter((p) => p !== numPart).join(' ')
        if (rest && !surname) surname = rest
      } else return null
    }
  }
  if (!idNumber || !/^\d{7,}$/.test(idNumber)) return null

  const dobStr = cols[6]
  let dateOfBirth: Date | null = null
  if (dobStr && /^\d{4}-\d{2}-\d{2}$/.test(dobStr)) {
    const d = new Date(dobStr)
    if (!isNaN(d.getTime())) dateOfBirth = d
  }
  let gender = cols[7] || null
  if (gender === 'M') gender = 'MALE'
  if (gender === 'F') gender = 'FEMALE'
  let countyName = cols[9] || cols[8] || ''
  let constName = cols[10] || cols[9] || ''
  let wardName = cols[11] || cols[10] || ''
  if (cols.length >= 13) {
    countyName = cols[cols.length - 3] || countyName
    constName = cols[cols.length - 2] || constName
    wardName = cols[cols.length - 1] || wardName
  }
  if (!line.includes('KAKAMEGA')) return null
  if (!countyName) countyName = 'KAKAMEGA'
  return {
    idNumber,
    surname,
    otherNames,
    dateOfBirth,
    gender,
    countyName,
    constName,
    wardName,
  }
}

async function extractTextFromPdf(pdfPath: string): Promise<string> {
  try {
    const { PDFParse } = await import('pdf-parse')
    const data = await fs.promises.readFile(pdfPath)
    const parser = new PDFParse({ data })
    const result = await parser.getText()
    await parser.destroy()
    return (result && (result as { text?: string }).text) || ''
  } catch (e: any) {
    throw new Error(
      `Could not read PDF. Install: npm install pdf-parse. Or export the PDF to .txt and pass that path. ${e?.message || e}`
    )
  }
}

async function main() {
  const inputPath =
    process.argv[2] ||
    path.join(process.cwd(), 'scripts', 'data', 'kakamega-register.txt')

  if (!fs.existsSync(inputPath)) {
    console.error(
      `File not found: ${inputPath}\nUsage: npx tsx scripts/seed-kakamega-members.ts [path-to-register.pdf-or-.txt]`
    )
    process.exit(1)
  }

  let rawText: string
  if (inputPath.toLowerCase().endsWith('.pdf')) {
    console.log('Reading PDF...')
    rawText = await extractTextFromPdf(inputPath)
  } else {
    rawText = fs.readFileSync(inputPath, 'utf-8')
  }

  const lines = rawText.split(/\r?\n/).filter((l) => l.trim())
  const members: ReturnType<typeof parseLine>[] = []
  for (const line of lines) {
    if (/^--\s*\d+\s+of\s+\d+\s*--/.test(line)) continue
    if (line.startsWith('SNo.') || line.startsWith('KAKAMEGA COUNTY')) continue
    const row = parseLine(line)
    if (row && row.countyName.toUpperCase() === 'KAKAMEGA') members.push(row)
  }

  if (members.length === 0 && lines.length > 2) {
    const dataLine = lines.find((l) => /^\d+\s+879\s+PM-/.test(l) || /^\d+\t879\t/.test(l))
    if (dataLine) {
      const byTab = dataLine.split(/\t/)
      const bySpaces = dataLine.split(/\s{2,}/)
      console.warn('First data line column count - by tab:', byTab.length, 'by 2+ spaces:', bySpaces.length)
      console.warn('By tab cols[3], [9],[10],[11]:', byTab[3], '|', byTab[9], '|', byTab[10], '|', byTab[11])
    }
    const sample = lines.slice(0, 5).join('\n')
    console.warn('Sample lines (first 5):\n', sample.slice(0, 800))
  }

  console.log(`Parsed ${members.length} members from Kakamega register.\n`)

  const countyCode = KAKAMEGA_COUNTY_CODE
  let created = 0
  let updated = 0
  let skipped = 0
  const hashedPassword = await bcrypt.hash('ChangeMe123!', 10)

  for (let i = 0; i < members.length; i++) {
    const row = members[i]
    if (!row) continue
    const constituencyCode = getConstituencyCode(row.constName)
    const wardCode = getWardCode(row.wardName)
    if (!constituencyCode || !wardCode) {
      if (i < 5 || skipped < 3)
        console.warn(
          `  Skip (no code): ${row.surname} ${row.otherNames} – const "${row.constName}" ward "${row.wardName}"`
        )
      skipped++
      continue
    }

    try {
      const existing = await prisma.member.findUnique({
        where: { idNumber: row.idNumber },
      })
      const ippmsId = existing?.ippmsId ?? `KAK-${row.idNumber}`

      const data = {
        idNumber: row.idNumber,
        ...(ippmsId && { ippmsId }),
        surname: row.surname,
        otherNames: row.otherNames,
        dateOfBirth: row.dateOfBirth,
        gender: row.gender,
        county: countyCode,
        constituency: constituencyCode,
        ward: wardCode,
        status: 'active' as const,
        password: existing?.password ?? hashedPassword,
      }

      if (existing) {
        await prisma.member.update({
          where: { idNumber: row.idNumber },
          data: {
            surname: data.surname,
            otherNames: data.otherNames,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            county: data.county,
            constituency: data.constituency,
            ward: data.ward,
          },
        })
        updated++
      } else {
        await prisma.member.create({
          data,
        })
        created++
      }
    } catch (e: any) {
      console.error(`Error upserting ${row.idNumber} (${row.surname}):`, e?.message || e)
    }

    if ((i + 1) % 200 === 0) console.log(`  Processed ${i + 1}/${members.length}...`)
  }

  console.log(`\nDone. Created: ${created}, Updated: ${updated}, Skipped: ${skipped}.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
