import React, { useState, useMemo, useEffect } from 'react';
import {
  Sprout,
  Fish,
  Calculator,
  Calendar,
  TrendingUp,
  DollarSign,
  Layers,
  Droplets,
  CheckCircle2,
  AlertCircle,
  Printer,
  BookmarkPlus,
  Trash2,
  RefreshCw,
  ChevronRight,
  Info,
  Scale,
  Package,
  Clock,
  Award,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  Sparkles,
  MapPin,
  FileText
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

// ==========================================
// DATA PRESET STANDAR INDONESIA (REALISTIS)
// ==========================================

const AGRI_PRESETS = {
  padi: {
    id: 'padi',
    name: 'Padi Sawah (Inpari 32 / Ciherang)',
    icon: '🌾',
    badge: 'Tanaman Pangan',
    durationDays: 105, // HST
    seedUnit: 'kg',
    seedRatePerHa: 25, // 25 kg/Ha
    seedPriceDefault: 14500, // Rp/kg benih bersertifikat
    spacingOptions: [
      { id: 'legowo_2_1', label: 'Jajar Legowo 2:1 (25x12.5x50 cm) - Produktivitas +15%', yieldMultiplier: 1.12, seedMultiplier: 1.1 },
      { id: 'legowo_4_1', label: 'Jajar Legowo 4:1 (25x12.5x50 cm) - Populasi Tinggi', yieldMultiplier: 1.08, seedMultiplier: 1.05 },
      { id: 'tegel_25', label: 'Sistem Tegel Konvensional (25x25 cm)', yieldMultiplier: 1.0, seedMultiplier: 1.0 },
      { id: 'sri', label: 'Metode SRI (30x30 cm) - Hemat Benih', yieldMultiplier: 1.05, seedMultiplier: 0.6 }
    ],
    fertilizerPerHa: {
      urea: 250, // kg/Ha
      npk: 300, // kg/Ha (Phonska)
      organik: 1000 // kg/Ha (Petroganik/Kompos)
    },
    fertilizerPrices: {
      urea: 2700, // Harga subsidi/rata-rata petani Rp/kg
      npk: 2700,
      organik: 1000
    },
    laborAndOpsPerHa: 8500000, // Olah tanah traktor, tanam, cabut rumput, pestisida, panen combine
    yieldTonPerHa: 6.8, // Ton GKP (Gabah Kering Panen) per Ha
    sellingPricePerKg: 6500, // Rp/kg GKP
    fertilizerSchedule: [
      { phase: 'Pupuk Dasar (0 - 7 HST)', ureaPct: 30, npkPct: 50, organikPct: 100, note: 'Tabur organik saat olah tanah akhir, Urea & NPK saat 7 HST' },
      { phase: 'Pupuk Susulan I (21 - 25 HST)', ureaPct: 40, npkPct: 50, organikPct: 0, note: 'Fase anakan aktif, pastikan air macak-macak' },
      { phase: 'Pupuk Susulan II (40 - 45 HST)', ureaPct: 30, npkPct: 0, organikPct: 0, note: 'Fase primordia / bunting muda untuk pengisian malai' }
    ],
    timeline: [
      { dayOffset: -18, title: 'Persemaian Benih & Olah Tanah I', desc: 'Rendam benih 24 jam, peram 48 jam, tebar di bedengan semai. Bajak tanah pertama.', category: 'prep' },
      { dayOffset: -3, title: 'Olah Tanah II (Garuk/Ratakan) & Pupuk Organik', desc: 'Pelumpuran lahan, perbaikan pematang, dan penaburan pupuk organik dasar.', category: 'prep' },
      { dayOffset: 0, title: 'Pindah Tanam (0 HST)', desc: 'Tanam bibit muda (15-18 HSS) dengan kedalaman 2-3 cm (2-3 batang per lubang).', category: 'plant' },
      { dayOffset: 7, title: 'Pemupukan Susulan Pertama (7 HST) & Penyulaman', desc: 'Sulam tanaman yang mati. Aplikasikan 30% Urea + 50% NPK Phonska.', category: 'fert' },
      { dayOffset: 18, title: 'Penyiangan Gulma I & Pengaturan Air', desc: 'Bersihkan gulma dengan gasrok/landak. Pengairan berselang (intermittent).', category: 'care' },
      { dayOffset: 23, title: 'Pemupukan Susulan Kedua (23 HST)', desc: 'Aplikasi 40% Urea + 50% NPK untuk memacu jumlah anakan produktif.', category: 'fert' },
      { dayOffset: 42, title: 'Pemupukan Susulan Ketiga / Primordia (42 HST)', desc: 'Aplikasi sisa 30% Urea saat tanaman mulai bunting untuk bobot bulir.', category: 'fert' },
      { dayOffset: 65, title: 'Fase Berbunga & Pengendalian Hama Wereng/Walang Sangit', desc: 'Monitoring intensif OPT, aplikasi pestisida nabati/kimia bijaksana bila ambang batas.', category: 'care' },
      { dayOffset: 95, title: 'Pengeringan Lahan (10 Hari Sebelum Panen)', desc: 'Keringkan petakan sawah agar pematangan gabah serempak dan tanah keras saat panen.', category: 'care' },
      { dayOffset: 105, title: 'Panen Raya (105 HST)', desc: '95% gabah menguning. Panen dengan Combine Harvester untuk menekan kehilangan hasil.', category: 'harvest' }
    ]
  },
  jagung: {
    id: 'jagung',
    name: 'Jagung Hibrida (Bisi-18 / Pioneer P32)',
    icon: '🌽',
    badge: 'Tanaman Pangan',
    durationDays: 100,
    seedUnit: 'kg',
    seedRatePerHa: 20, // 20 kg/Ha (~66.000 - 71.000 tanaman)
    seedPriceDefault: 95000, // Rp/kg benih hibrida F1
    spacingOptions: [
      { id: 'zig_zag', label: 'Double Row / Zig-Zag (70-40 x 20 cm) - Populasi Optimal', yieldMultiplier: 1.15, seedMultiplier: 1.12 },
      { id: 'standar_70_20', label: 'Baris Tunggal Standar (70 x 20 cm)', yieldMultiplier: 1.0, seedMultiplier: 1.0 },
      { id: 'renggang_75_25', label: 'Jarak Renggang Musim Hujan (75 x 25 cm)', yieldMultiplier: 0.94, seedMultiplier: 0.85 }
    ],
    fertilizerPerHa: {
      urea: 350,
      npk: 300,
      organik: 1500
    },
    fertilizerPrices: {
      urea: 2700,
      npk: 2700,
      organik: 1000
    },
    laborAndOpsPerHa: 7200000, // Bedengan/drainase, tugal, herbisida selektif, panen & pipil
    yieldTonPerHa: 8.5, // Ton Pipilan Kering per Ha
    sellingPricePerKg: 5200, // Rp/kg pipilan kering (KA 14-15%)
    fertilizerSchedule: [
      { phase: 'Pupuk Dasar & Tanam (0 - 7 HST)', ureaPct: 25, npkPct: 50, organikPct: 100, note: 'Organik penutup lubang tugal, Urea & NPK tugal 5 cm di samping benih' },
      { phase: 'Pupuk Susulan I (25 - 30 HST)', ureaPct: 40, npkPct: 50, organikPct: 0, note: 'Dilanjutkan pembumbunan tanah ke pangkal batang' },
      { phase: 'Pupuk Susulan II (45 - 50 HST)', ureaPct: 35, npkPct: 0, organikPct: 0, note: 'Menjelang keluar bunga jantan (tasseling) untuk pengisian tongkol' }
    ],
    timeline: [
      { dayOffset: -7, title: 'Pembersihan Lahan & Pembuatan Saluran Drainase', desc: 'Bajak tanah dan buat parit keliling/tengah agar jagung tidak tergenang air.', category: 'prep' },
      { dayOffset: 0, title: 'Penanaman Benih dengan Sistem Tugal (0 HST)', desc: 'Masukkan 1 benih per lubang tugal sedalam 3-5 cm, tutup dengan pupuk organik/kompos.', category: 'plant' },
      { dayOffset: 7, title: 'Pemupukan I (7 HST) & Penyulaman', desc: 'Sulam benih yang tidak tumbuh. Tugal pupuk 25% Urea + 50% NPK berjarak 5 cm dari tanaman.', category: 'fert' },
      { dayOffset: 18, title: 'Pengendalian Gulma & Ulat Grayak (FAW)', desc: 'Aplikasi herbisida selektif jagung (Calaris/Kayabas) dan cek pucuk daun dari ulat.', category: 'care' },
      { dayOffset: 28, title: 'Pemupukan II & Pembumbunan (28 HST)', desc: 'Aplikasi 40% Urea + 50% NPK lalu bumbun tanah agar akar penyangga kokoh.', category: 'fert' },
      { dayOffset: 48, title: 'Pemupukan III Fase Generatif (48 HST)', desc: 'Aplikasi 35% Urea terakhir sebelum keluar bunga. Jaga kecukupan air.', category: 'fert' },
      { dayOffset: 75, title: 'Pengisian Biji & Pemangkasan Daun Bawah', desc: 'Pangkas 2-3 daun paling bawah yang mengering agar sirkulasi udara baik.', category: 'care' },
      { dayOffset: 100, title: 'Panen Jagung (100 HST)', desc: 'Kelobot kering coklat dan terdapat lapisan hitam (black layer) pada pangkal biji.', category: 'harvest' }
    ]
  },
  tebu: {
    id: 'tebu',
    name: 'Tebu Rakyat (Bululawang / PS 881)',
    icon: '🎋',
    badge: 'Perkebunan (11 Bulan)',
    durationDays: 330,
    seedUnit: 'kuintal',
    seedRatePerHa: 75, // 75 Kuintal (7.5 Ton) bibit bagal/stek per Ha
    seedPriceDefault: 95000, // Rp/kuintal bibit tebu
    spacingOptions: [
      { id: 'pkp_110', label: 'Juringan Tunggal Standar (PKP 110 cm)', yieldMultiplier: 1.0, seedMultiplier: 1.0 },
      { id: 'double_row', label: 'Juringan Ganda / Double Track (50-135 cm)', yieldMultiplier: 1.15, seedMultiplier: 1.2 },
      { id: 'ratoon', label: 'Sistem Keprasan / Ratoon (Hemat Biaya Bibit)', yieldMultiplier: 0.92, seedMultiplier: 0.15 }
    ],
    fertilizerPerHa: {
      urea: 400, // Setara ZA/Urea dosis N tinggi
      npk: 600, // Phonska
      organik: 2500 // Kompos/Blotong
    },
    fertilizerPrices: {
      urea: 2700,
      npk: 2700,
      organik: 800
    },
    laborAndOpsPerHa: 18500000, // Reynoso/bajak dalam, tanam, bumbun 1-3, klentek 1-2, tebang & angkut
    yieldTonPerHa: 92, // Ton Tebu Giling per Ha
    sellingPricePerKg: 780, // Rp 780/kg = Rp 78.000/kuintal = Rp 780.000/ton tebu bersih
    fertilizerSchedule: [
      { phase: 'Pupuk Dasar & Tanam (0 - 15 HST)', ureaPct: 30, npkPct: 50, organikPct: 100, note: 'Organik/blotong di dasar juringan, NPK + Urea awal saat tunas tumbuh' },
      { phase: 'Pupuk Susulan II (45 - 60 HST)', ureaPct: 70, npkPct: 50, organikPct: 0, note: 'Sebelum pembumbunan (gulud) kedua agar memacu anakan tebu' },
      { phase: 'Perawatan Kemasakan (180+ HST)', ureaPct: 0, npkPct: 0, organikPct: 0, note: 'Hentikan pupuk N agar rendemen gula tidak turun' }
    ],
    timeline: [
      { dayOffset: -14, title: 'Bajak Dalam & Pembuatan Juringan (Got)', desc: 'Pembajakan dalam 30-40 cm, buat juringan tanam dan saluran got keliling/malang.', category: 'prep' },
      { dayOffset: 0, title: 'Penanaman Bibit Tebu (0 HST)', desc: 'Tanam bibit bagal/pucuk bermata tunas sehat di dasar juringan, tutup tanah tipis.', category: 'plant' },
      { dayOffset: 15, title: 'Pemupukan I & Penyulaman (15 HST)', desc: 'Sulam barisan yang kosong dengan bibit seumur. Berikan 30% Urea/ZA + 50% NPK.', category: 'fert' },
      { dayOffset: 45, title: 'Pembumbunan I (Turun Tanah Ringan)', desc: 'Menutup pangkal tunas dengan tanah dari guludan untuk merangsang anakan.', category: 'care' },
      { dayOffset: 60, title: 'Pemupukan II & Pembumbunan II (60 HST)', desc: 'Aplikasi 70% Urea/ZA + 50% NPK dilanjutkan penurunan tanah guludan.', category: 'fert' },
      { dayOffset: 105, title: 'Pembumbunan III (Gulud Akhir)', desc: 'Pembuatan guludan tinggi agar rumpun tebu tegak dan tidak mudah roboh.', category: 'care' },
      { dayOffset: 160, title: 'Klentek I (Pelepasan Daun Kering)', desc: 'Bersihkan daun tua kering agar batang terkena sinar matahari dan rendemen naik.', category: 'care' },
      { dayOffset: 240, title: 'Klentek II & Pengendalian Penggerek Batang', desc: 'Pembersihan daun kering kedua, ikat tebu yang miring, jaga drainase kering.', category: 'care' },
      { dayOffset: 330, title: 'Tebang & Angkut ke Pabrik Gula (330 HST)', desc: 'Uji brix/rendemen puncak. Tebang rata tanah (MBS: Manis, Bersih, Segar).', category: 'harvest' }
    ]
  }
};

const FISH_PRESETS = {
  lele: {
    id: 'lele',
    name: 'Ikan Lele Sangkuriang / Mutiara',
    icon: '🐟',
    badge: 'Air Tawar - Intensif',
    durationDays: 75,
    defaultPondAreaM2: 100, // misal 5 kolam terpal/beton @20m2
    defaultDensityPerM2: 150, // 150 ekor/m2
    recommendedDensityRange: '100 - 250 ekor/m² (Kolam Tanah/Terpal/Bioflok)',
    seedSizeLabel: 'Ukuran 7-8 cm',
    seedPricePerPiece: 260, // Rp/ekor
    survivalRatePct: 85, // 85%
    fcr: 1.05, // 1.05 kg pakan untuk 1 kg daging lele
    targetSizePerKg: 9, // 1 kg isi 9 ekor (~111 gram/ekor)
    feedPricePerKg: 11800, // Rp/kg pelet apung protein 30-32%
    opsAndProbioticsCost: 1200000, // Listrik, air, probiotik EM4, molase, kapur, vitamin
    sellingPricePerKg: 21500, // Rp/kg harga bakul/pengepul
    timeline: [
      { dayOffset: -7, title: 'Persiapan Kolam & Pembentukan Air (Plankton/Flok)', desc: 'Cuci kolam, isi air 50-60 cm, berikan garam grosok, kapur dolomit, probiotik + molase.', category: 'prep' },
      { dayOffset: 0, title: 'Penebaran Benih Lele (0 HST) & Puasa 24 Jam', desc: 'Aklimatisasi suhu plastik 15 menit. Tebar pagi/sore hari. Puasakan 24 jam pertama.', category: 'plant' },
      { dayOffset: 2, title: 'Pakan Starter (PF-1000 / 781-1)', desc: 'Berikan pakan butiran kecil protein tinggi 3 kali sehari secara ad-satiasi (80% kenyang).', category: 'fert' },
      { dayOffset: 20, title: 'Sortir I (Grading Ukuran) & Ganti Air Parsial', desc: 'Pisahkan lele ukuran besar dan kecil agar tidak terjadi kanibalisme. Ganti air dasar 20%.', category: 'care' },
      { dayOffset: 25, title: 'Transisi Pakan Grower (781-2)', desc: 'Pemberian pakan pelet ukuran 2 mm + bibis probiotik dan vitamin C.', category: 'fert' },
      { dayOffset: 45, title: 'Sortir II & Pakan Finisher (781 Polos)', desc: 'Sampling bobot rata-rata. Berikan pakan ukuran 3 mm untuk kejar bobot panen.', category: 'fert' },
      { dayOffset: 75, title: 'Panen Lele Konsumsi (75 HST)', desc: 'Puasakan 12-24 jam sebelum panen agar tidak muntah di perjalanan. Target size 8-10 ekor/kg.', category: 'harvest' }
    ]
  },
  nila: {
    id: 'nila',
    name: 'Ikan Nila Nirwana / Sultana (Monosex)',
    icon: '🐠',
    badge: 'Air Tawar / Payau Ringan',
    durationDays: 110,
    defaultPondAreaM2: 400, // 400 m2
    defaultDensityPerM2: 35, // 35 ekor/m2
    recommendedDensityRange: '20 - 50 ekor/m² (Kolam Tanah/Beton Air Mengalir)',
    seedSizeLabel: 'Ukuran 5-7 cm (Jantan Monosex)',
    seedPricePerPiece: 350,
    survivalRatePct: 85,
    fcr: 1.25,
    targetSizePerKg: 4, // 1 kg isi 4 ekor (250 gram/ekor)
    feedPricePerKg: 12200,
    opsAndProbioticsCost: 1800000,
    sellingPricePerKg: 28000,
    timeline: [
      { dayOffset: -10, title: 'Pengeringan Dasar Kolam, Pengapuran & Pemupukan Air', desc: 'Jemur dasar kolam hingga retak, tabur kapur tohor/dolomit, isi air dan tumbuhkan pakan alami.', category: 'prep' },
      { dayOffset: 0, title: 'Tebar Benih Nila Monosex (0 HST)', desc: 'Gunakan benih jantan monosex agar pertumbuhan cepat dan tidak beranak di kolam.', category: 'plant' },
      { dayOffset: 15, title: 'Fase Pakan Starter & Manajemen DO (Oksigen)', desc: 'Pemberian pakan 3-4% dari biomassa dibagi 3 waktu (pagi, siang, sore).', category: 'fert' },
      { dayOffset: 45, title: 'Sampling Pertumbuhan I & Pergantian Air', desc: 'Timbang sampel 50 ekor untuk menyesuaikan dosis pakan harian. Jaga pH 7.0 - 8.2.', category: 'care' },
      { dayOffset: 75, title: 'Fase Pakan Grower-Finisher & Probiotik Usus', desc: 'Campur pelet dengan probiotik untuk menekan FCR dan mempertebal daging punggung.', category: 'fert' },
      { dayOffset: 110, title: 'Panen Nila Konsumsi (110 HST)', desc: 'Panen pagi hari saat suhu sejuk. Target bobot 250g/ekor (size 4 ekor/kg) diminati pasar.', category: 'harvest' }
    ]
  },
  bandeng: {
    id: 'bandeng',
    name: 'Ikan Bandeng Tambak (Chanos chanos)',
    icon: '🦈',
    badge: 'Tambak Air Payau / Tawar',
    durationDays: 120,
    defaultPondAreaM2: 5000, // 0.5 Hektar (5.000 m2) khas tambak Lamongan/Gresik/Sidoarjo
    defaultDensityPerM2: 3, // 3 ekor/m2 = 15.000 ekor/0.5 Ha (Semi-intensif)
    recommendedDensityRange: '2 - 6 ekor/m² (Tambak Semi-Intensif)',
    seedSizeLabel: 'Gelondongan (5-7 cm) dari Nener',
    seedPricePerPiece: 450,
    survivalRatePct: 86,
    fcr: 1.35, // Dibantu klekap/lumut alami tambak
    targetSizePerKg: 4, // 1 kg isi 4 ekor (250 gram/ekor)
    feedPricePerKg: 9800, // Pelet bandeng protein 20-25%
    opsAndProbioticsCost: 3500000, // Saponin, pupuk tambak (Urea+SP36 untuk klekap), pompa air
    sellingPricePerKg: 24500,
    timeline: [
      { dayOffset: -14, title: 'Pengeringan Pelataran Tambak & Pemberantasan Hama', desc: 'Keringkan pelataran tambak, perbaiki caren dan tanggul. Berikan saponin untuk basmi ikan liar/kakap.', category: 'prep' },
      { dayOffset: -5, title: 'Penumbuhan Klekap & Plankton (Pupuk Dasar Tambak)', desc: 'Isi air 15-20 cm, aplikasikan pupuk Urea + SP36 + Organik agar klekap tumbuh subur di dasar.', category: 'prep' },
      { dayOffset: 0, title: 'Penebaran Benih Bandeng Gelondongan (0 HST)', desc: 'Naikkan air hingga 60-80 cm. Tebar gelondongan pagi hari setelah aklimatisasi salinitas & suhu.', category: 'plant' },
      { dayOffset: 25, title: 'Pemberian Pakan Tambahan Pelet & Pemupukan Susulan Air', desc: 'Saat klekap mulai menipis, mulai berikan pelet bandeng secara rutin di titik anco/pakan.', category: 'fert' },
      { dayOffset: 60, title: 'Sampling Pertumbuhan & Sirkulasi Air Pasang', desc: 'Cek kesehatan insang dan laju bobot. Lakukan pergantian air saat pasang untuk jaga kualitas air.', category: 'care' },
      { dayOffset: 90, title: 'Fase Penggemukan (Finisher)', desc: 'Optimalkan pemberian pakan pelet 3% biomassa untuk mengejar bobot 4 ekor/kg.', category: 'fert' },
      { dayOffset: 120, title: 'Panen Raya Bandeng Tambak (120 HST)', desc: 'Surutkan air menuju caren, jaring bandeng dan langsung masukkan ke box es agar sisik mengkilap.', category: 'harvest' }
    ]
  },
  vaname: {
    id: 'vaname',
    name: 'Udang Vaname (Litopenaeus vannamei)',
    icon: '🦐',
    badge: 'Tambak Semi-Intensif / Intensif',
    durationDays: 95,
    defaultPondAreaM2: 1000, // 1.000 m2 (Kolam HDPE / Tambak Intensif)
    defaultDensityPerM2: 80, // 80 ekor/m2 = 80.000 PL
    recommendedDensityRange: '60 - 120 ekor/m² (Kincir & Aerasi Aktif)',
    seedSizeLabel: 'Benur PL-10 SPF (Bebas Virus)',
    seedPricePerPiece: 68, // Rp 68/ekor benur SPF
    survivalRatePct: 82,
    fcr: 1.35,
    targetSizePerKg: 55, // Size 55 ekor/kg (~18.1 gram/ekor)
    feedPricePerKg: 16500, // Pakan udang protein tinggi (35-38%)
    opsAndProbioticsCost: 11500000, // Listrik kincir 3 bulan, kapur, mineral, probiotik, desinfektan
    sellingPricePerKg: 69000, // Harga udang size 55
    timeline: [
      { dayOffset: -14, title: 'Sterilisasi Tambak, Pasang Kincir & Water Treatment', desc: 'Cuci HDPE/dasar tambak, sterilisasi kaporit, nyalakan kincir, kultur probiotik & mineral air.', category: 'prep' },
      { dayOffset: 0, title: 'Tebar Benur Vaname PL-10 SPF (DOC 1)', desc: 'Pastikan pH 7.8-8.2, alkalinitas >120 ppm. Tebar benur pagi hari dengan aklimatisasi perlahan.', category: 'plant' },
      { dayOffset: 1, title: 'Program Blind Feeding (DOC 1 - 30)', desc: 'Pemberian pakan crumble halus (No. 0 / 1) sebanyak 4-5 kali sehari sesuai tabel blind feeding.', category: 'fert' },
      { dayOffset: 31, title: 'Mulai Cek Anco & Sifon Dasar Kolam (DOC 31)', desc: 'Kontrol nafsu makan udang lewat anco. Sifon lumpur/kotoran dasar secara berkala + aplikasi mineral.', category: 'care' },
      { dayOffset: 60, title: 'Panen Parsial I (Jika Padat Tinggi) & Pakan Pelet', desc: 'Cek ABW (Average Body Weight). Jaga DO > 4 ppm terutama malam/dini hari saat udang moulting.', category: 'fert' },
      { dayOffset: 95, title: 'Panen Total Udang Vaname (DOC 95)', desc: 'Aplikasi kapur/mineral sehari sebelumnya agar kulit udang keras (tidak lembek). Panen sistem dingin (es).', category: 'harvest' }
    ]
  }
};

// ==========================================
// FUNGSI UTILITAS FORMATTER
// ==========================================

const formatRupiah = (num) => {
  if (isNaN(num) || num === null) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(num));
};

const formatNumber = (num, decimals = 0) => {
  if (isNaN(num) || num === null) return '0';
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

const addDaysToDate = (dateStr, days) => {
  const base = dateStr ? new Date(dateStr) : new Date();
  const result = new Date(base);
  result.setDate(result.getDate() + Number(days));
  return result.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ef4444'];

// ==========================================
// KOMPONEN UTAMA APLIKASI
// ==========================================

export default function App() {
  // State Kategori Utama: 'agri' | 'fish'
  const [sector, setSector] = useState('agri');
  const [activeTab, setActiveTab] = useState('calculator'); // 'calculator' | 'timeline' | 'comparison'

  //Tanggal hari ini dalam format YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // ------------------------------------------
  // STATE PERTANIAN (PADI, JAGUNG, TEBU)
  // ------------------------------------------
  const [agriCommodity, setAgriCommodity] = useState('padi');
  const [landAreaValue, setLandAreaValue] = useState(1);
  const [landAreaUnit, setLandAreaUnit] = useState('ha'); // 'ha' | 'm2'
  const [agriStartDate, setAgriStartDate] = useState(todayStr);
  const [spacingId, setSpacingId] = useState('legowo_2_1');
  const [agriSeedPrice, setAgriSeedPrice] = useState(AGRI_PRESETS.padi.seedPriceDefault);
  const [ureaPrice, setUreaPrice] = useState(AGRI_PRESETS.padi.fertilizerPrices.urea);
  const [npkPrice, setNpkPrice] = useState(AGRI_PRESETS.padi.fertilizerPrices.npk);
  const [organikPrice, setOrganikPrice] = useState(AGRI_PRESETS.padi.fertilizerPrices.organik);
  const [agriLaborCostPerHa, setAgriLaborCostPerHa] = useState(AGRI_PRESETS.padi.laborAndOpsPerHa);
  const [agriSellingPrice, setAgriSellingPrice] = useState(AGRI_PRESETS.padi.sellingPricePerKg);
  const [customYieldTonPerHa, setCustomYieldTonPerHa] = useState(AGRI_PRESETS.padi.yieldTonPerHa);

  // ------------------------------------------
  // STATE PERIKANAN (LELE, NILA, BANDENG, VANAME)
  // ------------------------------------------
  const [fishCommodity, setFishCommodity] = useState('lele');
  const [fishInputMode, setFishInputMode] = useState('area'); // 'area' | 'seedCount'
  const [pondAreaValue, setPondAreaValue] = useState(FISH_PRESETS.lele.defaultPondAreaM2);
  const [pondAreaUnit, setPondAreaUnit] = useState('m2'); // 'm2' | 'ha'
  const [directSeedCount, setDirectSeedCount] = useState(15000);
  const [densityPerM2, setDensityPerM2] = useState(FISH_PRESETS.lele.defaultDensityPerM2);
  const [fishStartDate, setFishStartDate] = useState(todayStr);
  const [srPct, setSrPct] = useState(FISH_PRESETS.lele.survivalRatePct);
  const [fcr, setFcr] = useState(FISH_PRESETS.lele.fcr);
  const [targetSizePerKg, setTargetSizePerKg] = useState(FISH_PRESETS.lele.targetSizePerKg);
  const [fishSeedPrice, setFishSeedPrice] = useState(FISH_PRESETS.lele.seedPricePerPiece);
  const [feedPricePerKg, setFeedPricePerKg] = useState(FISH_PRESETS.lele.feedPricePerKg);
  const [fishOpsCost, setFishOpsCost] = useState(FISH_PRESETS.lele.opsAndProbioticsCost);
  const [fishSellingPrice, setFishSellingPrice] = useState(FISH_PRESETS.lele.sellingPricePerKg);

  // ------------------------------------------
  // STATE SIMPAN SIMULASI & PERBANDINGAN
  // ------------------------------------------
  const [savedSimulations, setSavedSimulations] = useState([
    {
      id: 'demo-1',
      title: 'Padi Jajar Legowo (1 Ha)',
      sector: 'Pertanian',
      icon: '🌾',
      duration: '105 Hari',
      totalCost: 11262500,
      grossRevenue: 49504000,
      netProfit: 38241500,
      roi: 339.5,
      bcRatio: 4.4
    },
    {
      id: 'demo-2',
      title: 'Lele Intensif (100 m² - 15rb ekor)',
      sector: 'Perikanan',
      icon: '🐟',
      duration: '75 Hari',
      totalCost: 22923750,
      grossRevenue: 30458333,
      netProfit: 7534583,
      roi: 32.9,
      bcRatio: 1.33
    }
  ]);

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Handler ganti komoditas pertanian -> muat preset otomatis
  const handleSelectAgriCommodity = (key) => {
    const preset = AGRI_PRESETS[key];
    setAgriCommodity(key);
    setSpacingId(preset.spacingOptions[0].id);
    setAgriSeedPrice(preset.seedPriceDefault);
    setUreaPrice(preset.fertilizerPrices.urea);
    setNpkPrice(preset.fertilizerPrices.npk);
    setOrganikPrice(preset.fertilizerPrices.organik);
    setAgriLaborCostPerHa(preset.laborAndOpsPerHa);
    setAgriSellingPrice(preset.sellingPricePerKg);
    setCustomYieldTonPerHa(preset.yieldTonPerHa);
  };

  // Handler ganti komoditas perikanan -> muat preset otomatis
  const handleSelectFishCommodity = (key) => {
    const preset = FISH_PRESETS[key];
    setFishCommodity(key);
    setPondAreaUnit('m2');
    setPondAreaValue(preset.defaultPondAreaM2);
    setDensityPerM2(preset.defaultDensityPerM2);
    setDirectSeedCount(preset.defaultPondAreaM2 * preset.defaultDensityPerM2);
    setSrPct(preset.survivalRatePct);
    setFcr(preset.fcr);
    setTargetSizePerKg(preset.targetSizePerKg);
    setFishSeedPrice(preset.seedPricePerPiece);
    setFeedPricePerKg(preset.feedPricePerKg);
    setFishOpsCost(preset.opsAndProbioticsCost);
    setFishSellingPrice(preset.sellingPricePerKg);
  };

  // ==========================================
  // KALKULASI OTOMATIS PERTANIAN
  // ==========================================
  const agriCalculation = useMemo(() => {
    const preset = AGRI_PRESETS[agriCommodity];
    const spacingObj = preset.spacingOptions.find((s) => s.id === spacingId) || preset.spacingOptions[0];

    // Konversi luas lahan ke Hektar (1 Ha = 10.000 m2)
    const areaInHa = landAreaUnit === 'ha' ? Math.max(0.01, Number(landAreaValue)) : Math.max(10, Number(landAreaValue)) / 10000;
    const areaInM2 = areaInHa * 10000;

    // 1. Kebutuhan Benih / Bibit
    const seedNeeded = areaInHa * preset.seedRatePerHa * spacingObj.seedMultiplier;
    const totalSeedCost = seedNeeded * Number(agriSeedPrice);

    // 2. Kebutuhan Pupuk
    const ureaNeededKg = areaInHa * preset.fertilizerPerHa.urea;
    const npkNeededKg = areaInHa * preset.fertilizerPerHa.npk;
    const organikNeededKg = areaInHa * preset.fertilizerPerHa.organik;

    const ureaCost = ureaNeededKg * Number(ureaPrice);
    const npkCost = npkNeededKg * Number(npkPrice);
    const organikCost = organikNeededKg * Number(organikPrice);
    const totalFertilizerCost = ureaCost + npkCost + organikCost;

    // Dosis pupuk per fase
    const fertilizerPhaseDetails = preset.fertilizerSchedule.map((item) => ({
      ...item,
      ureaKg: (ureaNeededKg * item.ureaPct) / 100,
      npkKg: (npkNeededKg * item.npkPct) / 100,
      organikKg: (organikNeededKg * item.organikPct) / 100
    }));

    // 3. Biaya Tenaga Kerja & Operasional
    const totalLaborCost = areaInHa * Number(agriLaborCostPerHa);

    // 4. Total Biaya Modal (HPP)
    const totalCost = totalSeedCost + totalFertilizerCost + totalLaborCost;

    // 5. Estimasi Hasil Panen
    const estimatedYieldTon = areaInHa * Number(customYieldTonPerHa) * spacingObj.yieldMultiplier;
    const estimatedYieldKg = estimatedYieldTon * 1000;

    // 6. Pendapatan, Keuntungan, ROI, B/C Ratio, BEP
    const grossRevenue = estimatedYieldKg * Number(agriSellingPrice);
    const netProfit = grossRevenue - totalCost;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
    const bcRatio = totalCost > 0 ? grossRevenue / totalCost : 0;
    const bepProductionKg = Number(agriSellingPrice) > 0 ? totalCost / Number(agriSellingPrice) : 0;
    const bepPricePerKg = estimatedYieldKg > 0 ? totalCost / estimatedYieldKg : 0;

    // Tanggal Estimasi Panen
    const harvestDate = addDaysToDate(agriStartDate, preset.durationDays);

    return {
      preset,
      spacingObj,
      areaInHa,
      areaInM2,
      seedNeeded,
      totalSeedCost,
      ureaNeededKg,
      npkNeededKg,
      organikNeededKg,
      ureaCost,
      npkCost,
      organikCost,
      totalFertilizerCost,
      fertilizerPhaseDetails,
      totalLaborCost,
      totalCost,
      estimatedYieldTon,
      estimatedYieldKg,
      grossRevenue,
      netProfit,
      roi,
      bcRatio,
      bepProductionKg,
      bepPricePerKg,
      harvestDate
    };
  }, [
    agriCommodity,
    landAreaValue,
    landAreaUnit,
    agriStartDate,
    spacingId,
    agriSeedPrice,
    ureaPrice,
    npkPrice,
    organikPrice,
    agriLaborCostPerHa,
    agriSellingPrice,
    customYieldTonPerHa
  ]);

  // ==========================================
  // KALKULASI OTOMATIS PERIKANAN
  // ==========================================
  const fishCalculation = useMemo(() => {
    const preset = FISH_PRESETS[fishCommodity];

    // Hitung luas m2 dan total benih berdasarkan mode input
    let areaM2 = pondAreaUnit === 'ha' ? Number(pondAreaValue) * 10000 : Number(pondAreaValue);
    areaM2 = Math.max(1, areaM2);

    let totalSeeds = 0;
    let effectiveDensity = Number(densityPerM2);

    if (fishInputMode === 'area') {
      totalSeeds = Math.round(areaM2 * effectiveDensity);
    } else {
      totalSeeds = Math.max(100, Number(directSeedCount));
      effectiveDensity = Math.max(1, Number(densityPerM2));
      areaM2 = totalSeeds / effectiveDensity;
    }

    // 1. Panen Hidup (ekor) berdasarkan Survival Rate (SR%)
    const validSr = Math.min(100, Math.max(1, Number(srPct)));
    const harvestedFishCount = Math.round(totalSeeds * (validSr / 100));

    // 2. Total Biomassa Panen (kg & ton) berdasarkan target size (ekor/kg)
    const validTargetSize = Math.max(0.5, Number(targetSizePerKg));
    const totalBiomassKg = harvestedFishCount / validTargetSize;
    const totalBiomassTon = totalBiomassKg / 1000;
    const avgWeightGram = 1000 / validTargetSize;

    // 3. Kebutuhan Pakan (kg & sak @30kg) berdasarkan FCR
    const validFcr = Math.max(0.5, Number(fcr));
    const totalFeedKg = totalBiomassKg * validFcr;
    const totalFeedSacks = totalFeedKg / 30; // Rata-rata 1 sak pakan = 30 kg

    // Pembagian pakan per fase (Starter 15%, Grower 45%, Finisher 40%)
    const feedStarterKg = totalFeedKg * 0.15;
    const feedGrowerKg = totalFeedKg * 0.45;
    const feedFinisherKg = totalFeedKg * 0.40;

    // 4. Rincian Biaya Modal
    const totalSeedCost = totalSeeds * Number(fishSeedPrice);
    const totalFeedCost = totalFeedKg * Number(feedPricePerKg);
    const totalOpsCost = Number(fishOpsCost);
    const totalCost = totalSeedCost + totalFeedCost + totalOpsCost;

    // 5. Analisis Finansial
    const grossRevenue = totalBiomassKg * Number(fishSellingPrice);
    const netProfit = grossRevenue - totalCost;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
    const bcRatio = totalCost > 0 ? grossRevenue / totalCost : 0;
    const bepProductionKg = Number(fishSellingPrice) > 0 ? totalCost / Number(fishSellingPrice) : 0;
    const bepPricePerKg = totalBiomassKg > 0 ? totalCost / totalBiomassKg : 0;

    // Tanggal Panen
    const harvestDate = addDaysToDate(fishStartDate, preset.durationDays);

    return {
      preset,
      areaM2,
      totalSeeds,
      effectiveDensity,
      harvestedFishCount,
      totalBiomassKg,
      totalBiomassTon,
      avgWeightGram,
      totalFeedKg,
      totalFeedSacks,
      feedStarterKg,
      feedGrowerKg,
      feedFinisherKg,
      totalSeedCost,
      totalFeedCost,
      totalOpsCost,
      totalCost,
      grossRevenue,
      netProfit,
      roi,
      bcRatio,
      bepProductionKg,
      bepPricePerKg,
      harvestDate
    };
  }, [
    fishCommodity,
    fishInputMode,
    pondAreaValue,
    pondAreaUnit,
    directSeedCount,
    densityPerM2,
    fishStartDate,
    srPct,
    fcr,
    targetSizePerKg,
    fishSeedPrice,
    feedPricePerKg,
    fishOpsCost,
    fishSellingPrice
  ]);

  // Data Grafik Proporsi Biaya saat ini
  const currentCostPieData = useMemo(() => {
    if (sector === 'agri') {
      return [
        { name: 'Benih / Bibit', value: Math.round(agriCalculation.totalSeedCost) },
        { name: 'Pupuk (Urea, NPK, Organik)', value: Math.round(agriCalculation.totalFertilizerCost) },
        { name: 'Tenaga Kerja & Operasional', value: Math.round(agriCalculation.totalLaborCost) }
      ];
    } else {
      return [
        { name: 'Benih / Benur Ikan', value: Math.round(fishCalculation.totalSeedCost) },
        { name: 'Pakan Pelet Total', value: Math.round(fishCalculation.totalFeedCost) },
        { name: 'Probiotik, Listrik & Ops', value: Math.round(fishCalculation.totalOpsCost) }
      ];
    }
  }, [sector, agriCalculation, fishCalculation]);

  // Data Grafik Perbandingan Modal vs Pendapatan vs Laba
  const currentFinancialBarData = useMemo(() => {
    const calc = sector === 'agri' ? agriCalculation : fishCalculation;
    return [
      {
        name: 'Modal (HPP)',
        nilai: Math.round(calc.totalCost),
        fill: '#f59e0b'
      },
      {
        name: 'Pendapatan Kotor',
        nilai: Math.round(calc.grossRevenue),
        fill: '#0ea5e9'
      },
      {
        name: 'Laba Bersih',
        nilai: Math.max(0, Math.round(calc.netProfit)),
        fill: '#10b981'
      }
    ];
  }, [sector, agriCalculation, fishCalculation]);

  // Simpan Simulasi ke Daftar Perbandingan
  const handleSaveCurrentSimulation = () => {
    if (sector === 'agri') {
      const newSim = {
        id: `sim-${Date.now()}`,
        title: `${agriCalculation.preset.name.split('(')[0].trim()} (${formatNumber(agriCalculation.areaInHa, 2)} Ha)`,
        sector: 'Pertanian',
        icon: agriCalculation.preset.icon,
        duration: `${agriCalculation.preset.durationDays} Hari`,
        totalCost: agriCalculation.totalCost,
        grossRevenue: agriCalculation.grossRevenue,
        netProfit: agriCalculation.netProfit,
        roi: agriCalculation.roi,
        bcRatio: agriCalculation.bcRatio
      };
      setSavedSimulations((prev) => [newSim, ...prev]);
      showToast('Simulasi Pertanian berhasil disimpan ke Daftar Perbandingan!');
    } else {
      const newSim = {
        id: `sim-${Date.now()}`,
        title: `${fishCalculation.preset.name.split('(')[0].trim()} (${formatNumber(fishCalculation.areaM2, 0)} m²)`,
        sector: 'Perikanan',
        icon: fishCalculation.preset.icon,
        duration: `${fishCalculation.preset.durationDays} Hari`,
        totalCost: fishCalculation.totalCost,
        grossRevenue: fishCalculation.grossRevenue,
        netProfit: fishCalculation.netProfit,
        roi: fishCalculation.roi,
        bcRatio: fishCalculation.bcRatio
      };
      setSavedSimulations((prev) => [newSim, ...prev]);
      showToast('Simulasi Perikanan berhasil disimpan ke Daftar Perbandingan!');
    }
  };

  const activeCalc = sector === 'agri' ? agriCalculation : fishCalculation;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-600 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* HEADER UTAMA */}
      <header className="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-800 text-white shadow-lg sticky top-0 z-40 print:static print:bg-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Logo & Judul */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-inner">
                {sector === 'agri' ? (
                  <Sprout className="w-7 h-7 text-emerald-300" />
                ) : (
                  <Fish className="w-7 h-7 text-cyan-300" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    SmartTani & Tambak
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                    AgriFish Pro ID
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100/90">
                  Kalkulator Estimasi Biaya, Benih, Pupuk/Pakan, Jadwal Panen & Analisis ROI
                </p>
              </div>
            </div>

            {/* Switcher Kategori Utama (Pertanian vs Perikanan) */}
            <div className="flex flex-wrap items-center gap-2 print:hidden">
              <div className="bg-black/25 p-1 rounded-xl flex items-center border border-white/15">
                <button
                  onClick={() => setSector('agri')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    sector === 'agri'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-emerald-100 hover:bg-white/10'
                  }`}
                >
                  <Sprout className="w-4 h-4" />
                  <span>Pertanian (Padi/Jagung/Tebu)</span>
                </button>
                <button
                  onClick={() => setSector('fish')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    sector === 'fish'
                      ? 'bg-cyan-500 text-white shadow-md'
                      : 'text-cyan-100 hover:bg-white/10'
                  }`}
                >
                  <Fish className="w-4 h-4" />
                  <span>Perikanan (Lele/Bandeng/Nila/Udang)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sub-Navigation Bar */}
          <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 print:hidden">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'calculator'
                    ? 'bg-white text-emerald-900 shadow-sm'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>Kalkulator & Analisis Usaha</span>
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'timeline'
                    ? 'bg-white text-emerald-900 shadow-sm'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Jadwal Pemeliharaan & Panen</span>
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition ${
                  activeTab === 'comparison'
                    ? 'bg-white text-emerald-900 shadow-sm'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Bandingkan Komoditas ({savedSimulations.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveCurrentSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/30 hover:bg-emerald-500/50 text-white border border-emerald-300/30 transition"
                title="Simpan hasil perhitungan ini untuk dibandingkan"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>Simpan Simulasi</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition"
                title="Cetak laporan analisis usaha"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Cetak Laporan</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* PILIHAN KOMODITAS CEPAT (COMMODITY SELECTOR BAR) */}
      <section className="bg-white border-b border-slate-200 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 shrink-0">
              Pilih Komoditas:
            </span>
            {sector === 'agri'
              ? Object.values(AGRI_PRESETS).map((item) => {
                  const isSelected = agriCommodity === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectAgriCommodity(item.id)}
                      className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border text-left transition-all shrink-0 ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="text-sm font-bold leading-tight">{item.name}</div>
                        <div className="text-[11px] text-slate-500">
                          Panen ±{item.durationDays} HST • Est. {item.yieldTonPerHa} Ton/Ha
                        </div>
                      </div>
                    </button>
                  );
                })
              : Object.values(FISH_PRESETS).map((item) => {
                  const isSelected = fishCommodity === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectFishCommodity(item.id)}
                      className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border text-left transition-all shrink-0 ${
                        isSelected
                          ? 'bg-cyan-50 border-cyan-500 text-cyan-950 ring-2 ring-cyan-500/20 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="text-sm font-bold leading-tight">{item.name}</div>
                        <div className="text-[11px] text-slate-500">
                          Siklus ±{item.durationDays} Hari • FCR {item.fcr} • SR {item.survivalRatePct}%
                        </div>
                      </div>
                    </button>
                  );
                })}
          </div>
        </div>
      </section>

      {/* KONTEN UTAMA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {/* ========================================================= */}
        {/* TAB 1: KALKULATOR & ANALISIS USAHA                        */}
        {/* ========================================================= */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* PANEL KIRI: PARAMETER INPUT (5 KOLOM) */}
            <div className="lg:col-span-5 bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden print:hidden">
              <div
                className={`px-5 py-4 border-b flex items-center justify-between ${
                  sector === 'agri'
                    ? 'bg-emerald-50/70 border-emerald-100'
                    : 'bg-cyan-50/70 border-cyan-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{activeCalc.preset.icon}</span>
                  <div>
                    <h2 className="font-bold text-slate-800 text-base">
                      Parameter Input {sector === 'agri' ? 'Pertanian' : 'Budidaya Perikanan'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Sesuaikan angka di bawah dengan kondisi lahan/kolam Anda
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    sector === 'agri'
                      ? handleSelectAgriCommodity(agriCommodity)
                      : handleSelectFishCommodity(fishCommodity)
                  }
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
                  title="Kembalikan ke angka standar nasional"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Standar</span>
                </button>
              </div>

              {/* FORM INPUT PERTANIAN */}
              {sector === 'agri' ? (
                <div className="p-5 space-y-5">
                  {/* 1. Luas Lahan & Tanggal Tanam */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" /> 1. Lahan & Waktu Tanam
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Luas Lahan
                        </label>
                        <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500">
                          <input
                            type="number"
                            min="0.01"
                            step="0.1"
                            value={landAreaValue}
                            onChange={(e) => setLandAreaValue(e.target.value)}
                            className="w-full px-3 py-2 text-sm font-semibold text-slate-800 outline-none"
                          />
                          <select
                            value={landAreaUnit}
                            onChange={(e) => {
                              const newUnit = e.target.value;
                              if (newUnit === 'm2' && landAreaUnit === 'ha') {
                                setLandAreaValue(Number(landAreaValue) * 10000);
                              } else if (newUnit === 'ha' && landAreaUnit === 'm2') {
                                setLandAreaValue(Number(landAreaValue) / 10000);
                              }
                              setLandAreaUnit(newUnit);
                            }}
                            className="bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 border-l border-slate-300 outline-none"
                          >
                            <option value="ha">Hektar (Ha)</option>
                            <option value="m2">m²</option>
                          </select>
                        </div>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          Setara {formatNumber(agriCalculation.areaInM2)} m² (
                          {formatNumber(agriCalculation.areaInHa, 2)} Ha)
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Tanggal Mulai Tanam (0 HST)
                        </label>
                        <input
                          type="date"
                          value={agriStartDate}
                          onChange={(e) => setAgriStartDate(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                        <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">
                          Est. Panen: {agriCalculation.harvestDate}
                        </span>
                      </div>
                    </div>

                    {/* Sistem Jarak Tanam */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Sistem & Jarak Tanam
                      </label>
                      <select
                        value={spacingId}
                        onChange={(e) => setSpacingId(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-medium text-slate-800 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        {agriCalculation.preset.spacingOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 2. Harga Benih & Pupuk */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                      <Package className="w-4 h-4" /> 2. Harga Benih & Pupuk
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Harga Benih (Rp / {agriCalculation.preset.seedUnit})
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="500"
                          value={agriSeedPrice}
                          onChange={(e) => setAgriSeedPrice(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Harga Pupuk Urea (Rp/kg)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={ureaPrice}
                          onChange={(e) => setUreaPrice(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Harga Pupuk NPK (Rp/kg)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={npkPrice}
                          onChange={(e) => setNpkPrice(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Harga Pupuk Organik (Rp/kg)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={organikPrice}
                          onChange={(e) => setOrganikPrice(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Biaya Operasional & Target Panen */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" /> 3. Operasional & Harga Jual Panen
                    </h3>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Biaya Tenaga Kerja, Traktor, Pestisida & Panen (Rp / Ha)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="250000"
                        value={agriLaborCostPerHa}
                        onChange={(e) => setAgriLaborCostPerHa(e.target.value)}
                        className="w-full px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        Otomatis dikalikan proporsional luas lahan Anda
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Potensi Produktivitas Dasar (Ton/Ha)
                        </label>
                        <input
                          type="number"
                          min="0.5"
                          step="0.2"
                          value={customYieldTonPerHa}
                          onChange={(e) => setCustomYieldTonPerHa(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Estimasi Harga Jual Panen (Rp/kg)
                        </label>
                        <input
                          type="number"
                          min="100"
                          step="100"
                          value={agriSellingPrice}
                          onChange={(e) => setAgriSellingPrice(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-semibold text-emerald-800 bg-emerald-50/50 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* FORM INPUT PERIKANAN */
                <div className="p-5 space-y-5">
                  {/* 1. Luas Kolam / Jumlah Tebar */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-700 flex items-center gap-1.5">
                        <Droplets className="w-4 h-4" /> 1. Kolam & Padat Tebar
                      </h3>
                      <div className="bg-slate-100 p-0.5 rounded-lg flex text-[11px] font-semibold">
                        <button
                          type="button"
                          onClick={() => setFishInputMode('area')}
                          className={`px-2 py-1 rounded-md transition ${
                            fishInputMode === 'area'
                              ? 'bg-white text-cyan-800 shadow-2xs'
                              : 'text-slate-500'
                          }`}
                        >
                          Basis Luas Kolam
                        </button>
                        <button
                          type="button"
                          onClick={() => setFishInputMode('seedCount')}
                          className={`px-2 py-1 rounded-md transition ${
                            fishInputMode === 'seedCount'
                              ? 'bg-white text-cyan-800 shadow-2xs'
                              : 'text-slate-500'
                          }`}
                        >
                          Basis Jumlah Ekor
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {fishInputMode === 'area' ? (
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Luas Kolam / Tambak
                          </label>
                          <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500">
                            <input
                              type="number"
                              min="1"
                              step="10"
                              value={pondAreaValue}
                              onChange={(e) => setPondAreaValue(e.target.value)}
                              className="w-full px-3 py-2 text-sm font-semibold text-slate-800 outline-none"
                            />
                            <select
                              value={pondAreaUnit}
                              onChange={(e) => {
                                const newUnit = e.target.value;
                                if (newUnit === 'ha' && pondAreaUnit === 'm2') {
                                  setPondAreaValue(Number(pondAreaValue) / 10000);
                                } else if (newUnit === 'm2' && pondAreaUnit === 'ha') {
                                  setPondAreaValue(Number(pondAreaValue) * 10000);
                                }
                                setPondAreaUnit(newUnit);
                              }}
                              className="bg-slate-100 px-2.5 py-2 text-xs font-bold text-slate-700 border-l border-slate-300 outline-none"
                            >
                              <option value="m2">m²</option>
                              <option value="ha">Ha</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Target Jumlah Tebar (Ekor)
                          </label>
                          <input
                            type="number"
                            min="100"
                            step="500"
                            value={directSeedCount}
                            onChange={(e) => setDirectSeedCount(e.target.value)}
                            className="w-full px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Padat Tebar (Ekor / m²)
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={densityPerM2}
                          onChange={(e) => setDensityPerM2(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          Rekomendasi: {fishCalculation.preset.recommendedDensityRange}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Tanggal Tebar Benih
                        </label>
                        <input
                          type="date"
                          value={fishStartDate}
                          onChange={(e) => setFishStartDate(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                      <div className="bg-cyan-50/70 rounded-xl p-2.5 border border-cyan-100 flex flex-col justify-center">
                        <span className="text-[11px] text-cyan-800 font-semibold">
                          Estimasi Tanggal Panen ({fishCalculation.preset.durationDays} Hari):
                        </span>
                        <span className="text-sm font-extrabold text-cyan-950">
                          {fishCalculation.harvestDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Parameter Biologis (SR%, FCR, Size Panen) */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-700 flex items-center gap-1.5">
                      <Scale className="w-4 h-4" /> 2. Parameter Teknis (SR, FCR & Size Panen)
                    </h3>
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          SR / Hidup (%)
                        </label>
                        <input
                          type="number"
                          min="10"
                          max="100"
                          step="1"
                          value={srPct}
                          onChange={(e) => setSrPct(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Rasio Pakan (FCR)
                        </label>
                        <input
                          type="number"
                          min="0.6"
                          max="3.0"
                          step="0.05"
                          value={fcr}
                          onChange={(e) => setFcr(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Size (Ekor/Kg)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="200"
                          step="1"
                          value={targetSizePerKg}
                          onChange={(e) => setTargetSizePerKg(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                      Target Size <strong>{targetSizePerKg} ekor/kg</strong> setara bobot rata-rata{' '}
                      <strong>{formatNumber(fishCalculation.avgWeightGram, 1)} gram/ekor</strong> saat panen.
                    </p>
                  </div>

                  {/* 3. Harga Benih, Pakan, Operasional & Harga Jual */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-700 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" /> 3. Biaya Benih, Pakan & Harga Jual
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Harga Benih (Rp / ekor)
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="10"
                          value={fishSeedPrice}
                          onChange={(e) => setFishSeedPrice(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Harga Pakan Pelet (Rp / kg)
                        </label>
                        <input
                          type="number"
                          min="1000"
                          step="200"
                          value={feedPricePerKg}
                          onChange={(e) => setFeedPricePerKg(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Biaya Obat, Probiotik & Listrik (Rp)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="100000"
                          value={fishOpsCost}
                          onChange={(e) => setFishOpsCost(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-semibold text-slate-800 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Harga Jual Panen (Rp / kg)
                        </label>
                        <input
                          type="number"
                          min="1000"
                          step="500"
                          value={fishSellingPrice}
                          onChange={(e) => setFishSellingPrice(e.target.value)}
                          className="w-full px-3 py-2 text-sm font-semibold text-cyan-900 bg-cyan-50/50 rounded-xl border border-cyan-300 focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PANEL KANAN: HASIL OUTPUT OTOMATIS & ANALISIS USAHA (7 KOLOM) */}
            <div className="lg:col-span-7 space-y-6">
              {/* 4 KARTU KPI RINGKASAN EKSEKUTIF */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
                {/* KPI 1: Total Modal */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                    <span>Total Biaya Modal</span>
                    <DollarSign className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-lg font-extrabold text-slate-800 mt-1.5">
                    {formatRupiah(activeCalc.totalCost)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Siklus {activeCalc.preset.durationDays} Hari
                  </div>
                </div>

                {/* KPI 2: Estimasi Hasil Panen */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                    <span>Estimasi Panen</span>
                    <Scale className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-lg font-extrabold text-slate-800 mt-1.5">
                    {sector === 'agri'
                      ? `${formatNumber(agriCalculation.estimatedYieldTon, 2)} Ton`
                      : `${formatNumber(fishCalculation.totalBiomassKg, 0)} Kg`}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {sector === 'agri'
                      ? `(${formatNumber(agriCalculation.estimatedYieldKg, 0)} Kg)`
                      : `(${formatNumber(fishCalculation.totalBiomassTon, 2)} Ton / ${formatNumber(fishCalculation.harvestedFishCount, 0)} ekor)`}
                  </div>
                </div>

                {/* KPI 3: Pendapatan Kotor */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
                    <span>Pendapatan Kotor</span>
                    <TrendingUp className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="text-lg font-extrabold text-cyan-800 mt-1.5">
                    {formatRupiah(activeCalc.grossRevenue)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Panen: {activeCalc.harvestDate}
                  </div>
                </div>

                {/* KPI 4: Keuntungan Bersih & ROI */}
                <div
                  className={`p-4 rounded-2xl border shadow-2xs ${
                    activeCalc.netProfit >= 0
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-rose-600 text-white border-rose-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold uppercase text-white/80">
                    <span>Laba Bersih</span>
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-lg font-extrabold mt-1.5">
                    {formatRupiah(activeCalc.netProfit)}
                  </div>
                  <div className="text-[11px] font-semibold text-white/90 mt-1 flex items-center gap-2">
                    <span>ROI: {formatNumber(activeCalc.roi, 1)}%</span>
                    <span>•</span>
                    <span>R/C: {formatNumber(activeCalc.bcRatio, 2)}</span>
                  </div>
                </div>
              </div>

              {/* RINCIAN KEBUTUHAN SAPRODI (BENIH & PUPUK / PAKAN) */}
              {sector === 'agri' ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      <Sprout className="w-4 h-4 text-emerald-600" />
                      Kebutuhan Benih & Rekomendasi Dosis Pupuk ({formatNumber(agriCalculation.areaInHa, 2)} Ha)
                    </h3>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {agriCalculation.spacingObj.label.split('-')[0]}
                    </span>
                  </div>

                  <div className="p-5 space-y-5">
                    {/* Ringkasan Kuantitas Benih & Pupuk */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                        <span className="text-[11px] font-semibold text-emerald-800 block">
                          Kebutuhan Benih/Bibit
                        </span>
                        <span className="text-base font-extrabold text-emerald-950">
                          {formatNumber(agriCalculation.seedNeeded, 1)} {agriCalculation.preset.seedUnit}
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {formatRupiah(agriCalculation.totalSeedCost)}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-200">
                        <span className="text-[11px] font-semibold text-sky-800 block">
                          Pupuk Urea (N)
                        </span>
                        <span className="text-base font-extrabold text-sky-950">
                          {formatNumber(agriCalculation.ureaNeededKg, 0)} Kg
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {formatNumber(agriCalculation.ureaNeededKg / 50, 1)} Sak (@50kg)
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                        <span className="text-[11px] font-semibold text-amber-800 block">
                          Pupuk NPK Phonska
                        </span>
                        <span className="text-base font-extrabold text-amber-950">
                          {formatNumber(agriCalculation.npkNeededKg, 0)} Kg
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {formatNumber(agriCalculation.npkNeededKg / 50, 1)} Sak (@50kg)
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-stone-100 border border-stone-200">
                        <span className="text-[11px] font-semibold text-stone-700 block">
                          Pupuk Organik / Kompos
                        </span>
                        <span className="text-base font-extrabold text-stone-900">
                          {formatNumber(agriCalculation.organikNeededKg, 0)} Kg
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {formatNumber(agriCalculation.organikNeededKg / 40, 1)} Sak (@40kg)
                        </span>
                      </div>
                    </div>

                    {/* Tabel Dosis Pupuk Per Fase Pemupukan */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                        Tabel Pembagian Dosis Pupuk Per Fase Pertumbuhan
                      </h4>
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                              <th className="py-2.5 px-3">Fase Aplikasi (HST)</th>
                              <th className="py-2.5 px-3 text-right">Urea (Kg)</th>
                              <th className="py-2.5 px-3 text-right">NPK (Kg)</th>
                              <th className="py-2.5 px-3 text-right">Organik (Kg)</th>
                              <th className="py-2.5 px-3">Catatan Teknis Lapangan</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {agriCalculation.fertilizerPhaseDetails.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="py-2.5 px-3 font-bold text-slate-800">{row.phase}</td>
                                <td className="py-2.5 px-3 text-right font-semibold text-sky-700">
                                  {formatNumber(row.ureaKg, 1)} kg
                                </td>
                                <td className="py-2.5 px-3 text-right font-semibold text-amber-700">
                                  {formatNumber(row.npkKg, 1)} kg
                                </td>
                                <td className="py-2.5 px-3 text-right font-semibold text-stone-700">
                                  {formatNumber(row.organikKg, 1)} kg
                                </td>
                                <td className="py-2.5 px-3 text-slate-600">{row.note}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* RINCIAN TEKNIS PERIKANAN */
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                      <Fish className="w-4 h-4 text-cyan-600" />
                      Kebutuhan Benih, Biomassa & Alokasi Pakan ({formatNumber(fishCalculation.areaM2, 0)} m²)
                    </h3>
                    <span className="text-xs font-semibold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                      Padat Tebar: {formatNumber(fishCalculation.effectiveDensity, 0)} ekor/m²
                    </span>
                  </div>

                  <div className="p-5 space-y-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-200">
                        <span className="text-[11px] font-semibold text-cyan-800 block">
                          Total Tebar Benih
                        </span>
                        <span className="text-base font-extrabold text-cyan-950">
                          {formatNumber(fishCalculation.totalSeeds, 0)} Ekor
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          {fishCalculation.preset.seedSizeLabel}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                        <span className="text-[11px] font-semibold text-emerald-800 block">
                          Estimasi Panen Hidup
                        </span>
                        <span className="text-base font-extrabold text-emerald-950">
                          {formatNumber(fishCalculation.harvestedFishCount, 0)} Ekor
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Survival Rate (SR): {srPct}%
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                        <span className="text-[11px] font-semibold text-amber-800 block">
                          Total Kebutuhan Pakan
                        </span>
                        <span className="text-base font-extrabold text-amber-950">
                          {formatNumber(fishCalculation.totalFeedKg, 0)} Kg
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          ≈ {formatNumber(fishCalculation.totalFeedSacks, 1)} Sak (@30kg) • FCR {fcr}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200">
                        <span className="text-[11px] font-semibold text-purple-800 block">
                          Total Biomassa Panen
                        </span>
                        <span className="text-base font-extrabold text-purple-950">
                          {formatNumber(fishCalculation.totalBiomassKg, 1)} Kg
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Size {targetSizePerKg} ekor/kg
                        </span>
                      </div>
                    </div>

                    {/* Alokasi Pakan Starter - Grower - Finisher */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Rekomendasi Alokasi Pakan Selama Siklus Budidaya
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="font-bold text-slate-700">1. Pakan Starter (15%)</div>
                          <div className="text-sm font-extrabold text-slate-900 mt-1">
                            {formatNumber(fishCalculation.feedStarterKg, 1)} Kg ({formatNumber(fishCalculation.feedStarterKg / 30, 1)} Sak)
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Butiran halus / crumble awal tebar (Bulan ke-1)
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="font-bold text-slate-700">2. Pakan Grower (45%)</div>
                          <div className="text-sm font-extrabold text-slate-900 mt-1">
                            {formatNumber(fishCalculation.feedGrowerKg, 1)} Kg ({formatNumber(fishCalculation.feedGrowerKg / 30, 1)} Sak)
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Pelet ukuran sedang pemacu pertumbuhan
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="font-bold text-slate-700">3. Pakan Finisher (40%)</div>
                          <div className="text-sm font-extrabold text-slate-900 mt-1">
                            {formatNumber(fishCalculation.feedFinisherKg, 1)} Kg ({formatNumber(fishCalculation.feedFinisherKg / 30, 1)} Sak)
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Pelet pembesaran akhir menjelang panen raya
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RINCIAN FINANSIAL, BEP & GRAFIK VISUALISASI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tabel Rincian Finansial & BEP */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      Laporan Analisis Finansial & Titik Impas (BEP)
                    </h3>

                    <div className="mt-3 space-y-2.5 text-xs">
                      {sector === 'agri' ? (
                        <>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-600">
                              Biaya Benih ({formatNumber(agriCalculation.seedNeeded, 1)} {agriCalculation.preset.seedUnit})
                            </span>
                            <span className="font-semibold text-slate-800">
                              {formatRupiah(agriCalculation.totalSeedCost)}
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-600">Biaya Pupuk Urea + NPK + Organik</span>
                            <span className="font-semibold text-slate-800">
                              {formatRupiah(agriCalculation.totalFertilizerCost)}
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-600">Biaya Tenaga Kerja, Olah Tanah & Panen</span>
                            <span className="font-semibold text-slate-800">
                              {formatRupiah(agriCalculation.totalLaborCost)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-600">
                              Biaya Benih ({formatNumber(fishCalculation.totalSeeds, 0)} ekor)
                            </span>
                            <span className="font-semibold text-slate-800">
                              {formatRupiah(fishCalculation.totalSeedCost)}
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-600">
                              Biaya Pakan ({formatNumber(fishCalculation.totalFeedKg, 0)} kg)
                            </span>
                            <span className="font-semibold text-slate-800">
                              {formatRupiah(fishCalculation.totalFeedCost)}
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-600">Biaya Obat, Probiotik, Air & Listrik</span>
                            <span className="font-semibold text-slate-800">
                              {formatRupiah(fishCalculation.totalOpsCost)}
                            </span>
                          </div>
                        </>
                      )}

                      <div className="flex justify-between py-1.5 bg-amber-50/70 px-2.5 rounded-lg font-bold text-amber-950">
                        <span>Total Biaya Modal (HPP)</span>
                        <span>{formatRupiah(activeCalc.totalCost)}</span>
                      </div>

                      <div className="flex justify-between py-1.5 bg-cyan-50/70 px-2.5 rounded-lg font-bold text-cyan-950">
                        <span>Estimasi Pendapatan Kotor</span>
                        <span>{formatRupiah(activeCalc.grossRevenue)}</span>
                      </div>

                      <div className="flex justify-between py-2 bg-emerald-100/80 px-2.5 rounded-lg font-extrabold text-emerald-950 text-sm">
                        <span>Estimasi Keuntungan Bersih</span>
                        <span>{formatRupiah(activeCalc.netProfit)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Indikator Kelayakan Usaha (BEP & B/C Ratio) */}
                  <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] text-slate-500 block">BEP Harga (HPP / Kg)</span>
                      <span className="font-extrabold text-slate-800 text-sm">
                        {formatRupiah(activeCalc.bepPricePerKg)} / kg
                      </span>
                      <span className="text-[10px] text-emerald-600 block">
                        Aman jika jual &gt; BEP Harga
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] text-slate-500 block">BEP Produksi (Titik Impas)</span>
                      <span className="font-extrabold text-slate-800 text-sm">
                        {formatNumber(activeCalc.bepProductionKg, 0)} Kg
                      </span>
                      <span className="text-[10px] text-emerald-600 block">
                        R/C Ratio: {formatNumber(activeCalc.bcRatio, 2)}{' '}
                        {activeCalc.bcRatio >= 1.2 ? '(Sangat Layak)' : activeCalc.bcRatio >= 1 ? '(Impas)' : '(Rugi)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grafik Visualisasi Proporsi Biaya & Profitabilitas */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
                      <PieChartIcon className="w-4 h-4 text-cyan-600" />
                      Proporsi Komponen Biaya Modal
                    </h3>
                    <div className="h-44 w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={currentCostPieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={38}
                            outerRadius={65}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {currentCostPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip formatter={(value) => formatRupiah(value)} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-600 mb-2">
                      Perbandingan Modal vs Pendapatan vs Laba
                    </h4>
                    <div className="h-36 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={currentFinancialBarData} layout="vertical" margin={{ left: 10, right: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" width={105} tick={{ fontSize: 11 }} />
                          <RechartsTooltip formatter={(value) => formatRupiah(value)} />
                          <Bar dataKey="nilai" radius={[0, 6, 6, 0]} barSize={18} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: TIMELINE & JADWAL PEMELIHARAAN LENGKAP             */}
        {/* ========================================================= */}
        {activeTab === 'timeline' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeCalc.preset.icon}</span>
                  <h2 className="text-lg font-extrabold text-slate-800">
                    Kalender & SOP Jadwal Pemeliharaan: {activeCalc.preset.name}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Jadwal dihitung otomatis berdasarkan tanggal mulai{' '}
                  <strong>
                    {addDaysToDate(sector === 'agri' ? agriStartDate : fishStartDate, 0)}
                  </strong>{' '}
                  hingga estimasi panen{' '}
                  <strong className="text-emerald-700">{activeCalc.harvestDate}</strong> (
                  {activeCalc.preset.durationDays} Hari).
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition"
                >
                  Ubah Tanggal Tanam/Tebar
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="relative border-l-2 border-emerald-500/40 ml-4 sm:ml-6 space-y-6">
                {activeCalc.preset.timeline.map((step, index) => {
                  const baseDate = sector === 'agri' ? agriStartDate : fishStartDate;
                  const stepDate = addDaysToDate(baseDate, step.dayOffset);

                  const badgeColors = {
                    prep: 'bg-amber-100 text-amber-800 border-amber-300',
                    plant: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                    fert: 'bg-sky-100 text-sky-800 border-sky-300',
                    care: 'bg-purple-100 text-purple-800 border-purple-300',
                    harvest: 'bg-rose-100 text-rose-800 border-rose-300'
                  };

                  const categoryLabels = {
                    prep: 'Persiapan Lahan/Kolam',
                    plant: 'Penanaman / Tebar Benih',
                    fert: sector === 'agri' ? 'Aplikasi Pupuk' : 'Manajemen Pakan',
                    care: 'Perawatan & Kontrol',
                    harvest: 'Panen Raya'
                  };

                  return (
                    <div key={index} className="relative pl-6 sm:pl-8">
                      {/* Dot Indicator */}
                      <div
                        className={`absolute -left-[11px] top-1.5 w-5 h-5 rounded-full border-4 border-white shadow-xs ${
                          step.category === 'harvest'
                            ? 'bg-rose-500'
                            : step.category === 'plant'
                            ? 'bg-emerald-600'
                            : 'bg-teal-500'
                        }`}
                      />

                      <div className="bg-slate-50/80 hover:bg-slate-100/70 transition rounded-2xl p-4 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-slate-800 text-white">
                              {step.dayOffset >= 0 ? `${step.dayOffset} HST` : `H${step.dayOffset}`}
                            </span>
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                badgeColors[step.category] || badgeColors.care
                              }`}
                            >
                              {categoryLabels[step.category]}
                            </span>
                            <span className="text-xs font-bold text-teal-800 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {stepDate}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm sm:text-base pt-0.5">
                            {step.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PERBANDINGAN SIMULASI KOMODITAS                    */}
        {/* ========================================================= */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                    Perbandingan Kelayakan Usaha Antar Komoditas
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Bandingkan modal, laba bersih, ROI, dan R/C Ratio dari berbagai simulasi yang Anda simpan.
                  </p>
                </div>
                <button
                  onClick={handleSaveCurrentSimulation}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition self-start"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Tambahkan Simulasi Aktif Saat Ini</span>
                </button>
              </div>

              {savedSimulations.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-sm font-medium">Belum ada simulasi yang disimpan.</p>
                  <p className="text-xs mt-1">
                    Klik tombol &ldquo;Simpan Simulasi&rdquo; di bagian atas untuk membandingkan komoditas.
                  </p>
                </div>
              ) : (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="py-3 px-4">Komoditas & Skala</th>
                        <th className="py-3 px-3">Sektor</th>
                        <th className="py-3 px-3">Durasi Siklus</th>
                        <th className="py-3 px-4 text-right">Total Modal</th>
                        <th className="py-3 px-4 text-right">Pendapatan Kotor</th>
                        <th className="py-3 px-4 text-right">Laba Bersih</th>
                        <th className="py-3 px-3 text-center">ROI (%)</th>
                        <th className="py-3 px-3 text-center">R/C Ratio</th>
                        <th className="py-3 px-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {savedSimulations.map((sim) => (
                        <tr key={sim.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-xl">{sim.icon}</span>
                            <span>{sim.title}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                sim.sector === 'Pertanian'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-cyan-100 text-cyan-800'
                              }`}
                            >
                              {sim.sector}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{sim.duration}</td>
                          <td className="py-3 px-4 text-right font-semibold text-amber-800">
                            {formatRupiah(sim.totalCost)}
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-cyan-800">
                            {formatRupiah(sim.grossRevenue)}
                          </td>
                          <td className="py-3 px-4 text-right font-extrabold text-emerald-700">
                            {formatRupiah(sim.netProfit)}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-slate-800">
                            {formatNumber(sim.roi, 1)}%
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-slate-800">
                            {formatNumber(sim.bcRatio, 2)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() =>
                                setSavedSimulations((prev) => prev.filter((item) => item.id !== sim.id))
                              }
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                              title="Hapus dari daftar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 mt-10 py-5 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>SmartTani & Tambak Nusantara — Kalkulator Agribisnis Terpadu</span>
          </div>
          <div>
            Parameter mengacu pada rata-rata teknis budidaya Pertanian & Perikanan Indonesia (dapat disesuaikan dengan kondisi lokal).
          </div>
        </div>
      </footer>
    </div>
  );
}