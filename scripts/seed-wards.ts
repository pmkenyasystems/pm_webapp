import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Ward data: [wardCode, wardName, constituencyCode]
const wards = [
  // Constituency 1 - Changamwe
  { code: 1, name: 'Port Reitz', constituencyCode: 1 },
  { code: 2, name: 'Kipevu', constituencyCode: 1 },
  { code: 3, name: 'Airport', constituencyCode: 1 },
  { code: 4, name: 'Changamwe', constituencyCode: 1 },
  { code: 5, name: 'Chaani', constituencyCode: 1 },
  
  // Constituency 2 - Jomvu
  { code: 6, name: 'Jomvu Kuu', constituencyCode: 2 },
  { code: 7, name: 'Miritini', constituencyCode: 2 },
  { code: 8, name: 'Mikindani', constituencyCode: 2 },
  
  // Constituency 3 - Kisauni
  { code: 9, name: 'Mjambere', constituencyCode: 3 },
  { code: 10, name: 'Junda', constituencyCode: 3 },
  { code: 11, name: 'Bamburi', constituencyCode: 3 },
  { code: 12, name: 'Mwakirunge', constituencyCode: 3 },
  { code: 13, name: 'Mtopanga', constituencyCode: 3 },
  { code: 14, name: 'Magogoni', constituencyCode: 3 },
  { code: 15, name: 'Shanzu', constituencyCode: 3 },
  
  // Constituency 4 - Nyali
  { code: 16, name: "Frere Town", constituencyCode: 4 },
  { code: 17, name: "Ziwa La Ng'ombe", constituencyCode: 4 },
  { code: 18, name: 'Mkomani', constituencyCode: 4 },
  { code: 19, name: 'Kongowea', constituencyCode: 4 },
  { code: 20, name: 'Kadzandani', constituencyCode: 4 },
  
  // Constituency 5 - Likoni
  { code: 21, name: 'Mtongwe', constituencyCode: 5 },
  { code: 22, name: 'Shika Adabu', constituencyCode: 5 },
  { code: 23, name: 'Bofu', constituencyCode: 5 },
  { code: 24, name: 'Likoni', constituencyCode: 5 },
  { code: 25, name: 'Timbwani', constituencyCode: 5 },
  
  // Constituency 6 - Mvita
  { code: 26, name: 'Mji wa Kale/Makadara', constituencyCode: 6 },
  { code: 27, name: 'Tudor', constituencyCode: 6 },
  { code: 28, name: 'Tononoka', constituencyCode: 6 },
  { code: 29, name: 'Shimanzi/Ganjoni', constituencyCode: 6 },
  { code: 30, name: 'Majengo', constituencyCode: 6 },
  
  // Constituency 7 - Msambweni
  { code: 31, name: 'Gombato Bongwe', constituencyCode: 7 },
  { code: 32, name: 'Ukunda', constituencyCode: 7 },
  { code: 33, name: 'Kinondo', constituencyCode: 7 },
  { code: 34, name: 'Ramisi', constituencyCode: 7 },
  
  // Constituency 8 - Lunga Lunga
  { code: 35, name: 'Pongwe/Kikoneni', constituencyCode: 8 },
  { code: 36, name: 'Dzombo', constituencyCode: 8 },
  { code: 37, name: 'Mwereni', constituencyCode: 8 },
  { code: 38, name: 'Vanga', constituencyCode: 8 },
  
  // Constituency 9 - Matuga
  { code: 39, name: 'Tsimba Golini', constituencyCode: 9 },
  { code: 40, name: 'Waa', constituencyCode: 9 },
  { code: 41, name: 'Tiwi', constituencyCode: 9 },
  { code: 42, name: 'Kubo South', constituencyCode: 9 },
  { code: 43, name: 'Mkongani', constituencyCode: 9 },
  
  // Constituency 10 - Kinango
  { code: 44, name: 'Ndavaya', constituencyCode: 10 },
  { code: 45, name: 'Puma', constituencyCode: 10 },
  { code: 46, name: 'Kinango', constituencyCode: 10 },
  { code: 47, name: 'Mackinnon Road', constituencyCode: 10 },
  { code: 48, name: 'Chengoni', constituencyCode: 10 },
  { code: 49, name: 'Mwavumbo', constituencyCode: 10 },
  { code: 50, name: 'Kasemeni', constituencyCode: 10 },
  { code: 1451, name: 'Samburu/Chengoni (New/Gazetted)', constituencyCode: 10 },
  
  // Constituency 11 - Kilifi North
  { code: 51, name: 'Tezo', constituencyCode: 11 },
  { code: 52, name: 'Sokoni', constituencyCode: 11 },
  { code: 53, name: 'Kibarani', constituencyCode: 11 },
  { code: 54, name: 'Dabaso', constituencyCode: 11 },
  { code: 55, name: 'Matsangoni', constituencyCode: 11 },
  { code: 56, name: 'Watamu', constituencyCode: 11 },
  { code: 57, name: 'Mnarani', constituencyCode: 11 },
  
  // Constituency 12 - Kilifi South
  { code: 58, name: 'Junju', constituencyCode: 12 },
  { code: 59, name: 'Mwarakaya', constituencyCode: 12 },
  { code: 60, name: 'Shimo La Tewa', constituencyCode: 12 },
  { code: 61, name: 'Chasimba', constituencyCode: 12 },
  { code: 62, name: 'Mtepeni', constituencyCode: 12 },
  
  // Constituency 13 - Kaloleni
  { code: 63, name: 'Mariakani', constituencyCode: 13 },
  { code: 64, name: 'Kayafungo', constituencyCode: 13 },
  { code: 65, name: 'Kaloleni', constituencyCode: 13 },
  { code: 66, name: 'Mwanamwinga', constituencyCode: 13 },
  
  // Constituency 14 - Rabai
  { code: 67, name: 'Mwawesa', constituencyCode: 14 },
  { code: 68, name: 'Ruruma', constituencyCode: 14 },
  { code: 69, name: 'Kambe/Ribe', constituencyCode: 14 },
  { code: 70, name: 'Rabai/Kisurutini', constituencyCode: 14 },
  
  // Constituency 15 - Ganze
  { code: 71, name: 'Ganze', constituencyCode: 15 },
  { code: 72, name: 'Bamba', constituencyCode: 15 },
  { code: 73, name: 'Jaribuni', constituencyCode: 15 },
  { code: 74, name: 'Sokoke', constituencyCode: 15 },
  
  // Constituency 16 - Malindi
  { code: 75, name: 'Jilore', constituencyCode: 16 },
  { code: 76, name: 'Kakuyuni', constituencyCode: 16 },
  { code: 77, name: 'Ganda', constituencyCode: 16 },
  { code: 78, name: 'Malindi Town', constituencyCode: 16 },
  { code: 79, name: 'Shella', constituencyCode: 16 },
  
  // Constituency 17 - Magarini
  { code: 80, name: 'Marafa', constituencyCode: 17 },
  { code: 81, name: 'Magarini', constituencyCode: 17 },
  { code: 82, name: 'Gongoni', constituencyCode: 17 },
  { code: 83, name: 'Adu', constituencyCode: 17 },
  { code: 84, name: 'Garashi', constituencyCode: 17 },
  { code: 85, name: 'Sabaki', constituencyCode: 17 },
  
  // Constituency 18 - Garsen
  { code: 86, name: 'Kipini East', constituencyCode: 18 },
  { code: 87, name: 'Garsen South', constituencyCode: 18 },
  { code: 88, name: 'Kipini West', constituencyCode: 18 },
  { code: 89, name: 'Garsen Central', constituencyCode: 18 },
  { code: 90, name: 'Garsen West', constituencyCode: 18 },
  { code: 91, name: 'Garsen North', constituencyCode: 18 },
  
  // Constituency 19 - Galole
  { code: 92, name: 'Kinakomba', constituencyCode: 19 },
  { code: 93, name: 'Mikinduni', constituencyCode: 19 },
  { code: 94, name: 'Chewani', constituencyCode: 19 },
  { code: 95, name: 'Wayu', constituencyCode: 19 },
  
  // Constituency 20 - Bura
  { code: 96, name: 'Chewele', constituencyCode: 20 },
  { code: 97, name: 'Hirimani', constituencyCode: 20 },
  { code: 98, name: 'Bangale', constituencyCode: 20 },
  { code: 99, name: 'Sala', constituencyCode: 20 },
  { code: 100, name: 'Madogo', constituencyCode: 20 },
  
  // Constituency 21 - Lamu East
  { code: 101, name: 'Faza', constituencyCode: 21 },
  { code: 102, name: 'Kiunga', constituencyCode: 21 },
  { code: 103, name: 'Basuba', constituencyCode: 21 },
  
  // Constituency 22 - Lamu West
  { code: 104, name: 'Shella', constituencyCode: 22 },
  { code: 105, name: 'Mkomani', constituencyCode: 22 },
  { code: 106, name: 'Hindi', constituencyCode: 22 },
  { code: 107, name: 'Mkunumbi', constituencyCode: 22 },
  { code: 108, name: 'Hongwe', constituencyCode: 22 },
  { code: 109, name: 'Witu', constituencyCode: 22 },
  { code: 110, name: 'Bahari', constituencyCode: 22 },
  
  // Constituency 23 - Taveta
  { code: 111, name: 'Chala', constituencyCode: 23 },
  { code: 112, name: 'Mahoo', constituencyCode: 23 },
  { code: 113, name: 'Bomani', constituencyCode: 23 },
  { code: 114, name: 'Mboghoni', constituencyCode: 23 },
  { code: 115, name: 'Mata', constituencyCode: 23 },
  
  // Constituency 24 - Wundanyi
  { code: 116, name: 'Wundanyi/Mbale', constituencyCode: 24 },
  { code: 117, name: 'Werugha', constituencyCode: 24 },
  { code: 118, name: 'Wumingu/Kishushe', constituencyCode: 24 },
  { code: 119, name: 'Mwanda/Mgange', constituencyCode: 24 },
  
  // Constituency 25 - Mwatate
  { code: 120, name: 'Ronge', constituencyCode: 25 },
  { code: 121, name: 'Mwatate', constituencyCode: 25 },
  { code: 122, name: 'Bura', constituencyCode: 25 },
  { code: 123, name: 'Chawia', constituencyCode: 25 },
  { code: 124, name: 'Wusi/Kishamba', constituencyCode: 25 },
  
  // Constituency 26 - Voi
  { code: 125, name: 'Mbololo', constituencyCode: 26 },
  { code: 126, name: 'Sagalla', constituencyCode: 26 },
  { code: 127, name: 'Kaloleni', constituencyCode: 26 },
  { code: 128, name: 'Marungu', constituencyCode: 26 },
  { code: 129, name: 'Kasigau', constituencyCode: 26 },
  { code: 130, name: 'Ngolia', constituencyCode: 26 },
  
  // Constituency 27 - Garissa Township
  { code: 131, name: 'Waberi', constituencyCode: 27 },
  { code: 132, name: 'Galbet', constituencyCode: 27 },
  { code: 133, name: 'Township', constituencyCode: 27 },
  { code: 134, name: 'Iftin', constituencyCode: 27 },
  
  // Constituency 28 - Balambala
  { code: 135, name: 'Balambala', constituencyCode: 28 },
  { code: 136, name: 'Danyere', constituencyCode: 28 },
  { code: 137, name: 'Jarajara', constituencyCode: 28 },
  { code: 138, name: 'Saka', constituencyCode: 28 },
  { code: 139, name: 'Sankuri', constituencyCode: 28 },
  
  // Constituency 29 - Lagdera
  { code: 140, name: 'Modogashe', constituencyCode: 29 },
  { code: 141, name: 'Benane', constituencyCode: 29 },
  { code: 142, name: 'Goreale', constituencyCode: 29 },
  { code: 143, name: 'Maalamin', constituencyCode: 29 },
  { code: 144, name: 'Sabena', constituencyCode: 29 },
  { code: 145, name: 'Baraki', constituencyCode: 29 },
  
  // Constituency 30 - Dadaab
  { code: 146, name: 'Dertu', constituencyCode: 30 },
  { code: 147, name: 'Dadaab', constituencyCode: 30 },
  { code: 148, name: 'Labisgale', constituencyCode: 30 },
  { code: 149, name: 'Damajale', constituencyCode: 30 },
  { code: 150, name: 'Liboi', constituencyCode: 30 },
  { code: 151, name: 'Abakaile', constituencyCode: 30 },
  
  // Constituency 31 - Fafi
  { code: 152, name: 'Bura', constituencyCode: 31 },
  { code: 153, name: 'Dekaharia', constituencyCode: 31 },
  { code: 154, name: 'Jarajila', constituencyCode: 31 },
  { code: 155, name: 'Fafi', constituencyCode: 31 },
  { code: 156, name: 'Nanighi', constituencyCode: 31 },
  
  // Constituency 32 - Ijara
  { code: 157, name: 'Hulugho', constituencyCode: 32 },
  { code: 158, name: 'Sangailu', constituencyCode: 32 },
  { code: 159, name: 'Ijara', constituencyCode: 32 },
  { code: 160, name: 'Masalani', constituencyCode: 32 },
  
  // Constituency 33 - Wajir North
  { code: 161, name: 'Gurar', constituencyCode: 33 },
  { code: 162, name: 'Bute', constituencyCode: 33 },
  { code: 163, name: 'Korondile', constituencyCode: 33 },
  { code: 164, name: 'Malkagufu', constituencyCode: 33 },
  { code: 165, name: 'Batalu', constituencyCode: 33 },
  { code: 166, name: 'Danaba', constituencyCode: 33 },
  { code: 167, name: 'Godoma', constituencyCode: 33 },
  
  // Constituency 34 - Wajir East
  { code: 168, name: 'Wagberi', constituencyCode: 34 },
  { code: 169, name: 'Township', constituencyCode: 34 },
  { code: 170, name: 'Barwago', constituencyCode: 34 },
  { code: 171, name: 'Khorof/Harar', constituencyCode: 34 },
  
  // Constituency 35 - Tarbaj
  { code: 172, name: 'Elben', constituencyCode: 35 },
  { code: 173, name: 'Sarman', constituencyCode: 35 },
  { code: 174, name: 'Tarbaj', constituencyCode: 35 },
  { code: 175, name: 'Wargadud', constituencyCode: 35 },
  
  // Constituency 36 - Wajir West
  { code: 176, name: 'Arbajahan', constituencyCode: 36 },
  { code: 177, name: 'Hadado/Athibohol', constituencyCode: 36 },
  { code: 178, name: 'Ademasajide', constituencyCode: 36 },
  { code: 179, name: 'Ganyure', constituencyCode: 36 },
  { code: 180, name: 'Wagalla', constituencyCode: 36 },
  
  // Constituency 37 - Eldas
  { code: 181, name: 'Eldas', constituencyCode: 37 },
  { code: 182, name: 'Della', constituencyCode: 37 },
  { code: 183, name: 'Lakoley South/Basir', constituencyCode: 37 },
  { code: 184, name: 'Elnur/Tula Tula', constituencyCode: 37 },
  
  // Constituency 38 - Wajir South
  { code: 185, name: 'Benane', constituencyCode: 38 },
  { code: 186, name: 'Burder', constituencyCode: 38 },
  { code: 187, name: 'Dadaja Bulla', constituencyCode: 38 },
  { code: 188, name: 'Habaswein', constituencyCode: 38 },
  { code: 189, name: 'Lagboghol South', constituencyCode: 38 },
  { code: 190, name: 'Ibrahim Ure', constituencyCode: 38 },
  { code: 191, name: 'Diif', constituencyCode: 38 },
  
  // Constituency 39 - Mandera West
  { code: 192, name: 'Takaba South', constituencyCode: 39 },
  { code: 193, name: 'Takaba', constituencyCode: 39 },
  { code: 194, name: 'Lagsure', constituencyCode: 39 },
  { code: 195, name: 'Dandu', constituencyCode: 39 },
  { code: 196, name: 'Gither', constituencyCode: 39 },
  
  // Constituency 40 - Banissa
  { code: 197, name: 'Banissa', constituencyCode: 40 },
  { code: 198, name: 'Derkhale', constituencyCode: 40 },
  { code: 199, name: 'Guba', constituencyCode: 40 },
  { code: 200, name: 'Malkamari', constituencyCode: 40 },
  { code: 201, name: 'Kiliwehiri', constituencyCode: 40 },
  
  // Constituency 41 - Mandera North
  { code: 202, name: 'Ashabito', constituencyCode: 41 },
  { code: 203, name: 'Guticha', constituencyCode: 41 },
  { code: 204, name: 'Marothile', constituencyCode: 41 },
  { code: 205, name: 'Rhamu', constituencyCode: 41 },
  { code: 206, name: 'Rhamu Dimtu', constituencyCode: 41 },
  
  // Constituency 42 - Mandera South
  { code: 207, name: 'Wargadud', constituencyCode: 42 },
  { code: 208, name: 'Kutulo', constituencyCode: 42 },
  { code: 209, name: 'Elwak South', constituencyCode: 42 },
  { code: 210, name: 'Elwak North', constituencyCode: 42 },
  { code: 211, name: 'Shimbir Fatuma', constituencyCode: 42 },
  
  // Constituency 43 - Mandera East
  { code: 212, name: 'Arabia', constituencyCode: 43 },
  { code: 213, name: 'Libehia', constituencyCode: 43 },
  { code: 214, name: 'Khalalio', constituencyCode: 43 },
  { code: 215, name: 'Neboi', constituencyCode: 43 },
  { code: 216, name: 'Township', constituencyCode: 43 },
  
  // Constituency 44 - Lafey
  { code: 217, name: 'Sala', constituencyCode: 44 },
  { code: 218, name: 'Fino', constituencyCode: 44 },
  { code: 219, name: 'Lafey', constituencyCode: 44 },
  { code: 220, name: 'Waranqara', constituencyCode: 44 },
  { code: 221, name: 'Alungo Gof', constituencyCode: 44 },
  
  // Constituency 45 - Moyale
  { code: 222, name: 'Butiye', constituencyCode: 45 },
  { code: 223, name: 'Sololo', constituencyCode: 45 },
  { code: 224, name: 'Heillu/Manyatta', constituencyCode: 45 },
  { code: 225, name: 'Golbo', constituencyCode: 45 },
  { code: 226, name: 'Moyale Township', constituencyCode: 45 },
  { code: 227, name: 'Uran', constituencyCode: 45 },
  { code: 228, name: 'Obbu', constituencyCode: 45 },
  
  // Constituency 46 - North Horr
  { code: 229, name: 'Dukana', constituencyCode: 46 },
  { code: 230, name: 'Maikona', constituencyCode: 46 },
  { code: 231, name: 'Turbi', constituencyCode: 46 },
  { code: 232, name: 'North Horr', constituencyCode: 46 },
  { code: 233, name: 'Illeret', constituencyCode: 46 },
  
  // Constituency 47 - Saku
  { code: 234, name: 'Sagante/Jaldesa', constituencyCode: 47 },
  { code: 235, name: 'Karare', constituencyCode: 47 },
  { code: 236, name: 'Marsabit Central', constituencyCode: 47 },
  
  // Constituency 48 - Laisamis
  { code: 237, name: 'Loiyangalani', constituencyCode: 48 },
  { code: 238, name: 'Kargi/South Horr', constituencyCode: 48 },
  { code: 239, name: 'Korr/Ngurunit', constituencyCode: 48 },
  { code: 240, name: 'Logologo', constituencyCode: 48 },
  { code: 241, name: 'Laisamis', constituencyCode: 48 },
  
  // Constituency 49 - Isiolo North
  { code: 242, name: 'Wabera', constituencyCode: 49 },
  { code: 243, name: 'Bulla Pesa', constituencyCode: 49 },
  { code: 244, name: 'Chari', constituencyCode: 49 },
  { code: 245, name: 'Cherab', constituencyCode: 49 },
  { code: 246, name: 'Ngaremara', constituencyCode: 49 },
  { code: 247, name: 'Burat', constituencyCode: 49 },
  { code: 248, name: 'Oldonyiro', constituencyCode: 49 },
  
  // Constituency 50 - Isiolo South
  { code: 249, name: 'Kinna', constituencyCode: 50 },
  { code: 250, name: 'Garbatulla', constituencyCode: 50 },
  { code: 251, name: 'Sericho', constituencyCode: 50 },
  
  // Constituency 51 - Igembe South
  { code: 252, name: 'Maua', constituencyCode: 51 },
  { code: 253, name: 'Kegoi/Antubochiu', constituencyCode: 51 },
  { code: 254, name: 'Athiru Gaiti', constituencyCode: 51 },
  { code: 255, name: 'Akachiu', constituencyCode: 51 },
  { code: 256, name: 'Kanuni', constituencyCode: 51 },
  
  // Constituency 52 - Igembe Central
  { code: 257, name: "Akirang'ondu", constituencyCode: 52 },
  { code: 258, name: 'Athiru Ruujine', constituencyCode: 52 },
  { code: 259, name: 'Igembe East', constituencyCode: 52 },
  { code: 260, name: 'Njia', constituencyCode: 52 },
  { code: 261, name: 'Kangeta', constituencyCode: 52 },
  
  // Constituency 53 - Igembe North
  { code: 262, name: 'Antuambui', constituencyCode: 53 },
  { code: 263, name: 'Ntunene', constituencyCode: 53 },
  { code: 264, name: 'Antubetwe Kiongo', constituencyCode: 53 },
  { code: 265, name: 'Naathu', constituencyCode: 53 },
  { code: 266, name: 'Amwathi', constituencyCode: 53 },
  
  // Constituency 54 - Tigania West
  { code: 267, name: 'Athwana', constituencyCode: 54 },
  { code: 268, name: 'Akithi', constituencyCode: 54 },
  { code: 269, name: 'Kianjai', constituencyCode: 54 },
  { code: 270, name: 'Nkomo', constituencyCode: 54 },
  { code: 271, name: 'Mbeu', constituencyCode: 54 },
  
  // Constituency 55 - Tigania East
  { code: 272, name: 'Thangatha', constituencyCode: 55 },
  { code: 273, name: 'Mikinduri', constituencyCode: 55 },
  { code: 274, name: 'Kiguchwa', constituencyCode: 55 },
  { code: 275, name: 'Muthara', constituencyCode: 55 },
  { code: 276, name: 'Karama', constituencyCode: 55 },
  
  // Constituency 56 - North Imenti
  { code: 277, name: 'Municipality', constituencyCode: 56 },
  { code: 278, name: 'Ntima East', constituencyCode: 56 },
  { code: 279, name: 'Ntima West', constituencyCode: 56 },
  { code: 280, name: 'Nyaki West', constituencyCode: 56 },
  { code: 281, name: 'Nyaki East', constituencyCode: 56 },
  
  // Constituency 57 - Buuri
  { code: 282, name: 'Timau', constituencyCode: 57 },
  { code: 283, name: 'Kisima', constituencyCode: 57 },
  { code: 284, name: 'Kiirua/Naari', constituencyCode: 57 },
  { code: 285, name: 'Ruiri/Rwarera', constituencyCode: 57 },
  { code: 286, name: 'Kibirichia', constituencyCode: 57 },
  
  // Constituency 58 - Central Imenti
  { code: 287, name: 'Mwanganthia', constituencyCode: 58 },
  { code: 288, name: 'Abothuguchi Central', constituencyCode: 58 },
  { code: 289, name: 'Abothuguchi West', constituencyCode: 58 },
  { code: 290, name: 'Kiagu', constituencyCode: 58 },
  
  // Constituency 59 - South Imenti
  { code: 291, name: 'Mitunguu', constituencyCode: 59 },
  { code: 292, name: 'Igoji East', constituencyCode: 59 },
  { code: 293, name: 'Igoji West', constituencyCode: 59 },
  { code: 294, name: 'Abogeta East', constituencyCode: 59 },
  { code: 295, name: 'Abogeta West', constituencyCode: 59 },
  { code: 296, name: 'Nkuene', constituencyCode: 59 },
  
  // Constituency 75 - Masinga
  { code: 376, name: 'Kivaa', constituencyCode: 75 },
  { code: 377, name: 'Masinga Central', constituencyCode: 75 },
  { code: 378, name: 'Ekalakala', constituencyCode: 75 },
  { code: 379, name: 'Muthesya', constituencyCode: 75 },
  { code: 380, name: 'Ndithini', constituencyCode: 75 },
  
  // Constituency 76 - Yatta
  { code: 381, name: 'Ndalani', constituencyCode: 76 },
  { code: 382, name: 'Matuu', constituencyCode: 76 },
  { code: 383, name: 'Kithimani', constituencyCode: 76 },
  { code: 384, name: 'Ikombe', constituencyCode: 76 },
  { code: 385, name: 'Katangi', constituencyCode: 76 },
  
  // Constituency 77 - Kangundo
  { code: 386, name: 'Kangundo North', constituencyCode: 77 },
  { code: 387, name: 'Kangundo Central', constituencyCode: 77 },
  { code: 388, name: 'Kangundo East', constituencyCode: 77 },
  { code: 389, name: 'Kangundo West', constituencyCode: 77 },
  
  // Constituency 78 - Matungulu
  { code: 390, name: 'Tala', constituencyCode: 78 },
  { code: 391, name: 'Matungulu North', constituencyCode: 78 },
  { code: 392, name: 'Matungulu East', constituencyCode: 78 },
  { code: 393, name: 'Matungulu West', constituencyCode: 78 },
  { code: 394, name: 'Kyeleni', constituencyCode: 78 },
  
  // Constituency 79 - Kathiani
  { code: 395, name: 'Mitaboni', constituencyCode: 79 },
  { code: 396, name: 'Kathiani Central', constituencyCode: 79 },
  { code: 397, name: 'Upper Kaewa/Iveti', constituencyCode: 79 },
  { code: 398, name: 'Lower Kaewa/Kaani', constituencyCode: 79 },
  
  // Constituency 80 - Mavoko
  { code: 399, name: 'Athi River', constituencyCode: 80 },
  { code: 400, name: 'Kinanie', constituencyCode: 80 },
  { code: 401, name: 'Muthwani', constituencyCode: 80 },
  { code: 402, name: 'Syokimau/Mulolongo', constituencyCode: 80 },
  
  // Constituency 81 - Machakos Town
  { code: 403, name: 'Kalama', constituencyCode: 81 },
  { code: 404, name: 'Mua', constituencyCode: 81 },
  { code: 405, name: 'Mutituni', constituencyCode: 81 },
  { code: 406, name: 'Machakos Central', constituencyCode: 81 },
  { code: 407, name: 'Mumbuni', constituencyCode: 81 },
  { code: 408, name: 'Muvuti/Kiima-Kimwe', constituencyCode: 81 },
  { code: 409, name: 'Kola', constituencyCode: 81 },
  
  // Constituency 82 - Mwala
  { code: 410, name: 'Mbiuni', constituencyCode: 82 },
  { code: 411, name: 'Makutano/Mwala', constituencyCode: 82 },
  { code: 412, name: 'Masii', constituencyCode: 82 },
  { code: 413, name: 'Muthetheni', constituencyCode: 82 },
  { code: 414, name: 'Wamunyu', constituencyCode: 82 },
  { code: 415, name: 'Kibauni', constituencyCode: 82 },
  
  // Constituency 111 - Gatundu South
  { code: 548, name: 'Kiamwangi', constituencyCode: 111 },
  { code: 549, name: 'Kiganjo', constituencyCode: 111 },
  { code: 550, name: 'Ndarugo', constituencyCode: 111 },
  { code: 551, name: 'Ngenda', constituencyCode: 111 },
  
  // Constituency 112 - Gatundu North
  { code: 552, name: 'Gituamba', constituencyCode: 112 },
  { code: 553, name: 'Githobokoni', constituencyCode: 112 },
  { code: 554, name: 'Chania', constituencyCode: 112 },
  { code: 555, name: "Mang'u", constituencyCode: 112 },
  
  // Constituency 113 - Juja
  { code: 556, name: 'Murera', constituencyCode: 113 },
  { code: 557, name: 'Theta', constituencyCode: 113 },
  { code: 558, name: 'Juja', constituencyCode: 113 },
  { code: 559, name: 'Witeithie', constituencyCode: 113 },
  { code: 560, name: 'Kalimoni', constituencyCode: 113 },
  
  // Constituency 114 - Thika Town
  { code: 561, name: 'Township', constituencyCode: 114 },
  { code: 562, name: 'Kamenu', constituencyCode: 114 },
  { code: 563, name: 'Hospital', constituencyCode: 114 },
  { code: 564, name: 'Gatuanyaga', constituencyCode: 114 },
  { code: 565, name: 'Ngoliba', constituencyCode: 114 },
  
  // Constituency 115 - Ruiru
  { code: 566, name: 'Gitothua', constituencyCode: 115 },
  { code: 567, name: 'Biashara', constituencyCode: 115 },
  { code: 568, name: 'Gatongora', constituencyCode: 115 },
  { code: 569, name: 'Kahawa/Sukari', constituencyCode: 115 },
  { code: 570, name: 'Kahawa/Wendani', constituencyCode: 115 },
  { code: 571, name: 'Kiuu', constituencyCode: 115 },
  { code: 572, name: 'Mwiki', constituencyCode: 115 },
  { code: 573, name: 'Mwihoko', constituencyCode: 115 },
  
  // Constituency 116 - Githunguri
  { code: 574, name: 'Githunguri', constituencyCode: 116 },
  { code: 575, name: 'Githiga', constituencyCode: 116 },
  { code: 576, name: 'Ikinu', constituencyCode: 116 },
  { code: 577, name: 'Ngewa', constituencyCode: 116 },
  { code: 578, name: 'Komothai', constituencyCode: 116 },
  
  // Constituency 117 - Kiambu
  { code: 579, name: "Ting'ang'a", constituencyCode: 117 },
  { code: 580, name: 'Ndumberi', constituencyCode: 117 },
  { code: 581, name: 'Riabai', constituencyCode: 117 },
  { code: 582, name: 'Township', constituencyCode: 117 },
  
  // Constituency 118 - Kiambaa
  { code: 583, name: 'Cianda', constituencyCode: 118 },
  { code: 584, name: 'Karuri', constituencyCode: 118 },
  { code: 585, name: 'Ndenderu', constituencyCode: 118 },
  { code: 586, name: 'Muchatha', constituencyCode: 118 },
  { code: 587, name: 'Kihara', constituencyCode: 118 },
  
  // Constituency 119 - Kabete
  { code: 588, name: 'Gitaru', constituencyCode: 119 },
  { code: 589, name: 'Muguga', constituencyCode: 119 },
  { code: 590, name: 'Nyadhuna', constituencyCode: 119 },
  { code: 591, name: 'Kabete', constituencyCode: 119 },
  { code: 592, name: 'Uthiru', constituencyCode: 119 },
  
  // Constituency 120 - Kikuyu
  { code: 593, name: 'Karai', constituencyCode: 120 },
  { code: 594, name: 'Nachu', constituencyCode: 120 },
  { code: 595, name: 'Sigona', constituencyCode: 120 },
  { code: 596, name: 'Kikuyu', constituencyCode: 120 },
  { code: 597, name: 'Kinoo', constituencyCode: 120 },
  
  // Constituency 121 - Limuru
  { code: 598, name: 'Bibirioni', constituencyCode: 121 },
  { code: 599, name: 'Limuru Central', constituencyCode: 121 },
  { code: 600, name: 'Ndeiya', constituencyCode: 121 },
  { code: 601, name: 'Limuru East', constituencyCode: 121 },
  { code: 602, name: 'Tigoni/Ngecha', constituencyCode: 121 },
  
  // Constituency 122 - Lari
  { code: 603, name: 'Kinale', constituencyCode: 122 },
  { code: 604, name: 'Kijabe', constituencyCode: 122 },
  { code: 605, name: 'Nyanduma', constituencyCode: 122 },
  { code: 606, name: 'Kamburu', constituencyCode: 122 },
  { code: 607, name: 'Lari/Kirenga', constituencyCode: 122 },
  
  // Constituency 199 - Lugari
  { code: 991, name: 'Mautuma', constituencyCode: 199 },
  { code: 992, name: 'Lugari', constituencyCode: 199 },
  { code: 993, name: 'Lumakanda', constituencyCode: 199 },
  { code: 994, name: 'Chekalini', constituencyCode: 199 },
  { code: 995, name: 'Chevaywa', constituencyCode: 199 },
  { code: 996, name: 'Lwandeti', constituencyCode: 199 },
  
  // Constituency 200 - Likuyani
  { code: 997, name: 'Likuyani', constituencyCode: 200 },
  { code: 998, name: 'Sango', constituencyCode: 200 },
  { code: 999, name: 'Kongoni', constituencyCode: 200 },
  { code: 1000, name: 'Nzoia', constituencyCode: 200 },
  { code: 1001, name: 'Sinoko', constituencyCode: 200 },
  
  // Constituency 201 - Malava
  { code: 1002, name: 'West Kabras', constituencyCode: 201 },
  { code: 1003, name: 'Chemuche', constituencyCode: 201 },
  { code: 1004, name: 'East Kabras', constituencyCode: 201 },
  { code: 1005, name: 'Butali/Chegulo', constituencyCode: 201 },
  { code: 1006, name: 'Manda-Shivanga', constituencyCode: 201 },
  { code: 1007, name: 'South Kabras', constituencyCode: 201 },
  { code: 1008, name: 'Shirugu-Mugai', constituencyCode: 201 },
  
  // Constituency 202 - Lurambi
  { code: 1009, name: 'Butsotso East', constituencyCode: 202 },
  { code: 1010, name: 'Butsotso South', constituencyCode: 202 },
  { code: 1011, name: 'Butsotso Central', constituencyCode: 202 },
  { code: 1012, name: 'Sheywe', constituencyCode: 202 },
  { code: 1013, name: 'Mahiakalo', constituencyCode: 202 },
  { code: 1014, name: 'Shirere', constituencyCode: 202 },
  
  // Constituency 203 - Navakholo
  { code: 1015, name: 'Ingotse-Matiha', constituencyCode: 203 },
  { code: 1016, name: 'Shinoyi-Shikomari-Esumeyia', constituencyCode: 203 },
  { code: 1017, name: 'Bunyala West', constituencyCode: 203 },
  { code: 1018, name: 'Bunyala East', constituencyCode: 203 },
  { code: 1019, name: 'Bunyala Central', constituencyCode: 203 },
  
  // Constituency 204 - Mumias West
  { code: 1020, name: 'Mumias Central', constituencyCode: 204 },
  { code: 1021, name: 'Mumias North', constituencyCode: 204 },
  { code: 1022, name: 'Etenje', constituencyCode: 204 },
  { code: 1023, name: 'Musanda', constituencyCode: 204 },
  
  // Constituency 205 - Mumias East
  { code: 1024, name: 'Lusheya/Lubinu', constituencyCode: 205 },
  { code: 1025, name: 'Malaha/Isongo/Makunga', constituencyCode: 205 },
  { code: 1026, name: 'East Wanga', constituencyCode: 205 },
  
  // Constituency 206 - Matungu
  { code: 1027, name: 'Koyonzo', constituencyCode: 206 },
  { code: 1028, name: 'Kholera', constituencyCode: 206 },
  { code: 1029, name: 'Khalaba', constituencyCode: 206 },
  { code: 1030, name: 'Mayoni', constituencyCode: 206 },
  { code: 1031, name: 'Namamali', constituencyCode: 206 },
  
  // Constituency 207 - Butere
  { code: 1032, name: 'Marama West', constituencyCode: 207 },
  { code: 1033, name: 'Marama Central', constituencyCode: 207 },
  { code: 1034, name: 'Marenyo - Shianda', constituencyCode: 207 },
  { code: 1035, name: 'Marama North', constituencyCode: 207 },
  { code: 1036, name: 'Marama South', constituencyCode: 207 },
  
  // Constituency 208 - Khwisero
  { code: 1037, name: 'Kisa North', constituencyCode: 208 },
  { code: 1038, name: 'Kisa East', constituencyCode: 208 },
  { code: 1039, name: 'Kisa West', constituencyCode: 208 },
  { code: 1040, name: 'Kisa Central', constituencyCode: 208 },
  
  // Constituency 209 - Shinyalu
  { code: 1041, name: 'Isukha North', constituencyCode: 209 },
  { code: 1042, name: 'Isukha Central', constituencyCode: 209 },
  { code: 1043, name: 'Isukha South', constituencyCode: 209 },
  { code: 1044, name: 'Isukha East', constituencyCode: 209 },
  { code: 1045, name: 'Isukha West', constituencyCode: 209 },
  { code: 1046, name: 'Murhanda', constituencyCode: 209 },
  
  // Constituency 210 - Ikolomani
  { code: 1047, name: 'Idakho South', constituencyCode: 210 },
  { code: 1048, name: 'Idakho East', constituencyCode: 210 },
  { code: 1049, name: 'Idakho North', constituencyCode: 210 },
  { code: 1050, name: 'Idakho Central', constituencyCode: 210 },
  
  // Constituency 211 - Vihiga
  { code: 1051, name: 'Lugaga-Wamuluma', constituencyCode: 211 },
  { code: 1052, name: 'South Maragoli', constituencyCode: 211 },
  { code: 1053, name: 'Central Maragoli', constituencyCode: 211 },
  { code: 1054, name: 'Vembee', constituencyCode: 211 },
  
  // Constituency 212 - Sabatia
  { code: 1055, name: 'Lyaduywa/Izava', constituencyCode: 212 },
  { code: 1056, name: 'West Sabatia', constituencyCode: 212 },
  { code: 1057, name: 'Chavakali', constituencyCode: 212 },
  { code: 1058, name: 'North Maragoli', constituencyCode: 212 },
  { code: 1059, name: 'Wodanga', constituencyCode: 212 },
  { code: 1060, name: 'Busali', constituencyCode: 212 },
  
  // Constituency 213 - Hamisi
  { code: 1061, name: 'Shiru', constituencyCode: 213 },
  { code: 1062, name: 'Gisambai', constituencyCode: 213 },
  { code: 1063, name: 'Shamakhokho', constituencyCode: 213 },
  { code: 1064, name: 'Banja', constituencyCode: 213 },
  { code: 1065, name: 'Muhudu', constituencyCode: 213 },
  { code: 1066, name: 'Tambua', constituencyCode: 213 },
  { code: 1067, name: 'Jepkoyai', constituencyCode: 213 },
  
  // Constituency 214 - Luanda
  { code: 1068, name: 'Luanda Township', constituencyCode: 214 },
  { code: 1069, name: 'Wemilabi', constituencyCode: 214 },
  { code: 1070, name: 'Mwibona', constituencyCode: 214 },
  { code: 1071, name: 'Luanda South', constituencyCode: 214 },
  { code: 1072, name: 'Emabungo', constituencyCode: 214 },
  
  // Constituency 215 - Emuhaya
  { code: 1073, name: 'North East Bunyore', constituencyCode: 215 },
  { code: 1074, name: 'Central Bunyore', constituencyCode: 215 },
  { code: 1075, name: 'West Bunyore', constituencyCode: 215 },
  
  // Constituency 216 - Mt. Elgon
  { code: 1076, name: 'Cheptais', constituencyCode: 216 },
  { code: 1077, name: 'Chesikaki', constituencyCode: 216 },
  { code: 1078, name: 'Chepyuk', constituencyCode: 216 },
  { code: 1079, name: 'Kapkateny', constituencyCode: 216 },
  { code: 1080, name: 'Kaptama', constituencyCode: 216 },
  { code: 1081, name: 'Elgon', constituencyCode: 216 },
  
  // Constituency 217 - Sirisia
  { code: 1082, name: 'Namwela', constituencyCode: 217 },
  { code: 1083, name: 'Malakisi/South Kulisiru', constituencyCode: 217 },
  { code: 1084, name: 'Lwandanyi', constituencyCode: 217 },
  
  // Constituency 218 - Kabuchai
  { code: 1085, name: 'Kabuchai/Chwele', constituencyCode: 218 },
  { code: 1086, name: 'West Nalondo', constituencyCode: 218 },
  { code: 1087, name: 'Bwake/Luuya', constituencyCode: 218 },
  { code: 1088, name: 'Mukuyuni', constituencyCode: 218 },
  
  // Constituency 219 - Bumula
  { code: 1089, name: 'South Bukusu', constituencyCode: 219 },
  { code: 1090, name: 'Bumula', constituencyCode: 219 },
  { code: 1091, name: 'Khasoko', constituencyCode: 219 },
  { code: 1092, name: 'Kabula', constituencyCode: 219 },
  { code: 1093, name: 'Kimaeti', constituencyCode: 219 },
  { code: 1094, name: 'West Bukusu', constituencyCode: 219 },
  { code: 1095, name: 'Siboti', constituencyCode: 219 },
  
  // Constituency 220 - Kanduyi
  { code: 1096, name: 'Bukembe West', constituencyCode: 220 },
  { code: 1097, name: 'Bukembe East', constituencyCode: 220 },
  { code: 1098, name: 'Township', constituencyCode: 220 },
  { code: 1099, name: 'Khalaba', constituencyCode: 220 },
  { code: 1100, name: 'Musikoma', constituencyCode: 220 },
  { code: 1101, name: "East Sang'alo", constituencyCode: 220 },
  { code: 1102, name: 'Marakaru/Tuuti', constituencyCode: 220 },
  { code: 1103, name: "West Sang'alo", constituencyCode: 220 },
  
  // Constituency 221 - Webuye East
  { code: 1104, name: 'Mihuu', constituencyCode: 221 },
  { code: 1105, name: 'Ndivisi', constituencyCode: 221 },
  { code: 1106, name: 'Maraka', constituencyCode: 221 },
  
  // Constituency 222 - Webuye West
  { code: 1107, name: 'Sitikho', constituencyCode: 222 },
  { code: 1108, name: 'Matulo', constituencyCode: 222 },
  { code: 1109, name: 'Bokoli', constituencyCode: 222 },
  { code: 1110, name: 'Misikhu', constituencyCode: 222 },
  
  // Constituency 223 - Kimilili
  { code: 1111, name: 'Kibingei', constituencyCode: 223 },
  { code: 1112, name: 'Kimilili', constituencyCode: 223 },
  { code: 1113, name: 'Maeni', constituencyCode: 223 },
  { code: 1114, name: 'Kamukuywa', constituencyCode: 223 },
  
  // Constituency 224 - Tongaren
  { code: 1115, name: 'Mbakalo', constituencyCode: 224 },
  { code: 1116, name: 'Naitiri/Kabuyefwe', constituencyCode: 224 },
  { code: 1117, name: 'Milima', constituencyCode: 224 },
  { code: 1118, name: 'Ndalu/Tabani', constituencyCode: 224 },
  { code: 1119, name: 'Tongaren', constituencyCode: 224 },
  { code: 1120, name: 'Soysambu/Mitua', constituencyCode: 224 },
  
  // Constituency 238 - Kisumu East
  { code: 1186, name: 'Kajulu', constituencyCode: 238 },
  { code: 1187, name: 'Kolwa East', constituencyCode: 238 },
  { code: 1188, name: 'Kolwa Central', constituencyCode: 238 },
  { code: 1189, name: "Manyatta 'B'", constituencyCode: 238 },
  { code: 1190, name: "Nyalenda 'A'", constituencyCode: 238 },
  
  // Constituency 239 - Kisumu West
  { code: 1191, name: 'South West Kisumu', constituencyCode: 239 },
  { code: 1192, name: 'Central Kisumu', constituencyCode: 239 },
  { code: 1193, name: 'Kisumu North', constituencyCode: 239 },
  { code: 1194, name: 'West Kisumu', constituencyCode: 239 },
  { code: 1195, name: 'North West Kisumu', constituencyCode: 239 },
  
  // Constituency 240 - Kisumu Central
  { code: 1196, name: 'Railways', constituencyCode: 240 },
  { code: 1197, name: 'Migosi', constituencyCode: 240 },
  { code: 1198, name: 'Shaurimoyo Kaloleni', constituencyCode: 240 },
  { code: 1199, name: 'Market Milimani', constituencyCode: 240 },
  { code: 1200, name: 'Kondele', constituencyCode: 240 },
  { code: 1201, name: "Nyalenda 'B'", constituencyCode: 240 },
  
  // Constituency 241 - Seme
  { code: 1202, name: 'West Seme', constituencyCode: 241 },
  { code: 1203, name: 'Central Seme', constituencyCode: 241 },
  { code: 1204, name: 'East Seme', constituencyCode: 241 },
  { code: 1205, name: 'North Seme', constituencyCode: 241 },
  
  // Constituency 242 - Nyando
  { code: 1206, name: 'East Kano/Wawidhi', constituencyCode: 242 },
  { code: 1207, name: 'Awasi/Onjiko', constituencyCode: 242 },
  { code: 1208, name: 'Ahero', constituencyCode: 242 },
  { code: 1209, name: 'Kabonyo/Kanyagwal', constituencyCode: 242 },
  { code: 1210, name: 'Kobura', constituencyCode: 242 },
  
  // Constituency 243 - Muhoroni
  { code: 1211, name: 'Miwani', constituencyCode: 243 },
  { code: 1212, name: 'Ombeyi', constituencyCode: 243 },
  { code: 1213, name: "Masogo/Nyang'oma", constituencyCode: 243 },
  { code: 1214, name: 'Chemelil', constituencyCode: 243 },
  { code: 1215, name: 'Muhoroni/Koru', constituencyCode: 243 },
  
  // Constituency 244 - Nyakach
  { code: 1216, name: 'South West Nyakach', constituencyCode: 244 },
  { code: 1217, name: 'North Nyakach', constituencyCode: 244 },
  { code: 1218, name: 'Central Nyakach', constituencyCode: 244 },
  { code: 1219, name: 'West Nyakach', constituencyCode: 244 },
  { code: 1220, name: 'South East Nyakach', constituencyCode: 244 },
  
  // Constituency 136 - Kwanza
  { code: 671, name: 'Kampomoi', constituencyCode: 136 },
  { code: 672, name: 'Kwanza', constituencyCode: 136 },
  { code: 673, name: 'Keiyo', constituencyCode: 136 },
  { code: 674, name: 'Bidii', constituencyCode: 136 },
  
  // Constituency 137 - Endebess
  { code: 675, name: 'Chepchoina', constituencyCode: 137 },
  { code: 676, name: 'Endebess', constituencyCode: 137 },
  { code: 677, name: 'Matumbei', constituencyCode: 137 },
  
  // Constituency 138 - Saboti
  { code: 678, name: 'Kinyoro', constituencyCode: 138 },
  { code: 679, name: 'Matisi', constituencyCode: 138 },
  { code: 680, name: 'Tuwan', constituencyCode: 138 },
  { code: 681, name: 'Saboti', constituencyCode: 138 },
  { code: 682, name: 'Machewa', constituencyCode: 138 },
  
  // Constituency 139 - Kiminini
  { code: 683, name: 'Kiminini', constituencyCode: 139 },
  { code: 684, name: 'Waitaluk', constituencyCode: 139 },
  { code: 685, name: 'Sirende', constituencyCode: 139 },
  { code: 686, name: 'Hospital', constituencyCode: 139 },
  { code: 687, name: 'Sikhendu', constituencyCode: 139 },
  { code: 688, name: 'Nabiswa', constituencyCode: 139 },
  
  // Constituency 140 - Cherangany
  { code: 689, name: 'Sinyerere', constituencyCode: 140 },
  { code: 690, name: 'Makutano', constituencyCode: 140 },
  { code: 691, name: 'Kaplamai', constituencyCode: 140 },
  { code: 692, name: 'Motosiet', constituencyCode: 140 },
  { code: 693, name: 'Cherangany/Suwerwa', constituencyCode: 140 },
  { code: 694, name: 'Chepsiro/Kiptoror', constituencyCode: 140 },
  { code: 695, name: 'Sitatunga', constituencyCode: 140 },
  
  // Constituency 274 - Westlands
  { code: 1366, name: 'Kitisuru', constituencyCode: 274 },
  { code: 1367, name: 'Parklands/Highridge', constituencyCode: 274 },
  { code: 1368, name: 'Karura', constituencyCode: 274 },
  { code: 1369, name: 'Kangemi', constituencyCode: 274 },
  { code: 1370, name: 'Mountain View', constituencyCode: 274 },
  
  // Constituency 275 - Dagoretti North
  { code: 1371, name: 'Kilimani', constituencyCode: 275 },
  { code: 1372, name: 'Kawangware', constituencyCode: 275 },
  { code: 1373, name: 'Gatina', constituencyCode: 275 },
  { code: 1374, name: 'Kileleshwa', constituencyCode: 275 },
  { code: 1375, name: 'Kabiro', constituencyCode: 275 },
  
  // Constituency 276 - Dagoretti South
  { code: 1376, name: 'Mutu-ini', constituencyCode: 276 },
  { code: 1377, name: "Ngand'o", constituencyCode: 276 },
  { code: 1378, name: 'Riruta', constituencyCode: 276 },
  { code: 1379, name: 'Uthiru/Ruthimitu', constituencyCode: 276 },
  { code: 1380, name: 'Waithaka', constituencyCode: 276 },
  
  // Constituency 277 - Lang'ata
  { code: 1381, name: 'Karen', constituencyCode: 277 },
  { code: 1382, name: 'Nairobi West', constituencyCode: 277 },
  { code: 1383, name: 'Mugumo-ini', constituencyCode: 277 },
  { code: 1384, name: 'South C', constituencyCode: 277 },
  { code: 1385, name: 'Nyayo Highrise', constituencyCode: 277 },
  
  // Constituency 278 - Kibra
  { code: 1386, name: 'Laini Saba', constituencyCode: 278 },
  { code: 1387, name: 'Lindi', constituencyCode: 278 },
  { code: 1388, name: 'Makina', constituencyCode: 278 },
  { code: 1389, name: 'Woodley/Kenyatta Golf Course', constituencyCode: 278 },
  { code: 1390, name: "Sarang'ombe", constituencyCode: 278 },
  
  // Constituency 279 - Roysambu
  { code: 1391, name: 'Githurai', constituencyCode: 279 },
  { code: 1392, name: 'Kahawa West', constituencyCode: 279 },
  { code: 1393, name: 'Zimmermann', constituencyCode: 279 },
  { code: 1394, name: 'Roysambu', constituencyCode: 279 },
  { code: 1395, name: 'Kahawa', constituencyCode: 279 },
  
  // Constituency 280 - Kasarani
  { code: 1396, name: 'Clay City', constituencyCode: 280 },
  { code: 1397, name: 'Mwiki', constituencyCode: 280 },
  { code: 1398, name: 'Kasarani', constituencyCode: 280 },
  { code: 1399, name: 'Njiru', constituencyCode: 280 },
  { code: 1400, name: 'Ruai', constituencyCode: 280 },
  
  // Constituency 281 - Ruaraka
  { code: 1401, name: 'Babadogo', constituencyCode: 281 },
  { code: 1402, name: 'Utalii', constituencyCode: 281 },
  { code: 1403, name: 'Mathare North', constituencyCode: 281 },
  { code: 1404, name: 'Lucky Summer', constituencyCode: 281 },
  { code: 1405, name: 'Korogocho', constituencyCode: 281 },
  
  // Constituency 282 - Embakasi South
  { code: 1406, name: 'Imara Daima', constituencyCode: 282 },
  { code: 1407, name: 'Kwa Njenga', constituencyCode: 282 },
  { code: 1408, name: 'Kwa Reuben', constituencyCode: 282 },
  { code: 1409, name: 'Pipeline', constituencyCode: 282 },
  { code: 1410, name: 'Kware', constituencyCode: 282 },
  
  // Constituency 283 - Embakasi North
  { code: 1411, name: 'Kariobangi North', constituencyCode: 283 },
  { code: 1412, name: 'Dandora Area I', constituencyCode: 283 },
  { code: 1413, name: 'Dandora Area II', constituencyCode: 283 },
  { code: 1414, name: 'Dandora Area III', constituencyCode: 283 },
  { code: 1415, name: 'Dandora Area IV', constituencyCode: 283 },
  
  // Constituency 284 - Embakasi Central
  { code: 1416, name: 'Kayole North', constituencyCode: 284 },
  { code: 1417, name: 'Kayole North Central', constituencyCode: 284 },
  { code: 1418, name: 'Kayole South', constituencyCode: 284 },
  { code: 1419, name: 'Komarock', constituencyCode: 284 },
  { code: 1420, name: 'Matopeni/Spring Valley', constituencyCode: 284 },
  
  // Constituency 285 - Embakasi East
  { code: 1421, name: 'Upper Savanna', constituencyCode: 285 },
  { code: 1422, name: 'Lower Savanna', constituencyCode: 285 },
  { code: 1423, name: 'Embakasi', constituencyCode: 285 },
  { code: 1424, name: 'Utawala', constituencyCode: 285 },
  { code: 1425, name: "Mihang'o", constituencyCode: 285 },
  
  // Constituency 286 - Embakasi West
  { code: 1426, name: 'Umoja I', constituencyCode: 286 },
  { code: 1427, name: 'Umoja II', constituencyCode: 286 },
  { code: 1428, name: 'Mowlem', constituencyCode: 286 },
  { code: 1429, name: 'Kariobangi South', constituencyCode: 286 },
  
  // Constituency 287 - Makadara
  { code: 1430, name: 'Maringo/Hamza', constituencyCode: 287 },
  { code: 1431, name: 'Viwandani', constituencyCode: 287 },
  { code: 1432, name: 'Harambee', constituencyCode: 287 },
  { code: 1433, name: 'Makongeni', constituencyCode: 287 },
  
  // Constituency 288 - Kamukunji
  { code: 1434, name: 'Pumwani', constituencyCode: 288 },
  { code: 1435, name: 'Eastleigh North', constituencyCode: 288 },
  { code: 1436, name: 'Eastleigh South', constituencyCode: 288 },
  { code: 1437, name: 'Airbase', constituencyCode: 288 },
  { code: 1438, name: 'California', constituencyCode: 288 },
  
  // Constituency 289 - Starehe
  { code: 1439, name: 'Nairobi Central', constituencyCode: 289 },
  { code: 1440, name: 'Ngara', constituencyCode: 289 },
  { code: 1441, name: 'Pangani', constituencyCode: 289 },
  { code: 1442, name: 'Ziwani/Kariokor', constituencyCode: 289 },
  { code: 1443, name: 'Landi Mawe', constituencyCode: 289 },
  { code: 1444, name: 'Nairobi South', constituencyCode: 289 },
  
  // Constituency 290 - Mathare
  { code: 1445, name: 'Hospital', constituencyCode: 290 },
  { code: 1446, name: 'Mabatini', constituencyCode: 290 },
  { code: 1447, name: 'Huruma', constituencyCode: 290 },
  { code: 1448, name: 'Ngei', constituencyCode: 290 },
  { code: 1449, name: 'Mlango Kubwa', constituencyCode: 290 },
  { code: 1450, name: 'Kiamaiko', constituencyCode: 290 },
]

async function main() {
  console.log('Seeding wards...')

  if (wards.length === 0) {
    console.log('⚠️  No wards to seed. Please add ward data to the script.')
    return
  }

  for (const ward of wards) {
    try {
      // Check if constituency exists
      const constituency = await prisma.constituency.findUnique({
        where: { constituencyCode: ward.constituencyCode },
      })

      if (!constituency) {
        console.log(`⚠️  Constituency with code ${ward.constituencyCode} not found. Skipping ${ward.name}`)
        continue
      }

      await prisma.ward.upsert({
        where: { wardCode: ward.code },
        update: {
          wardName: ward.name,
          constituencyCode: ward.constituencyCode,
        },
        create: {
          wardCode: ward.code,
          wardName: ward.name,
          constituencyCode: ward.constituencyCode,
        },
      })
      console.log(`✓ ${ward.name} (Code: ${ward.code}, Constituency: ${constituency.constituencyName})`)
    } catch (error: any) {
      console.error(`✗ Error seeding ${ward.name}:`, error.message)
    }
  }

  console.log('\n✅ Wards seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding wards:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

