"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Compass,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Users,
  Sparkles,
  ExternalLink,
  GraduationCap,
  Building2,
  SlidersHorizontal,
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

function OpportunitiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search") || "";

  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"match" | "deadline" | "quota">("deadline");

  // Detail Modal State
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);

  // Load data on mount & listen to storage updates
  useEffect(() => {
    const loadData = () => {
      const p = getStoredProfile();
      const opps = getStoredOpportunities();
      setProfile(p);
      setOpportunities(opps);
    };

    loadData();

    const handleProfileUpdate = () => setProfile(getStoredProfile());
    const handleOppsUpdate = () => setOpportunities(getStoredOpportunities());

    window.addEventListener("campusmatch:profile_updated", handleProfileUpdate);
    window.addEventListener("campusmatch:opportunities_updated", handleOppsUpdate);

    return () => {
      window.removeEventListener("campusmatch:profile_updated", handleProfileUpdate);
      window.removeEventListener("campusmatch:opportunities_updated", handleOppsUpdate);
    };
  }, []);

  // Filter & Search logic
  const filteredOpps = useMemo(() => {
    return opportunities.filter((item) => {
      // Category filter
      if (selectedCategory !== "ALL" && item.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(query);
        const inDesc = item.description.toLowerCase().includes(query);
        const inOrg = item.organization.name.toLowerCase().includes(query);
        const inDivisions = item.divisions?.some((d) => d.toLowerCase().includes(query)) || false;
        const inTags = item.tags.some((t) => t.toLowerCase().includes(query));
        const inSkills = item.requiredSkills.some((s) => s.toLowerCase().includes(query));
        return inTitle || inDesc || inOrg || inDivisions || inTags || inSkills;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "deadline") return new Date(a.applicationEnd).getTime() - new Date(b.applicationEnd).getTime();
      if (sortBy === "quota") return (b.quota || 0) - (a.quota || 0);
      return 0;
    });
  }, [opportunities, selectedCategory, searchQuery, sortBy]);

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "COMMITTEE":
        return <Badge className="bg-rose-600 hover:bg-rose-700 text-white font-medium">Kepanitiaan</Badge>;
      case "ORGANIZATION":
        return <Badge className="bg-[#013880] hover:bg-[#012d66] text-white font-medium">Himpunan</Badge>;
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
          title="Katalog Peluang Kampus ITS"
          userName={profile?.name || "Praditya Haekal Islami Al Haqiqi"}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          searchPlaceholder="Cari kepanitiaan, tim riset, himpunan, laboratorium, kompetisi, beasiswa..."
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-8 space-y-6">
          {/* Top Title Banner - Deskripsi General Tanpa Sebut Merek Event */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <Compass className="w-5 h-5" />
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                Pusat Peluang & Open Recruitment se-ITS 2026/2027
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-600 max-w-3xl leading-relaxed mt-1">
              Temukan berbagai informasi pembukaan pendaftaran kepanitiaan, tim riset, himpunan mahasiswa, laboratorium, kompetisi, hingga beasiswa resmi di lingkungan Institut Teknologi Sepuluh Nopember.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Bar Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik kata kunci: 'kepanitiaan', 'himpunan', 'laboratorium', 'robotika', 'beasiswa', 'python'..."
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

              {/* Sort By Filter */}
              <div className="flex items-center gap-2 shrink-0">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-hidden"
                >
                  <option value="deadline">Urutkan: Batas Waktu Terdekat</option>
                  <option value="quota">Urutkan: Kuota Terbanyak</option>
                </select>
              </div>
            </div>

            {/* Filter Kategori: Kepanitiaan, Himpunan, Tim Riset, Laboratorium, Kompetisi, Beasiswa */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
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
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
                    selectedCategory === cat.id
                      ? "bg-[#013880] text-white shadow-xs font-semibold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hasil Daftar Peluang */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-slate-600">
                Menampilkan <span className="font-bold text-slate-900">{filteredOpps.length}</span> peluang terbuka
              </p>
            </div>

            {filteredOpps.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <Compass className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">Tidak ada peluang yang sesuai</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Coba ubah kata kunci pencarian atau reset filter kategori untuk melihat program lainnya.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("ALL");
                  }}
                  className="text-xs"
                >
                  Reset Semua Filter
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredOpps.map((opp) => (
                  <Card key={opp.id} className="hover:shadow-md transition-shadow border-slate-200 flex flex-col justify-between bg-white">
                    <div>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          {getCategoryBadge(opp.category)}
                          <span className="text-[11px] text-slate-400 font-medium">
                            Batas: {opp.applicationEnd}
                          </span>
                        </div>
                        <CardTitle className="text-base font-bold mt-2.5 text-slate-900 line-clamp-1">
                          {opp.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                          {opp.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2.5 pt-0 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{opp.organization.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Semester {opp.minSemester || 1}–{opp.maxSemester || 8} &bull; Min. IPK {opp.minGpa ? opp.minGpa.toFixed(2) : "Bebas"}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {opp.requiredSkills.slice(0, 3).map((sk) => (
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
                          onClick={() => setSelectedOpp(opp)}
                          className="w-full bg-gradient-to-r from-[#013880] to-[#0D47A1] hover:from-[#012d66] hover:to-[#09357a] text-white text-xs font-semibold gap-1.5 justify-center shadow-xs"
                        >
                          Baca Selengkapnya
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav />

      {/* Modal Detail Peluang */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-xl w-[92vw] sm:w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                {getCategoryBadge(selectedOpp.category)}
                <h3 className="text-lg font-bold text-slate-900 mt-2">{selectedOpp.title}</h3>
                <p className="text-xs text-slate-500">{selectedOpp.organization.name}</p>
              </div>
              <button
                onClick={() => setSelectedOpp(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
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
                    <CheckCircle2 className="w-4 h-4 text-[#013880]" /> Formulir Pendaftaran Resmi
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
                  className="w-full bg-gradient-to-r from-[#013880] to-[#0D47A1] hover:from-[#012d66] hover:to-[#09357a] text-white text-xs font-semibold gap-1.5 shadow-xs"
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
                <CheckCircle2 className="w-3.5 h-3.5 text-[#013880]" /> Tautan Pendaftaran Resmi Google Form
              </p>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Pendaftaran dan seleksi berkas dikelola langsung oleh {selectedOpp.organization.name} via formulir Google Form resmi berikut.
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

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Memuat katalog peluang...</div>}>
      <OpportunitiesContent />
    </Suspense>
  );
}
