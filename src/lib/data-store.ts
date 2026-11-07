// myITS CampusMatch - Centralized Data Store & Matching Engine
// Comprehensive ITS Campus Data: Kepanitiaan, Himpunan, Tim Riset, Laboratorium Teknik Elektro, Kompetisi, dan Beasiswa

export interface OpportunityItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: "COMMITTEE" | "ORGANIZATION" | "RESEARCH" | "LAB" | "COMPETITION" | "SCHOLARSHIP";
  status: "OPEN" | "UPCOMING" | "CLOSED" | "DRAFT";
  organization: {
    name: string;
    type: "HIMA" | "TIM_RISET" | "LAB" | "DITMAWA" | "PANITIA" | "EXTERNAL";
    faculty?: string;
    department?: string;
    logo?: string;
    instagram?: string;
  };
  divisions?: string[];
  googleFormUrl: string; // Tautan Google Form resmi milik penyelenggara
  picContact?: {
    name: string;
    contact: string;
  };
  applicationStart: string;
  applicationEnd: string;
  announcementDate?: string;
  quota?: number;
  minGpa?: number;
  maxGpa?: number;
  minSemester?: number;
  maxSemester?: number;
  allowedMajors?: string[];
  allowedFaculties?: string[];
  requiredSkills: string[];
  requiredDocs: string[];
  benefits: string[];
  tags: string[];
  contactEmail?: string;
  externalLink?: string;
}

export interface ActiveScannedCv {
  candidateName: string;
  fileName: string;
  department?: string;
  faculty?: string;
  gpa?: number | null;
  semester?: number | null;
  skills: string[];
  softSkills: string[];
  achievements: {
    id: string;
    title: string;
    level: string;
    year: string;
    organizer: string;
  }[];
  experiences: {
    id: string;
    title: string;
    organization: string;
    duration: string;
    description: string;
  }[];
  aiSummary: string;
  confidenceScore: number;
  scannedAt: string;
  timestamp: number;
  isFriendCv: boolean;
}

export interface StudentProfileData {
  nim: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  faculty: string;
  department: string;
  major: string;
  degreeLevel: string; // S1 / D4 / S2
  semester: number;
  gpa: number;
  sksCompleted: number;
  academicAdvisor: string;
  focusLab: string;
  entryYear: number;
  academicStatus: string;
  bio: string;
  skills: string[];
  softSkills: string[];
  interests: string[];
  achievements: {
    id: string;
    title: string;
    level: string;
    year: string;
    organizer: string;
  }[];
  experiences: {
    id: string;
    title: string;
    organization: string;
    duration: string;
    description: string;
  }[];
  languages: string[];
  documentsReady: string[];
  cvFileName?: string;
  cvParsedAt?: string;
  cvParsedTimestamp?: number; // Waktu pemindaian CV dalam epoch ms (Kadaluarsa otomatis setelah 10 menit)
  cvParsedData?: {
    confidenceScore: number;
    detectedSkills: string[];
    aiSummary: string;
  };
  activeScannedCv?: ActiveScannedCv;
}

export interface PublicationRequest {
  id: string;
  title: string;
  organizationName: string;
  category: "COMMITTEE" | "ORGANIZATION" | "RESEARCH" | "LAB" | "COMPETITION" | "SCHOLARSHIP";
  description: string;
  googleFormUrl: string;
  picName: string;
  picContact: string; // WhatsApp / Email
  divisions?: string[];
  minGpa?: number;
  minSemester?: number;
  maxSemester?: number;
  requiredSkills: string[];
  applicationEnd: string;
  status: "PUBLISHED" | "PENDING";
  submittedAt: string;
}

export interface MatchEvaluation {
  opportunityId: string;
  opportunity: OpportunityItem;
  score: number; // 0 - 100
  status: "ELIGIBLE" | "PARTIAL" | "INELIGIBLE";
  gpaPassed: boolean;
  semesterPassed: boolean;
  majorPassed: boolean;
  facultyPassed: boolean;
  matchedSkills: string[];
  missingSkills: string[];
  matchedDocs: string[];
  missingDocs: string[];
  reasons: string[];
  recommendation: string;
}

export interface DetailedGapItem {
  id: string;
  category: "ACADEMIC" | "SKILL" | "DOCUMENT" | "EXPERIENCE";
  title: string;
  currentStatus: string;
  targetRequirement: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  impact: string;
  actionSteps: string[];
  completed?: boolean;
}

// Comprehensive Opportunities Dataset across ITS
export const INITIAL_OPPORTUNITIES: OpportunityItem[] = [
  // 1. KEPANITIAAN: GERIGI ITS x UKM EXPO 2027
  {
    id: "opp-gerigi-2027",
    title: "Open Recruitment Panitia GERIGI ITS x UKM Expo 2027",
    slug: "panitia-gerigi-its-ukm-expo-2027",
    description:
      "Generasi Integralistik (GERIGI) ITS 2027 berkolaborasi dengan UKM Expo adalah orientasi akbar penyambutan mahasiswa baru terbesar di ITS. Membuka pendaftaran panitia mahasiswa aktif untuk berbagai divisi strategis.",
    category: "COMMITTEE",
    status: "OPEN",
    organization: {
      name: "BEM ITS & Panitia Pusat GERIGI ITS 2027",
      type: "PANITIA",
      faculty: "Institut",
      instagram: "@gerigiits",
    },
    divisions: [
      "Divisi Acara & Konseptor Lapangan",
      "Divisi LO & Pendamping Maba",
      "Divisi Medfo & Desain Visual",
      "Divisi Logistik & Perlengkapan",
      "Divisi Sponsorship & Kemitraan",
      "Divisi Keamanan (K3)",
      "Divisi Medis & Konsumsi",
      "Divisi Kesekretariatan",
    ],
    googleFormUrl: "https://forms.gle/gerigi-its-2027-oprec",
    picContact: {
      name: "Koordinator Rekrutmen GERIGI",
      contact: "wa.me/6281234567801",
    },
    applicationStart: "2026-11-01",
    applicationEnd: "2026-11-28",
    announcementDate: "2026-12-05",
    quota: 350,
    minGpa: 2.75,
    minSemester: 2,
    maxSemester: 6,
    allowedMajors: [],
    allowedFaculties: [],
    requiredSkills: ["Teamwork", "Leadership", "Communication", "Event Management", "Problem Solving"],
    requiredDocs: ["KTM Aktif ITS", "Transkrip Nilai myITS", "Curriculum Vitae", "Surat Komitmen"],
    benefits: [
      "Sertifikat Kepanitiaan Tingkat Institut Resmi Rektorat ITS",
      "Poin SKP Kemahasiswaan Bidang Manajerial Event (35 Poin)",
      "Jejaring relasi mahasiswa lintas seluruh fakultas di ITS",
      "Atribut & seragam resmi panitia GERIGI ITS 2027",
    ],
    tags: ["kepanitiaan", "gerigi", "maba", "event", "bem its"],
    contactEmail: "gerigi@its.ac.id",
  },

  // 2. KEPANITIAAN: INI LHO ITS! (ILITS 2027)
  {
    id: "opp-ilits-2027",
    title: "Open Recruitment Panitia Ini Lho ITS! 2027",
    slug: "panitia-ini-lho-its-2027",
    description:
      "Ini Lho ITS! (ILITS) adalah perhelatan pengenalan program studi dan sosialisasi kampus ITS terbesar se-Indonesia, mencakup Open Campus, Bedah Jurusan, dan Tryout Nasional SNBT.",
    category: "COMMITTEE",
    status: "OPEN",
    organization: {
      name: "BEM ITS & Tim Promosi ITS",
      type: "PANITIA",
      faculty: "Institut",
      instagram: "@inilhoits",
    },
    divisions: [
      "Divisi Konseptor Event & Roadshow Sekolah",
      "Divisi Public Relations & Campaign Digital",
      "Divisi Tryout Nasional & Akademik SNBT",
      "Divisi Operasional & Kestari",
    ],
    googleFormUrl: "https://forms.gle/inilhoits-2027-oprec",
    picContact: {
      name: "Kestari ILITS 2027",
      contact: "wa.me/6281234567802",
    },
    applicationStart: "2026-11-01",
    applicationEnd: "2026-11-26",
    announcementDate: "2026-12-01",
    quota: 120,
    minGpa: 2.75,
    minSemester: 2,
    maxSemester: 6,
    allowedMajors: [],
    allowedFaculties: [],
    requiredSkills: ["Public Speaking", "Communication", "Social Media", "Teamwork"],
    requiredDocs: ["KTM Aktif ITS", "Transkrip Nilai myITS", "Curriculum Vitae"],
    benefits: [
      "Sertifikat Kepanitiaan Resmi ITS",
      "Poin SKP Kemahasiswaan (20 Poin)",
      "Pengalaman roadshow sosialisasi kampus ke berbagai daerah",
    ],
    tags: ["kepanitiaan", "ilits", "snbt", "sosialisasi", "event"],
    contactEmail: "inilhoits@its.ac.id",
  },

  // 3. HIMPUNAN: HIMATEKTRO ITS (TEKNIK ELEKTRO)
  {
    id: "opp-himatektro-2027",
    title: "Open Recruitment Fungsionaris HIMATEKTRO ITS 2026/2027",
    slug: "fungsionaris-himatektro-its-2026-2027",
    description:
      "Himpunan Mahasiswa Teknik Elektro (HIMATEKTRO) FTEIC ITS membuka open recruitment staff fungsionaris kepengurusan baru. Membina pengembangan keilmuan elektro, robotika, tutorial akademik, pengabdian masyarakat, dan relasi industri.",
    category: "ORGANIZATION",
    status: "OPEN",
    organization: {
      name: "HIMATEKTRO ITS",
      type: "HIMA",
      faculty: "FTEIC",
      department: "Departemen Teknik Elektro",
      instagram: "@himatektro_its",
    },
    divisions: [
      "Departemen Riset dan Teknologi (Ristek)",
      "Departemen Pengembangan Sumber Daya Mahasiswa (PSDM)",
      "Departemen Edukasi & Tutorial Akademik",
      "Departemen Minat & Bakat (Minbak)",
      "Departemen Hubungan Luar & Alumni (Hublu)",
      "Biro Media, Informasi & Kreatif (Medfo)",
      "Biro Kewirausahaan & Dana Mandiri (KWU)",
    ],
    googleFormUrl: "https://forms.gle/himatektro-2027-fungsionaris",
    picContact: {
      name: "Sekretariat HIMATEKTRO",
      contact: "wa.me/6281234567803",
    },
    applicationStart: "2026-11-01",
    applicationEnd: "2026-11-20",
    announcementDate: "2026-11-28",
    quota: 65,
    minGpa: 2.75,
    minSemester: 2,
    maxSemester: 5,
    allowedMajors: ["Departemen Teknik Elektro", "S1 Teknik Elektro", "S1 Teknik Komputer", "S1 Teknik Telekomunikasi"],
    allowedFaculties: ["FTEIC"],
    requiredSkills: ["Teamwork", "Leadership", "Public Speaking", "Problem Solving", "Arduino"],
    requiredDocs: ["KTM Aktif ITS", "Transkrip Nilai myITS", "Curriculum Vitae", "Sertifikat LKMM-TD"],
    benefits: [
      "Sertifikat Fungsionaris Resmi Pengurus HIMATEKTRO ITS",
      "Poin SKP Kemahasiswaan Bidang Organisasi (25 Poin)",
      "Akses prioritas modul riset himpunan dan jejaring alumni elektro",
    ],
    tags: ["himpunan", "himatektro", "teknik elektro", "fteic", "organisasi"],
    contactEmail: "sekretariat@himatektro.its.ac.id",
  },

  // 4. HIMPUNAN: HMTC ITS (INFORMATIKA)
  {
    id: "opp-hmtc-2027",
    title: "Open Recruitment Pengurus HMTC ITS 2026/2027 (Teknik Informatika)",
    slug: "pengurus-hmtc-its-2026-2027",
    description:
      "Himpunan Mahasiswa Teknik Computer & Informatika (HMTC) FTEIC ITS membuka open recruitment staff kepengurusan. Menaungi inkubasi software house, coding club, kompetisi pemrograman CP/CTF, serta advokasi mahasiswa.",
    category: "ORGANIZATION",
    status: "OPEN",
    organization: {
      name: "HMTC ITS",
      type: "HIMA",
      faculty: "FTEIC",
      department: "Departemen Teknik Informatika",
      instagram: "@hmtc_its",
    },
    divisions: [
      "Departemen Ristek & Pengembangan Teknologi (DevLab)",
      "Departemen Competitive Programming",
      "Departemen PSDM & Internal Affairs",
      "Departemen Hubungan Luar & Partnership",
    ],
    googleFormUrl: "https://forms.gle/hmtc-2027-fungsionaris",
    picContact: {
      name: "Departemen PSDM HMTC",
      contact: "wa.me/6281234567804",
    },
    applicationStart: "2026-11-01",
    applicationEnd: "2026-11-24",
    announcementDate: "2026-11-30",
    quota: 40,
    minGpa: 2.75,
    minSemester: 2,
    maxSemester: 6,
    allowedMajors: ["Departemen Teknik Informatika", "S1 Teknik Informatika", "S1 Sistem Informasi"],
    allowedFaculties: ["FTEIC"],
    requiredSkills: ["Programming", "Python", "Web Development", "Git", "Teamwork"],
    requiredDocs: ["KTM Aktif ITS", "Transkrip Nilai myITS", "Curriculum Vitae"],
    benefits: [
      "Sertifikat Fungsionaris HMTC ITS",
      "Poin SKP Kemahasiswaan Bidang Organisasi (20 Poin)",
    ],
    tags: ["himpunan", "hmtc", "informatika", "software", "organisasi"],
    contactEmail: "hmtc@if.its.ac.id",
  },

  // 5. TIM RISET: ANARGYA FORMULA EV ITS
  {
    id: "opp-anargya-2027",
    title: "Open Recruitment Kru Riset Tim Anargya Formula EV ITS",
    slug: "tim-riset-anargya-formula-ev-its",
    description:
      "Anargya ITS adalah tim riset otomotif mahasiswa yang merancang dan memproduksi mobil balap formula listrik (Electric Vehicle) untuk Formula Bharat India dan Formula SAE Japan.",
    category: "RESEARCH",
    status: "OPEN",
    organization: {
      name: "Tim Riset Anargya Formula EV ITS",
      type: "TIM_RISET",
      faculty: "Institut",
      instagram: "@anargya.its",
    },
    divisions: [
      "Divisi Electrical (High Voltage Battery & BMS)",
      "Divisi Powertrain & Motor Controller (Inverter)",
      "Divisi Low Voltage & Telemetry IoT",
      "Divisi Mechanical & Chassis Design",
      "Divisi Aerodynamics & Cooling System",
      "Divisi Sponsorship & Business Plan",
    ],
    googleFormUrl: "https://forms.gle/anargya-formula-ev-2027",
    picContact: {
      name: "Team Manager Anargya",
      contact: "wa.me/6281234567805",
    },
    applicationStart: "2026-10-25",
    applicationEnd: "2026-11-30",
    announcementDate: "2026-12-10",
    quota: 25,
    minGpa: 3.0,
    minSemester: 1,
    maxSemester: 6,
    allowedMajors: ["Departemen Teknik Elektro", "S1 Teknik Elektro", "S1 Teknik Komputer", "S1 Teknik Mesin", "S1 Teknik Material"],
    allowedFaculties: ["FTEIC", "FTIRS"],
    requiredSkills: ["C++", "Python", "Circuit Design", "PCB Design", "Embedded Systems", "CAD / SolidWorks"],
    requiredDocs: ["KTM Aktif ITS", "Transkrip Nilai myITS", "Curriculum Vitae", "Portofolio Proyek"],
    benefits: [
      "Pengalaman hands-on riset mobil balap listrik berstandar internasional SAE",
      "Peluang mewakili ITS & Indonesia pada ajang Formula SAE di luar negeri",
      "Konversi sks magang / Merdeka Belajar Kampus Merdeka (MBKM)",
    ],
    tags: ["tim riset", "anargya", "formula ev", "mobil listrik", "teknik elektro"],
    contactEmail: "anargya@its.ac.id",
  },

  // 6. TIM RISET: BAYUCARAKA AUTONOMOUS ROBOTICS ITS
  {
    id: "opp-bayucaraka-2027",
    title: "Open Recruitment Kru Tim Robotika Bayucaraka ITS",
    slug: "open-recruitment-bayucaraka-its-2027",
    description:
      "Bayucaraka ITS mengembangkan wahana nirawak otonom (UAV & AUV) untuk Kontes Robot Terbang Indonesia (KRTI) dan Singapore Autonomous Underwater Vehicle Challenge (SAUVC).",
    category: "RESEARCH",
    status: "OPEN",
    organization: {
      name: "Tim Robotika Bayucaraka ITS",
      type: "TIM_RISET",
      faculty: "Institut",
      instagram: "@bayucarakaits",
    },
    divisions: [
      "Divisi Flight Control & Autonomous Navigation (ROS/PX4)",
      "Divisi Electronic & Power Distribution",
      "Divisi Airframe & Composite Manufacturing",
      "Divisi Image Processing & Computer Vision",
      "Divisi Non-Teknis & Media",
    ],
    googleFormUrl: "https://forms.gle/bayucaraka-robotics-2027",
    picContact: {
      name: "Manajemen Bayucaraka",
      contact: "wa.me/6281234567806",
    },
    applicationStart: "2026-11-01",
    applicationEnd: "2026-11-25",
    announcementDate: "2026-12-05",
    quota: 30,
    minGpa: 3.0,
    minSemester: 1,
    maxSemester: 5,
    allowedMajors: [],
    allowedFaculties: [],
    requiredSkills: ["C++", "Python", "ROS", "Computer Vision", "Circuit Design", "Teamwork"],
    requiredDocs: ["KTM Aktif ITS", "Transkrip Nilai myITS", "Curriculum Vitae"],
    benefits: [
      "Peluang bertanding di ajang KRTI Nasional dan kejuaraan robotika dunia",
      "Akses lab avionik, simulator autopilot, dan 3D printing",
      "Poin SKP Kemahasiswaan Bidang Penalaran",
    ],
    tags: ["tim riset", "bayucaraka", "drone", "uav", "robotika", "ros"],
    contactEmail: "bayucaraka@its.ac.id",
  },

  // 7. TIM RISET: SAPUANGIN ITS (ECO-MARATHON)
  {
    id: "opp-sapuangin-2027",
    title: "Open Recruitment Kru Tim Sapuangin ITS (Shell Eco-marathon)",
    slug: "tim-sapuangin-its-eco-marathon",
    description:
      "Tim Sapuangin ITS adalah tim legendaris pemegang rekor juara dunia kompetisi mobil hemat energi Shell Eco-marathon (Urban Concept & Prototype Battery Electric).",
    category: "RESEARCH",
    status: "OPEN",
    organization: {
      name: "Tim Sapuangin ITS",
      type: "TIM_RISET",
      faculty: "Institut",
      instagram: "@sapuangin_its",
    },
    divisions: [
      "Divisi Electrical & Telemetry Sensor",
      "Divisi Powertrain & Engine Tuning",
      "Divisi Body & Carbon Fiber Composite",
      "Divisi Steering & Braking System",
      "Divisi Non-Teknis & Sponsorship",
    ],
    googleFormUrl: "https://forms.gle/sapuangin-its-2027",
    picContact: {
      name: "Humas Tim Sapuangin",
      contact: "wa.me/6281234567807",
    },
    applicationStart: "2026-11-05",
    applicationEnd: "2026-12-05",
    announcementDate: "2026-12-15",
    quota: 20,
    minGpa: 3.0,
    minSemester: 2,
    maxSemester: 6,
    allowedMajors: ["Departemen Teknik Elektro", "S1 Teknik Elektro", "S1 Teknik Mesin", "S1 Teknik Fisika"],
    allowedFaculties: ["FTIRS", "FTEIC"],
    requiredSkills: ["C++", "Python", "Data Logging", "Circuit Design", "Teamwork"],
    requiredDocs: ["KTM Aktif ITS", "Transkrip Nilai myITS", "Curriculum Vitae"],
    benefits: [
      "Kompetisi mobil hemat energi tingkat Asia-Pasifik dan Dunia",
      "Pelatihan telemetri data presisi dan komposit serat karbon",
      "Konversi sks kegiatan riset MBKM",
    ],
    tags: ["tim riset", "sapuangin", "hemat energi", "shell eco-marathon"],
    contactEmail: "sapuangin@its.ac.id",
  },

  // 8. TIM RISET: BARUNASTRA ROBOBOAT ITS
  {
    id: "opp-barunastra-2027",
    title: "Open Recruitment Tim Barunastra ITS (Roboboat Tanpa Awak)",
    slug: "tim-barunastra-its-roboboat",
    description:
      "Barunastra ITS adalah tim kapal cepat otonom tanpa awak (Unmanned Surface Vehicle) juara dunia International Roboboat Competition di Florida, Amerika Serikat.",
    category: "RESEARCH",
    status: "OPEN",
    organization: {
      name: "Tim Barunastra Roboboat ITS",
      type: "TIM_RISET",
      faculty: "Institut",
      instagram: "@barunastra_its",
    },
    divisions: [
      "Divisi Electrical & Propulsion Control",
      "Divisi Programming & Autonomous Navigation",
      "Divisi Mechanical & Hull Hydrodynamics",
      "Divisi Sponsorship & International Affairs",
    ],
    googleFormUrl: "https://forms.gle/barunastra-roboboat-2027",
    picContact: {
      name: "PIC Rekrutmen Barunastra",
      contact: "wa.me/6281234567808",
    },
    applicationStart: "2026-10-28",
    applicationEnd: "2026-11-30",
    announcementDate: "2026-12-08",
    quota: 18,
    minGpa: 3.0,
    minSemester: 1,
    maxSemester: 6,
    allowedMajors: [],
    allowedFaculties: [],
    requiredSkills: ["C++", "Python", "ROS", "Arduino", "Computer Vision", "Teamwork"],
    requiredDocs: ["KTM Aktif ITS", "Transkrip Nilai myITS", "Curriculum Vitae"],
    benefits: [
      "Peluang berlaga di International Roboboat Competition di Florida, Amerika Serikat",
      "Pelatihan komprehensif path planning maritim dan sensor fusion LiDAR",
      "Poin SKP Kemahasiswaan & networking internasional",
    ],
    tags: ["tim riset", "barunastra", "roboboat", "kapal otonom", "robotika"],
    contactEmail: "barunastra@its.ac.id",
  },

  // 9. LABORATORIUM TEKNIK ELEKTRO ITS: LAB MIKROELEKTRONIKA & SISTEM TERTANAM
  // Sumber resmi: https://www.its.ac.id/telektro/fasilitas/laboratorium/
  {
    id: "opp-lab-embedded-2027",
    title: "Asisten Riset & Praktikum - Lab Mikroelektronika dan Sistem Tertanam",
    slug: "lab-mikroelektronika-dan-sistem-tertanam-ee-its",
    description:
      "Laboratorium Mikroelektronika dan Sistem Tertanam Departemen Teknik Elektro ITS membuka rekrutmen asisten laboratorium untuk riset autonomous edge AI, desain FPGA, mikrokontroler STM32/ESP32, dan asisten praktikum.",
    category: "LAB",
    status: "OPEN",
    organization: {
      name: "Lab Mikroelektronika dan Sistem Tertanam",
      type: "LAB",
      faculty: "FTEIC",
      department: "Departemen Teknik Elektro",
    },
    divisions: [
      "Sub-Tim FPGA & Hardware Accelerator",
      "Sub-Tim ROS2 Autopilot & Sensor Fusion",
      "Sub-Tim Edge AI Computing & IoT",
      "Divisi Asisten Praktikum Mikroprosesor & Mikrokontroler",
    ],
    googleFormUrl: "https://forms.gle/lab-embedded-ee-its-2027",
    picContact: {
      name: "Koordinator Asisten Lab Mikroelektronika",
      contact: "wa.me/6281234567809",
    },
    applicationStart: "2026-10-25",
    applicationEnd: "2026-12-15",
    announcementDate: "2026-12-22",
    quota: 6,
    minGpa: 3.3,
    minSemester: 4,
    maxSemester: 8,
    allowedMajors: ["Departemen Teknik Elektro", "S1 Teknik Elektro", "S1 Teknik Komputer"],
    allowedFaculties: ["FTEIC"],
    requiredSkills: ["C++", "Python", "ROS", "Embedded Systems", "Machine Learning", "Arduino"],
    requiredDocs: ["KTM Aktif ITS", "Transkrip Nilai myITS", "Curriculum Vitae", "Portofolio Proyek"],
    benefits: [
      "Honorarium bulanan riset & honor asisten praktikum per shift",
      "Peluang co-author publikasi ilmiah terindeks Scopus/IEEE",
      "Akses workstation lab (FPGA Xilinx, Jetson AGX Orin, LiDAR)",
      "Konversi sks tugas akhir / magang riset laboratorium",
    ],
    tags: ["laboratorium", "lab", "teknik elektro", "embedded", "fpga", "mikroelektronika"],
    contactEmail: "lab.embedded@ee.its.ac.id",
  },

  // 10. LABORATORIUM TEKNIK ELEKTRO ITS: LAB KONTROL DAN OTOMASI
  {
    id: "opp-lab-kontrol-2027",
    title: "Asisten Laboratorium - Lab Kontrol dan Otomasi Teknik Elektro ITS",
    slug: "lab-kontrol-dan-otomasi-ee-its",
    description:
      "Laboratorium Kontrol dan Otomasi Departemen Teknik Elektro ITS membuka seleksi asisten untuk proyek otomatisasi industri, sistem kendali adaptif, PLC Siemens/Omron, serta asistensi praktikum Sistem Pengaturan.",
    category: "LAB",
    status: "OPEN",
    organization: {
      name: "Lab Kontrol dan Otomasi",
      type: "LAB",
      faculty: "FTEIC",
      department: "Departemen Teknik Elektro",
    },
    divisions: [
      "Divisi Riset Kontrol Non-Linier & Drone Autopilot",
      "Divisi Otomasi Industri & PLC SCADA",
      "Divisi Asisten Praktikum Sistem Pengaturan",
    ],
    googleFormUrl: "https://forms.gle/lab-kontrol-ee-its-2027",
    picContact: {
      name: "Koordinator Asisten Lab Kontrol",
      contact: "wa.me/6281234567810",
    },
    applicationStart: "2026-11-01",
    applicationEnd: "2026-12-10",
    announcementDate: "2026-12-18",
    quota: 5,
    minGpa: 3.25,
    minSemester: 4,
    maxSemester: 7,
    allowedMajors: ["Departemen Teknik Elektro", "S1 Teknik Elektro"],
    allowedFaculties: ["FTEIC"],
    requiredSkills: ["MATLAB", "Control Systems", "C++", "PLC", "Circuit Design"],
    requiredDocs: ["KTM Aktif ITS", "Transkrip Nilai myITS", "Curriculum Vitae"],
    benefits: [
      "Sertifikat Asisten Laboratorium Resmi Departemen Teknik Elektro ITS",
      "Honor asisten praktikum dan akses instrumen kontrol lab",
      "Bimbingan prioritas untuk topik skripsi/tugas akhir bidang kendali",
    ],
    tags: ["laboratorium", "lab", "teknik elektro", "kontrol", "otomasi", "plc"],
    contactEmail: "lab.kontrol@ee.its.ac.id",
  },

  // 11. LABORATORIUM TEKNIK ELEKTRO ITS: LAB SIMULASI SISTEM TENAGA LISTRIK
  {
    id: "opp-lab-sim-tenaga-2027",
    title: "Asisten Riset & Praktikum - Lab Simulasi Sistem Tenaga Listrik",
    slug: "lab-simulasi-sistem-tenaga-listrik-ee-its",
    description:
      "Lab Simulasi Sistem Tenaga Listrik Departemen Teknik Elektro ITS membuka rekrutmen asisten praktikum analisis aliran daya, stabilitas transien, smart grid, dan integrasi PLTS menggunakan ETAP dan PSCAD.",
    category: "LAB",
    status: "OPEN",
    organization: {
      name: "Lab Simulasi Sistem Tenaga Listrik",
      type: "LAB",
      faculty: "FTEIC",
      department: "Departemen Teknik Elektro",
    },
    divisions: [
      "Divisi Simulasi ETAP & Analisis Aliran Daya",
      "Divisi Riset Smart Grid & Proteksi Gardu Induk",
      "Divisi Asisten Praktikum Analisis Sistem Tenaga",
    ],
    googleFormUrl: "https://forms.gle/lab-sim-tenaga-ee-its-2027",
    picContact: {
      name: "Asisten Lab Sistem Tenaga",
      contact: "wa.me/6281234567811",
    },
    applicationStart: "2026-11-01",
    applicationEnd: "2026-12-08",
    announcementDate: "2026-12-15",
    quota: 5,
    minGpa: 3.2,
    minSemester: 4,
    maxSemester: 7,
    allowedMajors: ["Departemen Teknik Elektro", "S1 Teknik Elektro"],
    allowedFaculties: ["FTEIC"],
    requiredSkills: ["Power Electronics", "MATLAB", "ETAP", "Electrical Circuit Analysis"],
    requiredDocs: ["KTM Aktif ITS", "Transkrip Nilai myITS", "Curriculum Vitae"],
    benefits: [
      "Sertifikat Asisten Resmi Departemen Teknik Elektro ITS",
      "Honorarium praktikum dan akses software simulasi tenaga profesional",
      "Rekomendasi kuat ke industri transmisi & ketenagalistrikan (PLN, IPP)",
    ],
    tags: ["laboratorium", "lab", "teknik elektro", "tenaga listrik", "etap", "plts"],
    contactEmail: "lab.power@ee.its.ac.id",
  },

  // 12. LABORATORIUM TEKNIK ELEKTRO ITS: LAB TEGANGAN TINGGI
  {
    id: "opp-lab-tegangan-tinggi-2027",
    title: "Asisten Laboratorium - Lab Tegangan Tinggi Teknik Elektro ITS",
    slug: "lab-tegangan-tinggi-ee-its",
    description:
      "Laboratorium Tegangan Tinggi Departemen Teknik Elektro ITS membuka open recruitment asisten praktikum dan riset fenomena tembus isolasi (dielektrik breakdown), pengujian impuls petir, dan keandalan isolator transmisi.",
    category: "LAB",
    status: "OPEN",
    organization: {
      name: "Lab Tegangan Tinggi",
      type: "LAB",
      faculty: "FTEIC",
      department: "Departemen Teknik Elektro",
    },
    divisions: [
      "Divisi Pengujian Dielektrik Cair & Padat",
      "Divisi Pembangkit Impuls Petir & Surja",
      "Divisi Asisten Praktikum Teknik Tegangan Tinggi",
    ],
    googleFormUrl: "https://forms.gle/lab-tegangan-tinggi-ee-its-2027",
    picContact: {
      name: "Admin Lab Tegangan Tinggi",
      contact: "wa.me/6281234567812",
    },
    applicationStart: "2026-11-05",
    applicationEnd: "2026-12-12",
    announcementDate: "2026-12-20",
    quota: 4,
    minGpa: 3.15,
    minSemester: 4,
    maxSemester: 7,
    allowedMajors: ["Departemen Teknik Elektro", "S1 Teknik Elektro"],
    allowedFaculties: ["FTEIC"],
    requiredSkills: ["High Voltage Testing", "Electrical Safety", "Circuit Analysis", "MATLAB"],
    requiredDocs: ["KTM Aktif ITS", "Transkrip Nilai myITS", "Curriculum Vitae"],
    benefits: [
      "Pengalaman langsung mengoperasikan fasilitas uji tegangan tinggi puluhan kV",
      "Sertifikat Asisten Resmi Departemen Teknik Elektro ITS",
      "Honorarium asisten praktikum",
    ],
    tags: ["laboratorium", "lab", "teknik elektro", "tegangan tinggi", "isolasi"],
    contactEmail: "lab.highvoltage@ee.its.ac.id",
  },

  // 13. KOMPETISI MAHASISWA: DELEGASI GEMASTIK XX KONTINGEN ITS
  {
    id: "opp-gemastik-2027",
    title: "Seleksi Delegasi Kontingen GEMASTIK XX ITS (Pusat Prestasi)",
    slug: "seleksi-kontingen-gemastik-xx-its",
    description:
      "Pusat Prestasi Mahasiswa Ditmawa ITS membuka penjaringan delegasi kontingen resmi ITS untuk ajang Pagelaran Mahasiswa Nasional Bidang TIK (GEMASTIK XX). Didanai penuh untuk bimbingan dosen pakar hingga babak final.",
    category: "COMPETITION",
    status: "OPEN",
    organization: {
      name: "Pusat Prestasi Mahasiswa Ditmawa ITS",
      type: "DITMAWA",
      faculty: "Institut",
      instagram: "@ditmawa_its",
    },
    divisions: [
      "Divisi Kota Cerdas (Smart City)",
      "Divisi Penambangan Data (Data Mining)",
      "Divisi Pemrograman Kompetitif (Competitive Programming)",
      "Divisi Keamanan Siber (Cyber Security)",
      "Divisi Desain Pengalaman Pengguna (UX Design)",
      "Divisi Pengembangan Perangkat Lunak (Software Development)",
    ],
    googleFormUrl: "https://forms.gle/delegasi-gemastik-its-2027",
    picContact: {
      name: "PIC Penalaran Ditmawa ITS",
      contact: "wa.me/6281234567813",
    },
    applicationStart: "2026-11-01",
    applicationEnd: "2026-12-05",
    announcementDate: "2026-12-15",
    quota: 50,
    minGpa: 3.0,
    minSemester: 1,
    maxSemester: 7,
    allowedMajors: [],
    allowedFaculties: [],
    requiredSkills: ["Programming", "Python", "Machine Learning", "Algorithm", "Problem Solving"],
    requiredDocs: ["KTM Aktif ITS", "Transkrip Nilai myITS", "Curriculum Vitae", "Proposal Ide / Portofolio"],
    benefits: [
      "Pendanaan penuh biaya registrasi, prototyping, dan akomodasi final nasional",
      "Bimbingan intensif mentoring bersama dosen pembina pakar ITS",
      "Poin SKP Kemahasiswaan Bidang Penalaran Prestasi (Hingga 50 Poin)",
      "Insentif prestasi rektorat bagi peraih medali juara nasional",
    ],
    tags: ["kompetisi", "gemastik", "prestasi", "ditmawa", "tik", "programming"],
    contactEmail: "prestasi@its.ac.id",
  },

  // 14. KOMPETISI MAHASISWA: TIM PENALARAN PKM & PIMNAS 2027
  {
    id: "opp-pkm-pimnas-2027",
    title: "Pendaftaran Tim Program Kreativitas Mahasiswa (PKM) & PIMNAS 2027",
    slug: "tim-pkm-pimnas-its-2027",
    description:
      "Direktorat Kemahasiswaan ITS membuka rekrutmen tim mahasiswa untuk pengajuan proposal Program Kreativitas Mahasiswa (PKM 8 Bidang) pendanaan Belmawa Kemendikbudristek menuju Pekan Ilmiah Mahasiswa Nasional (PIMNAS).",
    category: "COMPETITION",
    status: "OPEN",
    organization: {
      name: "Tim Penalaran & PKM Ditmawa ITS",
      type: "DITMAWA",
      faculty: "Institut",
      instagram: "@pkmcenter_its",
    },
    divisions: [
      "PKM Karsa Cipta (PKM-KC - Prototipe Teknologi)",
      "PKM Riset Eksakta (PKM-RE - Penelitian Laboratorium)",
      "PKM Penerapan Iptek (PKM-PI - Solusi Mitra Industri/UMKM)",
      "PKM Kewirausahaan (PKM-K)",
      "PKM Pengabdian Masyarakat (PKM-PM)",
    ],
    googleFormUrl: "https://forms.gle/pkm-pimnas-its-2027",
    picContact: {
      name: "Helpdesk PKM Center ITS",
      contact: "wa.me/6281234567814",
    },
    applicationStart: "2026-11-01",
    applicationEnd: "2026-12-10",
    announcementDate: "2026-12-20",
    quota: 200,
    minGpa: 2.75,
    minSemester: 1,
    maxSemester: 6,
    allowedMajors: [],
    allowedFaculties: [],
    requiredSkills: ["Scientific Writing", "Research Methodology", "Problem Solving", "Teamwork"],
    requiredDocs: ["KTM Aktif ITS", "Transkrip Nilai myITS", "Curriculum Vitae", "Draft Gagasan PKM"],
    benefits: [
      "Hibah pendanaan riset prototipe Kemendikbudristek Rp 6.000.000 - Rp 10.000.000",
      "Peluang meraih Medali Emas PIMNAS (prestasi tertinggi mahasiswa Indonesia)",
      "Ekuivalensi pembebasan sks skripsi / tugas akhir jalur prestasi",
    ],
    tags: ["kompetisi", "pkm", "pimnas", "penalaran", "hibah", "riset"],
    contactEmail: "pkmcenter@its.ac.id",
  },

  // 15. BEASISWA: BEASISWA KARYA SALEMBA EMPAT (KSE)
  {
    id: "opp-kse-2027",
    title: "Beasiswa Karya Salemba Empat (KSE) Periode 2026/2027",
    slug: "beasiswa-karya-salemba-empat-its-2027",
    description:
      "Yayasan Karya Salemba Empat membuka program beasiswa reguler dan beasiswa unggul untuk mahasiswa sarjana ITS. Memberikan tunjangan biaya hidup bulanan serta pembinaan kepemimpinan dan pelatihan kewirausahaan.",
    category: "SCHOLARSHIP",
    status: "OPEN",
    organization: {
      name: "Paguyuban KSE ITS",
      type: "EXTERNAL",
      faculty: "Institut",
      instagram: "@kse_its",
    },
    googleFormUrl: "https://forms.gle/beasiswa-kse-its-2027",
    picContact: {
      name: "Pengurus Paguyuban KSE ITS",
      contact: "wa.me/6281234567815",
    },
    applicationStart: "2026-11-01",
    applicationEnd: "2026-11-20",
    announcementDate: "2026-12-01",
    quota: 75,
    minGpa: 3.0,
    minSemester: 2,
    maxSemester: 6,
    allowedMajors: [],
    allowedFaculties: [],
    requiredSkills: ["Leadership", "Communication", "Teamwork", "Problem Solving"],
    requiredDocs: ["KTM Aktif ITS", "Transkrip Nilai myITS", "Curriculum Vitae", "Essay Motivasi KSE", "SKTM / Slip Gaji"],
    benefits: [
      "Bantuan dana tunjangan bulanan Rp 750.000 / bulan selama 1 tahun",
      "Pelatihan Leadership Camp & Character Building nasional",
      "Akses program inkubasi Technology for Indonesia (TfI) KSE",
    ],
    tags: ["beasiswa", "kse", "tunjangan", "leadership", "mahasiswa"],
    contactEmail: "beasiswa.kse@its.ac.id",
  },

  // 16. BEASISWA: DJARUM BEASISWA PLUS
  {
    id: "opp-djarum-2027",
    title: "Djarum Beasiswa Plus Angkatan XLII (2026/2027)",
    slug: "djarum-beasiswa-plus-its-2027",
    description:
      "Djarum Foundation membuka program beasiswa prestasi bergengsi bagi mahasiswa semester 4 di ITS. Memberikan dana beasiswa bulanan serta pelatihan soft skills kelas dunia (Nation Building, Character Building, Leadership).",
    category: "SCHOLARSHIP",
    status: "OPEN",
    organization: {
      name: "Djarum Foundation",
      type: "EXTERNAL",
      faculty: "Institut",
      instagram: "@djarumbeasiswaplus",
    },
    googleFormUrl: "https://forms.gle/djarum-beasiswa-plus-2027",
    picContact: {
      name: "Sekretariat Djarum Foundation",
      contact: "wa.me/6281234567816",
    },
    applicationStart: "2026-11-01",
    applicationEnd: "2026-11-28",
    announcementDate: "2026-12-15",
    quota: 35,
    minGpa: 3.2,
    minSemester: 4,
    maxSemester: 4,
    allowedMajors: [],
    allowedFaculties: [],
    requiredSkills: ["Leadership", "Communication", "Critical Thinking", "Public Speaking"],
    requiredDocs: ["KTM Aktif ITS", "Transkrip Nilai myITS", "Curriculum Vitae", "Bukti Prestasi / Keaktifan Organisasi"],
    benefits: [
      "Bantuan dana beasiswa Rp 1.000.000 / bulan selama 12 bulan",
      "Pelatihan Nation Building di Kudus dan Semarang",
      "Pelatihan Character Building & Leadership Development",
    ],
    tags: ["beasiswa", "djarum", "softskill", "leadership", "nasional"],
    contactEmail: "beasiswa@djarumplus.org",
  },
];

// Initial Student Profile (Integrated from myITS Portal SSO)
// Note: cvFileName, cvParsedAt, cvParsedData are initially undefined so user can test uploading a new CV!
export const INITIAL_STUDENT_PROFILE: StudentProfileData = {
  nim: "07211940000001",
  name: "Praditya Haekal Islami Al Haqiqi",
  email: "praditya.haekal@student.its.ac.id",
  phone: "081234567890",
  university: "Institut Teknologi Sepuluh Nopember (ITS)",
  faculty: "Fakultas Teknologi Elektro dan Informatika Cerdas (FTEIC)",
  department: "Departemen Teknik Elektro",
  major: "Departemen Teknik Elektro",
  degreeLevel: "S1 Sarjana",
  semester: 5,
  gpa: 3.72,
  sksCompleted: 96,
  academicAdvisor: "Dr. Budi Santoso, S.T., M.T.",
  focusLab: "Lab Mikroelektronika dan Sistem Tertanam",
  entryYear: 2024,
  academicStatus: "Aktif (FRS myITS Terverifikasi)",
  bio: "Mahasiswa Departemen Teknik Elektro FTEIC ITS semester 5 yang berfokus pada sistem tertanam (embedded systems), IoT, dan otomasi industri. Berpengalaman dalam riset mikrokontroler, prototipe robotik, serta aktif berorganisasi di lingkungan himpunan mahasiswa.",
  skills: [
    "Python",
    "C++",
    "Arduino",
    "Embedded Systems",
    "Machine Learning",
    "ROS",
    "MATLAB",
    "IoT Architecture",
  ],
  softSkills: [
    "Leadership",
    "Public Speaking",
    "Teamwork",
    "Problem Solving",
    "Critical Thinking",
  ],
  interests: [
    "Autonomous Robotics",
    "Industrial IoT",
    "Edge AI Computing",
    "Power Electronics",
    "Renewable Energy Systems",
  ],
  achievements: [
    {
      id: "ach-1",
      title: "Juara 2 Lomba Robot Line Follower Nasional Regional Jatim",
      level: "Nasional",
      year: "2025",
      organizer: "Komunitas Robotika Jawa Timur & ITS",
    },
    {
      id: "ach-2",
      title: "Peserta Program Kreativitas Mahasiswa Karsa Cipta (PKM-KC) Didanai",
      level: "Nasional",
      year: "2025",
      organizer: "Belmawa Kemendikbudristek",
    },
    {
      id: "ach-3",
      title: "Finalis Lomba Inovasi Teknologi Tepat Guna Tingkat Universitas",
      level: "Kampus",
      year: "2024",
      organizer: "BEM FTEIC ITS",
    },
  ],
  experiences: [
    {
      id: "exp-1",
      title: "Staff Departemen Riset dan Teknologi",
      organization: "HIMATEKTRO ITS (Himpunan Mahasiswa Teknik Elektro)",
      duration: "Februari 2025 - Sekarang",
      description:
        "Menginisiasi tutorial teknik pemrograman mikrokontroler untuk mahasiswa baru, mengelola modul trainer Arduino lab, dan menjadi panitia Electrical Expo 2025.",
    },
    {
      id: "exp-2",
      title: "Ketua Tim Proyek PKM-KC",
      organization: "Direktorat Jenderal Pendidikan Tinggi Kemendikbudristek",
      duration: "April 2025 - November 2025",
      description:
        "Memimpin riset 5 mahasiswa dalam mendesain sistem IoT monitoring tambak air payau berbasis LoRa dan solar cell ramah lingkungan.",
    },
    {
      id: "exp-3",
      title: "Asisten Praktikum Dasar Teknik Elektro",
      organization: "Departemen Teknik Elektro FTEIC ITS",
      duration: "September 2025 - Januari 2026",
      description:
        "Mendampingi modul praktikum rangkaian listrik, osiloskop, logika gerbang digital, serta menilai laporan mingguan praktikan.",
    },
  ],
  languages: ["Bahasa Indonesia (Native)", "English (TOEFL ITP: 560)", "Basic Japanese"],
  documentsReady: [
    "KTM Aktif ITS",
    "Transkrip Nilai myITS",
    "Curriculum Vitae",
    "Portofolio Proyek",
    "Sertifikat LKMM-TD",
  ],
  // Kosongkan CV awal agar user dapat menguji fitur unggah CV baru
  cvFileName: undefined,
  cvParsedAt: undefined,
  cvParsedData: undefined,
};

// Initial Seed Publication Requests submitted by organizers
export const INITIAL_PUB_REQUESTS: PublicationRequest[] = [
  {
    id: "pub-req-1",
    title: "Open Recruitment Panitia GERIGI ITS x UKM Expo 2027",
    organizationName: "BEM ITS & Panitia Pusat GERIGI ITS 2027",
    category: "COMMITTEE",
    description: "Orientasi akbar penyambutan mahasiswa baru ITS 2027.",
    googleFormUrl: "https://forms.gle/gerigi-its-2027-oprec",
    picName: "Koordinator Rekrutmen GERIGI",
    picContact: "081234567801 (WhatsApp)",
    divisions: ["Acara", "LO", "Medfo", "Logistik", "Sponsorship"],
    minGpa: 2.75,
    minSemester: 2,
    maxSemester: 6,
    requiredSkills: ["Teamwork", "Leadership", "Communication"],
    applicationEnd: "2026-11-28",
    status: "PUBLISHED",
    submittedAt: "2026-11-01 10:00 WIB",
  },
  {
    id: "pub-req-2",
    title: "Open Recruitment Fungsionaris HIMATEKTRO ITS 2026/2027",
    organizationName: "HIMATEKTRO ITS",
    category: "ORGANIZATION",
    description: "Kepengurusan fungsionaris himpunan mahasiswa teknik elektro.",
    googleFormUrl: "https://forms.gle/himatektro-2027-fungsionaris",
    picName: "Sekretariat HIMATEKTRO",
    picContact: "081234567803 (WhatsApp)",
    divisions: ["Ristek", "PSDM", "Edukasi", "Minbak", "Hublu", "Medfo"],
    minGpa: 2.75,
    minSemester: 2,
    maxSemester: 5,
    requiredSkills: ["Teamwork", "Public Speaking", "Arduino"],
    applicationEnd: "2026-11-20",
    status: "PUBLISHED",
    submittedAt: "2026-11-01 14:30 WIB",
  },
  {
    id: "pub-req-3",
    title: "Asisten Riset & Praktikum - Lab Mikroelektronika dan Sistem Tertanam",
    organizationName: "Lab Mikroelektronika dan Sistem Tertanam Teknik Elektro",
    category: "LAB",
    description: "Rekrutmen asisten laboratorium riset edge AI, FPGA, dan praktikum mikroprosesor.",
    googleFormUrl: "https://forms.gle/lab-embedded-ee-its-2027",
    picName: "Koordinator Asisten Lab",
    picContact: "lab.embedded@ee.its.ac.id",
    divisions: ["FPGA", "ROS2 Autopilot", "Edge AI", "Asisten Praktikum"],
    minGpa: 3.3,
    minSemester: 4,
    maxSemester: 8,
    requiredSkills: ["C++", "Python", "Embedded Systems"],
    applicationEnd: "2026-12-15",
    status: "PUBLISHED",
    submittedAt: "2026-11-02 09:15 WIB",
  },
];

// LocalStorage Keys (v5 clean start)
const PROFILE_STORAGE_KEY = "myits_campusmatch_profile_v5";
const OPPORTUNITIES_STORAGE_KEY = "myits_campusmatch_opps_v5";
const PUB_REQUESTS_STORAGE_KEY = "myits_campusmatch_pub_requests_v5";

export function getStoredProfile(): StudentProfileData {
  if (typeof window === "undefined") return INITIAL_STUDENT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      const data: StudentProfileData = JSON.parse(raw);
      // Profil akun utama pengguna selalu terjaga atas nama Praditya Haekal Islami Al Haqiqi
      data.name = INITIAL_STUDENT_PROFILE.name;

      // Auto-reset jika usia hasil scan CV telah melebihi 10 menit (10 * 60 * 1000 ms)
      if (data.cvParsedTimestamp && Date.now() - data.cvParsedTimestamp > 10 * 60 * 1000) {
        data.cvFileName = undefined;
        data.cvParsedAt = undefined;
        data.cvParsedData = undefined;
        data.cvParsedTimestamp = undefined;
        data.activeScannedCv = undefined;
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
      }
      return data;
    }
  } catch (e) {
    console.error("Failed to read profile", e);
  }
  return INITIAL_STUDENT_PROFILE;
}

export function saveStoredProfile(profile: StudentProfileData) {
  if (typeof window === "undefined") return;
  try {
    // Pastikan identitas pemilik akun tidak pernah tertimpa oleh nama berkas CV teman
    const sanitized: StudentProfileData = {
      ...profile,
      name: INITIAL_STUDENT_PROFILE.name,
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(sanitized));
    window.dispatchEvent(new Event("campusmatch:profile_updated"));
  } catch (e) {
    console.error("Failed to save profile", e);
  }
}

export function getStoredOpportunities(): OpportunityItem[] {
  if (typeof window === "undefined") return INITIAL_OPPORTUNITIES;
  try {
    const raw = localStorage.getItem(OPPORTUNITIES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read opportunities", e);
  }
  return INITIAL_OPPORTUNITIES;
}

export function saveStoredOpportunities(opps: OpportunityItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(OPPORTUNITIES_STORAGE_KEY, JSON.stringify(opps));
    window.dispatchEvent(new Event("campusmatch:opportunities_updated"));
  } catch (e) {
    console.error("Failed to save opportunities", e);
  }
}

export function addStoredOpportunity(opp: OpportunityItem) {
  const current = getStoredOpportunities();
  const updated = [opp, ...current.filter((o) => o.id !== opp.id)];
  saveStoredOpportunities(updated);
}

export function getStoredPublicationRequests(): PublicationRequest[] {
  if (typeof window === "undefined") return INITIAL_PUB_REQUESTS;
  try {
    const raw = localStorage.getItem(PUB_REQUESTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read publication requests", e);
  }
  return INITIAL_PUB_REQUESTS;
}

export function saveStoredPublicationRequests(requests: PublicationRequest[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PUB_REQUESTS_STORAGE_KEY, JSON.stringify(requests));
    window.dispatchEvent(new Event("campusmatch:pub_requests_updated"));
  } catch (e) {
    console.error("Failed to save publication requests", e);
  }
}

export function submitPublicationRequest(
  data: Omit<PublicationRequest, "id" | "status" | "submittedAt">
): PublicationRequest {
  const newRequest: PublicationRequest = {
    ...data,
    id: `req-${Date.now()}`,
    status: "PUBLISHED",
    submittedAt: new Date().toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) + " WIB",
  };

  const currentRequests = getStoredPublicationRequests();
  saveStoredPublicationRequests([newRequest, ...currentRequests]);

  // Sekaligus tambahkan ke katalog opportunities agar langsung terpublikasi
  const newOpp: OpportunityItem = {
    id: `opp-${newRequest.id}`,
    title: newRequest.title,
    slug: newRequest.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description: newRequest.description,
    category: newRequest.category,
    status: "OPEN",
    organization: {
      name: newRequest.organizationName,
      type:
        newRequest.category === "ORGANIZATION"
          ? "HIMA"
          : newRequest.category === "RESEARCH"
            ? "TIM_RISET"
            : newRequest.category === "LAB"
              ? "LAB"
              : newRequest.category === "COMPETITION"
                ? "DITMAWA"
                : "PANITIA",
      faculty: "Institut",
    },
    divisions: newRequest.divisions && newRequest.divisions.length > 0 ? newRequest.divisions : ["Umum"],
    googleFormUrl: newRequest.googleFormUrl,
    picContact: {
      name: newRequest.picName,
      contact: newRequest.picContact,
    },
    applicationStart: new Date().toISOString().split("T")[0],
    applicationEnd: newRequest.applicationEnd || "2026-12-31",
    minGpa: newRequest.minGpa || 2.75,
    minSemester: newRequest.minSemester || 1,
    maxSemester: newRequest.maxSemester || 8,
    requiredSkills: newRequest.requiredSkills || ["Teamwork"],
    requiredDocs: ["KTM Aktif ITS", "Curriculum Vitae"],
    benefits: [
      "Pengalaman resmi di lingkungan kampus ITS",
      "Poin SKP Kemahasiswaan",
      "Networking dan sertifikat penyelenggara",
    ],
    tags: [newRequest.category.toLowerCase(), newRequest.organizationName.toLowerCase()],
  };

  addStoredOpportunity(newOpp);
  return newRequest;
}

// Matching Calculation Engine
export function calculateMatch(opp: OpportunityItem, profile: StudentProfileData): MatchEvaluation {
  const reasons: string[] = [];
  let score = 50; // base score

  // GPA Check
  let gpaPassed = true;
  if (opp.minGpa) {
    if (profile.gpa >= opp.minGpa) {
      score += 15;
      reasons.push(`IPK ${profile.gpa.toFixed(2)} memenuhi batas minimal ${opp.minGpa.toFixed(2)}`);
    } else {
      gpaPassed = false;
      score -= 20;
      reasons.push(`IPK ${profile.gpa.toFixed(2)} di bawah batas minimal ${opp.minGpa.toFixed(2)}`);
    }
  } else {
    score += 10;
  }

  // Semester Check
  let semesterPassed = true;
  if (opp.minSemester && profile.semester < opp.minSemester) {
    semesterPassed = false;
    score -= 15;
    reasons.push(`Semester ${profile.semester} belum memenuhi syarat minimal semester ${opp.minSemester}`);
  }
  if (opp.maxSemester && profile.semester > opp.maxSemester) {
    semesterPassed = false;
    score -= 15;
    reasons.push(`Semester ${profile.semester} telah melampaui batas maksimal semester ${opp.maxSemester}`);
  }
  if (semesterPassed) {
    score += 10;
    reasons.push(`Semester ${profile.semester} berada dalam rentang yang dipersyaratkan`);
  }

  // Major Check
  let majorPassed = true;
  if (opp.allowedMajors && opp.allowedMajors.length > 0) {
    const isAllowed = opp.allowedMajors.some(
      (m) =>
        m.toLowerCase().includes(profile.department.toLowerCase()) ||
        profile.department.toLowerCase().includes(m.toLowerCase()) ||
        m.toLowerCase().includes("seluruh jurusan")
    );
    if (isAllowed) {
      score += 15;
      reasons.push(`Departemen ${profile.department} memenuhi kualifikasi jurusan sasaran`);
    } else {
      majorPassed = false;
      score -= 20;
      reasons.push(`Departemen ${profile.department} tidak tercantum dalam jurusan sasaran`);
    }
  } else {
    score += 15;
    reasons.push("Terbuka untuk seluruh departemen di ITS");
  }

  // Faculty Check
  let facultyPassed = true;
  if (opp.allowedFaculties && opp.allowedFaculties.length > 0) {
    const isAllowed = opp.allowedFaculties.some((f) => profile.faculty.includes(f));
    if (!isAllowed) {
      facultyPassed = false;
      score -= 10;
    }
  }

  // Skills Overlap
  const studentAllSkills = [
    ...(profile.skills || []),
    ...(profile.softSkills || []),
    ...(profile.cvParsedData?.detectedSkills || []),
  ].map((s) => s.toLowerCase());

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  opp.requiredSkills.forEach((req) => {
    if (studentAllSkills.some((s) => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s))) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  if (opp.requiredSkills.length > 0) {
    const skillRatio = matchedSkills.length / opp.requiredSkills.length;
    score += Math.round(skillRatio * 20);
    if (matchedSkills.length > 0) {
      reasons.push(`Memiliki ${matchedSkills.length} dari ${opp.requiredSkills.length} keahlian yang dicari`);
    }
  }

  // Document Readiness
  const matchedDocs: string[] = [];
  const missingDocs: string[] = [];
  opp.requiredDocs.forEach((doc) => {
    if (profile.documentsReady.some((d) => d.toLowerCase().includes(doc.toLowerCase()) || doc.toLowerCase().includes(d.toLowerCase()))) {
      matchedDocs.push(doc);
    } else {
      missingDocs.push(doc);
    }
  });

  score = Math.max(10, Math.min(99, score));

  let status: "ELIGIBLE" | "PARTIAL" | "INELIGIBLE" = "PARTIAL";
  if (gpaPassed && semesterPassed && majorPassed && score >= 75) {
    status = "ELIGIBLE";
  } else if (!gpaPassed || !semesterPassed || !majorPassed) {
    status = "INELIGIBLE";
  }

  let recommendation = "Persyaratan Anda cocok untuk posisi ini. Segera akses tautan Google Form pendaftaran.";
  if (status === "INELIGIBLE") {
    recommendation = "Ada beberapa kriteria mutlak (IPK/Semester/Departemen) yang belum sesuai dengan kriteria yang ditentukan penyelenggara.";
  } else if (missingSkills.length > 0) {
    recommendation = `Anda memiliki potensi besar, pertimbangkan untuk menonjolkan keahlian ${missingSkills.slice(0, 2).join(", ")} saat mengisi formulir pendaftaran.`;
  }

  return {
    opportunityId: opp.id,
    opportunity: opp,
    score,
    status,
    gpaPassed,
    semesterPassed,
    majorPassed,
    facultyPassed,
    matchedSkills,
    missingSkills,
    matchedDocs,
    missingDocs,
    reasons,
    recommendation,
  };
}

export function generateGapAnalysis(opp: OpportunityItem, profile: StudentProfileData): DetailedGapItem[] {
  const gaps: DetailedGapItem[] = [];

  // IPK
  if (opp.minGpa) {
    const diff = opp.minGpa - profile.gpa;
    if (diff > 0) {
      gaps.push({
        id: "gap-gpa",
        category: "ACADEMIC",
        title: "Kesenjangan Nilai IPK Minimum",
        currentStatus: `IPK ${profile.gpa.toFixed(2)}`,
        targetRequirement: `IPK Minimum ${opp.minGpa.toFixed(2)}`,
        priority: "HIGH",
        impact: "Syarat kaku seleksi administrasi formulir pendaftaran.",
        actionSteps: [
          "Fokus perbaikan nilai mata kuliah inti semester depan.",
          "Manfaatkan program tutorial akademik himpunan mahasiswa.",
        ],
      });
    }
  }

  // Keahlian
  const studentAllSkills = [
    ...(profile.skills || []),
    ...(profile.softSkills || []),
    ...(profile.cvParsedData?.detectedSkills || []),
  ].map((s) => s.toLowerCase());

  opp.requiredSkills.forEach((skill, idx) => {
    if (!studentAllSkills.some((s) => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s))) {
      gaps.push({
        id: `gap-skill-${idx}`,
        category: "SKILL",
        title: `Keahlian Belum Terpenuhi: ${skill}`,
        currentStatus: "Belum tercantum dalam profil keahlian",
        targetRequirement: `Dibutuhkan keahlian ${skill}`,
        priority: "MEDIUM",
        impact: "Menjadi poin pertimbangan penting oleh PIC seleksi.",
        actionSteps: [
          `Ikuti mini-workshop atau course dasar mengenai ${skill}.`,
          `Buat mini-proyek mandiri untuk menguji pemahaman ${skill}.`,
          `Cantumkan pengalaman hands-on terkait ${skill} pada CV dan formulir pendaftaran.`,
        ],
      });
    }
  });

  // Berkas
  opp.requiredDocs.forEach((doc, idx) => {
    if (!profile.documentsReady.some((d) => d.toLowerCase().includes(doc.toLowerCase()) || doc.toLowerCase().includes(d.toLowerCase()))) {
      gaps.push({
        id: `gap-doc-${idx}`,
        category: "DOCUMENT",
        title: `Dokumen Persyaratan Belum Siap: ${doc}`,
        currentStatus: "Belum disiapkan / belum diunggah",
        targetRequirement: `Wajib dilampirkan: ${doc}`,
        priority: "HIGH",
        impact: "Wajib diunggah saat mengisi Google Form pendaftaran.",
        actionSteps: [
          `Unduh atau mintakan pengesahan dokumen ${doc} melalui myITS Portal.`,
          "Simpan salinan digital (PDF) dengan format penamaan yang rapi.",
        ],
      });
    }
  });

  return gaps;
}
