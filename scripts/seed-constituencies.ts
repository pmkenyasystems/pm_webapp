import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Constituency data: [constituencyCode, constituencyName, countyCode]
const constituencies = [
  // 001 – MOMBASA COUNTY
  { code: 1, name: 'Changamwe', countyCode: 1 },
  { code: 2, name: 'Jomvu', countyCode: 1 },
  { code: 3, name: 'Kisauni', countyCode: 1 },
  { code: 4, name: 'Nyali', countyCode: 1 },
  { code: 5, name: 'Likoni', countyCode: 1 },
  { code: 6, name: 'Mvita', countyCode: 1 },
  
  // 002 – KWALE COUNTY
  { code: 7, name: 'Msambweni', countyCode: 2 },
  { code: 8, name: 'Lunga Lunga', countyCode: 2 },
  { code: 9, name: 'Matuga', countyCode: 2 },
  { code: 10, name: 'Kinango', countyCode: 2 },
  
  // 003 – KILIFI COUNTY
  { code: 11, name: 'Kilifi North', countyCode: 3 },
  { code: 12, name: 'Kilifi South', countyCode: 3 },
  { code: 13, name: 'Kaloleni', countyCode: 3 },
  { code: 14, name: 'Rabai', countyCode: 3 },
  { code: 15, name: 'Ganze', countyCode: 3 },
  { code: 16, name: 'Malindi', countyCode: 3 },
  { code: 17, name: 'Magarini', countyCode: 3 },
  
  // 004 – TANA RIVER COUNTY
  { code: 18, name: 'Garsen', countyCode: 4 },
  { code: 19, name: 'Galole', countyCode: 4 },
  { code: 20, name: 'Bura', countyCode: 4 },
  
  // 005 – LAMU COUNTY
  { code: 21, name: 'Lamu East', countyCode: 5 },
  { code: 22, name: 'Lamu West', countyCode: 5 },
  
  // 006 – TAITA TAVETA COUNTY
  { code: 23, name: 'Taveta', countyCode: 6 },
  { code: 24, name: 'Wundanyi', countyCode: 6 },
  { code: 25, name: 'Mwatate', countyCode: 6 },
  { code: 26, name: 'Voi', countyCode: 6 },
  
  // 007 – GARISSA COUNTY
  { code: 27, name: 'Garissa Township', countyCode: 7 },
  { code: 28, name: 'Balambala', countyCode: 7 },
  { code: 29, name: 'Lagdera', countyCode: 7 },
  { code: 30, name: 'Dadaab', countyCode: 7 },
  { code: 31, name: 'Fafi', countyCode: 7 },
  { code: 32, name: 'Ijara', countyCode: 7 },
  
  // 008 – WAJIR COUNTY
  { code: 33, name: 'Wajir North', countyCode: 8 },
  { code: 34, name: 'Wajir East', countyCode: 8 },
  { code: 35, name: 'Tarbaj', countyCode: 8 },
  { code: 36, name: 'Wajir West', countyCode: 8 },
  { code: 37, name: 'Eldas', countyCode: 8 },
  { code: 38, name: 'Wajir South', countyCode: 8 },
  
  // 009 – MANDERA COUNTY
  { code: 39, name: 'Mandera West', countyCode: 9 },
  { code: 40, name: 'Banissa', countyCode: 9 },
  { code: 41, name: 'Mandera North', countyCode: 9 },
  { code: 42, name: 'Mandera South', countyCode: 9 },
  { code: 43, name: 'Mandera East', countyCode: 9 },
  { code: 44, name: 'Lafey', countyCode: 9 },
  
  // 010 – MARSABIT COUNTY
  { code: 45, name: 'Moyale', countyCode: 10 },
  { code: 46, name: 'North Horr', countyCode: 10 },
  { code: 47, name: 'Saku', countyCode: 10 },
  { code: 48, name: 'Laisamis', countyCode: 10 },
  
  // 011 – ISIOLO COUNTY
  { code: 49, name: 'Isiolo North', countyCode: 11 },
  { code: 50, name: 'Isiolo South', countyCode: 11 },
  
  // 012 – MERU COUNTY
  { code: 51, name: 'Igembe South', countyCode: 12 },
  { code: 52, name: 'Igembe Central', countyCode: 12 },
  { code: 53, name: 'Igembe North', countyCode: 12 },
  { code: 54, name: 'Tigania West', countyCode: 12 },
  { code: 55, name: 'Tigania East', countyCode: 12 },
  { code: 56, name: 'North Imenti', countyCode: 12 },
  { code: 57, name: 'Buuri', countyCode: 12 },
  { code: 58, name: 'Central Imenti', countyCode: 12 },
  { code: 59, name: 'South Imenti', countyCode: 12 },
  
  // 013 – THARAKA-NITHI COUNTY
  { code: 60, name: 'Maara', countyCode: 13 },
  { code: 61, name: "Chuka/Igambang'ombe", countyCode: 13 },
  { code: 62, name: 'Tharaka', countyCode: 13 },
  
  // 014 – EMBU COUNTY
  { code: 63, name: 'Manyatta', countyCode: 14 },
  { code: 64, name: 'Runyenjes', countyCode: 14 },
  { code: 65, name: 'Mbeere South', countyCode: 14 },
  { code: 66, name: 'Mbeere North', countyCode: 14 },
  
  // 015 – KITUI COUNTY
  { code: 67, name: 'Mwingi North', countyCode: 15 },
  { code: 68, name: 'Mwingi West', countyCode: 15 },
  { code: 69, name: 'Mwingi Central', countyCode: 15 },
  { code: 70, name: 'Kitui West', countyCode: 15 },
  { code: 71, name: 'Kitui Rural', countyCode: 15 },
  { code: 72, name: 'Kitui Central', countyCode: 15 },
  { code: 73, name: 'Kitui East', countyCode: 15 },
  { code: 74, name: 'Kitui South', countyCode: 15 },
  
  // 016 – MACHAKOS COUNTY
  { code: 75, name: 'Masinga', countyCode: 16 },
  { code: 76, name: 'Yatta', countyCode: 16 },
  { code: 77, name: 'Kangundo', countyCode: 16 },
  { code: 78, name: 'Matungulu', countyCode: 16 },
  { code: 79, name: 'Kathiani', countyCode: 16 },
  { code: 80, name: 'Mavoko', countyCode: 16 },
  { code: 81, name: 'Machakos Town', countyCode: 16 },
  { code: 82, name: 'Mwala', countyCode: 16 },
  
  // 017 – MAKUENI COUNTY
  { code: 83, name: 'Mbooni', countyCode: 17 },
  { code: 84, name: 'Kilome', countyCode: 17 },
  { code: 85, name: 'Kaiti', countyCode: 17 },
  { code: 86, name: 'Makueni', countyCode: 17 },
  { code: 87, name: 'Kibwezi West', countyCode: 17 },
  { code: 88, name: 'Kibwezi East', countyCode: 17 },
  
  // 018 – NYANDARUA COUNTY
  { code: 89, name: 'Kinangop', countyCode: 18 },
  { code: 90, name: 'Kipipiri', countyCode: 18 },
  { code: 91, name: 'Ol Kalou', countyCode: 18 },
  { code: 92, name: 'Ol Jorok', countyCode: 18 },
  { code: 93, name: 'Ndaragwa', countyCode: 18 },
  
  // 019 – NYERI COUNTY
  { code: 94, name: 'Tetu', countyCode: 19 },
  { code: 95, name: 'Kieni', countyCode: 19 },
  { code: 96, name: 'Mathira', countyCode: 19 },
  { code: 97, name: 'Othaya', countyCode: 19 },
  { code: 98, name: 'Mukurweini', countyCode: 19 },
  { code: 99, name: 'Nyeri Town', countyCode: 19 },
  
  // 020 – KIRINYAGA COUNTY
  { code: 100, name: 'Mwea', countyCode: 20 },
  { code: 101, name: 'Gichugu', countyCode: 20 },
  { code: 102, name: 'Ndia', countyCode: 20 },
  { code: 103, name: 'Kirinyaga Central', countyCode: 20 },
  
  // 021 – MURANG'A COUNTY
  { code: 104, name: 'Kangema', countyCode: 21 },
  { code: 105, name: 'Mathioya', countyCode: 21 },
  { code: 106, name: 'Kiharu', countyCode: 21 },
  { code: 107, name: 'Kigumo', countyCode: 21 },
  { code: 108, name: 'Maragwa', countyCode: 21 },
  { code: 109, name: 'Kandara', countyCode: 21 },
  { code: 110, name: 'Gatanga', countyCode: 21 },
  
  // 022 – KIAMBU COUNTY
  { code: 111, name: 'Gatundu South', countyCode: 22 },
  { code: 112, name: 'Gatundu North', countyCode: 22 },
  { code: 113, name: 'Juja', countyCode: 22 },
  { code: 114, name: 'Thika Town', countyCode: 22 },
  { code: 115, name: 'Ruiru', countyCode: 22 },
  { code: 116, name: 'Githunguri', countyCode: 22 },
  { code: 117, name: 'Kiambu', countyCode: 22 },
  { code: 118, name: 'Kiambaa', countyCode: 22 },
  { code: 119, name: 'Kabete', countyCode: 22 },
  { code: 120, name: 'Kikuyu', countyCode: 22 },
  { code: 121, name: 'Limuru', countyCode: 22 },
  { code: 122, name: 'Lari', countyCode: 22 },
  
  // 023 – TURKANA COUNTY
  { code: 123, name: 'Turkana North', countyCode: 23 },
  { code: 124, name: 'Turkana West', countyCode: 23 },
  { code: 125, name: 'Turkana Central', countyCode: 23 },
  { code: 126, name: 'Loima', countyCode: 23 },
  { code: 127, name: 'Turkana South', countyCode: 23 },
  { code: 128, name: 'Turkana East', countyCode: 23 },
  
  // 024 – WEST POKOT COUNTY
  { code: 129, name: 'Kapenguria', countyCode: 24 },
  { code: 130, name: 'Sigor', countyCode: 24 },
  { code: 131, name: 'Kacheliba', countyCode: 24 },
  { code: 132, name: 'Pokot South', countyCode: 24 },
  
  // 025 – SAMBURU COUNTY
  { code: 133, name: 'Samburu West', countyCode: 25 },
  { code: 134, name: 'Samburu North', countyCode: 25 },
  { code: 135, name: 'Samburu East', countyCode: 25 },
  
  // 026 – TRANS NZOIA COUNTY
  { code: 136, name: 'Kwanza', countyCode: 26 },
  { code: 137, name: 'Endebess', countyCode: 26 },
  { code: 138, name: 'Saboti', countyCode: 26 },
  { code: 139, name: 'Kiminini', countyCode: 26 },
  { code: 140, name: 'Cherangany', countyCode: 26 },
  
  // 027 – UASIN GISHU COUNTY
  { code: 141, name: 'Soy', countyCode: 27 },
  { code: 142, name: 'Turbo', countyCode: 27 },
  { code: 143, name: 'Moiben', countyCode: 27 },
  { code: 144, name: 'Ainabkoi', countyCode: 27 },
  { code: 145, name: 'Kapseret', countyCode: 27 },
  { code: 146, name: 'Kesses', countyCode: 27 },
  
  // 028 – ELGEYO MARAKWET COUNTY
  { code: 147, name: 'Marakwet East', countyCode: 28 },
  { code: 148, name: 'Marakwet West', countyCode: 28 },
  { code: 149, name: 'Keiyo North', countyCode: 28 },
  { code: 150, name: 'Keiyo South', countyCode: 28 },
  
  // 029 – NANDI COUNTY
  { code: 151, name: 'Tinderet', countyCode: 29 },
  { code: 152, name: 'Aldai', countyCode: 29 },
  { code: 153, name: 'Nandi Hills', countyCode: 29 },
  { code: 154, name: 'Chesumei', countyCode: 29 },
  { code: 155, name: 'Emgwen', countyCode: 29 },
  { code: 156, name: 'Mosop', countyCode: 29 },
  
  // 030 – BARINGO COUNTY
  { code: 157, name: 'Tiaty', countyCode: 30 },
  { code: 158, name: 'Baringo North', countyCode: 30 },
  { code: 159, name: 'Baringo Central', countyCode: 30 },
  { code: 160, name: 'Baringo South', countyCode: 30 },
  { code: 161, name: 'Mogotio', countyCode: 30 },
  { code: 162, name: 'Eldama Ravine', countyCode: 30 },
  
  // 031 – LAIKIPIA COUNTY
  { code: 163, name: 'Laikipia West', countyCode: 31 },
  { code: 164, name: 'Laikipia East', countyCode: 31 },
  { code: 165, name: 'Laikipia North', countyCode: 31 },
  
  // 032 – NAKURU COUNTY
  { code: 166, name: 'Molo', countyCode: 32 },
  { code: 167, name: 'Njoro', countyCode: 32 },
  { code: 168, name: 'Naivasha', countyCode: 32 },
  { code: 169, name: 'Gilgil', countyCode: 32 },
  { code: 170, name: 'Kuresoi South', countyCode: 32 },
  { code: 171, name: 'Kuresoi North', countyCode: 32 },
  { code: 172, name: 'Subukia', countyCode: 32 },
  { code: 173, name: 'Rongai', countyCode: 32 },
  { code: 174, name: 'Bahati', countyCode: 32 },
  { code: 175, name: 'Nakuru Town West', countyCode: 32 },
  { code: 176, name: 'Nakuru Town East', countyCode: 32 },
  
  // 033 – NAROK COUNTY
  { code: 177, name: 'Kilgoris', countyCode: 33 },
  { code: 178, name: 'Emurua Dikirr', countyCode: 33 },
  { code: 179, name: 'Narok North', countyCode: 33 },
  { code: 180, name: 'Narok East', countyCode: 33 },
  { code: 181, name: 'Narok South', countyCode: 33 },
  { code: 182, name: 'Narok West', countyCode: 33 },
  
  // 034 – KAJIADO COUNTY
  { code: 183, name: 'Kajiado North', countyCode: 34 },
  { code: 184, name: 'Kajiado Central', countyCode: 34 },
  { code: 185, name: 'Kajiado East', countyCode: 34 },
  { code: 186, name: 'Kajiado West', countyCode: 34 },
  { code: 187, name: 'Kajiado South', countyCode: 34 },
  
  // 035 – KERICHO COUNTY
  { code: 188, name: 'Kipkelion East', countyCode: 35 },
  { code: 189, name: 'Kipkelion West', countyCode: 35 },
  { code: 190, name: 'Ainamoi', countyCode: 35 },
  { code: 191, name: 'Bureti', countyCode: 35 },
  { code: 192, name: 'Belgut', countyCode: 35 },
  { code: 193, name: 'Sigowet/Soin', countyCode: 35 },
  
  // 036 – BOMET COUNTY
  { code: 194, name: 'Sotik', countyCode: 36 },
  { code: 195, name: 'Chepalungu', countyCode: 36 },
  { code: 196, name: 'Bomet East', countyCode: 36 },
  { code: 197, name: 'Bomet Central', countyCode: 36 },
  { code: 198, name: 'Konoin', countyCode: 36 },
  
  // 037 – KAKAMEGA COUNTY
  { code: 199, name: 'Lugari', countyCode: 37 },
  { code: 200, name: 'Likuyani', countyCode: 37 },
  { code: 201, name: 'Malava', countyCode: 37 },
  { code: 202, name: 'Lurambi', countyCode: 37 },
  { code: 203, name: 'Navakholo', countyCode: 37 },
  { code: 204, name: 'Mumias West', countyCode: 37 },
  { code: 205, name: 'Mumias East', countyCode: 37 },
  { code: 206, name: 'Matungu', countyCode: 37 },
  { code: 207, name: 'Butere', countyCode: 37 },
  { code: 208, name: 'Khwisero', countyCode: 37 },
  { code: 209, name: 'Shinyalu', countyCode: 37 },
  { code: 210, name: 'Ikolomani', countyCode: 37 },
  
  // 038 – VIHIGA COUNTY
  { code: 211, name: 'Vihiga', countyCode: 38 },
  { code: 212, name: 'Sabatia', countyCode: 38 },
  { code: 213, name: 'Hamisi', countyCode: 38 },
  { code: 214, name: 'Luanda', countyCode: 38 },
  { code: 215, name: 'Emuhaya', countyCode: 38 },
  
  // 039 – BUNGOMA COUNTY
  { code: 216, name: 'Mt. Elgon', countyCode: 39 },
  { code: 217, name: 'Sirisia', countyCode: 39 },
  { code: 218, name: 'Kabuchai', countyCode: 39 },
  { code: 219, name: 'Bumula', countyCode: 39 },
  { code: 220, name: 'Kanduyi', countyCode: 39 },
  { code: 221, name: 'Webuye East', countyCode: 39 },
  { code: 222, name: 'Webuye West', countyCode: 39 },
  { code: 223, name: 'Kimilili', countyCode: 39 },
  { code: 224, name: 'Tongaren', countyCode: 39 },
  
  // 040 – BUSIA COUNTY
  { code: 225, name: 'Teso North', countyCode: 40 },
  { code: 226, name: 'Teso South', countyCode: 40 },
  { code: 227, name: 'Nambale', countyCode: 40 },
  { code: 228, name: 'Matayos', countyCode: 40 },
  { code: 229, name: 'Butula', countyCode: 40 },
  { code: 230, name: 'Funyula', countyCode: 40 },
  { code: 231, name: 'Budalangi', countyCode: 40 },
  
  // 041 – SIAYA COUNTY
  { code: 232, name: 'Ugenya', countyCode: 41 },
  { code: 233, name: 'Ugunja', countyCode: 41 },
  { code: 234, name: 'Alego Usonga', countyCode: 41 },
  { code: 235, name: 'Gem', countyCode: 41 },
  { code: 236, name: 'Bondo', countyCode: 41 },
  { code: 237, name: 'Rarieda', countyCode: 41 },
  
  // 042 – KISUMU COUNTY
  { code: 238, name: 'Kisumu East', countyCode: 42 },
  { code: 239, name: 'Kisumu West', countyCode: 42 },
  { code: 240, name: 'Kisumu Central', countyCode: 42 },
  { code: 241, name: 'Seme', countyCode: 42 },
  { code: 242, name: 'Nyando', countyCode: 42 },
  { code: 243, name: 'Muhoroni', countyCode: 42 },
  { code: 244, name: 'Nyakach', countyCode: 42 },
  
  // 043 – HOMA BAY COUNTY
  { code: 245, name: 'Kasipul', countyCode: 43 },
  { code: 246, name: 'Kabondo Kasipul', countyCode: 43 },
  { code: 247, name: 'Karachuonyo', countyCode: 43 },
  { code: 248, name: 'Rangwe', countyCode: 43 },
  { code: 249, name: 'Homa Bay Town', countyCode: 43 },
  { code: 250, name: 'Ndhiwa', countyCode: 43 },
  { code: 251, name: 'Suba North', countyCode: 43 },
  { code: 252, name: 'Suba South', countyCode: 43 },
  
  // 044 – MIGORI COUNTY
  { code: 253, name: 'Rongo', countyCode: 44 },
  { code: 254, name: 'Awendo', countyCode: 44 },
  { code: 255, name: 'Suna East', countyCode: 44 },
  { code: 256, name: 'Suna West', countyCode: 44 },
  { code: 257, name: 'Uriri', countyCode: 44 },
  { code: 258, name: 'Nyatike', countyCode: 44 },
  { code: 259, name: 'Kuria West', countyCode: 44 },
  { code: 260, name: 'Kuria East', countyCode: 44 },
  
  // 045 – KISII COUNTY
  { code: 261, name: 'Bonchari', countyCode: 45 },
  { code: 262, name: 'South Mugirango', countyCode: 45 },
  { code: 263, name: 'Bomachoge Borabu', countyCode: 45 },
  { code: 264, name: 'Bobasi', countyCode: 45 },
  { code: 265, name: 'Bomachoge Chache', countyCode: 45 },
  { code: 266, name: 'Nyaribari Masaba', countyCode: 45 },
  { code: 267, name: 'Nyaribari Chache', countyCode: 45 },
  { code: 268, name: 'Kitutu Chache North', countyCode: 45 },
  { code: 269, name: 'Kitutu Chache South', countyCode: 45 },
  
  // 046 – NYAMIRA COUNTY
  { code: 270, name: 'Kitutu Masaba', countyCode: 46 },
  { code: 271, name: 'West Mugirango', countyCode: 46 },
  { code: 272, name: 'North Mugirango', countyCode: 46 },
  { code: 273, name: 'Borabu', countyCode: 46 },
  
  // 047 – NAIROBI CITY COUNTY
  { code: 274, name: 'Westlands', countyCode: 47 },
  { code: 275, name: 'Dagoretti North', countyCode: 47 },
  { code: 276, name: 'Dagoretti South', countyCode: 47 },
  { code: 277, name: "Lang'ata", countyCode: 47 },
  { code: 278, name: 'Kibra', countyCode: 47 },
  { code: 279, name: 'Roysambu', countyCode: 47 },
  { code: 280, name: 'Kasarani', countyCode: 47 },
  { code: 281, name: 'Ruaraka', countyCode: 47 },
  { code: 282, name: 'Embakasi South', countyCode: 47 },
  { code: 283, name: 'Embakasi North', countyCode: 47 },
  { code: 284, name: 'Embakasi Central', countyCode: 47 },
  { code: 285, name: 'Embakasi East', countyCode: 47 },
  { code: 286, name: 'Embakasi West', countyCode: 47 },
  { code: 287, name: 'Makadara', countyCode: 47 },
  { code: 288, name: 'Kamukunji', countyCode: 47 },
  { code: 289, name: 'Starehe', countyCode: 47 },
  { code: 290, name: 'Mathare', countyCode: 47 },
]

async function main() {
  console.log('Seeding constituencies...')

  if (constituencies.length === 0) {
    console.log('⚠️  No constituencies to seed. Please add constituency data to the script.')
    return
  }

  for (const constituency of constituencies) {
    try {
      // Check if county exists
      const county = await prisma.county.findUnique({
        where: { countyCode: constituency.countyCode },
      })

      if (!county) {
        console.log(`⚠️  County with code ${constituency.countyCode} not found. Skipping ${constituency.name}`)
        continue
      }

      await prisma.constituency.upsert({
        where: { constituencyCode: constituency.code },
        update: {
          constituencyName: constituency.name,
          countyCode: constituency.countyCode,
        },
        create: {
          constituencyCode: constituency.code,
          constituencyName: constituency.name,
          countyCode: constituency.countyCode,
        },
      })
      console.log(`✓ ${constituency.name} (Code: ${constituency.code}, County: ${county.countyName})`)
    } catch (error: any) {
      console.error(`✗ Error seeding ${constituency.name}:`, error.message)
    }
  }

  console.log('\n✅ Constituencies seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding constituencies:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

