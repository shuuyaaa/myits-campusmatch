"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  User,
  GraduationCap,
  MapPin,
  Zap,
  Wifi,
  ArrowLeft,
  ExternalLink,
  Download,
  QrCode,
  Sparkles,
  AlertCircle,
  Coffee,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function PassContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get("code") || "ITS-CCWS-2026-X94B";
  const seat = searchParams.get("seat") || "Meja A6 (Individu)";
  const location = searchParams.get("loc") || "CCWS Gedung Perpustakaan Pusat Lantai 2";
  const session = searchParams.get("time") || "11:00 - 14:00 WIB";
  const date = searchParams.get("date") || "16 Maret 2026";
  const name = searchParams.get("name") || "Praditya Haekal Islami Al Haqiqi";
  const nrp = searchParams.get("nrp") || "5009221000";
  const dept = searchParams.get("dept") || "S1 Teknik Elektro (FTEIC)";

  const [checkInTime, setCheckInTime] = useState<string>("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }) + " • " + now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " WIB";
    setCheckInTime(formatted);

    // Also update localStorage to mark this ticket as checked in
    try {
      const activeRaw = localStorage.getItem("myits_active_ccws_booking");
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw);
        parsed.isCheckedIn = true;
        parsed.checkedInAt = formatted;
        localStorage.setItem("myits_active_ccws_booking", JSON.stringify(parsed));
        window.dispatchEvent(new Event("campusmatch:ccws_booking_updated"));
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between py-6 px-4 sm:px-6">
      {/* Top Bar Header */}
      <div className="max-w-xl mx-auto w-full flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#013880] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-extrabold tracking-tight text-white">
              Sistem Gerbang Pintar myITS CCWS
            </h1>
            <p className="text-[10px] text-slate-400">
              Terminal Scanner ID: <span className="font-mono text-blue-400">GATE-PERPUS-LT2-01</span>
            </p>
          </div>
        </div>

        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5">
          TERHUBUNG • AKTIF
        </Badge>
      </div>

      {/* Main Validation Card */}
      <div className="max-w-xl mx-auto w-full my-6 space-y-4">
        {/* Verification Success Box */}
        <div className="bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden text-center space-y-4">
          <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Animated Pulsing Icon */}
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>
          </div>

          <div className="space-y-1">
            <Badge className="bg-emerald-500 text-white font-extrabold text-[11px] px-3 py-0.5 tracking-wider uppercase">
              Akses Diterima & Terverifikasi
            </Badge>
            <h2 className="text-xl sm:text-2xl font-black text-white pt-1">
              Check-In Berhasil!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Selamat datang di Co-Working Space ITS. Pintu gerbang otomatis terbuka dan soket daya meja Anda telah diaktifkan.
            </p>
          </div>

          {/* Digital Stamp / Verification Code */}
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">KODE TIKET:</span>
            <span className="text-emerald-400 font-bold tracking-widest text-sm">{code}</span>
          </div>

          {/* User SSO Verified Profile Info */}
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50 text-left space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#013880] to-[#0D47A1] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                PH
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-sm font-bold text-white truncate">{name}</h3>
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                </div>
                <p className="text-xs text-slate-400 font-mono">NRP: {nrp}</p>
                <p className="text-[11px] text-blue-300 font-medium">{dept}</p>
              </div>
            </div>

            {/* Allocation Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">LOKASI CCWS</span>
                <strong className="text-white text-xs block mt-0.5 leading-snug">{location}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">NOMOR KURSI</span>
                <strong className="text-emerald-400 text-sm font-black block mt-0.5">{seat}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">SESI JAM</span>
                <strong className="text-white block mt-0.5">{session}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">TANGGAL RESERVASI</span>
                <strong className="text-white block mt-0.5">{date}</strong>
              </div>
            </div>

            {/* Check-In Timestamp */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Waktu Scan Gerbang:
              </span>
              <strong className="text-emerald-300 font-mono">{checkInTime || "Memproses..."}</strong>
            </div>

            {/* Live Facility Active Amenities */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-300 bg-emerald-950/60 px-2 py-1 rounded-md border border-emerald-800/50">
                <Zap className="w-3 h-3 text-emerald-400" /> Daya Listrik Meja: AKTIF
              </span>
              <span className="flex items-center gap-1 text-blue-300 bg-blue-950/60 px-2 py-1 rounded-md border border-blue-800/50">
                <Wifi className="w-3 h-3 text-blue-400" /> WiFi Eduroam ITS: Terhubung
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <Link href="/facility-booking" className="flex-1">
            <Button
              variant="outline"
              className="w-full text-xs font-semibold border-slate-700 bg-slate-800/80 text-white hover:bg-slate-800 hover:text-white h-11 rounded-xl"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Kembali ke Denah Reservasi
            </Button>
          </Link>

          <Link href="/dashboard" className="flex-1">
            <Button
              className="w-full bg-gradient-to-r from-[#013880] to-[#0D47A1] hover:from-[#012d66] hover:to-[#09357a] text-white text-xs font-bold h-11 rounded-xl shadow-lg shadow-[#013880]/30"
            >
              Buka Beranda Utama myITS
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer System Disclaimer */}
      <div className="max-w-xl mx-auto w-full text-center text-[10px] text-slate-500 pt-3 border-t border-slate-800">
        Direktorat Pengembangan Teknologi dan Sistem Informasi (DPTSI) • Institut Teknologi Sepuluh Nopember Surabaya
      </div>
    </div>
  );
}

export default function PassPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center text-xs">Memverifikasi tiket gerbang CCWS...</div>}>
      <PassContent />
    </Suspense>
  );
}

