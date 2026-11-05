"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  GraduationCap,
  BookOpen,
  Award,
  Building2,
  Briefcase,
  FileCheck2,
  Save,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  School,
  Calendar,
  Layers,
  ShieldCheck,
  ExternalLink,
  Check,
} from "lucide-react";
import {
  StudentProfileData,
  getStoredProfile,
  saveStoredProfile,
  INITIAL_STUDENT_PROFILE,
} from "@/lib/data-store";

export default function ProfilePage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<StudentProfileData>(INITIAL_STUDENT_PROFILE);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New tag inputs
  const [newSkill, setNewSkill] = useState("");
  const [newSoftSkill, setNewSoftSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  // Experience modal/inputs
  const [newExp, setNewExp] = useState({
    title: "",
    organization: "",
    duration: "",
    description: "",
  });
  const [showAddExp, setShowAddExp] = useState(false);

  // Achievement modal/inputs
  const [newAch, setNewAch] = useState({
    title: "",
    level: "Nasional",
    year: "2026",
    organizer: "",
  });
  const [showAddAch, setShowAddAch] = useState(false);

  useEffect(() => {
    setProfile(getStoredProfile());
  }, []);

  const handleInputChange = (field: keyof StudentProfileData, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setIsSubmitting(true);
    saveStoredProfile(profile);
    setTimeout(() => {
      setIsSubmitting(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 4000);
    }, 400);
  };

  // Add & Remove Skills
  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (!profile.skills.includes(newSkill.trim())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
    }
    setNewSkill("");
  };

  const removeSkill = (sk: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== sk),
    }));
  };

  // Add & Remove Soft Skills
  const addSoftSkill = () => {
    if (!newSoftSkill.trim()) return;
    if (!profile.softSkills.includes(newSoftSkill.trim())) {
      setProfile((prev) => ({
        ...prev,
        softSkills: [...prev.softSkills, newSoftSkill.trim()],
      }));
    }
    setNewSoftSkill("");
  };

  const removeSoftSkill = (sk: string) => {
    setProfile((prev) => ({
      ...prev,
      softSkills: prev.softSkills.filter((s) => s !== sk),
    }));
  };

  // Add & Remove Interests
  const addInterest = () => {
    if (!newInterest.trim()) return;
    if (!profile.interests.includes(newInterest.trim())) {
      setProfile((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
    }
    setNewInterest("");
  };

  const removeInterest = (item: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== item),
    }));
  };

  // Add Experience
  const handleAddExperience = () => {
    if (!newExp.title || !newExp.organization) return;
    const item = {
      id: `exp-${Date.now()}`,
      ...newExp,
    };
    setProfile((prev) => ({
      ...prev,
      experiences: [item, ...prev.experiences],
    }));
    setNewExp({ title: "", organization: "", duration: "", description: "" });
    setShowAddExp(false);
  };

  const removeExperience = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  };

  // Add Achievement
  const handleAddAchievement = () => {
    if (!newAch.title) return;
    const item = {
      id: `ach-${Date.now()}`,
      ...newAch,
    };
    setProfile((prev) => ({
      ...prev,
      achievements: [item, ...prev.achievements],
    }));
    setNewAch({ title: "", level: "Nasional", year: "2026", organizer: "" });
    setShowAddAch(false);
  };

  const removeAchievement = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a.id !== id),
    }));
  };

  // Toggle Document Ready
  const toggleDoc = (docName: string) => {
    setProfile((prev) => {
      const exists = prev.documentsReady.includes(docName);
      if (exists) {
        return {
          ...prev,
          documentsReady: prev.documentsReady.filter((d) => d !== docName),
        };
      } else {
        return {
          ...prev,
          documentsReady: [...prev.documentsReady, docName],
        };
      }
    });
  };

  const availableDocsList = [
    "KTM Aktif ITS",
    "Transkrip Nilai myITS",
    "Curriculum Vitae (PDF)",
    "Portofolio Proyek / GitHub",
    "Sertifikat LKMM-TD",
    "Surat Rekomendasi Dosen Wali",
    "SKTM (Surat Keterangan Tidak Mampu)",
    "Essay Motivasi / Kontribusi",
    "Proposal Proyek Mandiri",
    "Surat Bebas Beasiswa Lain",
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        role="STUDENT"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        user={{
          name: profile.name,
          role: `${profile.major} (Sem. ${profile.semester})`,
          initials: "PH",
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title="Profil Mahasiswa & Integrasi myITS"
          userName={profile.name}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Top Banner: myITS Single Sign-On Verified */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <User className="w-5 h-5" />
                </span>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                  Profil Mahasiswa Kampus (Terintegrasi myITS Portal)
                </h1>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> myITS SSO Verified
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-slate-600 max-w-2xl">
                Data akademik resmi (NIM, Jurusan, IPK, Semester, FRS) otomatis tersinkron dari <strong>myITS Satu Data</strong>. Keahlian teknis, soft skills, riwayat organisasi, prestasi, dan berkas dapat Anda sesuaikan langsung di halaman ini.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 font-bold shadow px-5 py-2 h-auto"
              >
                {isSubmitting ? (
                  <>Menyimpan...</>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Success Notification Bar */}
          {saveSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs md:text-sm font-bold text-emerald-900">
                    Perubahan Profil Berhasil Disimpan & Disubmit!
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Data keahlian, prestasi, dan berkas terbaru Anda telah aktif. Seluruh skor pencocokan di <strong>Opportunities</strong>, <strong>My Matches</strong>, dan <strong>Gap Analysis</strong> telah terbarui secara real-time.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push("/matches")}
                className="text-xs bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-100 font-semibold"
              >
                Cek My Matches
              </Button>
            </div>
          )}

          {/* SECTION 1: Data Perkuliahan & Akademik Resmi (myITS Satu Data) */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-base font-bold text-slate-900">
                    1. Data Perkuliahan & Akademik Resmi (myITS Portal)
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] text-blue-700 bg-blue-50 border-blue-200">
                  Data Resmi Kampus ITS
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-500">
                Informasi dasar perkuliahan yang menjadi parameter filter kaku (hard requirement) pada sistem seleksi beasiswa & open recruitment event.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* NIM */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>NIM (Nomor Induk Mahasiswa)</span>
                    <span className="text-[10px] text-emerald-600 font-bold">✓ Terverifikasi</span>
                  </label>
                  <Input
                    value={profile.nim}
                    onChange={(e) => handleInputChange("nim", e.target.value)}
                    placeholder="07211940000001"
                    className="text-xs bg-slate-50 font-mono font-semibold"
                  />
                </div>

                {/* Nama Mahasiswa */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Nama Lengkap Mahasiswa
                  </label>
                  <Input
                    value={profile.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="M. Haekal Rizky Firmansyah"
                    className="text-xs bg-slate-50 font-semibold"
                  />
                </div>

                {/* Perguruan Tinggi */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Perguruan Tinggi
                  </label>
                  <Input
                    value={profile.university}
                    onChange={(e) => handleInputChange("university", e.target.value)}
                    placeholder="Institut Teknologi Sepuluh Nopember (ITS)"
                    className="text-xs bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Fakultas */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Fakultas</label>
                  <select
                    value={profile.faculty}
                    onChange={(e) => handleInputChange("faculty", e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="FTEIC (Fakultas Teknologi Elektro dan Informatika Cerdas)">
                      FTEIC (Teknologi Elektro & Informatika Cerdas)
                    </option>
                    <option value="FTIRS (Fakultas Teknologi Industri dan Rekayasa Sistem)">
                      FTIRS (Teknologi Industri & Rekayasa Sistem)
                    </option>
                    <option value="FSAD (Fakultas Sains dan Analitika Data)">
                      FSAD (Sains & Analitika Data)
                    </option>
                    <option value="FTK (Fakultas Teknologi Kelautan)">
                      FTK (Teknologi Kelautan)
                    </option>
                    <option value="FTSPK (Fakultas Teknik Sipil, Perencanaan, dan Kebumian)">
                      FTSPK (Teknik Sipil & Perencanaan)
                    </option>
                  </select>
                </div>

                {/* Departemen / Prodi */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Departemen / Program Studi
                  </label>
                  <select
                    value={profile.major}
                    onChange={(e) => {
                      handleInputChange("major", e.target.value);
                      handleInputChange("department", e.target.value.replace("S1 ", ""));
                    }}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="S1 Teknik Elektro">S1 Teknik Elektro</option>
                    <option value="S1 Teknik Komputer">S1 Teknik Komputer</option>
                    <option value="S1 Teknik Informatika">S1 Teknik Informatika</option>
                    <option value="S1 Sistem Informasi">S1 Sistem Informasi</option>
                    <option value="S1 Teknik Biomedik">S1 Teknik Biomedik</option>
                    <option value="S1 Teknologi Informasi">S1 Teknologi Informasi</option>
                  </select>
                </div>

                {/* Jenjang Studi */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Jenjang Studi</label>
                  <select
                    value={profile.degreeLevel}
                    onChange={(e) => handleInputChange("degreeLevel", e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="S1 Sarjana">S1 - Sarjana</option>
                    <option value="D4 Sarjana Terapan">D4 - Sarjana Terapan</option>
                    <option value="S2 Magister">S2 - Magister</option>
                  </select>
                </div>
              </div>

              {/* IPK, Semester, SKS, Tahun Masuk */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-900">
                    IPK Kumulatif Terakhir
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.00"
                    value={profile.gpa}
                    onChange={(e) => handleInputChange("gpa", parseFloat(e.target.value) || 0)}
                    className="text-sm bg-white font-black text-blue-700 border-blue-200"
                  />
                  <span className="text-[10px] text-blue-600">Skala 4.00 (Transkrip Resmi)</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-900">Semester Saat Ini</label>
                  <Input
                    type="number"
                    min="1"
                    max="14"
                    value={profile.semester}
                    onChange={(e) => handleInputChange("semester", parseInt(e.target.value) || 1)}
                    className="text-sm bg-white font-bold text-slate-800 border-blue-200"
                  />
                  <span className="text-[10px] text-blue-600">Semester 2026/2027</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-900">Total SKS Tempuh</label>
                  <Input
                    type="number"
                    min="0"
                    max="160"
                    value={profile.sksCompleted}
                    onChange={(e) => handleInputChange("sksCompleted", parseInt(e.target.value) || 0)}
                    className="text-sm bg-white font-bold text-slate-800 border-blue-200"
                  />
                  <span className="text-[10px] text-blue-600">Dari total ~144 SKS</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-blue-900">Tahun Angkatan</label>
                  <Input
                    type="number"
                    value={profile.entryYear}
                    onChange={(e) => handleInputChange("entryYear", parseInt(e.target.value) || 2024)}
                    className="text-sm bg-white font-bold text-slate-800 border-blue-200"
                  />
                  <span className="text-[10px] text-blue-600">Tahun Masuk ITS</span>
                </div>
              </div>

              {/* Dosen Wali & Lab Peminatan */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Dosen Pembimbing Akademik / Wali
                  </label>
                  <Input
                    value={profile.academicAdvisor}
                    onChange={(e) => handleInputChange("academicAdvisor", e.target.value)}
                    placeholder="Dr. Budi Santoso, S.T., M.T."
                    className="text-xs bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Laboratorium Riset / Peminatan
                  </label>
                  <Input
                    value={profile.focusLab}
                    onChange={(e) => handleInputChange("focusLab", e.target.value)}
                    placeholder="Lab Sistem Tertanam & Robotika"
                    className="text-xs bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Status FRS myITS</label>
                  <Input
                    value={profile.academicStatus}
                    onChange={(e) => handleInputChange("academicStatus", e.target.value)}
                    placeholder="Aktif (FRS myITS Terverifikasi)"
                    className="text-xs bg-slate-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 2: Kontak & Bio Mahasiswa */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-600" />
                <CardTitle className="text-base font-bold text-slate-900">
                  2. Kontak Pribadi & Bio Mahasiswa
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Resmi myITS</label>
                  <Input
                    value={profile.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="nama.nrp@student.its.ac.id"
                    className="text-xs bg-slate-50 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nomor WhatsApp Aktif</label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="081234567890"
                    className="text-xs bg-slate-50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Bio / Ringkasan Akademik & Fokus Pengembangan Diri
                </label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                  className="text-xs bg-slate-50 leading-relaxed"
                  placeholder="Ceritakan latar belakang ketertarikan Anda pada riset atau organisasi..."
                />
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: Keahlian Teknis (Hard Skills), Soft Skills & Bidang Minat */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <CardTitle className="text-base font-bold text-slate-900">
                  3. Keahlian Teknis (Hard Skills), Soft Skills & Bidang Minat
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-500">
                Sesuaikan dan tambahkan keahlian Anda secara mandiri di sini. AI akan memakai data ini untuk mencocokkan kriteria open recruitment dan beasiswa.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-5">
              {/* Hard Skills */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Keahlian Teknis (Hard Skills)</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    {profile.skills.length} keahlian terdaftar
                  </span>
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 min-h-[48px]">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold border border-blue-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-blue-500 hover:text-red-600 font-bold ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    placeholder="Ketik keahlian teknis (contoh: 'FPGA', 'Verilog', 'ROS', 'Python', 'PLC')..."
                    className="text-xs bg-white"
                  />
                  <Button size="sm" type="button" onClick={addSkill} className="text-xs shrink-0 bg-blue-600 text-white">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Skill
                  </Button>
                </div>
              </div>

              {/* Soft Skills */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800">Keahlian Lunak (Soft Skills)</label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 min-h-[48px]">
                  {profile.softSkills.map((sk) => (
                    <span
                      key={sk}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-semibold border border-indigo-200"
                    >
                      {sk}
                      <button
                        type="button"
                        onClick={() => removeSoftSkill(sk)}
                        className="text-indigo-500 hover:text-red-600 font-bold ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <Input
                    value={newSoftSkill}
                    onChange={(e) => setNewSoftSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSoftSkill())}
                    placeholder="Ketik soft skill (contoh: 'Public Speaking', 'Event Management', 'Leadership')..."
                    className="text-xs bg-white"
                  />
                  <Button size="sm" type="button" onClick={addSoftSkill} className="text-xs shrink-0 bg-indigo-600 text-white">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Soft Skill
                  </Button>
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800">Bidang Minat & Karir</label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 min-h-[48px]">
                  {profile.interests.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-semibold border border-purple-200"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeInterest(item)}
                        className="text-purple-500 hover:text-red-600 font-bold ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                    placeholder="Ketik minat (contoh: 'Autonomous Robotics', 'Industrial IoT', 'Smart Grid')..."
                    className="text-xs bg-white"
                  />
                  <Button size="sm" type="button" onClick={addInterest} className="text-xs shrink-0 bg-purple-600 text-white">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Minat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 4: Riwayat Organisasi, Kepanitiaan & Asisten Lab */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  <CardTitle className="text-base font-bold text-slate-900">
                    4. Riwayat Organisasi, Kepanitiaan & Asisten Lab
                  </CardTitle>
                </div>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Tambahkan atau sesuaikan pengalaman kepengurusan Anda di lingkungan ITS.
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddExp(!showAddExp)}
                className="text-xs gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Pengalaman
              </Button>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
              {/* Form Input New Exp */}
              {showAddExp && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <p className="text-xs font-bold text-slate-800">Form Pengalaman Baru</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      placeholder="Posisi / Jabatan (e.g. Staff Ristek)"
                      value={newExp.title}
                      onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                      className="text-xs bg-white"
                    />
                    <Input
                      placeholder="Nama Organisasi / Lab (e.g. HIMATEKTRO ITS)"
                      value={newExp.organization}
                      onChange={(e) => setNewExp({ ...newExp, organization: e.target.value })}
                      className="text-xs bg-white"
                    />
                    <Input
                      placeholder="Periode (e.g. 2025 - 2026)"
                      value={newExp.duration}
                      onChange={(e) => setNewExp({ ...newExp, duration: e.target.value })}
                      className="text-xs bg-white"
                    />
                  </div>
                  <Textarea
                    placeholder="Deskripsi tugas dan kontribusi utama..."
                    value={newExp.description}
                    onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                    rows={2}
                    className="text-xs bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setShowAddExp(false)} className="text-xs">
                      Batal
                    </Button>
                    <Button size="sm" onClick={handleAddExperience} className="text-xs bg-emerald-600 text-white">
                      Simpan Pengalaman
                    </Button>
                  </div>
                </div>
              )}

              {/* List of Experiences */}
              <div className="space-y-3">
                {profile.experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition-colors flex justify-between items-start gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-800">{exp.title}</span>
                        <Badge variant="outline" className="text-[11px] font-semibold text-blue-700 bg-blue-50">
                          {exp.organization}
                        </Badge>
                        <span className="text-[11px] text-slate-400">({exp.duration})</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExperience(exp.id)}
                      className="text-slate-400 hover:text-red-600 shrink-0 h-7 w-7"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SECTION 5: Prestasi & Penghargaan Kompetisi */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <CardTitle className="text-base font-bold text-slate-900">
                    5. Prestasi & Penghargaan Kompetisi (Achievements)
                  </CardTitle>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddAch(!showAddAch)}
                className="text-xs gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Prestasi
              </Button>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
              {/* Form Add Achievement */}
              {showAddAch && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <p className="text-xs font-bold text-slate-800">Form Prestasi Baru</p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Input
                      placeholder="Nama Prestasi / Juara"
                      value={newAch.title}
                      onChange={(e) => setNewAch({ ...newAch, title: e.target.value })}
                      className="text-xs bg-white md:col-span-2"
                    />
                    <select
                      value={newAch.level}
                      onChange={(e) => setNewAch({ ...newAch, level: e.target.value })}
                      className="text-xs p-2 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="Internasional">Internasional</option>
                      <option value="Nasional">Nasional</option>
                      <option value="Regional">Regional</option>
                      <option value="Kampus">Tingkat Kampus</option>
                    </select>
                    <Input
                      placeholder="Tahun (e.g. 2025)"
                      value={newAch.year}
                      onChange={(e) => setNewAch({ ...newAch, year: e.target.value })}
                      className="text-xs bg-white"
                    />
                  </div>
                  <Input
                    placeholder="Lembaga Penyelenggara (e.g. Kemendikbudristek, IEEE, ITS)"
                    value={newAch.organizer}
                    onChange={(e) => setNewAch({ ...newAch, organizer: e.target.value })}
                    className="text-xs bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setShowAddAch(false)} className="text-xs">
                      Batal
                    </Button>
                    <Button size="sm" onClick={handleAddAchievement} className="text-xs bg-amber-600 text-white">
                      Simpan Prestasi
                    </Button>
                  </div>
                </div>
              )}

              {/* Achievements List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profile.achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-amber-300 transition-colors flex justify-between items-start gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px] font-bold">
                          {ach.level}
                        </Badge>
                        <span className="text-xs text-slate-400 font-semibold">Tahun {ach.year}</span>
                      </div>
                      <p className="font-bold text-xs md:text-sm text-slate-800">{ach.title}</p>
                      {ach.organizer && (
                        <p className="text-[11px] text-slate-500">Penyelenggara: {ach.organizer}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAchievement(ach.id)}
                      className="text-slate-400 hover:text-red-600 shrink-0 h-6 w-6"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SECTION 6: Kesiapan Dokumen & Berkas */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-base font-bold text-slate-900">
                  6. Berkas & Dokumen Persyaratan yang Siap
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-500">
                Centang dokumen yang sudah Anda miliki untuk otomatis meningkatkan skor kelayakan administrasi di CampusMatch.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {availableDocsList.map((doc) => {
                  const isChecked = profile.documentsReady.includes(doc);
                  return (
                    <label
                      key={doc}
                      onClick={() => toggleDoc(doc)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                        isChecked
                          ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold"
                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <Checkbox checked={isChecked} onCheckedChange={() => toggleDoc(doc)} />
                      <span>{doc}</span>
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Bottom Submit / Save Action Bar */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>
                Data tersimpan secara otomatis dan tersinkron ke modul <strong>Opportunities</strong> & <strong>My Matches</strong>.
              </span>
            </div>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow px-6"
            >
              {isSubmitting ? (
                <>Menyimpan...</>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Simpan Semua Perubahan
                </>
              )}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
