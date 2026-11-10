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
  Users,
  Search,
  Plus,
  Sparkles,
  MapPin,
  Clock,
  Target,
  GraduationCap,
  MessageSquare,
  CheckCircle2,
  Send,
  BookOpen,
  Trophy,
  Cpu,
  Layers,
  Filter,
  Mail,
} from "lucide-react";
import { getStoredProfile } from "../../lib/data-store";

interface StudyPartnerPost {
  id: string;
  name: string;
  email: string;
  department: string;
  faculty: string;
  semester: number;
  avatarInitials: string;
  category: "COMPETITION" | "TUTOR" | "RESEARCH" | "STUDY_GROUP";
  topic: string;
  target: string;
  preferredTime: string;
  preferredLocation: string;
  statusText: string;
  skills: string[];
  description: string;
  slotsRemaining?: number;
  verified: boolean;
}

const INITIAL_POSTS: StudyPartnerPost[] = [
  {
    id: "sp-1",
    name: "Bayu Pratama Putra",
    email: "bayu.5009221042@student.its.ac.id",
    department: "Departemen Teknik Elektro",
    faculty: "FTEIC",
    semester: 5,
    avatarInitials: "BP",
    category: "COMPETITION",
    topic: "Machine Learning Telekomunikasi & Smart IoT",
    target: "Hackathon STACK 2026 (GDGoC ITB) & Gemastik",
    preferredTime: "Malam hari / Weekend (19.00 - 22.00)",
    preferredLocation: "CCWS Perpustakaan Pusat Lt. 2",
    statusText: "🟢 Aktif Mencari Tim (1 Slot)",
    skills: ["Machine Learning", "Python", "LoRaWAN", "PyTorch", "Signal Processing"],
    description: "Sedang membentuk tim solid untuk STACK 2026 Case 1: Smarter Campus. Membutuhkan 1 rekan dari Teknik Elektro / Informatika yang menguasai Edge AI atau Backend Next.js.",
    slotsRemaining: 1,
    verified: true,
  },
  {
    id: "sp-2",
    name: "Nadia Safira Putri",
    email: "nadia.5009231018@student.its.ac.id",
    department: "Departemen Teknik Elektro",
    faculty: "FTEIC",
    semester: 3,
    avatarInitials: "NS",
    category: "TUTOR",
    topic: "Rangkaian Listrik & Antena",
    target: "Tutor Sebaya Persiapan ETS Genap",
    preferredTime: "Fleksibel via Discord / Ruang Baca FTEIC",
    preferredLocation: "Ruang Baca FTEIC Elektro",
    statusText: "🟢 Open Tutor Sebaya",
    skills: ["Rangkaian Listrik", "Antena", "MATLAB", "Kalkulus Lanjut", "Fisika Teknik"],
    description: "Membuka sesi bedah soal & tutoring untuk adik tingkat atau rekan seangkatan mata kuliah Rangkaian Listrik & Antena. Santai, runtut dari konsep hukum Kirchhoff hingga analisis sinusoidal AC/DC.",
    slotsRemaining: 3,
    verified: true,
  },
  {
    id: "sp-3",
    name: "Reyhan Ardiansyah",
    email: "reyhan.5025221091@student.its.ac.id",
    department: "Departemen Teknik Informatika",
    faculty: "FTEIC",
    semester: 5,
    avatarInitials: "RA",
    category: "COMPETITION",
    topic: "Fullstack Next.js & UI/UX Design",
    target: "Tim Gemastik Software Development 2026",
    preferredTime: "Weekend (Sabtu & Minggu Penuh)",
    preferredLocation: "CCWS Menara Sains / SCC",
    statusText: "🟢 Aktif Mencari Tim (2 Slot)",
    skills: ["Fullstack Next.js", "UI/UX", "TypeScript", "Tailwind CSS", "PostgreSQL", "Figma"],
    description: "Mencari partner yang paham domain logic / hardware interface untuk kolaborasi produk aplikasi cerdas. Siap gas sampai tahap finalis Gemastik!",
    slotsRemaining: 2,
    verified: true,
  },
  {
    id: "sp-4",
    name: "Dimas Cahyo Wicaksono",
    email: "dimas.5009211077@student.its.ac.id",
    department: "Departemen Teknik Elektro",
    faculty: "FTEIC",
    semester: 7,
    avatarInitials: "DC",
    category: "RESEARCH",
    topic: "VLC & Optical Comm",
    target: "Rekan Riset Tugas Akhir Lab Telkom & Publikasi",
    preferredTime: "Jam kerja lab (09.00 - 16.00 WIB)",
    preferredLocation: "Lab Telekomunikasi Gedung B Elektro ITS",
    statusText: "🟢 Mencari Partner Riset",
    skills: ["VLC", "Optical Comm", "OptiSystem", "Transceiver Circuit", "C++"],
    description: "Sedang mengerjakan purwarupa modul transmisi data nirkabel berbasis LED optik. Mencari partner riset yang tertarik di ranah hardware transceiver dan pengujian sinyal laboratorium.",
    slotsRemaining: 1,
    verified: true,
  },
  {
    id: "sp-5",
    name: "Annisa Larasati",
    email: "annisa.5026221034@student.its.ac.id",
    department: "Departemen Sistem Informasi",
    faculty: "FTEIC",
    semester: 5,
    avatarInitials: "AL",
    category: "COMPETITION",
    topic: "Product Management & UI/UX Wireframing",
    target: "Business Plan Competition / STACK 2026",
    preferredTime: "Sore hari (16.30 - 19.00 WIB)",
    preferredLocation: "CCWS Perpustakaan Pusat",
    statusText: "🟢 Aktif Mencari 1 Tech Lead",
    skills: ["Product Strategy", "Figma", "User Journey", "Market Validation"],
    description: "Mencari tech lead / hacker yang bisa prototyping cepat untuk ide platform integrasi ormawa & beasiswa. Pitch deck dan riset pengguna sudah tervalidasi 80%.",
    slotsRemaining: 1,
    verified: true,
  },
  {
    id: "sp-6",
    name: "Bagas Surya Dharma",
    email: "bagas.5007221055@student.its.ac.id",
    department: "Departemen Teknik Mesin",
    faculty: "FTIRS",
    semester: 5,
    avatarInitials: "BS",
    category: "COMPETITION",
    topic: "Desain Mekanik CAD & Drone Otonom (PKM-KC)",
    target: "Tim Lomba PKM Karsa Cipta 2026",
    preferredTime: "Rabu & Jumat Sore (15.30 - 18.00 WIB)",
    preferredLocation: "CCWS Menara Sains / SCC",
    statusText: "🟢 Mencari Anak Elektro / IF",
    skills: ["SolidWorks", "CAD", "Aerodynamics", "3D Printing", "Prototyping"],
    description: "Tim PKM-KC sudah siap di bagian rangka mekanik dan manufaktur drone inspeksi. Butuh rekan dari Teknik Elektro / Informatika untuk sistem kendali flight controller & computer vision.",
    slotsRemaining: 2,
    verified: true,
  },
  {
    id: "sp-7",
    name: "Clara Wijaya",
    email: "clara.5003231012@student.its.ac.id",
    department: "Departemen Statistika",
    faculty: "FSAD",
    semester: 3,
    avatarInitials: "CW",
    category: "TUTOR",
    topic: "Probabilitas, Statistika & Data Modeling",
    target: "Kelompok Belajar ETS & Lomba Data Science",
    preferredTime: "Selasa & Kamis Malam",
    preferredLocation: "CCWS Gedung Perpustakaan Pusat Lantai 2",
    statusText: "🟢 Open Diskusi & Riset Data",
    skills: ["R", "Python", "Data Analytics", "Time Series", "Probabilitas"],
    description: "Terbuka untuk belajar bareng atau kolaborasi tim lomba Data Science / PKM lintas jurusan se-ITS yang membutuhkan pemodelan statistik & validasi data.",
    slotsRemaining: 2,
    verified: true,
  },
  {
    id: "sp-8",
    name: "Praditya Haekal Islami Al Haqiqi",
    email: "praditya.5009221000@student.its.ac.id",
    department: "Departemen Teknik Elektro",
    faculty: "FTEIC",
    semester: 5,
    avatarInitials: "PH",
    category: "RESEARCH",
    topic: "Network Engineering, IoT & Embedded Systems",
    target: "Kompetisi Jaringan Cerdas & Smart Campus Project",
    preferredTime: "Fleksibel / Sesi Malam di CCWS",
    preferredLocation: "CCWS FTEIC Departemen Elektro",
    statusText: "🟢 Siap Kolaborasi Tim",
    skills: ["Cisco", "Routing", "Python", "IoT", "Linux", "Embedded Systems"],
    description: "Siap bergabung untuk proyek tim atau kompetisi di bidang infrastruktur jaringan cerdas, otomasi IoT kampus, dan audit keamanan sistem web.",
    slotsRemaining: 2,
    verified: true,
  },
];

export default function StudyPartnersPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [posts, setPosts] = useState<StudyPartnerPost[]>(INITIAL_POSTS);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");

  // Modal State for "Buat Ajakan Belajar"
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formTopic, setFormTopic] = useState("");
  const [formEmail, setFormEmail] = useState("praditya.5009221000@student.its.ac.id");
  const [formCategory, setFormCategory] = useState<StudyPartnerPost["category"]>("COMPETITION");
  const [formTarget, setFormTarget] = useState("");
  const [formLocation, setFormLocation] = useState("CCWS Gedung Perpustakaan Pusat Lantai 2");
  const [formTime, setFormTime] = useState("");
  const [formSkills, setFormSkills] = useState("");
  const [formSlots, setFormSlots] = useState("2");
  const [formDescription, setFormDescription] = useState("");

  // Modal State for "Ajak Diskusi / Connect"
  const [connectModalPost, setConnectModalPost] = useState<StudyPartnerPost | null>(null);
  const [connectTopicType, setConnectTopicType] = useState("Proyek Lomba");
  const [connectCustomTopic, setConnectCustomTopic] = useState("Diskusi Tim Hackathon STACK 2026");
  const [connectSenderEmail, setConnectSenderEmail] = useState("praditya.5009221000@student.its.ac.id");
  const [connectMessage, setConnectMessage] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopic.trim() || !formDescription.trim() || !formEmail.trim()) return;

    const newPost: StudyPartnerPost = {
      id: `sp-${Date.now()}`,
      name: "Praditya Haekal Islami Al Haqiqi",
      email: formEmail.trim(),
      department: "Departemen Teknik Elektro",
      faculty: "FTEIC",
      semester: 5,
      avatarInitials: "PH",
      category: formCategory,
      topic: formTopic,
      target: formTarget || "Kolaborasi Akademik & Riset",
      preferredTime: formTime || "Fleksibel / Sesuai Kesepakatan",
      preferredLocation: formLocation,
      statusText: `🟢 Aktif Mencari Tim (${formSlots} Slot)`,
      skills: formSkills
        ? formSkills.split(",").map((s) => s.trim()).filter(Boolean)
        : ["Teknik Elektro", "Kolaborasi"],
      description: formDescription,
      slotsRemaining: parseInt(formSlots) || 1,
      verified: true,
    };

    setPosts([newPost, ...posts]);
    setCreateModalOpen(false);
    // Reset form
    setFormTopic("");
    setFormDescription("");
    setFormSkills("");
    setFormTarget("");
    setFormTime("");
    showToast(`Ajakan belajar dipublikasikan! Notifikasi balasan akan masuk ke ${newPost.email}.`);
  };

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectModalPost) return;

    const targetEmail = connectModalPost.email;
    setConnectModalPost(null);
    setConnectMessage("");
    showToast(`Undangan kolaborasi berhasil dikirim langsung ke email ${targetEmail}!`);
  };

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Category filter
      if (selectedCategory !== "ALL" && post.category !== selectedCategory) {
        return false;
      }
      // Department filter
      if (selectedDept !== "ALL") {
        if (selectedDept === "Semua Departemen FTEIC") {
          if (!["Departemen Teknik Elektro", "Departemen Teknik Informatika", "Departemen Sistem Informasi"].includes(post.department)) {
            return false;
          }
        } else if (post.department !== selectedDept) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const inName = post.name.toLowerCase().includes(q);
        const inTopic = post.topic.toLowerCase().includes(q);
        const inTarget = post.target.toLowerCase().includes(q);
        const inDesc = post.description.toLowerCase().includes(q);
        const inSkills = post.skills.some((s) => s.toLowerCase().includes(q));
        if (!inName && !inTopic && !inTarget && !inDesc && !inSkills) {
          return false;
        }
      }
      return true;
    });
  }, [posts, selectedCategory, selectedDept, searchQuery]);

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
          title="Rekan Belajar & Tutor Sebaya (StudyMatch)"
          userName="Praditya Haekal Islami Al Haqiqi"
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          searchPlaceholder="Cari berdasarkan nama, keahlian, atau mata kuliah..."
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-8 space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-20 right-4 z-50 max-w-md bg-blue-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-blue-700 animate-in fade-in slide-in-from-top-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-xs md:text-sm font-medium">{toastMessage}</p>
            </div>
          )}

          {/* Banner Hero */}
          <div className="bg-gradient-to-r from-[#013880] to-[#0D47A1] rounded-2xl p-5 md:p-7 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/20 text-white hover:bg-white/30 border-none text-[11px] font-semibold px-2.5 py-0.5">
                    Case 1: Smarter Campus and Learning
                  </Badge>
                  <span className="text-xs text-blue-200">myITS StudyMatch Hub</span>
                </div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight">
                  myITS StudyMatch — Temukan Rekan Belajar & Tim Lomba
                </h1>
                <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
                  Hubungkan keahlianmu dengan sesama mahasiswa ITS untuk persiapan ujian, riset laboratorium, dan kompetisi nasional.
                </p>
              </div>

              <Button
                onClick={() => setCreateModalOpen(true)}
                className="bg-white text-[#013880] hover:bg-blue-50 font-bold text-xs md:text-sm shadow-sm gap-2 shrink-0 self-start md:self-center py-2.5 px-4 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                Buat Ajakan Belajar
              </Button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Pencarian berdasarkan nama, keahlian/skill, atau mata kuliah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs md:text-sm border-slate-200 focus-visible:ring-[#013880] rounded-lg"
                />
              </div>

              {/* Department Selector */}
              <div className="flex items-center gap-2 w-full md:w-80">
                <Filter className="w-4 h-4 text-slate-500 shrink-0" />
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full text-xs font-semibold border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#013880]"
                >
                  <option value="ALL">Semua Departemen se-ITS (Default)</option>
                  <option value="Departemen Teknik Elektro">Departemen Teknik Elektro (FTEIC)</option>
                  <option value="Departemen Teknik Informatika">Departemen Teknik Informatika (FTEIC)</option>
                  <option value="Departemen Sistem Informasi">Departemen Sistem Informasi (FTEIC)</option>
                  <option value="Semua Departemen FTEIC">Semua Departemen FTEIC</option>
                  <option value="Departemen Teknik Mesin">Departemen Teknik Mesin (FTIRS)</option>
                  <option value="Departemen Statistika">Departemen Statistika (FSAD)</option>
                </select>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
              {[
                { key: "ALL", label: "Semua" },
                { key: "COMPETITION", label: "Rekan Lomba / Hackathon" },
                { key: "TUTOR", label: "Tutor Sebaya (Peer Tutor)" },
                { key: "RESEARCH", label: "Rekan Riset & Proyek" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedCategory === tab.key
                      ? "bg-[#013880] text-white font-semibold shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Menampilkan <strong className="text-slate-800">{filteredPosts.length}</strong> profil rekan belajar terverifikasi
            </span>
            <span className="hidden sm:inline">SSO Terintegrasi myITS Identity</span>
          </div>

          {/* Study Partner Cards Grid */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">Tidak ada rekan belajar yang cocok</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Coba sesuaikan kata kunci pencarian atau ubah kategori filter.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ALL");
                  setSelectedDept("ALL");
                }}
                className="text-xs"
              >
                Reset Filter
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="border border-slate-200 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
                >
                  <CardHeader className="p-4 md:p-5 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#013880] to-[#0D47A1] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                          {post.avatarInitials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-bold text-slate-900 text-sm leading-tight">
                              {post.name}
                            </h3>
                            {post.verified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#013880] shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold text-slate-600 bg-slate-50">
                              Sem {post.semester}
                            </Badge>
                            <span className="text-[11px] text-slate-500 truncate max-w-[170px]">
                              {post.department}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-3">
                      <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-bold">
                        {post.statusText}
                      </Badge>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs md:text-sm">
                        <Target className="w-3.5 h-3.5 text-[#013880] shrink-0" />
                        <span className="line-clamp-1">{post.topic}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        Target: <strong className="text-slate-700">{post.target}</strong>
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 md:p-5 pt-0 space-y-3 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-2.5 rounded-lg border border-slate-100 line-clamp-3">
                      "{post.description}"
                    </p>

                    <div className="space-y-2">
                      {/* Deretan Badge Keahlian (Skills) berwarna kontras */}
                      <div className="flex flex-wrap gap-1">
                        {post.skills.map((skill, idx) => {
                          const colors = [
                            "bg-blue-100 text-[#013880] border-blue-200",
                            "bg-indigo-100 text-indigo-800 border-indigo-200",
                            "bg-teal-100 text-teal-800 border-teal-200",
                            "bg-amber-100 text-amber-800 border-amber-200",
                            "bg-purple-100 text-purple-800 border-purple-200",
                          ];
                          const color = colors[idx % colors.length];
                          return (
                            <span
                              key={skill}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${color}`}
                            >
                              {skill}
                            </span>
                          );
                        })}
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-500 pt-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{post.preferredTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{post.preferredLocation}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate text-[#013880] font-medium">
                          <Mail className="w-3.5 h-3.5 text-[#013880] shrink-0" />
                          <span className="truncate">{post.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <Button
                        size="sm"
                        onClick={() => {
                          setConnectModalPost(post);
                          setConnectCustomTopic(post.topic);
                        }}
                        className="w-full bg-gradient-to-r from-[#013880] to-[#0D47A1] hover:from-[#012d66] hover:to-[#09357a] text-white font-semibold text-xs gap-1.5 rounded-lg py-2 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Ajak Diskusi / Kirim Email
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

      {/* MODAL 1: Buat Ajakan Belajar */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-lg w-[92vw] sm:w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#013880]" />
              Buat Ajakan Belajar & Kolaborasi Baru
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Formulir posting kebutuhan belajar, tim lomba (PKM/Hackathon), atau riset laboratorium se-ITS.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-3.5 py-1 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Kategori Kolaborasi *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#013880]"
                >
                  <option value="COMPETITION">Rekan Lomba / PKM / Hackathon</option>
                  <option value="TUTOR">Tutor Sebaya (Peer Tutor)</option>
                  <option value="RESEARCH">Rekan Riset & Proyek</option>
                  <option value="STUDY_GROUP">Kelompok Belajar Kuliah</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Email Penerima Notifikasi Undangan *
                </label>
                <Input
                  type="email"
                  placeholder="nama@student.its.ac.id"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                  className="text-xs"
                />
              </div>
            </div>
            <p className="text-[11px] text-[#013880] bg-blue-50/70 px-2.5 py-1.5 rounded-lg border border-blue-100 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              Notifikasi otomatis dikirim ke email ini saat ada mahasiswa ITS yang mengajak diskusi.
            </p>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Mata Kuliah / Topik Keahlian *
              </label>
              <Input
                placeholder="Contoh: Machine Learning Telekomunikasi & IoT"
                value={formTopic}
                onChange={(e) => setFormTopic(e.target.value)}
                required
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Kompetisi / Tujuan *</label>
                <Input
                  placeholder="Contoh: Hackathon STACK 2026 atau PKM-KC"
                  value={formTarget}
                  onChange={(e) => setFormTarget(e.target.value)}
                  required
                  className="text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Slot Peserta Dibutuhkan *</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formSlots}
                  onChange={(e) => setFormSlots(e.target.value)}
                  required
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lokasi Preferensi</label>
                <select
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#013880]"
                >
                  <option value="CCWS Gedung Perpustakaan Pusat Lantai 2">CCWS Perpustakaan Pusat Lantai 2</option>
                  <option value="CCWS Menara Sains / SCC">CCWS Menara Sains / SCC</option>
                  <option value="CCWS Gedung FTEIC Elektro">CCWS Gedung FTEIC Elektro</option>
                  <option value="Ruang Baca FTEIC Elektro">Ruang Baca FTEIC Elektro</option>
                  <option value="Online via Discord / GMeet">Online via Discord / GMeet</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Waktu Belajar</label>
                <Input
                  placeholder="Contoh: Malam hari / Weekend di CCWS"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Keahlian yang Dicari (pisahkan dengan koma)
              </label>
              <Input
                placeholder="Edge AI, Next.js, Python, Figma"
                value={formSkills}
                onChange={(e) => setFormSkills(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Deskripsi Kebutuhan & Ide Kolaborasi *
              </label>
              <textarea
                rows={3}
                required
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Jelaskan kebutuhan tim, target pencapaian lomba, atau materi tutoring yang ingin dipelajari..."
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#013880]"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCreateModalOpen(false)}
                className="text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-gradient-to-r from-[#013880] to-[#0D47A1] hover:from-[#012d66] hover:to-[#09357a] text-white text-xs font-semibold"
              >
                Publikasikan Ajakan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Ajak Diskusi / Connect via Email Langsung */}
      <Dialog open={!!connectModalPost} onOpenChange={(open) => !open && setConnectModalPost(null)}>
        <DialogContent className="max-w-md w-[92vw] sm:w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#013880]" />
              Kirim Undangan Diskusi ke Email
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Kirim undangan kolaborasi belajar kepada{" "}
              <strong className="text-slate-800">{connectModalPost?.name}</strong> (
              {connectModalPost?.department})
            </DialogDescription>
          </DialogHeader>

          {connectModalPost && (
            <form onSubmit={handleConnectSubmit} className="space-y-3.5 py-1 text-xs">
              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 text-[11px] text-[#013880] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  Dikirim Langsung ke Email Pembuat Ajakan:
                </p>
                <p className="font-mono font-bold text-slate-900 bg-white px-2 py-1 rounded border border-blue-100">
                  {connectModalPost.email}
                </p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-1">
                <p>
                  <strong>Fokus:</strong> {connectModalPost.topic}
                </p>
                <p>
                  <strong>Target:</strong> {connectModalPost.target}
                </p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Email Balasan Anda *
                </label>
                <Input
                  type="email"
                  required
                  value={connectSenderEmail}
                  onChange={(e) => setConnectSenderEmail(e.target.value)}
                  placeholder="email.anda@student.its.ac.id"
                  className="text-xs"
                />
              </div>

              {/* Pilihan topik ajakan (Ujian Bareng / Proyek Lomba / Bimbingan) */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pilihan Topik Ajakan *
                </label>
                <select
                  value={connectTopicType}
                  onChange={(e) => setConnectTopicType(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#013880]"
                >
                  <option value="Proyek Lomba">Proyek Lomba (PKM / STACK 2026 / Gemastik)</option>
                  <option value="Ujian Bareng">Ujian Bareng (Persiapan ETS / EAS)</option>
                  <option value="Bimbingan">Bimbingan / Tutor Sebaya</option>
                  <option value="Riset Proyek">Riset & Kolaborasi Proyek</option>
                </select>
              </div>

              {/* Formulir kirim pesan perkenalan singkat */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pesan Perkenalan Singkat *
                </label>
                <textarea
                  rows={3}
                  required
                  value={connectMessage}
                  onChange={(e) => setConnectMessage(e.target.value)}
                  placeholder={`Halo ${connectModalPost.name}, saya Praditya Haekal dari S1 Teknik Elektro, tertarik untuk berdiskusi mengenai ${connectTopicType} untuk topik ${connectModalPost.topic}...`}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#013880]"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setConnectModalPost(null)}
                  className="text-xs"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-gradient-to-r from-[#013880] to-[#0D47A1] hover:from-[#012d66] hover:to-[#09357a] text-white text-xs font-semibold gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Kirim ke Email Tujuan
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
