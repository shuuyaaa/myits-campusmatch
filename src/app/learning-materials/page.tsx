"use client";

import React, { useState, useMemo } from "react";
import { Sidebar } from "../../components/layout/sidebar";
import { Header } from "../../components/layout/header";
import { MobileNav } from "../../components/layout/mobile-nav";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
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
  CheckCircle2,
  Star,
  Clock,
  Cpu,
  Radio,
  Wifi,
  Binary,
  Layers,
  Code2,
  Database,
  GraduationCap,
  Award,
  Globe,
  UserCheck,
} from "lucide-react";

type UploaderRole = "STUDENT" | "LECTURER" | "HIMPUNAN";
type DifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

interface CourseMeta {
  code: string;
  name: string;
  department: string;
  semester: number;
  level: DifficultyLevel;
  lecturer: string;
  sks: number;
  icon: React.ElementType;
}

interface MaterialItem {
  id: string;
  courseCode: string;
  courseName: string;
  department: string;
  semester: number;
  level: DifficultyLevel;
  lecturer: string;
  uploadedByRole: "Dosen Departemen" | "Himpunan — Dept. Ilmu Keprofesian";
  uploaderName: string;
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

const ALL_COURSES: CourseMeta[] = [
  // Teknik Elektro Sem 1 - 8 (Beginner -> Expert)
  {
    code: "EL234101",
    name: "Rangkaian Listrik I & Dasar Kelistrikan",
    department: "Departemen Teknik Elektro",
    semester: 1,
    level: "BEGINNER",
    lecturer: "Dr. Eng. Aris Munandar, S.T., M.T.",
    sks: 3,
    icon: Cpu,
  },
  {
    code: "EL234202",
    name: "Dasar Pemrograman C & Algoritma Teknik",
    department: "Departemen Teknik Elektro",
    semester: 2,
    level: "BEGINNER",
    lecturer: "Sri Rahayu S.T., M.Kom.",
    sks: 3,
    icon: Code2,
  },
  {
    code: "EL234301",
    name: "Elektronika Analog & Digital",
    department: "Departemen Teknik Elektro",
    semester: 3,
    level: "INTERMEDIATE",
    lecturer: "Dr. Ir. Hendra Kusuma, M.Eng.Sc.",
    sks: 4,
    icon: Cpu,
  },
  {
    code: "EL234403",
    name: "Sinyal, Sistem & Transformasi Fourier",
    department: "Departemen Teknik Elektro",
    semester: 4,
    level: "INTERMEDIATE",
    lecturer: "Dr. Ir. Wirawan DEA.",
    sks: 3,
    icon: Layers,
  },
  {
    code: "EL234505",
    name: "Kecerdasan Buatan & ML dalam Telekomunikasi",
    department: "Departemen Teknik Elektro",
    semester: 5,
    level: "ADVANCED",
    lecturer: "Dr. Ir. Wirawan DEA.",
    sks: 2,
    icon: Binary,
  },
  {
    code: "EL234504",
    name: "Antena dan Propagasi Radio",
    department: "Departemen Teknik Elektro",
    semester: 5,
    level: "ADVANCED",
    lecturer: "Dr. Ir. Puji Handayani M.T.",
    sks: 4,
    icon: Radio,
  },
  {
    code: "EL234602",
    name: "Sistem Komunikasi Bergerak 5G & Nirkabel",
    department: "Departemen Teknik Elektro",
    semester: 6,
    level: "ADVANCED",
    lecturer: "Prof. Eko Setijadi S.T., M.T., Ph.D.",
    sks: 3,
    icon: Wifi,
  },
  {
    code: "EL234701",
    name: "Sistem Komunikasi Optik, VLC & Riset Lanjut",
    department: "Departemen Teknik Elektro",
    semester: 7,
    level: "EXPERT",
    lecturer: "Dr. Ir Endroyono DEA",
    sks: 3,
    icon: Wifi,
  },
  {
    code: "EL234801",
    name: "Kapita Selekta, Regulasi & Desain Sistem TA",
    department: "Departemen Teknik Elektro",
    semester: 8,
    level: "EXPERT",
    lecturer: "Prof. Dr. Ir. Achmad Mauludiyanto M.T.",
    sks: 2,
    icon: BookOpen,
  },

  // Teknik Informatika (Open-Source Lintas Jurusan)
  {
    code: "IF234101",
    name: "Algoritma & Pemrograman Dasar",
    department: "Departemen Teknik Informatika",
    semester: 1,
    level: "BEGINNER",
    lecturer: "Dr. Rizky Januar Akbar, S.Kom., M.Eng.",
    sks: 4,
    icon: Code2,
  },
  {
    code: "IF234402",
    name: "Basis Data Relasional & Arsitektur SQL",
    department: "Departemen Teknik Informatika",
    semester: 4,
    level: "INTERMEDIATE",
    lecturer: "Fajar Baskoro, S.Kom., M.T.",
    sks: 3,
    icon: Database,
  },
  {
    code: "IF234508",
    name: "Pemrograman Web Full-Stack (Next.js & TypeScript)",
    department: "Departemen Teknik Informatika",
    semester: 5,
    level: "ADVANCED",
    lecturer: "Imam Kuswardayan, S.Kom., M.T.",
    sks: 3,
    icon: Code2,
  },

  // Sistem Informasi (Open-Source Lintas Jurusan)
  {
    code: "SI234301",
    name: "Manajemen Proyek TI & Rekayasa Kebutuhan",
    department: "Departemen Sistem Informasi",
    semester: 3,
    level: "INTERMEDIATE",
    lecturer: "Dr. Erma Suryani, S.T., M.T.",
    sks: 3,
    icon: Layers,
  },
];

const INITIAL_MATERIALS: MaterialItem[] = [
  {
    id: "mat-el-1",
    courseCode: "EL234101",
    courseName: "Rangkaian Listrik I & Dasar Kelistrikan",
    department: "Departemen Teknik Elektro",
    semester: 1,
    level: "BEGINNER",
    lecturer: "Dr. Eng. Aris Munandar, S.T., M.T.",
    uploadedByRole: "Dosen Departemen",
    uploaderName: "Dr. Eng. Aris Munandar, S.T., M.T.",
    sks: 3,
    type: "SLIDE",
    title: "Modul 01 - Hukum Ohm, Kirchhoff & Analisis Node.pdf",
    fileSize: "6.4 MB",
    fileFormat: "PDF",
    downloadsCount: 840,
    rating: 4.9,
    updatedAt: "1 minggu lalu",
    description: "Materi fondasi tingkat Beginner untuk mahasiswa baru semester 1 sebelum melangkah ke rangkaian AC dan elektronika lanjutan.",
  },
  {
    id: "mat-el-2",
    courseCode: "EL234301",
    courseName: "Elektronika Analog & Digital",
    department: "Departemen Teknik Elektro",
    semester: 3,
    level: "INTERMEDIATE",
    lecturer: "Dr. Ir. Hendra Kusuma, M.Eng.Sc.",
    uploadedByRole: "Himpunan — Dept. Ilmu Keprofesian",
    uploaderName: "Dept. Ilmu Keprofesian HIMATEKTRO",
    sks: 4,
    type: "EXAM_BANK",
    title: "Kumpulan Soal ETS Elektronika (2021–2025) + Pembahasan.pdf",
    fileSize: "11.2 MB",
    fileFormat: "PDF",
    downloadsCount: 615,
    rating: 5.0,
    updatedAt: "3 hari lalu",
    description: "Bank soal lengkap dikurasi tim Ilmu Keprofesian HIMATEKTRO mencakup analisis dioda, BJT, Op-Amp, dan rangkaian gerbang logika.",
  },
  {
    id: "mat-el-3",
    courseCode: "EL234505",
    courseName: "Kecerdasan Buatan & ML dalam Telekomunikasi",
    department: "Departemen Teknik Elektro",
    semester: 5,
    level: "ADVANCED",
    lecturer: "Dr. Ir. Wirawan DEA.",
    uploadedByRole: "Dosen Departemen",
    uploaderName: "Dr. Ir. Wirawan DEA.",
    sks: 2,
    type: "SLIDE",
    title: "Pertemuan 04 - Supervised Learning & CNN in Telecom.pdf",
    fileSize: "14.2 MB",
    fileFormat: "PDF",
    downloadsCount: 342,
    rating: 4.9,
    updatedAt: "2 hari lalu",
    description: "Slide kuliah resmi arsitektur CNN untuk klasifikasi modulasi dan estimasi kanal telekomunikasi. Terbuka juga bagi mahasiswa baru yang ingin mencuri start belajar AI.",
  },
  {
    id: "mat-el-4",
    courseCode: "EL234504",
    courseName: "Antena dan Propagasi Radio",
    department: "Departemen Teknik Elektro",
    semester: 5,
    level: "ADVANCED",
    lecturer: "Dr. Ir. Puji Handayani M.T.",
    uploadedByRole: "Himpunan — Dept. Ilmu Keprofesian",
    uploaderName: "Dept. Ilmu Keprofesian HIMATEKTRO",
    sks: 4,
    type: "EXAM_BANK",
    title: "Bank Soal EAS Antena & Propagasi + Kunci Jawaban.pdf",
    fileSize: "8.7 MB",
    fileFormat: "PDF",
    downloadsCount: 495,
    rating: 4.9,
    updatedAt: "5 hari lalu",
    description: "Pembahasan lengkap diagram radiasi, VSWR, Smith Chart, dan perancangan antena mikrostrip.",
  },
  {
    id: "mat-el-5",
    courseCode: "EL234701",
    courseName: "Sistem Komunikasi Optik, VLC & Riset Lanjut",
    department: "Departemen Teknik Elektro",
    semester: 7,
    level: "EXPERT",
    lecturer: "Dr. Ir Endroyono DEA",
    uploadedByRole: "Dosen Departemen",
    uploaderName: "Dr. Ir Endroyono DEA",
    sks: 3,
    type: "LAB_GUIDE",
    title: "Panduan Riset & Simulasi Visible Light Communication (OptiSystem).pdf",
    fileSize: "9.8 MB",
    fileFormat: "PDF",
    downloadsCount: 280,
    rating: 4.9,
    updatedAt: "4 hari lalu",
    description: "Materi tingkat Expert Semester 7 untuk persiapan riset Tugas Akhir bidang komunikasi optik dan transmisi Li-Fi.",
  },
  {
    id: "mat-if-1",
    courseCode: "IF234508",
    courseName: "Pemrograman Web Full-Stack (Next.js & TypeScript)",
    department: "Departemen Teknik Informatika",
    semester: 5,
    level: "ADVANCED",
    lecturer: "Imam Kuswardayan, S.Kom., M.T.",
    uploadedByRole: "Dosen Departemen",
    uploaderName: "Imam Kuswardayan, S.Kom., M.T.",
    sks: 3,
    type: "SLIDE",
    title: "Next.js App Router, Prisma ORM & PostgreSQL Architecture.pdf",
    fileSize: "12.5 MB",
    fileFormat: "PDF",
    downloadsCount: 730,
    rating: 5.0,
    updatedAt: "1 hari lalu",
    description: "Folder Open-Source Departemen Teknik Informatika — Mahasiswa Teknik Elektro maupun jurusan lain dapat belajar Full-Stack Web Development langsung di sini!",
  },
  {
    id: "mat-if-2",
    courseCode: "IF234101",
    courseName: "Algoritma & Pemrograman Dasar",
    department: "Departemen Teknik Informatika",
    semester: 1,
    level: "BEGINNER",
    lecturer: "Dr. Rizky Januar Akbar, S.Kom., M.Eng.",
    uploadedByRole: "Himpunan — Dept. Ilmu Keprofesian",
    uploaderName: "Dept. Keilmuan HMTC Informatika",
    sks: 4,
    type: "EXAM_BANK",
    title: "Modul Latihan Soal Struktur Data & Rekursi Pemula.pdf",
    fileSize: "5.4 MB",
    fileFormat: "PDF",
    downloadsCount: 920,
    rating: 4.8,
    updatedAt: "6 hari lalu",
    description: "Latihan soal dasar pemrograman & kompleksitas algoritma lintas departemen untuk mahasiswa baru maupun persiapan lomba.",
  },
  {
    id: "mat-si-1",
    courseCode: "SI234301",
    courseName: "Manajemen Proyek TI & Rekayasa Kebutuhan",
    department: "Departemen Sistem Informasi",
    semester: 3,
    level: "INTERMEDIATE",
    lecturer: "Dr. Erma Suryani, S.T., M.T.",
    uploadedByRole: "Dosen Departemen",
    uploaderName: "Dr. Erma Suryani, S.T., M.T.",
    sks: 3,
    type: "NOTES",
    title: "Template SRS, User Flow & Manajemen Agile Produk Digital.pdf",
    fileSize: "4.1 MB",
    fileFormat: "PDF",
    downloadsCount: 410,
    rating: 4.8,
    updatedAt: "2 hari lalu",
    description: "Materi open-source Sistem Informasi sangat membantu tim multidisiplin yang ingin membangun produk software untuk Gemastik/PKM.",
  },
];

const LEVEL_STYLES: Record<DifficultyLevel, { label: string; color: string }> = {
  BEGINNER: { label: "Beginner (Sem 1–2)", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  INTERMEDIATE: { label: "Intermediate (Sem 3–4)", color: "bg-sky-50 text-sky-700 border-sky-200" },
  ADVANCED: { label: "Advanced (Sem 5–6)", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  EXPERT: { label: "Expert (Sem 7–8)", color: "bg-purple-50 text-purple-700 border-purple-200" },
};

export default function LearningMaterialsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [materials, setMaterials] = useState<MaterialItem[]>(INITIAL_MATERIALS);

  // Active Demo Role for Upload Authority Testing
  const [activeRole, setActiveRole] = useState<UploaderRole>("STUDENT");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>("ALL");

  // Download simulation state
  const [downloadingItem, setDownloadingItem] = useState<MaterialItem | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Upload & Access Control Modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [accessDeniedModalOpen, setAccessDeniedModalOpen] = useState(false);
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
    }, 4500);
  };

  const canUpload = activeRole === "LECTURER" || activeRole === "HIMPUNAN";

  const handleUploadButtonClick = () => {
    if (!canUpload) {
      setAccessDeniedModalOpen(true);
    } else {
      setUploadModalOpen(true);
    }
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
            showToast(`Berkas Open-Source "${item.title}" berhasil diunduh!`);
          }, 350);
          return 100;
        }
        return prev + 30;
      });
    }, 180);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !canUpload) return;

    const matchedCourse = ALL_COURSES.find((c) => c.code === uploadCourse) || ALL_COURSES[0];
    const isLecturer = activeRole === "LECTURER";

    const newItem: MaterialItem = {
      id: `mat-${Date.now()}`,
      courseCode: matchedCourse.code,
      courseName: matchedCourse.name,
      department: matchedCourse.department,
      semester: matchedCourse.semester,
      level: matchedCourse.level,
      lecturer: matchedCourse.lecturer,
      uploadedByRole: isLecturer ? "Dosen Departemen" : "Himpunan — Dept. Ilmu Keprofesian",
      uploaderName: isLecturer
        ? matchedCourse.lecturer
        : "Dept. Ilmu Keprofesian HIMATEKTRO",
      sks: matchedCourse.sks,
      type: uploadType,
      title: uploadTitle.endsWith(".pdf") || uploadTitle.endsWith(".docx") ? uploadTitle : `${uploadTitle}.pdf`,
      fileSize: "4.2 MB",
      fileFormat: "PDF",
      downloadsCount: 1,
      rating: 5.0,
      updatedAt: "Baru saja",
      description:
        uploadDesc ||
        `Materi resmi terkurasi yang diunggah melalui otoritas ${
          isLecturer ? "Dosen Departemen" : "Himpunan Ilmu Keprofesian"
        } untuk akses terbuka mahasiswa ITS.`,
    };

    setMaterials([newItem, ...materials]);
    setUploadModalOpen(false);
    setUploadTitle("");
    setUploadDesc("");
    showToast(`Berhasil! Materi resmi (${newItem.uploadedByRole}) telah dipublikasikan secara Open-Source.`);
  };

  // Courses filtered by selected department for quick ribbon
  const visibleCourses = useMemo(() => {
    if (selectedDept === "ALL") return ALL_COURSES;
    return ALL_COURSES.filter((c) => c.department === selectedDept);
  }, [selectedDept]);

  // Filter logic (Open-Source Lintas Jurusan & Sem 1-8)
  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      if (selectedDept !== "ALL" && item.department !== selectedDept) {
        return false;
      }
      if (selectedLevel !== "ALL" && item.level !== selectedLevel) {
        return false;
      }
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
        const inDept = item.department.toLowerCase().includes(q);
        const inLecturer = item.lecturer.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        if (!inTitle && !inCourse && !inCode && !inDept && !inLecturer && !inDesc) {
          return false;
        }
      }
      return true;
    });
  }, [materials, selectedDept, selectedLevel, selectedType, selectedCourseCode, searchQuery]);

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
          title="Materi Kuliah & Bank Soal Lintas Jurusan"
          userName="Praditya Haekal Islami Al Haqiqi"
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          searchPlaceholder="Cari materi lintas jurusan (mis: Next.js, Rangkaian Listrik, Antena)..."
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-8 space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-20 right-4 z-50 max-w-md bg-[#013880] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-blue-700 animate-in fade-in slide-in-from-top-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-xs md:text-sm font-medium">{toastMessage}</p>
            </div>
          )}

          {/* Banner Hero: Open-Source Sem 1-8 & Role-Based Upload Policy */}
          <div className="bg-gradient-to-r from-[#013880] to-[#0D47A1] rounded-2xl p-5 md:p-7 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1.5 py-1 px-3 rounded-lg shadow-xs border-none">
                    <Globe className="w-3.5 h-3.5" />
                    Open-Source Lintas Departemen ITS (Sem 1–8)
                  </Badge>
                  <Badge className="bg-white/15 text-blue-100 border border-white/20 text-[11px] font-semibold">
                    Beginner → Expert
                  </Badge>
                </div>

                <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                  Repositori Materi Terbuka & Bank Soal Terkurasi ITS
                </h1>
                <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
                  Berbeda dari myITS Classroom yang hanya membuka mata kuliah per semester individu, seluruh mahasiswa ITS dapat langsung mengakses materi <strong>Semester 1–8</strong> lintas jurusan (misal mahasiswa Elektro belajar Full-Stack di folder Informatika). Hak unggah dijaga ketat khusus untuk <strong>Dosen Departemen</strong> &amp; <strong>Himpunan Dept. Ilmu Keprofesian</strong>.
                </p>

                {/* Role Simulator Bar */}
                <div className="pt-1 flex flex-wrap items-center gap-2 bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/20">
                  <span className="text-[11px] font-bold text-blue-200 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> Simulasi Peran Aktif:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "STUDENT", label: "Mahasiswa (Baca & Unduh)" },
                      { id: "LECTURER", label: "Dosen Departemen (Bisa Upload)" },
                      { id: "HIMPUNAN", label: "Himpunan: Ilmu Keprofesian (Bisa Upload)" },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setActiveRole(r.id as UploaderRole);
                          showToast(`Peran aktif beralih ke: ${r.label}`);
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all ${
                          activeRole === r.id
                            ? "bg-white text-[#013880] shadow-xs"
                            : "bg-white/10 text-blue-100 hover:bg-white/20"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                <Button
                  onClick={handleUploadButtonClick}
                  className={`font-bold text-xs md:text-sm gap-2 rounded-xl py-2.5 px-4 shadow-sm min-h-[44px] ${
                    canUpload
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "bg-white/95 text-[#013880] hover:bg-white"
                  }`}
                >
                  {canUpload ? <UploadCloud className="w-4 h-4" /> : <Lock className="w-4 h-4 text-amber-600" />}
                  {canUpload ? "Unggah Materi Resmi" : "Unggah Materi (Dosen / Hima)"}
                </Button>
                <div className="text-[11px] text-blue-200 text-center lg:text-right font-medium">
                  {canUpload
                    ? "✅ Otoritas Unggah Aktif"
                    : "🔒 Khusus Dosen & Ilmu Keprofesian"}
                </div>
              </div>
            </div>
          </div>

          {/* Folder Departemen & Level Semester 1-8 */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Department Folder Tabs */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  1. Buka Folder Departemen (Open-Source Lintas Jurusan):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key: "ALL", label: "Semua Departemen ITS" },
                    { key: "Departemen Teknik Elektro", label: "Teknik Elektro (Sem 1–8)" },
                    { key: "Departemen Teknik Informatika", label: "Teknik Informatika" },
                    { key: "Departemen Sistem Informasi", label: "Sistem Informasi" },
                  ].map((d) => (
                    <button
                      key={d.key}
                      onClick={() => {
                        setSelectedDept(d.key);
                        setSelectedCourseCode("ALL");
                      }}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                        selectedDept === d.key
                          ? "bg-[#013880] text-white font-bold shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level / Semester Filter */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  2. Tingkat Kesulitan & Semester (1–8):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key: "ALL", label: "Semua Level" },
                    { key: "BEGINNER", label: "Beginner (Sem 1–2)" },
                    { key: "INTERMEDIATE", label: "Intermediate (Sem 3–4)" },
                    { key: "ADVANCED", label: "Advanced (Sem 5–6)" },
                    { key: "EXPERT", label: "Expert (Sem 7–8)" },
                  ].map((lvl) => (
                    <button
                      key={lvl.key}
                      onClick={() => setSelectedLevel(lvl.key)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                        selectedLevel === lvl.key
                          ? "bg-[#013880] text-white font-semibold shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Ribbon */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  3. Pilih Mata Kuliah ({visibleCourses.length} MK Tersedia):
                </p>
                <select
                  value={selectedCourseCode}
                  onChange={(e) => setSelectedCourseCode(e.target.value)}
                  className="text-xs font-semibold border border-slate-200 rounded-lg p-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#013880] w-full sm:w-auto"
                >
                  <option value="ALL">Semua Mata Kuliah</option>
                  {visibleCourses.map((c) => (
                    <option key={c.code} value={c.code}>
                      [Sem {c.semester}] {c.code} — {c.name}
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
                  Semua MK
                </button>
                {visibleCourses.map((c) => {
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
                      <span className="text-[10px] opacity-75">• Sem {c.semester}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Search & File Type Bar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Cari materi kuliah lintas departemen, bank soal ETS/EAS, atau nama dosen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs md:text-sm border-slate-200 focus-visible:ring-[#013880] rounded-lg"
                />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: "ALL", label: "Semua Tipe" },
                  { key: "SLIDE", label: "Slide Kuliah" },
                  { key: "EXAM_BANK", label: "Bank Soal (ETS/EAS)" },
                  { key: "NOTES", label: "Catatan Terkurasi" },
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

          {/* Materials Grid */}
          {filteredMaterials.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">Tidak ada berkas yang cocok</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Coba ubah filter departemen, semester, atau kata kunci pencarian.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedDept("ALL");
                  setSelectedLevel("ALL");
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
                  className="border border-slate-200 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between bg-white"
                >
                  <CardHeader className="p-4 md:p-5 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#013880] bg-[#013880]/10 px-2 py-0.5 rounded-md border border-[#013880]/20">
                            {item.courseCode}
                          </span>
                          <Badge className={`text-[10px] font-semibold border ${LEVEL_STYLES[item.level].color}`}>
                            Sem {item.semester} • {item.level}
                          </Badge>
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
                              : "Catatan Terkurasi"}
                          </Badge>
                        </div>

                        <div className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5 flex-wrap">
                          <span>{item.department}</span>
                          <span className="text-slate-300">•</span>
                          <span>{item.courseName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{item.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug pt-2">
                      {item.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold flex items-center gap-1 ${
                          item.uploadedByRole === "Dosen Departemen"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-blue-50 text-[#013880] border-blue-200"
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        {item.uploadedByRole}: {item.uploaderName}
                      </Badge>
                    </div>
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
                        className="flex-1 bg-gradient-to-r from-[#013880] to-[#0D47A1] hover:from-[#012d66] hover:to-[#09357a] text-white font-semibold text-xs gap-1.5 rounded-xl py-2.5 shadow-xs transition-all min-h-[44px]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Unduh Berkas Open-Source
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
              Mengunduh Berkas Open-Source...
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {downloadingItem?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1">
              <p><strong>Departemen:</strong> {downloadingItem?.department}</p>
              <p><strong>Mata Kuliah:</strong> {downloadingItem?.courseName} ({downloadingItem?.courseCode})</p>
              <p><strong>Tingkat:</strong> Semester {downloadingItem?.semester} ({downloadingItem?.level})</p>
              <p><strong>Kurator:</strong> {downloadingItem?.uploaderName}</p>
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
              Terverifikasi SSO Mahasiswa ITS — Akses Terbuka Lintas Jurusan.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL PENOLAKAN AKSES UNGGAH UNTUK MAHASISWA REGULER */}
      <Dialog open={accessDeniedModalOpen} onOpenChange={setAccessDeniedModalOpen}>
        <DialogContent className="max-w-md w-[92vw] sm:w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-600" />
              Otoritas Unggah Terbatas
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Kebijakan kontrol kualitas &amp; kurasi akademik myITS CampusMatch
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-amber-900 space-y-1.5">
              <p className="font-bold">Mengapa Mahasiswa Reguler tidak bisa langsung mengunggah?</p>
              <p className="text-[11px] leading-relaxed text-amber-800">
                Seluruh mahasiswa ITS bebas <strong>membaca &amp; mengunduh materi</strong> dari Semester 1–8 lintas departemen. Namun hak <strong>unggah berkas &amp; bank soal</strong> dikunci eksklusif bagi:
              </p>
              <ul className="list-disc list-inside text-[11px] text-amber-900 font-semibold space-y-0.5 pt-1">
                <li>Dosen Pengampu Departemen Terkait</li>
                <li>Pengurus Himpunan (Departemen Ilmu Keprofesian)</li>
              </ul>
            </div>

            <p className="text-[11px] text-slate-600 font-medium">
              Ingin menguji fitur unggah materi sekarang? Pilih simulasi peran resmi di bawah ini:
            </p>

            <div className="grid grid-cols-1 gap-2">
              <Button
                type="button"
                onClick={() => {
                  setActiveRole("LECTURER");
                  setAccessDeniedModalOpen(false);
                  setUploadModalOpen(true);
                  showToast("Login disimulasikan sebagai Dosen Departemen Teknik Elektro.");
                }}
                className="w-full bg-gradient-to-r from-[#013880] to-[#0D47A1] text-white text-xs font-semibold gap-2 min-h-[44px]"
              >
                <GraduationCap className="w-4 h-4" />
                Masuk sebagai Dosen Departemen
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setActiveRole("HIMPUNAN");
                  setAccessDeniedModalOpen(false);
                  setUploadModalOpen(true);
                  showToast("Login disimulasikan sebagai Pengurus Himpunan — Dept. Ilmu Keprofesian.");
                }}
                className="w-full border-[#013880] text-[#013880] hover:bg-blue-50 text-xs font-semibold gap-2 min-h-[44px]"
              >
                <Award className="w-4 h-4" />
                Masuk sebagai Himpunan (Ilmu Keprofesian)
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL UNGGAH MATERI (KHUSUS DOSEN & HIMPUNAN ILMU KEPROFESIAN) */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-lg w-[92vw] sm:w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#013880]" />
              Unggah Materi Resmi &amp; Bank Soal
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Terverifikasi sebagai:{" "}
              <strong className="text-[#013880]">
                {activeRole === "LECTURER"
                  ? "Dosen Departemen Terkait"
                  : "Pengurus Himpunan — Dept. Ilmu Keprofesian"}
              </strong>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-3.5 py-1 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Pilih Mata Kuliah (Sem 1–8 Lintas Departemen) *
              </label>
              <select
                value={uploadCourse}
                onChange={(e) => setUploadCourse(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#013880]"
              >
                {ALL_COURSES.map((c) => (
                  <option key={c.code} value={c.code}>
                    [{c.department}] Sem {c.semester} ({c.level}) — {c.code} {c.name}
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
                  <option value="NOTES">Catatan Terkurasi</option>
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
                placeholder="Contoh: Modul Lengkap Rangkaian Listrik Dasar ETS 2025"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Deskripsi &amp; Tingkat Pembahasan
              </label>
              <textarea
                rows={3}
                value={uploadDesc}
                onChange={(e) => setUploadDesc(e.target.value)}
                placeholder="Jelaskan cakupan materi, tahun soal ujian, atau prasyarat belajar..."
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#013880]"
              />
            </div>

            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <Unlock className="w-4 h-4 text-emerald-600" /> Publikasi Open-Source Lintas Mahasiswa ITS
              </p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Materi yang diunggah akan langsung terbuka untuk seluruh mahasiswa ITS lintas jurusan sebagai referensi belajar mandiri.
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
                Publikasikan Materi Resmi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
