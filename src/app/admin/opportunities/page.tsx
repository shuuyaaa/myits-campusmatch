"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Settings,
  Plus,
  Users,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Trash2,
  Building2,
  GraduationCap,
  FileCheck2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import {
  OpportunityItem,
  getStoredOpportunities,
  addStoredOpportunity,
  getStoredApplicants,
} from "@/lib/data-store";

export default function AdminOpportunitiesPage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [applicants, setApplicants] = useState<any[]>([]);

  // New Open Recruitment Form State (Google Form Style Parameters)
  const [formData, setFormData] = useState({
    title: "",
    orgName: "",
    category: "COMMITTEE" as any,
    description: "",
    divisionsInput: "Divisi Acara, Divisi Medfo, Divisi Perlengkapan & Logistik, Divisi LO & Fasilitator, Divisi Sponsorship",
    minGpa: 2.75,
    minSemester: 2,
    maxSemester: 6,
    allowedMajorsInput: "Terbuka untuk Seluruh Jurusan di ITS",
    requiredSkillsInput: "Leadership, Teamwork, Communication, Problem Solving",
    requiredDocsInput: "KTM, Transkrip Nilai, Curriculum Vitae",
    quota: 100,
    applicationEnd: "2026-12-15",
  });

  useEffect(() => {
    setOpportunities(getStoredOpportunities());
    setApplicants(getStoredApplicants());
  }, []);

  const handleCreateOpportunity = () => {
    if (!formData.title || !formData.orgName) return;

    const divisions = formData.divisionsInput
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    const requiredSkills = formData.requiredSkillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const requiredDocs = formData.requiredDocsInput
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    const allowedMajors =
      formData.allowedMajorsInput.toLowerCase().includes("seluruh") || !formData.allowedMajorsInput.trim()
        ? []
        : formData.allowedMajorsInput.split(",").map((m) => m.trim()).filter(Boolean);

    const newOpp: OpportunityItem = {
      id: `opp-custom-${Date.now()}`,
      title: formData.title,
      slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: formData.description || "Open recruitment panitia dan kru kegiatan kampus ITS.",
      category: formData.category,
      status: "OPEN",
      organization: {
        name: formData.orgName,
        type: formData.category === "COMMITTEE" ? "PANITIA" : "HIMA",
        faculty: "Institut",
      },
      divisions: divisions.length > 0 ? divisions : ["Divisi Umum"],
      applicationStart: new Date().toISOString().split("T")[0],
      applicationEnd: formData.applicationEnd || "2026-12-15",
      announcementDate: "2026-12-25",
      quota: formData.quota || 50,
      minGpa: Number(formData.minGpa) || 2.75,
      minSemester: Number(formData.minSemester) || 1,
      maxSemester: Number(formData.maxSemester) || 8,
      allowedMajors,
      requiredSkills,
      requiredDocs,
      benefits: [
        "Sertifikat Kepanitiaan Resmi ITS",
        "Poin SKP Kemahasiswaan Bidang Organisasi / Event",
        "Pengalaman kepemimpinan dan jejaring lintas departemen",
      ],
      tags: ["open recruitment", formData.orgName.toLowerCase(), "event its"],
    };

    addStoredOpportunity(newOpp);
    setOpportunities(getStoredOpportunities());
    setShowCreateModal(false);

    // Reset form
    setFormData({
      title: "",
      orgName: "",
      category: "COMMITTEE",
      description: "",
      divisionsInput: "Divisi Acara, Divisi Medfo, Divisi Logistik, Divisi LO",
      minGpa: 2.75,
      minSemester: 2,
      maxSemester: 6,
      allowedMajorsInput: "Terbuka untuk Seluruh Jurusan di ITS",
      requiredSkillsInput: "Leadership, Teamwork, Communication",
      requiredDocsInput: "KTM, Transkrip Nilai, Curriculum Vitae",
      quota: 100,
      applicationEnd: "2026-12-15",
    });
  };

  const getApplicantCountForOpp = (oppId: string) => {
    return applicants.filter((a) => a.opportunityId === oppId).length;
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        role="ADMIN"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        user={{
          name: "Praditya Haekal (PIC Panitia)",
          role: "BEM / Himpunan / Tim Riset ITS",
          initials: "PH",
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title="Buka Lowongan Oprec (Penyelenggara)"
          userName="Praditya Haekal (PIC)"
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                  <Settings className="w-5 h-5" />
                </span>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                  Buka & Kelola Lowongan Oprec Kampus ITS
                </h1>
              </div>
              <p className="text-xs md:text-sm text-slate-600 max-w-2xl">
                Buka pendaftaran panitia event (seperti <strong>GERIGI ITS x UKM Expo</strong>), pengurus <strong>HIMATEKTRO</strong>, tim riset, atau lab dengan parameter kaku layaknya Google Form yang otomatis terfilter di spreadsheet panitia.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" /> Buka Lowongan Oprec Baru
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin/applicants")}
                className="text-xs gap-1 text-slate-700 border-slate-300 hover:bg-slate-50"
              >
                <Users className="w-3.5 h-3.5 text-blue-600" /> Buka Spreadsheet Pendaftar
              </Button>
            </div>
          </div>

          {/* List of Managed Open Recruitments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                Daftar Kegiatan & Lowongan Aktif ({opportunities.length})
              </h2>
              <span className="text-xs text-slate-500">
                Pendaftar akan otomatis disaring berdasarkan kriteria yang ditentukan panitia
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunities.map((opp) => {
                const count = getApplicantCountForOpp(opp.id);
                return (
                  <Card key={opp.id} className="border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <Badge variant="outline" className="text-xs font-semibold bg-slate-100 text-slate-700">
                            {opp.category}
                          </Badge>
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs">
                            Status: {opp.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-base font-bold text-slate-900 mt-2">
                          {opp.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" /> {opp.organization.name}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-3 pt-0 text-xs">
                        {/* Divisions */}
                        {opp.divisions && opp.divisions.length > 0 && (
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 space-y-1">
                            <p className="font-bold text-slate-700">Divisi yang Dibuka:</p>
                            <p className="text-slate-600 line-clamp-2">
                              {opp.divisions.join(" • ")}
                            </p>
                          </div>
                        )}

                        {/* Hard Requirements Criteria */}
                        <div className="grid grid-cols-2 gap-2 text-slate-600">
                          <div className="p-2 rounded bg-slate-50 border border-slate-100">
                            <span className="text-[10px] text-slate-400 block">Syarat IPK:</span>
                            <span className="font-bold text-slate-800">
                              {opp.minGpa ? `Min ${opp.minGpa.toFixed(2)}` : "Bebas"}
                            </span>
                          </div>
                          <div className="p-2 rounded bg-slate-50 border border-slate-100">
                            <span className="text-[10px] text-slate-400 block">Batas Semester:</span>
                            <span className="font-bold text-slate-800">
                              Sem {opp.minSemester || 1} - {opp.maxSemester || 8}
                            </span>
                          </div>
                        </div>

                        {/* Pendaftar Count */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-600">
                          <span className="flex items-center gap-1 font-semibold text-blue-700">
                            <Users className="w-3.5 h-3.5" /> {count} Pendaftar Masuk
                          </span>
                          <span className="text-slate-400">
                            Deadline: {opp.applicationEnd}
                          </span>
                        </div>
                      </CardContent>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/opportunities?search=${encodeURIComponent(opp.title)}`)}
                        className="text-xs text-slate-600 hover:text-blue-700"
                      >
                        Lihat Tampilan Mahasiswa
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => router.push(`/admin/applicants?oppId=${opp.id}`)}
                        className="text-xs bg-slate-900 hover:bg-blue-600 text-white font-semibold gap-1"
                      >
                        Buka Spreadsheet ({count}) <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* CREATE NEW OPEN RECRUITMENT MODAL (GOOGLE FORM STYLE) */}
      {showCreateModal && (
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Buat Formulir Open Recruitment Baru (Google Form Parameter)
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600">
                Atur divisi dan kriteria filter otomatis agar pendaftar yang tidak memenuhi syarat dasar langsung terdeteksi tanpa membaca manual.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              {/* Event Title & Organizer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Nama Event / Kegiatan / Himpunan: *</label>
                  <Input
                    placeholder="Contoh: GERIGI ITS x UKM Expo 2027"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Nama Penyelenggara: *</label>
                  <Input
                    placeholder="Contoh: BEM ITS & Panitia Pusat"
                    value={formData.orgName}
                    onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Category & Quota */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Kategori Kegiatan:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="COMMITTEE">Event Akbar / Kepanitiaan</option>
                    <option value="ORGANIZATION">Himpunan Mahasiswa (HIMA) / BEM</option>
                    <option value="RESEARCH">Tim Riset / Laboratorium</option>
                    <option value="UKM">Unit Kegiatan Mahasiswa (UKM)</option>
                    <option value="SCHOLARSHIP">Program Beasiswa</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Target Kuota:</label>
                  <Input
                    type="number"
                    value={formData.quota}
                    onChange={(e) => setFormData({ ...formData, quota: parseInt(e.target.value) || 0 })}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Batas Akhir Pendaftaran:</label>
                  <Input
                    type="date"
                    value={formData.applicationEnd}
                    onChange={(e) => setFormData({ ...formData, applicationEnd: e.target.value })}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Divisions Open (Comma separated) */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  Daftar Divisi yang Dibuka (Pisahkan dengan koma): *
                </label>
                <Textarea
                  value={formData.divisionsInput}
                  onChange={(e) => setFormData({ ...formData, divisionsInput: e.target.value })}
                  rows={2}
                  placeholder="Divisi Acara, Divisi Medfo, Divisi LO & Fasilitator, Divisi Perlengkapan, Divisi Sponsorship"
                  className="text-xs"
                />
                <p className="text-[10px] text-slate-400">
                  Pendaftar akan dapat memilih divisi ini pada formulir pendaftaran.
                </p>
              </div>

              {/* Hard Criteria Parameters (Auto-Filter Engine) */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-3">
                <p className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Parameter Filter Otomatis (Auto-Filter Spreadsheet)
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-blue-950">Minimal IPK:</label>
                    <Input
                      type="number"
                      step="0.05"
                      value={formData.minGpa}
                      onChange={(e) => setFormData({ ...formData, minGpa: parseFloat(e.target.value) || 0 })}
                      className="text-xs bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-blue-950">Minimal Semester:</label>
                    <Input
                      type="number"
                      value={formData.minSemester}
                      onChange={(e) => setFormData({ ...formData, minSemester: parseInt(e.target.value) || 1 })}
                      className="text-xs bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-blue-950">Maksimal Semester:</label>
                    <Input
                      type="number"
                      value={formData.maxSemester}
                      onChange={(e) => setFormData({ ...formData, maxSemester: parseInt(e.target.value) || 8 })}
                      className="text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-blue-950">Target Jurusan / Program Studi:</label>
                  <Input
                    value={formData.allowedMajorsInput}
                    onChange={(e) => setFormData({ ...formData, allowedMajorsInput: e.target.value })}
                    placeholder="Ketik 'Terbuka untuk Seluruh Jurusan' atau pisahkan koma: S1 Teknik Elektro, S1 Teknik Mesin"
                    className="text-xs bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-blue-950">Keahlian yang Diwajibkan / Diutamakan:</label>
                  <Input
                    value={formData.requiredSkillsInput}
                    onChange={(e) => setFormData({ ...formData, requiredSkillsInput: e.target.value })}
                    placeholder="Leadership, Teamwork, Communication, Public Speaking"
                    className="text-xs bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Deskripsi Singkat & Tugas Kegiatan:</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  placeholder="Jelaskan tujuan kegiatan dan kriteria panitia yang dicari..."
                  className="text-xs"
                />
              </div>
            </div>

            <DialogFooter className="flex sm:justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)} className="text-xs">
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleCreateOpportunity}
                disabled={!formData.title || !formData.orgName}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Terbitkan Open Recruitment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

