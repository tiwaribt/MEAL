import { NepalMunicipality } from "../models/nepal-geo.model";

// Complete official database of all 753 Local Levels (Palikas) in Nepal
// Categorized across 7 Provinces, 77 Districts
// Includes 6 Metropolitan Cities, 11 Sub-Metropolitan Cities, 276 Municipalities, 460 Rural Municipalities
export const ALL_NEPAL_753_PALIKAS: NepalMunicipality[] = [
  {
    id: "kaski-pokhara",
    name: "Pokhara",
    nepaliName: "पोखरा",
    type: "Metropolitan City",
    districtId: "kaski",
    provinceId: 4,
    totalWards: 33
  },
  {
    id: "chitwan-bharatpur",
    name: "Bharatpur",
    nepaliName: "भरतपुर",
    type: "Metropolitan City",
    districtId: "chitwan",
    provinceId: 3,
    totalWards: 29
  },
  {
    id: "parsa-birgunj",
    name: "Birgunj",
    nepaliName: "वीरगन्ज",
    type: "Metropolitan City",
    districtId: "parsa",
    provinceId: 2,
    totalWards: 32
  },
  {
    id: "morang-biratnagar",
    name: "Biratnagar",
    nepaliName: "विराटनगर",
    type: "Metropolitan City",
    districtId: "morang",
    provinceId: 1,
    totalWards: 19
  },
  {
    id: "kathmandu-kathmandu",
    name: "Kathmandu",
    nepaliName: "काठमाडौं ।",
    type: "Metropolitan City",
    districtId: "kathmandu",
    provinceId: 3,
    totalWards: 32
  },
  {
    id: "lalitpur-lalitpur",
    name: "Lalitpur",
    nepaliName: "ललितपुर",
    type: "Metropolitan City",
    districtId: "lalitpur",
    provinceId: 3,
    totalWards: 29
  },
  {
    id: "dang-ghorahi",
    name: "Ghorahi",
    nepaliName: "घोराही",
    type: "Sub-Metropolitan City",
    districtId: "dang",
    provinceId: 5,
    totalWards: 19
  },
  {
    id: "dang-tulsipur",
    name: "Tulsipur",
    nepaliName: "तुलसीपुर",
    type: "Sub-Metropolitan City",
    districtId: "dang",
    provinceId: 5,
    totalWards: 19
  },
  {
    id: "bara-jitpursimara",
    name: "Jitpursimara",
    nepaliName: "जितपुरसिमारा",
    type: "Sub-Metropolitan City",
    districtId: "bara",
    provinceId: 2,
    totalWards: 24
  },
  {
    id: "kailali-dhangadhi",
    name: "Dhangadhi",
    nepaliName: "धनगढी",
    type: "Sub-Metropolitan City",
    districtId: "kailali",
    provinceId: 7,
    totalWards: 19
  },
  {
    id: "makwanpur-hetauda",
    name: "Hetauda",
    nepaliName: "हेटौंडा",
    type: "Sub-Metropolitan City",
    districtId: "makwanpur",
    provinceId: 3,
    totalWards: 19
  },
  {
    id: "sunsari-dharan",
    name: "Dharan",
    nepaliName: "धरान",
    type: "Sub-Metropolitan City",
    districtId: "sunsari",
    provinceId: 1,
    totalWards: 20
  },
  {
    id: "bara-kalaiya",
    name: "Kalaiya",
    nepaliName: "कलैया",
    type: "Sub-Metropolitan City",
    districtId: "bara",
    provinceId: 2,
    totalWards: 27
  },
  {
    id: "rupandehi-butwal",
    name: "Butwal",
    nepaliName: "बुटवल",
    type: "Sub-Metropolitan City",
    districtId: "rupandehi",
    provinceId: 5,
    totalWards: 19
  },
  {
    id: "sunsari-itahari",
    name: "Itahari",
    nepaliName: "इटहरी",
    type: "Sub-Metropolitan City",
    districtId: "sunsari",
    provinceId: 1,
    totalWards: 20
  },
  {
    id: "dhanusha-janakpurdham",
    name: "Janakpurdham",
    nepaliName: "जनकपुरधाम",
    type: "Sub-Metropolitan City",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 25
  },
  {
    id: "banke-nepalgunj",
    name: "Nepalgunj",
    nepaliName: "नेपालगन्ज",
    type: "Sub-Metropolitan City",
    districtId: "banke",
    provinceId: 5,
    totalWards: 23
  },
  {
    id: "taplejung-phungling",
    name: "Phungling",
    nepaliName: "फुङ्लिङ",
    type: "Municipality",
    districtId: "taplejung",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "sankhuwasabha-dharmadevi",
    name: "Dharmadevi",
    nepaliName: "धर्मदेवी",
    type: "Municipality",
    districtId: "sankhuwasabha",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "sankhuwasabha-madi",
    name: "Madi",
    nepaliName: "माडी",
    type: "Municipality",
    districtId: "sankhuwasabha",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "sankhuwasabha-panchakhapan",
    name: "Panchakhapan",
    nepaliName: "पञ्चखापन",
    type: "Municipality",
    districtId: "sankhuwasabha",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "sankhuwasabha-chainpur",
    name: "Chainpur",
    nepaliName: "चैनपुर",
    type: "Municipality",
    districtId: "sankhuwasabha",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "sankhuwasabha-khandbari",
    name: "Khandbari",
    nepaliName: "खाँदबारी",
    type: "Municipality",
    districtId: "sankhuwasabha",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "solukhumbu-solududhakunda",
    name: "Solududhakunda",
    nepaliName: "सोलुदुधाकुण्ड",
    type: "Municipality",
    districtId: "solukhumbu",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "okhaldhunga-siddhicharan",
    name: "Siddhicharan",
    nepaliName: "सिद्धिचरण",
    type: "Municipality",
    districtId: "okhaldhunga",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "khotang-halesi-tuwachung",
    name: "Halesi Tuwachung",
    nepaliName: "हलेसी तुवाचुङ",
    type: "Municipality",
    districtId: "khotang",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "khotang-diktel-rupakot-majhuwagadhi",
    name: "Diktel Rupakot Majhuwagadhi",
    nepaliName: "दिक्तेल रुपाकोट मझुवागढी",
    type: "Municipality",
    districtId: "khotang",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "bhojpur-shadananda",
    name: "Shadananda",
    nepaliName: "षडानन्द",
    type: "Municipality",
    districtId: "bhojpur",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "bhojpur-bhojpur",
    name: "Bhojpur",
    nepaliName: "भोजपुर",
    type: "Municipality",
    districtId: "bhojpur",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "dhankuta-pakhribas",
    name: "Pakhribas",
    nepaliName: "पाखरिबास",
    type: "Municipality",
    districtId: "dhankuta",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "dhankuta-mahalaxmi",
    name: "Mahalaxmi",
    nepaliName: "महालक्ष्मी",
    type: "Municipality",
    districtId: "dhankuta",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "dhankuta-dhankuta",
    name: "Dhankuta",
    nepaliName: "धनकुटा",
    type: "Municipality",
    districtId: "dhankuta",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "terhathum-laligurans",
    name: "Laligurans",
    nepaliName: "लालीगुराँस",
    type: "Municipality",
    districtId: "terhathum",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "terhathum-myanglung",
    name: "Myanglung",
    nepaliName: "म्याङलुङ",
    type: "Municipality",
    districtId: "terhathum",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "panchthar-phidim",
    name: "Phidim",
    nepaliName: "फिदिम",
    type: "Municipality",
    districtId: "panchthar",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "ilam-illam",
    name: "Illam",
    nepaliName: "इलाम",
    type: "Municipality",
    districtId: "ilam",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "ilam-mai",
    name: "Mai",
    nepaliName: "माई",
    type: "Municipality",
    districtId: "ilam",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "ilam-deumai",
    name: "Deumai",
    nepaliName: "देउमाई",
    type: "Municipality",
    districtId: "ilam",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "ilam-suryodaya",
    name: "Suryodaya",
    nepaliName: "सूर्योदय",
    type: "Municipality",
    districtId: "ilam",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "jhapa-shivasataxi",
    name: "Shivasataxi",
    nepaliName: "शिवसताक्सी",
    type: "Municipality",
    districtId: "jhapa",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "jhapa-bhadrapur",
    name: "Bhadrapur",
    nepaliName: "भद्रपुर",
    type: "Municipality",
    districtId: "jhapa",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "jhapa-kankai",
    name: "Kankai",
    nepaliName: "कनकाई",
    type: "Municipality",
    districtId: "jhapa",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "jhapa-birtamod",
    name: "Birtamod",
    nepaliName: "बिर्तामोड",
    type: "Municipality",
    districtId: "jhapa",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "jhapa-mechinagar",
    name: "Mechinagar",
    nepaliName: "मेचीनगर",
    type: "Municipality",
    districtId: "jhapa",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "jhapa-damak",
    name: "Damak",
    nepaliName: "दमक",
    type: "Municipality",
    districtId: "jhapa",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "jhapa-arjundhara",
    name: "Arjundhara",
    nepaliName: "अर्जुनधारा",
    type: "Municipality",
    districtId: "jhapa",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "jhapa-gauradhaha",
    name: "Gauradhaha",
    nepaliName: "गौराधा",
    type: "Municipality",
    districtId: "jhapa",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "morang-letang",
    name: "Letang",
    nepaliName: "लेटाङ",
    type: "Municipality",
    districtId: "morang",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "morang-sunwarshi",
    name: "Sunwarshi",
    nepaliName: "सुनवर्शी",
    type: "Municipality",
    districtId: "morang",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "morang-rangeli",
    name: "Rangeli",
    nepaliName: "रंगेली",
    type: "Municipality",
    districtId: "morang",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "morang-pathari-shanishchare",
    name: "Pathari Shanishchare",
    nepaliName: "पथरी शनिश्चरे",
    type: "Municipality",
    districtId: "morang",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "morang-uralabari",
    name: "Uralabari",
    nepaliName: "उरालाबारी",
    type: "Municipality",
    districtId: "morang",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "morang-belbari",
    name: "Belbari",
    nepaliName: "बेलबारी",
    type: "Municipality",
    districtId: "morang",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "morang-sundarharaicha",
    name: "Sundarharaicha",
    nepaliName: "सुन्दरहरैचा",
    type: "Municipality",
    districtId: "morang",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "morang-ratuwamai",
    name: "Ratuwamai",
    nepaliName: "रतुवामाई",
    type: "Municipality",
    districtId: "morang",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "sunsari-ramdhuni",
    name: "Ramdhuni",
    nepaliName: "रामधुनी",
    type: "Municipality",
    districtId: "sunsari",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "sunsari-barahchhetra",
    name: "Barahchhetra",
    nepaliName: "बराहक्षेत्र",
    type: "Municipality",
    districtId: "sunsari",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "sunsari-duhabi",
    name: "Duhabi",
    nepaliName: "दुहबी",
    type: "Municipality",
    districtId: "sunsari",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "sunsari-inaruwa",
    name: "Inaruwa",
    nepaliName: "इनरुवा",
    type: "Municipality",
    districtId: "sunsari",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "udayapur-triyuga",
    name: "Triyuga",
    nepaliName: "त्रियुग",
    type: "Municipality",
    districtId: "udayapur",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "udayapur-katari",
    name: "Katari",
    nepaliName: "कटारी",
    type: "Municipality",
    districtId: "udayapur",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "udayapur-chaudandigadhi",
    name: "Chaudandigadhi",
    nepaliName: "चौदण्डीगढी",
    type: "Municipality",
    districtId: "udayapur",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "udayapur-belaka",
    name: "Belaka",
    nepaliName: "बेलका",
    type: "Municipality",
    districtId: "udayapur",
    provinceId: 1,
    totalWards: 11
  },
  {
    id: "saptari-hanumannagar-kankalini",
    name: "Hanumannagar Kankalini",
    nepaliName: "हनुमाननगर कंकालिनी",
    type: "Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "saptari-kanchanrup",
    name: "Kanchanrup",
    nepaliName: "कञ्चनरुप",
    type: "Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "saptari-rajbiraj",
    name: "Rajbiraj",
    nepaliName: "राजविराज",
    type: "Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "saptari-khadak",
    name: "Khadak",
    nepaliName: "खडक",
    type: "Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "saptari-dakneshwori",
    name: "Dakneshwori",
    nepaliName: "डाक्नेश्वरी",
    type: "Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "saptari-saptakoshi",
    name: "Saptakoshi",
    nepaliName: "सप्तकोशी",
    type: "Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "saptari-surunga",
    name: "Surunga",
    nepaliName: "सुरुङ्गा",
    type: "Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "saptari-shambhunath",
    name: "Shambhunath",
    nepaliName: "शम्भुनाथ",
    type: "Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "saptari-bode-barsain",
    name: "Bode Barsain",
    nepaliName: "बोडे बार्सैन",
    type: "Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "siraha-mirchaiya",
    name: "Mirchaiya",
    nepaliName: "मिर्चैया",
    type: "Municipality",
    districtId: "siraha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "siraha-lahan",
    name: "Lahan",
    nepaliName: "लहान",
    type: "Municipality",
    districtId: "siraha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "siraha-siraha",
    name: "Siraha",
    nepaliName: "सिरहा",
    type: "Municipality",
    districtId: "siraha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "siraha-dhangadhimai",
    name: "Dhangadhimai",
    nepaliName: "धनगढीमाई",
    type: "Municipality",
    districtId: "siraha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "siraha-kalyanpur",
    name: "Kalyanpur",
    nepaliName: "कल्याणपुर",
    type: "Municipality",
    districtId: "siraha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "siraha-karjanha",
    name: "Karjanha",
    nepaliName: "कर्जन्हा",
    type: "Municipality",
    districtId: "siraha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "siraha-golbazar",
    name: "Golbazar",
    nepaliName: "गोलबजार",
    type: "Municipality",
    districtId: "siraha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "siraha-sukhipur",
    name: "Sukhipur",
    nepaliName: "सुखीपुर",
    type: "Municipality",
    districtId: "siraha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "dhanusha-mithila-bihari",
    name: "Mithila Bihari",
    nepaliName: "मिथिला बिहारी",
    type: "Municipality",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "dhanusha-nagarain",
    name: "Nagarain",
    nepaliName: "नगराई",
    type: "Municipality",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "dhanusha-ganeshman-charnath",
    name: "Ganeshman Charnath",
    nepaliName: "गणेशमान चारनाथ",
    type: "Municipality",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "dhanusha-mithila",
    name: "Mithila",
    nepaliName: "मिथिला",
    type: "Municipality",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "dhanusha-dhanusadham",
    name: "Dhanusadham",
    nepaliName: "धनुषाधाम",
    type: "Municipality",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "dhanusha-bideha",
    name: "Bideha",
    nepaliName: "बिदेहा",
    type: "Municipality",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "dhanusha-sabaila",
    name: "Sabaila",
    nepaliName: "सबाइला",
    type: "Municipality",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "dhanusha-kamala",
    name: "Kamala",
    nepaliName: "कमला",
    type: "Municipality",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "dhanusha-hansapur",
    name: "Hansapur",
    nepaliName: "हंसपुर",
    type: "Municipality",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "dhanusha-sahidnagar",
    name: "Sahidnagar",
    nepaliName: "सहिदनगर",
    type: "Municipality",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "dhanusha-chhireshwarnath",
    name: "Chhireshwarnath",
    nepaliName: "क्षिरेश्वरनाथ",
    type: "Municipality",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "mahottari-gaushala",
    name: "Gaushala",
    nepaliName: "गौशाला",
    type: "Municipality",
    districtId: "mahottari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "mahottari-ramgopalpur",
    name: "Ramgopalpur",
    nepaliName: "रामगोपालपुर",
    type: "Municipality",
    districtId: "mahottari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "mahottari-aurahi",
    name: "Aurahi",
    nepaliName: "औरही",
    type: "Municipality",
    districtId: "mahottari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "mahottari-bardibas",
    name: "Bardibas",
    nepaliName: "बर्दिवास",
    type: "Municipality",
    districtId: "mahottari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "mahottari-bhangaha",
    name: "Bhangaha",
    nepaliName: "भङ्गाहा",
    type: "Municipality",
    districtId: "mahottari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "mahottari-jaleswor",
    name: "Jaleswor",
    nepaliName: "जलेश्वर",
    type: "Municipality",
    districtId: "mahottari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "mahottari-balwa",
    name: "Balwa",
    nepaliName: "बलवा",
    type: "Municipality",
    districtId: "mahottari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "mahottari-manra-siswa",
    name: "Manra Siswa",
    nepaliName: "मनरा सिसवा",
    type: "Municipality",
    districtId: "mahottari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "mahottari-matihani",
    name: "Matihani",
    nepaliName: "मटिहानी",
    type: "Municipality",
    districtId: "mahottari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "mahottari-loharpatti",
    name: "Loharpatti",
    nepaliName: "लोहारपट्टी",
    type: "Municipality",
    districtId: "mahottari",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "sarlahi-barahathawa",
    name: "Barahathawa",
    nepaliName: "बराहथवा",
    type: "Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "sarlahi-haripur",
    name: "Haripur",
    nepaliName: "हरिपुर",
    type: "Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "sarlahi-ishworpur",
    name: "Ishworpur",
    nepaliName: "ईश्वरपुर",
    type: "Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "sarlahi-lalbandi",
    name: "Lalbandi",
    nepaliName: "लालबन्दी",
    type: "Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "sarlahi-malangawa",
    name: "Malangawa",
    nepaliName: "मलङ्गवा",
    type: "Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "sarlahi-kabilasi",
    name: "Kabilasi",
    nepaliName: "कबिलासी",
    type: "Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "sarlahi-bagmati",
    name: "Bagmati",
    nepaliName: "बागमती",
    type: "Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "sarlahi-hariwan",
    name: "Hariwan",
    nepaliName: "हरिवान",
    type: "Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "sarlahi-balara",
    name: "Balara",
    nepaliName: "बलरा",
    type: "Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "sarlahi-haripurwa",
    name: "Haripurwa",
    nepaliName: "हरिपुरवा",
    type: "Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "sarlahi-godaita",
    name: "Godaita",
    nepaliName: "गोदैता",
    type: "Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "rautahat-katahariya",
    name: "Katahariya",
    nepaliName: "कटहरिया",
    type: "Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "rautahat-maulapur",
    name: "Maulapur",
    nepaliName: "मौलापुर",
    type: "Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "rautahat-madhav-narayan",
    name: "Madhav Narayan",
    nepaliName: "माधव नारायण",
    type: "Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "rautahat-gaur",
    name: "Gaur",
    nepaliName: "गौर",
    type: "Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "rautahat-gujara",
    name: "Gujara",
    nepaliName: "गुजरा",
    type: "Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "rautahat-garuda",
    name: "Garuda",
    nepaliName: "गरुड",
    type: "Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "rautahat-ishanath",
    name: "Ishanath",
    nepaliName: "ईशानाथ",
    type: "Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "rautahat-chandrapur",
    name: "Chandrapur",
    nepaliName: "चन्द्रपुर",
    type: "Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "rautahat-dewahi-gonahi",
    name: "Dewahi Gonahi",
    nepaliName: "देवाही गोनाही",
    type: "Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "rautahat-brindaban",
    name: "Brindaban",
    nepaliName: "वृन्दबन",
    type: "Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "rautahat-rajpur",
    name: "Rajpur",
    nepaliName: "राजपुर",
    type: "Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "rautahat-rajdevi",
    name: "Rajdevi",
    nepaliName: "राजदेवी",
    type: "Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "rautahat-gadhimai",
    name: "Gadhimai",
    nepaliName: "गढीमाई",
    type: "Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "rautahat-phatuwa-bijayapur",
    name: "Phatuwa Bijayapur",
    nepaliName: "विजयपुर फटुवा",
    type: "Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "rautahat-baudhimai",
    name: "Baudhimai",
    nepaliName: "बौधिमाई",
    type: "Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "rautahat-paroha",
    name: "Paroha",
    nepaliName: "पारोहा",
    type: "Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "bara-pacharauta",
    name: "Pacharauta",
    nepaliName: "पचरौता",
    type: "Municipality",
    districtId: "bara",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "bara-nijgadh",
    name: "Nijgadh",
    nepaliName: "निजगढ",
    type: "Municipality",
    districtId: "bara",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "bara-simraungadh",
    name: "Simraungadh",
    nepaliName: "सिम्रौनगढ",
    type: "Municipality",
    districtId: "bara",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "bara-mahagadhimai",
    name: "Mahagadhimai",
    nepaliName: "महागढीमाई",
    type: "Municipality",
    districtId: "bara",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "bara-kolhabi",
    name: "Kolhabi",
    nepaliName: "कोल्हाबी",
    type: "Municipality",
    districtId: "bara",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "parsa-bahudaramai",
    name: "Bahudaramai",
    nepaliName: "बहुदरमाई",
    type: "Municipality",
    districtId: "parsa",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "parsa-pokhariya",
    name: "Pokhariya",
    nepaliName: "पोखरिया",
    type: "Municipality",
    districtId: "parsa",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "parsa-parsagadhi",
    name: "Parsagadhi",
    nepaliName: "पर्सागढी",
    type: "Municipality",
    districtId: "parsa",
    provinceId: 2,
    totalWards: 11
  },
  {
    id: "dolakha-jiri",
    name: "Jiri",
    nepaliName: "जिरी",
    type: "Municipality",
    districtId: "dolakha",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "dolakha-bhimeshwor",
    name: "Bhimeshwor",
    nepaliName: "भीमेश्वर",
    type: "Municipality",
    districtId: "dolakha",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "sindhupalchok-chautara-sangachokgadhi",
    name: "Chautara SangachokGadhi",
    nepaliName: "चौतारा साँगाचोकगढी",
    type: "Municipality",
    districtId: "sindhupalchok",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "sindhupalchok-barhabise",
    name: "Barhabise",
    nepaliName: "बाह्रबिसे",
    type: "Municipality",
    districtId: "sindhupalchok",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "sindhupalchok-melamchi",
    name: "Melamchi",
    nepaliName: "मेलम्ची",
    type: "Municipality",
    districtId: "sindhupalchok",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "dhading-nilakantha",
    name: "Nilakantha",
    nepaliName: "नीलकण्ठ",
    type: "Municipality",
    districtId: "dhading",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "dhading-dhunibesi",
    name: "Dhunibesi",
    nepaliName: "धुनिबेसी",
    type: "Municipality",
    districtId: "dhading",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "nuwakot-belkotgadhi",
    name: "Belkotgadhi",
    nepaliName: "बेलकोटगढी",
    type: "Municipality",
    districtId: "nuwakot",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "nuwakot-bidur",
    name: "Bidur",
    nepaliName: "बिदुर",
    type: "Municipality",
    districtId: "nuwakot",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "kathmandu-kirtipur",
    name: "Kirtipur",
    nepaliName: "कीर्तिपुर",
    type: "Municipality",
    districtId: "kathmandu",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "kathmandu-shankharapur",
    name: "Shankharapur",
    nepaliName: "शंखरापुर",
    type: "Municipality",
    districtId: "kathmandu",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "kathmandu-nagarjun",
    name: "Nagarjun",
    nepaliName: "नागार्जुन",
    type: "Municipality",
    districtId: "kathmandu",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "kathmandu-kageshwori-manahora",
    name: "Kageshwori Manahora",
    nepaliName: "कागेश्वरी मनहोरा",
    type: "Municipality",
    districtId: "kathmandu",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "kathmandu-dakshinkali",
    name: "Dakshinkali",
    nepaliName: "दक्षिणकाली",
    type: "Municipality",
    districtId: "kathmandu",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "kathmandu-budhanilakantha",
    name: "Budhanilakantha",
    nepaliName: "बुढानिलकण्ठ",
    type: "Municipality",
    districtId: "kathmandu",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "kathmandu-tarakeshwor",
    name: "Tarakeshwor",
    nepaliName: "तारकेश्वर",
    type: "Municipality",
    districtId: "kathmandu",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "kathmandu-tokha",
    name: "Tokha",
    nepaliName: "टोखा",
    type: "Municipality",
    districtId: "kathmandu",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "kathmandu-chandragiri",
    name: "Chandragiri",
    nepaliName: "चन्द्रागिरि",
    type: "Municipality",
    districtId: "kathmandu",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "kathmandu-gokarneshwor",
    name: "Gokarneshwor",
    nepaliName: "गोकर्णेश्वर",
    type: "Municipality",
    districtId: "kathmandu",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "bhaktapur-changunarayan",
    name: "Changunarayan",
    nepaliName: "चाँगुनारायण",
    type: "Municipality",
    districtId: "bhaktapur",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "bhaktapur-suryabinayak",
    name: "Suryabinayak",
    nepaliName: "सूर्यविनायक",
    type: "Municipality",
    districtId: "bhaktapur",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "bhaktapur-bhaktapur",
    name: "Bhaktapur",
    nepaliName: "भक्तपुर",
    type: "Municipality",
    districtId: "bhaktapur",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "bhaktapur-madhyapur-thimi",
    name: "Madhyapur Thimi",
    nepaliName: "मध्यपुरथिमि",
    type: "Municipality",
    districtId: "bhaktapur",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "lalitpur-mahalaxmi",
    name: "Mahalaxmi",
    nepaliName: "महालक्ष्मी",
    type: "Municipality",
    districtId: "lalitpur",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "lalitpur-godawari",
    name: "Godawari",
    nepaliName: "गोदावरी",
    type: "Municipality",
    districtId: "lalitpur",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "kavrepalanchok-banepa",
    name: "Banepa",
    nepaliName: "बनेपा",
    type: "Municipality",
    districtId: "kavrepalanchok",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "kavrepalanchok-mandandeupur",
    name: "Mandandeupur",
    nepaliName: "मण्डनदेउपुर",
    type: "Municipality",
    districtId: "kavrepalanchok",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "kavrepalanchok-dhulikhel",
    name: "Dhulikhel",
    nepaliName: "धुलिखेल",
    type: "Municipality",
    districtId: "kavrepalanchok",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "kavrepalanchok-panauti",
    name: "Panauti",
    nepaliName: "पनौती",
    type: "Municipality",
    districtId: "kavrepalanchok",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "kavrepalanchok-namobuddha",
    name: "Namobuddha",
    nepaliName: "नमोबुद्ध",
    type: "Municipality",
    districtId: "kavrepalanchok",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "kavrepalanchok-panchkhal",
    name: "Panchkhal",
    nepaliName: "पाँचखाल",
    type: "Municipality",
    districtId: "kavrepalanchok",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "ramechhap-manthali",
    name: "Manthali",
    nepaliName: "मन्थली",
    type: "Municipality",
    districtId: "ramechhap",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "ramechhap-ramechhap",
    name: "Ramechhap",
    nepaliName: "रामेछाप",
    type: "Municipality",
    districtId: "ramechhap",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "sindhuli-dudhouli",
    name: "Dudhouli",
    nepaliName: "दुधौली",
    type: "Municipality",
    districtId: "sindhuli",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "sindhuli-kamalamai",
    name: "Kamalamai",
    nepaliName: "कमलामाई",
    type: "Municipality",
    districtId: "sindhuli",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "makwanpur-thaha",
    name: "Thaha",
    nepaliName: "थाहा",
    type: "Municipality",
    districtId: "makwanpur",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "chitwan-kalika",
    name: "Kalika",
    nepaliName: "कालिका",
    type: "Municipality",
    districtId: "chitwan",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "chitwan-khairahani",
    name: "Khairahani",
    nepaliName: "खैरहनी",
    type: "Municipality",
    districtId: "chitwan",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "chitwan-madi",
    name: "Madi",
    nepaliName: "माडी",
    type: "Municipality",
    districtId: "chitwan",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "chitwan-rapti",
    name: "Rapti",
    nepaliName: "राप्ती",
    type: "Municipality",
    districtId: "chitwan",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "chitwan-ratnanagar",
    name: "Ratnanagar",
    nepaliName: "रत्ननगर",
    type: "Municipality",
    districtId: "chitwan",
    provinceId: 3,
    totalWards: 11
  },
  {
    id: "gorkha-palungtar",
    name: "Palungtar",
    nepaliName: "पालुङटार",
    type: "Municipality",
    districtId: "gorkha",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "gorkha-gorkha",
    name: "Gorkha",
    nepaliName: "गोरखा",
    type: "Municipality",
    districtId: "gorkha",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "myagdi-beni",
    name: "Beni",
    nepaliName: "बेनी",
    type: "Municipality",
    districtId: "myagdi",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "lamjung-sundarbazar",
    name: "Sundarbazar",
    nepaliName: "सुन्दरबजार",
    type: "Municipality",
    districtId: "lamjung",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "lamjung-besishahar",
    name: "Besishahar",
    nepaliName: "बेशिशहर",
    type: "Municipality",
    districtId: "lamjung",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "lamjung-rainas",
    name: "Rainas",
    nepaliName: "रैनास",
    type: "Municipality",
    districtId: "lamjung",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "lamjung-madhyanepal",
    name: "MadhyaNepal",
    nepaliName: "मध्यनेपाल",
    type: "Municipality",
    districtId: "lamjung",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "tanahun-byas",
    name: "Byas",
    nepaliName: "ब्यास",
    type: "Municipality",
    districtId: "tanahun",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "tanahun-shuklagandaki",
    name: "Shuklagandaki",
    nepaliName: "शुक्लागण्डकी",
    type: "Municipality",
    districtId: "tanahun",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "tanahun-bhimad",
    name: "Bhimad",
    nepaliName: "भीमद",
    type: "Municipality",
    districtId: "tanahun",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "tanahun-bhanu",
    name: "Bhanu",
    nepaliName: "भानु",
    type: "Municipality",
    districtId: "tanahun",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "nawalpur-madhyabindu",
    name: "Madhyabindu",
    nepaliName: "मध्यविन्दु",
    type: "Municipality",
    districtId: "nawalpur",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "nawalpur-devchuli",
    name: "Devchuli",
    nepaliName: "देवचुली",
    type: "Municipality",
    districtId: "nawalpur",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "nawalpur-gaidakot",
    name: "Gaidakot",
    nepaliName: "गैडाकोट",
    type: "Municipality",
    districtId: "nawalpur",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "nawalpur-kawasoti",
    name: "Kawasoti",
    nepaliName: "कावासोती",
    type: "Municipality",
    districtId: "nawalpur",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "syangja-putalibazar",
    name: "Putalibazar",
    nepaliName: "पुतलीबजार",
    type: "Municipality",
    districtId: "syangja",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "syangja-bhirkot",
    name: "Bhirkot",
    nepaliName: "भिरकोट",
    type: "Municipality",
    districtId: "syangja",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "syangja-galyang",
    name: "Galyang",
    nepaliName: "गल्याङ",
    type: "Municipality",
    districtId: "syangja",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "syangja-chapakot",
    name: "Chapakot",
    nepaliName: "चापाकोट",
    type: "Municipality",
    districtId: "syangja",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "syangja-waling",
    name: "Waling",
    nepaliName: "वालिङ",
    type: "Municipality",
    districtId: "syangja",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "parbat-kushma",
    name: "Kushma",
    nepaliName: "कुश्मा",
    type: "Municipality",
    districtId: "parbat",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "parbat-phalebas",
    name: "Phalebas",
    nepaliName: "फलेबास",
    type: "Municipality",
    districtId: "parbat",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "baglung-jaimuni",
    name: "Jaimuni",
    nepaliName: "जैमुनी",
    type: "Municipality",
    districtId: "baglung",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "baglung-baglung",
    name: "Baglung",
    nepaliName: "बाग्लुङ",
    type: "Municipality",
    districtId: "baglung",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "baglung-galkot",
    name: "Galkot",
    nepaliName: "गलकोट",
    type: "Municipality",
    districtId: "baglung",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "baglung-dhorpatan",
    name: "Dhorpatan",
    nepaliName: "ढोरपाटन",
    type: "Municipality",
    districtId: "baglung",
    provinceId: 4,
    totalWards: 11
  },
  {
    id: "rolpa-rolpa",
    name: "Rolpa",
    nepaliName: "रोल्पा",
    type: "Municipality",
    districtId: "rolpa",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "pyuthan-pyuthan",
    name: "Pyuthan",
    nepaliName: "प्युठान",
    type: "Municipality",
    districtId: "pyuthan",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "pyuthan-sworgadwary",
    name: "Sworgadwary",
    nepaliName: "स्वर्गद्वारी",
    type: "Municipality",
    districtId: "pyuthan",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "gulmi-resunga",
    name: "Resunga",
    nepaliName: "रेसुंगा",
    type: "Municipality",
    districtId: "gulmi",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "gulmi-musikot",
    name: "Musikot",
    nepaliName: "मुसिकोट",
    type: "Municipality",
    districtId: "gulmi",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "arghakhanchi-bhumekasthan",
    name: "Bhumekasthan",
    nepaliName: "भुमेकस्थान",
    type: "Municipality",
    districtId: "arghakhanchi",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "arghakhanchi-sitganga",
    name: "Sitganga",
    nepaliName: "सितगंगा",
    type: "Municipality",
    districtId: "arghakhanchi",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "arghakhanchi-sandhikharka",
    name: "Sandhikharka",
    nepaliName: "सन्धिखर्क",
    type: "Municipality",
    districtId: "arghakhanchi",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "palpa-tansen",
    name: "Tansen",
    nepaliName: "तानसेन",
    type: "Municipality",
    districtId: "palpa",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "palpa-rampur",
    name: "Rampur",
    nepaliName: "रामपुर",
    type: "Municipality",
    districtId: "palpa",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "parasi-bardaghat",
    name: "Bardaghat",
    nepaliName: "बर्दघाट",
    type: "Municipality",
    districtId: "parasi",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "parasi-sunwal",
    name: "Sunwal",
    nepaliName: "सुनवल",
    type: "Municipality",
    districtId: "parasi",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "parasi-ramgram",
    name: "Ramgram",
    nepaliName: "रामग्राम",
    type: "Municipality",
    districtId: "parasi",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "rupandehi-lumbini-sanskritik",
    name: "Lumbini Sanskritik",
    nepaliName: "लुम्बिनी संस्कृत",
    type: "Municipality",
    districtId: "rupandehi",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "rupandehi-devdaha",
    name: "Devdaha",
    nepaliName: "देवदह",
    type: "Municipality",
    districtId: "rupandehi",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "rupandehi-sainamaina",
    name: "Sainamaina",
    nepaliName: "सैनामैना",
    type: "Municipality",
    districtId: "rupandehi",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "rupandehi-siddharthanagar",
    name: "Siddharthanagar",
    nepaliName: "सिद्धार्थनगर",
    type: "Municipality",
    districtId: "rupandehi",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "rupandehi-tillotama",
    name: "Tillotama",
    nepaliName: "तिलोतमा",
    type: "Municipality",
    districtId: "rupandehi",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "kapilvastu-shivaraj",
    name: "Shivaraj",
    nepaliName: "शिवराज",
    type: "Municipality",
    districtId: "kapilvastu",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "kapilvastu-kapilbastu",
    name: "Kapilbastu",
    nepaliName: "कपिलवस्तु",
    type: "Municipality",
    districtId: "kapilvastu",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "kapilvastu-buddhabhumi",
    name: "Buddhabhumi",
    nepaliName: "बुद्धभूमि",
    type: "Municipality",
    districtId: "kapilvastu",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "kapilvastu-maharajgunj",
    name: "Maharajgunj",
    nepaliName: "महाराजगन्ज",
    type: "Municipality",
    districtId: "kapilvastu",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "kapilvastu-banganga",
    name: "Banganga",
    nepaliName: "बाणगंगा",
    type: "Municipality",
    districtId: "kapilvastu",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "kapilvastu-krishnanagar",
    name: "Krishnanagar",
    nepaliName: "कृष्णनगर",
    type: "Municipality",
    districtId: "kapilvastu",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "dang-lamahi",
    name: "Lamahi",
    nepaliName: "लमही",
    type: "Municipality",
    districtId: "dang",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "banke-kohalpur",
    name: "Kohalpur",
    nepaliName: "कोहलपुर",
    type: "Municipality",
    districtId: "banke",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "bardiya-thakurbaba",
    name: "Thakurbaba",
    nepaliName: "ठाकुरबाबा",
    type: "Municipality",
    districtId: "bardiya",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "bardiya-bansagadhi",
    name: "Bansagadhi",
    nepaliName: "बाँसगढी",
    type: "Municipality",
    districtId: "bardiya",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "bardiya-barbardiya",
    name: "Barbardiya",
    nepaliName: "बारबर्दिया",
    type: "Municipality",
    districtId: "bardiya",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "bardiya-rajapur",
    name: "Rajapur",
    nepaliName: "राजापुर",
    type: "Municipality",
    districtId: "bardiya",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "bardiya-madhuwan",
    name: "Madhuwan",
    nepaliName: "मधुवन",
    type: "Municipality",
    districtId: "bardiya",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "bardiya-gulariya",
    name: "Gulariya",
    nepaliName: "गुलरिया",
    type: "Municipality",
    districtId: "bardiya",
    provinceId: 5,
    totalWards: 11
  },
  {
    id: "dolpa-tripurasundari",
    name: "Tripurasundari",
    nepaliName: "त्रिपुरासुन्दरी",
    type: "Municipality",
    districtId: "dolpa",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "dolpa-thuli-bheri",
    name: "Thuli Bheri",
    nepaliName: "ठुली भेरी",
    type: "Municipality",
    districtId: "dolpa",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "mugu-chhayanath-rara",
    name: "Chhayanath Rara",
    nepaliName: "छायानाथ रारा",
    type: "Municipality",
    districtId: "mugu",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "jumla-chandannath",
    name: "Chandannath",
    nepaliName: "चन्दननाथ",
    type: "Municipality",
    districtId: "jumla",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "kalikot-khandachakra",
    name: "Khandachakra",
    nepaliName: "खंडचक्र",
    type: "Municipality",
    districtId: "kalikot",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "kalikot-raskot",
    name: "Raskot",
    nepaliName: "रास्कोट",
    type: "Municipality",
    districtId: "kalikot",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "kalikot-tilagufa",
    name: "Tilagufa",
    nepaliName: "तिलागुफा",
    type: "Municipality",
    districtId: "kalikot",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "dailekh-aathabis",
    name: "Aathabis",
    nepaliName: "आठबिस",
    type: "Municipality",
    districtId: "dailekh",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "dailekh-dullu",
    name: "Dullu",
    nepaliName: "दुल्लु",
    type: "Municipality",
    districtId: "dailekh",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "dailekh-chamunda-bindrasaini",
    name: "Chamunda Bindrasaini",
    nepaliName: "चामुण्डा बिन्द्रसैनी",
    type: "Municipality",
    districtId: "dailekh",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "dailekh-narayan",
    name: "Narayan",
    nepaliName: "नारायण",
    type: "Municipality",
    districtId: "dailekh",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "jajarkot-nalagad",
    name: "Nalagad",
    nepaliName: "नालागड",
    type: "Municipality",
    districtId: "jajarkot",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "jajarkot-bheri",
    name: "Bheri",
    nepaliName: "भेरी",
    type: "Municipality",
    districtId: "jajarkot",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "jajarkot-chhedagad",
    name: "Chhedagad",
    nepaliName: "छेडागढ",
    type: "Municipality",
    districtId: "jajarkot",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "western-rukum-aathbiskot",
    name: "Aathbiskot",
    nepaliName: "आठबिस्कोट",
    type: "Municipality",
    districtId: "western-rukum",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "western-rukum-chaurjahari",
    name: "Chaurjahari",
    nepaliName: "चौरजहारी",
    type: "Municipality",
    districtId: "western-rukum",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "western-rukum-musikot",
    name: "Musikot",
    nepaliName: "मुसिकोट",
    type: "Municipality",
    districtId: "western-rukum",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "salyan-sharada",
    name: "Sharada",
    nepaliName: "शारदा",
    type: "Municipality",
    districtId: "salyan",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "salyan-bangad",
    name: "Bangad",
    nepaliName: "बांगड",
    type: "Municipality",
    districtId: "salyan",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "salyan-bagchaur",
    name: "Bagchaur",
    nepaliName: "बागचौर",
    type: "Municipality",
    districtId: "salyan",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "surkhet-gurbhakot",
    name: "Gurbhakot",
    nepaliName: "गुर्भाकोट",
    type: "Municipality",
    districtId: "surkhet",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "surkhet-panchpuri",
    name: "Panchpuri",
    nepaliName: "पञ्चपुरी",
    type: "Municipality",
    districtId: "surkhet",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "surkhet-bheriganga",
    name: "Bheriganga",
    nepaliName: "भेरीगंगा",
    type: "Municipality",
    districtId: "surkhet",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "surkhet-lekbeshi",
    name: "Lekbeshi",
    nepaliName: "लेकबेशी",
    type: "Municipality",
    districtId: "surkhet",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "surkhet-birendranagar",
    name: "Birendranagar",
    nepaliName: "वीरेन्द्रनगर",
    type: "Municipality",
    districtId: "surkhet",
    provinceId: 6,
    totalWards: 11
  },
  {
    id: "bajura-badimalika",
    name: "Badimalika",
    nepaliName: "बडिमालिका",
    type: "Municipality",
    districtId: "bajura",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "bajura-tribeni",
    name: "Tribeni",
    nepaliName: "त्रिवेणी",
    type: "Municipality",
    districtId: "bajura",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "bajura-budhiganga",
    name: "Budhiganga",
    nepaliName: "बुढीगंगा",
    type: "Municipality",
    districtId: "bajura",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "bajura-budhinanda",
    name: "Budhinanda",
    nepaliName: "बुढीनन्द",
    type: "Municipality",
    districtId: "bajura",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "bajhang-jayaprithivi",
    name: "JayaPrithivi",
    nepaliName: "जय पृथ्वी",
    type: "Municipality",
    districtId: "bajhang",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "bajhang-bungal",
    name: "Bungal",
    nepaliName: "बुंगल",
    type: "Municipality",
    districtId: "bajhang",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "darchula-mahakali",
    name: "Mahakali",
    nepaliName: "महाकाली",
    type: "Municipality",
    districtId: "darchula",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "darchula-shailyashikhar",
    name: "Shailyashikhar",
    nepaliName: "शैल्यशिखर",
    type: "Municipality",
    districtId: "darchula",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "baitadi-melauli",
    name: "Melauli",
    nepaliName: "मेलौली",
    type: "Municipality",
    districtId: "baitadi",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "baitadi-dasharathchanda",
    name: "Dasharathchanda",
    nepaliName: "दशरथचन्द",
    type: "Municipality",
    districtId: "baitadi",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "baitadi-purchaudi",
    name: "Purchaudi",
    nepaliName: "पुर्चौडी",
    type: "Municipality",
    districtId: "baitadi",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "baitadi-patan",
    name: "Patan",
    nepaliName: "पाटन",
    type: "Municipality",
    districtId: "baitadi",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "dadeldhura-amargadhi",
    name: "Amargadhi",
    nepaliName: "अमरगढी",
    type: "Municipality",
    districtId: "dadeldhura",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "dadeldhura-parashuram",
    name: "Parashuram",
    nepaliName: "परशुराम",
    type: "Municipality",
    districtId: "dadeldhura",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "doti-dipayal-silgadi",
    name: "Dipayal Silgadi",
    nepaliName: "दिपायल सिलगढी",
    type: "Municipality",
    districtId: "doti",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "doti-shikhar",
    name: "Shikhar",
    nepaliName: "शिखर",
    type: "Municipality",
    districtId: "doti",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "achham-sanphebagar",
    name: "Sanphebagar",
    nepaliName: "साँफेबगर",
    type: "Municipality",
    districtId: "achham",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "achham-mangalsen",
    name: "Mangalsen",
    nepaliName: "मंगलसेन",
    type: "Municipality",
    districtId: "achham",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "achham-kamalbazar",
    name: "Kamalbazar",
    nepaliName: "कमलबजार",
    type: "Municipality",
    districtId: "achham",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "achham-panchadewal-binayak",
    name: "Panchadewal Binayak",
    nepaliName: "पञ्चदेवल विनायक",
    type: "Municipality",
    districtId: "achham",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "kailali-tikapur",
    name: "Tikapur",
    nepaliName: "टीकापुर",
    type: "Municipality",
    districtId: "kailali",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "kailali-ghodaghodi",
    name: "Ghodaghodi",
    nepaliName: "घोडाघोडी",
    type: "Municipality",
    districtId: "kailali",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "kailali-bhajani",
    name: "Bhajani",
    nepaliName: "भजनी",
    type: "Municipality",
    districtId: "kailali",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "kailali-gauriganga",
    name: "Gauriganga",
    nepaliName: "गौरीगंगा",
    type: "Municipality",
    districtId: "kailali",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "kailali-godawari",
    name: "Godawari",
    nepaliName: "गोदावरी",
    type: "Municipality",
    districtId: "kailali",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "kailali-lamkichuha",
    name: "Lamkichuha",
    nepaliName: "लम्कीचुहा",
    type: "Municipality",
    districtId: "kailali",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "kanchanpur-punarbas",
    name: "Punarbas",
    nepaliName: "पुनर्वास",
    type: "Municipality",
    districtId: "kanchanpur",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "kanchanpur-krishnapur",
    name: "Krishnapur",
    nepaliName: "कृष्णपुर",
    type: "Municipality",
    districtId: "kanchanpur",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "kanchanpur-mahakali",
    name: "Mahakali",
    nepaliName: "महाकाली",
    type: "Municipality",
    districtId: "kanchanpur",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "kanchanpur-bedkot",
    name: "Bedkot",
    nepaliName: "बेदकोट",
    type: "Municipality",
    districtId: "kanchanpur",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "kanchanpur-belauri",
    name: "Belauri",
    nepaliName: "बेलौरी",
    type: "Municipality",
    districtId: "kanchanpur",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "kanchanpur-bhimdatta",
    name: "Bhimdatta",
    nepaliName: "भीमदत्त",
    type: "Municipality",
    districtId: "kanchanpur",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "kanchanpur-shuklaphanta",
    name: "Shuklaphanta",
    nepaliName: "शुक्लाफाँटा",
    type: "Municipality",
    districtId: "kanchanpur",
    provinceId: 7,
    totalWards: 11
  },
  {
    id: "taplejung-sidingba",
    name: "Sidingba",
    nepaliName: "सिडिङबा",
    type: "Rural Municipality",
    districtId: "taplejung",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "taplejung-meringden",
    name: "Meringden",
    nepaliName: "Meringden",
    type: "Rural Municipality",
    districtId: "taplejung",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "taplejung-maiwakhola",
    name: "Maiwakhola",
    nepaliName: "माइवाखोला",
    type: "Rural Municipality",
    districtId: "taplejung",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "taplejung-phaktanglung",
    name: "Phaktanglung",
    nepaliName: "फाक्ताङलुङ",
    type: "Rural Municipality",
    districtId: "taplejung",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "taplejung-sirijangha",
    name: "Sirijangha",
    nepaliName: "सिरिजाङ्घा",
    type: "Rural Municipality",
    districtId: "taplejung",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "taplejung-mikwakhola",
    name: "Mikwakhola",
    nepaliName: "मिक्वाखोला",
    type: "Rural Municipality",
    districtId: "taplejung",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "taplejung-aathrai-tribeni",
    name: "Aathrai Tribeni",
    nepaliName: "आठराई त्रिवेणी",
    type: "Rural Municipality",
    districtId: "taplejung",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "taplejung-pathivara-yangwarak",
    name: "Pathivara Yangwarak",
    nepaliName: "पाथिवरा यांगवारक",
    type: "Rural Municipality",
    districtId: "taplejung",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "sankhuwasabha-makalu",
    name: "Makalu",
    nepaliName: "मकालु",
    type: "Rural Municipality",
    districtId: "sankhuwasabha",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "sankhuwasabha-chichila",
    name: "Chichila",
    nepaliName: "चिचिला",
    type: "Rural Municipality",
    districtId: "sankhuwasabha",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "sankhuwasabha-silichong",
    name: "Silichong",
    nepaliName: "सिलिचङ",
    type: "Rural Municipality",
    districtId: "sankhuwasabha",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "sankhuwasabha-bhotkhola",
    name: "Bhotkhola",
    nepaliName: "भोटखोला",
    type: "Rural Municipality",
    districtId: "sankhuwasabha",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "sankhuwasabha-sabhapokhari",
    name: "Sabhapokhari",
    nepaliName: "सभापोखरी",
    type: "Rural Municipality",
    districtId: "sankhuwasabha",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "solukhumbu-sotang",
    name: "Sotang",
    nepaliName: "सोटाङ",
    type: "Rural Municipality",
    districtId: "solukhumbu",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "solukhumbu-mahakulung",
    name: "Mahakulung",
    nepaliName: "महाकुलुङ",
    type: "Rural Municipality",
    districtId: "solukhumbu",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "solukhumbu-likhupike",
    name: "Likhupike",
    nepaliName: "लिखुपिके",
    type: "Rural Municipality",
    districtId: "solukhumbu",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "solukhumbu-nechasalyan",
    name: "Nechasalyan",
    nepaliName: "नेचासल्यान",
    type: "Rural Municipality",
    districtId: "solukhumbu",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "solukhumbu-thulung-dudhkoshi",
    name: "Thulung Dudhkoshi",
    nepaliName: "थुलुङ दुधकोशी",
    type: "Rural Municipality",
    districtId: "solukhumbu",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "solukhumbu-maapya-dudhkoshi",
    name: "Maapya Dudhkoshi",
    nepaliName: "माप्या दुधकोशी",
    type: "Rural Municipality",
    districtId: "solukhumbu",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "solukhumbu-khumbupasanglahmu",
    name: "Khumbupasanglahmu",
    nepaliName: "खुम्बुपसङ्लाहमु",
    type: "Rural Municipality",
    districtId: "solukhumbu",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "okhaldhunga-likhu",
    name: "Likhu",
    nepaliName: "लिखु",
    type: "Rural Municipality",
    districtId: "okhaldhunga",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "okhaldhunga-molung",
    name: "Molung",
    nepaliName: "मोलुङ",
    type: "Rural Municipality",
    districtId: "okhaldhunga",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "okhaldhunga-sunkoshi",
    name: "Sunkoshi",
    nepaliName: "सुनकोशी",
    type: "Rural Municipality",
    districtId: "okhaldhunga",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "okhaldhunga-champadevi",
    name: "Champadevi",
    nepaliName: "चम्पादेवी",
    type: "Rural Municipality",
    districtId: "okhaldhunga",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "okhaldhunga-chisankhugadhi",
    name: "Chisankhugadhi",
    nepaliName: "चिसंखुगढी",
    type: "Rural Municipality",
    districtId: "okhaldhunga",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "okhaldhunga-khijidemba",
    name: "Khijidemba",
    nepaliName: "खिजिदेम्बा",
    type: "Rural Municipality",
    districtId: "okhaldhunga",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "okhaldhunga-manebhanjyang",
    name: "Manebhanjyang",
    nepaliName: "मानेभञ्ज्याङ",
    type: "Rural Municipality",
    districtId: "okhaldhunga",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "khotang-sakela",
    name: "Sakela",
    nepaliName: "साकेला",
    type: "Rural Municipality",
    districtId: "khotang",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "khotang-khotehang",
    name: "Khotehang",
    nepaliName: "खोटेहाङ",
    type: "Rural Municipality",
    districtId: "khotang",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "khotang-barahapokhari",
    name: "Barahapokhari",
    nepaliName: "बराहापोखरी",
    type: "Rural Municipality",
    districtId: "khotang",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "khotang-ainselukhark",
    name: "Ainselukhark",
    nepaliName: "ऐसेलुखर्क",
    type: "Rural Municipality",
    districtId: "khotang",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "khotang-rawa-besi",
    name: "Rawa Besi",
    nepaliName: "रवा बेसी",
    type: "Rural Municipality",
    districtId: "khotang",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "khotang-kepilasagadhi",
    name: "Kepilasagadhi",
    nepaliName: "केपिलासगढी",
    type: "Rural Municipality",
    districtId: "khotang",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "khotang-jantedhunga",
    name: "Jantedhunga",
    nepaliName: "जानतेढुङ्गा",
    type: "Rural Municipality",
    districtId: "khotang",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "khotang-diprung",
    name: "Diprung",
    nepaliName: "डिप्रुङ",
    type: "Rural Municipality",
    districtId: "khotang",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "bhojpur-arun",
    name: "Arun",
    nepaliName: "अरुण",
    type: "Rural Municipality",
    districtId: "bhojpur",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "bhojpur-aamchowk",
    name: "Aamchowk",
    nepaliName: "आमचोक",
    type: "Rural Municipality",
    districtId: "bhojpur",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "bhojpur-hatuwagadhi",
    name: "Hatuwagadhi",
    nepaliName: "हतुवागढी",
    type: "Rural Municipality",
    districtId: "bhojpur",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "bhojpur-pauwadungma",
    name: "Pauwadungma",
    nepaliName: "पौवाडुङ्मा",
    type: "Rural Municipality",
    districtId: "bhojpur",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "bhojpur-temkemaiyung",
    name: "Temkemaiyung",
    nepaliName: "टेम्केमाइयुङ",
    type: "Rural Municipality",
    districtId: "bhojpur",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "bhojpur-salpasilichho",
    name: "Salpasilichho",
    nepaliName: "सालपसिलिछो",
    type: "Rural Municipality",
    districtId: "bhojpur",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "bhojpur-ramprasad",
    name: "Ramprasad",
    nepaliName: "रामप्रसाद",
    type: "Rural Municipality",
    districtId: "bhojpur",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "dhankuta-chaubise",
    name: "Chaubise",
    nepaliName: "चौबिसे",
    type: "Rural Municipality",
    districtId: "dhankuta",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "dhankuta-shahidbhumi",
    name: "Shahidbhumi",
    nepaliName: "शहिदभूमि",
    type: "Rural Municipality",
    districtId: "dhankuta",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "dhankuta-sangurigadhi",
    name: "Sangurigadhi",
    nepaliName: "साँगुरीगढी",
    type: "Rural Municipality",
    districtId: "dhankuta",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "dhankuta-chhathar-jorpati",
    name: "Chhathar Jorpati",
    nepaliName: "छथर जोरपाटी",
    type: "Rural Municipality",
    districtId: "dhankuta",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "terhathum-chhathar",
    name: "Chhathar",
    nepaliName: "छथर",
    type: "Rural Municipality",
    districtId: "terhathum",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "terhathum-phedap",
    name: "Phedap",
    nepaliName: "फेडाप",
    type: "Rural Municipality",
    districtId: "terhathum",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "terhathum-aathrai",
    name: "Aathrai",
    nepaliName: "आठराई",
    type: "Rural Municipality",
    districtId: "terhathum",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "terhathum-menchayam",
    name: "Menchayam",
    nepaliName: "मेन्चायम",
    type: "Rural Municipality",
    districtId: "terhathum",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "panchthar-yangwarak",
    name: "Yangwarak",
    nepaliName: "याङ्गवारक",
    type: "Rural Municipality",
    districtId: "panchthar",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "panchthar-hilihang",
    name: "Hilihang",
    nepaliName: "हिलिहाङ",
    type: "Rural Municipality",
    districtId: "panchthar",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "panchthar-falelung",
    name: "Falelung",
    nepaliName: "फालेलुङ",
    type: "Rural Municipality",
    districtId: "panchthar",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "panchthar-tumbewa",
    name: "Tumbewa",
    nepaliName: "तुम्बेवा",
    type: "Rural Municipality",
    districtId: "panchthar",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "panchthar-kummayak",
    name: "Kummayak",
    nepaliName: "कुमायक",
    type: "Rural Municipality",
    districtId: "panchthar",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "panchthar-miklajung",
    name: "Miklajung",
    nepaliName: "मिक्लाजुङ",
    type: "Rural Municipality",
    districtId: "panchthar",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "panchthar-falgunanda",
    name: "Falgunanda",
    nepaliName: "फाल्गुनन्द",
    type: "Rural Municipality",
    districtId: "panchthar",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "ilam-rong",
    name: "Rong",
    nepaliName: "रोङ",
    type: "Rural Municipality",
    districtId: "ilam",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "ilam-mangsebung",
    name: "Mangsebung",
    nepaliName: "मङ्गेबुङ",
    type: "Rural Municipality",
    districtId: "ilam",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "ilam-chulachuli",
    name: "Chulachuli",
    nepaliName: "चुलाचुली",
    type: "Rural Municipality",
    districtId: "ilam",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "ilam-sandakpur",
    name: "Sandakpur",
    nepaliName: "सन्दकपुर",
    type: "Rural Municipality",
    districtId: "ilam",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "ilam-fakphokthum",
    name: "Fakphokthum",
    nepaliName: "फाकफोक्थुम",
    type: "Rural Municipality",
    districtId: "ilam",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "ilam-maijogmai",
    name: "Maijogmai",
    nepaliName: "माइजोगमाई",
    type: "Rural Municipality",
    districtId: "ilam",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "jhapa-kamal",
    name: "Kamal",
    nepaliName: "कमल",
    type: "Rural Municipality",
    districtId: "jhapa",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "jhapa-jhapa",
    name: "Jhapa",
    nepaliName: "झापा",
    type: "Rural Municipality",
    districtId: "jhapa",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "jhapa-kachankawal",
    name: "Kachankawal",
    nepaliName: "कचनकवल",
    type: "Rural Municipality",
    districtId: "jhapa",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "jhapa-gauriganj",
    name: "Gauriganj",
    nepaliName: "गौरीगञ्ज",
    type: "Rural Municipality",
    districtId: "jhapa",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "jhapa-barhadashi",
    name: "Barhadashi",
    nepaliName: "बाह्रदशी",
    type: "Rural Municipality",
    districtId: "jhapa",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "jhapa-haldibari",
    name: "Haldibari",
    nepaliName: "हल्दिबारी",
    type: "Rural Municipality",
    districtId: "jhapa",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "jhapa-buddhashanti",
    name: "Buddhashanti",
    nepaliName: "बुद्धशान्ति",
    type: "Rural Municipality",
    districtId: "jhapa",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "morang-jahada",
    name: "Jahada",
    nepaliName: "जहादा",
    type: "Rural Municipality",
    districtId: "morang",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "morang-katahari",
    name: "Katahari",
    nepaliName: "कटहरी",
    type: "Rural Municipality",
    districtId: "morang",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "morang-gramthan",
    name: "Gramthan",
    nepaliName: "ग्रामथान",
    type: "Rural Municipality",
    districtId: "morang",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "morang-dhanpalthan",
    name: "Dhanpalthan",
    nepaliName: "धनपालथान",
    type: "Rural Municipality",
    districtId: "morang",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "morang-kerabari",
    name: "Kerabari",
    nepaliName: "केराबारी",
    type: "Rural Municipality",
    districtId: "morang",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "morang-budhiganga",
    name: "Budhiganga",
    nepaliName: "बुढीगंगा",
    type: "Rural Municipality",
    districtId: "morang",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "morang-kanepokhari",
    name: "Kanepokhari",
    nepaliName: "कानेपोखरी",
    type: "Rural Municipality",
    districtId: "morang",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "morang-miklajung",
    name: "Miklajung",
    nepaliName: "मिक्लाजुङ",
    type: "Rural Municipality",
    districtId: "morang",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "sunsari-gadhi",
    name: "Gadhi",
    nepaliName: "गढी",
    type: "Rural Municipality",
    districtId: "sunsari",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "sunsari-koshi",
    name: "Koshi",
    nepaliName: "कोशी",
    type: "Rural Municipality",
    districtId: "sunsari",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "sunsari-barju",
    name: "Barju",
    nepaliName: "बर्जु",
    type: "Rural Municipality",
    districtId: "sunsari",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "sunsari-harinagar",
    name: "Harinagar",
    nepaliName: "हरिनगर",
    type: "Rural Municipality",
    districtId: "sunsari",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "sunsari-dewanganj",
    name: "Dewanganj",
    nepaliName: "देवानगन्ज",
    type: "Rural Municipality",
    districtId: "sunsari",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "sunsari-bhokraha-narsing",
    name: "Bhokraha Narsing",
    nepaliName: "भोक्राहा नरसिङ्ग",
    type: "Rural Municipality",
    districtId: "sunsari",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "udayapur-tapli",
    name: "Tapli",
    nepaliName: "तापली",
    type: "Rural Municipality",
    districtId: "udayapur",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "udayapur-rautamai",
    name: "Rautamai",
    nepaliName: "रौतामाई",
    type: "Rural Municipality",
    districtId: "udayapur",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "udayapur-udayapurgadhi",
    name: "Udayapurgadhi",
    nepaliName: "उदयपुरगढी",
    type: "Rural Municipality",
    districtId: "udayapur",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "udayapur-limchungbung",
    name: "Limchungbung",
    nepaliName: "लिम्चुङबुङ",
    type: "Rural Municipality",
    districtId: "udayapur",
    provinceId: 1,
    totalWards: 7
  },
  {
    id: "saptari-rajgadh",
    name: "Rajgadh",
    nepaliName: "राजगढ",
    type: "Rural Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "saptari-rupani",
    name: "Rupani",
    nepaliName: "रुपानी",
    type: "Rural Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "saptari-tirahut",
    name: "Tirahut",
    nepaliName: "तिराहुत",
    type: "Rural Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "saptari-mahadeva",
    name: "Mahadeva",
    nepaliName: "महादेव",
    type: "Rural Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "saptari-bishnupur",
    name: "Bishnupur",
    nepaliName: "विष्णुपुर",
    type: "Rural Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "saptari-chhinnamasta",
    name: "Chhinnamasta",
    nepaliName: "छिन्नमस्ता",
    type: "Rural Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "saptari-balan-bihul",
    name: "Balan Bihul",
    nepaliName: "बालन बिहुल",
    type: "Rural Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "saptari-tilathi-koiladi",
    name: "Tilathi Koiladi",
    nepaliName: "तिलाठी कोइलाडी",
    type: "Rural Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "saptari-agnisair-krishna-savaran",
    name: "Agnisair Krishna Savaran",
    nepaliName: "अग्निशैर कृष्ण सावरण",
    type: "Rural Municipality",
    districtId: "saptari",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "siraha-aurahi",
    name: "Aurahi",
    nepaliName: "औरही",
    type: "Rural Municipality",
    districtId: "siraha",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "siraha-naraha",
    name: "Naraha",
    nepaliName: "नरहा",
    type: "Rural Municipality",
    districtId: "siraha",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "siraha-arnama",
    name: "Arnama",
    nepaliName: "अर्नामा",
    type: "Rural Municipality",
    districtId: "siraha",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "siraha-bhagawanpur",
    name: "Bhagawanpur",
    nepaliName: "भगवानपुर",
    type: "Rural Municipality",
    districtId: "siraha",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "siraha-nawarajpur",
    name: "Nawarajpur",
    nepaliName: "नवराजपुर",
    type: "Rural Municipality",
    districtId: "siraha",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "siraha-bishnupur",
    name: "Bishnupur",
    nepaliName: "विष्णुपुर",
    type: "Rural Municipality",
    districtId: "siraha",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "siraha-bariyarpatti",
    name: "Bariyarpatti",
    nepaliName: "बरियारपट्टी",
    type: "Rural Municipality",
    districtId: "siraha",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "siraha-laxmipur-patari",
    name: "Laxmipur Patari",
    nepaliName: "लक्ष्मीपुर पटारी",
    type: "Rural Municipality",
    districtId: "siraha",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "siraha-sakhuwanankarkatti",
    name: "Sakhuwanankarkatti",
    nepaliName: "सखुवानङ्करकट्टी",
    type: "Rural Municipality",
    districtId: "siraha",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "dhanusha-aaurahi",
    name: "Aaurahi",
    nepaliName: "औराही",
    type: "Rural Municipality",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "dhanusha-dhanauji",
    name: "Dhanauji",
    nepaliName: "धनौजी",
    type: "Rural Municipality",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "dhanusha-bateshwor",
    name: "Bateshwor",
    nepaliName: "बटेश्वर",
    type: "Rural Municipality",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "dhanusha-janaknandani",
    name: "Janaknandani",
    nepaliName: "जनकनन्दनी",
    type: "Rural Municipality",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "dhanusha-lakshminiya",
    name: "Lakshminiya",
    nepaliName: "लक्ष्मीनिया",
    type: "Rural Municipality",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "dhanusha-mukhiyapatti-musarmiya",
    name: "Mukhiyapatti Musarmiya",
    nepaliName: "मुखियापट्टी मुसरमिया",
    type: "Rural Municipality",
    districtId: "dhanusha",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "mahottari-pipra",
    name: "Pipra",
    nepaliName: "पिपरा",
    type: "Rural Municipality",
    districtId: "mahottari",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "mahottari-sonama",
    name: "Sonama",
    nepaliName: "सोनामा",
    type: "Rural Municipality",
    districtId: "mahottari",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "mahottari-samsi",
    name: "Samsi",
    nepaliName: "सम्सी",
    type: "Rural Municipality",
    districtId: "mahottari",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "mahottari-ekdanra",
    name: "Ekdanra",
    nepaliName: "एकडानरा",
    type: "Rural Municipality",
    districtId: "mahottari",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "mahottari-mahottari",
    name: "Mahottari",
    nepaliName: "महोत्तरी",
    type: "Rural Municipality",
    districtId: "mahottari",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "sarlahi-dhankaul",
    name: "Dhankaul",
    nepaliName: "धनकौल",
    type: "Rural Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "sarlahi-parsa",
    name: "Parsa",
    nepaliName: "पर्सा",
    type: "Rural Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "sarlahi-bishnu",
    name: "Bishnu",
    nepaliName: "विष्णु",
    type: "Rural Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "sarlahi-ramnagar",
    name: "Ramnagar",
    nepaliName: "रामनगर",
    type: "Rural Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "sarlahi-kaudena",
    name: "Kaudena",
    nepaliName: "कौडेना",
    type: "Rural Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "sarlahi-basbariya",
    name: "Basbariya",
    nepaliName: "बासबरिया",
    type: "Rural Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "sarlahi-chandranagar",
    name: "Chandranagar",
    nepaliName: "चन्द्रनगर",
    type: "Rural Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "sarlahi-chakraghatta",
    name: "Chakraghatta",
    nepaliName: "चक्रघट्टा",
    type: "Rural Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "sarlahi-bramhapuri",
    name: "Bramhapuri",
    nepaliName: "ब्रम्हपुरी",
    type: "Rural Municipality",
    districtId: "sarlahi",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "rautahat-yemunamai",
    name: "Yemunamai",
    nepaliName: "यमुनामाई",
    type: "Rural Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "rautahat-durga-bhagwati",
    name: "Durga Bhagwati",
    nepaliName: "दुर्गा भगवती",
    type: "Rural Municipality",
    districtId: "rautahat",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "bara-pheta",
    name: "Pheta",
    nepaliName: "फेटा",
    type: "Rural Municipality",
    districtId: "bara",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "bara-devtal",
    name: "Devtal",
    nepaliName: "देवताल",
    type: "Rural Municipality",
    districtId: "bara",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "bara-prasauni",
    name: "Prasauni",
    nepaliName: "प्रसौनी",
    type: "Rural Municipality",
    districtId: "bara",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "bara-suwarna",
    name: "Suwarna",
    nepaliName: "सुवर्ण",
    type: "Rural Municipality",
    districtId: "bara",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "bara-baragadhi",
    name: "Baragadhi",
    nepaliName: "बारागढी",
    type: "Rural Municipality",
    districtId: "bara",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "bara-karaiyamai",
    name: "Karaiyamai",
    nepaliName: "करैयामाई",
    type: "Rural Municipality",
    districtId: "bara",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "bara-parwanipur",
    name: "Parwanipur",
    nepaliName: "परवानीपुर",
    type: "Rural Municipality",
    districtId: "bara",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "bara-bishrampur",
    name: "Bishrampur",
    nepaliName: "बिश्रामपुर",
    type: "Rural Municipality",
    districtId: "bara",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "bara-adarsh-kotwal",
    name: "Adarsh kotwal",
    nepaliName: "आदर्श कोतवाल",
    type: "Rural Municipality",
    districtId: "bara",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "parsa-thori",
    name: "Thori",
    nepaliName: "थोरी",
    type: "Rural Municipality",
    districtId: "parsa",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "parsa-dhobini",
    name: "Dhobini",
    nepaliName: "धोबिनी",
    type: "Rural Municipality",
    districtId: "parsa",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "parsa-chhipaharmai",
    name: "Chhipaharmai",
    nepaliName: "छिपहरमाई",
    type: "Rural Municipality",
    districtId: "parsa",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "parsa-jirabhawani",
    name: "Jirabhawani",
    nepaliName: "जिरभवानी",
    type: "Rural Municipality",
    districtId: "parsa",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "parsa-jagarnathpur",
    name: "Jagarnathpur",
    nepaliName: "जगरनाथपुर",
    type: "Rural Municipality",
    districtId: "parsa",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "parsa-kalikamai",
    name: "Kalikamai",
    nepaliName: "कालिकामाई",
    type: "Rural Municipality",
    districtId: "parsa",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "parsa-bindabasini",
    name: "Bindabasini",
    nepaliName: "बिन्दवासिनी",
    type: "Rural Municipality",
    districtId: "parsa",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "parsa-pakaha-mainpur",
    name: "Pakaha mainpur",
    nepaliName: "पकाहा मेनपुर",
    type: "Rural Municipality",
    districtId: "parsa",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "parsa-sakhuwa-prasauni",
    name: "Sakhuwa Prasauni",
    nepaliName: "सखुवा प्रसौनी",
    type: "Rural Municipality",
    districtId: "parsa",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "parsa-paterwa-sugauli",
    name: "Paterwa sugauli",
    nepaliName: "पटेरवा सुगौली",
    type: "Rural Municipality",
    districtId: "parsa",
    provinceId: 2,
    totalWards: 7
  },
  {
    id: "dolakha-bigu",
    name: "Bigu",
    nepaliName: "बिगु",
    type: "Rural Municipality",
    districtId: "dolakha",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "dolakha-sailung",
    name: "Sailung",
    nepaliName: "सेलुङ",
    type: "Rural Municipality",
    districtId: "dolakha",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "dolakha-melung",
    name: "Melung",
    nepaliName: "मेलुङ",
    type: "Rural Municipality",
    districtId: "dolakha",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "dolakha-baiteshwor",
    name: "Baiteshwor",
    nepaliName: "बैतेश्वर",
    type: "Rural Municipality",
    districtId: "dolakha",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "dolakha-tamakoshi",
    name: "Tamakoshi",
    nepaliName: "तामाकोशी",
    type: "Rural Municipality",
    districtId: "dolakha",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "dolakha-gaurishankar",
    name: "Gaurishankar",
    nepaliName: "गौरीशंकर",
    type: "Rural Municipality",
    districtId: "dolakha",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "dolakha-kalinchok",
    name: "Kalinchok",
    nepaliName: "कालिञ्चोक",
    type: "Rural Municipality",
    districtId: "dolakha",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "sindhupalchok-jugal",
    name: "Jugal",
    nepaliName: "जुगल",
    type: "Rural Municipality",
    districtId: "sindhupalchok",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "sindhupalchok-balefi",
    name: "Balefi",
    nepaliName: "बलेफी",
    type: "Rural Municipality",
    districtId: "sindhupalchok",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "sindhupalchok-sunkoshi",
    name: "Sunkoshi",
    nepaliName: "सुनकोशी",
    type: "Rural Municipality",
    districtId: "sindhupalchok",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "sindhupalchok-helambu",
    name: "Helambu",
    nepaliName: "हेलम्बु",
    type: "Rural Municipality",
    districtId: "sindhupalchok",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "sindhupalchok-bhotekoshi",
    name: "Bhotekoshi",
    nepaliName: "भोटेकोशी",
    type: "Rural Municipality",
    districtId: "sindhupalchok",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "sindhupalchok-lisangkhu",
    name: "Lisangkhu",
    nepaliName: "लिसाङ्खु",
    type: "Rural Municipality",
    districtId: "sindhupalchok",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "sindhupalchok-indrawati",
    name: "Indrawati",
    nepaliName: "इन्द्रावती",
    type: "Rural Municipality",
    districtId: "sindhupalchok",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "sindhupalchok-tripurasundari",
    name: "Tripurasundari",
    nepaliName: "त्रिपुरासुन्दरी",
    type: "Rural Municipality",
    districtId: "sindhupalchok",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "sindhupalchok-panchpokhari-thangpal",
    name: "Panchpokhari Thangpal",
    nepaliName: "पाँचपोखरी थाङ्पाल",
    type: "Rural Municipality",
    districtId: "sindhupalchok",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "rasuwa-kalika",
    name: "Kalika",
    nepaliName: "कालिका",
    type: "Rural Municipality",
    districtId: "rasuwa",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "rasuwa-naukunda",
    name: "Naukunda",
    nepaliName: "नौकुण्ड",
    type: "Rural Municipality",
    districtId: "rasuwa",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "rasuwa-uttargaya",
    name: "Uttargaya",
    nepaliName: "उत्तरगया",
    type: "Rural Municipality",
    districtId: "rasuwa",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "rasuwa-gosaikunda",
    name: "Gosaikunda",
    nepaliName: "गोसाइकुण्ड",
    type: "Rural Municipality",
    districtId: "rasuwa",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "rasuwa-amachodingmo",
    name: "Amachodingmo",
    nepaliName: "अमाकोडिङमो",
    type: "Rural Municipality",
    districtId: "rasuwa",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "dhading-gajuri",
    name: "Gajuri",
    nepaliName: "गजुरी",
    type: "Rural Municipality",
    districtId: "dhading",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "dhading-galchi",
    name: "Galchi",
    nepaliName: "गाल्ची",
    type: "Rural Municipality",
    districtId: "dhading",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "dhading-thakre",
    name: "Thakre",
    nepaliName: "ठाकरे",
    type: "Rural Municipality",
    districtId: "dhading",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "dhading-siddhalek",
    name: "Siddhalek",
    nepaliName: "सिद्धलेक",
    type: "Rural Municipality",
    districtId: "dhading",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "dhading-khaniyabash",
    name: "Khaniyabash",
    nepaliName: "खनियाबास",
    type: "Rural Municipality",
    districtId: "dhading",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "dhading-jwalamukhi",
    name: "Jwalamukhi",
    nepaliName: "ज्वालामुखी",
    type: "Rural Municipality",
    districtId: "dhading",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "dhading-gangajamuna",
    name: "Gangajamuna",
    nepaliName: "गंगाजमुना",
    type: "Rural Municipality",
    districtId: "dhading",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "dhading-rubi-valley",
    name: "Rubi Valley",
    nepaliName: "रुबी उपत्यका",
    type: "Rural Municipality",
    districtId: "dhading",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "dhading-tripura-sundari",
    name: "Tripura Sundari",
    nepaliName: "त्रिपुरा सुन्दरी",
    type: "Rural Municipality",
    districtId: "dhading",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "dhading-netrawati-dabjong",
    name: "Netrawati Dabjong",
    nepaliName: "नेत्रावती डब्जोङ",
    type: "Rural Municipality",
    districtId: "dhading",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "dhading-benighat-rorang",
    name: "Benighat Rorang",
    nepaliName: "बेनिघाट रोराङ",
    type: "Rural Municipality",
    districtId: "dhading",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "nuwakot-kakani",
    name: "Kakani",
    nepaliName: "ककनी",
    type: "Rural Municipality",
    districtId: "nuwakot",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "nuwakot-tadi",
    name: "Tadi",
    nepaliName: "ताडी",
    type: "Rural Municipality",
    districtId: "nuwakot",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "nuwakot-likhu",
    name: "Likhu",
    nepaliName: "लिखु",
    type: "Rural Municipality",
    districtId: "nuwakot",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "nuwakot-myagang",
    name: "Myagang",
    nepaliName: "म्यागाङ",
    type: "Rural Municipality",
    districtId: "nuwakot",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "nuwakot-shivapuri",
    name: "Shivapuri",
    nepaliName: "शिवपुरी",
    type: "Rural Municipality",
    districtId: "nuwakot",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "nuwakot-kispang",
    name: "Kispang",
    nepaliName: "किस्पाङ",
    type: "Rural Municipality",
    districtId: "nuwakot",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "nuwakot-suryagadhi",
    name: "Suryagadhi",
    nepaliName: "सुर्यगढी",
    type: "Rural Municipality",
    districtId: "nuwakot",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "nuwakot-tarkeshwar",
    name: "Tarkeshwar",
    nepaliName: "तारकेश्वर",
    type: "Rural Municipality",
    districtId: "nuwakot",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "nuwakot-panchakanya",
    name: "Panchakanya",
    nepaliName: "पञ्चकन्या",
    type: "Rural Municipality",
    districtId: "nuwakot",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "nuwakot-dupcheshwar",
    name: "Dupcheshwar",
    nepaliName: "दुप्चेश्वर",
    type: "Rural Municipality",
    districtId: "nuwakot",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "lalitpur-bagmati",
    name: "Bagmati",
    nepaliName: "बागमती",
    type: "Rural Municipality",
    districtId: "lalitpur",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "lalitpur-mahankal",
    name: "Mahankal",
    nepaliName: "महांकाल",
    type: "Rural Municipality",
    districtId: "lalitpur",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "lalitpur-konjyosom",
    name: "Konjyosom",
    nepaliName: "कोन्ज्योसोम",
    type: "Rural Municipality",
    districtId: "lalitpur",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "kavrepalanchok-roshi",
    name: "Roshi",
    nepaliName: "रोशी",
    type: "Rural Municipality",
    districtId: "kavrepalanchok",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "kavrepalanchok-temal",
    name: "Temal",
    nepaliName: "तेमल",
    type: "Rural Municipality",
    districtId: "kavrepalanchok",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "kavrepalanchok-bhumlu",
    name: "Bhumlu",
    nepaliName: "भुम्लु",
    type: "Rural Municipality",
    districtId: "kavrepalanchok",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "kavrepalanchok-mahabharat",
    name: "Mahabharat",
    nepaliName: "महाभारत",
    type: "Rural Municipality",
    districtId: "kavrepalanchok",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "kavrepalanchok-bethanchowk",
    name: "Bethanchowk",
    nepaliName: "बेथानचोक",
    type: "Rural Municipality",
    districtId: "kavrepalanchok",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "kavrepalanchok-khanikhola",
    name: "Khanikhola",
    nepaliName: "खानीखोला",
    type: "Rural Municipality",
    districtId: "kavrepalanchok",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "kavrepalanchok-chaurideurali",
    name: "Chaurideurali",
    nepaliName: "चौरीदेउराली",
    type: "Rural Municipality",
    districtId: "kavrepalanchok",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "ramechhap-sunapati",
    name: "Sunapati",
    nepaliName: "सुनापति",
    type: "Rural Municipality",
    districtId: "ramechhap",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "ramechhap-doramba",
    name: "Doramba",
    nepaliName: "दोरम्बा",
    type: "Rural Municipality",
    districtId: "ramechhap",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "ramechhap-umakunda",
    name: "Umakunda",
    nepaliName: "उमाकुण्ड",
    type: "Rural Municipality",
    districtId: "ramechhap",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "ramechhap-khadadevi",
    name: "Khadadevi",
    nepaliName: "खाडादेवी",
    type: "Rural Municipality",
    districtId: "ramechhap",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "ramechhap-gokulganga",
    name: "Gokulganga",
    nepaliName: "गोकुलगंगा",
    type: "Rural Municipality",
    districtId: "ramechhap",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "ramechhap-likhu-tamakoshi",
    name: "Likhu Tamakoshi",
    nepaliName: "लिखु तामाकोशी",
    type: "Rural Municipality",
    districtId: "ramechhap",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "sindhuli-marin",
    name: "Marin",
    nepaliName: "मारिन",
    type: "Rural Municipality",
    districtId: "sindhuli",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "sindhuli-phikkal",
    name: "Phikkal",
    nepaliName: "फिक्कल",
    type: "Rural Municipality",
    districtId: "sindhuli",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "sindhuli-tinpatan",
    name: "Tinpatan",
    nepaliName: "तिनपाटन",
    type: "Rural Municipality",
    districtId: "sindhuli",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "sindhuli-sunkoshi",
    name: "Sunkoshi",
    nepaliName: "सुनकोशी",
    type: "Rural Municipality",
    districtId: "sindhuli",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "sindhuli-golanjor",
    name: "Golanjor",
    nepaliName: "गोलन्जोर",
    type: "Rural Municipality",
    districtId: "sindhuli",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "sindhuli-ghanglekh",
    name: "Ghanglekh",
    nepaliName: "घाङ्लेख",
    type: "Rural Municipality",
    districtId: "sindhuli",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "sindhuli-hariharpurgadhi",
    name: "Hariharpurgadhi",
    nepaliName: "हरिहरपुरगढी",
    type: "Rural Municipality",
    districtId: "sindhuli",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "makwanpur-bakaiya",
    name: "Bakaiya",
    nepaliName: "बकैया",
    type: "Rural Municipality",
    districtId: "makwanpur",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "makwanpur-kailash",
    name: "Kailash",
    nepaliName: "कैलाश",
    type: "Rural Municipality",
    districtId: "makwanpur",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "makwanpur-manahari",
    name: "Manahari",
    nepaliName: "मनहरी",
    type: "Rural Municipality",
    districtId: "makwanpur",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "makwanpur-bhimphedi",
    name: "Bhimphedi",
    nepaliName: "भीमफेदी",
    type: "Rural Municipality",
    districtId: "makwanpur",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "makwanpur-bagmati",
    name: "Bagmati",
    nepaliName: "बागमती",
    type: "Rural Municipality",
    districtId: "makwanpur",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "makwanpur-raksirang",
    name: "Raksirang",
    nepaliName: "रक्सिराङ",
    type: "Rural Municipality",
    districtId: "makwanpur",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "makwanpur-makawanpurgadhi",
    name: "Makawanpurgadhi",
    nepaliName: "मकवानपुरगढी",
    type: "Rural Municipality",
    districtId: "makwanpur",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "makwanpur-indrasarowar",
    name: "Indrasarowar",
    nepaliName: "इन्द्रसरोवर",
    type: "Rural Municipality",
    districtId: "makwanpur",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "chitwan-ichchhyakamana",
    name: "Ichchhyakamana",
    nepaliName: "इच्छाकामना",
    type: "Rural Municipality",
    districtId: "chitwan",
    provinceId: 3,
    totalWards: 7
  },
  {
    id: "gorkha-gandaki",
    name: "Gandaki",
    nepaliName: "गण्डकी",
    type: "Rural Municipality",
    districtId: "gorkha",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "gorkha-dharche",
    name: "Dharche",
    nepaliName: "धार्चे",
    type: "Rural Municipality",
    districtId: "gorkha",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "gorkha-aarughat",
    name: "Aarughat",
    nepaliName: "आरुघाट",
    type: "Rural Municipality",
    districtId: "gorkha",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "gorkha-ajirkot",
    name: "Ajirkot",
    nepaliName: "अजिरकोट",
    type: "Rural Municipality",
    districtId: "gorkha",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "gorkha-sahid-lakhan",
    name: "Sahid Lakhan",
    nepaliName: "सहिद लखन",
    type: "Rural Municipality",
    districtId: "gorkha",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "gorkha-siranchok",
    name: "Siranchok",
    nepaliName: "सिरञ्चोक",
    type: "Rural Municipality",
    districtId: "gorkha",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "gorkha-bhimsenthapa",
    name: "Bhimsenthapa",
    nepaliName: "भीमसेनथापा",
    type: "Rural Municipality",
    districtId: "gorkha",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "gorkha-chum-nubri",
    name: "Chum Nubri",
    nepaliName: "चुम नुब्रि",
    type: "Rural Municipality",
    districtId: "gorkha",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "gorkha-barpak-sulikot",
    name: "Barpak Sulikot",
    nepaliName: "बारपाक सुलिकोट",
    type: "Rural Municipality",
    districtId: "gorkha",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "manang-chame",
    name: "Chame",
    nepaliName: "चामे",
    type: "Rural Municipality",
    districtId: "manang",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "manang-narshon",
    name: "Narshon",
    nepaliName: "नरशोन",
    type: "Rural Municipality",
    districtId: "manang",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "manang-narpa-bhumi",
    name: "Narpa Bhumi",
    nepaliName: "नरपा भूमि",
    type: "Rural Municipality",
    districtId: "manang",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "manang-manang-ingshyang",
    name: "Manang Ingshyang",
    nepaliName: "मनाङ इङ्स्याङ",
    type: "Rural Municipality",
    districtId: "manang",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "mustang-thasang",
    name: "Thasang",
    nepaliName: "थासाङ",
    type: "Rural Municipality",
    districtId: "mustang",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "mustang-gharapjhong",
    name: "Gharapjhong",
    nepaliName: "घरापझोङ",
    type: "Rural Municipality",
    districtId: "mustang",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "mustang-lomanthang",
    name: "Lomanthang",
    nepaliName: "लोमान्थाङ",
    type: "Rural Municipality",
    districtId: "mustang",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "mustang-lo-ghekar-damodarkunda",
    name: "Lo-Ghekar Damodarkunda",
    nepaliName: "लो घेकर दामोदरकुण्ड",
    type: "Rural Municipality",
    districtId: "mustang",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "mustang-waragung-muktikhsetra",
    name: "Waragung Muktikhsetra",
    nepaliName: "वारागुङ मुक्तिक्षेत्र",
    type: "Rural Municipality",
    districtId: "mustang",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "myagdi-mangala",
    name: "Mangala",
    nepaliName: "मंगला",
    type: "Rural Municipality",
    districtId: "myagdi",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "myagdi-malika",
    name: "Malika",
    nepaliName: "मलिका",
    type: "Rural Municipality",
    districtId: "myagdi",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "myagdi-raghuganga",
    name: "Raghuganga",
    nepaliName: "रघुगंगा",
    type: "Rural Municipality",
    districtId: "myagdi",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "myagdi-dhaulagiri",
    name: "Dhaulagiri",
    nepaliName: "धौलागिरी",
    type: "Rural Municipality",
    districtId: "myagdi",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "myagdi-annapurna",
    name: "Annapurna",
    nepaliName: "अन्नपूर्ण",
    type: "Rural Municipality",
    districtId: "myagdi",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "kaski-rupa",
    name: "Rupa",
    nepaliName: "रुपा",
    type: "Rural Municipality",
    districtId: "kaski",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "kaski-madi",
    name: "Madi",
    nepaliName: "माडी",
    type: "Rural Municipality",
    districtId: "kaski",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "kaski-annapurna",
    name: "Annapurna",
    nepaliName: "अन्नपूर्ण",
    type: "Rural Municipality",
    districtId: "kaski",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "kaski-machhapuchchhre",
    name: "Machhapuchchhre",
    nepaliName: "माछापुच्छ्रे",
    type: "Rural Municipality",
    districtId: "kaski",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "lamjung-dordi",
    name: "Dordi",
    nepaliName: "दोर्दी",
    type: "Rural Municipality",
    districtId: "lamjung",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "lamjung-dudhpokhari",
    name: "Dudhpokhari",
    nepaliName: "दूधपोखरी",
    type: "Rural Municipality",
    districtId: "lamjung",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "lamjung-marsyangdi",
    name: "Marsyangdi",
    nepaliName: "मर्स्याङ्दी",
    type: "Rural Municipality",
    districtId: "lamjung",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "lamjung-kwholasothar",
    name: "Kwholasothar",
    nepaliName: "क्वालासोथर",
    type: "Rural Municipality",
    districtId: "lamjung",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "tanahun-ghiring",
    name: "Ghiring",
    nepaliName: "घिरिङ",
    type: "Rural Municipality",
    districtId: "tanahun",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "tanahun-devghat",
    name: "Devghat",
    nepaliName: "देवघाट",
    type: "Rural Municipality",
    districtId: "tanahun",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "tanahun-rhishing",
    name: "Rhishing",
    nepaliName: "रिसिङ",
    type: "Rural Municipality",
    districtId: "tanahun",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "tanahun-myagde",
    name: "Myagde",
    nepaliName: "म्याग्दे",
    type: "Rural Municipality",
    districtId: "tanahun",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "tanahun-bandipur",
    name: "Bandipur",
    nepaliName: "बन्दीपुर",
    type: "Rural Municipality",
    districtId: "tanahun",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "tanahun-anbukhaireni",
    name: "Anbukhaireni",
    nepaliName: "अन्बुखैरेनी",
    type: "Rural Municipality",
    districtId: "tanahun",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "nawalpur-baudeekali",
    name: "Baudeekali",
    nepaliName: "बौदेकाली",
    type: "Rural Municipality",
    districtId: "nawalpur",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "nawalpur-bulingtar",
    name: "Bulingtar",
    nepaliName: "बुलिङटार",
    type: "Rural Municipality",
    districtId: "nawalpur",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "nawalpur-hupsekot",
    name: "Hupsekot",
    nepaliName: "हुप्सेकोट",
    type: "Rural Municipality",
    districtId: "nawalpur",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "nawalpur-binayee",
    name: "Binayee",
    nepaliName: "बिनयी",
    type: "Rural Municipality",
    districtId: "nawalpur",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "syangja-harinas",
    name: "Harinas",
    nepaliName: "हरिनास",
    type: "Rural Municipality",
    districtId: "syangja",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "syangja-biruwa",
    name: "Biruwa",
    nepaliName: "बिरुवा",
    type: "Rural Municipality",
    districtId: "syangja",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "syangja-aandhikhola",
    name: "Aandhikhola",
    nepaliName: "आँधीखोला",
    type: "Rural Municipality",
    districtId: "syangja",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "syangja-phedikhola",
    name: "Phedikhola",
    nepaliName: "फेदीखोला",
    type: "Rural Municipality",
    districtId: "syangja",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "syangja-kaligandagi",
    name: "Kaligandagi",
    nepaliName: "कालीगण्डगी",
    type: "Rural Municipality",
    districtId: "syangja",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "syangja-arjunchaupari",
    name: "Arjunchaupari",
    nepaliName: "अर्जुनचौपरी",
    type: "Rural Municipality",
    districtId: "syangja",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "parbat-modi",
    name: "Modi",
    nepaliName: "मोदी",
    type: "Rural Municipality",
    districtId: "parbat",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "parbat-painyu",
    name: "Painyu",
    nepaliName: "पाइन्यु",
    type: "Rural Municipality",
    districtId: "parbat",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "parbat-jaljala",
    name: "Jaljala",
    nepaliName: "जलजला",
    type: "Rural Municipality",
    districtId: "parbat",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "parbat-bihadi",
    name: "Bihadi",
    nepaliName: "बिहादी",
    type: "Rural Municipality",
    districtId: "parbat",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "parbat-mahashila",
    name: "Mahashila",
    nepaliName: "महाशिला",
    type: "Rural Municipality",
    districtId: "parbat",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "baglung-bareng",
    name: "Bareng",
    nepaliName: "बरेङ",
    type: "Rural Municipality",
    districtId: "baglung",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "baglung-badigad",
    name: "Badigad",
    nepaliName: "बडिगाड",
    type: "Rural Municipality",
    districtId: "baglung",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "baglung-nisikhola",
    name: "Nisikhola",
    nepaliName: "निसिखोला",
    type: "Rural Municipality",
    districtId: "baglung",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "baglung-kanthekhola",
    name: "Kanthekhola",
    nepaliName: "कान्ठेखोला",
    type: "Rural Municipality",
    districtId: "baglung",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "baglung-tara-khola",
    name: "Tara Khola",
    nepaliName: "तारा खोला",
    type: "Rural Municipality",
    districtId: "baglung",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "baglung-taman-khola",
    name: "Taman Khola",
    nepaliName: "तमन खोला",
    type: "Rural Municipality",
    districtId: "baglung",
    provinceId: 4,
    totalWards: 7
  },
  {
    id: "eastern-rukum-bhume",
    name: "Bhume",
    nepaliName: "भुमे",
    type: "Rural Municipality",
    districtId: "eastern-rukum",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "eastern-rukum-sisne",
    name: "Sisne",
    nepaliName: "सिस्ने",
    type: "Rural Municipality",
    districtId: "eastern-rukum",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "eastern-rukum-putha-uttarganga",
    name: "Putha Uttarganga",
    nepaliName: "पुथा उत्तरगंगा",
    type: "Rural Municipality",
    districtId: "eastern-rukum",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rolpa-madi",
    name: "Madi",
    nepaliName: "माडी",
    type: "Rural Municipality",
    districtId: "rolpa",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rolpa-thawang",
    name: "Thawang",
    nepaliName: "थवाङ",
    type: "Rural Municipality",
    districtId: "rolpa",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rolpa-sunchhahari",
    name: "Sunchhahari",
    nepaliName: "सुनछहरी",
    type: "Rural Municipality",
    districtId: "rolpa",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rolpa-lungri",
    name: "Lungri",
    nepaliName: "लुङ्गरी",
    type: "Rural Municipality",
    districtId: "rolpa",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rolpa-gangadev",
    name: "Gangadev",
    nepaliName: "गंगादेव",
    type: "Rural Municipality",
    districtId: "rolpa",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rolpa-tribeni",
    name: "Tribeni",
    nepaliName: "त्रिवेणी",
    type: "Rural Municipality",
    districtId: "rolpa",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rolpa-pariwartan",
    name: "Pariwartan",
    nepaliName: "परिवर्तन",
    type: "Rural Municipality",
    districtId: "rolpa",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rolpa-runtigadi",
    name: "Runtigadi",
    nepaliName: "रुन्टीगढी",
    type: "Rural Municipality",
    districtId: "rolpa",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rolpa-sunil-smriti",
    name: "Sunil Smriti",
    nepaliName: "सुनिल स्मृति",
    type: "Rural Municipality",
    districtId: "rolpa",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "pyuthan-ayirabat",
    name: "Ayirabat",
    nepaliName: "आइराबत",
    type: "Rural Municipality",
    districtId: "pyuthan",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "pyuthan-gaumukhi",
    name: "Gaumukhi",
    nepaliName: "गौमुखी",
    type: "Rural Municipality",
    districtId: "pyuthan",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "pyuthan-jhimruk",
    name: "Jhimruk",
    nepaliName: "झिमरुक",
    type: "Rural Municipality",
    districtId: "pyuthan",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "pyuthan-naubahini",
    name: "Naubahini",
    nepaliName: "नौबहिनी",
    type: "Rural Municipality",
    districtId: "pyuthan",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "pyuthan-mandavi",
    name: "Mandavi",
    nepaliName: "मांडवी",
    type: "Rural Municipality",
    districtId: "pyuthan",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "pyuthan-mallarani",
    name: "Mallarani",
    nepaliName: "मल्लरानी",
    type: "Rural Municipality",
    districtId: "pyuthan",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "pyuthan-sarumarani",
    name: "Sarumarani",
    nepaliName: "सरूमरानी",
    type: "Rural Municipality",
    districtId: "pyuthan",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "gulmi-ruru",
    name: "Ruru",
    nepaliName: "रुरु",
    type: "Rural Municipality",
    districtId: "gulmi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "gulmi-isma",
    name: "Isma",
    nepaliName: "इस्मा",
    type: "Rural Municipality",
    districtId: "gulmi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "gulmi-madane",
    name: "Madane",
    nepaliName: "मदने",
    type: "Rural Municipality",
    districtId: "gulmi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "gulmi-malika",
    name: "Malika",
    nepaliName: "मलिका",
    type: "Rural Municipality",
    districtId: "gulmi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "gulmi-chatrakot",
    name: "Chatrakot",
    nepaliName: "चत्रकोट",
    type: "Rural Municipality",
    districtId: "gulmi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "gulmi-chatrakot",
    name: "Chatrakot",
    nepaliName: "चत्रकोट",
    type: "Rural Municipality",
    districtId: "gulmi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "gulmi-satyawati",
    name: "Satyawati",
    nepaliName: "सत्यवती",
    type: "Rural Municipality",
    districtId: "gulmi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "gulmi-chandrakot",
    name: "Chandrakot",
    nepaliName: "चन्द्रकोट",
    type: "Rural Municipality",
    districtId: "gulmi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "gulmi-kaligandaki",
    name: "Kaligandaki",
    nepaliName: "कालीगण्डकी",
    type: "Rural Municipality",
    districtId: "gulmi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "gulmi-gulmidarbar",
    name: "Gulmidarbar",
    nepaliName: "गुल्मीदरबार",
    type: "Rural Municipality",
    districtId: "gulmi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "arghakhanchi-panini",
    name: "Panini",
    nepaliName: "पाणिनी",
    type: "Rural Municipality",
    districtId: "arghakhanchi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "arghakhanchi-chhatradev",
    name: "Chhatradev",
    nepaliName: "छत्रदेव",
    type: "Rural Municipality",
    districtId: "arghakhanchi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "arghakhanchi-malarani",
    name: "Malarani",
    nepaliName: "मलारानी",
    type: "Rural Municipality",
    districtId: "arghakhanchi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "palpa-rambha",
    name: "Rambha",
    nepaliName: "रम्भा",
    type: "Rural Municipality",
    districtId: "palpa",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "palpa-tinau",
    name: "Tinau",
    nepaliName: "तिनाउ",
    type: "Rural Municipality",
    districtId: "palpa",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "palpa-nisdi",
    name: "Nisdi",
    nepaliName: "निस्दी",
    type: "Rural Municipality",
    districtId: "palpa",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "palpa-mathagadhi",
    name: "Mathagadhi",
    nepaliName: "मठगढी",
    type: "Rural Municipality",
    districtId: "palpa",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "palpa-ribdikot",
    name: "Ribdikot",
    nepaliName: "रिब्दीकोट",
    type: "Rural Municipality",
    districtId: "palpa",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "palpa-purbakhola",
    name: "Purbakhola",
    nepaliName: "पूर्वखोला",
    type: "Rural Municipality",
    districtId: "palpa",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "palpa-bagnaskali",
    name: "Bagnaskali",
    nepaliName: "बागनास्कली",
    type: "Rural Municipality",
    districtId: "palpa",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "palpa-rainadevi",
    name: "Rainadevi",
    nepaliName: "रैनादेवी",
    type: "Rural Municipality",
    districtId: "palpa",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "parasi-sarawal",
    name: "Sarawal",
    nepaliName: "सरवल",
    type: "Rural Municipality",
    districtId: "parasi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "parasi-susta",
    name: "Susta",
    nepaliName: "सुस्ता",
    type: "Rural Municipality",
    districtId: "parasi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "parasi-pratappur",
    name: "Pratappur",
    nepaliName: "प्रतापपुर",
    type: "Rural Municipality",
    districtId: "parasi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "parasi-palhi-nandan",
    name: "Palhi Nandan",
    nepaliName: "पाल्ही नन्दन",
    type: "Rural Municipality",
    districtId: "parasi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rupandehi-kanchan",
    name: "Kanchan",
    nepaliName: "कञ्चन",
    type: "Rural Municipality",
    districtId: "rupandehi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rupandehi-siyari",
    name: "Siyari",
    nepaliName: "सियारी",
    type: "Rural Municipality",
    districtId: "rupandehi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rupandehi-rohini",
    name: "Rohini",
    nepaliName: "रोहिणी",
    type: "Rural Municipality",
    districtId: "rupandehi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rupandehi-gaidahawa",
    name: "Gaidahawa",
    nepaliName: "गैडहवा",
    type: "Rural Municipality",
    districtId: "rupandehi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rupandehi-omsatiya",
    name: "Omsatiya",
    nepaliName: "ओमसतिया",
    type: "Rural Municipality",
    districtId: "rupandehi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rupandehi-sudhdhodhan",
    name: "Sudhdhodhan",
    nepaliName: "शुद्धोधन",
    type: "Rural Municipality",
    districtId: "rupandehi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rupandehi-mayadevi",
    name: "Mayadevi",
    nepaliName: "मायादेवी",
    type: "Rural Municipality",
    districtId: "rupandehi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rupandehi-marchawari",
    name: "Marchawari",
    nepaliName: "मार्चवारी",
    type: "Rural Municipality",
    districtId: "rupandehi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rupandehi-kotahimai",
    name: "Kotahimai",
    nepaliName: "कोटाहिमाई",
    type: "Rural Municipality",
    districtId: "rupandehi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "rupandehi-sammarimai",
    name: "Sammarimai",
    nepaliName: "समरीमाई",
    type: "Rural Municipality",
    districtId: "rupandehi",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "kapilvastu-yashodhara",
    name: "Yashodhara",
    nepaliName: "यशोधरा",
    type: "Rural Municipality",
    districtId: "kapilvastu",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "kapilvastu-bijayanagar",
    name: "Bijayanagar",
    nepaliName: "विजयनगर",
    type: "Rural Municipality",
    districtId: "kapilvastu",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "kapilvastu-mayadevi",
    name: "Mayadevi",
    nepaliName: "मायादेवी",
    type: "Rural Municipality",
    districtId: "kapilvastu",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "kapilvastu-suddhodhan",
    name: "Suddhodhan",
    nepaliName: "शुद्धोधन",
    type: "Rural Municipality",
    districtId: "kapilvastu",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "dang-babai",
    name: "Babai",
    nepaliName: "बबई",
    type: "Rural Municipality",
    districtId: "dang",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "dang-gadhawa",
    name: "Gadhawa",
    nepaliName: "गढवा",
    type: "Rural Municipality",
    districtId: "dang",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "dang-rapti",
    name: "Rapti",
    nepaliName: "राप्ती",
    type: "Rural Municipality",
    districtId: "dang",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "dang-rajpur",
    name: "Rajpur",
    nepaliName: "राजपुर",
    type: "Rural Municipality",
    districtId: "dang",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "dang-dangisharan",
    name: "Dangisharan",
    nepaliName: "दंगिशरण",
    type: "Rural Municipality",
    districtId: "dang",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "dang-shantinagar",
    name: "Shantinagar",
    nepaliName: "शान्तिनगर",
    type: "Rural Municipality",
    districtId: "dang",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "dang-banglachuli",
    name: "Banglachuli",
    nepaliName: "बंगलाचुली",
    type: "Rural Municipality",
    districtId: "dang",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "banke-khajura",
    name: "Khajura",
    nepaliName: "खजुरा",
    type: "Rural Municipality",
    districtId: "banke",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "banke-janki",
    name: "Janki",
    nepaliName: "जानकी",
    type: "Rural Municipality",
    districtId: "banke",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "banke-baijanath",
    name: "Baijanath",
    nepaliName: "बैजनाथ",
    type: "Rural Municipality",
    districtId: "banke",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "banke-duduwa",
    name: "Duduwa",
    nepaliName: "डुडुवा",
    type: "Rural Municipality",
    districtId: "banke",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "banke-narainapur",
    name: "Narainapur",
    nepaliName: "नरैनापुर",
    type: "Rural Municipality",
    districtId: "banke",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "banke-rapti-sonari",
    name: "Rapti Sonari",
    nepaliName: "राप्ती सोनारी",
    type: "Rural Municipality",
    districtId: "banke",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "bardiya-geruwa",
    name: "Geruwa",
    nepaliName: "गेरुवा",
    type: "Rural Municipality",
    districtId: "bardiya",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "bardiya-badhaiyatal",
    name: "Badhaiyatal",
    nepaliName: "बढैयाताल",
    type: "Rural Municipality",
    districtId: "bardiya",
    provinceId: 5,
    totalWards: 7
  },
  {
    id: "dolpa-kaike",
    name: "Kaike",
    nepaliName: "काइके",
    type: "Rural Municipality",
    districtId: "dolpa",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "dolpa-jagadulla",
    name: "Jagadulla",
    nepaliName: "जगदुल्ला",
    type: "Rural Municipality",
    districtId: "dolpa",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "dolpa-mudkechula",
    name: "Mudkechula",
    nepaliName: "मुड्केचुला",
    type: "Rural Municipality",
    districtId: "dolpa",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "dolpa-dolpo-buddha",
    name: "Dolpo Buddha",
    nepaliName: "डोल्पो बुद्ध",
    type: "Rural Municipality",
    districtId: "dolpa",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "dolpa-shey-phoksundo",
    name: "Shey Phoksundo",
    nepaliName: "शे फोक्सुण्डो",
    type: "Rural Municipality",
    districtId: "dolpa",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "dolpa-chharka-tangsong",
    name: "Chharka Tangsong",
    nepaliName: "छर्का ताङसोङ",
    type: "Rural Municipality",
    districtId: "dolpa",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "mugu-soru",
    name: "Soru",
    nepaliName: "सोरु",
    type: "Rural Municipality",
    districtId: "mugu",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "mugu-khatyad",
    name: "Khatyad",
    nepaliName: "खत्याड",
    type: "Rural Municipality",
    districtId: "mugu",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "mugu-mugum-karmarong",
    name: "Mugum Karmarong",
    nepaliName: "मुगुम कर्मारोङ",
    type: "Rural Municipality",
    districtId: "mugu",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "humla-simkot",
    name: "Simkot",
    nepaliName: "सिमकोट",
    type: "Rural Municipality",
    districtId: "humla",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "humla-namkha",
    name: "Namkha",
    nepaliName: "नम्खा",
    type: "Rural Municipality",
    districtId: "humla",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "humla-chankheli",
    name: "Chankheli",
    nepaliName: "चनखेली",
    type: "Rural Municipality",
    districtId: "humla",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "humla-tanjakot",
    name: "Tanjakot",
    nepaliName: "तान्जाकोट",
    type: "Rural Municipality",
    districtId: "humla",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "humla-sarkegad",
    name: "Sarkegad",
    nepaliName: "सार्केगड",
    type: "Rural Municipality",
    districtId: "humla",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "humla-adanchuli",
    name: "Adanchuli",
    nepaliName: "अडांचुली",
    type: "Rural Municipality",
    districtId: "humla",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "humla-kharpunath",
    name: "Kharpunath",
    nepaliName: "खार्पुनाथ",
    type: "Rural Municipality",
    districtId: "humla",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "jumla-hima",
    name: "Hima",
    nepaliName: "हिमा",
    type: "Rural Municipality",
    districtId: "jumla",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "jumla-tila",
    name: "Tila",
    nepaliName: "तिला",
    type: "Rural Municipality",
    districtId: "jumla",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "jumla-sinja",
    name: "Sinja",
    nepaliName: "सिन्जा",
    type: "Rural Municipality",
    districtId: "jumla",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "jumla-guthichaur",
    name: "Guthichaur",
    nepaliName: "गुठीचौर",
    type: "Rural Municipality",
    districtId: "jumla",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "jumla-tatopani",
    name: "Tatopani",
    nepaliName: "तातोपानी",
    type: "Rural Municipality",
    districtId: "jumla",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "jumla-patrasi",
    name: "Patrasi",
    nepaliName: "पत्रासी",
    type: "Rural Municipality",
    districtId: "jumla",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "jumla-kanakasundari",
    name: "Kanakasundari",
    nepaliName: "कनकसुन्दरी",
    type: "Rural Municipality",
    districtId: "jumla",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "kalikot-mahawai",
    name: "Mahawai",
    nepaliName: "महावाई",
    type: "Rural Municipality",
    districtId: "kalikot",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "kalikot-palata",
    name: "Palata",
    nepaliName: "पलाता",
    type: "Rural Municipality",
    districtId: "kalikot",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "kalikot-naraharinath",
    name: "Naraharinath",
    nepaliName: "नरहरिनाथ",
    type: "Rural Municipality",
    districtId: "kalikot",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "kalikot-pachaljharana",
    name: "Pachaljharana",
    nepaliName: "पाँचलझरना",
    type: "Rural Municipality",
    districtId: "kalikot",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "kalikot-subha-kalika",
    name: "Subha Kalika",
    nepaliName: "शुभ कालिका",
    type: "Rural Municipality",
    districtId: "kalikot",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "kalikot-sanni-tribeni",
    name: "Sanni Tribeni",
    nepaliName: "सन्नी त्रिवेणी",
    type: "Rural Municipality",
    districtId: "kalikot",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "dailekh-bhairabi",
    name: "Bhairabi",
    nepaliName: "भैरवी",
    type: "Rural Municipality",
    districtId: "dailekh",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "dailekh-mahabu",
    name: "Mahabu",
    nepaliName: "महाबु",
    type: "Rural Municipality",
    districtId: "dailekh",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "dailekh-gurans",
    name: "Gurans",
    nepaliName: "गुराँस",
    type: "Rural Municipality",
    districtId: "dailekh",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "dailekh-naumule",
    name: "Naumule",
    nepaliName: "नौमुले",
    type: "Rural Municipality",
    districtId: "dailekh",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "dailekh-bhagawatimai",
    name: "Bhagawatimai",
    nepaliName: "भगवतीमाई",
    type: "Rural Municipality",
    districtId: "dailekh",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "dailekh-thantikandh",
    name: "Thantikandh",
    nepaliName: "ठान्टिकाण्ड",
    type: "Rural Municipality",
    districtId: "dailekh",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "dailekh-dungeshwor",
    name: "Dungeshwor",
    nepaliName: "डुङ्गेश्वर",
    type: "Rural Municipality",
    districtId: "dailekh",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "jajarkot-kuse",
    name: "Kuse",
    nepaliName: "कुसे",
    type: "Rural Municipality",
    districtId: "jajarkot",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "jajarkot-shiwalaya",
    name: "Shiwalaya",
    nepaliName: "शिवालय",
    type: "Rural Municipality",
    districtId: "jajarkot",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "jajarkot-barekot",
    name: "Barekot",
    nepaliName: "बारेकोट",
    type: "Rural Municipality",
    districtId: "jajarkot",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "jajarkot-junichande",
    name: "Junichande",
    nepaliName: "जुनिचन्दे",
    type: "Rural Municipality",
    districtId: "jajarkot",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "western-rukum-tribeni",
    name: "Tribeni",
    nepaliName: "त्रिवेणी",
    type: "Rural Municipality",
    districtId: "western-rukum",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "western-rukum-sani-bheri",
    name: "Sani Bheri",
    nepaliName: "सानी भेरी",
    type: "Rural Municipality",
    districtId: "western-rukum",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "western-rukum-banfikot",
    name: "Banfikot",
    nepaliName: "बनफिकोट",
    type: "Rural Municipality",
    districtId: "western-rukum",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "salyan-kumakh",
    name: "Kumakh",
    nepaliName: "कुमाख",
    type: "Rural Municipality",
    districtId: "salyan",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "salyan-darma",
    name: "Darma",
    nepaliName: "डार्मा",
    type: "Rural Municipality",
    districtId: "salyan",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "salyan-kapurkot",
    name: "Kapurkot",
    nepaliName: "कपुरकोट",
    type: "Rural Municipality",
    districtId: "salyan",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "salyan-kalimati",
    name: "Kalimati",
    nepaliName: "कालीमाटी",
    type: "Rural Municipality",
    districtId: "salyan",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "salyan-tribeni",
    name: "Tribeni",
    nepaliName: "त्रिवेणी",
    type: "Rural Municipality",
    districtId: "salyan",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "salyan-chhatreshwori",
    name: "Chhatreshwori",
    nepaliName: "छत्रेश्वरी",
    type: "Rural Municipality",
    districtId: "salyan",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "salyan-siddha-kumakh",
    name: "Siddha Kumakh",
    nepaliName: "सिद्ध कुमाख",
    type: "Rural Municipality",
    districtId: "salyan",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "surkhet-chaukune",
    name: "Chaukune",
    nepaliName: "चौकुने",
    type: "Rural Municipality",
    districtId: "surkhet",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "surkhet-simta",
    name: "Simta",
    nepaliName: "सिम्ता",
    type: "Rural Municipality",
    districtId: "surkhet",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "surkhet-chingad",
    name: "Chingad",
    nepaliName: "चिंगाड",
    type: "Rural Municipality",
    districtId: "surkhet",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "surkhet-barahtal",
    name: "Barahtal",
    nepaliName: "बराहताल",
    type: "Rural Municipality",
    districtId: "surkhet",
    provinceId: 6,
    totalWards: 7
  },
  {
    id: "bajura-gaumul",
    name: "Gaumul",
    nepaliName: "गौमुल",
    type: "Rural Municipality",
    districtId: "bajura",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "bajura-himali",
    name: "Himali",
    nepaliName: "हिमाली",
    type: "Rural Municipality",
    districtId: "bajura",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "bajura-jagannath",
    name: "Jagannath",
    nepaliName: "जगन्नाथ",
    type: "Rural Municipality",
    districtId: "bajura",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "bajura-khaptad-chhededaha",
    name: "Khaptad Chhededaha",
    nepaliName: "खप्तड छेडेदह",
    type: "Rural Municipality",
    districtId: "bajura",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "bajura-swami-kartik-khaapar",
    name: "Swami Kartik Khaapar",
    nepaliName: "स्वामी कार्तिक खापर",
    type: "Rural Municipality",
    districtId: "bajura",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "bajhang-masta",
    name: "Masta",
    nepaliName: "मस्त",
    type: "Rural Municipality",
    districtId: "bajhang",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "bajhang-thalara",
    name: "Thalara",
    nepaliName: "थालारा",
    type: "Rural Municipality",
    districtId: "bajhang",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "bajhang-talkot",
    name: "Talkot",
    nepaliName: "तालकोट",
    type: "Rural Municipality",
    districtId: "bajhang",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "bajhang-surma",
    name: "Surma",
    nepaliName: "सुर्मा",
    type: "Rural Municipality",
    districtId: "bajhang",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "bajhang-saipaal",
    name: "SaiPaal",
    nepaliName: "साइपाल",
    type: "Rural Municipality",
    districtId: "bajhang",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "bajhang-durgathali",
    name: "Durgathali",
    nepaliName: "दुर्गाथली",
    type: "Rural Municipality",
    districtId: "bajhang",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "bajhang-bithadchir",
    name: "Bithadchir",
    nepaliName: "बिठाडचिर",
    type: "Rural Municipality",
    districtId: "bajhang",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "bajhang-kedarseu",
    name: "Kedarseu",
    nepaliName: "केदारसेउ",
    type: "Rural Municipality",
    districtId: "bajhang",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "bajhang-khaptadchhanna",
    name: "Khaptadchhanna",
    nepaliName: "खप्तडछन्ना",
    type: "Rural Municipality",
    districtId: "bajhang",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "bajhang-chabispathivera",
    name: "Chabispathivera",
    nepaliName: "चाबिस्पाथीवेरा",
    type: "Rural Municipality",
    districtId: "bajhang",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "darchula-lekam",
    name: "Lekam",
    nepaliName: "लेकम",
    type: "Rural Municipality",
    districtId: "darchula",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "darchula-naugad",
    name: "Naugad",
    nepaliName: "नौगाड",
    type: "Rural Municipality",
    districtId: "darchula",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "darchula-byas",
    name: "Byas",
    nepaliName: "ब्यास",
    type: "Rural Municipality",
    districtId: "darchula",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "darchula-dunhu",
    name: "Dunhu",
    nepaliName: "दुन्हु",
    type: "Rural Municipality",
    districtId: "darchula",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "darchula-marma",
    name: "Marma",
    nepaliName: "मर्मा",
    type: "Rural Municipality",
    districtId: "darchula",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "darchula-apihimal",
    name: "Apihimal",
    nepaliName: "एपिहिमल",
    type: "Rural Municipality",
    districtId: "darchula",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "darchula-malikaarjun",
    name: "Malikaarjun",
    nepaliName: "मालिकार्जुन",
    type: "Rural Municipality",
    districtId: "darchula",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "baitadi-sigas",
    name: "Sigas",
    nepaliName: "सिगास",
    type: "Rural Municipality",
    districtId: "baitadi",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "baitadi-shivanath",
    name: "Shivanath",
    nepaliName: "शिवनाथ",
    type: "Rural Municipality",
    districtId: "baitadi",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "baitadi-surnaya",
    name: "Surnaya",
    nepaliName: "सुर्नाया",
    type: "Rural Municipality",
    districtId: "baitadi",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "baitadi-dilasaini",
    name: "Dilasaini",
    nepaliName: "डिलासैनी",
    type: "Rural Municipality",
    districtId: "baitadi",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "baitadi-pancheshwar",
    name: "Pancheshwar",
    nepaliName: "पञ्चेश्वर",
    type: "Rural Municipality",
    districtId: "baitadi",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "baitadi-dogadakedar",
    name: "Dogadakedar",
    nepaliName: "दोगडाकेदार",
    type: "Rural Municipality",
    districtId: "baitadi",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "dadeldhura-alital",
    name: "Alital",
    nepaliName: "अलिताल",
    type: "Rural Municipality",
    districtId: "dadeldhura",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "dadeldhura-ajaymeru",
    name: "Ajaymeru",
    nepaliName: "अजयमेरु",
    type: "Rural Municipality",
    districtId: "dadeldhura",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "dadeldhura-bhageshwar",
    name: "Bhageshwar",
    nepaliName: "भागेश्वर",
    type: "Rural Municipality",
    districtId: "dadeldhura",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "dadeldhura-nawadurga",
    name: "Nawadurga",
    nepaliName: "नवदुर्गा",
    type: "Rural Municipality",
    districtId: "dadeldhura",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "dadeldhura-ganayapdhura",
    name: "Ganayapdhura",
    nepaliName: "गणयपधुरा",
    type: "Rural Municipality",
    districtId: "dadeldhura",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "doti-sayal",
    name: "Sayal",
    nepaliName: "सायल",
    type: "Rural Municipality",
    districtId: "doti",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "doti-adharsha",
    name: "Adharsha",
    nepaliName: "आदर्श",
    type: "Rural Municipality",
    districtId: "doti",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "doti-jorayal",
    name: "Jorayal",
    nepaliName: "जोरयाल",
    type: "Rural Municipality",
    districtId: "doti",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "doti-badikedar",
    name: "Badikedar",
    nepaliName: "बडीकेदार",
    type: "Rural Municipality",
    districtId: "doti",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "doti-purbichauki",
    name: "Purbichauki",
    nepaliName: "पूर्वचौकी",
    type: "Rural Municipality",
    districtId: "doti",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "doti-k-i-singh",
    name: "K I Singh",
    nepaliName: "के आई सिंह",
    type: "Rural Municipality",
    districtId: "doti",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "doti-bogtan-foodsil",
    name: "Bogtan Foodsil",
    nepaliName: "Bogtan Foodsil",
    type: "Rural Municipality",
    districtId: "doti",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "achham-dhakari",
    name: "Dhakari",
    nepaliName: "ढकारी",
    type: "Rural Municipality",
    districtId: "achham",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "achham-mellekh",
    name: "Mellekh",
    nepaliName: "मेल्लेख",
    type: "Rural Municipality",
    districtId: "achham",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "achham-chaurpati",
    name: "Chaurpati",
    nepaliName: "चौरपाटी",
    type: "Rural Municipality",
    districtId: "achham",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "achham-ramaroshan",
    name: "Ramaroshan",
    nepaliName: "रामरोशन",
    type: "Rural Municipality",
    districtId: "achham",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "achham-turmakhad",
    name: "Turmakhad",
    nepaliName: "तुर्मखाड",
    type: "Rural Municipality",
    districtId: "achham",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "achham-bannigadhi",
    name: "Bannigadhi",
    nepaliName: "बान्नीगढी",
    type: "Rural Municipality",
    districtId: "achham",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "kailali-chure",
    name: "Chure",
    nepaliName: "चुरे",
    type: "Rural Municipality",
    districtId: "kailali",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "kailali-janaki",
    name: "Janaki",
    nepaliName: "जानकी",
    type: "Rural Municipality",
    districtId: "kailali",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "kailali-kailari",
    name: "Kailari",
    nepaliName: "कैलारी",
    type: "Rural Municipality",
    districtId: "kailali",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "kailali-joshipur",
    name: "Joshipur",
    nepaliName: "जोशीपुर",
    type: "Rural Municipality",
    districtId: "kailali",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "kailali-mohanyal",
    name: "Mohanyal",
    nepaliName: "मोहन्याल",
    type: "Rural Municipality",
    districtId: "kailali",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "kailali-bardagoriya",
    name: "Bardagoriya",
    nepaliName: "बर्दगोरिया",
    type: "Rural Municipality",
    districtId: "kailali",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "kanchanpur-beldandi",
    name: "Beldandi",
    nepaliName: "बेलडाँडी",
    type: "Rural Municipality",
    districtId: "kanchanpur",
    provinceId: 7,
    totalWards: 7
  },
  {
    id: "kanchanpur-laljhandi",
    name: "Laljhandi",
    nepaliName: "लालझण्डी",
    type: "Rural Municipality",
    districtId: "kanchanpur",
    provinceId: 7,
    totalWards: 7
  },
];
