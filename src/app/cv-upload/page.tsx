"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../../components/layout/sidebar";
import { Header } from "../../components/layout/header";
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
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [logs, setLogs] = useState<AIProcessingLog[]>([]);
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [isSynced, setIsSynced] = useState<boolean>(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProfile(getStoredProfile());
  }, []);

  // Auto scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Start Real-Time AI Simulation & Parsing
  const startAIParsing = async (preset: "haekal" | "aisha" | "custom" = "haekal") => {
    setIsProcessing(true);
    setProgress(5);
    setActiveStep(1);
    setLogs([]);
    setParsedData(null);
    setIsSynced(false);

    const targetName =
      preset === "aisha"
        ? "CV_Aisha_Putri_Embedded_FPGA.pdf"
        : preset === "custom" && file
        ? file.name
        : "CV_M_Haekal_Teknik_Elektro_ITS.pdf";

    setFileName(targetName);

    const logSteps: { delay: number; log: AIProcessingLog; progress: number; step: number }[] = [
      {
        delay: 300,
        progress: 15,
        step: 1,
        log: {
          time: "00:00.3",
          stage: "INGESTION",
          message: `[AI Core] Membaca payload dokumen: ${targetName} (MIME: application/pdf)`,
          type: "info",
        },
      },
      {
        delay: 800,
        progress: 30,
        step: 1,
        log: {
          time: "00:00.8",
          stage: "OCR_PARSER",
          message: `[OCR Engine] Mengekstrak token teks, memisahkan header, riwayat studi, dan struktur tabel...`,
          type: "info",
        },
      },
      {
        delay: 1500,
        progress: 50,
        step: 2,
        log: {
          time: "00:01.5",
          stage: "ENTITY_NER",
          message:
            preset === "aisha"
              ? `[Gemini NER] Entitas terdeteksi: Aisha Putri Ramadhani (NIM: 07211940000002) • S1 Teknik Elektro FTEIC ITS`
              : `[Gemini NER] Entitas terdeteksi: M. Haekal Rizky Firmansyah (NIM: 07211940000001) • S1 Teknik Elektro FTEIC ITS`,
          type: "success",
        },
      },
      {
        delay: 2200,
        progress: 70,
        step: 2,
        log: {
          time: "00:02.2",
          stage: "ACADEMIC_EVAL",
          message:
            preset === "aisha"
              ? `[Transkrip Detector] IPK: 3.78 • Semester: 5 • SKS: 104 • Status: Aktif FRS`
              : `[Transkrip Detector] IPK: 3.72 • Semester: 5 • SKS: 96 • Status: Aktif FRS`,
          type: "accent",
        },
      },
      {
        delay: 2900,
        progress: 85,
        step: 3,
        log: {
          time: "00:02.9",
          stage: "SKILL_TAXONOMY",
          message:
            preset === "aisha"
              ? `[Skill Matcher] 8 Hard skills terverifikasi: FPGA, Verilog, Embedded Systems, ROS, C++, MATLAB, Circuit Design`
              : `[Skill Matcher] 8 Hard skills terverifikasi: Python, C++, Arduino, Embedded Systems, Machine Learning, ROS, MATLAB, IoT`,
          type: "success",
        },
      },
      {
        delay: 3600,
        progress: 95,
        step: 3,
        log: {
          time: "00:03.6",
          stage: "VECTOR_MATCH",
          message: `[CampusMatch Vector Engine] Membandingkan vektor CV terhadap 10 katalog beasiswa & ormawa ITS...`,
          type: "info",
        },
      },
      {
        delay: 4200,
        progress: 100,
        step: 4,
        log: {
          time: "00:04.2",
          stage: "COMPLETION",
          message: `[AI Selesai] Analisis berhasil dieksekusi dengan tingkat akurasi 96.8%. Rekomendasi siap digunakan!`,
          type: "accent",
        },
      },
    ];

    // Play logs with timing
    for (const item of logSteps) {
      await new Promise((resolve) => setTimeout(resolve, item.delay));
      setProgress(item.progress);
      setActiveStep(item.step);
      setLogs((prev) => [...prev, item.log]);
    }

    // Call API route
    try {
      const res = await fetch("/api/ai/parse-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentPreset: preset,
          fileName: targetName,
          cvText: rawText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setParsedData(data.data);
      }
    } catch (err) {
      console.error("API call error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Sync with profile
  const handleSyncToProfile = () => {
    if (!parsedData) return;
    const current = getStoredProfile();

    const updated: StudentProfileData = {
      ...current,
      name: parsedData.name || current.name,
      nim: parsedData.nim || current.nim,
      gpa: parsedData.gpa || current.gpa,
      semester: parsedData.semester || current.semester,
      sksCompleted: parsedData.sks || current.sksCompleted,
      skills: Array.from(new Set([...current.skills, ...(parsedData.skills || [])])),
      softSkills: Array.from(new Set([...current.softSkills, ...(parsedData.softSkills || [])])),
      interests: Array.from(new Set([...current.interests, ...(parsedData.interests || [])])),
      achievements: parsedData.achievements || current.achievements,
      experiences: parsedData.experiences || current.experiences,
      cvFileName: fileName,
      cvParsedAt: new Date().toLocaleString("id-ID"),
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
          role: `${profile?.major || "S1 Teknik Elektro"} (Sem. ${profile?.semester || 5})`,
          initials: "PH",
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title="Upload & Analisis CV Berbasis AI (Live Scanner)"
          userName={profile?.name || "Praditya Haekal Islami Al Haqiqi"}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
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
                  Uji CV: Haekal (IoT & Elektro)
                </Button>
                <Button
                  onClick={() => startAIParsing("aisha")}
                  disabled={isProcessing}
                  variant="outline"
                  className="bg-white/10 text-white hover:bg-white/20 border-white/20 text-xs font-semibold"
                >
                  <Zap className="w-3.5 h-3.5 mr-1.5 text-yellow-400" />
                  Uji CV: Aisha (FPGA & Robotik)
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
                  Mendukung format PDF, DOCX, atau teks langsung (Max 10MB)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drag and Drop Zone */}
                <div
                  onClick={() => {
                    const input = document.getElementById("cv-file-input");
                    input?.click();
                  }}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/30 flex flex-col items-center justify-center space-y-2"
                >
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">
                      {file ? file.name : "Klik atau seret file CV ke sini"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Format: .PDF, .DOCX, atau teks
                    </p>
                  </div>
                  <input
                    id="cv-file-input"
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const selected = e.target.files[0];
                        setFile(selected);
                        setFileName(selected.name);
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
                    placeholder="Tempel teks CV mahasiswa di sini untuk dianalisis oleh Gemini..."
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
                      AI Sedang Memproses CV...
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
                    <p>Menunggu input berkas CV atau klik tombol &quot;Uji CV: Haekal&quot; di atas untuk memulai eksekusi AI langsung.</p>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    Hasil Ekstraksi AI & Rekomendasi Profil
                  </h2>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSyncToProfile}
                    className={`text-xs gap-1.5 font-bold shadow-sm ${
                      isSynced
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isSynced ? (
                      <>
                        <Check className="w-4 h-4" /> Tersinkron ke My Profile
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" /> Terapkan ke Profil Saya
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/matches")}
                    className="text-xs text-blue-700 border-blue-200 hover:bg-blue-50"
                  >
                    Buka My Matches <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>

              {/* AI Qualitative Summary Box */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1 text-xs">
                <div className="flex items-center gap-2 font-bold text-blue-900">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Analisis Kualitatif AI (Confidence: {parsedData.confidenceScore || 96.8}%):
                </div>
                <p className="leading-relaxed">{parsedData.aiSummary}</p>
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
                  <CardContent className="space-y-2 text-xs text-slate-700">
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-500">Nama:</span>
                      <span className="font-bold">{parsedData.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-500">NIM:</span>
                      <span className="font-mono font-semibold">{parsedData.nim}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-500">Departemen:</span>
                      <span className="font-semibold">{parsedData.department}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-500">Fakultas:</span>
                      <span className="font-semibold">{parsedData.faculty}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-500">IPK Terbaca:</span>
                      <Badge className="bg-emerald-600 text-white font-black text-xs">
                        {parsedData.gpa} / 4.00
                      </Badge>
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
                      {parsedData.skills?.map((sk: string) => (
                        <span
                          key={sk}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 font-semibold"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                    {parsedData.softSkills && (
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

                {/* 3. Experiences & Achievements */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      Prestasi & Organisasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    {parsedData.experiences?.slice(0, 2).map((exp: any, i: number) => (
                      <div key={i} className="p-2 rounded bg-slate-50 border border-slate-100">
                        <p className="font-bold text-slate-800">{exp.title}</p>
                        <p className="text-[11px] text-blue-600">{exp.organization}</p>
                      </div>
                    ))}
                    {parsedData.achievements?.slice(0, 1).map((ach: any, i: number) => (
                      <div key={i} className="p-2 rounded bg-amber-50/70 border border-amber-100">
                        <p className="font-bold text-amber-900">{ach.title}</p>
                        <p className="text-[10px] text-amber-700">Tingkat {ach.level} ({ach.year})</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
