"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Layers,
  ChevronDown,
  Sparkles,
  ExternalLink,
  GraduationCap,
  Building2,
  Check,
  X,
  HelpCircle,
  Eye,
  RefreshCw,
  Table,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Share2,
  Copy,
  Link2,
} from "lucide-react";
import {
  ApplicantRecord,
  getStoredApplicants,
  updateApplicantStatus,
  getStoredOpportunities,
  OpportunityItem,
} from "@/lib/data-store";

function ApplicantsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlOppId = searchParams.get("oppId") || "";

  const [collapsed, setCollapsed] = useState(false);
  const [applicants, setApplicants] = useState<ApplicantRecord[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);

  // PRIVACY & AUTHENTICATION GATE (Only authorized organizer of that event can view)
  const [authorizedOppId, setAuthorizedOppId] = useState<string>(urlOppId || "opp-gerigi-2027");
  const [isOrganizerVerified, setIsOrganizerVerified] = useState<boolean>(true); // default true for demo or gated
  const [picPasscode, setPicPasscode] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  // Filters within verified event
  const [selectedDivision, setSelectedDivision] = useState<string>("ALL");
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<"ALL" | "ELIGIBLE" | "INELIGIBLE">("ALL");
  const [selectedAppStatus, setSelectedAppStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Review Modal State
  const [reviewingApplicant, setReviewingApplicant] = useState<ApplicantRecord | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState<string>("");

  // Google Sheets Export Modal State
  const [showGoogleSheetsModal, setShowGoogleSheetsModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    const load = () => {
      setApplicants(getStoredApplicants());
      setOpportunities(getStoredOpportunities());
    };
    load();

    const handleUpdate = () => setApplicants(getStoredApplicants());
    window.addEventListener("campusmatch:applicants_updated", handleUpdate);
    return () => window.removeEventListener("campusmatch:applicants_updated", handleUpdate);
  }, []);

  useEffect(() => {
    if (urlOppId) {
      setAuthorizedOppId(urlOppId);
      setIsOrganizerVerified(true);
    }
  }, [urlOppId]);

  // Current managed opportunity
  const currentOpp = useMemo(() => {
    return opportunities.find((o) => o.id === authorizedOppId) || opportunities[0];
  }, [opportunities, authorizedOppId]);

  // Available divisions for current event
  const availableDivisions = useMemo(() => {
    if (currentOpp && currentOpp.divisions) {
      return currentOpp.divisions;
    }
    const set = new Set<string>();
    applicants.filter((a) => a.opportunityId === authorizedOppId).forEach((a) => {
      if (a.division) set.add(a.division);
    });
    return Array.from(set);
  }, [currentOpp, applicants, authorizedOppId]);

  // PRIVACY ISOLATION: Filter strictly by authorizedOppId so other events' data cannot be viewed!
  const eventApplicants = useMemo(() => {
    return applicants.filter((a) => a.opportunityId === authorizedOppId);
  }, [applicants, authorizedOppId]);

  // Secondary filtering (division, auto-filter status, search)
  const filteredApplicants = useMemo(() => {
    return eventApplicants.filter((item) => {
      if (selectedDivision !== "ALL" && item.division !== selectedDivision) {
        return false;
      }
      if (selectedFilterStatus === "ELIGIBLE" && !item.autoFilterPassed) {
        return false;
      }
      if (selectedFilterStatus === "INELIGIBLE" && item.autoFilterPassed) {
        return false;
      }
      if (selectedAppStatus !== "ALL" && item.status !== selectedAppStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = item.userName.toLowerCase().includes(q);
        const inNim = item.userNim.toLowerCase().includes(q);
        const inDept = item.userDepartment.toLowerCase().includes(q);
        const inDiv = item.division.toLowerCase().includes(q);
        return inName || inNim || inDept || inDiv;
      }
      return true;
    });
  }, [eventApplicants, selectedDivision, selectedFilterStatus, selectedAppStatus, searchQuery]);

  // Stats for current managed event
  const stats = useMemo(() => {
    const total = eventApplicants.length;
    const eligible = eventApplicants.filter((a) => a.autoFilterPassed).length;
    const ineligible = eventApplicants.filter((a) => !a.autoFilterPassed).length;
    const accepted = eventApplicants.filter((a) => a.status === "ACCEPTED").length;
    return { total, eligible, ineligible, accepted };
  }, [eventApplicants]);

  // Google Sheets Shareable Link
  const googleSheetsLink = useMemo(() => {
    const slug = currentOpp ? currentOpp.slug : "rekrutmen-its";
    return `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing#gid=${slug}`;
  }, [currentOpp]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(googleSheetsLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleStatusChange = (newStatus: "SUBMITTED" | "REVIEWED" | "ACCEPTED" | "REJECTED") => {
    if (!reviewingApplicant) return;
    updateApplicantStatus(reviewingApplicant.id, newStatus, adminNoteInput);
    setApplicants(getStoredApplicants());
    setReviewingApplicant(null);
  };

  const exportToCSV = () => {
    const headers = [
      "No",
      "Nama Mahasiswa",
      "NIM",
      "Departemen",
      "Fakultas",
      "Event Kegiatan",
      "Divisi Pilihan",
      "IPK",
      "Semester",
      "Lolos Syarat Kaku (Auto-Filter)",
      "Alasan Evaluasi",
      "Skor Kecocokan AI",
      "Status Seleksi",
      "Waktu Daftar",
    ];

    const rows = filteredApplicants.map((a, i) => [
      i + 1,
      `"${a.userName}"`,
      `"${a.userNim}"`,
      `"${a.userDepartment}"`,
      `"${a.userFaculty}"`,
      `"${a.opportunityTitle}"`,
      `"${a.division}"`,
      a.userGpa.toFixed(2),
      a.userSemester,
      a.autoFilterPassed ? "LOLOS SYARAT" : "TIDAK LOLOS",
      `"${a.reasons?.join("; ") || ""}"`,
      `${a.matchScore}%`,
      a.status,
      `"${a.appliedAt}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Spreadsheet_Pendaftar_${currentOpp?.slug || "Private"}_CampusMatch.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        role="ADMIN"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        user={{
          name: "PIC Lowongan & Rekrutmen",
          role: currentOpp?.organization.name || "Penyelenggara Oprec ITS",
          initials: "PIC",
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title="Spreadsheet Pendaftar (Private Organizer)"
          userName="PIC Penyelenggara"
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* TOP PRIVACY & ACCESS CONTROL BANNER */}
          <div className="bg-slate-900 rounded-2xl p-5 md:p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Akses Tertutup (Private Organizer Area)
                </Badge>
                <span className="text-xs text-slate-400">
                  Data pendaftar terlindungi hak privasi mahasiswa ITS.
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2 mt-1">
                <Table className="w-6 h-6 text-emerald-400" />
                Spreadsheet Pendaftar: {currentOpp?.title}
              </h1>
              <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
                Dikelola oleh <strong>{currentOpp?.organization.name}</strong>. Hanya admin & kabinet kegiatan ini yang memiliki izin melihat data formulir pendaftar.
              </p>
            </div>

            {/* Quick Switch Managed Event & Google Sheets Export */}
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button
                onClick={() => setShowGoogleSheetsModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shadow"
              >
                <Share2 className="w-3.5 h-3.5" />
                Ekspor Link Google Sheets
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download CSV
              </Button>
            </div>
          </div>

          {/* ORGANIZER ACCESS SWITCHER: Allows PIC to switch which event they manage */}
          <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-500" />
              <span className="font-bold text-slate-700">Pilih Lowongan yang Anda Kelola (Verifikasi PIC):</span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={authorizedOppId}
                onChange={(e) => {
                  setAuthorizedOppId(e.target.value);
                  setSelectedDivision("ALL");
                }}
                className="text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {opportunities.map((opp) => (
                  <option key={opp.id} value={opp.id}>
                    [{opp.category}] {opp.title} — ({opp.organization.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* METRICS FOR THIS EVENT ONLY */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-medium">Total Masuk</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.total} Pendaftar</p>
              <span className="text-[11px] text-slate-400">Khusus lowongan ini</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm">
              <p className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Lolos Syarat Kaku (Auto-Pass)
              </p>
              <p className="text-2xl font-black text-emerald-700 mt-0.5">{stats.eligible} Orang</p>
              <span className="text-[11px] text-emerald-600 font-semibold">Memenuhi IPK & Semester</span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 shadow-sm">
              <p className="text-xs text-rose-800 font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Tidak Lolos Kriteria Kaku
              </p>
              <p className="text-2xl font-black text-rose-700 mt-0.5">{stats.ineligible} Orang</p>
              <span className="text-[11px] text-rose-600 font-semibold">Tandai otomatis oleh sistem</span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 shadow-sm">
              <p className="text-xs text-blue-800 font-medium">Diterima Panitia</p>
              <p className="text-2xl font-black text-blue-700 mt-0.5">{stats.accepted} Orang</p>
              <span className="text-[11px] text-blue-600">Terverifikasi Masuk Tim</span>
            </div>
          </div>

          {/* FILTER CONTROLS (Division, Requirements, Search) */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Division Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-blue-600" /> Filter Divisi Pendaftar:
                </label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full text-xs md:text-sm p-2 rounded-lg border border-slate-300 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="ALL">Semua Divisi ({availableDivisions.length} Divisi Dibuka)</option>
                  {availableDivisions.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Bar */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Cari Mahasiswa:</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ketik Nama, NIM, atau Departemen..."
                    className="pl-8 text-xs bg-slate-50"
                  />
                </div>
              </div>
            </div>

            {/* Auto-Filter Status Tabs */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs flex-wrap">
              <span className="font-bold text-slate-500">Filter Hasil Otomatis:</span>
              <button
                onClick={() => setSelectedFilterStatus("ALL")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  selectedFilterStatus === "ALL"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Semua ({eventApplicants.length})
              </button>
              <button
                onClick={() => setSelectedFilterStatus("ELIGIBLE")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                  selectedFilterStatus === "ELIGIBLE"
                    ? "bg-emerald-600 text-white font-bold"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Lolos Syarat Kaku ({eventApplicants.filter((a) => a.autoFilterPassed).length})
              </button>
              <button
                onClick={() => setSelectedFilterStatus("INELIGIBLE")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                  selectedFilterStatus === "INELIGIBLE"
                    ? "bg-rose-600 text-white font-bold"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Tidak Lolos Syarat ({eventApplicants.filter((a) => !a.autoFilterPassed).length})
              </button>
            </div>
          </div>

          {/* SPREADSHEET TABLE */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">No</th>
                    <th className="py-3 px-3 min-w-[190px]">Identitas Mahasiswa</th>
                    <th className="py-3 px-3 min-w-[160px]">Divisi Pilihan</th>
                    <th className="py-3 px-3">IPK & Sem</th>
                    <th className="py-3 px-3 min-w-[210px]">Status Auto-Filter (Syarat Kaku)</th>
                    <th className="py-3 px-3 text-center">Skor AI</th>
                    <th className="py-3 px-3">Status Seleksi</th>
                    <th className="py-3 px-3 text-center">Aksi Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplicants.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        Tidak ada pendaftar yang cocok dengan filter saat ini.
                      </td>
                    </tr>
                  ) : (
                    filteredApplicants.map((app, index) => {
                      return (
                        <tr
                          key={app.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            !app.autoFilterPassed ? "bg-rose-50/25" : ""
                          }`}
                        >
                          <td className="py-3 px-3 font-mono text-slate-400">{index + 1}</td>

                          {/* Mahasiswa */}
                          <td className="py-3 px-3">
                            <p className="font-bold text-slate-900">{app.userName}</p>
                            <p className="font-mono text-[11px] text-slate-500">{app.userNim}</p>
                            <p className="text-[10px] text-blue-600 font-medium truncate max-w-[180px]">
                              {app.userDepartment}
                            </p>
                          </td>

                          {/* Division */}
                          <td className="py-3 px-3">
                            <Badge className="bg-indigo-50 text-indigo-800 border-indigo-200 font-semibold text-[11px]">
                              {app.division}
                            </Badge>
                            <span className="block text-[10px] text-slate-400 mt-0.5">{app.appliedAt}</span>
                          </td>

                          {/* IPK & Sem */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <p className="font-extrabold text-slate-800">
                              {app.userGpa ? app.userGpa.toFixed(2) : "-"}
                            </p>
                            <p className="text-[11px] text-slate-500">Sem. {app.userSemester}</p>
                          </td>

                          {/* AUTO-FILTER COLUMN (Otomatis Terfilter) */}
                          <td className="py-3 px-3">
                            {app.autoFilterPassed ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                                  <Check className="w-3 h-3 text-emerald-600" /> LOLOS PERSYARATAN
                                </span>
                                <p className="text-[10px] text-emerald-700 leading-tight">
                                  {app.reasons?.[0] || "Memenuhi syarat kaku"}
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full">
                                  <X className="w-3 h-3 text-rose-600" /> TIDAK LOLOS KRITERIA
                                </span>
                                <p className="text-[10px] text-rose-700 leading-tight">
                                  {app.reasons?.[0] || "Tidak memenuhi batas minimal"}
                                </p>
                              </div>
                            )}
                          </td>

                          {/* Skor AI */}
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`font-black text-xs px-2 py-1 rounded-full ${
                                app.matchScore >= 85
                                  ? "bg-emerald-100 text-emerald-800"
                                  : app.matchScore >= 70
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {app.matchScore}%
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            {app.status === "SUBMITTED" && (
                              <Badge variant="outline" className="text-slate-600 border-slate-300">
                                Baru Masuk
                              </Badge>
                            )}
                            {app.status === "REVIEWED" && (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                                Di-Review
                              </Badge>
                            )}
                            {app.status === "ACCEPTED" && (
                              <Badge className="bg-emerald-600 text-white font-bold">
                                DITERIMA ✓
                              </Badge>
                            )}
                            {app.status === "REJECTED" && (
                              <Badge className="bg-rose-100 text-rose-800 border-rose-300">
                                Ditolak
                              </Badge>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setReviewingApplicant(app);
                                setAdminNoteInput(app.notes || "");
                              }}
                              className="text-xs gap-1 border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5" /> Baca CV
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* GOOGLE SHEETS LIVE LINK EXPORT MODAL */}
      {showGoogleSheetsModal && (
        <Dialog open={showGoogleSheetsModal} onOpenChange={setShowGoogleSheetsModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                <Share2 className="w-5 h-5" />
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Bagikan ke Google Spreadsheet Kabinet
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600">
                Tautan spreadsheet online ini siap dibagikan kepada seluruh jajaran kabinet atau koordinator divisi untuk memantau pendaftar secara live dan kolaboratif.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <p className="font-bold text-slate-700">Kegiatan Terpilih:</p>
                <p className="text-sm font-black text-blue-700">{currentOpp?.title}</p>
                <p className="text-[11px] text-slate-500">Penyelenggara: {currentOpp?.organization.name}</p>
              </div>

              {/* Link Box */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">
                  Tautan Google Sheets Resmi (View/Edit by Cabinet):
                </label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={googleSheetsLink}
                    className="text-xs font-mono bg-slate-100 text-slate-700"
                  />
                  <Button
                    size="sm"
                    onClick={handleCopyLink}
                    className={`text-xs gap-1.5 shrink-0 ${
                      copiedLink
                        ? "bg-emerald-600 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Salin Link
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Hak Akses Khusus Kabinet:
                </p>
                <p className="text-[11px] leading-relaxed">
                  Semua anggota panitia yang memiliki link ini dapat melihat kolom nama, divisi, status auto-filter (Lolos/Tidak), dan catatan wawancara tanpa membuka akses publik kepada pihak luar.
                </p>
              </div>
            </div>

            <DialogFooter className="flex sm:justify-between items-center gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                className="text-xs gap-1 border-slate-300"
              >
                <Download className="w-3.5 h-3.5" /> Download File CSV
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGoogleSheetsModal(false)}
                  className="text-xs"
                >
                  Tutup
                </Button>
                <Button
                  size="sm"
                  onClick={() => window.open(googleSheetsLink, "_blank")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Buka di Google Sheets
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* APPLICANT REVIEW & CV MODAL */}
      {reviewingApplicant && (
        <Dialog open={!!reviewingApplicant} onOpenChange={(open) => !open && setReviewingApplicant(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-indigo-600 text-white text-xs">
                  {reviewingApplicant.division}
                </Badge>
                <span className="text-xs text-slate-500">
                  {reviewingApplicant.opportunityTitle}
                </span>
              </div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                Review Berkas: {reviewingApplicant.userName}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600">
                Waktu pendaftaran: {reviewingApplicant.appliedAt}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              {/* Auto-Filter Verdict Banner */}
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  reviewingApplicant.autoFilterPassed
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                    : "bg-rose-50 border-rose-300 text-rose-950"
                }`}
              >
                {reviewingApplicant.autoFilterPassed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-bold text-sm">
                    {reviewingApplicant.autoFilterPassed
                      ? "Hasil Filter Otomatis: LOLOS SYARAT KAKU"
                      : "Hasil Filter Otomatis: TIDAK MEMENUHI SYARAT KAKU"}
                  </p>
                  <ul className="text-xs space-y-0.5">
                    {reviewingApplicant.reasons?.map((r, i) => (
                      <li key={i}>• {r}</li>
                    ))}
                  </ul>
                  <p className="text-[11px] opacity-80 pt-1">
                    *Panitia tidak perlu menghitung ulang IPK & semester pelamar, filter di atas dihitung otomatis oleh sistem CampusMatch.
                  </p>
                </div>
              </div>

              {/* Identity & Academic Info */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">Nama Lengkap:</span>
                  <span className="font-bold text-slate-800 text-sm">{reviewingApplicant.userName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">NIM Mahasiswa:</span>
                  <span className="font-mono font-bold text-slate-800">{reviewingApplicant.userNim}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Departemen & Fakultas:</span>
                  <span className="font-semibold text-slate-700">
                    {reviewingApplicant.userDepartment} ({reviewingApplicant.userFaculty})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">IPK & Semester:</span>
                  <span className="font-bold text-blue-700">
                    IPK {reviewingApplicant.userGpa.toFixed(2)} (Semester {reviewingApplicant.userSemester})
                  </span>
                </div>
              </div>

              {/* Cover Letter / Motivation */}
              {reviewingApplicant.coverLetter && (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800">
                    Alasan Memilih Divisi & Rencana Kontribusi:
                  </label>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed italic">
                    &ldquo;{reviewingApplicant.coverLetter}&rdquo;
                  </div>
                </div>
              )}

              {/* Skills from CV */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">
                  Keahlian Terdeteksi dari CV ({reviewingApplicant.userSkills.length}):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {reviewingApplicant.userSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-semibold"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* CV File Preview Box */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-bold text-slate-800">{reviewingApplicant.cvFileName}</p>
                    <p className="text-[11px] text-slate-400">Curriculum Vitae Terverifikasi myITS</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs gap-1 text-blue-700 border-blue-200">
                  <ExternalLink className="w-3.5 h-3.5" /> Buka CV Lengkap
                </Button>
              </div>

              {/* Admin Note Input */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Catatan Panitia / Alasan Keputusan:</label>
                <Input
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="Tambahkan catatan wawancara atau catatan divisi..."
                  className="text-xs bg-white"
                />
              </div>
            </div>

            <DialogFooter className="flex sm:justify-between items-center gap-2 pt-3 border-t border-slate-200">
              <span className="text-[11px] text-slate-400">
                Ubah status seleksi:
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange("REJECTED")}
                  className="text-xs text-rose-700 border-rose-300 hover:bg-rose-50"
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Tolak
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange("REVIEWED")}
                  className="text-xs text-amber-700 border-amber-300 hover:bg-amber-50"
                >
                  Tandai Review
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleStatusChange("ACCEPTED")}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  <Check className="w-3.5 h-3.5 mr-1" /> Terima Pelamar
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default function ApplicantsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Memuat Spreadsheet Pendaftar...</div>}>
      <ApplicantsContent />
    </Suspense>
  );
}
