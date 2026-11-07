"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../../../components/layout/sidebar";
import { Header } from "../../../components/layout/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Send,
  CheckCircle2,
  ExternalLink,
  Building2,
  Calendar,
  Users,
  Sparkles,
  Link as LinkIcon,
  HelpCircle,
  Clock,
  Layers,
} from "lucide-react";
import {
  PublicationRequest,
  getStoredPublicationRequests,
  submitPublicationRequest,
  getStoredOpportunities,
  OpportunityItem,
  StudentProfileData,
  getStoredProfile,
} from "../../../lib/data-store";

export default function PublicationAdminPage() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [requests, setRequests] = useState<PublicationRequest[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State Pengajuan Publikasi
  const [form, setForm] = useState({
    title: "",
    orgName: "",
    category: "COMMITTEE" as "COMMITTEE" | "ORGANIZATION" | "RESEARCH" | "LAB" | "COMPETITION" | "SCHOLARSHIP",
    description: "",
    googleFormUrl: "",
    picName: "",
    picContact: "",
    divisionsInput: "Divisi Acara, Divisi LO, Divisi Medfo, Divisi Logistik, Divisi Sponsorship",
    minGpa: 2.75,
    minSemester: 2,
    maxSemester: 6,
    requiredSkillsInput: "Teamwork, Leadership, Communication, Problem Solving",
    applicationEnd: "2026-12-20",
  });

  useEffect(() => {
    setProfile(getStoredProfile());
    setRequests(getStoredPublicationRequests());
    setOpportunities(getStoredOpportunities());

    const handlePubUpdate = () => setRequests(getStoredPublicationRequests());
    window.addEventListener("campusmatch:pub_requests_updated", handlePubUpdate);
    return () => window.removeEventListener("campusmatch:pub_requests_updated", handlePubUpdate);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.orgName || !form.googleFormUrl) {
      alert("Mohon lengkapi judul lowongan, nama organisasi, dan tautan Google Form.");
      return;
    }

    const divisions = form.divisionsInput
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    const requiredSkills = form.requiredSkillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    submitPublicationRequest({
      title: form.title,
      organizationName: form.orgName,
      category: form.category,
      description: form.description || "Rekrutmen kegiatan kampus mahasiswa ITS.",
      googleFormUrl: form.googleFormUrl.startsWith("http") ? form.googleFormUrl : `https://${form.googleFormUrl}`,
      picName: form.picName || "PIC Penyelenggara",
      picContact: form.picContact || "Kontak Penyelenggara",
      divisions: divisions.length > 0 ? divisions : ["Umum"],
      minGpa: Number(form.minGpa) || 2.75,
      minSemester: Number(form.minSemester) || 1,
      maxSemester: Number(form.maxSemester) || 8,
      requiredSkills: requiredSkills.length > 0 ? requiredSkills : ["Teamwork"],
      applicationEnd: form.applicationEnd,
    });

    setSubmitSuccess(true);
    setForm({
      title: "",
      orgName: "",
      category: "COMMITTEE",
      description: "",
      googleFormUrl: "",
      picName: "",
      picContact: "",
      divisionsInput: "Divisi Acara, Divisi LO, Divisi Medfo, Divisi Logistik",
      minGpa: 2.75,
      minSemester: 2,
      maxSemester: 6,
      requiredSkillsInput: "Teamwork, Leadership, Communication",
      applicationEnd: "2026-12-25",
    });

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 4000);
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "COMMITTEE":
        return <Badge className="bg-rose-600 hover:bg-rose-700 text-white">Kepanitiaan</Badge>;
      case "ORGANIZATION":
        return <Badge className="bg-blue-600 hover:bg-blue-700 text-white">Himpunan</Badge>;
      case "RESEARCH":
        return <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white">Tim Riset</Badge>;
      case "LAB":
        return <Badge className="bg-teal-600 hover:bg-teal-700 text-white">Laboratorium</Badge>;
      case "COMPETITION":
        return <Badge className="bg-amber-600 hover:bg-amber-700 text-white">Kompetisi</Badge>;
      case "SCHOLARSHIP":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">Beasiswa</Badge>;
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
          title="Bagikan Info Peluang & Rekrutmen"
          userName={profile?.name || "Praditya Haekal Islami Al Haqiqi"}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-5xl mx-auto w-full">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
                <Send className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                  Bagikan Info Peluang & Rekrutmen Kampus
                </h1>
                <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                  Setiap mahasiswa, panitia acara, perwakilan lab, tim riset, himpunan, maupun UKM berhak mempublikasikan informasi rekrutmen secara langsung.
                </p>
              </div>
            </div>

            {/* Konsep Layanan Banner */}
            <div className="mt-3 p-4 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" /> Konsep Sistem Publikasi Terbuka (Zero Data Privacy)
              </p>
              <p className="text-blue-800 leading-relaxed text-[11px]">
                myITS CampusMatch hanya berperan membantu mempublikasikan dan mencocokkan kualifikasi CV mahasiswa. 
                Seluruh berkas pendaftaran dan spreadsheet peserta <strong>100% masuk ke Google Form milik admin/panitia masing-masing</strong>, sehingga kerahasiaan dan privasi pendaftar tetap terjaga sepenuhnya.
              </p>
            </div>
          </div>

          {/* Alert Sukses */}
          {submitSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold animate-in fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-900">Lowongan Berhasil Dipublikasikan!</p>
                  <p className="text-[11px] text-emerald-700 font-normal mt-0.5">
                    Informasi lowongan Anda sudah langsung aktif dan muncul di katalog Opportunities.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/opportunities")}
                size="sm"
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs shrink-0 font-semibold gap-1.5 shadow-xs"
              >
                Lihat di Opportunities
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          {/* Form Pengajuan Request Publikasi */}
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Formulir Pengajuan Publikasi Lowongan Oprec
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Isi rincian kegiatan dan cantumkan tautan Google Form resmi Anda
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800">
                      Nama Organisasi / Penyelenggara <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      placeholder="Contoh: Panitia Dies Natalis ITS 67 / Lab Kontrol EE ITS"
                      value={form.orgName}
                      onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                      className="text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800">
                      Kategori Program <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={form.category}
                      onChange={(e: any) => setForm({ ...form, category: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-800 focus:outline-hidden"
                    >
                      <option value="COMMITTEE">Kepanitiaan Event</option>
                      <option value="ORGANIZATION">Himpunan Mahasiswa</option>
                      <option value="RESEARCH">Tim Riset</option>
                      <option value="LAB">Laboratorium Departemen</option>
                      <option value="COMPETITION">Kompetisi Mahasiswa</option>
                      <option value="SCHOLARSHIP">Beasiswa</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-800">
                    Judul Lowongan / Rekrutmen <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="Contoh: Open Recruitment Panitia Dies Natalis ITS ke-67"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="text-xs"
                    required
                  />
                </div>

                {/* Google Form Link - Fitur Utama */}
                <div className="space-y-1.5 p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <label className="font-bold text-amber-950 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-amber-600" />
                    Tautan Google Form Pendaftaran Resmi <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="https://forms.gle/xyz123456789 atau https://docs.google.com/forms/d/..."
                    value={form.googleFormUrl}
                    onChange={(e) => setForm({ ...form, googleFormUrl: e.target.value })}
                    className="text-xs bg-white border-amber-300 font-mono text-slate-800"
                    required
                  />
                  <p className="text-[11px] text-amber-800">
                    Mahasiswa yang membaca rincian lowongan akan langsung diarahkan ke tautan Google Form resmi ini saat menekan tombol pendaftaran.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-800">Deskripsi Singkat Lowongan</label>
                  <Textarea
                    placeholder="Jelaskan secara singkat mengenai acara, sasaran kegiatan, atau ruang lingkup pekerjaan..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-800">
                    Divisi / Formasi yang Dibuka (Pisahkan dengan koma)
                  </label>
                  <Input
                    placeholder="Acara, LO, Medfo, Logistik, Sponsorship"
                    value={form.divisionsInput}
                    onChange={(e) => setForm({ ...form, divisionsInput: e.target.value })}
                    className="text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800">IPK Minimal</label>
                    <Input
                      type="number"
                      step="0.05"
                      value={form.minGpa}
                      onChange={(e) => setForm({ ...form, minGpa: parseFloat(e.target.value) })}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800">Semester Minimal</label>
                    <Input
                      type="number"
                      value={form.minSemester}
                      onChange={(e) => setForm({ ...form, minSemester: parseInt(e.target.value) })}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800">Semester Maksimal</label>
                    <Input
                      type="number"
                      value={form.maxSemester}
                      onChange={(e) => setForm({ ...form, maxSemester: parseInt(e.target.value) })}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-800">
                    Keahlian yang Dicari (Pisahkan dengan koma)
                  </label>
                  <Input
                    placeholder="Teamwork, Leadership, Desain Grafis, C++, Arduino"
                    value={form.requiredSkillsInput}
                    onChange={(e) => setForm({ ...form, requiredSkillsInput: e.target.value })}
                    className="text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800">Nama PIC Penyelenggara</label>
                    <Input
                      placeholder="Nama Lengkap PIC"
                      value={form.picName}
                      onChange={(e) => setForm({ ...form, picName: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800">Kontak WhatsApp / Email</label>
                    <Input
                      placeholder="081234567890 / email@its.ac.id"
                      value={form.picContact}
                      onChange={(e) => setForm({ ...form, picContact: e.target.value })}
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-800">Batas Akhir Pendaftaran</label>
                    <Input
                      type="date"
                      value={form.applicationEnd}
                      onChange={(e) => setForm({ ...form, applicationEnd: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 shadow-sm gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Kirim & Terbitkan Lowongan ke Katalog
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Riwayat Lowongan yang Sedang Aktif Dipublikasikan */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Lowongan yang Sedang Aktif Dipublikasikan ({requests.length})
              </h2>
              <span className="text-[11px] text-slate-500">Terhubung langsung ke Google Form masing-masing</span>
            </div>

            <div className="space-y-3">
              {requests.map((req) => (
                <Card key={req.id} className="border-slate-200 shadow-xs bg-white">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getCategoryBadge(req.category)}
                        <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300">
                          &check; Terpublikasi di Katalog
                        </Badge>
                        <span className="text-slate-400 text-[11px]">Batas: {req.applicationEnd}</span>
                      </div>
                      <p className="font-bold text-slate-900 text-sm">{req.title}</p>
                      <p className="text-slate-500 text-[11px]">
                        Penyelenggara: <strong className="text-slate-700">{req.organizationName}</strong> &bull; PIC: {req.picName} ({req.picContact})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(req.googleFormUrl, "_blank")}
                        className="text-xs gap-1.5 text-blue-700 border-blue-200 hover:bg-blue-50"
                      >
                        Uji Link Google Form
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
