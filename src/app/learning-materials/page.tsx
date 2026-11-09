"use client";

import React, { useState, useMemo } from "react";
import { Sidebar } from "../../components/layout/sidebar";
import { Header } from "../../components/layout/header";
import { MobileNav } from "../../components/layout/mobile-nav";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  BookOpen,
  Search,
  Lock,
  Unlock,
  ShieldCheck,
  Download,
  UploadCloud,
  FileText,
  FileCheck2,
  FolderLock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Star,
  Clock,
  Sparkles,
  Cpu,
  Radio,
  Wifi,
  Binary,
  Layers,
  HelpCircle,
  Eye,
  AlertTriangle,
} from "lucide-react";

interface MaterialItem {
  id: string;
  courseCode: string;
  courseName: string;
  lecturer: string;
  sks: number;
  type: "SLIDE" | "EXAM_BANK" | "NOTES" | "LAB_GUIDE";
  title: string;
  fileSize: string;
  fileFormat: string;
  downloadsCount: number;
  rating: number;
  updatedAt: string;
  description: string;
}

const COURSES_SEMESTER_5 = [
  {
    code: "EL234505",
    name: "Kecerdasan Buatan dan Machine Learning dalam Telekomunikasi",
    lecturer: "Dr. Ir. Wirawan DEA.",
    sks: 2,
    icon: Binary,
  },
  {
    code: "EL234503",
    name: "Sistem Komunikasi Optik dan VLC",
    lecturer: "Dr. Ir Endroyono DEA",
    sks: 3,
    icon: Wifi,
  },
  {
    code: "EL234504",
    name: "Antena dan Propagasi Radio",
    lecturer: "Dr. Ir. Puji Handayani M.T.",
    sks: 4,
    icon: Radio,
  },
  {
    code: "EL234502",
    name: "Pengolahan Sinyal Multimedia",
    lecturer: "Dr. Ir. Wirawan DEA.",
    sks: 3,
    icon: Layers,
  },
  {
    code: "EL234501",
    name: "Rekayasa Internet",
    lecturer: "Sri Rahayu S.T., M.Kom.",
    sks: 3,
    icon: Wifi,
  },
  {
    code: "EE234504",
    name: "Teknologi Internet of Things",
    lecturer: "Prof. Eko Setijadi S.T., M.T., Ph.D.",
    sks: 2,
    icon: Cpu,
  },
  {
    code: "EL234506",
    name: "Etika Profesi, Standar, dan Regulasi Telekomunikasi",
    lecturer: "Sri Rahayu S.T., M.Kom.",
    sks: 2,
    icon: FileText,
  },
  {
    code: "EL234507",
    name: "Laboratorium Teknik Telekomunikasi 3",
    lecturer: "Prof. Dr.Ir. Achmad Mauludiyanto M.T.",
    sks: 2,
    icon: BookOpen,
  },
];

const INITIAL_MATERIALS: MaterialItem[] = [
  // 1. EL234505
  {
    id: "mat-1",
    courseCode: "EL234505",
    courseName: "Kecerdasan Buatan dan Machine Learning dalam Telekomunikasi",
    lecturer: "Dr. Ir. Wirawan DEA.",
    sks: 2,
    type: "SLIDE",
    title: "Pertemuan 04 - Supervised Learning & CNN in Telecom.pdf",
    fileSize: "14.2 MB",
    fileFormat: "PDF",
    downloadsCount: 342,
    rating: 4.9,
    updatedAt: "2 hari lalu",
    description: "Slide kuliah resmi pertemuan 4 membahas arsitektur Convolutional Neural Networks (CNN) untuk modulasi dan estimasi kanal telekomunikasi.",
  },
  {
    id: "mat-2",
    courseCode: "EL234505",
    courseName: "Kecerdasan Buatan dan Machine Learning dalam Telekomunikasi",
    lecturer: "Dr. Ir. Wirawan DEA.",
    sks: 2,
    type: "EXAM_BANK",
    title: "ETS 2024 - AI & ML Telecom (Soal & Pembahasan).pdf",
    fileSize: "2.1 MB",
    fileFormat: "PDF",
    downloadsCount: 420,
    rating: 5.0,
    updatedAt: "Kemarin",
    description: "Naskah soal resmi ETS 2024 disertai coretan pembahasan rumus loss function, backpropagation gradient, dan klasifikasi sinyal.",
  },

  // 2. EL234503
  {
    id: "mat-3",
    courseCode: "EL234503",
    courseName: "Sistem Komunikasi Optik dan VLC",
    lecturer: "Dr. Ir Endroyono DEA",
    sks: 3,
    type: "SLIDE",
    title: "Minggu 05 - Fiber Attenuation & WDM Systems.pdf",
    fileSize: "18.1 MB",
    fileFormat: "PDF",
    downloadsCount: 285,
    rating: 4.8,
    updatedAt: "3 hari lalu",
    description: "Materi slide tentang redaman serat optik SMF-28, dispersi kromatik, serta prinsip multiplexing Wavelength Division Multiplexing (WDM).",
  },
  {
    id: "mat-4",
    courseCode: "EL234503",
    courseName: "Sistem Komunikasi Optik dan VLC",
    lecturer: "Dr. Ir Endroyono DEA",
    sks: 3,
    type: "EXAM_BANK",
    title: "EAS 2023 - Sistem Komunikasi Optik.pdf",
    fileSize: "1.8 MB",
    fileFormat: "PDF",
    downloadsCount: 310,
    rating: 4.8,
    updatedAt: "4 hari lalu",
    description: "Arsip bank soal Evaluasi Akhir Semester 2023 seputar link budget optik, receiver PIN/APD, dan sistem transmisi Visible Light Communication.",
  },

  // 3. EL234504
  {
    id: "mat-5",
    courseCode: "EL234504",
    courseName: "Antena dan Propagasi Radio",
    lecturer: "Dr. Ir. Puji Handayani M.T.",
    sks: 4,
    type: "SLIDE",
    title: "Modul 04 - Dipole Antenna & Radiation Pattern.pdf",
    fileSize: "22.5 MB",
    fileFormat: "PDF",
    downloadsCount: 390,
    rating: 4.9,
    updatedAt: "3 hari lalu",
    description: "Slide kuliah lengkap perhitungan pola radiasi antena dipol setengah gelombang, direktivitas, gain, dan impedansi radiasi.",
  },
  {
    id: "mat-6",
    courseCode: "EL234504",
    courseName: "Antena dan Propagasi Radio",
    lecturer: "Dr. Ir. Puji Handayani M.T.",
    sks: 4,
    type: "LAB_GUIDE",
    title: "Panduan Pengukuran Return Loss & VSWR.pdf",
    fileSize: "4.1 MB",
    fileFormat: "PDF",
    downloadsCount: 275,
    rating: 4.7,
    updatedAt: "5 hari lalu",
    description: "Panduan praktis kalibrasi Vector Network Analyzer (VNA) untuk pengukuran parameter S11, return loss, dan VSWR antena di anechoic chamber.",
  },

  // 4. EL234502
  {
    id: "mat-7",
    courseCode: "EL234502",
    courseName: "Pengolahan Sinyal Multimedia",
    lecturer: "Dr. Ir. Wirawan DEA.",
    sks: 3,
    type: "SLIDE",
    title: "Lecture 06 - 2D Discrete Cosine Transform & Image Compression.pdf",
    fileSize: "12.0 MB",
    fileFormat: "PDF",
    downloadsCount: 230,
    rating: 4.8,
    updatedAt: "6 hari lalu",
    description: "Presentasi teori matematis 2D-DCT, kuantisasi koefisien frekuensi tinggi, dan algoritma standar kompresi citra JPEG.",
  },
  {
    id: "mat-8",
    courseCode: "EL234502",
    courseName: "Pengolahan Sinyal Multimedia",
    lecturer: "Dr. Ir. Wirawan DEA.",
    sks: 3,
    type: "EXAM_BANK",
    title: "Kumpulan Soal ETS Citra & Audio 2022-2024.pdf",
    fileSize: "5.6 MB",
    fileFormat: "PDF",
    downloadsCount: 360,
    rating: 4.9,
    updatedAt: "Kemarin",
    description: "Kompilasi soal ujian ETS 3 tahun berturut-turut untuk materi filtering spasial konvolusi, histogram equalization, dan audio sampling.",
  },

  // 5. EL234501
  {
    id: "mat-9",
    courseCode: "EL234501",
    courseName: "Rekayasa Internet",
    lecturer: "Sri Rahayu S.T., M.Kom.",
    sks: 3,
    type: "SLIDE",
    title: "Bab 04 - BGP Routing, SDN Architecture & IPv6.pdf",
    fileSize: "8.4 MB",
    fileFormat: "PDF",
    downloadsCount: 298,
    rating: 4.9,
    updatedAt: "4 hari lalu",
    description: "Slide perkuliahan protokol routing eksternal Border Gateway Protocol (BGP), arsitektur Software-Defined Networking (SDN), dan transisi IPv4/IPv6.",
  },
  {
    id: "mat-10",
    courseCode: "EL234501",
    courseName: "Rekayasa Internet",
    lecturer: "Sri Rahayu S.T., M.Kom.",
    sks: 3,
    type: "NOTES",
    title: "Cheatsheet Konfigurasi OSPF & Wireshark.pdf",
    fileSize: "2.2 MB",
    fileFormat: "PDF",
    downloadsCount: 450,
    rating: 5.0,
    updatedAt: "2 hari lalu",
    description: "Catatan ringkas sintaks CLI Cisco Packet Tracer untuk area OSPF multi-area dan filter packet capture Wireshark untuk troubleshooting.",
  },

  // 6. EE234504
  {
    id: "mat-11",
    courseCode: "EE234504",
    courseName: "Teknologi Internet of Things",
    lecturer: "Prof. Eko Setijadi S.T., M.T., Ph.D.",
    sks: 2,
    type: "SLIDE",
    title: "Week 07 - MQTT Protocol, ESP32 Architecture & Edge AI.pdf",
    fileSize: "15.7 MB",
    fileFormat: "PDF",
    downloadsCount: 380,
    rating: 4.9,
    updatedAt: "2 hari lalu",
    description: "Materi arsitektur pinout ESP32, FreeRTOS dual-core multitasking, lightweight publish/subscribe MQTT, dan pengenalan Edge Impulse.",
  },
  {
    id: "mat-12",
    courseCode: "EE234504",
    courseName: "Teknologi Internet of Things",
    lecturer: "Prof. Eko Setijadi S.T., M.T., Ph.D.",
    sks: 2,
    type: "EXAM_BANK",
    title: "ETS 2024 - Desain Sistem IoT Mandiri.pdf",
    fileSize: "2.0 MB",
    fileFormat: "PDF",
    downloadsCount: 315,
    rating: 4.8,
    updatedAt: "3 hari lalu",
    description: "Soal evaluasi tengah semester perancangan sistem smart metering berdaya rendah dengan protokol LoRaWAN dan enkripsi payload.",
  },

  // 7. EL234506
  {
    id: "mat-13",
    courseCode: "EL234506",
    courseName: "Etika Profesi, Standar, dan Regulasi Telekomunikasi",
    lecturer: "Sri Rahayu S.T., M.Kom.",
    sks: 2,
    type: "SLIDE",
    title: "Regulasi Spektrum Frekuensi Kominfo & UU ITE 2024.pdf",
    fileSize: "6.1 MB",
    fileFormat: "PDF",
    downloadsCount: 195,
    rating: 4.7,
    updatedAt: "1 minggu lalu",
    description: "Slide telaah yuridis alokasi pita frekuensi radio nasional 700 MHz - 3.5 GHz dan pasal perlindungan data pribadi UU ITE.",
  },
  {
    id: "mat-14",
    courseCode: "EL234506",
    courseName: "Etika Profesi, Standar, dan Regulasi Telekomunikasi",
    lecturer: "Sri Rahayu S.T., M.Kom.",
    sks: 2,
    type: "NOTES",
    title: "Studi Kasus Pelanggaran Cyber & Standar ITU-T.pdf",
    fileSize: "3.8 MB",
    fileFormat: "PDF",
    downloadsCount: 220,
    rating: 4.8,
    updatedAt: "5 hari lalu",
    description: "Rangkuman studi kasus insiden keamanan telekomunikasi, standar interoperabilitas ITU-T seri X, dan kode etik insinyur PII.",
  },

  // 8. EL234507
  {
    id: "mat-15",
    courseCode: "EL234507",
    courseName: "Laboratorium Teknik Telekomunikasi 3",
    lecturer: "Prof. Dr.Ir. Achmad Mauludiyanto M.T.",
    sks: 2,
    type: "LAB_GUIDE",
    title: "Modul Praktikum Resmi Lab Telkom Ganjil 2024/2025.pdf",
    fileSize: "9.8 MB",
    fileFormat: "PDF",
    downloadsCount: 512,
    rating: 5.0,
    updatedAt: "Baru saja",
    description: "Buku panduan praktikum lengkap: Modul 1 Spectrum Analyzer, Modul 2 Slicing Fiber Optik, Modul 3 Link Satelit, Modul 4 Antenna Array.",
  },
  {
    id: "mat-16",
    courseCode: "EL234507",
    courseName: "Laboratorium Teknik Telekomunikasi 3",
    lecturer: "Prof. Dr.Ir. Achmad Mauludiyanto M.T.",
    sks: 2,
    type: "NOTES",
    title: "Template Laporan Resmi Praktikum Telkom 3.docx",
    fileSize: "450 KB",
    fileFormat: "DOCX",
    downloadsCount: 680,
    rating: 5.0,
    updatedAt: "Baru saja",
    description: "Format resmi dokumen laporan praktikum IEEE style lengkap dengan cover departemen, tabel data pengukuran, dan lembar asistensi lab.",
  },
];

export default function LearningMaterialsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [materials, setMaterials] = useState<MaterialItem[]>(INITIAL_MATERIALS);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>("ALL");

  // Download simulation state
  const [downloadingItem, setDownloadingItem] = useState<MaterialItem | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadCourse, setUploadCourse] = useState("EL234505");
  const [uploadType, setUploadType] = useState<MaterialItem["type"]>("EXAM_BANK");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleDownloadClick = (item: MaterialItem) => {
    setDownloadingItem(item);
    setDownloadProgress(20);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingItem(null);
            setDownloadProgress(0);
            showToast(`Mengunduh berkas materi "${item.title}"... Berkas berhasil disimpan.`);
          }, 350);
          return 100;
        }
        return prev + 30;
      });
    }, 180);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const matchedCourse = COURSES_SEMESTER_5.find((c) => c.code === uploadCourse);
    const newItem: MaterialItem = {
      id: `mat-${Date.now()}`,
      courseCode: uploadCourse,
      courseName: matchedCourse ? matchedCourse.name : "Departemen Teknik Elektro",
      lecturer: matchedCourse ? matchedCourse.lecturer : "Dosen Departemen",
      sks: matchedCourse ? matchedCourse.sks : 3,
      type: uploadType,
      title: uploadTitle.endsWith(".pdf") || uploadTitle.endsWith(".docx") ? uploadTitle : `${uploadTitle}.pdf`,
      fileSize: "3.5 MB",
      fileFormat: "PDF",
      downloadsCount: 1,
      rating: 5.0,
      updatedAt: "Baru saja",
      description: uploadDesc || "Materi sumbangan mahasiswa terverifikasi SSO Departemen Teknik Elektro.",
    };

    setMaterials([newItem, ...materials]);
    setUploadModalOpen(false);
    setUploadTitle("");
    setUploadDesc("");
    showToast("Terima kasih! Kontribusi materi Anda berhasil diunggah dan terverifikasi untuk sesama mahasiswa.");
  };

  // Detect external department search queries (e.g. Kalkulus, Struktur Data, Farmasi, etc.)
  const isExternalSearch = useMemo(() => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    const externalKeywords = [
      "kalkulus",
      "struktur data",
      "farmasi",
      "sipil",
      "mesin",
      "arsitektur",
      "biologi",
      "kimia fisika",
      "hukum",
      "kedokteran",
      "akuntansi",
      "manajemen bisnis",
    ];
    return externalKeywords.some((k) => q.includes(k));
  }, [searchQuery]);

  // Filter logic
  const filteredMaterials = useMemo(() => {
    if (isExternalSearch) return [];

    return materials.filter((item) => {
      if (selectedType !== "ALL" && item.type !== selectedType) {
        return false;
      }
      if (selectedCourseCode !== "ALL" && item.courseCode !== selectedCourseCode) {
        return false;
      }
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(q);
        const inCourse = item.courseName.toLowerCase().includes(q);
        const inCode = item.courseCode.toLowerCase().includes(q);
        const inLecturer = item.lecturer.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        if (!inTitle && !inCourse && !inCode && !inLecturer && !inDesc) {
          return false;
        }
      }
      return true;
    });
  }, [materials, selectedType, selectedCourseCode, searchQuery, isExternalSearch]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        role="STUDENT"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        user={{
          name: "Praditya Haekal Islami Al Haqiqi",
          role: "Departemen Teknik Elektro",
          initials: "PH",
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title="Materi Kuliah & Bank Soal Teknik Elektro"
          userName="Praditya Haekal Islami Al Haqiqi"
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          searchPlaceholder="Cari kode MK (EL234504), dosen (Dr. Wirawan), atau berkas..."
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-8 space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-20 right-4 z-50 max-w-md bg-blue-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-blue-700 animate-in fade-in slide-in-from-top-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-xs md:text-sm font-medium">{toastMessage}</p>
            </div>
          )}

          {/* Banner Hero: Department-Locked Header */}
          <div className="bg-gradient-to-r from-[#013880] to-[#0D47A1] rounded-2xl p-5 md:p-7 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1.5 py-1 px-3 rounded-lg shadow-xs border-none">
                    <ShieldCheck className="w-4 h-4" />
                    🔒 Terverifikasi myITS SSO: Departemen Teknik Elektro (FTEIC)
                  </Badge>
                  <span className="text-xs text-blue-200 font-medium">Hak Akses Khusus S1 Teknik Elektro</span>
                </div>

                <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                  Katalog Kurikulum & Bank Soal S1 Teknik Elektro Semester 5
                </h1>
                <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
                  Katalog materi, bank soal ujian, dan slide kuliah dikurasi khusus dan terkunci untuk mahasiswa aktif Departemen Teknik Elektro.
                </p>

                {/* Simulated Student Profile Data Card */}
                <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-blue-100 bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/20 w-fit">
                  <span className="flex items-center gap-1 font-bold text-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Praditya
                  </span>
                  <span className="text-white/40">•</span>
                  <span>NRP: <strong className="text-white">5009221000</strong></span>
                  <span className="text-white/40">•</span>
                  <span>Departemen: <strong className="text-white">S1 Teknik Elektro (FTEIC)</strong></span>
                  <span className="text-white/40">•</span>
                  <span>Semester: <strong className="text-white">5</strong></span>
                  <span className="text-white/40">•</span>
                  <span className="text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">
                    Akses SSO Terbuka
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                <Button
                  onClick={() => setUploadModalOpen(true)}
                  className="bg-white text-[#013880] hover:bg-blue-50 font-bold text-xs md:text-sm gap-2 rounded-xl py-2.5 px-4 shadow-sm"
                >
                  <UploadCloud className="w-4 h-4" />
                  Unggah Materi
                </Button>
                <div className="text-[11px] text-blue-200 text-center lg:text-right font-medium">
                  8 Mata Kuliah Resmi Terverifikasi
                </div>
              </div>
            </div>
          </div>

          {/* Quick Course Selector Ribbon */}
          <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 px-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Pilih Mata Kuliah Kurikulum Semester 5:
              </p>
              {/* Dropdown pilih mata kuliah */}
              <select
                value={selectedCourseCode}
                onChange={(e) => setSelectedCourseCode(e.target.value)}
                className="text-xs font-semibold border border-slate-200 rounded-lg p-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#013880] w-full sm:w-auto"
              >
                <option value="ALL">Semua Mata Kuliah Semester 5</option>
                {COURSES_SEMESTER_5.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name} ({c.sks} SKS)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              <button
                onClick={() => setSelectedCourseCode("ALL")}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all shrink-0 ${
                  selectedCourseCode === "ALL"
                    ? "bg-[#013880] text-white font-bold shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Semua Mata Kuliah (8)
              </button>
              {COURSES_SEMESTER_5.map((c) => {
                const isSelected = selectedCourseCode === c.code;
                return (
                  <button
                    key={c.code}
                    onClick={() => setSelectedCourseCode(c.code)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? "bg-[#013880] text-white font-bold shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <c.icon className="w-3.5 h-3.5" />
                    <span>{c.code}</span>
                    <span className="hidden sm:inline text-[11px] opacity-80">({c.sks} SKS)</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & Filter Category Bar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Cari materi, kode MK (contoh: EL234504), atau nama dosen pengampu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs md:text-sm border-slate-200 focus-visible:ring-[#013880] rounded-lg"
                />
              </div>

              {/* Filter Kategori Berkas */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: "ALL", label: "Semua Tipe" },
                  { key: "SLIDE", label: "Slide Kuliah" },
                  { key: "EXAM_BANK", label: "Bank Soal (ETS/EAS)" },
                  { key: "NOTES", label: "Catatan Mahasiswa" },
                  { key: "LAB_GUIDE", label: "Panduan Lab" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setSelectedType(t.key)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                      selectedType === t.key
                        ? "bg-[#013880] text-white font-semibold shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* State Kosong Khusus Jika Pengguna Mencari di Luar Departemen Teknik Elektro */}
          {isExternalSearch ? (
            <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-8 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-amber-900">
                ⚠️ Mata kuliah tidak ditemukan dalam katalog Departemen Teknik Elektro. Anda tidak memiliki izin akses ke repositori departemen lain.
              </h3>
              <p className="text-xs md:text-sm text-amber-800 max-w-lg mx-auto leading-relaxed">
                Akses materi dan bank soal di myITS dibatasi sesuai registrasi departemen Anda di SSO myITS (Departemen Teknik Elektro).
              </p>
              <div className="pt-2">
                <Button
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
                >
                  Kembali ke Katalog Teknik Elektro
                </Button>
              </div>
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">Tidak ada berkas yang sesuai dengan kriteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Coba sesuaikan kata kunci pencarian atau ubah kategori tipe berkas.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("ALL");
                  setSelectedCourseCode("ALL");
                }}
                className="text-xs"
              >
                Reset Semua Filter
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMaterials.map((item) => (
                <Card
                  key={item.id}
                  className="border border-slate-200 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
                >
                  <CardHeader className="p-4 md:p-5 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#013880] bg-[#013880]/10 px-2 py-0.5 rounded-md border border-[#013880]/20">
                            {item.courseCode}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {item.sks} SKS
                          </span>
                          <Badge
                            className={`text-[10px] font-semibold ${
                              item.type === "EXAM_BANK"
                                ? "bg-rose-100 text-rose-800 border-rose-200"
                                : item.type === "LAB_GUIDE"
                                ? "bg-teal-100 text-teal-800 border-teal-200"
                                : item.type === "SLIDE"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : "bg-purple-100 text-purple-800 border-purple-200"
                            }`}
                          >
                            {item.type === "EXAM_BANK"
                              ? "Bank Soal (ETS/EAS)"
                              : item.type === "LAB_GUIDE"
                              ? "Panduan Lab"
                              : item.type === "SLIDE"
                              ? "Slide Kuliah"
                              : "Catatan Mahasiswa"}
                          </Badge>
                        </div>
                        <h4 className="text-xs text-slate-500 font-medium">
                          {item.courseName}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug pt-2">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Dosen: <strong className="text-slate-700">{item.lecturer}</strong>
                    </p>
                  </CardHeader>

                  <CardContent className="p-4 md:p-5 pt-0 space-y-3.5 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/80 p-3 rounded-lg border border-slate-100">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-700">{item.fileFormat} • {item.fileSize}</span>
                        <span className="text-slate-300">|</span>
                        <span>{item.downloadsCount}x diunduh</span>
                      </div>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {item.updatedAt}
                      </span>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleDownloadClick(item)}
                        className="flex-1 bg-gradient-to-r from-[#013880] to-[#0D47A1] hover:from-[#012d66] hover:to-[#09357a] text-white font-semibold text-xs gap-1.5 rounded-xl py-2.5 shadow-xs transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Unduh Berkas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      <MobileNav />

      {/* MODAL SIMULASI UNDUH */}
      <Dialog open={!!downloadingItem} onOpenChange={(open) => !open && setDownloadingItem(null)}>
        <DialogContent className="max-w-md w-[92vw] sm:w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-[#013880]" />
              Mengunduh berkas materi...
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {downloadingItem?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1">
              <p><strong>Mata Kuliah:</strong> {downloadingItem?.courseName} ({downloadingItem?.courseCode})</p>
              <p><strong>Ukuran File:</strong> {downloadingItem?.fileSize} ({downloadingItem?.fileFormat})</p>
              <p><strong>Dosen:</strong> {downloadingItem?.lecturer}</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Status Proses</span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#013880] to-[#0D47A1] transition-all duration-200 rounded-full"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Watermark SSO diterapkan otomatis untuk NRP 5009221000.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL UNGGAH MATERI */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-lg w-[92vw] sm:w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#013880]" />
              Unggah Materi Dokumen Kontribusi Mahasiswa
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Bagikan slide perkuliahan, bank soal ujian, atau catatan belajar untuk sesama mahasiswa Departemen Teknik Elektro.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-3.5 py-1 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Pilih Mata Kuliah Kurikulum Semester 5 *
              </label>
              <select
                value={uploadCourse}
                onChange={(e) => setUploadCourse(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#013880]"
              >
                {COURSES_SEMESTER_5.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name} ({c.lecturer})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kategori Berkas *</label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value as any)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#013880]"
                >
                  <option value="SLIDE">Slide Kuliah</option>
                  <option value="EXAM_BANK">Bank Soal (ETS/EAS)</option>
                  <option value="NOTES">Catatan Mahasiswa</option>
                  <option value="LAB_GUIDE">Panduan Lab</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pilih Dokumen File *</label>
                <input
                  type="file"
                  required
                  className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#013880] hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Judul Dokumen Materi *</label>
              <Input
                placeholder="Contoh: Rangkuman Lengkap Rumus Antena & Propagasi ETS 2024"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Catatan & Deskripsi Materi
              </label>
              <textarea
                rows={3}
                value={uploadDesc}
                onChange={(e) => setUploadDesc(e.target.value)}
                placeholder="Jelaskan cakupan materi, tahun soal ujian, atau catatan penting penggunaan..."
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#013880]"
              />
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-[#013880] space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#013880]" /> Perlindungan Integritas Akademik myITS
              </p>
              <p className="text-[11px] text-blue-900 leading-relaxed">
                Setiap dokumen yang diunggah akan melalui verifikasi kepatuhan etika akademik dan watermark NRP mahasiswa pengunggah.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUploadModalOpen(false)}
                className="text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-gradient-to-r from-[#013880] to-[#0D47A1] hover:from-[#012d66] hover:to-[#09357a] text-white text-xs font-semibold"
              >
                Kirim & Bagikan Materi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
