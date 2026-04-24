/**
 * Generates a minimal GeoJSON for Kenya 47 counties (grid layout).
 * Run: npx tsx scripts/generate-kenya-counties-geojson.ts
 * Output: public/geojson/kenya-counties.json
 */

import * as fs from 'fs'
import * as path from 'path'

const COUNTY_NAMES: Record<number, string> = {
  1: 'Mombasa', 2: 'Kwale', 3: 'Kilifi', 4: 'Tana River', 5: 'Lamu',
  6: 'Taita/Taveta', 7: 'Garissa', 8: 'Wajir', 9: 'Mandera', 10: 'Marsabit',
  11: 'Isiolo', 12: 'Meru', 13: 'Tharaka-Nithi', 14: 'Embu', 15: 'Kitui',
  16: 'Machakos', 17: 'Makueni', 18: 'Nyandarua', 19: 'Nyeri', 20: 'Kirinyaga',
  21: "Murang'a", 22: 'Kiambu', 23: 'Turkana', 24: 'West Pokot', 25: 'Samburu',
  26: 'Trans-Nzoia', 27: 'Uasin Gishu', 28: 'Elgeyo-Marakwet', 29: 'Nandi',
  30: 'Baringo', 31: 'Laikipia', 32: 'Nakuru', 33: 'Narok', 34: 'Kajiado',
  35: 'Kericho', 36: 'Bomet', 37: 'Kakamega', 38: 'Vihiga', 39: 'Bungoma',
  40: 'Busia', 41: 'Siaya', 42: 'Kisumu', 43: 'Homa Bay', 44: 'Migori',
  45: 'Kisii', 46: 'Nyamira', 47: 'Nairobi',
}

const MIN_LON = 33.9
const MAX_LON = 41.9
const MIN_LAT = -4.7
const MAX_LAT = 5.0
const COLS = 7
const ROWS = 7
const W = (MAX_LON - MIN_LON) / COLS
const H = (MAX_LAT - MIN_LAT) / ROWS

const features: Array<{ type: 'Feature'; properties: { countyCode: number; name: string }; geometry: { type: 'Polygon'; coordinates: number[][][] } }> = []
for (let i = 0; i < 47; i++) {
  const col = i % COLS
  const row = Math.floor(i / COLS)
  const left = MIN_LON + col * W
  const bottom = MIN_LAT + row * H
  const right = left + W
  const top = bottom + H
  const code = i + 1
  const name = COUNTY_NAMES[code] ?? `County ${code}`
  features.push({
    type: 'Feature',
    properties: { countyCode: code, name },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [left, bottom],
        [right, bottom],
        [right, top],
        [left, top],
        [left, bottom],
      ]],
    },
  })
}

const geojson = {
  type: 'FeatureCollection',
  features,
}

const outDir = path.join(process.cwd(), 'public', 'geojson')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(
  path.join(outDir, 'kenya-counties.json'),
  JSON.stringify(geojson),
  'utf-8'
)
console.log('Wrote public/geojson/kenya-counties.json')
