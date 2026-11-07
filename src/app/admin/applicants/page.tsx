"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../../../components/layout/sidebar";
import { Header } from "../../../components/layout/header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Send, CheckCircle2, ArrowRight } from "lucide-react";

export default function ApplicantsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect after a brief moment
    const timer = setTimeout(() => {
      router.push("/admin/opportunities");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        role="ADMIN"
        user={{
          name: "Portal Penyelenggara",
          role: "Publikasi Rekrutmen ITS",
          initials: "PP",
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Publikasi Lowongan" userName="PIC Penyelenggara" />

        <main className="flex-1 p-6 flex items-center justify-center">
          <Card className="max-w-md w-full text-center p-6 border-slate-200 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Send className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold text-slate-900">
                Pusat Publikasi Lowongan Oprec
              </CardTitle>
              <CardDescription className="text-xs text-slate-600 leading-relaxed">
                Pendaftaran peserta dikelola langsung oleh masing-masing penyelenggara melalui Google Form resmi. Mengalihkan Anda ke halaman Publikasi Lowongan...
              </CardDescription>
            </div>
            <Button
              onClick={() => router.push("/admin/opportunities")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 font-semibold w-full"
            >
              Buka Publikasi Lowongan Sekarang
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Card>
        </main>
      </div>
    </div>
  );
}
