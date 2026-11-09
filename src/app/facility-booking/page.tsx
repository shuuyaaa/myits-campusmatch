"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Sidebar } from "../../components/layout/sidebar";
import { Header } from "../../components/layout/header";
import { MobileNav } from "../../components/layout/mobile-nav";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Building2,
  CalendarCheck,
  MapPin,
  Clock,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Users,
  Wifi,
  Zap,
  Coffee,
  Volume2,
  ShieldAlert,
  FileText,
  ExternalLink,
  ChevronRight,
  Info,
  Sparkles,
  Trophy,
  ScanLine,
  Trash2,
  Eye,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

interface CCWSLocation {
  id: string;
  name: string;
  tagline: string;
  campusArea: string;
  description: string;
  capacity: string;
  facilities: string[];
}

const CCWS_LOCATIONS: CCWSLocation[] = [
  {
    id: "loc-perpustakaan",
    name: "CCWS Gedung Perpustakaan Pusat Lantai 2",
    tagline: "Suasana Tenang, Fokus Belajar Mandiri",
    campusArea: "Kampus ITS Sukolilo - Gedung Perpustakaan",
    description: "Ruang belajar modern dengan pendingin ruangan prima, pencahayaan alami optimal, dan soket listrik mandiri di setiap kursi.",
    capacity: "60 Kursi",
    facilities: ["High-speed Eduroam", "Stopkontak Tiap Meja", "AC Dingin", "Dekat Musholla", "Water Station"],
  },
  {
    id: "loc-scc",
    name: "CCWS Menara Sains / SCC (Student Community Center)",
    tagline: "Kolaboratif, Diskusi Ormawa",
    campusArea: "Gedung Student Community Center (SCC) ITS",
    description: "Hub diskusi aktif untuk tim lomba, kepanitiaan ormawa, dan riset lintas departemen dengan fasilitas whiteboard interaktif.",
    capacity: "40 Kursi",
    facilities: ["Whiteboard Interaktif", "Meja Diskusi Bundar", "Vending Machine", "Area Diskusi Terbuka"],
  },
  {
    id: "loc-fteic",
    name: "CCWS Gedung FTEIC Elektro",
    tagline: "Ruang Belajar Khusus Mahasiswa Teknik",
    campusArea: "Gedung B FTEIC Departemen Teknik Elektro ITS",
    description: "Fasilitas intensif riset komputasi, telekomunikasi, dan perancangan hardware IoT dengan meja kerja lebar dan monitor eksternal.",
    capacity: "30 Kursi",
    facilities: ["Monitor Eksternal HDMI", "Dekat Lab Telekomunikasi", "Akses Riset", "Area Prototipe Hardware"],
  },
];

const TIME_SESSIONS = [
  { id: "s1", label: "Sesi 1", time: "08:00 - 11:00 WIB" },
  { id: "s2", label: "Sesi 2", time: "11:00 - 14:00 WIB" },
  { id: "s3", label: "Sesi 3", time: "14:00 - 17:00 WIB" },
  { id: "s4", label: "Sesi 4", time: "17:00 - 20:00 WIB" },
];

interface SeatData {
  id: string;
  code: string;
  type: "INDIVIDUAL" | "POD";
  row: "A" | "B" | "C";
  name: string;
  capacityText: string;
}

const SEATS_LAYOUT: SeatData[] = [
  // Meja A1–A6 (Individu)
  { id: "A1", code: "A1", type: "INDIVIDUAL", row: "A", name: "Meja A1 (Individu)", capacityText: "1 Orang" },
  { id: "A2", code: "A2", type: "INDIVIDUAL", row: "A", name: "Meja A2 (Individu)", capacityText: "1 Orang" },
  { id: "A3", code: "A3", type: "INDIVIDUAL", row: "A", name: "Meja A3 (Individu)", capacityText: "1 Orang" },
  { id: "A4", code: "A4", type: "INDIVIDUAL", row: "A", name: "Meja A4 (Individu)", capacityText: "1 Orang" },
  { id: "A5", code: "A5", type: "INDIVIDUAL", row: "A", name: "Meja A5 (Individu)", capacityText: "1 Orang" },
  { id: "A6", code: "A6", type: "INDIVIDUAL", row: "A", name: "Meja A6 (Individu)", capacityText: "1 Orang" },
  // Meja B1–B6 (Individu)
  { id: "B1", code: "B1", type: "INDIVIDUAL", row: "B", name: "Meja B1 (Individu)", capacityText: "1 Orang" },
  { id: "B2", code: "B2", type: "INDIVIDUAL", row: "B", name: "Meja B2 (Individu)", capacityText: "1 Orang" },
  { id: "B3", code: "B3", type: "INDIVIDUAL", row: "B", name: "Meja B3 (Individu)", capacityText: "1 Orang" },
  { id: "B4", code: "B4", type: "INDIVIDUAL", row: "B", name: "Meja B4 (Individu)", capacityText: "1 Orang" },
  { id: "B5", code: "B5", type: "INDIVIDUAL", row: "B", name: "Meja B5 (Individu)", capacityText: "1 Orang" },
  { id: "B6", code: "B6", type: "INDIVIDUAL", row: "B", name: "Meja B6 (Individu)", capacityText: "1 Orang" },
  // Pod Diskusi C1–C2 (Kelompok 4 orang)
  { id: "C1", code: "C1", type: "POD", row: "C", name: "Pod Diskusi C1", capacityText: "Kelompok 4 Orang" },
  { id: "C2", code: "C2", type: "POD", row: "C", name: "Pod Diskusi C2", capacityText: "Kelompok 4 Orang" },
];

const OCCUPIED_SEATS_MAP: Record<string, string[]> = {
  s1: ["A2", "B4", "C1"],
  s2: ["A1", "A4", "B2", "B5"],
  s3: ["A3", "B1", "B3", "C2"],
  s4: ["A5", "A6", "B6"],
};

interface SportFacility {
  id: string;
  name: string;
  location: string;
  type: string;
  operatingHours: string;
  statusBadge: string;
  dailyQuota: string;
  permitRequirement: string;
  isAvailableToday: boolean;
  specs: string[];
}

const SPORTS_FACILITIES: SportFacility[] = [
  {
    id: "futsal-indoor",
    name: "Lapangan Futsal Indoor ITS",
    location: "Kompleks Olahraga Mahasiswa Sukolilo",
    type: "Indoor Court",
    operatingHours: "07:00 - 22:00 WIB",
    statusBadge: "Tersedia Hari Ini",
    dailyQuota: "Maksimal 2 Sesi / Ormawa / Hari",
    permitRequirement: "Surat Izin DKA & Formulir Sarpras",
    isAvailableToday: true,
    specs: ["2 Lapangan Standar Nasional", "Lantai Interlock Anti-Slip", "Lampu Sorot LED Turnamen", "Tribun Penonton"],
  },
  {
    id: "basket-plaza",
    name: "Lapangan Basket Plaza Dr. Angka",
    location: "Plaza Gedung Pusat Rektorat ITS",
    type: "Outdoor Court",
    operatingHours: "06:00 - 21:00 WIB",
    statusBadge: "Tersedia Hari Ini",
    dailyQuota: "Maksimal 3 Jam / Kegiatan",
    permitRequirement: "Disposisi BEM / DKA",
    isAvailableToday: true,
    specs: ["Standar Perbasi Outdoor", "Ring Basket Hidrolik", "Papan Skor Digital", "Penerangan Lapangan"],
  },
  {
    id: "tenis-utama",
    name: "Lapangan Tenis Utama",
    location: "Samping Asrama Mahasiswa Sukolilo",
    type: "Outdoor Hardcourt",
    operatingHours: "06:00 - 18:00 WIB",
    statusBadge: "Latihan UKM (15:00 - 18:00)",
    dailyQuota: "Slot Terbatas 4 Jam",
    permitRequirement: "Pendaftaran Akun SIMPEL Sarpras",
    isAvailableToday: true,
    specs: ["4 Court Hardcourt Cat Sintetis", "Jaring Net Standar Pelti", "Kursi Wasit Resmi", "Kamar Ganti"],
  },
  {
    id: "stadion-its",
    name: "Stadion Sepakbola ITS",
    location: "Kompleks Olahraga Sukolilo",
    type: "Outdoor Stadium",
    operatingHours: "06:00 - 18:00 WIB",
    statusBadge: "Perawatan Rumput Berkala",
    dailyQuota: "Khusus Kegiatan Resmi / Turnamen",
    permitRequirement: "Surat Pengantar Dekanat & DKA",
    isAvailableToday: false,
    specs: ["Lapangan Rumput Ukuran FIFA", "Lintasan Lari Sintetis 400m", "Tribun 3.000 Kursi", "Sound System"],
  },
];

interface ActiveBookingData {
  code: string;
  seat: string;
  location: string;
  session: string;
  date: string;
  name: string;
  nrp: string;
  dept: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
}

export default function FacilityBookingPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [mainTab, setMainTab] = useState<"CCWS" | "SPORTS">("CCWS");

  // CCWS Booking state
  const [selectedLocationId, setSelectedLocationId] = useState<string>("loc-perpustakaan");
  const [selectedDate, setSelectedDate] = useState<string>("2026-03-16");
  const [selectedSessionId, setSelectedSessionId] = useState<string>("s2");
  const [selectedSeatId, setSelectedSeatId] = useState<string>("A6");

  // Active Confirmed Booking for this user
  const [activeBooking, setActiveBooking] = useState<ActiveBookingData | null>(null);

  // E-Ticket modal state
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketBookingCode, setTicketBookingCode] = useState("ITS-CCWS-2026-X94B");

  // Sports Permit guide modal state
  const [permitModalOpen, setPermitModalOpen] = useState(false);
  const [selectedSportFacility, setSelectedSportFacility] = useState<SportFacility | null>(null);

  // Host origin for live scanning
  const [clientOrigin, setClientOrigin] = useState("http://localhost:3000");

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load active booking on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setClientOrigin(window.location.origin);
    }

    const loadActive = () => {
      try {
        const raw = localStorage.getItem("myits_active_ccws_booking");
        if (raw) {
          const parsed = JSON.parse(raw);
          setActiveBooking(parsed);
          setTicketBookingCode(parsed.code);
          setSelectedSeatId(parsed.seat);
        } else {
          // Default initial confirmed booking showing integration
          const initialData: ActiveBookingData = {
            code: "ITS-CCWS-2026-X94B",
            seat: "A6",
            location: "CCWS Gedung Perpustakaan Pusat Lantai 2",
            session: "11:00 - 14:00 WIB",
            date: "16 Maret 2026",
            name: "Praditya Haekal Islami Al Haqiqi",
            nrp: "5009221000",
            dept: "S1 Teknik Elektro (FTEIC)",
            isCheckedIn: false,
          };
          setActiveBooking(initialData);
          localStorage.setItem("myits_active_ccws_booking", JSON.stringify(initialData));
        }
      } catch (e) {
        // ignore
      }
    };

    loadActive();
    window.addEventListener("campusmatch:ccws_booking_updated", loadActive);
    return () => window.removeEventListener("campusmatch:ccws_booking_updated", loadActive);
  }, []);

  const selectedLocation = useMemo(() => {
    return CCWS_LOCATIONS.find((l) => l.id === selectedLocationId) || CCWS_LOCATIONS[0];
  }, [selectedLocationId]);

  const selectedSession = useMemo(() => {
    return TIME_SESSIONS.find((s) => s.id === selectedSessionId) || TIME_SESSIONS[1];
  }, [selectedSessionId]);

  const occupiedSeats = useMemo(() => {
    return OCCUPIED_SEATS_MAP[selectedSessionId] || [];
  }, [selectedSessionId]);

  const selectedSeatObj = useMemo(() => {
    return SEATS_LAYOUT.find((s) => s.id === selectedSeatId);
  }, [selectedSeatId]);

  const handleSeatClick = (seat: SeatData) => {
    if (occupiedSeats.includes(seat.id) && (!activeBooking || activeBooking.seat !== seat.id)) {
      showToast(`Kursi ${seat.code} (${seat.name}) telah terisi oleh mahasiswa lain pada sesi ini.`);
      return;
    }
    setSelectedSeatId(seat.id);
  };

  const handleConfirmBooking = () => {
    if (!selectedSeatId) {
      showToast("Pilih kursi yang tersedia pada denah terlebih dahulu.");
      return;
    }

    const newCode = `ITS-CCWS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setTicketBookingCode(newCode);

    const bookingPayload: ActiveBookingData = {
      code: newCode,
      seat: selectedSeatId,
      location: selectedLocation.name,
      session: selectedSession.time,
      date: selectedDate,
      name: "Praditya Haekal Islami Al Haqiqi",
      nrp: "5009221000",
      dept: "S1 Teknik Elektro (FTEIC)",
      isCheckedIn: false,
    };

    setActiveBooking(bookingPayload);
    try {
      localStorage.setItem("myits_active_ccws_booking", JSON.stringify(bookingPayload));
    } catch (e) {}

    setTicketModalOpen(true);
    showToast(`Reservasi berhasil! Kursi ${selectedSeatId} telah terhubung dengan akun myITS Anda.`);
  };

  const handleCancelBooking = () => {
    setActiveBooking(null);
    try {
      localStorage.removeItem("myits_active_ccws_booking");
    } catch (e) {}
    showToast("Reservasi CCWS aktif Anda telah dibatalkan.");
  };

  // URL yang akan dibuka ketika QR di-scan
  const scanPassUrl = `/ccws-pass?code=${encodeURIComponent(ticketBookingCode)}&seat=${encodeURIComponent(selectedSeatObj?.name || selectedSeatId)}&loc=${encodeURIComponent(selectedLocation.name)}&time=${encodeURIComponent(selectedSession.time)}&date=${encodeURIComponent(selectedDate)}&name=${encodeURIComponent("Praditya Haekal Islami Al Haqiqi")}&nrp=5009221000&dept=${encodeURIComponent("S1 Teknik Elektro (FTEIC)")}`;
  const fullScanQrUrl = `${clientOrigin}${scanPassUrl}`;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        role="STUDENT"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        user={{
          name: "Praditya Haekal Islami Al Haqiqi",
          role: "Departemen Teknik Elektro",
          initials: "PH",
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title="Reservasi CCWS & Fasilitas Kampus ITS"
          userName="Praditya Haekal Islami Al Haqiqi"
          showSearch={false}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-8 space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-20 right-4 z-50 max-w-md bg-blue-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-blue-700 animate-in fade-in slide-in-from-top-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-xs md:text-sm font-medium">{toastMessage}</p>
            </div>
          )}

          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-[#013880] to-[#0D47A1] rounded-2xl p-5 md:p-7 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white hover:bg-white/30 border-none text-[11px] font-semibold px-2.5 py-0.5">
                  Case 1: Smarter Campus and Learning
                </Badge>
                <span className="text-xs text-blue-200">myITS Smart Facility Hub</span>
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight">
                Sistem Reservasi Fasilitas Kampus & Denah Kursi CCWS
              </h1>
              <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
                Pilih tata letak kursi belajar interaktif di 3 lokasi resmi CCWS ITS dan kelola izin peminjaman sarana olahraga kampus Sukolilo secara terintegrasi.
              </p>
            </div>
          </div>

          {/* ACTIVE BOOKING NOTIFICATION CARD (Menyatakan bahwa akun Anda sudah booking sesuatu) */}
          {activeBooking && (
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#013880] text-white p-4 md:p-5 rounded-2xl shadow-md border-2 border-blue-400/30 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-emerald-400">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider">
                      AKUN ANDA SUDAH MEMILIKI BOOKING AKTIF
                    </Badge>
                    {activeBooking.isCheckedIn ? (
                      <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Check-in Terverifikasi ({activeBooking.checkedInAt})
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-300 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Siap Check-in di Gerbang Meja
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-white">
                    Kursi {activeBooking.seat} — {activeBooking.location}
                  </h3>
                  <p className="text-xs text-blue-100 flex items-center gap-3 flex-wrap">
                    <span>Sesi: <strong>{activeBooking.session}</strong></span>
                    <span>•</span>
                    <span>Tanggal: <strong>{activeBooking.date}</strong></span>
                    <span>•</span>
                    <span className="font-mono text-emerald-300">Kode: {activeBooking.code}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedSeatId(activeBooking.seat);
                    setTicketBookingCode(activeBooking.code);
                    setTicketModalOpen(true);
                  }}
                  className="bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs gap-1.5 rounded-xl h-10 px-3.5 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Lihat E-Ticket QR
                </Button>

                <Link href={scanPassUrl}>
                  <Button
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs gap-1.5 rounded-xl h-10 px-3.5 shadow-md shadow-emerald-500/20"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    Uji Hasil Scan Gerbang
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelBooking}
                  className="text-red-200 hover:text-white hover:bg-red-500/20 text-xs h-10 px-2 rounded-xl"
                  title="Batalkan Booking Ini"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-2">
            <button
              onClick={() => setMainTab("CCWS")}
              className={`pb-3 px-4 text-xs md:text-sm font-bold transition-all flex items-center gap-2 border-b-2 min-h-[44px] ${
                mainTab === "CCWS"
                  ? "border-[#013880] text-[#013880]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Co-Working Space (CCWS ITS)
            </button>
            <button
              onClick={() => setMainTab("SPORTS")}
              className={`pb-3 px-4 text-xs md:text-sm font-bold transition-all flex items-center gap-2 border-b-2 min-h-[44px] ${
                mainTab === "SPORTS"
                  ? "border-[#013880] text-[#013880]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Trophy className="w-4 h-4" />
              Fasilitas Olahraga & Gedung
            </button>
          </div>

          {/* TAB 1: CO-WORKING SPACE (CCWS) */}
          {mainTab === "CCWS" && (
            <div className="space-y-6">
              {/* Selector 3 Lokasi CCWS Resmi ITS */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  1. Pilih Lokasi CCWS Resmi ITS:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {CCWS_LOCATIONS.map((loc) => {
                    const isSelected = selectedLocationId === loc.id;
                    return (
                      <div
                        key={loc.id}
                        onClick={() => {
                          setSelectedLocationId(loc.id);
                        }}
                        className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 min-h-[44px] ${
                          isSelected
                            ? "bg-blue-50/80 border-[#013880] shadow-xs ring-2 ring-[#013880]/30"
                            : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <h3 className={`font-bold text-xs md:text-sm ${isSelected ? "text-[#013880]" : "text-slate-900"}`}>
                              {loc.name}
                            </h3>
                            <Badge variant="secondary" className="text-[10px] font-semibold text-[#013880] bg-[#013880]/10 border border-[#013880]/20">
                              {loc.tagline}
                            </Badge>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-[#013880] shrink-0" />
                          )}
                        </div>

                        <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">
                          {loc.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-slate-100">
                          {loc.facilities.slice(0, 3).map((f) => (
                            <span key={f} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Date Picker & Slot Waktu */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-[#013880]" />
                      2. Tanggal & Pilihan Sesi Waktu
                    </h2>
                    <p className="text-xs text-slate-500">
                      Pilih sesi reservasi 3 jam per booking mahasiswa.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700">Tanggal:</span>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#013880] font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {TIME_SESSIONS.map((sess) => {
                    const isSelected = selectedSessionId === sess.id;
                    return (
                      <button
                        key={sess.id}
                        onClick={() => {
                          setSelectedSessionId(sess.id);
                          if (OCCUPIED_SEATS_MAP[sess.id]?.includes(selectedSeatId) && (!activeBooking || activeBooking.seat !== selectedSeatId)) {
                            setSelectedSeatId("");
                          }
                        }}
                        className={`p-3 rounded-xl border text-left transition-all min-h-[44px] ${
                          isSelected
                            ? "bg-[#013880] text-white border-[#013880] shadow-xs ring-2 ring-[#013880]/30"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <p className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-900"}`}>
                          {sess.label}
                        </p>
                        <p className={`text-[11px] mt-0.5 ${isSelected ? "text-blue-100 font-medium" : "text-slate-500"}`}>
                          {sess.time}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Denah Visual Kursi & Panel Ringkasan Booking */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Denah Visual Kursi & Meja (Interactive Seat Layout Grid) */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-slate-900">
                        Denah Visual Kursi & Meja — {selectedLocation.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Klik nomor kursi untuk memilih posisi meja Anda secara real-time.
                      </p>
                    </div>

                    {/* Legenda & Status Warna */}
                    <div className="flex items-center gap-3 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600 shadow-2xs" />
                        <span className="text-slate-700 text-[11px] font-semibold">Tersedia</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded bg-[#013880] ring-2 ring-[#013880]/30" />
                        <span className="text-slate-700 text-[11px] font-semibold">Dipilih</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded bg-indigo-700 text-white font-bold flex items-center justify-center text-[9px]">★</div>
                        <span className="text-slate-700 text-[11px] font-semibold">Milik Anda</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded bg-rose-500 border border-rose-600 opacity-80" />
                        <span className="text-slate-700 text-[11px] font-semibold">Terisi</span>
                      </div>
                    </div>
                  </div>

                  {/* Header Stage Indicator */}
                  <div className="w-full py-2 bg-slate-100 rounded-lg text-center text-[11px] font-bold text-slate-500 border border-dashed border-slate-300 tracking-wider">
                    DEPAN: AREA PINTU MASUK, MONITOR INFORMASI & WHITEBOARD
                  </div>

                  {/* Wrapper horizontal scroll agar aman di mobile smartphone tanpa patah */}
                  <div className="overflow-x-auto pb-2 scrollbar-thin">
                    <div className="min-w-[500px] space-y-5 pt-2">
                      {/* Baris A: Meja A1–A6 (Individu) */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Volume2 className="w-3.5 h-3.5 text-[#013880]" />
                            Meja A1–A6 (Individu) — Zona Hening / Focus Work
                          </span>
                          <span className="text-[10px] text-slate-400">Power Socket + Lampu Meja</span>
                        </div>
                        <div className="grid grid-cols-6 gap-2.5">
                          {SEATS_LAYOUT.filter((s) => s.row === "A").map((seat) => {
                            const isMyBooking = activeBooking && activeBooking.seat === seat.id;
                            const isOccupied = occupiedSeats.includes(seat.id) && !isMyBooking;
                            const isSelected = selectedSeatId === seat.id;
                            return (
                              <button
                                key={seat.id}
                                disabled={isOccupied}
                                onClick={() => handleSeatClick(seat)}
                                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center transition-all min-h-[44px] ${
                                  isMyBooking
                                    ? "bg-gradient-to-br from-[#013880] to-[#0D47A1] text-white border-[#013880] shadow-md ring-4 ring-[#013880]/20 scale-105"
                                    : isSelected
                                    ? "bg-[#013880] text-white border-[#013880] shadow-md ring-4 ring-[#013880]/20 scale-105"
                                    : isOccupied
                                    ? "bg-rose-50 text-rose-500 border-rose-300 cursor-not-allowed opacity-80"
                                    : "bg-emerald-50 text-emerald-800 border-emerald-400 hover:bg-emerald-100 shadow-2xs"
                                }`}
                              >
                                <span className="text-xs font-extrabold flex items-center gap-1">
                                  {isMyBooking && <span>★</span>}
                                  {seat.code}
                                </span>
                                <span className="text-[9px] mt-0.5 font-bold uppercase truncate max-w-full">
                                  {isMyBooking ? "Milik Anda" : isOccupied ? "Terisi" : isSelected ? "Dipilih" : "Tersedia"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Baris B: Meja B1–B6 (Individu) */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#013880]" />
                            Meja B1–B6 (Individu) — Zona Belajar Fleksibel
                          </span>
                          <span className="text-[10px] text-slate-400">High-Speed Eduroam Connection</span>
                        </div>
                        <div className="grid grid-cols-6 gap-2.5">
                          {SEATS_LAYOUT.filter((s) => s.row === "B").map((seat) => {
                            const isMyBooking = activeBooking && activeBooking.seat === seat.id;
                            const isOccupied = occupiedSeats.includes(seat.id) && !isMyBooking;
                            const isSelected = selectedSeatId === seat.id;
                            return (
                              <button
                                key={seat.id}
                                disabled={isOccupied}
                                onClick={() => handleSeatClick(seat)}
                                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center transition-all min-h-[44px] ${
                                  isMyBooking
                                    ? "bg-gradient-to-br from-[#013880] to-[#0D47A1] text-white border-[#013880] shadow-md ring-4 ring-[#013880]/20 scale-105"
                                    : isSelected
                                    ? "bg-[#013880] text-white border-[#013880] shadow-md ring-4 ring-[#013880]/20 scale-105"
                                    : isOccupied
                                    ? "bg-rose-50 text-rose-500 border-rose-300 cursor-not-allowed opacity-80"
                                    : "bg-emerald-50 text-emerald-800 border-emerald-400 hover:bg-emerald-100 shadow-2xs"
                                }`}
                              >
                                <span className="text-xs font-extrabold flex items-center gap-1">
                                  {isMyBooking && <span>★</span>}
                                  {seat.code}
                                </span>
                                <span className="text-[9px] mt-0.5 font-bold uppercase truncate max-w-full">
                                  {isMyBooking ? "Milik Anda" : isOccupied ? "Terisi" : isSelected ? "Dipilih" : "Tersedia"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Baris C: Pod Diskusi C1–C2 (Kelompok 4 orang) */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-[#013880]" />
                            Pod Diskusi C1–C2 (Kelompok 4 Orang) — Kedap Suara
                          </span>
                          <span className="text-[10px] text-slate-400">Akustik Khusus + Monitor</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {SEATS_LAYOUT.filter((s) => s.row === "C").map((seat) => {
                            const isMyBooking = activeBooking && activeBooking.seat === seat.id;
                            const isOccupied = occupiedSeats.includes(seat.id) && !isMyBooking;
                            const isSelected = selectedSeatId === seat.id;
                            return (
                              <button
                                key={seat.id}
                                disabled={isOccupied}
                                onClick={() => handleSeatClick(seat)}
                                className={`p-4 rounded-xl border flex items-center justify-between transition-all min-h-[44px] ${
                                  isMyBooking
                                    ? "bg-gradient-to-br from-[#013880] to-[#0D47A1] text-white border-[#013880] shadow-md ring-4 ring-[#013880]/20"
                                    : isSelected
                                    ? "bg-[#013880] text-white border-[#013880] shadow-md ring-4 ring-[#013880]/20"
                                    : isOccupied
                                    ? "bg-rose-50 text-rose-500 border-rose-300 cursor-not-allowed opacity-80"
                                    : "bg-emerald-50 text-emerald-800 border-emerald-400 hover:bg-emerald-100 shadow-2xs"
                                }`}
                              >
                                <div className="text-left">
                                  <span className="text-xs font-extrabold block">{seat.name}</span>
                                  <span className="text-[10px] opacity-80">{seat.capacityText}</span>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/10 uppercase">
                                  {isMyBooking ? "Milik Anda" : isOccupied ? "Terisi" : isSelected ? "Dipilih" : "Tersedia"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel Ringkasan Booking di Samping */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-sm md:text-base text-slate-900">
                        Ringkasan Booking CCWS
                      </h3>
                      <p className="text-xs text-slate-500">
                        Status seleksi terhubung otomatis ke akun myITS Anda
                      </p>
                    </div>

                    <div className="space-y-3 text-xs text-slate-700">
                      <div>
                        <span className="text-[11px] text-slate-500 block">Nama Lokasi:</span>
                        <strong className="text-[#013880] text-xs font-bold leading-tight block mt-0.5">
                          {selectedLocation.name}
                        </strong>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Tanggal:</span>
                        <strong className="text-slate-800 font-bold">{selectedDate}</strong>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Jam Sesi:</span>
                        <strong className="text-slate-800 font-bold">{selectedSession.time}</strong>
                      </div>

                      <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200/80 flex justify-between items-center">
                        <div>
                          <span className="text-[11px] text-[#013880] font-semibold block">Nomor Kursi yang Dipilih:</span>
                          <span className="text-xs text-slate-700">{selectedSeatObj?.name || "Belum dipilih"}</span>
                        </div>
                        <strong className="text-[#013880] font-black text-lg">
                          {selectedSeatId || "-"}
                        </strong>
                      </div>

                      <div className="pt-1 text-[11px] text-slate-600 space-y-1">
                        <p><strong>Peminjam:</strong> Praditya Haekal Islami Al Haqiqi</p>
                        <p><strong>NRP:</strong> 5009221000 (S1 Teknik Elektro)</p>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-800 space-y-1">
                      <p className="font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Ketentuan Check-In
                      </p>
                      <p className="leading-relaxed">
                        Wajib check-in maksimal 15 menit sebelum atau sesudah sesi dimulai melalui scan QR di meja reservasi.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleConfirmBooking}
                    className="w-full bg-gradient-to-r from-[#013880] to-[#0D47A1] hover:from-[#012d66] hover:to-[#09357a] text-white font-bold text-xs py-3 rounded-xl shadow-md gap-1.5 min-h-[44px]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Konfirmasi Booking Sekarang
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FASILITAS OLAHRAGA (SPORTS HUB) */}
          {mainTab === "SPORTS" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm md:text-base font-bold text-slate-900">
                    Pusat Informasi & Perizinan Fasilitas Olahraga ITS (Sports Hub)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Jadwal ketersediaan harian, kuota ormawa, dan panduan perizinan resmi ke Sarana Prasarana (Sarpras) Kampus ITS.
                  </p>
                </div>

                <Button
                  onClick={() => window.open("https://sarpras.its.ac.id", "_blank")}
                  className="bg-gradient-to-r from-[#013880] to-[#0D47A1] hover:from-[#012d66] hover:to-[#09357a] text-white font-semibold text-xs gap-1.5 rounded-lg shrink-0 min-h-[44px]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ajukan Izin via Portal Sarpras ITS
                </Button>
              </div>

              {/* Panduan Peminjaman Resmi 3 Langkah */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-5 shadow-xs space-y-3">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-300" />
                  Alur Panduan Peminjaman Resmi 3 Langkah (SOP Sarpras ITS)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                  <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">Langkah 1</span>
                    <h5 className="font-bold text-white">Pengajuan Proposal</h5>
                    <p className="text-[11px] text-blue-100 leading-relaxed">
                      Siapkan proposal kegiatan himpunan/UKM yang ditandatangani Pembina Ormawa untuk diajukan ke DKA.
                    </p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">Langkah 2</span>
                    <h5 className="font-bold text-white">Disposisi BEM / Ditmawa</h5>
                    <p className="text-[11px] text-blue-100 leading-relaxed">
                      Verifikasi berkas persetujuan dari Direktorat Kemahasiswaan & registrasi jadwal pada portal SIMPEL Sarpras ITS.
                    </p>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">Langkah 3</span>
                    <h5 className="font-bold text-white">Kode Masuk Lapangan</h5>
                    <p className="text-[11px] text-blue-100 leading-relaxed">
                      Dapatkan kode approval digital untuk ditunjukkan ke petugas pos lapangan saat penggunaan sarana.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid 4 Fasilitas Olahraga */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SPORTS_FACILITIES.map((facility) => (
                  <Card
                    key={facility.id}
                    className="border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <CardHeader className="p-4 md:p-5 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Badge
                            className={`text-[10px] font-semibold mb-1.5 ${
                              facility.isAvailableToday
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : "bg-amber-100 text-amber-800 border-amber-200"
                            }`}
                          >
                            {facility.statusBadge}
                          </Badge>
                          <h3 className="font-bold text-slate-900 text-base leading-snug">
                            {facility.name}
                          </h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {facility.location}
                          </p>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {facility.type}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 md:p-5 pt-0 space-y-3.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#013880]" />
                          <span>Jam Operasional: <strong>{facility.operatingHours}</strong></span>
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-700 space-y-1">
                          <p><strong>Kuota Penggunaan Harian:</strong> {facility.dailyQuota}</p>
                          <p><strong>Syarat Perizinan:</strong> {facility.permitRequirement}</p>
                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-slate-700 mb-1">Fasilitas & Lapangan:</p>
                          <ul className="text-xs text-slate-600 space-y-0.5 list-disc list-inside">
                            {facility.specs.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedSportFacility(facility);
                            setPermitModalOpen(true);
                          }}
                          className="flex-1 text-xs font-semibold gap-1.5 min-h-[44px]"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#013880]" />
                          Alur Perizinan
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            window.open("https://sarpras.its.ac.id", "_blank");
                          }}
                          className="flex-1 bg-gradient-to-r from-[#013880] to-[#0D47A1] hover:from-[#012d66] hover:to-[#09357a] text-white text-xs font-semibold gap-1.5 min-h-[44px]"
                        >
                          Ajukan Jadwal
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <MobileNav />

      {/* MODAL E-TICKET CCWS DIGITAL DENGAN SCANNABLE QR CODE & DIRECT GATE TEST */}
      <Dialog open={ticketModalOpen} onOpenChange={setTicketModalOpen}>
        <DialogContent className="max-w-md w-[92vw] sm:w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#013880]" />
              E-Ticket Reservasi CCWS ITS
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Pindai QR Code di bawah dengan kamera smartphone untuk check-in gerbang secara langsung.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Ticket Card Visual */}
            <div className="bg-gradient-to-br from-[#013880] to-[#0D47A1] text-white p-5 rounded-2xl shadow-md space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-blue-200">
                    Tiket Akses CCWS myITS
                  </span>
                  <h4 className="text-sm font-extrabold text-white mt-0.5">
                    {selectedLocation.name}
                  </h4>
                </div>
                <Badge className="bg-emerald-500 text-white text-[10px] font-bold">
                  TERKONFIRMASI
                </Badge>
              </div>

              {/* REAL SCANNABLE QR CODE IMAGE (Loads genuine barcode from api.qrserver.com, opens /ccws-pass when scanned by smartphone camera) */}
              <div className="bg-white p-3.5 rounded-xl flex flex-col items-center justify-center my-2 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(fullScanQrUrl)}`}
                  alt="Scannable QR Code myITS CCWS"
                  className="w-36 h-36 object-contain rounded-md"
                  onError={(e) => {
                    // Fallback if offline
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="text-[9px] text-slate-400 font-mono mt-1 text-center">
                  Dapat Dipindai Kamera Android / iOS
                </span>
              </div>

              {/* Tombol Langsung Uji Hasil Scan (Live Gate Simulator) */}
              <div className="pt-1">
                <Link href={scanPassUrl} onClick={() => setTicketModalOpen(false)}>
                  <Button
                    type="button"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs h-10 rounded-xl shadow-md gap-2"
                  >
                    <ScanLine className="w-4 h-4" />
                    📱 Buka Hasil Scan Gerbang / Simulasi Check-In
                  </Button>
                </Link>
              </div>

              {/* Kode Reservasi */}
              <div className="text-center font-mono text-xs font-bold text-blue-200 pt-1">
                Kode Reservasi: <span className="text-white tracking-widest font-black">{ticketBookingCode}</span>
              </div>

              {/* Rincian Identitas Peminjam */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-white/20">
                <div>
                  <span className="text-blue-200 block text-[10px]">IDENTITAS PEMINJAM</span>
                  <span className="font-bold">Praditya Haekal</span>
                  <span className="text-[10px] text-blue-200 block">5009221000 (Elektro)</span>
                </div>
                <div className="text-right">
                  <span className="text-blue-200 block text-[10px]">KURSI & WAKTU</span>
                  <span className="font-black text-white text-xs">{selectedSeatId}</span>
                  <span className="text-[10px] text-blue-200 block">{selectedSession.time}</span>
                </div>
              </div>
            </div>

            {/* Batas waktu check-in (15 menit sebelum sesi dimulai) */}
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" /> Batas Waktu Check-In:
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Harap hadir dan lakukan pemindaian barcode check-in meja paling lambat <strong>15 menit sebelum sesi dimulai</strong>. Reservasi yang tidak dicheck-in otomatis dibatalkan.
              </p>
            </div>

            <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTicketModalOpen(false)}
                className="flex-1 text-xs min-h-[44px]"
              >
                Tutup
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  showToast("E-Ticket berhasil disimpan ke perangkat Anda.");
                  setTicketModalOpen(false);
                }}
                className="flex-1 bg-gradient-to-r from-[#013880] to-[#0D47A1] hover:from-[#012d66] hover:to-[#09357a] text-white text-xs font-semibold gap-1.5 min-h-[44px]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Simpan E-Ticket
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL PANDUAN IZIN SARPRAS OLAHRAGA */}
      <Dialog open={permitModalOpen} onOpenChange={setPermitModalOpen}>
        <DialogContent className="max-w-md w-[92vw] sm:w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#013880]" />
              Alur Panduan Peminjaman Resmi 3 Langkah
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Prosedur perizinan sarana olahraga dan gedung resmi kampus ITS Sukolilo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            {selectedSportFacility && (
              <div className="bg-blue-50/70 p-2.5 rounded-lg border border-blue-200/70 text-[#013880] font-semibold text-xs">
                Fasilitas: {selectedSportFacility.name} ({selectedSportFacility.location})
              </div>
            )}

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#013880] text-white font-bold flex items-center justify-center text-xs shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Pengajuan Proposal</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                    Buat surat permohonan peminjaman yang ditandatangani oleh Ketua Himpunan / UKM dan diketahui Pembina ke Direktorat Kemahasiswaan (DKA).
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#013880] text-white font-bold flex items-center justify-center text-xs shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Disposisi BEM / Ditmawa</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                    Unggah surat izin yang telah disetujui DKA ke portal SIMPEL (sarpras.its.ac.id) minimal H-3 sebelum tanggal pemakaian.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-[#013880] text-white font-bold flex items-center justify-center text-xs shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Kode Masuk Lapangan</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                    Tunjukkan bukti approval sistem kepada petugas Sarpras di pos lapangan pada hari H untuk akses masuk lapangan.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPermitModalOpen(false)}
                className="w-full text-xs min-h-[44px]"
              >
                Mengerti & Tutup Panduan
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
