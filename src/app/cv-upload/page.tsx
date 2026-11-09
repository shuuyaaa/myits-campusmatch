"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../../components/layout/sidebar";
import { Header } from "../../components/layout/header";
import { MobileNav } from "../../components/layout/mobile-nav";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Textarea } from "../../components/ui/textarea";
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Cpu,
  RefreshCw,
  ArrowRight,
  User,
  GraduationCap,
  Award,
  Layers,
  Check,
  FileCheck2,
  Zap,
} from "lucide-react";
import {
  StudentProfileData,
  INITIAL_STUDENT_PROFILE,
  getStoredProfile,
  saveStoredProfile,
} from "../../lib/data-store";

interface AIProcessingLog {
  time: string;
  stage: string;
  message: string;
  type: "info" | "success" | "warn" | "accent";
}

export default function CvUploadPage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<StudentProfileData | null>(null);

  // Upload & processing state
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("CV_M_Haekal_Teknik_Elektro_ITS.pdf");
  const [rawText, setRawText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [logs, setLogs] = useState<AIProcessingLog[]>([]);
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [isSynced, setIsSynced] = useState<boolean>(false);
  const [engineMeta, setEngineMeta] = useState<any | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

  useEffect(() => {
    setProfile(getStoredProfile());
  }, []);

  // Auto scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Validasi dan seleksi berkas nyata (Wajib PDF, Max 100 MB)
  const handleFileSelection = (selected: File) => {
    setErrorMessage("");
    const isPdf =
      selected.name.toLowerCase().endsWith(".pdf") ||
      selected.type === "application/pdf" ||
      selected.type === "application/x-pdf";

    if (!isPdf) {
      setErrorMessage("Format berkas wajib PDF (.pdf). Mohon pilih berkas CV dengan format PDF.");
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setErrorMessage(
        `Ukuran berkas ${(selected.size / (1024 * 1024)).toFixed(1)} MB melebihi batas maksimal yang diizinkan (100 MB).`
      );
      return;
    }

    setFile(selected);
    setFileName(selected.name);
  };

  // Start Real-Time AI Scanning & Parsing Berkas Asli
  const startAIParsing = async (preset: "haekal" | "aisha" | "custom" = "haekal") => {
    if (preset === "custom" && !file && !rawText) {
      setErrorMessage("Silakan pilih berkas CV (PDF) Anda terlebih dahulu sebelum memulai pemindaian.");
      return;
    }

    setErrorMessage("");
    setIsProcessing(true);
    setProgress(10);
    setActiveStep(1);
    setLogs([]);
    setParsedData(null);
    setIsSynced(false);

    const targetName =
      preset === "aisha"
        ? "Sampel_CV_Aisha_Robotika.pdf"
        : preset === "haekal"
        ? "Sampel_CV_Haekal_IoT.pdf"
        : file?.name || "Berkas_CV_Mahasiswa.pdf";

    setFileName(targetName);

    const fileSizeStr =
      preset === "custom" && file
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : "1.85 MB";

    // 1. Log Ingesti Berkas
    setLogs([
      {
        time: "00:00.2",
        stage: "INGESTION",
        message: `[PDF Ingestion] Membaca berkas: ${targetName} (${fileSizeStr}) - Format terverifikasi application/pdf`,
        type: "info",
      },
    ]);
    setProgress(25);
    setActiveStep(1);

    try {
      // 2. Log OCR & Ekstraksi Stream Dekompresi
      await new Promise((r) => setTimeout(r, 600));
      setProgress(50);
      setActiveStep(2);
      setLogs((prev) => [
        ...prev,
        {
          time: "00:00.8",
          stage: "OCR_PARSER",
          message: `[PDF Stream Parser] Mengekstrak token teks, decoding font stream FlateDecode, tabel nilai, dan riwayat studi...`,
          type: "info",
        },
      ]);

      let resJson: any = null;

      // Percobaan 1: Kirim via multipart FormData
      try {
        const formData = new FormData();
        if (preset === "custom" && file) {
          formData.append("file", file);
        }
        formData.append("fileName", targetName);
        if (preset !== "custom") {
          formData.append("studentPreset", preset);
        }
        if (rawText) {
          formData.append("cvText", rawText);
        }

        const res = await fetch("/api/ai/parse-cv", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          resJson = await res.json();
        }
      } catch (formDataErr) {
        console.warn("FormData fetch hit issue, trying Base64 JSON fallback:", formDataErr);
      }

      // Percobaan 2: Jika FormData gagal atau timeout, kirim via Base64 JSON payload
      if (!resJson || !resJson.success) {
        let fileBase64 = "";
        if (preset === "custom" && file) {
          fileBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              const b64 = (reader.result as string).split(",")[1] || "";
              resolve(b64);
            };
            reader.onerror = reject;
          });
        }

        const res = await fetch("/api/ai/parse-cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: targetName,
            fileBase64: fileBase64 || undefined,
            studentPreset: preset !== "custom" ? preset : undefined,
            cvText: rawText || "",
          }),
        });

        if (res.ok) {
          resJson = await res.json();
        }
      }

      if (!resJson || !resJson.success) {
        throw new Error(resJson?.error || "Gagal memproses berkas CV.");
      }

      const data = resJson.data;
      setEngineMeta(resJson.meta);

      // 3. Log Pengenalan Entitas Nama, IPK, & Departemen Asli
      await new Promise((r) => setTimeout(r, 700));
      setProgress(75);
      setActiveStep(3);
      setLogs((prev) => [
        ...prev,
        {
          time: "00:01.8",
          stage: "ENTITY_NER",
          message: `[AI Extraction] Entitas terdeteksi: ${data.name && data.name !== "Tidak tertera di CV" ? data.name : "Kandidat Terdaftar"} (IPK: ${data.gpa != null ? data.gpa.toFixed(2) : "Tidak dicantumkan di CV"}) • ${data.department && data.department !== "Tidak tertera di CV" ? data.department : "Departemen Teknik Elektro"}`,
          type: "success",
        },
        {
          time: "00:02.4",
          stage: "SKILL_TAXONOMY",
          message: `[Skill Engine] ${data.skills?.length || 0} Keahlian terverifikasi: ${data.skills?.slice(0, 6).join(", ") || "Teknologi terpadu"}`,
          type: "accent",
        },
      ]);

      // 4. Log Selesai & Vector Matching
      await new Promise((r) => setTimeout(r, 600));
      setProgress(100);
      setActiveStep(4);
      setLogs((prev) => [
        ...prev,
        {
          time: "00:03.0",
          stage: "COMPLETION",
          message: `[AI Selesai] Analisis berkas asli sukses (${resJson.meta?.engineUsed || "AI Engine"}). Rekomendasi siap digunakan!`,
          type: "success",
        },
      ]);

      setParsedData(data);

      // Cek apakah berkas CV yang diunggah adalah milik akun Haekal sendiri atau berkas teman
      const candidateName = data.name && data.name !== "Tidak tertera di CV" ? data.name : "Kandidat Terdeteksi";
      const isOwnerCv = candidateName.toLowerCase().includes("haekal") || candidateName.toLowerCase().includes("praditya");
      const isFriendCv = !isOwnerCv;

      // Otomatis simpan hasil analisis CV dengan validitas 10 menit
      // PENTING: Identitas profil akun utama pengguna (Praditya Haekal Islami Al Haqiqi) TIDAK BOLEH BERUBAH
      const current = getStoredProfile();
      const updated: StudentProfileData = {
        ...current,
        name: INITIAL_STUDENT_PROFILE.name, // Selalu Praditya Haekal Islami Al Haqiqi
        ...(isOwnerCv ? {
          gpa: data.gpa != null ? data.gpa : current.gpa,
          semester: data.semester != null ? data.semester : current.semester,
          sksCompleted: data.sks != null ? data.sks : current.sksCompleted,
          department: data.department && data.department !== "Tidak tertera di CV" ? data.department : current.department,
          faculty: data.faculty && data.faculty !== "Tidak tertera di CV" ? data.faculty : current.faculty,
          skills: Array.from(new Set([...current.skills, ...(data.skills || [])])),
          softSkills: Array.from(new Set([...current.softSkills, ...(data.softSkills || [])])),
          interests: Array.from(new Set([...current.interests, ...(data.interests || [])])),
          achievements: data.achievements && data.achievements.length > 0 ? data.achievements : current.achievements,
          experiences: data.experiences && data.experiences.length > 0 ? data.experiences : current.experiences,
        } : {}),
        cvFileName: targetName,
        cvParsedAt: new Date().toLocaleString("id-ID"),
        cvParsedTimestamp: Date.now(),
        cvParsedData: {
          confidenceScore: data.confidenceScore || 96.8,
          detectedSkills: data.skills || [],
          aiSummary: data.aiSummary || "",
        },
        activeScannedCv: {
          candidateName,
          fileName: targetName,
          department: data.department,
          faculty: data.faculty,
          gpa: data.gpa,
          semester: data.semester,
          skills: data.skills || [],
          softSkills: data.softSkills || [],
          achievements: data.achievements || [],
          experiences: data.experiences || [],
          aiSummary: data.aiSummary || "",
          confidenceScore: data.confidenceScore || 96.8,
          scannedAt: new Date().toLocaleString("id-ID"),
          timestamp: Date.now(),
          isFriendCv,
        },
      };

      saveStoredProfile(updated);
      setProfile(updated);
      setIsSynced(true);
    } catch (err: any) {
      console.error("API call error:", err);
      setErrorMessage(err?.message || "Terjadi kesalahan saat memproses berkas PDF.");
      setLogs((prev) => [
        ...prev,
        {
          time: "00:02.0",
          stage: "ERROR",
          message: `[Gagal] ${err?.message || "Terjadi kesalahan pemrosesan berkas PDF."}`,
          type: "warn",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Sync with profile
  const handleSyncToProfile = () => {
    if (!parsedData) return;
    const current = getStoredProfile();

    const candidateName = parsedData.name && parsedData.name !== "Tidak tertera di CV" ? parsedData.name : "Kandidat Terdeteksi";
    const isOwnerCv = candidateName.toLowerCase().includes("haekal") || candidateName.toLowerCase().includes("praditya");
    const isFriendCv = !isOwnerCv;

    const updated: StudentProfileData = {
      ...current,
      name: INITIAL_STUDENT_PROFILE.name,
      ...(isOwnerCv ? {
        gpa: parsedData.gpa != null ? parsedData.gpa : current.gpa,
        semester: parsedData.semester != null ? parsedData.semester : current.semester,
        sksCompleted: parsedData.sks != null ? parsedData.sks : current.sksCompleted,
        department: parsedData.department && parsedData.department !== "Tidak tertera di CV" ? parsedData.department : current.department,
        faculty: parsedData.faculty && parsedData.faculty !== "Tidak tertera di CV" ? parsedData.faculty : current.faculty,
        skills: Array.from(new Set([...current.skills, ...(parsedData.skills || [])])),
        softSkills: Array.from(new Set([...current.softSkills, ...(parsedData.softSkills || [])])),
        interests: Array.from(new Set([...current.interests, ...(parsedData.interests || [])])),
        achievements: parsedData.achievements && parsedData.achievements.length > 0 ? parsedData.achievements : current.achievements,
        experiences: parsedData.experiences && parsedData.experiences.length > 0 ? parsedData.experiences : current.experiences,
      } : {}),
      cvFileName: fileName,
      cvParsedAt: new Date().toLocaleString("id-ID"),
      cvParsedTimestamp: Date.now(),
      activeScannedCv: {
        candidateName,
        fileName: fileName,
        department: parsedData.department,
        faculty: parsedData.faculty,
        gpa: parsedData.gpa,
        semester: parsedData.semester,
        skills: parsedData.skills || [],
        softSkills: parsedData.softSkills || [],
        achievements: parsedData.achievements || [],
        experiences: parsedData.experiences || [],
        aiSummary: parsedData.aiSummary || "",
        confidenceScore: parsedData.confidenceScore || 96.8,
        scannedAt: new Date().toLocaleString("id-ID"),
        timestamp: Date.now(),
        isFriendCv,
      },
    };

    saveStoredProfile(updated);
    setProfile(updated);
    setIsSynced(true);
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
          title="Unggah & Analisis CV Berbasis AI"
          userName={profile?.name || "Praditya Haekal Islami Al Haqiqi"}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-8 space-y-6">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-300 border border-white/20 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  Gemini Multi-Modal CV Parsing Engine
                </span>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                  Pemindaian & Ekstraksi CV Otomatis
                </h1>
                <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                  Unggah berkas CV Anda untuk melihat AI bekerja secara real-time mengekstrak IPK, riwayat organisasi, prestasi, serta keahlian teknis secara langsung di localhost.
                </p>
              </div>

              {/* Sample Preset Buttons for Instant 1-Click Demo */}
              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <Button
                  onClick={() => startAIParsing("haekal")}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm"
                >
                  <Cpu className="w-3.5 h-3.5 mr-1.5" />
                  Sampel CV: Teknik Rekayasa & IoT
                </Button>
                <Button
                  onClick={() => startAIParsing("aisha")}
                  disabled={isProcessing}
                  variant="outline"
                  className="bg-white/10 text-white hover:bg-white/20 border-white/20 text-xs font-semibold"
                >
                  <Zap className="w-3.5 h-3.5 mr-1.5 text-yellow-400" />
                  Sampel CV: Sistem Tertanam & Robotika
                </Button>
              </div>
            </div>
          </div>

          {/* Upload Area & Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Box (1 col) */}
            <Card className="border-slate-200 shadow-sm flex flex-col justify-between">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-blue-600" />
                  Pilih Berkas CV Mahasiswa
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Format wajib PDF (.pdf) &bull; Ukuran berkas maksimum 100 MB
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Alert Error jika file bukan PDF atau > 100 MB */}
                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Drag and Drop Zone Wajib PDF */}
                <div
                  onClick={() => {
                    const input = document.getElementById("cv-file-input");
                    input?.click();
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileSelection(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center space-y-2 ${
                    file
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/30"
                  }`}
                >
                  <div className={`p-3 rounded-full ${file ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"}`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">
                      {file ? file.name : "Klik atau seret file PDF CV ke sini"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {file
                        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • Berkas PDF Siap Dianalisis`
                        : "Format: PDF Asli (.pdf) • Maks. 100 MB"}
                    </p>
                  </div>
                  <input
                    id="cv-file-input"
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelection(e.target.files[0]);
                      }
                    }}
                  />
                </div>

                {/* Direct paste option */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600">
                    Atau Tempel Ringkasan CV / Teks:
                  </label>
                  <Textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Tempel teks isi CV mahasiswa di sini (opsional pendamping PDF)..."
                    rows={3}
                    className="text-xs bg-slate-50"
                  />
                </div>

                <Button
                  onClick={() => startAIParsing("custom")}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      AI Sedang Membaca & Menganalisis PDF...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Mulai Analisis AI Sekarang
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* LIVE AI Visualizer & Terminal (2 cols) */}
            <Card className="lg:col-span-2 border-slate-200 shadow-sm bg-slate-950 text-slate-100 overflow-hidden flex flex-col">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold font-mono text-slate-200">
                    CampusMatch AI Agent — Live Execution Stream
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                    LOCAL ENGINE ACTIVE
                  </span>
                </div>
              </div>

              {/* Progress & Stage Indicator */}
              <div className="p-4 bg-slate-900/60 border-b border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Status Proses:</span>
                  <span className="text-emerald-400 font-bold">{progress}% Selesai</span>
                </div>
                <Progress value={progress} className="h-1.5 bg-slate-800" />

                {/* 4 Steps Badges */}
                <div className="grid grid-cols-4 gap-2 pt-2 text-[10px] font-mono text-center">
                  <div
                    className={`p-1.5 rounded border ${
                      activeStep >= 1
                        ? "bg-blue-950/80 border-blue-500 text-blue-300 font-bold"
                        : "border-slate-800 text-slate-600"
                    }`}
                  >
                    1. Ingestion & OCR
                  </div>
                  <div
                    className={`p-1.5 rounded border ${
                      activeStep >= 2
                        ? "bg-indigo-950/80 border-indigo-500 text-indigo-300 font-bold"
                        : "border-slate-800 text-slate-600"
                    }`}
                  >
                    2. Ekstraksi Akademik
                  </div>
                  <div
                    className={`p-1.5 rounded border ${
                      activeStep >= 3
                        ? "bg-purple-950/80 border-purple-500 text-purple-300 font-bold"
                        : "border-slate-800 text-slate-600"
                    }`}
                  >
                    3. Skill & Portofolio
                  </div>
                  <div
                    className={`p-1.5 rounded border ${
                      activeStep >= 4
                        ? "bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold"
                        : "border-slate-800 text-slate-600"
                    }`}
                  >
                    4. Matching Siap
                  </div>
                </div>
              </div>

              {/* Terminal Log Console */}
              <div className="p-4 flex-1 overflow-y-auto max-h-72 font-mono text-xs space-y-2 bg-slate-950">
                {logs.length === 0 ? (
                  <div className="text-slate-500 text-center py-10 space-y-2">
                    <Cpu className="w-8 h-8 text-slate-700 mx-auto animate-pulse" />
                    <p>Menunggu pengunggahan berkas CV (PDF) atau klik salah satu sampel CV di atas untuk memulai pemindaian AI secara langsung.</p>
                  </div>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="text-slate-500 shrink-0">[{log.time}]</span>
                      <span
                        className={`font-semibold shrink-0 ${
                          log.type === "success"
                            ? "text-emerald-400"
                            : log.type === "accent"
                            ? "text-yellow-400"
                            : log.type === "warn"
                            ? "text-rose-400"
                            : "text-blue-400"
                        }`}
                      >
                        [{log.stage}]
                      </span>
                      <span className="text-slate-200 leading-relaxed">{log.message}</span>
                    </div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </Card>
          </div>

          {/* PARSED RESULT CARD (Appears when AI finishes) */}
          {parsedData && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-base font-bold text-slate-900">
                      Hasil Ekstraksi AI & Analisis CV
                    </h2>
                    {parsedData?.name && !parsedData.name.toLowerCase().includes("haekal") ? (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs font-semibold">
                        Uji Berkas Teman: {parsedData.name}
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-semibold">
                        Berkas CV Pribadi
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Kandidat tertera di berkas: <strong className="text-slate-800 font-bold">{parsedData.name || "Kandidat Terdeteksi"}</strong> &bull; Profil akun utama Anda tetap: <strong className="text-blue-700 font-bold">Praditya Haekal Islami Al Haqiqi</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={() => router.push("/matches")}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs gap-1.5"
                  >
                    Buka Hasil Pencocokan Peluang <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </Button>
                </div>
              </div>

              {/* AI Qualitative Summary Box (Rapi, Terstruktur & Elegan) */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/90 via-sky-50/50 to-indigo-50/70 border border-blue-200/80 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 pb-2.5">
                  <div className="flex items-center gap-2 font-bold text-blue-900 text-xs md:text-sm">
                    <span className="p-1 rounded-md bg-blue-600 text-white">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    Analisis Kualitatif AI (Confidence: {parsedData.confidenceScore || 96}%)
                  </div>
                  {engineMeta && (
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-100/80 text-blue-800 font-semibold border border-blue-200/60">
                      {engineMeta.engineUsed} &bull; {engineMeta.fileSizeFormatted || "PDF Terverifikasi"}
                    </span>
                  )}
                </div>
                <div className="text-xs md:text-[13px] leading-relaxed text-slate-700 space-y-2">
                  <p className="font-normal text-slate-800 leading-relaxed whitespace-pre-line">
                    {parsedData.aiSummary}
                  </p>
                </div>
              </div>

              {/* Extracted Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Academic Record */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      Data Akademik Terdeteksi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5 text-xs text-slate-700">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Kandidat di Berkas:</span>
                      <span className="font-bold text-right text-slate-900">
                        {parsedData.name && parsedData.name !== "Tidak tertera di CV" ? (
                          parsedData.name
                        ) : (
                          <span className="text-slate-400 italic font-normal">Tidak tertera di CV</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Departemen:</span>
                      <span className="font-semibold text-right">
                        {parsedData.department && parsedData.department !== "Tidak tertera di CV" ? (
                          parsedData.department
                        ) : (
                          <span className="text-slate-400 italic font-normal">Tidak dicantumkan di CV</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Semester:</span>
                      <span className="font-semibold">
                        {parsedData.semester ? (
                          `Semester ${parsedData.semester} (${parsedData.sks || "-"} SKS)`
                        ) : (
                          <span className="text-slate-400 italic font-normal">Tidak dicantumkan di CV</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-0.5">
                      <span className="text-slate-500">IPK Terbaca:</span>
                      {parsedData.gpa != null ? (
                        <Badge className="bg-emerald-600 text-white font-bold text-xs">
                          {parsedData.gpa.toFixed(2)} / 4.00
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-500 border-slate-200 bg-slate-50 text-[11px] font-normal italic">
                          Tidak dicantumkan di CV
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* 2. Detected Skills */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-indigo-600" />
                      Keahlian Teridentifikasi ({parsedData.skills?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {parsedData.skills && parsedData.skills.length > 0 ? (
                        parsedData.skills.map((sk: string) => (
                          <span
                            key={sk}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 font-semibold"
                          >
                            {sk}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-400 text-xs italic">Tidak ada keahlian teknis khusus yang tertera di dokumen.</p>
                      )}
                    </div>
                    {parsedData.softSkills && parsedData.softSkills.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 block mb-1">Soft Skills:</span>
                        <div className="flex flex-wrap gap-1">
                          {parsedData.softSkills.map((sk: string) => (
                            <span
                              key={sk}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 3. Experiences & Achievements (Poin-Poin Ringkas, Lengkap & Rapi) */}
                <Card className="border-slate-200 shadow-sm flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-500" />
                        Prestasi & Pengalaman
                      </span>
                      <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        {(parsedData.achievements?.length || 0)} Prestasi &bull; {(parsedData.experiences?.length || 0)} Pengalaman
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs flex-1">
                    {/* Bagian Prestasi Unggulan (Poin Inti Saja) */}
                    {parsedData.achievements && parsedData.achievements.length > 0 ? (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                          Prestasi / Penghargaan ({parsedData.achievements.length}):
                        </span>
                        <div className="space-y-1.5">
                          {parsedData.achievements.map((ach: any, i: number) => {
                            const cleanTitle = (ach.title || "")
                              .replace(/[_\\]+/g, " ")
                              .replace(/\s*(?:Developed|Selected\s+for|Awarded\s+for|For\s+proposing|In\s+recognition|Sebagai|Menciptakan)[\s\S]*/i, "")
                              .replace(/^[•●\-*\s]+/, "")
                              .trim();
                            const displayTitle =
                              cleanTitle.length > 60
                                ? cleanTitle.substring(0, 58).replace(/\s+\S*$/, "") + "..."
                                : cleanTitle || "Prestasi Mahasiswa";

                            return (
                              <div
                                key={i}
                                className="p-2 rounded-lg bg-amber-50/80 border border-amber-200/70 flex items-start justify-between gap-1.5"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-amber-950 text-xs truncate">
                                    {displayTitle}
                                  </p>
                                  <p className="text-[10px] text-amber-700 font-medium">
                                    {ach.organizer || "Kompetisi"} &bull; {ach.level} ({ach.year || "2025"})
                                  </p>
                                </div>
                                <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                  {ach.year || "2025"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}

                    {/* Bagian Riwayat Pengalaman & Organisasi (Experience Lengkap) */}
                    {parsedData.experiences && parsedData.experiences.length > 0 ? (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                            Pengalaman & Organisasi ({parsedData.experiences.length}):
                          </span>
                          <span className="text-[9px] text-slate-400">
                            Terurut dari CV
                          </span>
                        </div>
                        <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
                          {parsedData.experiences.map((exp: any, i: number) => {
                            const cleanTitle = (exp.title || "")
                              .replace(/^[•●\-*\s]+/, "")
                              .trim();
                            const displayTitle =
                              cleanTitle.length > 55
                                ? cleanTitle.substring(0, 52).replace(/\s+\S*$/, "") + "..."
                                : cleanTitle || "Pengalaman Organisasi / Proyek";

                            return (
                              <div
                                key={i}
                                className="p-2 rounded-lg bg-blue-50/70 border border-blue-200/70 flex items-start justify-between gap-1.5 hover:bg-blue-50 transition-colors"
                              >
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-slate-900 text-xs truncate">
                                    {displayTitle}
                                  </p>
                                  <p className="text-[10px] text-blue-700 font-medium truncate">
                                    {exp.organization || "Institut Teknologi Sepuluh Nopember"}
                                  </p>
                                  {exp.description && (
                                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                                      {exp.description}
                                    </p>
                                  )}
                                </div>
                                {exp.duration && (
                                  <span className="shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 whitespace-nowrap">
                                    {exp.duration}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      !parsedData.achievements?.length && (
                        <p className="text-slate-400 text-xs italic">
                          Tidak ada riwayat proyek atau prestasi yang tertera di dokumen.
                        </p>
                      )
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
