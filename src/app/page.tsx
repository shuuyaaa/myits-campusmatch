"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowUpRight,
  Compass,
  FileText,
  ShieldCheck,
  Building2,
  Calendar,
  ExternalLink,
  GraduationCap,
  Users,
  CheckCircle2,
  User,
  X,
  ArrowRight,
} from "lucide-react";
import {
  StudentProfileData,
  OpportunityItem,
  getStoredProfile,
  getStoredOpportunities,
} from "@/lib/data-store";

export default function DashboardPage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);

  useEffect(() => {
    setProfile(getStoredProfile());
    setOpportunities(getStoredOpportunities());

    const handleProfileUpdate = () => setProfile(getStoredProfile());
    const handleOppsUpdate = () => setOpportunities(getStoredOpportunities());

    window.addEventListener("campusmatch:profile_updated", handleProfileUpdate);
    window.addEventListener("campusmatch:opportunities_updated", handleOppsUpdate);

    return () => {
      window.removeEventListener("campusmatch:profile_updated", handleProfileUpdate);
      window.removeEventListener("campusmatch:opportunities_updated", handleOppsUpdate);
    };
  }, []);

  // Peluang terbaru diurutkan dari daftar yang terbuka
  const latestOpportunities = opportunities.slice(0, 6);

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "COMMITTEE":
        return <Badge className="bg-rose-600 hover:bg-rose-700 text-white font-medium">Kepanitiaan</Badge>;
      case "ORGANIZATION":
        return <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-medium">Himpunan</Badge>;
      case "RESEARCH":
        return <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium">Tim Riset</Badge>;
      case "LAB":
        return <Badge className="bg-teal-600 hover:bg-teal-700 text-white font-medium">Laboratorium</Badge>;
      case "COMPETITION":
        return <Badge className="bg-amber-600 hover:bg-amber-700 text-white font-medium">Kompetisi</Badge>;
      case "SCHOLARSHIP":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">Beasiswa</Badge>;
      default:
        return <Badge variant="secondary">{cat}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigasi myITS */}
      <Sidebar
        role="STUDENT"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        user={{
          name: profile?.name || "Praditya Haekal Islami Al Haqiqi",
          role: profile?.department || "Departemen Teknik Elektro",
          initials: "PH",
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <Header
          title="Dashboard"
          userName={profile?.name || "Praditya Haekal Islami Al Haqiqi"}
          showSearch={false}
        />

        {/* Konten Utama Dashboard */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Banner Selamat Datang - Kalimat Baku & Persuasif */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 p-6 md:p-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Platform Penjaringan & Pencocokan AI
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                    <ShieldCheck className="w-3 h-3" /> myITS SSO Terverifikasi
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
                  myITS CampusMatch — Solusi Arah Mahasiswa 2026/2027
                </h1>
                <p className="text-blue-100 text-xs md:text-sm mt-2 leading-relaxed font-normal">
                  Wujudkan potensi terbaik perjalanan akademik Anda. myITS CampusMatch memfasilitasi mahasiswa Institut Teknologi Sepuluh Nopember dalam menemukan rekrutmen kepanitiaan, tim riset, himpunan mahasiswa, laboratorium, kompetisi, dan beasiswa secara terarah, presisi, dan terintegrasi.
                </p>
              </div>
              <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
                <Button
                  onClick={() => router.push("/cv-upload")}
                  className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow text-xs"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                  Upload & Scan CV
                </Button>
                <Button
                  onClick={() => router.push("/opportunities")}
                  className="bg-blue-900/60 hover:bg-blue-900 text-white font-semibold border border-white/20 text-xs"
                >
                  <Compass className="w-3.5 h-3.5 mr-1.5" />
                  Jelajah Peluang Kampus
                </Button>
              </div>
            </div>
          </div>

          {/* 4 Kotak Rectangle Informasi Akademik Mahasiswa */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* Card 1: Departemen (Hanya Departemen, Prodi dihapus) */}
            <Card className="border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Departemen</p>
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <p className="text-sm md:text-base font-bold text-slate-800 mt-1 truncate">
                  {profile?.department || "Departemen Teknik Elektro"}
                </p>
                <span className="text-[11px] text-slate-500 font-medium">FTEIC - ITS</span>
              </CardContent>
            </Card>

            {/* Card 2: IPK myITS */}
            <Card className="border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">IPK myITS</p>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Resmi</span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <p className="text-xl md:text-2xl font-bold text-slate-800">
                    {profile?.gpa.toFixed(2) || "3.72"}
                  </p>
                  <span className="text-xs text-slate-500">/ 4.00</span>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Semester / SKS */}
            <Card className="border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Semester / SKS</p>
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <p className="text-sm md:text-base font-bold text-slate-800 mt-1">
                  Semester {profile?.semester || 5} ({profile?.sksCompleted || 96} SKS)
                </p>
                <span className="text-[11px] text-emerald-600 font-semibold">{profile?.academicStatus || "Aktif FRS"}</span>
              </CardContent>
            </Card>

            {/* Card 4: Peluang Terbuka (Menggantikan peluang lolos kaku) */}
            <Card className="border-slate-200 shadow-xs hover:border-blue-300 transition-colors cursor-pointer" onClick={() => router.push("/opportunities")}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Peluang Terbuka</p>
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <p className="text-xl md:text-2xl font-bold text-blue-600 mt-1">
                  {opportunities.length} Program
                </p>
                <span className="text-[11px] text-slate-500">Kepanitiaan, Lab, Riset, Hima</span>
              </CardContent>
            </Card>
          </div>

          {/* Daftar Peluang & Rekrutmen Terbaru (Bukan rekomendasi profiling CV) */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Peluang & Rekrutmen Terbaru</h2>
                <p className="text-xs text-slate-500">
                  Informasi pembukaan pendaftaran kepanitiaan, laboratorium, himpunan mahasiswa, dan tim riset yang baru dipublikasikan di ITS
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/opportunities")}
                className="text-xs text-blue-700 border-blue-200 hover:bg-blue-50 self-start sm:self-auto"
              >
                Lihat Seluruh Peluang ({opportunities.length})
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestOpportunities.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow border-slate-200 flex flex-col justify-between bg-white">
                  <div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        {getCategoryBadge(item.category)}
                        <span className="text-[11px] text-slate-400 font-medium">
                          Batas: {item.applicationEnd}
                        </span>
                      </div>
                      <CardTitle className="text-base font-bold mt-2 text-slate-900 line-clamp-1">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2.5 pt-0 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.organization.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Min. Semester {item.minSemester || 1} &bull; Min. IPK {item.minGpa ? item.minGpa.toFixed(2) : "Bebas"}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.requiredSkills.slice(0, 3).map((sk) => (
                          <span key={sk} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </div>

                  <div className="p-4 pt-0">
                    <div className="pt-3 border-t border-slate-100">
                      <Button
                        size="sm"
                        onClick={() => setSelectedOpp(item)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 justify-center shadow-xs"
                      >
                        Baca Selengkapnya
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modal Detail Peluang */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                {getCategoryBadge(selectedOpp.category)}
                <h3 className="text-lg font-bold text-slate-900 mt-2">{selectedOpp.title}</h3>
                <p className="text-xs text-slate-500">{selectedOpp.organization.name}</p>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                &times;
              </button>
            </div>

            {/* Area Deskripsi & Tombol Pendaftaran diselipkan */}
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-800 mb-1">Deskripsi Kegiatan:</p>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedOpp.description}</p>
              </div>

              {/* Tombol Pendaftaran diselipkan di dalam deskripsi */}
              <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-2">
                <div>
                  <p className="font-bold flex items-center gap-1.5 text-blue-900">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" /> Formulir Pendaftaran Resmi
                  </p>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Pendaftaran dan seleksi berkas dikelola langsung oleh pihak {selectedOpp.organization.name} melalui Google Form resmi.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    window.open(selectedOpp.googleFormUrl, "_blank");
                    setSelectedOpp(null);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 shadow-xs"
                >
                  Buka Form Pendaftaran (Google Form)
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {selectedOpp.divisions && selectedOpp.divisions.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-800 mb-1.5">Divisi / Formasi yang Dibuka:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedOpp.divisions.map((d) => (
                    <span key={d} className="px-2 py-1 rounded-md text-[11px] bg-blue-50 text-blue-700 font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-bold text-slate-800 mb-1">Persyaratan & Keahlian:</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedOpp.requiredSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => setSelectedOpp(null)}
              >
                Tutup
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 font-semibold"
                onClick={() => {
                  window.open(selectedOpp.googleFormUrl, "_blank");
                  setSelectedOpp(null);
                }}
              >
                Buka Form Pendaftaran
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
