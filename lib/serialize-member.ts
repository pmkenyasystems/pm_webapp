import type { County, Constituency, Ward } from '@prisma/client'

/** Member row with optional location relations (password may be omitted). */
export type MemberWithLocation = Record<string, unknown> & {
  county?: County | null
  constituency?: Constituency | null
  ward?: Ward | null
  password?: string | null
}

/** Flatten location relations for API responses (string names for county/constituency/ward). */
export function serializeMemberForApi(m: MemberWithLocation) {
  const { password: _pw, county, constituency, ward, ...rest } = m
  return {
    ...rest,
    county: county?.countyName ?? null,
    constituency: constituency?.constituencyName ?? null,
    ward: ward?.wardName ?? null,
  }
}
