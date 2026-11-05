"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Compass,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Users,
  Award,
  Sparkles,
  ArrowUpRight,
  Bookmark,
  Share2,
  GraduationCap,
  Building2,
  FileCheck2,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Layers,
  Send,
  FileText,
} from "lucide-react";
import {
  OpportunityItem,
  StudentProfileData,
  getStoredProfile,
  getStoredOpportunities,
  getStoredApplicants,
  submitStudentApplication,
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
  const [userApplications, setUserApplications] = useState<Record<string, boolean>>({});

  // Filters
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedEligibility, setSelectedEligibility] = useState<string>("ALL");
  const [selectedOrgType, setSelectedOrgType] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"match" | "deadline" | "quota">("match");

  // Detail Modal State
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);

  // Application Form Modal State
  const [applyingOpp, setApplyingOpp] = useState<OpportunityItem | null>(null);
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [motivationNote, setMotivationNote] = useState<string>("");
  const [applySuccessOpp, setApplySuccessOpp] = useState<OpportunityItem | null>(null);

  // Load data on mount & listen to storage updates
  useEffect(() => {
    const loadData = () => {
      const p = getStoredProfile();
      const opps = getStoredOpportunities();
      const applicants = getStoredApplicants();

      setProfile(p);
      setOpportunities(opps);

      // Check which opportunities this student has applied to
      const appliedMap: Record<string, boolean> = {};
      applicants.forEach((app) => {
        if (app.userNim === p.nim || app.userName === p.name) {
          appliedMap[app.opportunityId] = true;
        }
      });
      setUserApplications(appliedMap);
    };

    loadData();

    const handleProfileUpdate = () => loadData();
    const handleOppsUpdate = () => setOpportunities(getStoredOpportunities());
    const handleApplicantsUpdate = () => loadData();

    window.addEventListener("campusmatch:profile_updated", handleProfileUpdate);
    window.addEventListener("campusmatch:opportunities_updated", handleOppsUpdate);
    window.addEventListener("campusmatch:applicants_updated", handleApplicantsUpdate);

    return () => {
      window.removeEventListener("campusmatch:profile_updated", handleProfileUpdate);
      window.removeEventListener("campusmatch:opportunities_updated", handleOppsUpdate);
      window.removeEventListener("campusmatch:applicants_updated", handleApplicantsUpdate);
    };
  }, []);

  // Sync initial query from URL if changed
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  // Compute matches for all opportunities
  const evaluatedOpps = useMemo(() => {
    if (!profile) return [];
    return opportunities.map((opp) => {
      const evaluation = calculateMatch(opp, profile);
      const isApplied = !!userApplications[opp.id];
      return {
        ...opp,
        evaluation,
        isApplied,
      };
    });
  }, [opportunities, profile, userApplications]);

  // Filter & Search logic
  const filteredOpps = useMemo(() => {
    return evaluatedOpps.filter((item) => {
      // Category filter
      if (selectedCategory !== "ALL" && item.category !== selectedCategory) {
        return false;
      }
      // Org Type filter
      if (selectedOrgType !== "ALL" && item.organization.type !== selectedOrgType) {
        return false;
      }
      // Status filter
      if (selectedStatus !== "ALL" && item.status !== selectedStatus) {
        return false;
      }
      // Eligibility filter
      if (selectedEligibility !== "ALL" && item.evaluation.status !== selectedEligibility) {
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
      if (sortBy === "match") return b.evaluation.score - a.evaluation.score;
      if (sortBy === "deadline") return new Date(a.applicationEnd).getTime() - new Date(b.applicationEnd).getTime();
      if (sortBy === "quota") return (b.quota || 0) - (a.quota || 0);
      return 0;
    });
  }, [evaluatedOpps, selectedCategory, selectedOrgType, selectedStatus, selectedEligibility, searchQuery, sortBy]);

  const openApplyModal = (opp: OpportunityItem) => {
    setSelectedOpp(null);
    setApplyingOpp(opp);
    setSelectedDivision(opp.divisions?.[0] || "Umum");
    setMotivationNote("");
  };

  const handleConfirmApply = () => {
    if (!applyingOpp || !profile) return;
    submitStudentApplication(applyingOpp, profile, selectedDivision, motivationNote);

    setUserApplications((prev) => ({
      ...prev,
      [applyingOpp.id]: true,
    }));

    const currentOpp = applyingOpp;
    setApplyingOpp(null);
    setApplySuccessOpp(currentOpp);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "SCHOLARSHIP":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">Beasiswa</Badge>;
      case "ORGANIZATION":
        return <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white">Himpunan / BEM</Badge>;
      case "COMPETITION":
        return <Badge className="bg-amber-600 hover:bg-amber-700 text-white">Kompetisi</Badge>;
      case "RESEARCH":
        return <Badge className="bg-cyan-600 hover:bg-cyan-700 text-white">Tim Riset / Lab</Badge>;
      case "UKM":
        return <Badge className="bg-purple-600 hover:bg-purple-700 text-white">UKM Riset</Badge>;
      case "COMMITTEE":
        return <Badge className="bg-rose-600 hover:bg-rose-700 text-white">Event Akbar</Badge>;
      default:
        return <Badge variant="secondary">{cat}</Badge>;
    }
  };

  const getMatchScoreBadge = (evalData: MatchEvaluation) => {
    if (evalData.score >= 85) {
      return (
        <span className="text-xs font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" /> {evalData.score}% Match
        </span>
      );
    }
    if (evalData.score >= 70) {
      return (
        <span className="text-xs font-bold text-amber-700 bg-amber-100/90 px-2.5 py-1 rounded-full border border-amber-300 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-600" /> {evalData.score}% Match
        </span>
      );
    }
    return (
      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-300 flex items-center gap-1">
        {evalData.score}% Match
      </span>
    );
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
          title="Katalog Peluang Kampus ITS"
          userName={profile?.name || "Praditya Haekal Islami Al Haqiqi"}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          searchPlaceholder="Cari GERIGI, HIMATEKTRO, Bayucaraka, Anargya, Lab Elektro, Beasiswa..."
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Top Title Banner */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <Compass className="w-5 h-5" />
                </span>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                  Pusat Peluang & Open Recruitment se-ITS 2026/2027
                </h1>
              </div>
              <p className="text-xs md:text-sm text-slate-600 max-w-2xl">
                Temukan seluruh open recruitment kepanitiaan akbar (GERIGI ITS), tim riset nasional/dunia (Bayucaraka, Anargya, Sapuangin, Barunastra), himpunan mahasiswa (HIMATEKTRO), laboratorium departemen, hingga beasiswa resmi.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/matches")}
                className="text-xs gap-1.5 text-blue-700 border-blue-200 hover:bg-blue-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Hasil CV Matches ({evaluatedOpps.filter((o) => o.evaluation.score >= 80).length} Lolos)
              </Button>
              <Button
                size="sm"
                onClick={() => router.push("/admin/opportunities")}
                className="text-xs gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold"
              >
                Buka Recruitment (Admin)
              </Button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Bar Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik kata kunci: 'GERIGI', 'HIMATEKTRO', 'Anargya', 'Bayucaraka', 'Lab Embedded', 'Beasiswa KSE'..."
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

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-500 font-medium">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs border border-slate-200 bg-slate-50 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="match">Kecocokan Tertinggi (% Match)</option>
                  <option value="deadline">Batas Waktu Terdekat</option>
                  <option value="quota">Kuota Terbesar</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mr-1 shrink-0">
                Tipe Program:
              </span>
              {[
                { label: "Semua Program", value: "ALL" },
                { label: "Event Akbar / Panitia", value: "COMMITTEE" },
                { label: "Tim Riset Kampus", value: "RESEARCH" },
                { label: "Himpunan (HIMA)", value: "ORGANIZATION" },
                { label: "UKM Riset", value: "UKM" },
                { label: "Beasiswa Kampus", value: "SCHOLARSHIP" },
                { label: "Kompetisi", value: "COMPETITION" },
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.value
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Secondary Filter: Eligibility */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600 flex-wrap">
              <span className="font-semibold text-slate-500">Filter Kelayakan Syarat Kaku:</span>
              <button
                onClick={() => setSelectedEligibility("ALL")}
                className={`px-2.5 py-1 rounded border text-xs ${
                  selectedEligibility === "ALL"
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                Semua ({evaluatedOpps.length})
              </button>
              <button
                onClick={() => setSelectedEligibility("ELIGIBLE")}
                className={`px-2.5 py-1 rounded border text-xs flex items-center gap-1 ${
                  selectedEligibility === "ELIGIBLE"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-bold"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Lolos Syarat Kaku ({evaluatedOpps.filter((o) => o.evaluation.status === "ELIGIBLE").length})
              </button>
              <button
                onClick={() => setSelectedEligibility("PARTIAL")}
                className={`px-2.5 py-1 rounded border text-xs flex items-center gap-1 ${
                  selectedEligibility === "PARTIAL"
                    ? "border-amber-600 bg-amber-50 text-amber-700 font-bold"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <AlertCircle className="w-3 h-3 text-amber-600" />
                Parsial / Butuh Berkas ({evaluatedOpps.filter((o) => o.evaluation.status === "PARTIAL").length})
              </button>
            </div>
          </div>

          {/* Results Summary & List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Menampilkan <strong>{filteredOpps.length}</strong> peluang terbuka di lingkungan Institut Teknologi Sepuluh Nopember
              </span>
              {searchQuery && (
                <span className="text-blue-600 font-medium">
                  Hasil pencarian: &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </div>

            {filteredOpps.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3">
                <Compass className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Tidak ada program yang sesuai kriteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Silakan sesuaikan kata kunci pencarian atau reset filter untuk melihat seluruh katalog.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("ALL");
                    setSelectedEligibility("ALL");
                  }}
                >
                  Reset Semua Filter
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredOpps.map((opp) => {
                  const evalData = opp.evaluation;
                  return (
                    <Card
                      key={opp.id}
                      className="hover:shadow-lg transition-all duration-200 border-slate-200 flex flex-col justify-between group"
                    >
                      <div>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            {getCategoryBadge(opp.category)}
                            {getMatchScoreBadge(evalData)}
                          </div>
                          <div className="mt-2.5">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              {opp.organization.name}
                            </span>
                            <CardTitle className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors mt-0.5 line-clamp-2">
                              {opp.title}
                            </CardTitle>
                          </div>
                          <CardDescription className="text-xs text-slate-600 line-clamp-2 mt-1">
                            {opp.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3 pt-0">
                          {/* Divisions Preview if any */}
                          {opp.divisions && opp.divisions.length > 0 && (
                            <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-xs space-y-1">
                              <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
                                <Layers className="w-3 h-3 text-blue-600" />
                                {opp.divisions.length} Divisi Dibuka:
                              </span>
                              <p className="text-[11px] text-blue-800 line-clamp-1">
                                {opp.divisions.slice(0, 3).join(", ")}
                                {opp.divisions.length > 3 && ` +${opp.divisions.length - 3} lainnya`}
                              </p>
                            </div>
                          )}

                          {/* Criteria Match Indicators */}
                          <div className="bg-slate-50 rounded-lg p-2.5 space-y-1.5 border border-slate-100 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 flex items-center gap-1.5">
                                {evalData.gpaPassed ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                                )}
                                Min. IPK: {opp.minGpa ? opp.minGpa.toFixed(2) : "Bebas"}
                              </span>
                              <span className="font-semibold text-slate-700">
                                (Anda: {profile?.gpa.toFixed(2)})
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-slate-600 flex items-center gap-1.5">
                                {evalData.semesterPassed ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                                )}
                                Semester: {opp.minSemester || 1} - {opp.maxSemester || 8}
                              </span>
                              <span className="font-semibold text-slate-700">
                                (Anda: Sem. {profile?.semester})
                              </span>
                            </div>

                            {opp.requiredSkills.length > 0 && (
                              <div className="pt-1 border-t border-slate-200/60 flex items-center gap-1 flex-wrap">
                                <span className="text-[10px] text-slate-400">Skill Diutamakan:</span>
                                {opp.requiredSkills.slice(0, 3).map((sk) => {
                                  const isMatched = evalData.matchedSkills.includes(sk);
                                  return (
                                    <span
                                      key={sk}
                                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                        isMatched
                                          ? "bg-emerald-100 text-emerald-800 font-semibold"
                                          : "bg-slate-200 text-slate-700"
                                      }`}
                                    >
                                      {sk} {isMatched && "✓"}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Progress bar match */}
                          <div>
                            <div className="flex justify-between items-center text-[11px] mb-1">
                              <span className="text-slate-500 font-medium">Tingkat Kecocokan AI</span>
                              <span className="font-bold text-slate-800">{evalData.score}%</span>
                            </div>
                            <Progress
                              value={evalData.score}
                              className={`h-1.5 ${
                                evalData.score >= 85
                                  ? "bg-emerald-100"
                                  : evalData.score >= 70
                                  ? "bg-amber-100"
                                  : "bg-slate-100"
                              }`}
                            />
                          </div>

                          {/* Meta stats: Deadline & Quota */}
                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              Deadline: {opp.applicationEnd}
                            </span>
                            {opp.quota && (
                              <span className="flex items-center gap-1 font-medium text-slate-700">
                                <Users className="w-3 h-3 text-slate-400" />
                                Kuota: {opp.quota} orang
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                        {opp.isApplied ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold text-xs">
                            ✓ Terdaftar
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => openApplyModal(opp)}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1"
                          >
                            Daftar Sekarang <ArrowUpRight className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/gap-analysis?oppId=${opp.id}`)}
                            className="text-xs text-slate-600 hover:text-blue-700 hover:border-blue-300"
                            title="Analisis Gap"
                          >
                            Gap
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedOpp(opp)}
                            className="text-xs text-slate-700 hover:text-blue-700 gap-0.5"
                          >
                            Detail <ChevronRight className="w-3.5 h-3.5" />
                          </Button>
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

      {/* Detail Dialog Modal */}
      {selectedOpp && (
        <Dialog open={!!selectedOpp} onOpenChange={(open) => !open && setSelectedOpp(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                {getCategoryBadge(selectedOpp.category)}
                <span className="text-xs text-slate-500">Penyelenggara:</span>
                <span className="text-xs font-bold text-slate-700">
                  {selectedOpp.organization.name}
                </span>
              </div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                {selectedOpp.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600">
                Periode Pendaftaran: {selectedOpp.applicationStart} s/d {selectedOpp.applicationEnd}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-3 text-sm">
              {/* AI Evaluation Box */}
              {profile && (
                <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      Evaluasi Kecocokan AI (CampusMatch Engine)
                    </span>
                    <span className="text-sm font-extrabold text-blue-700">
                      {calculateMatch(selectedOpp, profile).score}% Match
                    </span>
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    {calculateMatch(selectedOpp, profile).recommendation}
                  </p>
                </div>
              )}

              {/* Divisions Available */}
              {selectedOpp.divisions && selectedOpp.divisions.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" /> Divisi & Posisi yang Dibuka:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedOpp.divisions.map((div, i) => (
                      <div key={i} className="p-2 rounded bg-white border border-slate-200 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                        <span className="font-medium text-slate-700">{div}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-500 mb-1 tracking-wider">
                  Deskripsi Program & Lingkup Tugas
                </h4>
                <p className="text-slate-700 text-xs md:text-sm leading-relaxed">
                  {selectedOpp.description}
                </p>
              </div>

              {/* Requirements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-slate-600" /> Syarat Akademik Kaku
                  </h4>
                  <ul className="text-xs space-y-1 text-slate-600">
                    <li>• Minimal IPK: <strong>{selectedOpp.minGpa ? selectedOpp.minGpa.toFixed(2) : "Bebas"}</strong></li>
                    <li>• Semester: <strong>{selectedOpp.minSemester || 1} - {selectedOpp.maxSemester || 8}</strong></li>
                    <li>• Fakultas: <strong>{selectedOpp.allowedFaculties?.join(", ") || "Terbuka Seluruh ITS"}</strong></li>
                    <li>• Departemen: <strong>{selectedOpp.allowedMajors?.join(", ") || "Terbuka Semua Departemen"}</strong></li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-slate-600" /> Dokumen Wajib
                  </h4>
                  <ul className="text-xs space-y-1 text-slate-600">
                    {selectedOpp.requiredDocs.map((doc) => (
                      <li key={doc} className="flex items-center gap-1">
                        • {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Benefits */}
              {selectedOpp.benefits.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2 tracking-wider">
                    Benefit & Fasilitas Penerima
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedOpp.benefits.map((b, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex sm:justify-between items-center gap-2 pt-3 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/gap-analysis?oppId=${selectedOpp.id}`)}
                className="text-xs text-blue-700 border-blue-200 hover:bg-blue-50"
              >
                Lihat Analisis Gap
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOpp(null)}
                  className="text-xs"
                >
                  Tutup
                </Button>
                {userApplications[selectedOpp.id] ? (
                  <Button size="sm" disabled className="bg-emerald-600 text-white text-xs">
                    Sudah Terdaftar
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => openApplyModal(selectedOpp)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1 font-semibold"
                  >
                    Daftar Sekarang <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Application Submission Form Modal (Google Form Style with Divisions) */}
      {applyingOpp && (
        <Dialog open={!!applyingOpp} onOpenChange={(open) => !open && setApplyingOpp(null)}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                {getCategoryBadge(applyingOpp.category)}
                <span className="text-xs font-semibold text-slate-500">
                  {applyingOpp.organization.name}
                </span>
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Formulir Pendaftaran: {applyingOpp.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600">
                Data akademik Anda otomatis ditarik dari profil myITS. Silakan tentukan divisi pilihan Anda.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              {/* Student Summary Info */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <p className="font-bold text-slate-800">Identitas Pendaftar (myITS SSO):</p>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <p>Nama: <strong>{profile?.name}</strong></p>
                  <p>NIM: <strong>{profile?.nim}</strong></p>
                  <p>Departemen: <strong>{profile?.major}</strong></p>
                  <p>IPK / Sem: <strong>{profile?.gpa.toFixed(2)} (Sem. {profile?.semester})</strong></p>
                </div>
              </div>

              {/* Division Selection */}
              {applyingOpp.divisions && applyingOpp.divisions.length > 0 ? (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">
                    Pilih Divisi / Bidang yang Anda Minati: *
                  </label>
                  <select
                    value={selectedDivision}
                    onChange={(e) => setSelectedDivision(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {applyingOpp.divisions.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400">
                    Admin panitia akan menerima data Anda langsung pada spreadsheet divisi yang Anda pilih.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Posisi Pendaftaran:</label>
                  <Input value="Umum / Reguler" disabled className="text-xs bg-slate-100" />
                </div>
              )}

              {/* Motivation Note */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">
                  Alasan Memilih Divisi & Rencana Kontribusi:
                </label>
                <Textarea
                  value={motivationNote}
                  onChange={(e) => setMotivationNote(e.target.value)}
                  placeholder="Ceritakan pengalaman relevan dan motivasi Anda mendaftar pada divisi ini..."
                  rows={3}
                  className="text-xs bg-white"
                />
              </div>

              {/* Attached Documents Info */}
              <div className="p-3 rounded-lg border border-slate-200 bg-blue-50/50 space-y-1">
                <p className="font-bold text-blue-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" /> Berkas CV Terlampir Otomatis:
                </p>
                <p className="text-[11px] text-blue-800 font-mono">
                  {profile?.cvFileName || "CV_M_Haekal_Teknik_Elektro_ITS.pdf"}
                </p>
                <p className="text-[10px] text-slate-500">
                  Untuk memperbarui berkas CV, Anda dapat menggunakan menu <strong>CV Upload</strong> di bilah navigasi.
                </p>
              </div>
            </div>

            <DialogFooter className="flex sm:justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setApplyingOpp(null)}
                className="text-xs"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmApply}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow"
              >
                <Send className="w-3.5 h-3.5" /> Kirim Pendaftaran
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Success Dialog */}
      {applySuccessOpp && (
        <Dialog open={!!applySuccessOpp} onOpenChange={() => setApplySuccessOpp(null)}>
          <DialogContent className="max-w-md text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Pendaftaran Berhasil Dikirim!
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600 mt-1">
                Aplikasi Anda untuk <strong>{applySuccessOpp.title}</strong> telah tersimpan di sistem CampusMatch.
              </DialogDescription>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-left space-y-1">
              <p className="font-semibold text-slate-700">Rincian Pengajuan:</p>
              <p className="text-slate-600">Pelamar: <strong>{profile?.name} ({profile?.nim})</strong></p>
              <p className="text-slate-600">Divisi Pilihan: <strong>{selectedDivision}</strong></p>
              <p className="text-slate-600">Status Seleksi Otomatis: <strong className="text-emerald-700">Tercatat di Spreadsheet Panitia</strong></p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={() => {
                  setApplySuccessOpp(null);
                  router.push("/admin/applicants");
                }}
              >
                Buka Spreadsheet Panitia
              </Button>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs"
                onClick={() => setApplySuccessOpp(null)}
              >
                Lanjut Eksplorasi
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Memuat Katalog Peluang...</div>}>
      <OpportunitiesContent />
    </Suspense>
  );
}
