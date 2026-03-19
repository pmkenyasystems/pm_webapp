/**
 * Seed Kakamega members from a TSV file with columns:
 * MEMBERSHIPNO	IDNO_PASSPORTNO	SURNAME	OTHERNAMES	BIRTHDATE	GENDER	PWD	COUNTYNAME	CONSTNAME	WARDNAME
 * Usage: npx tsx scripts/seed-kakamega-members-from-tsv.ts [path-to.tsv]
 * Default: scripts/data/kakamega-members-import.tsv
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const KAKAMEGA_COUNTY_CODE = '37'

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
  CHEVAYWA: '995',
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
  return CONSTITUENCY_MAP[normalize(name)] ?? null
}

function getWardCode(name: string): string | null {
  return WARD_MAP[normalize(name)] ?? null
}

function parseRow(cols: string[]): {
  idNumber: string
  surname: string
  otherNames: string
  dateOfBirth: Date | null
  gender: string | null
  pwd: boolean
  constName: string
  wardName: string
  ippmsId: string | null
} | null {
  if (cols.length < 10) return null
  const membershipNo = cols[0]?.trim() || null
  const idNumber = (cols[1] ?? '').trim()
  if (!idNumber) return null
  const surname = (cols[2] ?? '').trim()
  const otherNames = (cols[3] ?? '').trim()
  if (!surname && !otherNames) return null
  const birthStr = (cols[4] ?? '').trim()
  let dateOfBirth: Date | null = null
  if (birthStr && /^\d{4}-\d{2}-\d{2}$/.test(birthStr)) {
    const d = new Date(birthStr)
    if (!isNaN(d.getTime())) dateOfBirth = d
  }
  let gender = (cols[5] ?? '').trim() || null
  if (gender === 'M') gender = 'MALE'
  if (gender === 'F') gender = 'FEMALE'
  const pwdRaw = (cols[6] ?? '').trim().toUpperCase()
  const pwd = pwdRaw === 'YES' || pwdRaw === 'Y' || pwdRaw === '1' || pwdRaw === 'TRUE'
  const countyName = (cols[7] ?? '').trim()
  const constName = (cols[8] ?? '').trim()
  const wardName = (cols[9] ?? '').trim()
  if (!constName || !wardName) return null
  if (countyName.toUpperCase() !== 'KAKAMEGA') return null
  return {
    idNumber,
    surname: surname || 'Unknown',
    otherNames: otherNames || '',
    dateOfBirth,
    gender,
    pwd,
    constName,
    wardName,
    ippmsId: membershipNo && membershipNo.startsWith('PM-') ? membershipNo : null,
  }
}

async function main() {
  const inputPath =
    process.argv[2] ||
    path.join(process.cwd(), 'scripts', 'data', 'kakamega-members-import.tsv')

  if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`)
    console.error('Usage: npx tsx scripts/seed-kakamega-members-from-tsv.ts [path-to.tsv]')
    process.exit(1)
  }

  const raw = fs.readFileSync(inputPath, 'utf-8')
  const lines = raw.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) {
    console.error('TSV must have header + at least one data row.')
    process.exit(1)
  }

  const defaultPassword = 'ChangeMe123!'
  const hashedPassword = await bcrypt.hash(defaultPassword, 10)

  const rows: NonNullable<ReturnType<typeof parseRow>>[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t')
    const row = parseRow(cols)
    if (row) rows.push(row)
  }

  console.log(`Parsed ${rows.length} members from ${inputPath}.`)

  let created = 0
  let updated = 0
  let skipped = 0

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const constituencyCode = getConstituencyCode(row.constName)
    const wardCode = getWardCode(row.wardName)
    if (!constituencyCode || !wardCode) {
      if (skipped < 5)
        console.warn(`  Skip (no code): ${row.surname} ${row.otherNames} – ${row.constName} / ${row.wardName}`)
      skipped++
      continue
    }

    try {
      const existing = await prisma.member.findUnique({
        where: { idNumber: row.idNumber },
      })
      const ippmsId = existing?.ippmsId ?? row.ippmsId ?? `KAK-${row.idNumber}`

      const data = {
        idNumber: row.idNumber,
        ...(ippmsId && { ippmsId }),
        surname: row.surname,
        otherNames: row.otherNames,
        dateOfBirth: row.dateOfBirth,
        gender: row.gender,
        pwd: row.pwd,
        county: KAKAMEGA_COUNTY_CODE,
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
            pwd: data.pwd,
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

    if ((i + 1) % 200 === 0) console.log(`  Processed ${i + 1}/${rows.length}...`)
  }

  console.log(`\nDone. Created: ${created}, Updated: ${updated}, Skipped: ${skipped}.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
