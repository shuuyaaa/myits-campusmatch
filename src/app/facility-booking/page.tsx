"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Sidebar } from "../../components/layout/sidebar";
import { Header } from "../../components/layout/header";
import { MobileNav } from "../../components/layout/mobile-nav";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
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
  Zap,
  Volume2,
  Trophy,
  ScanLine,
  Trash2,
  Eye,
  ShieldCheck,
  Search,
  XCircle,
  Lock,
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
    description:
      "Ruang belajar modern dengan pendingin ruangan prima, pencahayaan alami optimal, dan soket listrik mandiri di setiap kursi.",
    capacity: "60 Kursi",
    facilities: ["High-speed Eduroam", "Stopkontak Tiap Meja", "AC Dingin", "Dekat Musholla", "Water Station"],
  },
  {
    id: "loc-scc",
    name: "CCWS Menara Sains / SCC (Student Community Center)",
    tagline: "Kolaboratif, Diskusi Ormawa",
    campusArea: "Gedung Student Community Center (SCC) ITS",
    description:
      "Hub diskusi aktif untuk tim lomba, kepanitiaan ormawa, dan riset lintas departemen dengan fasilitas whiteboard interaktif.",
    capacity: "40 Kursi",
    facilities: ["Whiteboard Interaktif", "Meja Diskusi Bundar", "Vending Machine", "Area Diskusi Terbuka"],
  },
  {
    id: "loc-fteic",
    name: "CCWS Gedung FTEIC Elektro",
    tagline: "Ruang Belajar Khusus Mahasiswa Teknik",
    campusArea: "Gedung B FTEIC Departemen Teknik Elektro ITS",
    description:
      "Fasilitas intensif riset komputasi, telekomunikasi, dan perancangan hardware IoT dengan meja kerja lebar dan monitor eksternal.",
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
  { id: "A1", code: "A1", type: "INDIVIDUAL", row: "A", name: "Meja A1 (Individu)", capacityText: "1 Orang" },
  { id: "A2", code: "A2", type: "INDIVIDUAL", row: "A", name: "Meja A2 (Individu)", capacityText: "1 Orang" },
  { id: "A3", code: "A3", type: "INDIVIDUAL", row: "A", name: "Meja A3 (Individu)", capacityText: "1 Orang" },
  { id: "A4", code: "A4", type: "INDIVIDUAL", row: "A", name: "Meja A4 (Individu)", capacityText: "1 Orang" },
  { id: "A5", code: "A5", type: "INDIVIDUAL", row: "A", name: "Meja A5 (Individu)", capacityText: "1 Orang" },
  { id: "A6", code: "A6", type: "INDIVIDUAL", row: "A", name: "Meja A6 (Individu)", capacityText: "1 Orang" },
  { id: "B1", code: "B1", type: "INDIVIDUAL", row: "B", name: "Meja B1 (Individu)", capacityText: "1 Orang" },
  { id: "B2", code: "B2", type: "INDIVIDUAL", row: "B", name: "Meja B2 (Individu)", capacityText: "1 Orang" },
  { id: "B3", code: "B3", type: "INDIVIDUAL", row: "B", name: "Meja B3 (Individu)", capacityText: "1 Orang" },
  { id: "B4", code: "B4", type: "INDIVIDUAL", row: "B", name: "Meja B4 (Individu)", capacityText: "1 Orang" },
  { id: "B5", code: "B5", type: "INDIVIDUAL", row: "B", name: "Meja B5 (Individu)", capacityText: "1 Orang" },
  { id: "B6", code: "B6", type: "INDIVIDUAL", row: "B", name: "Meja B6 (Individu)", capacityText: "1 Orang" },
  { id: "C1", code: "C1", type: "POD", row: "C", name: "Pod Diskusi C1", capacityText: "Kelompok 4 Orang" },
  { id: "C2", code: "C2", type: "POD", row: "C", name: "Pod Diskusi C2", capacityText: "Kelompok 4 Orang" },
];

const OCCUPIED_SEATS_MAP: Record<string, string[]> = {
  s1: ["A2", "B4", "C1"],
  s2: ["A1", "A4", "B2", "B5"],
  s3: ["A3", "B1", "B3", "C2"],
  s4: ["A5", "A6", "B6"],
};

// 5 Sports Facilities Interactive Catalog (Same live booking experience as CCWS)
interface SportCourt {
  id: string;
  code: string;
  name: string;
  surface: string;
  occupiedInSessions: string[];
}

interface SportVenue {
  id: string;
  sportName: string;
  venueName: string;
  location: string;
  description: string;
  courts: SportCourt[];
}

const SPORTS_VENUES: SportVenue[] = [
  {
    id: "sport-futsal",
    sportName: "Futsal",
    venueName: "Lapangan Futsal ITS",
    location: "Kompleks Olahraga Mahasiswa ITS Sukolilo",
    description: "Lantai interlock standar turnamen nasional dengan lampu sorot LED untuk latihan malam & sparing ormawa.",
    courts: [
      { id: "FUTSAL-A", code: "Lapangan A", name: "Lapangan Futsal A (Indoor)", surface: "Interlock Pro", occupiedInSessions: ["sp3"] },
      { id: "FUTSAL-B", code: "Lapangan B", name: "Lapangan Futsal B (Outdoor)", surface: "Sintetis", occupiedInSessions: ["sp4"] },
    ],
  },
  {
    id: "sport-basket",
    sportName: "Basket",
    venueName: "Lapangan Basket ITS",
    location: "Plaza Dr. Angka & Arena Basket ITS",
    description: "Ring standar Perbasi lengkap dengan papan skor dan penerangan malam.",
    courts: [
      { id: "BASKET-1", code: "Court Utama", name: "Lapangan Basket Plaza Dr. Angka", surface: "Akrilik Outdoor", occupiedInSessions: ["sp3", "sp4"] },
      { id: "BASKET-2", code: "Court Timur", name: "Lapangan Basket Timur", surface: "Beton Halus", occupiedInSessions: ["sp1"] },
    ],
  },
  {
    id: "sport-badminton",
    sportName: "Badminton",
    venueName: "GOR Badminton ITS",
    location: "Gedung Olahraga (GOR) Pertamina ITS",
    description: "4 lapangan karpet vinyl standar BWF bebas angin dengan pencahayaan anti-silau.",
    courts: [
      { id: "BDM-1", code: "Court 1", name: "GOR Badminton Court 1", surface: "Karpet Vinyl", occupiedInSessions: ["sp2", "sp3"] },
      { id: "BDM-2", code: "Court 2", name: "GOR Badminton Court 2", surface: "Karpet Vinyl", occupiedInSessions: ["sp4"] },
      { id: "BDM-3", code: "Court 3", name: "GOR Badminton Court 3", surface: "Karpet Vinyl", occupiedInSessions: [] },
      { id: "BDM-4", code: "Court 4", name: "GOR Badminton Court 4", surface: "Karpet Vinyl", occupiedInSessions: ["sp3"] },
    ],
  },
  {
    id: "sport-voli",
    sportName: "Voli",
    venueName: "Lapangan Voli ITS",
    location: "Area Olahraga Terpadu ITS Sukolilo",
    description: "Dua lapangan bola voli standar kompetisi dengan net resmi dan pagar pengaman keliling.",
    courts: [
      { id: "VOLI-1", code: "Lapangan 1", name: "Lapangan Voli Utama 1", surface: "Hardcourt", occupiedInSessions: ["sp3"] },
      { id: "VOLI-2", code: "Lapangan 2", name: "Lapangan Voli Outdoor 2", surface: "Hardcourt", occupiedInSessions: [] },
    ],
  },
  {
    id: "sport-tenis",
    sportName: "Tenis",
    venueName: "Lapangan Tenis ITS",
    location: "Samping Asrama Mahasiswa ITS",
    description: "Lapangan hardcourt cat sintetis standar Pelti dengan jaring resmi.",
    courts: [
      { id: "TENIS-1", code: "Court 1", name: "Tenis Hardcourt 1", surface: "Plexipave", occupiedInSessions: ["sp1", "sp4"] },
      { id: "TENIS-2", code: "Court 2", name: "Tenis Hardcourt 2", surface: "Plexipave", occupiedInSessions: ["sp2"] },
    ],
  },
];

const SPORT_SESSIONS = [
  { id: "sp1", label: "Sesi Pagi 1", time: "07:00 - 09:00 WIB" },
  { id: "sp2", label: "Sesi Pagi 2", time: "09:00 - 11:00 WIB" },
  { id: "sp3", label: "Sesi Sore 1", time: "15:00 - 17:00 WIB" },
  { id: "sp4", label: "Sesi Malam", time: "17:00 - 19:00 WIB" },
];

interface ActiveBookingData {
  code: string;
  category: "CCWS" | "SPORTS";
  seatOrCourt: string;
  location: string;
  session: string;
  date: string;
  name: string;
  nrp: string;
  dept: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
}

// Pre-seeded Campus Booking Registry for "Cek Kode Booking" verification lookup
const CAMPUS_SAMPLE_REGISTRY: ActiveBookingData[] = [
  {
    code: "ITS-FUTSAL-2026-A12",
    category: "SPORTS",
    seatOrCourt: "Lapangan Futsal A (Indoor)",
    location: "Lapangan Futsal ITS",
    session: "15:00 - 17:00 WIB",
    date: "16 Maret 2026",
    name: "Bayu Pratama Putra",
    nrp: "5009221042",
    dept: "S1 Teknik Elektro (FTEIC)",
    isCheckedIn: false,
  },
  {
    code: "ITS-BASKET-2026-B04",
    category: "SPORTS",
    seatOrCourt: "Lapangan Basket Plaza Dr. Angka",
    location: "Lapangan Basket ITS",
    session: "17:00 - 19:00 WIB",
    date: "16 Maret 2026",
    name: "Reyhan Ardiansyah",
    nrp: "5025221091",
    dept: "S1 Teknik Informatika (FTEIC)",
    isCheckedIn: true,
    checkedInAt: "16:50 WIB",
  },
  {
    code: "ITS-BDM-2026-C03",
    category: "SPORTS",
    seatOrCourt: "GOR Badminton Court 1",
    location: "GOR Badminton ITS",
    session: "09:00 - 11:00 WIB",
    date: "16 Maret 2026",
    name: "Clara Wijaya",
    nrp: "5003231012",
    dept: "S1 Statistika (FSAD)",
    isCheckedIn: false,
  },
];

export default function FacilityBookingPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [mainTab, setMainTab] = useState<"CCWS" | "SPORTS" | "VERIFY">("CCWS");

  // CCWS Booking state
  const [selectedLocationId, setSelectedLocationId] = useState<string>("loc-perpustakaan");
  const [selectedDate, setSelectedDate] = useState<string>("2026-03-16");
  const [selectedSessionId, setSelectedSessionId] = useState<string>("s2");
  const [selectedSeatId, setSelectedSeatId] = useState<string>("A6");

  // Active Confirmed CCWS Booking for this user (Strictly max 1 seat!)
  const [activeBooking, setActiveBooking] = useState<ActiveBookingData | null>(null);

  // Sports Booking state
  const [selectedSportId, setSelectedSportId] = useState<string>("sport-futsal");
  const [selectedSportDate, setSelectedSportDate] = useState<string>("2026-03-16");
  const [selectedSportSessionId, setSelectedSportSessionId] = useState<string>("sp2");
  const [selectedCourtId, setSelectedCourtId] = useState<string>("FUTSAL-A");
  const [sportsBookings, setSportsBookings] = useState<ActiveBookingData[]>([]);

  // Active Ticket displayed in Modal (can be CCWS or Sports)
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketPreview, setTicketPreview] = useState<ActiveBookingData | null>(null);

  // Verify / Cek Kode Booking state
  const [checkCodeInput, setCheckCodeInput] = useState("");
  const [checkResult, setCheckResult] = useState<{
    searched: boolean;
    found: ActiveBookingData | null;
    query: string;
  }>({ searched: false, found: null, query: "" });

  // Host origin for live QR scanning
  const [clientOrigin, setClientOrigin] = useState("http://localhost:3000");

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Load active CCWS & Sports bookings on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setClientOrigin(window.location.origin);
    }

    const loadBookings = () => {
      try {
        const rawCcws = localStorage.getItem("myits_active_ccws_booking");
        if (rawCcws) {
          const parsed = JSON.parse(rawCcws);
          const normalized: ActiveBookingData = {
            ...parsed,
            category: "CCWS",
            seatOrCourt: parsed.seatOrCourt || parsed.seat || "A6",
          };
          setActiveBooking(normalized);
          setSelectedSeatId(normalized.seatOrCourt);
        } else {
          const initialData: ActiveBookingData = {
            code: "ITS-CCWS-2026-X94B",
            category: "CCWS",
            seatOrCourt: "A6",
            location: "CCWS Gedung Perpustakaan Pusat Lantai 2",
            session: "11:00 - 14:00 WIB",
            date: "16 Maret 2026",
            name: "Praditya Haekal Islami Al Haqiqi",
            nrp: "5009221000",
            dept: "S1 Teknik Elektro (FTEIC)",
            isCheckedIn: false,
          };
          setActiveBooking(initialData);
          localStorage.setItem(
            "myits_active_ccws_booking",
            JSON.stringify({ ...initialData, seat: initialData.seatOrCourt })
          );
        }

        const rawSports = localStorage.getItem("myits_sports_bookings");
        if (rawSports) {
          setSportsBookings(JSON.parse(rawSports));
        }
      } catch (e) {
        // ignore storage errors
      }
    };

    loadBookings();
    window.addEventListener("campusmatch:ccws_booking_updated", loadBookings);
    return () => window.removeEventListener("campusmatch:ccws_booking_updated", loadBookings);
  }, []);

  const selectedLocation = useMemo(
    () => CCWS_LOCATIONS.find((l) => l.id === selectedLocationId) || CCWS_LOCATIONS[0],
    [selectedLocationId]
  );

  const selectedSession = useMemo(
    () => TIME_SESSIONS.find((s) => s.id === selectedSessionId) || TIME_SESSIONS[1],
    [selectedSessionId]
  );

  const occupiedSeats = useMemo(
    () => OCCUPIED_SEATS_MAP[selectedSessionId] || [],
    [selectedSessionId]
  );

  const selectedSeatObj = useMemo(
    () => SEATS_LAYOUT.find((s) => s.id === selectedSeatId),
    [selectedSeatId]
  );

  const selectedSportVenue = useMemo(
    () => SPORTS_VENUES.find((v) => v.id === selectedSportId) || SPORTS_VENUES[0],
    [selectedSportId]
  );

  const selectedSportSession = useMemo(
    () => SPORT_SESSIONS.find((s) => s.id === selectedSportSessionId) || SPORT_SESSIONS[1],
    [selectedSportSessionId]
  );

  const selectedCourtObj = useMemo(
    () => selectedSportVenue.courts.find((c) => c.id === selectedCourtId) || selectedSportVenue.courts[0],
    [selectedSportVenue, selectedCourtId]
  );

  const handleSeatClick = (seat: SeatData) => {
    if (occupiedSeats.includes(seat.id) && (!activeBooking || activeBooking.seatOrCourt !== seat.id)) {
      showToast(`Kursi ${seat.code} telah terisi oleh mahasiswa ITS lain pada sesi ini.`);
      return;
    }
    setSelectedSeatId(seat.id);
  };

  // Enforces strictly: 1 student = Max 1 active CCWS seat
  const handleConfirmCCWSBooking = () => {
    if (!selectedSeatId) {
      showToast("Pilih kursi yang tersedia pada denah terlebih dahulu.");
      return;
    }

    if (activeBooking) {
      showToast(
        `Aturan Adil CCWS: Akun Anda sudah memiliki 1 kursi aktif (${activeBooking.seatOrCourt} - ${activeBooking.code}). Batalkan booking aktif terlebih dahulu jika ingin berpindah kursi (tidak boleh booking komunal).`
      );
      return;
    }

    const newCode = `ITS-CCWS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const bookingPayload: ActiveBookingData = {
      code: newCode,
      category: "CCWS",
      seatOrCourt: selectedSeatId,
      location: selectedLocation.name,
      session: selectedSession.time,
      date: selectedDate,
      name: "Praditya Haekal Islami Al Haqiqi",
      nrp: "5009221000",
      dept: "S1 Teknik Elektro (FTEIC)",
      isCheckedIn: false,
    };

    setActiveBooking(bookingPayload);
    setTicketPreview(bookingPayload);
    try {
      localStorage.setItem(
        "myits_active_ccws_booking",
        JSON.stringify({ ...bookingPayload, seat: bookingPayload.seatOrCourt })
      );
    } catch (e) {}

    setTicketModalOpen(true);
    showToast(`Reservasi berhasil! Kursi ${selectedSeatId} (${newCode}) terhubung dengan akun myITS Anda.`);
  };

  const handleCancelCCWSBooking = () => {
    setActiveBooking(null);
    try {
      localStorage.removeItem("myits_active_ccws_booking");
    } catch (e) {}
    showToast("Reservasi CCWS aktif Anda telah dibatalkan. Anda kini dapat memilih kursi lain.");
  };

  // Confirm Sports Booking
  const handleConfirmSportBooking = () => {
    if (!selectedCourtObj) return;

    if (selectedCourtObj.occupiedInSessions.includes(selectedSportSessionId)) {
      showToast(`Lapangan ${selectedCourtObj.name} sudah terisi pada sesi ini. Pilih sesi atau court lain.`);
      return;
    }

    const prefix = selectedSportVenue.sportName.toUpperCase().slice(0, 6);
    const newCode = `ITS-${prefix}-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const newSportBooking: ActiveBookingData = {
      code: newCode,
      category: "SPORTS",
      seatOrCourt: selectedCourtObj.name,
      location: selectedSportVenue.venueName,
      session: selectedSportSession.time,
      date: selectedSportDate,
      name: "Praditya Haekal Islami Al Haqiqi",
      nrp: "5009221000",
      dept: "S1 Teknik Elektro (FTEIC)",
      isCheckedIn: false,
    };

    const updated = [newSportBooking, ...sportsBookings];
    setSportsBookings(updated);
    setTicketPreview(newSportBooking);
    try {
      localStorage.setItem("myits_sports_bookings", JSON.stringify(updated));
    } catch (e) {}

    setTicketModalOpen(true);
    showToast(`Booking ${selectedCourtObj.name} berhasil! Kode: ${newCode}`);
  };

  const handleCancelSportBooking = (codeToRemove: string) => {
    const updated = sportsBookings.filter((b) => b.code !== codeToRemove);
    setSportsBookings(updated);
    try {
      localStorage.setItem("myits_sports_bookings", JSON.stringify(updated));
    } catch (e) {}
    showToast(`Reservasi lapangan kode ${codeToRemove} berhasil dibatalkan.`);
  };

  // Check Booking Code Registry Lookup
  const handleVerifyBookingCode = (codeOverride?: string) => {
    const query = (codeOverride ?? checkCodeInput).trim().toUpperCase();
    if (!query) {
      showToast("Masukkan kode booking terlebih dahulu.");
      return;
    }

    const allKnownBookings: ActiveBookingData[] = [
      ...(activeBooking ? [activeBooking] : []),
      ...sportsBookings,
      ...CAMPUS_SAMPLE_REGISTRY,
    ];

    const match = allKnownBookings.find((b) => b.code.toUpperCase() === query) || null;
    setCheckResult({ searched: true, found: match, query });
  };

  // QR pass URL for currently previewed ticket (or active CCWS)
  const modalData = ticketPreview || activeBooking;
  const scanPassUrl = modalData
    ? `/ccws-pass?code=${encodeURIComponent(modalData.code)}&seat=${encodeURIComponent(modalData.seatOrCourt)}&loc=${encodeURIComponent(modalData.location)}&time=${encodeURIComponent(modalData.session)}&date=${encodeURIComponent(modalData.date)}&name=${encodeURIComponent(modalData.name)}&nrp=${modalData.nrp}&dept=${encodeURIComponent(modalData.dept)}`
    : "/ccws-pass";
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
          title="Reservasi CCWS & Fasilitas Olahraga ITS"
          userName="Praditya Haekal Islami Al Haqiqi"
          showSearch={false}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-8 space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-20 right-4 z-50 max-w-md bg-[#013880] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-blue-700 animate-in fade-in slide-in-from-top-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-xs md:text-sm font-medium">{toastMessage}</p>
            </div>
          )}

          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-[#013880] to-[#0D47A1] rounded-2xl p-5 md:p-7 text-white shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-white/20 text-white hover:bg-white/30 border-none text-[11px] font-semibold px-2.5 py-0.5">
                    Case 1: Smarter Campus and Learning
                  </Badge>
                  <Badge className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-[11px] font-semibold">
                    🔒 Aturan Adil: 1 Mahasiswa = Maks 1 Kursi CCWS
                  </Badge>
                </div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight">
                  Reservasi Terpadu CCWS &amp; 5 Lapangan Olahraga ITS
                </h1>
                <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
                  Pesan kursi CCWS secara adil (maksimal 1 kursi per akun, anti-booking komunal), reservasi lapangan olahraga langsung tanpa menghubungi admin manual, dan verifikasi kode booking kapan saja.
                </p>
              </div>

              <Button
                onClick={() => setMainTab("VERIFY")}
                className="bg-white text-[#013880] hover:bg-blue-50 font-bold text-xs gap-2 rounded-xl px-4 py-2.5 shadow-sm shrink-0 min-h-[44px]"
              >
                <Search className="w-4 h-4" />
                Cek Validitas Kode Booking
              </Button>
            </div>
          </div>

          {/* KARTU RESERVASI CCWS AKTIF */}
          {activeBooking && (
            <div className="bg-gradient-to-r from-[#013880] to-[#0D47A1] rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-blue-400/30">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-xs shrink-0">
                  <QrCode className="w-6 h-6 text-emerald-300" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                      Reservasi CCWS Aktif Anda (Maks 1 Kursi)
                    </span>
                    {activeBooking.isCheckedIn ? (
                      <Badge className="bg-emerald-500 text-white text-[10px] font-bold gap-1">
                        <ShieldCheck className="w-3 h-3" /> Sudah Check-In ({activeBooking.checkedInAt || "Aktif"})
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-400 text-amber-950 text-[10px] font-bold">
                        Menunggu Scan Gerbang
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-white">
                    Kursi {activeBooking.seatOrCourt} — {activeBooking.location}
                  </h3>
                  <p className="text-xs text-blue-100 flex items-center gap-3 flex-wrap">
                    <span>Sesi: <strong>{activeBooking.session}</strong></span>
                    <span>•</span>
                    <span>Tanggal: <strong>{activeBooking.date}</strong></span>
                    <span>•</span>
                    <span className="font-mono text-emerald-300 font-bold">Kode: {activeBooking.code}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <Button
                  size="sm"
                  onClick={() => {
                    setTicketPreview(activeBooking);
                    setTicketModalOpen(true);
                  }}
                  className="bg-white text-[#013880] hover:bg-blue-50 font-bold text-xs gap-1.5 rounded-xl h-10 px-3.5 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Lihat E-Ticket QR
                </Button>

                <Link href={`/ccws-pass?code=${encodeURIComponent(activeBooking.code)}&seat=${encodeURIComponent(activeBooking.seatOrCourt)}&loc=${encodeURIComponent(activeBooking.location)}&time=${encodeURIComponent(activeBooking.session)}&date=${encodeURIComponent(activeBooking.date)}&name=${encodeURIComponent(activeBooking.name)}&nrp=${activeBooking.nrp}&dept=${encodeURIComponent(activeBooking.dept)}`}>
                  <Button
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs gap-1.5 rounded-xl h-10 px-3.5 shadow-md shadow-emerald-500/20"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    Uji Scan Gerbang
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelCCWSBooking}
                  className="text-red-200 hover:text-white hover:bg-red-500/20 text-xs h-10 px-2.5 rounded-xl gap-1"
                  title="Batalkan Booking Ini"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Batalkan</span>
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Tabs (3 Main Tabs) */}
          <div className="flex border-b border-slate-200 gap-2 overflow-x-auto scrollbar-thin">
            <button
              onClick={() => setMainTab("CCWS")}
              className={`pb-3 px-4 text-xs md:text-sm font-bold transition-all flex items-center gap-2 border-b-2 min-h-[44px] whitespace-nowrap ${
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
              className={`pb-3 px-4 text-xs md:text-sm font-bold transition-all flex items-center gap-2 border-b-2 min-h-[44px] whitespace-nowrap ${
                mainTab === "SPORTS"
                  ? "border-[#013880] text-[#013880]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Trophy className="w-4 h-4" />
              Fasilitas Olahraga (5 Lapangan)
            </button>
            <button
              onClick={() => setMainTab("VERIFY")}
              className={`pb-3 px-4 text-xs md:text-sm font-bold transition-all flex items-center gap-2 border-b-2 min-h-[44px] whitespace-nowrap ${
                mainTab === "VERIFY"
                  ? "border-[#013880] text-[#013880]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Search className="w-4 h-4" />
              Cek Kode Booking
            </button>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: CO-WORKING SPACE (CCWS) */}
          {/* ========================================================= */}
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
                        onClick={() => setSelectedLocationId(loc.id)}
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
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#013880] shrink-0" />}
                        </div>

                        <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">{loc.description}</p>

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
                      2. Tanggal &amp; Pilihan Sesi Waktu
                    </h2>
                    <p className="text-xs text-slate-500">
                      Pilih sesi reservasi 3 jam (wajib 1 akun = maksimal 1 kursi aktif).
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
                          if (
                            OCCUPIED_SEATS_MAP[sess.id]?.includes(selectedSeatId) &&
                            (!activeBooking || activeBooking.seatOrCourt !== selectedSeatId)
                          ) {
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
                <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-slate-900">
                        Denah Visual Kursi &amp; Meja — {selectedLocation.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Klik nomor kursi untuk memilih posisi meja Anda secara real-time.
                      </p>
                    </div>

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

                  <div className="w-full py-2 bg-slate-100 rounded-lg text-center text-[11px] font-bold text-slate-500 border border-dashed border-slate-300 tracking-wider">
                    DEPAN: AREA PINTU MASUK, MONITOR INFORMASI &amp; WHITEBOARD
                  </div>

                  <div className="overflow-x-auto pb-2 scrollbar-thin">
                    <div className="min-w-[500px] space-y-5 pt-2">
                      {/* Baris A */}
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
                            const isMyBooking = activeBooking && activeBooking.seatOrCourt === seat.id;
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

                      {/* Baris B */}
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
                            const isMyBooking = activeBooking && activeBooking.seatOrCourt === seat.id;
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

                      {/* Baris C */}
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
                            const isMyBooking = activeBooking && activeBooking.seatOrCourt === seat.id;
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

                {/* Panel Ringkasan Booking CCWS */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-sm md:text-base text-slate-900">
                        Ringkasan Booking CCWS
                      </h3>
                      <p className="text-xs text-slate-500">
                        Khusus mahasiswa ITS terverifikasi SSO
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
                        <strong className="text-[#013880] font-black text-lg">{selectedSeatId || "-"}</strong>
                      </div>

                      <div className="pt-1 text-[11px] text-slate-600 space-y-1">
                        <p><strong>Peminjam:</strong> Praditya Haekal Islami Al Haqiqi</p>
                        <p><strong>NRP:</strong> 5009221000 (S1 Teknik Elektro)</p>
                      </div>
                    </div>

                    <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 text-[11px] text-[#013880] space-y-1">
                      <p className="font-bold flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 shrink-0" /> Kebijakan Anti-Booking Komunal
                      </p>
                      <p className="leading-relaxed">
                        1 akun mahasiswa ITS wajib memesan maksimal <strong>1 kursi aktif</strong> agar pembagian ruang belajar tetap adil.
                      </p>
                    </div>

                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-800 space-y-1">
                      <p className="font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Ketentuan Check-In 15 Menit
                      </p>
                      <p className="leading-relaxed">
                        Wajib scan QR di gerbang/meja maksimal 15 menit saat sesi dimulai, atau slot otomatis dilepas ke mahasiswa lain.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleConfirmCCWSBooking}
                    className="w-full bg-gradient-to-r from-[#013880] to-[#0D47A1] hover:from-[#012d66] hover:to-[#09357a] text-white font-bold text-xs py-3 rounded-xl shadow-md gap-1.5 min-h-[44px]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Konfirmasi Booking CCWS
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: FASILITAS OLAHRAGA (LIVE INTERACTIVE 5 LAPANGAN) */}
          {/* ========================================================= */}
          {mainTab === "SPORTS" && (
            <div className="space-y-6">
              {/* Selector 5 Cabang Lapangan Olahraga ITS */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  1. Pilih Cabang &amp; Lapangan Olahraga Resmi ITS (Tanpa Menghubungi Admin Manual):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {SPORTS_VENUES.map((venue) => {
                    const isSelected = selectedSportId === venue.id;
                    return (
                      <div
                        key={venue.id}
                        onClick={() => {
                          setSelectedSportId(venue.id);
                          setSelectedCourtId(venue.courts[0].id);
                        }}
                        className={`cursor-pointer rounded-xl p-3.5 border transition-all min-h-[44px] ${
                          isSelected
                            ? "bg-blue-50/80 border-[#013880] shadow-xs ring-2 ring-[#013880]/30"
                            : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <h3 className={`font-bold text-xs md:text-sm ${isSelected ? "text-[#013880]" : "text-slate-900"}`}>
                            {venue.sportName}
                          </h3>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#013880] shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">{venue.venueName}</p>
                        <span className="inline-block mt-2 text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {venue.courts.length} Lapangan
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tanggal & Sesi Waktu Olahraga */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-[#013880]" />
                      2. Tanggal &amp; Sesi Lapangan ({selectedSportVenue.venueName})
                    </h2>
                    <p className="text-xs text-slate-500">{selectedSportVenue.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700">Tanggal:</span>
                    <input
                      type="date"
                      value={selectedSportDate}
                      onChange={(e) => setSelectedSportDate(e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#013880] font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {SPORT_SESSIONS.map((sess) => {
                    const isSelected = selectedSportSessionId === sess.id;
                    return (
                      <button
                        key={sess.id}
                        onClick={() => setSelectedSportSessionId(sess.id)}
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

              {/* Pilihan Court & Panel Ringkasan Olahraga */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-slate-900">
                        3. Ketersediaan Court / Lapangan — {selectedSportVenue.venueName}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {selectedSportVenue.location}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {selectedSportVenue.courts.map((court) => {
                      const mySportBooking = sportsBookings.find(
                        (b) =>
                          b.seatOrCourt === court.name &&
                          b.session === selectedSportSession.time &&
                          b.date === selectedSportDate
                      );
                      const isOccupied = court.occupiedInSessions.includes(selectedSportSessionId) && !mySportBooking;
                      const isSelected = selectedCourtId === court.id;

                      return (
                        <button
                          key={court.id}
                          disabled={isOccupied}
                          onClick={() => setSelectedCourtId(court.id)}
                          className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between min-h-[72px] ${
                            mySportBooking
                              ? "bg-gradient-to-br from-[#013880] to-[#0D47A1] text-white border-[#013880] shadow-md ring-4 ring-[#013880]/20"
                              : isSelected
                              ? "bg-[#013880] text-white border-[#013880] shadow-md ring-4 ring-[#013880]/20"
                              : isOccupied
                              ? "bg-rose-50 text-rose-500 border-rose-300 cursor-not-allowed opacity-80"
                              : "bg-emerald-50 text-emerald-900 border-emerald-400 hover:bg-emerald-100"
                          }`}
                        >
                          <div>
                            <p className="font-extrabold text-sm flex items-center gap-1.5">
                              {mySportBooking && <span>★</span>}
                              {court.name}
                            </p>
                            <p className={`text-[11px] mt-0.5 ${isSelected || mySportBooking ? "text-blue-100" : "text-slate-500"}`}>
                              Permukaan: {court.surface}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-black/10 uppercase shrink-0">
                            {mySportBooking ? "Milik Anda" : isOccupied ? "Terisi" : isSelected ? "Dipilih" : "Tersedia"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Daftar Reservasi Olahraga Aktif User */}
                  {sportsBookings.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Riwayat Booking Lapangan Anda ({sportsBookings.length}):
                      </h4>
                      <div className="space-y-2">
                        {sportsBookings.map((sb) => (
                          <div
                            key={sb.code}
                            className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-bold text-[#013880]">{sb.code}</span>
                                <Badge className="bg-emerald-500 text-white text-[10px]">Terkonfirmasi</Badge>
                              </div>
                              <p className="font-bold text-slate-900 mt-0.5">{sb.seatOrCourt}</p>
                              <p className="text-[11px] text-slate-600">{sb.date} • {sb.session}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setTicketPreview(sb);
                                  setTicketModalOpen(true);
                                }}
                                className="text-xs h-9 px-3 border-[#013880] text-[#013880]"
                              >
                                <QrCode className="w-3.5 h-3.5 mr-1" /> Tiket QR
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCancelSportBooking(sb.code)}
                                className="text-rose-600 hover:bg-rose-50 h-9 px-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Panel Ringkasan Booking Olahraga */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-sm md:text-base text-slate-900">
                        Ringkasan Booking Olahraga
                      </h3>
                      <p className="text-xs text-slate-500">
                        Otomatis terdaftar ke sistem tanpa chat admin WA manual
                      </p>
                    </div>

                    <div className="space-y-3 text-xs text-slate-700">
                      <div>
                        <span className="text-[11px] text-slate-500 block">Fasilitas Olahraga:</span>
                        <strong className="text-[#013880] text-xs font-bold block mt-0.5">
                          {selectedSportVenue.venueName}
                        </strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Lapangan / Court:</span>
                        <strong className="text-slate-800 font-bold">{selectedCourtObj.name}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Tanggal:</span>
                        <strong className="text-slate-800 font-bold">{selectedSportDate}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-500">Sesi Waktu:</span>
                        <strong className="text-slate-800 font-bold">{selectedSportSession.time}</strong>
                      </div>
                      <div className="pt-1 text-[11px] text-slate-600 space-y-1">
                        <p><strong>Pemesan:</strong> Praditya Haekal Islami Al Haqiqi</p>
                        <p><strong>NRP:</strong> 5009221000 (S1 Teknik Elektro)</p>
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                      <p className="font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Kepastian Kode Booking Digital
                      </p>
                      <p className="leading-relaxed">
                        Kode reservasi dapat langsung dicek di tab <strong>&ldquo;Cek Kode Booking&rdquo;</strong> oleh petugas pos lapangan.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleConfirmSportBooking}
                    className="w-full bg-gradient-to-r from-[#013880] to-[#0D47A1] hover:from-[#012d66] hover:to-[#09357a] text-white font-bold text-xs py-3 rounded-xl shadow-md gap-1.5 min-h-[44px]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Konfirmasi Booking Lapangan
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: CEK KODE BOOKING (VERIFICATION LOOKUP) */}
          {/* ========================================================= */}
          {mainTab === "VERIFY" && (
            <div className="max-w-3xl mx-auto space-y-5">
              <Card className="border-slate-200 shadow-xs bg-white">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#013880]/10 text-[#013880]">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base md:text-lg font-bold text-slate-900">
                        Cek Status &amp; Validitas Kode Booking (CCWS &amp; Olahraga)
                      </h2>
                      <p className="text-xs text-slate-500">
                        Masukkan kode reservasi untuk memastikan apakah pemesanan terdaftar resmi di sistem myITS.
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-2 space-y-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleVerifyBookingCode();
                    }}
                    className="flex flex-col sm:flex-row gap-2.5"
                  >
                    <Input
                      type="text"
                      placeholder="Masukkan kode booking, misal: ITS-CCWS-2026-X94B atau ITS-FUTSAL-2026-A12"
                      value={checkCodeInput}
                      onChange={(e) => setCheckCodeInput(e.target.value.toUpperCase())}
                      className="font-mono text-xs md:text-sm uppercase h-11 border-slate-300 focus-visible:ring-[#013880]"
                    />
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#013880] to-[#0D47A1] hover:from-[#012d66] hover:to-[#09357a] text-white font-bold text-xs h-11 px-6 rounded-lg shrink-0 gap-1.5"
                    >
                      <Search className="w-4 h-4" />
                      Periksa Kode
                    </Button>
                  </form>

                  {/* Quick Test Chips */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold text-slate-500">
                      Contoh kode aktif untuk uji cepat:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        ...(activeBooking ? [activeBooking.code] : []),
                        ...sportsBookings.map((s) => s.code),
                        ...CAMPUS_SAMPLE_REGISTRY.map((s) => s.code),
                        "ITS-FAKE-9999",
                      ].map((sampleCode) => (
                        <button
                          key={sampleCode}
                          type="button"
                          onClick={() => {
                            setCheckCodeInput(sampleCode);
                            handleVerifyBookingCode(sampleCode);
                          }}
                          className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all ${
                            sampleCode === "ITS-FAKE-9999"
                              ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                              : "bg-blue-50 text-[#013880] border-blue-200 hover:bg-blue-100"
                          }`}
                        >
                          {sampleCode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Verification Result Box */}
                  {checkResult.searched && (
                    <div className="pt-2">
                      {checkResult.found ? (
                        <div className="bg-emerald-50/90 border-2 border-emerald-400 rounded-2xl p-5 space-y-3 animate-in fade-in">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-2.5">
                              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                              <div>
                                <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                                  VALID • RESERVASI TERDAFTAR
                                </Badge>
                                <h3 className="text-base font-extrabold text-slate-900 mt-0.5 font-mono">
                                  {checkResult.found.code}
                                </h3>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-white text-[#013880] border-[#013880]/30 font-bold text-xs">
                              {checkResult.found.category === "CCWS" ? "Co-Working Space" : "Fasilitas Olahraga"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-emerald-200 text-xs">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">PEMESAN (SSO MYITS)</span>
                              <strong className="text-slate-900 block mt-0.5">{checkResult.found.name}</strong>
                              <span className="text-[11px] text-slate-500">NRP {checkResult.found.nrp} • {checkResult.found.dept}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">LOKASI &amp; KURSI / COURT</span>
                              <strong className="text-[#013880] block mt-0.5">{checkResult.found.seatOrCourt}</strong>
                              <span className="text-[11px] text-slate-600">{checkResult.found.location}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">JADWAL RESERVASI</span>
                              <strong className="text-slate-900 block mt-0.5">{checkResult.found.date}</strong>
                              <span className="text-[11px] text-slate-600">{checkResult.found.session}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">STATUS CHECK-IN</span>
                              <strong className={`block mt-0.5 ${checkResult.found.isCheckedIn ? "text-emerald-700" : "text-amber-700"}`}>
                                {checkResult.found.isCheckedIn
                                  ? `Sudah Check-In (${checkResult.found.checkedInAt || "Aktif"})`
                                  : "Terkonfirmasi (Menunggu Check-In QR)"}
                              </strong>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 flex items-start gap-3 animate-in fade-in">
                          <XCircle className="w-7 h-7 text-rose-600 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h3 className="text-sm md:text-base font-extrabold text-rose-900">
                              Kode Booking &ldquo;{checkResult.query}&rdquo; Tidak Ditemukan
                            </h3>
                            <p className="text-xs text-rose-800 leading-relaxed">
                              Pastikan penulisan kode benar, atau reservasi mungkin telah dibatalkan secara otomatis karena melewati batas waktu check-in 15 menit.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      <MobileNav />

      {/* MODAL E-TICKET DIGITAL (CCWS & OLAHRAGA) */}
      <Dialog open={ticketModalOpen} onOpenChange={setTicketModalOpen}>
        <DialogContent className="max-w-md w-[92vw] sm:w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#013880]" />
              E-Ticket Reservasi {modalData?.category === "SPORTS" ? "Olahraga ITS" : "CCWS ITS"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Pindai QR Code di bawah atau gunakan kode reservasi pada fitur Cek Kode Booking.
            </DialogDescription>
          </DialogHeader>

          {modalData && (
            <div className="space-y-4 py-2">
              <div className="bg-gradient-to-br from-[#013880] to-[#0D47A1] text-white p-5 rounded-2xl shadow-md space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-blue-200">
                      {modalData.category === "SPORTS" ? "Tiket Lapangan Olahraga myITS" : "Tiket Akses CCWS myITS"}
                    </span>
                    <h4 className="text-sm font-extrabold text-white mt-0.5">
                      {modalData.location}
                    </h4>
                  </div>
                  <Badge className="bg-emerald-500 text-white text-[10px] font-bold shrink-0">
                    TERKONFIRMASI
                  </Badge>
                </div>

                <div className="bg-white p-3.5 rounded-xl flex flex-col items-center justify-center my-2 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(fullScanQrUrl)}`}
                    alt="Scannable QR Code myITS"
                    className="w-36 h-36 object-contain rounded-md"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="text-[9px] text-slate-400 font-mono mt-1 text-center">
                    Dapat Dipindai Kamera Android / iOS
                  </span>
                </div>

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

                <div className="text-center font-mono text-xs font-bold text-blue-200 pt-1">
                  Kode Reservasi: <span className="text-white tracking-widest font-black">{modalData.code}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-white/20">
                  <div>
                    <span className="text-blue-200 block text-[10px]">IDENTITAS PEMINJAM</span>
                    <span className="font-bold">Praditya Haekal</span>
                    <span className="text-[10px] text-blue-200 block">5009221000 (Elektro)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-blue-200 block text-[10px]">SLOT &amp; WAKTU</span>
                    <span className="font-black text-white text-xs block">{modalData.seatOrCourt}</span>
                    <span className="text-[10px] text-blue-200 block">{modalData.session}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" /> Batas Waktu Check-In:
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Harap hadir dan lakukan pemindaian barcode check-in paling lambat <strong>15 menit saat sesi dimulai</strong>. Reservasi yang tidak dicheck-in otomatis dibatalkan.
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
