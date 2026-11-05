"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowUpRight,
  TrendingUp,
  FileCheck2,
  GraduationCap,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  Filter,
  FileText,
  UploadCloud,
} from "lucide-react";
import {
  OpportunityItem,
  StudentProfileData,
  getStoredProfile,
  getStoredOpportunities,
  calculateMatch,
  MatchEvaluation,
} from "@/lib/data-store";

function MatchesContent() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ELIGIBLE" | "PARTIAL" | "INELIGIBLE">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  useEffect(() => {
    const load = () => {
      setProfile(getStoredProfile());
      setOpportunities(getStoredOpportunities());
    };
    load();

    const handleProfileUpdate = () => setProfile(getStoredProfile());
    const handleOppsUpdate = () => setOpportunities(getStoredOpportunities());

    window.addEventListener("campusmatch:profile_updated", handleProfileUpdate);
    window.addEventListener("campusmatch:opportunities_updated", handleOppsUpdate);

    return () => {
      window.removeEventListener("campusmatch:profile_updated", handleProfileUpdate);
      window.removeEventListener("campusmatch:opportunities_updated", handleOppsUpdate);
    };
  }, []);

  // Compute evaluations directly from CV-extracted profile data
  const evaluations: MatchEvaluation[] = useMemo(() => {
    if (!profile) return [];
    return opportunities
      .map((opp) => calculateMatch(opp, profile))
      .sort((a, b) => b.score - a.score);
  }, [opportunities, profile]);

  // Filtered evaluations
  const filteredEvaluations = useMemo(() => {
    return evaluations.filter((item) => {
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (categoryFilter !== "ALL" && item.opportunity.category !== categoryFilter) return false;
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const inTitle = item.opportunity.title.toLowerCase().includes(q);
        const inOrg = item.opportunity.organization.name.toLowerCase().includes(q);
        const inTags = item.opportunity.tags.some((t) => t.toLowerCase().includes(q));
        const inSkills = item.matchedSkills.some((s) => s.toLowerCase().includes(q));
        return inTitle || inOrg || inTags || inSkills;
      }
      return true;
    });
  }, [evaluations, statusFilter, categoryFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const eligibleCount = evaluations.filter((e) => e.status === "ELIGIBLE").length;
    const partialCount = evaluations.filter((e) => e.status === "PARTIAL").length;
    const ineligibleCount = evaluations.filter((e) => e.status === "INELIGIBLE").length;
    const avgScore =
      evaluations.length > 0
        ? Math.round(evaluations.reduce((acc, curr) => acc + curr.score, 0) / evaluations.length)
        : 0;

    return { eligibleCount, partialCount, ineligibleCount, avgScore };
  }, [evaluations]);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "SCHOLARSHIP":
        return "Beasiswa";
      case "ORGANIZATION":
        return "Himpunan / BEM";
      case "COMPETITION":
        return "Kompetisi";
      case "RESEARCH":
        return "Tim Riset / Lab";
      case "UKM":
        return "UKM Riset";
      case "COMMITTEE":
        return "Event Akbar";
      default:
        return cat;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
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
        <Header
          title="Hasil Pencocokan CV (My Matches)"
          userName={profile?.name || "Praditya Haekal Islami Al Haqiqi"}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          searchPlaceholder="Cari hasil pencocokan berdasarkan program atau skill..."
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Header Banner: Driven by CV Upload */}
          <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-200 border border-white/20 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Kalkulasi Berbasis Hasil Scan CV & Gemini AI
                </div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                  Pencocokan Peluang Berdasarkan Curriculum Vitae Anda
                </h1>
                <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Menghitung tingkat kesesuaian antara ekstraksi keahlian, riwayat organisasi, dan profil akademik pada CV mahasiswa terhadap syarat kaku program se-ITS.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  onClick={() => router.push("/cv-upload")}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Upload CV Baru
                </Button>
              </div>
            </div>

            {/* Active CV Reference Strip */}
            <div className="mt-5 p-3 rounded-xl bg-white/10 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-yellow-300" />
                <span className="text-slate-300">Berkas CV Aktif:</span>
                <span className="font-mono font-bold text-white">
                  {profile?.cvFileName || "CV_M_Haekal_Teknik_Elektro_ITS.pdf"}
                </span>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-[10px]">
                  Terpindai ({profile?.skills.length || 8} Keahlian)
                </Badge>
              </div>
              <span className="text-slate-400 text-[11px]">
                Waktu Sinkronisasi: {profile?.cvParsedAt || "Terbaru"}
              </span>
            </div>

            {/* Quick Stat Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-[11px] text-slate-400">Total Program Dinilai</p>
                <p className="text-xl font-extrabold text-white mt-0.5">{evaluations.length} Program</p>
              </div>
              <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
                <p className="text-[11px] text-emerald-300 font-medium">Lolos Syarat Kaku</p>
                <p className="text-xl font-extrabold text-emerald-400 mt-0.5">{stats.eligibleCount} Program</p>
              </div>
              <div className="bg-amber-500/10 rounded-xl p-3 border border-amber-500/20">
                <p className="text-[11px] text-amber-300 font-medium">Parsial (Cukup Berkas)</p>
                <p className="text-xl font-extrabold text-amber-400 mt-0.5">{stats.partialCount} Program</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-[11px] text-slate-400">Rata-rata Skor Match</p>
                <p className="text-xl font-extrabold text-blue-400 mt-0.5">{stats.avgScore}%</p>
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari program cocok, contoh: 'GERIGI', 'HIMATEKTRO', 'Anargya', 'Bayucaraka'..."
                  className="pl-10 text-sm bg-slate-50 border-slate-200 focus:bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full px-1.5 py-0.5"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto">
                {[
                  { label: "Semua", value: "ALL" },
                  { label: "Lolos Syarat (>= 80%)", value: "ELIGIBLE" },
                  { label: "Parsial (60-79%)", value: "PARTIAL" },
                  { label: "Butuh Persiapan (< 60%)", value: "INELIGIBLE" },
                ].map((st) => (
                  <button
                    key={st.value}
                    onClick={() => setStatusFilter(st.value as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      statusFilter === st.value
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-semibold mr-1 shrink-0">Kategori:</span>
              {[
                { label: "Semua", value: "ALL" },
                { label: "Event Akbar", value: "COMMITTEE" },
                { label: "Tim Riset", value: "RESEARCH" },
                { label: "Himpunan (HIMA)", value: "ORGANIZATION" },
                { label: "Beasiswa", value: "SCHOLARSHIP" },
                { label: "UKM Riset", value: "UKM" },
              ].map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategoryFilter(c.value)}
                  className={`px-2.5 py-1 rounded font-medium ${
                    categoryFilter === c.value
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Matches List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Menampilkan <strong>{filteredEvaluations.length}</strong> hasil pencocokan dari analisis CV
              </span>
              <span className="text-slate-400">Diurutkan berdasarkan skor tertinggi</span>
            </div>

            {filteredEvaluations.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3">
                <Target className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Tidak ada hasil yang cocok dengan filter</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Silakan ubah filter status atau periksa kembali kata kunci pencarian Anda.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                    setCategoryFilter("ALL");
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvaluations.map((evalData) => {
                  const opp = evalData.opportunity;

                  return (
                    <Card
                      key={opp.id}
                      className="border-slate-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                    >
                      <div className="p-5 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          {/* Left Column: Opp Title & Org */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs bg-slate-100 font-semibold text-slate-700">
                                {getCategoryLabel(opp.category)}
                              </Badge>
                              <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                {opp.organization.name}
                              </span>
                            </div>

                            <CardTitle
                              className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                              onClick={() => router.push(`/opportunities?search=${encodeURIComponent(opp.title)}`)}
                            >
                              {opp.title}
                            </CardTitle>

                            <CardDescription className="text-xs text-slate-600 line-clamp-2">
                              {opp.description}
                            </CardDescription>

                            {/* Divisions list if applicable */}
                            {opp.divisions && opp.divisions.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs text-slate-500">
                                <span className="font-semibold text-blue-700">Divisi Terbuka:</span>
                                {opp.divisions.slice(0, 3).map((d) => (
                                  <span key={d} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                                    {d}
                                  </span>
                                ))}
                                {opp.divisions.length > 3 && (
                                  <span className="text-[10px] text-slate-400">+{opp.divisions.length - 3} lagi</span>
                                )}
                              </div>
                            )}

                            {/* AI Recommendation Quote */}
                            <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900 flex items-start gap-2 mt-2">
                              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <p className="font-semibold text-blue-950">Analisis Rekomendasi AI Gemini:</p>
                                <p className="leading-relaxed">{evalData.recommendation}</p>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Score Gauge & Status */}
                          <div className="md:w-56 shrink-0 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 text-center space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                              Skor Kesesuaian CV
                            </span>
                            <div className="flex items-baseline justify-center gap-1">
                              <span
                                className={`text-4xl font-extrabold ${
                                  evalData.score >= 85
                                    ? "text-emerald-600"
                                    : evalData.score >= 70
                                    ? "text-amber-600"
                                    : "text-slate-600"
                                }`}
                              >
                                {evalData.score}%
                              </span>
                            </div>

                            <Progress
                              value={evalData.score}
                              className={`h-2 w-full ${
                                evalData.score >= 85
                                ? "bg-emerald-100"
                                : evalData.score >= 70
                                ? "bg-amber-100"
                                : "bg-slate-200"
                              }`}
                            />

                            <div>
                              {evalData.status === "ELIGIBLE" && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Memenuhi Syarat
                                </span>
                              )}
                              {evalData.status === "PARTIAL" && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                                  <AlertCircle className="w-3.5 h-3.5" /> Parsial
                                </span>
                              )}
                              {evalData.status === "INELIGIBLE" && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-full">
                                  <HelpCircle className="w-3.5 h-3.5" /> Butuh Persiapan
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Detailed Criteria Breakdown Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                          {/* 1. Academic Criteria */}
                          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 space-y-1.5">
                            <span className="font-bold text-slate-700 flex items-center gap-1.5">
                              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                              Syarat Akademik Kaku
                            </span>
                            <div className="space-y-1 text-slate-600">
                              <div className="flex items-center justify-between">
                                <span>IPK (Min {opp.minGpa || "Bebas"}):</span>
                                <span className={evalData.gpaPassed ? "text-emerald-700 font-bold" : "text-red-600 font-bold"}>
                                  {profile?.gpa.toFixed(2)} {evalData.gpaPassed ? "✓" : "✗"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Semester ({opp.minSemester || 1}-{opp.maxSemester || 8}):</span>
                                <span className={evalData.semesterPassed ? "text-emerald-700 font-bold" : "text-amber-600 font-bold"}>
                                  Sem {profile?.semester} {evalData.semesterPassed ? "✓" : "✗"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 2. Skills Match from CV */}
                          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 space-y-1.5">
                            <span className="font-bold text-slate-700 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                              Kesesuaian Skill CV
                            </span>
                            {opp.requiredSkills.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {opp.requiredSkills.map((sk) => {
                                  const matched = evalData.matchedSkills.includes(sk);
                                  return (
                                    <span
                                      key={sk}
                                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                        matched
                                          ? "bg-emerald-100 text-emerald-800"
                                          : "bg-slate-200 text-slate-700"
                                      }`}
                                    >
                                      {sk} {matched ? "✓" : "•"}
                                    </span>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-slate-400 text-[11px]">Tidak ada keahlian khusus yang diwajibkan</p>
                            )}
                          </div>

                          {/* 3. Document Readiness */}
                          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 space-y-1.5">
                            <span className="font-bold text-slate-700 flex items-center gap-1.5">
                              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                              Kesiapan Berkas
                            </span>
                            <div className="flex items-center justify-between text-slate-600">
                              <span>Berkas Siap:</span>
                              <span className="font-bold text-slate-800">
                                {evalData.matchedDocs.length} / {opp.requiredDocs.length || 1}
                              </span>
                            </div>
                            {evalData.missingDocs.length > 0 && (
                              <p className="text-[10px] text-amber-700 font-medium">
                                Kurang: {evalData.missingDocs.slice(0, 2).join(", ")}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center justify-between pt-4 mt-2">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Batas Pendaftaran: <strong>{opp.applicationEnd}</strong>
                          </span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/gap-analysis?oppId=${opp.id}`)}
                              className="text-xs text-blue-700 border-blue-200 hover:bg-blue-50 gap-1"
                            >
                              <TrendingUp className="w-3.5 h-3.5" /> Analisis Gap
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => router.push(`/opportunities?search=${encodeURIComponent(opp.title)}`)}
                              className="text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1"
                            >
                              Daftar Program <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function MatchesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Memuat Rekomendasi Matches...</div>}>
      <MatchesContent />
    </Suspense>
  );
}
