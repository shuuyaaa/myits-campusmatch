"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Compass,
  Target,
  TrendingUp,
  User,
  FileText,
  ShieldCheck,
  Settings,
} from "lucide-react";
import {
  StudentProfileData,
  OpportunityItem,
  getStoredProfile,
  getStoredOpportunities,
  calculateMatch,
} from "@/lib/data-store";

export default function DashboardPage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);

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

  const evaluatedList = React.useMemo(() => {
    if (!profile) return [];
    return opportunities
      .map((opp) => ({
        ...opp,
        eval: calculateMatch(opp, profile),
      }))
      .sort((a, b) => b.eval.score - a.eval.score);
  }, [opportunities, profile]);

  const topRecommendations = evaluatedList.slice(0, 3);
  const eligibleCount = evaluatedList.filter((o) => o.eval.status === "ELIGIBLE").length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigasi myITS */}
      <Sidebar
        role="STUDENT"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        user={{
          name: profile?.name || "Praditya Haekal Islami Al Haqiqi",
          role: `${profile?.major || "S1 Teknik Elektro"} (Sem. ${profile?.semester || 5})`,
          initials: "PH",
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar dengan Search Aktif */}
        <Header
          title="Dashboard Rekomendasi Peluang"
          userName={profile?.name || "Praditya Haekal Islami Al Haqiqi"}
          searchPlaceholder="Cari GERIGI, HIMATEKTRO, Bayucaraka, Anargya, Lab, Beasiswa..."
        />

        {/* Konten Utama Dashboard */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Banner Selamat Datang */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 p-6 text-white shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" /> AI Engine Active (Gemini API)
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                    <ShieldCheck className="w-3 h-3" /> myITS Portal Terintegrasi
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                  myITS CampusMatch — Solusi Arah Mahasiswa 2026/2027
                </h1>
                <p className="text-blue-100 text-xs md:text-sm mt-1 max-w-xl leading-relaxed">
                  Platform pencocokan cerdas berbasis syarat kaku & hasil analisis CV untuk membantu mahasiswa Institut Teknologi Sepuluh Nopember menemukan lab, himpunan, tim riset, event akbar, dan beasiswa impian.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
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

          {/* Kartu Profil Singkat Mahasiswa (myITS Portal SSO Data) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="hover:border-blue-300 transition-colors cursor-pointer" onClick={() => router.push("/profile")}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <p className="text-xs text-muted-foreground font-medium">Departemen / Prodi</p>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <p className="text-sm md:text-base font-bold text-slate-800 mt-1 truncate">
                  {profile?.department || "Teknik Elektro"}
                </p>
                <span className="text-xs text-blue-600 font-medium">FTEIC - ITS</span>
              </CardContent>
            </Card>

            <Card className="hover:border-blue-300 transition-colors cursor-pointer" onClick={() => router.push("/profile")}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <p className="text-xs text-muted-foreground font-medium">IPK myITS</p>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Resmi</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-xl md:text-2xl font-bold text-slate-800">
                    {profile?.gpa.toFixed(2) || "3.72"}
                  </p>
                  <span className="text-xs text-emerald-600 font-medium">/ 4.00</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-blue-300 transition-colors cursor-pointer" onClick={() => router.push("/profile")}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground font-medium">Semester / SKS</p>
                <p className="text-sm md:text-base font-bold text-slate-800 mt-1">
                  Semester {profile?.semester || 5} ({profile?.sksCompleted || 96} SKS)
                </p>
                <span className="text-xs text-emerald-600 font-semibold">{profile?.academicStatus || "Aktif FRS"}</span>
              </CardContent>
            </Card>

            <Card className="hover:border-blue-300 transition-colors cursor-pointer" onClick={() => router.push("/matches")}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground font-medium">Peluang Lolos Kaku</p>
                <p className="text-xl md:text-2xl font-bold text-blue-600 mt-1">
                  {eligibleCount} Program
                </p>
                <span className="text-xs text-emerald-600 font-medium">
                  {opportunities.length} Total Terbuka se-ITS
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Navigasi Cepat Modul Utama */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => router.push("/opportunities")}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Compass className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs md:text-sm text-slate-800 mt-2">Katalog Peluang</p>
              <p className="text-[11px] text-slate-500">GERIGI, HIMATEKTRO, Tim Riset, Lab</p>
            </button>

            <button
              onClick={() => router.push("/matches")}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 w-fit group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Target className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs md:text-sm text-slate-800 mt-2">My Matches (CV)</p>
              <p className="text-[11px] text-slate-500">Kecocokan hasil scan CV Anda</p>
            </button>

            <button
              onClick={() => router.push("/gap-analysis")}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 w-fit group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs md:text-sm text-slate-800 mt-2">Gap Analysis</p>
              <p className="text-[11px] text-slate-500">Roadmap kelayakan 100%</p>
            </button>

            <button
              onClick={() => router.push("/profile")}
              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-sm text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 w-fit group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </div>
              <p className="font-bold text-xs md:text-sm text-slate-800 mt-2">My Profile</p>
              <p className="text-[11px] text-slate-500">Adjust skill, organisasi & prestasi</p>
            </button>
          </div>

          {/* Organizer / Admin Quick Banner */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
            <div className="space-y-0.5">
              <span className="text-[11px] text-yellow-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" /> Portal Khusus Penyelenggara Lowongan Oprec Kampus
              </span>
              <p className="text-xs md:text-sm text-slate-200">
                Membuka lowongan panitia GERIGI ITS, pengurus HIMATEKTRO, atau kru tim riset? Buat formulir parameter layaknya Google Form dan kelola spreadsheet pendaftar otomatis di sini.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                onClick={() => router.push("/admin/opportunities")}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Buka Lowongan Oprec Baru
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push("/admin/applicants")}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold"
              >
                Spreadsheet Pendaftar
              </Button>
            </div>
          </div>

          {/* Daftar Rekomendasi Peluang Teratas */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Rekomendasi Teratas Berdasarkan Profil & CV</h2>
                <p className="text-xs text-slate-500">
                  Dihitung otomatis membandingkan IPK, keahlian, dan departemen Anda terhadap syarat kaku
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/opportunities")}
                className="text-xs text-blue-700 border-blue-200 hover:bg-blue-50"
              >
                Lihat Semua ({opportunities.length})
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {topRecommendations.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow border-slate-200 flex flex-col justify-between">
                  <div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge
                          className={
                            item.category === "SCHOLARSHIP"
                              ? "bg-emerald-600 text-white"
                              : item.category === "ORGANIZATION"
                              ? "bg-indigo-600 text-white"
                              : item.category === "COMMITTEE"
                              ? "bg-rose-600 text-white"
                              : "bg-blue-600 text-white"
                          }
                        >
                          {item.category === "SCHOLARSHIP"
                            ? "Beasiswa"
                            : item.category === "ORGANIZATION"
                            ? "Himpunan"
                            : item.category === "COMMITTEE"
                            ? "Event Akbar"
                            : "Tim Riset"}
                        </Badge>
                        <div className="text-right">
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-full ${
                              item.eval.score >= 85
                                ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                                : "text-amber-700 bg-amber-50 border border-amber-200"
                            }`}
                          >
                            {item.eval.score}% Match
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-base font-bold mt-2 text-slate-800 line-clamp-1">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-600 line-clamp-2">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Min. IPK {item.minGpa ? item.minGpa.toFixed(2) : "Bebas"} (Anda: {profile?.gpa.toFixed(2)})
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Semester {item.minSemester || 1}–{item.maxSemester || 8} (Anda: Semester {profile?.semester})
                        </div>
                      </div>
                      <Progress value={item.eval.score} className="h-1.5" />
                    </CardContent>
                  </div>

                  <div className="p-4 pt-0">
                    <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                      <span className="text-xs text-slate-400">Deadline: {item.applicationEnd}</span>
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/gap-analysis?oppId=${item.id}`)}
                          className="text-xs text-blue-700 hover:bg-blue-50"
                        >
                          Gap
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/opportunities?search=${encodeURIComponent(item.title)}`)}
                          className="gap-1 text-xs"
                        >
                          Daftar <ArrowUpRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
