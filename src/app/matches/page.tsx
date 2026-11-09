"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
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
  ExternalLink,
  GraduationCap,
  Building2,
  Calendar,
  Filter,
  FileText,
  UploadCloud,
  X,
  ArrowRight,
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
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);

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

  const hasCvParsed = Boolean(profile?.cvParsedAt);

  // Compute evaluations directly from CV-extracted profile data
  const evaluations: MatchEvaluation[] = useMemo(() => {
    if (!profile || !hasCvParsed) return [];

    // Jika pengguna sedang menguji coba berkas CV (baik berkas teman maupun berkas sendiri),
    // lakukan evaluasi kecocokan berdasarkan profil dari berkas CV aktif tersebut
    const activeCv = profile.activeScannedCv;
    const evaluationProfile: StudentProfileData = activeCv
      ? {
          ...profile,
          department:
            activeCv.department && activeCv.department !== "Tidak tertera di CV"
              ? activeCv.department
              : profile.department,
          faculty:
            activeCv.faculty && activeCv.faculty !== "Tidak tertera di CV"
              ? activeCv.faculty
              : profile.faculty,
          gpa: activeCv.gpa != null ? activeCv.gpa : profile.gpa,
          semester: activeCv.semester != null ? activeCv.semester : profile.semester,
          skills:
            activeCv.skills && activeCv.skills.length > 0
              ? activeCv.skills
              : profile.skills,
          softSkills:
            activeCv.softSkills && activeCv.softSkills.length > 0
              ? activeCv.softSkills
              : profile.softSkills,
        }
      : profile;

    return opportunities
      .map((opp) => calculateMatch(opp, evaluationProfile))
      .sort((a, b) => b.score - a.score);
  }, [opportunities, profile, hasCvParsed]);

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
    const avgScore =
      evaluations.length > 0
        ? Math.round(evaluations.reduce((acc, curr) => acc + curr.score, 0) / evaluations.length)
        : 0;

    return { eligibleCount, partialCount, avgScore };
  }, [evaluations]);

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
        <Header
          title="Rekomendasi Peluang Sesuai CV"
          userName={profile?.name || "Praditya Haekal Islami Al Haqiqi"}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          searchPlaceholder="Cari hasil pencocokan berdasarkan program atau skill..."
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-8 space-y-6">
          {/* Header Banner: Driven by CV Upload */}
          <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-200 border border-white/20 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Kalkulasi Berbasis Hasil Analisis CV AI
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
                  {hasCvParsed ? "Unggah CV Baru" : "Unggah & Scan CV"}
                </Button>
              </div>
            </div>

            {/* Active CV Reference Strip */}
            {hasCvParsed && (
              <div className="mt-5 p-3 rounded-xl bg-white/10 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <FileText className="w-4 h-4 text-yellow-300" />
                  <span className="text-slate-300">Pencocokan untuk Berkas:</span>
                  <span className="font-mono font-bold text-white">{profile?.cvFileName || "CV.pdf"}</span>
                  {profile?.activeScannedCv?.candidateName && (
                    <Badge className="bg-sky-500/20 text-sky-200 border-sky-400/30 text-[11px] font-semibold">
                      Kandidat: {profile.activeScannedCv.candidateName}
                    </Badge>
                  )}
                  {profile?.activeScannedCv?.isFriendCv && (
                    <Badge variant="outline" className="text-[10px] bg-purple-500/20 text-purple-200 border-purple-400/30">
                      Uji Coba Berkas Teman
                    </Badge>
                  )}
                </div>
                <span className="text-slate-300 text-[11px]">
                  Akun Utama: <strong>Praditya Haekal Islami Al Haqiqi</strong>
                </span>
              </div>
            )}
          </div>

          {!hasCvParsed ? (
            /* Empty State: Belum ada CV yang diunggah */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs mt-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                <Target className="w-8 h-8 stroke-[1.8]" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-lg md:text-xl font-bold text-slate-900">
                  Belum Ada Hasil Pencocokan CV
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                  Curriculum Vitae (CV) Anda belum diunggah atau dianalisis. Silakan unggah berkas CV Anda di menu **CV Upload** agar AI Engine dapat mengekstraksi keahlian, prestasi, dan mencocokkannya dengan seluruh peluang di kampus ITS.
                </p>
              </div>
              <Button
                onClick={() => router.push("/cv-upload")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-2.5 shadow-sm gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                Unggah & Scan CV Sekarang
              </Button>
            </div>
          ) : (
            /* Results State: CV sudah di-scan */
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-slate-200 shadow-xs">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Memenuhi Kualifikasi</p>
                      <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.eligibleCount} Program</p>
                      <span className="text-[11px] text-slate-500">Kecocokan &ge; 75%</span>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-xs">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Kecocokan Parsial</p>
                      <p className="text-2xl font-bold text-amber-600 mt-1">{stats.partialCount} Program</p>
                      <span className="text-[11px] text-slate-500">Perlu sedikit upgrade skill</span>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-xs">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Rata-Rata Kecocokan</p>
                      <p className="text-2xl font-bold text-blue-600 mt-1">{stats.avgScore}%</p>
                      <span className="text-[11px] text-slate-500">Terhadap peluang se-ITS</span>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <Target className="w-6 h-6" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Cari program hasil pencocokan atau keahlian..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <span className="text-slate-500 font-semibold mr-1 shrink-0 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Kategori:
                  </span>
                  {[
                    { id: "ALL", label: "Semua Kategori" },
                    { id: "COMMITTEE", label: "Kepanitiaan" },
                    { id: "ORGANIZATION", label: "Himpunan" },
                    { id: "RESEARCH", label: "Tim Riset" },
                    { id: "LAB", label: "Laboratorium" },
                    { id: "COMPETITION", label: "Kompetisi" },
                    { id: "SCHOLARSHIP", label: "Beasiswa" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
                        categoryFilter === cat.id
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Matched Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredEvaluations.map((item) => (
                  <Card key={item.opportunityId} className="hover:shadow-md transition-shadow border-slate-200 flex flex-col justify-between bg-white">
                    <div>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          {getCategoryBadge(item.opportunity.category)}
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              item.score >= 80
                                ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                                : item.score >= 60
                                ? "text-amber-700 bg-amber-50 border border-amber-200"
                                : "text-slate-600 bg-slate-100"
                            }`}
                          >
                            {item.score}% Match
                          </span>
                        </div>
                        <CardTitle className="text-base font-bold mt-2 text-slate-900 line-clamp-1">
                          {item.opportunity.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                          {item.opportunity.organization.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-0 text-xs">
                        <Progress value={item.score} className="h-1.5 bg-slate-100" />
                        <div className="space-y-1.5 text-slate-600">
                          <p className="text-[11px] font-semibold text-slate-800">Keahlian Terpenuhi ({item.matchedSkills.length}/{item.opportunity.requiredSkills.length}):</p>
                          <div className="flex flex-wrap gap-1">
                            {item.matchedSkills.map((sk) => (
                              <span key={sk} className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                &check; {sk}
                              </span>
                            ))}
                            {item.missingSkills.map((sk) => (
                              <span key={sk} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="pt-3 flex items-center justify-between border-t border-slate-100 gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/gap-analysis?oppId=${item.opportunityId}`)}
                          className="text-xs text-blue-700 hover:bg-blue-50"
                        >
                          Lihat Gap
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => setSelectedOpp(item.opportunity)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5"
                        >
                          Baca Selengkapnya
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      <MobileNav />

      {/* Detail Opportunity Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-[92vw] sm:w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-blue-600 font-semibold">{selectedOpp.organization.name}</p>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedOpp.title}</h3>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Area Deskripsi & Tombol Pendaftaran diselipkan */}
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-800 mb-1">Deskripsi Program:</p>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedOpp.description}</p>
              </div>

              {/* Tombol Pendaftaran diselipkan di dalam deskripsi */}
              <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-2">
                <div>
                  <p className="font-bold flex items-center gap-1.5 text-blue-900">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" /> Formulir Pendaftaran Resmi
                  </p>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Pendaftaran dan seleksi berkas dikelola langsung oleh pihak {selectedOpp.organization.name} via Google Form.
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
                <p className="text-xs font-bold text-slate-800 mb-1.5">Divisi / Formasi:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedOpp.divisions.map((d) => (
                    <span key={d} className="px-2.5 py-1 rounded-md text-[11px] bg-blue-50 text-blue-700 font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p><span className="font-semibold text-slate-900">Batas Waktu:</span> {selectedOpp.applicationEnd}</p>
              <p><span className="font-semibold text-slate-900">Persyaratan Nilai:</span> Min. IPK {selectedOpp.minGpa ? selectedOpp.minGpa.toFixed(2) : "Bebas"}</p>
              <p><span className="font-semibold text-slate-900">Semester Sasaran:</span> Semester {selectedOpp.minSemester || 1} hingga {selectedOpp.maxSemester || 8}</p>
              {selectedOpp.picContact && (
                <p><span className="font-semibold text-slate-900">Kontak Penyelenggara:</span> {selectedOpp.picContact.name} ({selectedOpp.picContact.contact})</p>
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800 mb-1.5">Keahlian yang Dibutuhkan:</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedOpp.requiredSkills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800 mb-1.5">Manfaat & Benefit:</p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                {selectedOpp.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-800 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Tautan Pendaftaran Resmi Google Form
              </p>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Pendaftaran dan seleksi berkas dikelola langsung oleh {selectedOpp.organization.name} via Google Form resmi berikut.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => setSelectedOpp(null)}
              >
                Tutup
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-[#013880] to-[#0D47A1] hover:from-[#012d66] hover:to-[#09357a] text-white text-xs gap-1.5 font-semibold"
                onClick={() => {
                  window.open(selectedOpp.googleFormUrl, "_blank");
                  setSelectedOpp(null);
                }}
              >
                Isi Google Form Pendaftaran
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MatchesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Memuat hasil pencocokan...</div>}>
      <MatchesContent />
    </Suspense>
  );
}
