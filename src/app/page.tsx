"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, CheckCircle2, AlertCircle, ArrowUpRight, Award, Users, BookOpen } from "lucide-react";

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigasi myITS */}
      <Sidebar
        role="STUDENT"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        user={{
          name: "M. Haekal (Teknik Elektro)",
          role: "Mahasiswa S1",
          initials: "MH",
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <Header
          title="Dashboard Rekomendasi Peluang"
          userName="M. Haekal"
        />

        {/* Konten Utama Dashboard */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Banner Selamat Datang */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 p-6 text-white shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> AI Engine Active (Gemini API)
                </span>
                <h1 className="text-2xl font-bold tracking-tight">Selamat Datang di myITS CampusMatch</h1>
                <p className="text-blue-100 text-sm mt-1 max-w-xl">
                  Platform pencocokan cerdas berbasis syarat kaku & analisis CV untuk mahasiswa Departemen Teknik Elektro FTEIC ITS.
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow">
                  Upload & Scan CV
                </Button>
              </div>
            </div>
          </div>

          {/* Kartu Profil Singkat Mahasiswa */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground font-medium">Departemen</p>
                <p className="text-base font-bold text-slate-800 mt-1">Teknik Elektro</p>
                <span className="text-xs text-blue-600 font-medium">FTEIC - ITS</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground font-medium">IPK Terakhir</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold text-slate-800">3.72</p>
                  <span className="text-xs text-emerald-600 font-medium">/ 4.00</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground font-medium">Semester / SKS</p>
                <p className="text-base font-bold text-slate-800 mt-1">Semester 5 (96 SKS)</p>
                <span className="text-xs text-slate-500">Status Aktif FRS</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground font-medium">Peluang Cocok</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">8 Program</p>
                <span className="text-xs text-emerald-600 font-medium">3 Beasiswa • 5 Ormawa</span>
              </CardContent>
            </Card>
          </div>

          {/* Daftar Rekomendasi Peluang Teratas */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Rekomendasi Teratas untuk Anda</h2>
                <p className="text-xs text-slate-500">Dihitung otomatis berdasarkan profil akademik & kriteria syarat yang lolos</p>
              </div>
              <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 bg-blue-50">
                Pembaruan Real-Time
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Card 1: Beasiswa */}
              <Card className="hover:shadow-md transition-shadow border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">Beasiswa</Badge>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        95% Match
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-base font-bold mt-2 text-slate-800">
                    Beasiswa Karya Salemba Empat (KSE)
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-2">
                    Bantuan tunjangan biaya kuliah & program pembinaan kepemimpinan berkala untuk mahasiswa aktif ITS.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> IPK Min. 3.00 (Anda: 3.72)
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Semester 2–6 (Anda: Semester 5)
                    </div>
                  </div>
                  <Progress value={95} className="h-1.5" />
                  <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                    <span className="text-xs text-slate-400">Deadline: 20 Nov 2026</span>
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                      Detail <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Himpunan / Ormawa */}
              <Card className="hover:shadow-md transition-shadow border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white">Organisasi Kampus</Badge>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                        91% Match
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-base font-bold mt-2 text-slate-800">
                    Staff Ahli HIMATRO ITS 2026/2027
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-2">
                    Open recruitment fungsionaris Himpunan Mahasiswa Teknik Elektro divisi Riset & Teknologi Terapan.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mahasiswa Aktif S1 Teknik Elektro
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Lulus LKMM TD
                    </div>
                  </div>
                  <Progress value={91} className="h-1.5" />
                  <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                    <span className="text-xs text-slate-400">Deadline: 14 Nov 2026</span>
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                      Detail <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Beasiswa Industri */}
              <Card className="hover:shadow-md transition-shadow border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">Beasiswa</Badge>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        82% Match
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-base font-bold mt-2 text-slate-800">
                    Djarum Beasiswa Plus
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-2">
                    Bantuan dana pendidikan serta pelatihan soft skills, character building, dan leadership development.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> IPK Min. 3.20 (Lolos)
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-600">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Perlu bukti keaktifan organisasi
                    </div>
                  </div>
                  <Progress value={82} className="h-1.5" />
                  <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                    <span className="text-xs text-slate-400">Deadline: 28 Nov 2026</span>
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                      Detail <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}