"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  FileCheck,
  Award,
  ChevronRight,
  ListTodo,
  Lightbulb,
} from "lucide-react";
import {
  OpportunityItem,
  StudentProfileData,
  getStoredProfile,
  getStoredOpportunities,
  calculateMatch,
  generateGapAnalysis,
  DetailedGapItem,
} from "@/lib/data-store";

function GapAnalysisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedOppId = searchParams.get("oppId");

  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [selectedOppId, setSelectedOppId] = useState<string>("");
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const p = getStoredProfile();
    const opps = getStoredOpportunities();
    setProfile(p);
    setOpportunities(opps);

    if (requestedOppId && opps.some((o) => o.id === requestedOppId)) {
      setSelectedOppId(requestedOppId);
    } else if (opps.length > 0) {
      setSelectedOppId(opps[0].id);
    }
  }, [requestedOppId]);

  const selectedOpp = useMemo(() => {
    return opportunities.find((o) => o.id === selectedOppId) || opportunities[0];
  }, [opportunities, selectedOppId]);

  const matchData = useMemo(() => {
    if (!selectedOpp || !profile) return null;
    return calculateMatch(selectedOpp, profile);
  }, [selectedOpp, profile]);

  const baseGaps = useMemo(() => {
    if (!selectedOpp || !profile) return [];
    return generateGapAnalysis(selectedOpp, profile);
  }, [selectedOpp, profile]);

  // Handle action checklist toggle
  const toggleAction = (gapId: string, stepIndex: number) => {
    const key = `${gapId}-${stepIndex}`;
    setCompletedActions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Calculate dynamic simulated score boost when student checks actions
  const checkedCount = Object.values(completedActions).filter(Boolean).length;
  const totalActions = baseGaps.reduce((acc, g) => acc + g.actionSteps.length, 0);
  const boostedScore = matchData
    ? Math.min(100, matchData.score + checkedCount * 4)
    : 85;

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
          title="Analisis Kesenjangan Kualifikasi (Gap Analysis)"
          userName={profile?.name || "Praditya Haekal Islami Al Haqiqi"}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Top Selector Banner */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                  Personalized Roadmap & Gap Resolver
                </span>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                  Analisis Detail Kesenjangan Kualifikasi Anda
                </h1>
                <p className="text-xs md:text-sm text-slate-600 max-w-2xl mt-0.5">
                  Identifikasi faktor penghambat (GPA, keahlian, berkas) dan dapatkan rencana aksi terarah untuk mencapai 100% kelayakan.
                </p>
              </div>

              {/* Opportunity Selector Dropdown */}
              <div className="md:w-80 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Pilih Target Program:</label>
                <select
                  value={selectedOppId}
                  onChange={(e) => {
                    setSelectedOppId(e.target.value);
                    setCompletedActions({});
                  }}
                  className="w-full text-xs md:text-sm p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                >
                  {opportunities.map((opp) => (
                    <option key={opp.id} value={opp.id}>
                      [{opp.category}] {opp.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Score & Gap Stats Cards */}
            {selectedOpp && matchData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">Skor Awal</p>
                  <p className="text-2xl font-black text-slate-800 mt-1">{matchData.score}%</p>
                  <span className="text-[11px] text-slate-500">Berdasarkan profil saat ini</span>
                </div>
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                  <p className="text-xs text-blue-700 font-medium">Proyeksi Pasca Aksi</p>
                  <p className="text-2xl font-black text-blue-700 mt-1">{boostedScore}%</p>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    +{boostedScore - matchData.score}% Peningkatan
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-800 font-medium">Total Kesenjangan</p>
                  <p className="text-2xl font-black text-amber-700 mt-1">{baseGaps.length} Hal</p>
                  <span className="text-[11px] text-amber-700">
                    {baseGaps.filter((g) => g.priority === "HIGH").length} Prioritas Tinggi
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="text-xs text-emerald-800 font-medium">Aksi Selesai</p>
                  <p className="text-2xl font-black text-emerald-700 mt-1">
                    {checkedCount} / {totalActions}
                  </p>
                  <span className="text-[11px] text-emerald-700">Rencana aksi tercentang</span>
                </div>
              </div>
            )}
          </div>

          {/* AI Advisor Insight */}
          {selectedOpp && matchData && (
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-5 text-white shadow-md flex items-start gap-4">
              <div className="p-2.5 bg-white/10 rounded-xl shrink-0 mt-0.5">
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold tracking-wide text-yellow-300 uppercase">
                  Rekomendasi Cerdas AI untuk {profile?.name}
                </h3>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                  Untuk program <strong>{selectedOpp.title}</strong>, Anda telah memenuhi kriteria dasar akademik (IPK Anda {profile?.gpa.toFixed(2)} memenuhi syarat).
                  {baseGaps.length > 0 ? (
                    <span>
                      {" "}Namun, terdapat <strong>{baseGaps.length} aspek kesenjangan</strong> yang perlu dilengkapi, terutama pada berkas dokumen dan penguasaan keahlian spesifik. Ikuti checklist di bawah untuk memaksimalkan peluang lolos seleksi hingga tahap akhir.
                    </span>
                  ) : (
                    <span>
                      {" "}Selamat! Anda telah memenuhi seluruh kualifikasi program ini tanpa kesenjangan yang terdeteksi. Segera kirimkan berkas Anda sebelum batas akhir ({selectedOpp.applicationEnd}).
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Detailed Gaps Matrix */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-600" />
                Daftar Kesenjangan & Rencana Aksi (Action Roadmap)
              </h2>
              <span className="text-xs text-slate-500">
                Centang setiap poin untuk mensimulasikan kenaikan skor
              </span>
            </div>

            {baseGaps.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-slate-200 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">Tidak ada kesenjangan terdeteksi!</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Profil akademik, keahlian, dan dokumen Anda sudah sangat cocok dengan persyaratan program ini.
                </p>
                <Button
                  size="sm"
                  onClick={() => router.push("/opportunities")}
                  className="bg-blue-600 text-white text-xs mt-2"
                >
                  Ajukan Pendaftaran Sekarang
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {baseGaps.map((gap, gIdx) => {
                  return (
                    <Card key={gap.id} className="border-slate-200 shadow-sm overflow-hidden">
                      <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {gap.category === "ACADEMIC" && (
                              <Badge className="bg-blue-600 text-white text-[10px]">Akademik</Badge>
                            )}
                            {gap.category === "SKILL" && (
                              <Badge className="bg-indigo-600 text-white text-[10px]">Keahlian</Badge>
                            )}
                            {gap.category === "DOCUMENT" && (
                              <Badge className="bg-amber-600 text-white text-[10px]">Dokumen</Badge>
                            )}
                            {gap.category === "EXPERIENCE" && (
                              <Badge className="bg-purple-600 text-white text-[10px]">Pengalaman</Badge>
                            )}

                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                gap.priority === "HIGH"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              Prioritas: {gap.priority === "HIGH" ? "Tinggi (Bloker)" : "Sedang"}
                            </span>
                          </div>

                          <span className="text-[11px] text-slate-500 font-medium">
                            Dampak: {gap.impact}
                          </span>
                        </div>

                        <CardTitle className="text-base font-bold text-slate-900 mt-2">
                          {gap.title}
                        </CardTitle>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1 text-slate-600">
                          <div className="p-2 rounded bg-white border border-slate-200/60">
                            <span className="font-semibold text-slate-500">Kondisi Anda Saat Ini:</span>
                            <p className="font-bold text-slate-800 mt-0.5">{gap.currentStatus}</p>
                          </div>
                          <div className="p-2 rounded bg-white border border-slate-200/60">
                            <span className="font-semibold text-slate-500">Target Persyaratan:</span>
                            <p className="font-bold text-blue-700 mt-0.5">{gap.targetRequirement}</p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <ListTodo className="w-4 h-4 text-blue-600" />
                          Rencana Tindakan Penyelesaian (Action Steps):
                        </div>

                        <div className="space-y-2">
                          {gap.actionSteps.map((step, sIdx) => {
                            const isDone = !!completedActions[`${gap.id}-${sIdx}`];
                            return (
                              <div
                                key={sIdx}
                                onClick={() => toggleAction(gap.id, sIdx)}
                                className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                  isDone
                                    ? "bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium"
                                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                                }`}
                              >
                                <Checkbox
                                  checked={isDone}
                                  onCheckedChange={() => toggleAction(gap.id, sIdx)}
                                  className="mt-0.5 shrink-0"
                                />
                                <div className="flex-1">
                                  <span className={isDone ? "line-through text-emerald-800" : ""}>
                                    {step}
                                  </span>
                                  {isDone && (
                                    <span className="block text-[10px] text-emerald-600 font-bold mt-0.5">
                                      ✓ Terlaksana (+4% kesiapan)
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Quick Navigation */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-600">
              Ingin memperbarui data akademik atau keahlian Anda?
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/profile")}
                className="text-xs"
              >
                Buka My Profile
              </Button>
              <Button
                size="sm"
                onClick={() => router.push("/opportunities")}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
              >
                Lihat Semua Peluang
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function GapAnalysisPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Memuat Analisis Kesenjangan...</div>}>
      <GapAnalysisContent />
    </Suspense>
  );
}

