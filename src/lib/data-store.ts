// myITS CampusMatch - Centralized Data Store & Matching Engine
// Comprehensive ITS Campus Data, Research Teams, Himpunan, Labs, Event Organizers & Admin Spreadsheet

export interface OpportunityItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: "SCHOLARSHIP" | "ORGANIZATION" | "COMPETITION" | "COMMITTEE" | "UKM" | "RESEARCH";
  status: "OPEN" | "UPCOMING" | "CLOSED" | "DRAFT";
  organization: {
    name: string;
    type: "HIMA" | "BEM" | "UKM" | "TIM_RISET" | "LAB" | "DITMAWA" | "PANITIA" | "EXTERNAL";
    faculty?: string;
    department?: string;
    logo?: string;
    instagram?: string;
  };
  divisions?: string[]; // Available divisions for open recruitment
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
    level: string; // Nasional / Internasional / Regional / Kampus
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
  documentsReady: string[]; // e.g. ["KTM", "Transkrip Nilai", "Curriculum Vitae"]
  cvFileName?: string;
  cvParsedAt?: string;
  cvParsedData?: {
    confidenceScore: number;
    detectedSkills: string[];
    aiSummary: string;
  };
}

export interface ApplicantRecord {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  organizationName: string;
  division: string;
  userId: string;
  userName: string;
  userNim: string;
  userDepartment: string;
  userFaculty: string;
  userSemester: number;
  userGpa: number;
  userSkills: string[];
  cvFileName: string;
  coverLetter?: string;
  appliedAt: string;
  status: "SUBMITTED" | "REVIEWED" | "ACCEPTED" | "REJECTED";
  // Auto-filter calculations from requirements:
  autoFilterPassed: boolean;
  autoFilterDetails: {
    gpaPassed: boolean;
    semesterPassed: boolean;
    majorPassed: boolean;
    skillsOverlap: number; // percentage
  };
  reasons: string[];
  matchScore: number;
  notes?: string;
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

// Comprehensive Opportunities Dataset across ITS (Himpunan, Labs, Tim Riset, Panitia Event, Beasiswa)
export const INITIAL_OPPORTUNITIES: OpportunityItem[] = [
  // 1. EVENT AKBAR KAMPUS: GERIGI ITS x UKM EXPO 2027
  {
    id: "opp-gerigi-2027",
    title: "Open Recruitment Panitia GERIGI ITS x UKM Expo 2027",
    slug: "panitia-gerigi-its-ukm-expo-2027",
    description:
      "Generasi Integralistik (GERIGI) ITS 2027 berkolaborasi dengan UKM Expo adalah hajatan orientasi & kaderisasi akbar penyambutan mahasiswa baru terbesar di Institut Teknologi Sepuluh Nopember. Membuka rekrutmen panitia mahasiswa aktif seluruh fakultas untuk berbagai divisi strategis.",
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
      "Divisi Fasilitator & Pendamping Maba (LO)",
      "Divisi Media Informasi, Dokumentasi & Desain (Medfo)",
      "Divisi Perlengkapan, Panggung & Logistik",
      "Divisi Sponsorship, Kemitraan & Dana Usaha",
      "Divisi Keamanan & Ketertiban Lapangan (K3)",
      "Divisi Konsumsi & Kesehatan (Medis)",
      "Divisi Kesekretariatan & Administrasi (Kestari)",
    ],
    applicationStart: "2026-11-01",
    applicationEnd: "2026-11-28",
    announcementDate: "2026-12-05",
    quota: 350,
    minGpa: 2.75,
    minSemester: 2,
    maxSemester: 6,
    allowedMajors: [], // All ITS majors
    allowedFaculties: [],
    requiredSkills: ["Teamwork", "Leadership", "Communication", "Event Management", "Problem Solving"],
    requiredDocs: ["KTM", "Transkrip Nilai", "Curriculum Vitae", "Portofolio (Khusus Desain/Medfo)", "Surat Komitmen"],
    benefits: [
      "Sertifikat Kepanitiaan Tingkat Institut Resmi Rektorat ITS",
      "Poin SKP Kemahasiswaan Bidang Manajerial Event (35 Poin)",
      "Networking akbar seluruh mahasiswa lintas 7 fakultas di ITS",
      "Pengalaman memimpin dan mengoordinasi ribuan mahasiswa baru",
      "Seragam panitia & atribut resmi GERIGI ITS 2027",
    ],
    tags: ["gerigi", "ukm expo", "kepanitiaan", "maba", "bem its", "acara", "event", "lo", "medfo"],
    contactEmail: "gerigi@its.ac.id",
    externalLink: "https://gerigi.its.ac.id",
  },

  // 2. TIM RISET UNGGULAN: ANARGYA FORMULA EV ITS
  {
    id: "opp-anargya-2027",
    title: "Open Recruitment Tim Riset Anargya Formula EV ITS 2026/2027",
    slug: "tim-riset-anargya-formula-ev-its",
    description:
      "Anargya ITS adalah tim riset mahasiswa otomotif yang berfokus pada perancangan dan manufaktur mobil balap formula bertenaga listrik (Electric Vehicle) untuk berlaga di ajang internasional Formula Bharat India dan Formula SAE Japan. Mencari calon engineer tangguh di bidang kelistrikan, mekanik, baterai, dan manajemen tim.",
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
      "Divisi Mechanical & Chassis Design (FEA)",
      "Divisi Aerodynamics & Cooling System",
      "Divisi Sponsorship, Media & Business Plan",
    ],
    applicationStart: "2026-10-25",
    applicationEnd: "2026-11-30",
    announcementDate: "2026-12-10",
    quota: 25,
    minGpa: 3.0,
    minSemester: 1,
    maxSemester: 6,
    allowedMajors: ["S1 Teknik Elektro", "S1 Teknik Komputer", "S1 Teknik Mesin", "S1 Teknik Material", "S1 Teknik Industri"],
    allowedFaculties: ["FTEIC", "FTIRS"],
    requiredSkills: ["C++", "Python", "Circuit Design", "PCB Design", "Embedded Systems", "CAD / SolidWorks"],
    requiredDocs: ["KTM", "Transkrip Nilai", "Curriculum Vitae", "Portofolio Proyek Teknik"],
    benefits: [
      "Pengalaman hands-on riset mobil balap listrik berstandar internasional SAE",
      "Peluang mewakili ITS & Indonesia pada kompetisi Formula SAE di luar negeri",
      "Konversi sks magang / Merdeka Belajar Kampus Merdeka (MBKM)",
      "Jejaring langsung ke industri otomotif EV ternama (Hyundai, Pertamina, PLN)",
    ],
    tags: ["anargya", "formula ev", "mobil listrik", "riset", "teknik elektro", "baterai", "otomotif"],
    contactEmail: "anargya@its.ac.id",
  },

  // 3. TIM RISET UNGGULAN: BAYUCARAKA ROBOTICS ITS
  {
    id: "opp-bayucaraka-2027",
    title: "Open Recruitment Tim Robotika Bayucaraka ITS (UAV & Underwater)",
    slug: "open-recruitment-bayucaraka-its-2027",
    description:
      "Bayucaraka ITS (UKM Robotika) membuka seleksi kru riset baru untuk Kontes Robot Terbang Indonesia (KRTI) dan Singapore Autonomous Underwater Vehicle Challenge (SAUVC). Mengembangkan teknologi wahana nirawak berbasis computer vision, SLAM, dan flight controller mandiri.",
    category: "UKM",
    status: "OPEN",
    organization: {
      name: "UKM Robotika Bayucaraka ITS",
      type: "TIM_RISET",
      faculty: "Institut",
      instagram: "@bayucarakaits",
    },
    divisions: [
      "Divisi Autonomous Underwater Vehicle (AUV)",
      "Divisi Fixed Wing Drone (KRTI)",
      "Divisi Vertical Take-Off Landing (VTOL)",
      "Divisi Technology Development & Ground Control Station",
      "Divisi Non-Teknis (Branding, Legal & Sponsorship)",
    ],
    applicationStart: "2026-10-20",
    applicationEnd: "2026-11-25",
    announcementDate: "2026-12-02",
    quota: 30,
    minGpa: 3.0,
    minSemester: 1,
    maxSemester: 6,
    allowedMajors: [],
    allowedFaculties: [],
    requiredSkills: ["Arduino", "C++", "Python", "ROS", "Embedded Systems", "Hardware Troubleshooting"],
    requiredDocs: ["KTM", "Transkrip Nilai", "Curriculum Vitae", "Motivation Letter"],
    benefits: [
      "Pelatihan komprehensif sistem otonom drone terbang & robot bawah air",
      "Peluang mewakili ITS di ajang KRTI Nasional & Kejuaraan Dunia di Singapura/AS",
      "Akses workshop peralatan lab robotika (3D Printer, CNC, Flight Simulators)",
      "Poin SKP Kemahasiswaan & rekomendasi beasiswa prestasi",
    ],
    tags: ["bayucaraka", "robotika", "drone", "auv", "underwater", "ros", "arduino", "krti"],
    contactEmail: "bayucaraka@its.ac.id",
    externalLink: "https://bayucaraka.its.ac.id",
  },

  // 4. HIMPUNAN: HIMATEKTRO ITS 2026/2027 (SEMUA DEPARTEMEN)
  {
    id: "opp-himatektro-2027",
    title: "Open Recruitment Fungsionaris HIMATEKTRO ITS Periode 2026/2027",
    slug: "fungsionaris-himatektro-its-2026-2027",
    description:
      "Himpunan Mahasiswa Teknik Elektro (HIMATEKTRO) FTEIC ITS membuka pendaftaran pengurus baru bagi mahasiswa aktif Teknik Elektro. Wadah perjuangan, advokasi, pengembangan kompetensi riset, kewirausahaan, serta kepedulian sosial kemasyarakatan mahasiswa elektro.",
    category: "ORGANIZATION",
    status: "OPEN",
    organization: {
      name: "HIMATEKTRO ITS",
      type: "HIMA",
      faculty: "FTEIC",
      department: "Teknik Elektro",
      instagram: "@himatektro_its",
    },
    divisions: [
      "Departemen Riset dan Teknologi Terapan (Ristek)",
      "Departemen Pengembangan Sumber Daya Mahasiswa (PSDM)",
      "Departemen Edukasi & Tutorial Akademik",
      "Departemen Minat dan Bakat (Minbak - Olahraga & Seni)",
      "Departemen Hubungan Luar & Alumni (Hublu)",
      "Departemen Dalam Negeri & Kesejahteraan Mahasiswa (Dagri)",
      "Biro Media, Informasi & Kreatif (Medfo)",
      "Biro Kewirausahaan & Dana Mandiri (KWU)",
    ],
    applicationStart: "2026-11-01",
    applicationEnd: "2026-11-20",
    announcementDate: "2026-11-28",
    quota: 65,
    minGpa: 2.75,
    minSemester: 2,
    maxSemester: 5,
    allowedMajors: ["S1 Teknik Elektro", "S1 Teknik Komputer", "S1 Teknik Telekomunikasi"],
    allowedFaculties: ["FTEIC"],
    requiredSkills: ["Teamwork", "Leadership", "Public Speaking", "Problem Solving", "Arduino"],
    requiredDocs: ["KTM", "Transkrip Nilai", "Curriculum Vitae", "Sertifikat LKMM-TD", "Essay Rencana Kontribusi"],
    benefits: [
      "Sertifikat Fungsionaris Resmi Pengurus HIMATEKTRO ITS",
      "Poin SKP Kemahasiswaan Bidang Organisasi (25 Poin)",
      "Akses prioritas laboratorium elektro & modul riset himpunan",
      "Koneksi erat dengan ikatan alumni Elektro ITS di industri energi & teknologi",
    ],
    tags: ["himatektro", "teknik elektro", "organisasi", "hima", "fteic", "ristek", "psdm", "edukasi"],
    contactEmail: "sekretariat@himatektro.its.ac.id",
  },

  // 5. TIM RISET: SAPUANGIN ITS (ECO-MARATHON MOBIL HEMAT ENERGI)
  {
    id: "opp-sapuangin-2027",
    title: "Open Recruitment Kru Tim Sapuangin ITS (Shell Eco-marathon)",
    slug: "tim-sapuangin-its-eco-marathon",
    description:
      "Tim Sapuangin ITS adalah tim legendaris pemegang rekor juara dunia kompetisi mobil hemat energi Shell Eco-marathon (Urban Concept & Prototype ICE/Battery Electric). Membuka rekrutmen mahasiswa berdedikasi tinggi pada efisiensi energi, motor kontrol, dan telemetri data presisi.",
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
      "Divisi Non-Teknis & International Sponsorship",
    ],
    applicationStart: "2026-11-05",
    applicationEnd: "2026-12-05",
    announcementDate: "2026-12-15",
    quota: 20,
    minGpa: 3.0,
    minSemester: 2,
    maxSemester: 6,
    allowedMajors: ["S1 Teknik Elektro", "S1 Teknik Mesin", "S1 Teknik Fisika", "S1 Teknik Kimia"],
    allowedFaculties: ["FTIRS", "FTEIC"],
    requiredSkills: ["C++", "Python", "Data Logging", "Circuit Design", "Teamwork"],
    requiredDocs: ["KTM", "Transkrip Nilai", "Curriculum Vitae", "Portfolio Proyek"],
    benefits: [
      "Pengalaman riset langsung di kejuaraan mobil hemat energi dunia (Qatar / London)",
      "Peluang magang di Shell Global atau BUMN Pertamina",
      "Pelatihan komprehensif telemetri energi dan material komposit",
      "Poin SKP Kemahasiswaan tingkat internasional",
    ],
    tags: ["sapuangin", "mobil hemat energi", "shell eco-marathon", "riset", "otomotif", "telemetri"],
    contactEmail: "sapuangin@its.ac.id",
  },

  // 6. LABORATORIUM: LAB SISTEM TERTANAM & ROBOTIKA FTEIC
  {
    id: "opp-lab-embedded-2027",
    title: "Research Assistant - Lab Sistem Tertanam & Robotika FTEIC",
    slug: "research-assistant-lab-embedded-2027",
    description:
      "Laboratorium Sistem Tertanam dan Robotika Departemen Teknik Elektro membuka lowongan Research Assistant (RA) untuk proyek hibah riset 'Autonomous Navigation System for Underwater & Aerial Vehicles using FPGA & Edge AI'. Bekerja sama langsung dengan Dr. Budi Santoso dan mitra industri.",
    category: "RESEARCH",
    status: "OPEN",
    organization: {
      name: "Lab Sistem Tertanam & Robotika",
      type: "LAB",
      faculty: "FTEIC",
      department: "Teknik Elektro",
    },
    divisions: [
      "Sub-Tim FPGA & Hardware Accelerator (Verilog/VHDL)",
      "Sub-Tim ROS2 Autopilot & Sensor Fusion (LiDAR, IMU, Camera)",
      "Sub-Tim Edge AI Computing (Jetson Nano, TensorRT)",
    ],
    applicationStart: "2026-10-25",
    applicationEnd: "2026-12-15",
    announcementDate: "2026-12-22",
    quota: 4,
    minGpa: 3.3,
    minSemester: 4,
    maxSemester: 8,
    allowedMajors: ["S1 Teknik Elektro", "S1 Teknik Komputer", "S1 Teknik Informatika"],
    allowedFaculties: ["FTEIC"],
    requiredSkills: ["C++", "Python", "ROS", "Embedded Systems", "Machine Learning"],
    requiredDocs: ["KTM", "Transkrip Nilai", "Curriculum Vitae", "Portofolio Proyek (GitHub/PDF)"],
    benefits: [
      "Honorarium bulanan riset Rp 750.000 / bulan",
      "Peluang co-author publikasi jurnal ilmiah bereputasi Scopus/IEEE",
      "Akses workstation lab (FPGA Xilinx, Jetson AGX Orin, LiDAR sensor)",
      "Konversi sks mata kuliah tugas akhir / proyek mandiri",
    ],
    tags: ["riset", "lab", "robotika", "fpga", "embedded", "ros", "ai", "teknik elektro"],
    contactEmail: "lab.embedded@ee.its.ac.id",
  },

  // 7. LABORATORIUM: LAB SISTEM TENAGA LISTRIK & EBT
  {
    id: "opp-lab-power-2027",
    title: "Asisten Praktikum & Riset - Lab Sistem Tenaga Listrik & EBT",
    slug: "asisten-lab-sistem-tenaga-listrik-ebt",
    description:
      "Lab Sistem Tenaga Listrik dan Energi Baru Terbarukan Departemen Teknik Elektro FTEIC ITS membuka open recruitment asisten praktikum dan asisten riset smart grid, microgrid PLTS, serta analisis transien sistem kelistrikan tenaga tinggi.",
    category: "RESEARCH",
    status: "OPEN",
    organization: {
      name: "Lab Sistem Tenaga Listrik & EBT",
      type: "LAB",
      faculty: "FTEIC",
      department: "Teknik Elektro",
    },
    divisions: [
      "Divisi Praktikum Mesin Listrik & Gardu Induk",
      "Divisi Riset Smart Grid & Microgrid PLTS Rooftop",
      "Divisi Simulasi ETAP & PSCAD Transien",
    ],
    applicationStart: "2026-11-01",
    applicationEnd: "2026-12-10",
    announcementDate: "2026-12-18",
    quota: 6,
    minGpa: 3.2,
    minSemester: 5,
    maxSemester: 7,
    allowedMajors: ["S1 Teknik Elektro"],
    allowedFaculties: ["FTEIC"],
    requiredSkills: ["Power Electronics", "MATLAB", "ETAP", "Electrical Circuit Analysis"],
    requiredDocs: ["KTM", "Transkrip Nilai (Lulus Mata Kuliah Mesin Listrik Min. AB)", "Curriculum Vitae"],
    benefits: [
      "Honorarium asisten praktikum per shift",
      "Sertifikat Asisten Laboratorium Resmi Departemen Teknik Elektro ITS",
      "Akses modul hardware High Voltage Lab dan Solar Simulator",
      "Prioritas rekomendasi skripsi di bidang sistem tenaga",
    ],
    tags: ["lab", "sistem tenaga", "ebt", "plts", "etap", "teknik elektro", "asisten lab"],
    contactEmail: "lab.power@ee.its.ac.id",
  },

  // 8. TIM RISET: BARUNASTRA ITS (ROBOBOAT TANPA AWAK DUNIA)
  {
    id: "opp-barunastra-2027",
    title: "Open Recruitment Tim Barunastra ITS (Roboboat Tanpa Awak Dunia)",
    slug: "tim-barunastra-its-roboboat",
    description:
      "Barunastra ITS adalah tim kapal cepat otonom tanpa awak (Unmanned Surface Vehicle) juara dunia International Roboboat Competition di Florida, Amerika Serikat. Membuka rekrutmen kru riset electrical, AI navigasi permukaan air, dan desain hidrodinamika kapal.",
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
      "Divisi Programming & Autonomous Navigation (ROS2/Computer Vision)",
      "Divisi Mechanical & Hull Hydrodynamics",
      "Divisi Sponsorship & International Affairs",
    ],
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
    requiredDocs: ["KTM", "Transkrip Nilai", "Curriculum Vitae", "Essay Motivasi"],
    benefits: [
      "Peluang berlaga di International Roboboat Competition di Florida, Amerika Serikat",
      "Pelatihan komprehensif path planning maritim dan sensor fusion LiDAR-Kamera",
      "Poin SKP Kemahasiswaan & networking internasional",
    ],
    tags: ["barunastra", "roboboat", "kapal otonom", "usv", "robotika", "florida", "ros"],
    contactEmail: "barunastra@its.ac.id",
  },

  // 9. EVENT KAMPUS: INI LHO ITS! (ILITS 2027)
  {
    id: "opp-ilits-2027",
    title: "Panitia Ini Lho ITS! 2027 (Sosialisasi & Tryout Akbar Nasional)",
    slug: "panitia-ini-lho-its-2027",
    description:
      "Ini Lho ITS! (ILITS) adalah event branding dan sosialisasi program studi ITS terbesar yang menjangkau ratusan ribu siswa SMA/SMK se-Indonesia, mencakup Open Campus, Bedah Jurusan, dan Tryout Nasional SNBT.",
    category: "COMMITTEE",
    status: "OPEN",
    organization: {
      name: "BEM ITS & Tim Promosi ITS",
      type: "PANITIA",
      faculty: "Institut",
      instagram: "@inilhoits",
    },
    divisions: [
      "Divisi Konseptor Event & Roadshow Daerah",
      "Divisi Public Relations, Media & TikTok Campaign",
      "Divisi Tryout Nasional & Akademik SNBT",
      "Divisi Operasional & Kestari",
    ],
    applicationStart: "2026-11-01",
    applicationEnd: "2026-11-26",
    announcementDate: "2026-12-01",
    quota: 120,
    minGpa: 2.75,
    minSemester: 1,
    maxSemester: 6,
    allowedMajors: [],
    allowedFaculties: [],
    requiredSkills: ["Public Speaking", "Communication", "Event Management", "Content Creation"],
    requiredDocs: ["KTM", "Transkrip Nilai", "Curriculum Vitae"],
    benefits: [
      "Sertifikat Panitia Resmi ILITS dari Rektorat ITS",
      "Poin SKP Kemahasiswaan Bidang Promosi Kampus (20 Poin)",
      "Kesempatan roadshow ke berbagai kota di Indonesia",
    ],
    tags: ["ilits", "ini lho its", "kepanitiaan", "sosialisasi", "tryout", "event"],
    contactEmail: "ilits@its.ac.id",
  },

  // 10. BEASISWA: KARYA SALEMBA EMPAT (KSE)
  {
    id: "opp-kse-2027",
    title: "Beasiswa Karya Salemba Empat (KSE) 2026/2027",
    slug: "beasiswa-karya-salemba-empat-2026",
    description:
      "Program beasiswa tunjangan biaya hidup & pembinaan kepemimpinan berkala bagi mahasiswa aktif ITS berprestasi. Mencakup pelatihan softskill, leadership camp, workshop teknologi, dan jejaring penerima beasiswa nasional se-Indonesia.",
    category: "SCHOLARSHIP",
    status: "OPEN",
    organization: {
      name: "Yayasan Karya Salemba Empat & Ditmawa ITS",
      type: "DITMAWA",
      faculty: "Institut",
      instagram: "@kse_its",
    },
    divisions: ["Program Beasiswa Reguler", "Program Beasiswa Unggul", "Program Beasiswa Skripsi"],
    applicationStart: "2026-11-01",
    applicationEnd: "2026-11-20",
    announcementDate: "2026-12-10",
    quota: 40,
    minGpa: 3.0,
    minSemester: 2,
    maxSemester: 6,
    allowedMajors: [],
    allowedFaculties: [],
    requiredSkills: ["Leadership", "Communication", "Teamwork"],
    requiredDocs: ["KTM", "Transkrip Nilai", "Curriculum Vitae", "Essay Kontribusi", "Surat Keterangan Penghasilan Orang Tua"],
    benefits: [
      "Bantuan dana pendidikan Rp 750.000 / bulan selama 1 tahun",
      "Pelatihan kepemimpinan nasional Tatap Muka KSE",
      "Pendanaan proyek sosial kemasyarakatan (Community Development)",
      "Jejaring ribuan alumni KSE di berbagai BUMN dan korporasi",
    ],
    tags: ["beasiswa", "KSE", "kepemimpinan", "tunjangan", "ITS", "prestasi"],
    contactEmail: "beasiswa@its.ac.id",
    externalLink: "https://beasiswa.or.id",
  },

  // 11. BEASISWA: DJARUM BEASISWA PLUS
  {
    id: "opp-djarum-2027",
    title: "Djarum Beasiswa Plus 2026/2027",
    slug: "djarum-beasiswa-plus-2026",
    description:
      "Program beasiswa bergengsi dari Djarum Foundation yang memberikan dana tunjangan prestasi serta rangkaian pelatihan soft skill tingkat tinggi seperti Character Building, Leadership Development, Nation Building, dan Writing Competition.",
    category: "SCHOLARSHIP",
    status: "OPEN",
    organization: {
      name: "Djarum Foundation",
      type: "EXTERNAL",
      instagram: "@djarumbeasiswaplus",
    },
    divisions: ["Beswan Djarum Reguler"],
    applicationStart: "2026-11-05",
    applicationEnd: "2026-11-28",
    announcementDate: "2026-12-28",
    quota: 25,
    minGpa: 3.2,
    minSemester: 4,
    maxSemester: 6,
    allowedMajors: [],
    allowedFaculties: [],
    requiredSkills: ["Leadership", "Public Speaking", "Critical Thinking", "English"],
    requiredDocs: ["KTM", "Transkrip Nilai", "Bukti Aktif Organisasi", "Curriculum Vitae", "Surat Rekomendasi Fakultas"],
    benefits: [
      "Bantuan dana beasiswa Rp 1.000.000 / bulan selama 12 bulan",
      "Pelatihan Nation Building di Kudus dan Semarang",
      "Pelatihan Character Building & Leadership Development",
      "International Exposure & Writing Competition Djarum",
    ],
    tags: ["beasiswa", "djarum", "softskill", "leadership", "nasional"],
    contactEmail: "beasiswa@djarumplus.org",
    externalLink: "https://djarumbeasiswaplus.org",
  },

  // 12. HIMPUNAN: HMTC ITS (INFORMATIKA & SISTEM INFORMASI)
  {
    id: "opp-hmtc-2027",
    title: "Staff Fungsionaris HMTC ITS 2026/2027 (Teknik Informatika)",
    slug: "staff-hmtc-its-2026-2027",
    description:
      "Himpunan Mahasiswa Teknik Computer & Informatika (HMTC) FTEIC ITS membuka open recruitment staff kepengurusan baru. Menaungi kegiatan coding club, kompetisi pemrograman CP/CTF, inkubasi software house, serta advokasi mahasiswa.",
    category: "ORGANIZATION",
    status: "OPEN",
    organization: {
      name: "HMTC ITS",
      type: "HIMA",
      faculty: "FTEIC",
      department: "Teknik Informatika",
      instagram: "@hmtc_its",
    },
    divisions: [
      "Departemen Ristek & Pengembangan Teknologi (DevLab)",
      "Departemen Kompetisi & Competitive Programming",
      "Departemen PSDM & Internal Affairs",
      "Departemen Hubungan Luar & Partnership",
    ],
    applicationStart: "2026-11-01",
    applicationEnd: "2026-11-24",
    announcementDate: "2026-11-30",
    quota: 40,
    minGpa: 2.75,
    minSemester: 2,
    maxSemester: 6,
    allowedMajors: ["S1 Teknik Informatika", "S1 Sistem Informasi", "S1 Teknologi Informasi"],
    allowedFaculties: ["FTEIC"],
    requiredSkills: ["Programming", "Python", "Web Development", "Git", "Teamwork"],
    requiredDocs: ["KTM", "Transkrip Nilai", "Curriculum Vitae", "Portofolio GitHub"],
    benefits: [
      "Sertifikat Fungsionaris HMTC ITS",
      "Akses private server & repository software development",
      "Poin SKP Kemahasiswaan Bidang Organisasi (20 Poin)",
    ],
    tags: ["hmtc", "informatika", "organisasi", "hima", "software", "programming"],
    contactEmail: "hmtc@if.its.ac.id",
  },
];

// Initial Student Profile (Integrated from myITS Portal SSO)
export const INITIAL_STUDENT_PROFILE: StudentProfileData = {
  nim: "07211940000001",
  name: "Praditya Haekal Islami Al Haqiqi",
  email: "praditya.haekal@student.its.ac.id",
  phone: "081234567890",
  university: "Institut Teknologi Sepuluh Nopember (ITS)",
  faculty: "FTEIC (Fakultas Teknologi Elektro dan Informatika Cerdas)",
  department: "Teknik Elektro",
  major: "S1 Teknik Elektro",
  degreeLevel: "S1 Sarjana",
  semester: 5,
  gpa: 3.72,
  sksCompleted: 96,
  academicAdvisor: "Dr. Budi Santoso, S.T., M.T.",
  focusLab: "Lab Sistem Tertanam & Robotika",
  entryYear: 2024,
  academicStatus: "Aktif (FRS myITS Terverifikasi)",
  bio: "Mahasiswa S1 Teknik Elektro FTEIC ITS semester 5 yang berfokus pada sistem tertanam (embedded systems), IoT, dan otomasi industri. Berpengalaman dalam riset mikrokontroler, prototipe robotik, serta aktif berorganisasi di lingkungan himpunan mahasiswa.",
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
        "Menginisiasi tutorial teknik pemrograman mikrokontroler untuk mahasiswa baru, mengelola inventaris modul trainer Arduino lab, dan menjadi panitia Electrical Expo 2025.",
    },
    {
      id: "exp-2",
      title: "Ketua Tim Proyek PKM-KC",
      organization: "Direktorat Jenderal Pendidikan Tinggi Kemendikbudristek",
      duration: "April 2025 - November 2025",
      description:
        "Memimpin riset 5 mahasiswa lintas prodi dalam mendesain sistem IoT monitoring tambak air payau berbasis LoRa dan solar cell ramah lingkungan.",
    },
    {
      id: "exp-3",
      title: "Asisten Praktikum Dasar Teknik Elektro",
      organization: "Departemen Teknik Elektro FTEIC ITS",
      duration: "September 2025 - Januari 2026",
      description:
        "Mendampingi modul praktikum rangkaian listrik, osiloskop, logika gerbang digital, serta menilai laporan mingguan 45 mahasiswa praktikan.",
    },
  ],
  languages: ["Bahasa Indonesia (Native)", "English (TOEFL ITP: 560)", "Basic Japanese"],
  documentsReady: [
    "KTM",
    "Transkrip Nilai",
    "Curriculum Vitae",
    "Portofolio Proyek",
    "Sertifikat LKMM-TD",
  ],
  cvFileName: "CV_M_Haekal_Teknik_Elektro_ITS.pdf",
  cvParsedAt: "2026-11-05 08:30 WIB",
  cvParsedData: {
    confidenceScore: 96.8,
    detectedSkills: ["Python", "C++", "Arduino", "Embedded Systems", "Machine Learning", "ROS", "MATLAB", "IoT"],
    aiSummary: "Profil mahasiswa sangat kuat di bidang teknik elektro, IoT, dan riset robotik dengan rekam jejak kepemimpinan organisasi himpunan yang aktif.",
  },
};

// Initial Seed Applicants for Event Admin Spreadsheet Demo (e.g. GERIGI ITS, HIMATRO, Bayucaraka)
export const INITIAL_APPLICANTS: ApplicantRecord[] = [
  {
    id: "app-seed-1",
    opportunityId: "opp-gerigi-2027",
    opportunityTitle: "Open Recruitment Panitia GERIGI ITS x UKM Expo 2027",
    organizationName: "BEM ITS & Panitia Pusat GERIGI ITS 2027",
    division: "Divisi Acara & Konseptor Lapangan",
    userId: "user-haekal",
    userName: "M. Haekal Rizky Firmansyah",
    userNim: "07211940000001",
    userDepartment: "S1 Teknik Elektro",
    userFaculty: "FTEIC",
    userSemester: 5,
    userGpa: 3.72,
    userSkills: ["Leadership", "Teamwork", "Public Speaking", "Problem Solving"],
    cvFileName: "CV_M_Haekal_Teknik_Elektro_ITS.pdf",
    coverLetter: "Saya ingin berkontribusi aktif dalam merancang konsep kaderisasi inklusif dan edukatif bagi ribuan mahasiswa baru ITS 2027.",
    appliedAt: "2026-11-05 08:45 WIB",
    status: "SUBMITTED",
    autoFilterPassed: true,
    autoFilterDetails: {
      gpaPassed: true,
      semesterPassed: true,
      majorPassed: true,
      skillsOverlap: 90,
    },
    reasons: [
      "IPK 3.72 melampaui batas minimal 2.75 (Lolos)",
      "Semester 5 berada dalam rentang 2-6 (Lolos)",
      "Memiliki keahlian Leadership & Teamwork yang dibutuhkan (Lolos)",
    ],
    matchScore: 94,
  },
  {
    id: "app-seed-2",
    opportunityId: "opp-gerigi-2027",
    opportunityTitle: "Open Recruitment Panitia GERIGI ITS x UKM Expo 2027",
    organizationName: "BEM ITS & Panitia Pusat GERIGI ITS 2027",
    division: "Divisi Media Informasi, Dokumentasi & Desain (Medfo)",
    userId: "user-dimas",
    userName: "Dimas Arya Pratama",
    userNim: "05211940000045",
    userDepartment: "S1 Sistem Informasi",
    userFaculty: "FTEIC",
    userSemester: 3,
    userGpa: 3.65,
    userSkills: ["Graphic Design", "Figma", "Video Editing", "Content Creation"],
    cvFileName: "CV_Dimas_Arya_UIUX.pdf",
    coverLetter: "Berpengalaman mengelola media sosial dan desain publikasi event kampus.",
    appliedAt: "2026-11-04 14:20 WIB",
    status: "REVIEWED",
    autoFilterPassed: true,
    autoFilterDetails: {
      gpaPassed: true,
      semesterPassed: true,
      majorPassed: true,
      skillsOverlap: 85,
    },
    reasons: [
      "IPK 3.65 >= 2.75 (Lolos)",
      "Semester 3 (Lolos)",
      "Portofolio desain lengkap (Lolos)",
    ],
    matchScore: 91,
  },
  {
    id: "app-seed-3",
    opportunityId: "opp-gerigi-2027",
    opportunityTitle: "Open Recruitment Panitia GERIGI ITS x UKM Expo 2027",
    organizationName: "BEM ITS & Panitia Pusat GERIGI ITS 2027",
    division: "Divisi Fasilitator & Pendamping Maba (LO)",
    userId: "user-siti",
    userName: "Siti Rahmawati",
    userNim: "02311940000088",
    userDepartment: "S1 Teknik Kimia",
    userFaculty: "FTIRS",
    userSemester: 7,
    userGpa: 2.60,
    userSkills: ["Communication", "Event Management"],
    cvFileName: "CV_Siti_Rahmawati.pdf",
    coverLetter: "Ingin mendampingi adik-adik mahasiswa baru sebelum saya lulus.",
    appliedAt: "2026-11-03 10:15 WIB",
    status: "REJECTED",
    autoFilterPassed: false,
    autoFilterDetails: {
      gpaPassed: false,
      semesterPassed: false,
      majorPassed: true,
      skillsOverlap: 50,
    },
    reasons: [
      "IPK 2.60 di bawah batas minimal 2.75 (Tidak Lolos)",
      "Semester 7 melebihi batas maksimal semester 6 (Tidak Lolos)",
    ],
    matchScore: 52,
    notes: "Tidak memenuhi syarat kaku IPK & Semester panitia GERIGI.",
  },
  {
    id: "app-seed-4",
    opportunityId: "opp-himatektro-2027",
    opportunityTitle: "Open Recruitment Fungsionaris HIMATEKTRO ITS Periode 2026/2027",
    organizationName: "HIMATEKTRO ITS",
    division: "Departemen Riset dan Teknologi Terapan (Ristek)",
    userId: "user-haekal",
    userName: "M. Haekal Rizky Firmansyah",
    userNim: "07211940000001",
    userDepartment: "S1 Teknik Elektro",
    userFaculty: "FTEIC",
    userSemester: 5,
    userGpa: 3.72,
    userSkills: ["Arduino", "Python", "C++", "Embedded Systems", "IoT"],
    cvFileName: "CV_M_Haekal_Teknik_Elektro_ITS.pdf",
    coverLetter: "Siap mengabdi memajukan iklim riset teknologi terapan di HIMATEKTRO ITS.",
    appliedAt: "2026-11-05 09:10 WIB",
    status: "ACCEPTED",
    autoFilterPassed: true,
    autoFilterDetails: {
      gpaPassed: true,
      semesterPassed: true,
      majorPassed: true,
      skillsOverlap: 95,
    },
    reasons: [
      "Mahasiswa aktif S1 Teknik Elektro FTEIC (Lolos)",
      "IPK 3.72 >= 2.75 (Lolos)",
      "Keahlian Arduino & Embedded Systems sangat relevan (Lolos)",
    ],
    matchScore: 96,
  },
  {
    id: "app-seed-5",
    opportunityId: "opp-anargya-2027",
    opportunityTitle: "Open Recruitment Tim Riset Anargya Formula EV ITS 2026/2027",
    organizationName: "Tim Riset Anargya Formula EV ITS",
    division: "Divisi Electrical (High Voltage Battery & BMS)",
    userId: "user-aisha",
    userName: "Aisha Putri Ramadhani",
    userNim: "07211940000002",
    userDepartment: "S1 Teknik Elektro",
    userFaculty: "FTEIC",
    userSemester: 5,
    userGpa: 3.78,
    userSkills: ["Circuit Design", "PCB Design", "FPGA", "Embedded Systems", "C++"],
    cvFileName: "CV_Aisha_Putri_Embedded_FPGA.pdf",
    coverLetter: "Pengalaman saya di hardware design sangat siap diaplikasikan pada High Voltage BMS Anargya.",
    appliedAt: "2026-11-04 16:30 WIB",
    status: "SUBMITTED",
    autoFilterPassed: true,
    autoFilterDetails: {
      gpaPassed: true,
      semesterPassed: true,
      majorPassed: true,
      skillsOverlap: 95,
    },
    reasons: [
      "IPK 3.78 >= 3.00 (Lolos)",
      "Jurusan S1 Teknik Elektro sesuai target (Lolos)",
      "Keahlian Circuit & PCB Design sangat cocok (Lolos)",
    ],
    matchScore: 98,
  },
];

// LocalStorage Keys
const PROFILE_STORAGE_KEY = "myits_campusmatch_profile_v4";
const OPPORTUNITIES_STORAGE_KEY = "myits_campusmatch_opps_v4";
const APPLICANTS_STORAGE_KEY = "myits_campusmatch_applicants_v4";

export function getStoredProfile(): StudentProfileData {
  if (typeof window === "undefined") return INITIAL_STUDENT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read profile", e);
  }
  return INITIAL_STUDENT_PROFILE;
}

export function saveStoredProfile(profile: StudentProfileData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
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

export function getStoredApplicants(): ApplicantRecord[] {
  if (typeof window === "undefined") return INITIAL_APPLICANTS;
  try {
    const raw = localStorage.getItem(APPLICANTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read applicants", e);
  }
  return INITIAL_APPLICANTS;
}

export function saveStoredApplicants(applicants: ApplicantRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(APPLICANTS_STORAGE_KEY, JSON.stringify(applicants));
    window.dispatchEvent(new Event("campusmatch:applicants_updated"));
  } catch (e) {
    console.error("Failed to save applicants", e);
  }
}

export function updateApplicantStatus(
  applicantId: string,
  newStatus: "SUBMITTED" | "REVIEWED" | "ACCEPTED" | "REJECTED",
  notes?: string
) {
  const applicants = getStoredApplicants();
  const updated = applicants.map((app) => {
    if (app.id === applicantId) {
      return {
        ...app,
        status: newStatus,
        notes: notes !== undefined ? notes : app.notes,
      };
    }
    return app;
  });
  saveStoredApplicants(updated);
}

// Function to handle student application submission (with division & auto-filter check)
export function submitStudentApplication(
  opp: OpportunityItem,
  profile: StudentProfileData,
  division: string,
  coverLetter?: string
): ApplicantRecord {
  const evaluation = calculateMatch(opp, profile);
  const reasons: string[] = [];

  // Evaluate auto-filter checks
  const gpaPassed = opp.minGpa ? profile.gpa >= opp.minGpa : true;
  const semesterPassed =
    (!opp.minSemester || profile.semester >= opp.minSemester) &&
    (!opp.maxSemester || profile.semester <= opp.maxSemester);

  let majorPassed = true;
  if (opp.allowedMajors && opp.allowedMajors.length > 0) {
    majorPassed = opp.allowedMajors.some(
      (m) => m.toLowerCase() === profile.major.toLowerCase() || profile.major.toLowerCase().includes(m.toLowerCase())
    );
  }

  if (gpaPassed && opp.minGpa) {
    reasons.push(`IPK ${profile.gpa.toFixed(2)} >= ${opp.minGpa.toFixed(2)} (Lolos)`);
  } else if (!gpaPassed && opp.minGpa) {
    reasons.push(`IPK ${profile.gpa.toFixed(2)} di bawah minimum ${opp.minGpa.toFixed(2)} (Tidak Lolos)`);
  }

  if (semesterPassed) {
    reasons.push(`Semester ${profile.semester} sesuai kualifikasi (Lolos)`);
  } else {
    reasons.push(`Semester ${profile.semester} di luar batas yang ditentukan (Tidak Lolos)`);
  }

  if (majorPassed) {
    reasons.push(`Departemen ${profile.major} memenuhi target penerima (Lolos)`);
  } else {
    reasons.push(`Departemen ${profile.major} di luar target jurusan (Tidak Lolos)`);
  }

  const autoFilterPassed = gpaPassed && semesterPassed && majorPassed;

  const newApplicant: ApplicantRecord = {
    id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    opportunityId: opp.id,
    opportunityTitle: opp.title,
    organizationName: opp.organization.name,
    division: division || opp.divisions?.[0] || "Umum",
    userId: profile.nim || "user-current",
    userName: profile.name,
    userNim: profile.nim,
    userDepartment: profile.major,
    userFaculty: profile.faculty,
    userSemester: profile.semester,
    userGpa: profile.gpa,
    userSkills: profile.skills,
    cvFileName: profile.cvFileName || "CV_Terverifikasi_myITS.pdf",
    coverLetter: coverLetter || "",
    appliedAt: new Date().toLocaleString("id-ID"),
    status: "SUBMITTED",
    autoFilterPassed,
    autoFilterDetails: {
      gpaPassed,
      semesterPassed,
      majorPassed,
      skillsOverlap: evaluation.matchedSkills.length > 0 ? 85 : 60,
    },
    reasons,
    matchScore: evaluation.score,
  };

  const currentApplicants = getStoredApplicants();
  saveStoredApplicants([newApplicant, ...currentApplicants]);

  return newApplicant;
}

// Core Matching Algorithm (Calculates realistic Match Score & Criteria check)
export function calculateMatch(
  opp: OpportunityItem,
  profile: StudentProfileData
): MatchEvaluation {
  // 1. GPA Evaluation
  const gpaPassed = opp.minGpa ? profile.gpa >= opp.minGpa : true;

  // 2. Semester Evaluation
  let semesterPassed = true;
  if (opp.minSemester && profile.semester < opp.minSemester) semesterPassed = false;
  if (opp.maxSemester && profile.semester > opp.maxSemester) semesterPassed = false;

  // 3. Faculty & Major Evaluation
  let facultyPassed = true;
  if (opp.allowedFaculties && opp.allowedFaculties.length > 0) {
    facultyPassed = opp.allowedFaculties.some(
      (f) =>
        f.toLowerCase() === profile.faculty.toLowerCase() ||
        profile.faculty.toLowerCase().includes(f.toLowerCase())
    );
  }

  let majorPassed = true;
  if (opp.allowedMajors && opp.allowedMajors.length > 0) {
    majorPassed = opp.allowedMajors.some(
      (m) =>
        m.toLowerCase() === profile.major.toLowerCase() ||
        profile.major.toLowerCase().includes(m.toLowerCase())
    );
  }

  // 4. Skills Match
  const allUserSkills = [
    ...profile.skills.map((s) => s.toLowerCase()),
    ...profile.softSkills.map((s) => s.toLowerCase()),
  ];

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  opp.requiredSkills.forEach((skill) => {
    const sLower = skill.toLowerCase();
    const isMatched = allUserSkills.some(
      (u) => u.includes(sLower) || sLower.includes(u)
    );
    if (isMatched) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // 5. Documents Check
  const userDocs = profile.documentsReady.map((d) => d.toLowerCase());
  const matchedDocs: string[] = [];
  const missingDocs: string[] = [];

  opp.requiredDocs.forEach((doc) => {
    const dLower = doc.toLowerCase();
    const isReady = userDocs.some(
      (ud) => ud.includes(dLower) || dLower.includes(ud)
    );
    if (isReady) {
      matchedDocs.push(doc);
    } else {
      missingDocs.push(doc);
    }
  });

  // Calculate Weighted Score
  let score = 0;
  if (gpaPassed) {
    score += 25;
  } else if (opp.minGpa) {
    const gpaRatio = profile.gpa / opp.minGpa;
    score += Math.max(0, Math.floor(gpaRatio * 20));
  } else {
    score += 25;
  }

  if (semesterPassed) {
    score += 15;
  } else {
    score += 5;
  }

  if (facultyPassed && majorPassed) {
    score += 20;
  } else if (facultyPassed) {
    score += 12;
  } else {
    score += 5;
  }

  // Skills Score (25%)
  if (opp.requiredSkills.length > 0) {
    const skillRatio = matchedSkills.length / opp.requiredSkills.length;
    score += Math.round(skillRatio * 25);
  } else {
    score += 25;
  }

  // Documents Score (15%)
  if (opp.requiredDocs.length > 0) {
    const docRatio = matchedDocs.length / opp.requiredDocs.length;
    score += Math.round(docRatio * 15);
  } else {
    score += 15;
  }

  // Bonus for relevant experiences or achievements
  const relevantText = [
    ...profile.achievements.map((a) => a.title),
    ...profile.experiences.map((e) => `${e.title} ${e.organization}`),
    ...profile.interests,
  ]
    .join(" ")
    .toLowerCase();

  const oppTags = [...opp.tags, opp.title.toLowerCase()];
  let tagBonus = 0;
  oppTags.forEach((tag) => {
    if (relevantText.includes(tag.toLowerCase())) {
      tagBonus += 1;
    }
  });
  score = Math.min(99, score + Math.min(5, tagBonus));

  // Determine Match Status
  let status: "ELIGIBLE" | "PARTIAL" | "INELIGIBLE" = "PARTIAL";
  const hardPassed = gpaPassed && semesterPassed && facultyPassed && majorPassed;

  if (hardPassed && score >= 80) {
    status = "ELIGIBLE";
  } else if (!hardPassed && (!gpaPassed || !semesterPassed || !majorPassed)) {
    status = "INELIGIBLE";
  } else {
    status = "PARTIAL";
  }

  const reasons: string[] = [];
  if (gpaPassed && opp.minGpa) {
    reasons.push(`IPK Anda (${profile.gpa.toFixed(2)}) melampaui batas minimal (${opp.minGpa.toFixed(2)})`);
  } else if (!gpaPassed && opp.minGpa) {
    reasons.push(`IPK saat ini (${profile.gpa.toFixed(2)}) belum mencapai batas minimum (${opp.minGpa.toFixed(2)})`);
  }

  if (semesterPassed) {
    reasons.push(`Semester Anda (${profile.semester}) memenuhi kualifikasi batas pendaftaran`);
  } else {
    reasons.push(`Semester Anda (${profile.semester}) di luar rentang yang ditentukan (${opp.minSemester || 1} - ${opp.maxSemester || 8})`);
  }

  if (facultyPassed && majorPassed) {
    reasons.push(`Program studi ${profile.major} memenuhi target penerima`);
  }

  if (matchedSkills.length > 0) {
    reasons.push(`Keahlian Anda (${matchedSkills.slice(0, 3).join(", ")}) selaras dengan kebutuhan program`);
  }

  // Recommendation text
  let recommendation = "";
  if (status === "ELIGIBLE") {
    recommendation = `Sangat direkomendasikan! Profil akademik & skill Anda di ${profile.major} sangat cocok dengan kriteria ${opp.title}. Siapkan berkas dan segera daftar.`;
  } else if (status === "PARTIAL") {
    recommendation = `Peluang potensial. Kriteria dasar telah terpenuhi, namun Anda disarankan melengkapi kekurangan berkas (${missingDocs.join(", ") || "berkas pendukung"}) atau meningkatkan keahlian ${missingSkills.slice(0, 2).join(", ")}.`;
  } else {
    recommendation = `Belum memenuhi syarat kaku (hard criteria) untuk saat ini. Fokus tingkatkan kualifikasi sesuai rekomendasi gap analysis sebelum periode berikutnya.`;
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

// Generate Detailed Gap Analysis for an Opportunity
export function generateGapAnalysis(
  opp: OpportunityItem,
  profile: StudentProfileData
): DetailedGapItem[] {
  const gaps: DetailedGapItem[] = [];

  // 1. GPA Gap
  if (opp.minGpa && profile.gpa < opp.minGpa) {
    const diff = (opp.minGpa - profile.gpa).toFixed(2);
    gaps.push({
      id: "gap-gpa",
      category: "ACADEMIC",
      title: "Kesenjangan Indeks Prestasi Kumulatif (IPK)",
      currentStatus: `IPK Saat Ini: ${profile.gpa.toFixed(2)}`,
      targetRequirement: `Minimal IPK: ${opp.minGpa.toFixed(2)} (Defisit: -${diff})`,
      priority: "HIGH",
      impact: "Diskualifikasi otomatis pada tahap administrasi berkas",
      actionSteps: [
        "Fokus perbaiki nilai mata kuliah dengan bobot SKS tinggi pada semester ini",
        "Ambil semester pendek (SP) atau perbaikan nilai mata kuliah C/D jika tersedia",
        "Maksimalkan nilai praktikum dan tugas besar lab",
      ],
      completed: false,
    });
  }

  // 2. Semester Gap
  if (opp.minSemester && profile.semester < opp.minSemester) {
    gaps.push({
      id: "gap-sem-min",
      category: "ACADEMIC",
      title: "Kesenjangan Semester Pendaftaran (Terlalu Dini)",
      currentStatus: `Semester ${profile.semester}`,
      targetRequirement: `Minimal Semester ${opp.minSemester}`,
      priority: "HIGH",
      impact: "Persyaratan jenjang studi belum terpenuhi",
      actionSteps: [
        "Persiapkan portofolio dan sertifikat pendukung sambil menunggu semester berikutnya",
        "Ikuti kepanitiaan atau UKM tingkat dasar untuk mematangkan profil",
      ],
      completed: false,
    });
  } else if (opp.maxSemester && profile.semester > opp.maxSemester) {
    gaps.push({
      id: "gap-sem-max",
      category: "ACADEMIC",
      title: "Kesenjangan Semester Pendaftaran (Melebihi Batas)",
      currentStatus: `Semester ${profile.semester}`,
      targetRequirement: `Maksimal Semester ${opp.maxSemester}`,
      priority: "HIGH",
      impact: "Program dikhususkan bagi mahasiswa tingkat awal/menengah",
      actionSteps: [
        "Eksplorasi peluang beasiswa atau lowongan riset yang menargetkan mahasiswa tingkat akhir / alumni",
      ],
      completed: false,
    });
  }

  // 3. Missing Skills Gap
  const allUserSkills = [
    ...profile.skills.map((s) => s.toLowerCase()),
    ...profile.softSkills.map((s) => s.toLowerCase()),
  ];

  opp.requiredSkills.forEach((skill, idx) => {
    const isMatched = allUserSkills.some(
      (u) => u.includes(skill.toLowerCase()) || skill.toLowerCase().includes(u)
    );
    if (!isMatched) {
      gaps.push({
        id: `gap-skill-${idx}`,
        category: "SKILL",
        title: `Belum Memiliki Keahlian: ${skill}`,
        currentStatus: "Belum tercatat dalam CV / Profil Mahasiswa",
        targetRequirement: `Kompetensi Wajib / Diutamakan: ${skill}`,
        priority: "MEDIUM",
        impact: "Menurunkan skor seleksi substansi teknis dan wawancara",
        actionSteps: [
          `Ikuti pelatihan online atau workshop mandiri terkait ${skill}`,
          `Implementasikan proyek sederhana menggunakan ${skill} untuk dimasukkan ke portofolio`,
          `Tambahkan tag keahlian ini di menu My Profile setelah menguasai dasar-dasarnya`,
        ],
        completed: false,
      });
    }
  });

  // 4. Missing Documents Gap
  const userDocs = profile.documentsReady.map((d) => d.toLowerCase());
  opp.requiredDocs.forEach((doc, idx) => {
    const isReady = userDocs.some(
      (ud) => ud.includes(doc.toLowerCase()) || doc.toLowerCase().includes(ud)
    );
    if (!isReady) {
      gaps.push({
        id: `gap-doc-${idx}`,
        category: "DOCUMENT",
        title: `Dokumen Belum Disiapkan: ${doc}`,
        currentStatus: "Belum Diunggah / Belum Terverifikasi",
        targetRequirement: `Wajib Melampirkan: ${doc}`,
        priority: "HIGH",
        impact: "Berkas tidak lengkap dapat membatalkan verifikasi administrasi",
        actionSteps: [
          `Urus penerbitan dokumen ${doc} melalui TU Departemen / Ditmawa / myITS Dokumen`,
          `Simpan dalam format PDF standar ukuran di bawah 2MB`,
          `Beri centang pada kelengkapan berkas di My Profile jika sudah tersedia`,
        ],
        completed: false,
      });
    }
  });

  return gaps;
}
