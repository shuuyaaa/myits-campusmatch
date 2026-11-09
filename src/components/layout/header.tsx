"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Sparkles,
  X,
  GraduationCap,
  LayoutDashboard,
  Compass,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Building2,
  FileText,
  Send,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Drawer Nav Items in Indonesian
const drawerNavItems = [
  {
    category: "Navigasi Utama",
    items: [
      { title: "Beranda Utama", href: "/dashboard", icon: LayoutDashboard },
      { title: "Katalog Peluang", href: "/opportunities", icon: Compass },
      { title: "Rekomendasi Peluang", href: "/matches", icon: Target },
      { title: "Analisis Kualifikasi", href: "/gap-analysis", icon: TrendingUp },
    ],
  },
  {
    category: "Pilar Smarter Campus",
    items: [
      { title: "Rekan Belajar", href: "/study-partners", icon: Users },
      { title: "Materi & Bank Soal", href: "/learning-materials", icon: BookOpen },
      { title: "Reservasi CCWS & Fasilitas", href: "/facility-booking", icon: Building2 },
    ],
  },
  {
    category: "Profil & Portofolio",
    items: [
      { title: "Profil Mahasiswa", href: "/profile", icon: User },
      { title: "Unggah & Analisis CV", href: "/cv-upload", icon: FileText },
      { title: "Publikasi Peluang Baru", href: "/admin/opportunities", icon: Send },
    ],
  },
];

interface HeaderProps {
  /** Current page title */
  title: string;
  /** Callback to toggle mobile sidebar */
  onMenuToggle?: () => void;
  /** User display name */
  userName?: string;
  /** User avatar URL */
  userAvatarUrl?: string;
  /** User initials fallback */
  userInitials?: string;
  /** Number of unread notifications */
  notificationCount?: number;
  /** Current theme */
  theme?: "light" | "dark";
  /** Theme toggle callback */
  onThemeToggle?: () => void;
  /** Logout callback */
  onLogout?: () => void;
  /** Search callback for current page */
  onSearch?: (query: string) => void;
  /** Search query state */
  searchQuery?: string;
  /** Placeholder for search */
  searchPlaceholder?: string;
  /** Whether to show the search input (defaults to true) */
  showSearch?: boolean;
  className?: string;
}

export function Header({
  title,
  onMenuToggle,
  userName = "Praditya Haekal Islami Al Haqiqi",
  userAvatarUrl,
  userInitials = "PH",
  notificationCount = 3,
  theme = "light",
  onThemeToggle,
  onLogout,
  onSearch,
  searchQuery = "",
  searchPlaceholder = "Cari materi kuliah, peluang lomba, rekan riset...",
  showSearch = true,
  className,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [internalQuery, setInternalQuery] = React.useState(searchQuery);
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    setInternalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(internalQuery);
    } else {
      router.push(`/opportunities?search=${encodeURIComponent(internalQuery)}`);
    }
  };

  const handleInputChange = (val: string) => {
    setInternalQuery(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  const clearSearch = () => {
    setInternalQuery("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 md:px-6 shadow-sm",
          className
        )}
      >
        {/* Mobile hamburger menu */}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden text-slate-700 hover:text-slate-900"
          onClick={() => {
            if (onMenuToggle) {
              onMenuToggle();
            } else {
              setMobileDrawerOpen(true);
            }
          }}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Buka menu navigasi</span>
        </Button>

        {/* Page title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-slate-900 md:text-xl truncate">{title}</h1>
        </div>

        {/* Search bar - hidden on mobile (only when showSearch is true) */}
        {showSearch && (
          <form onSubmit={handleSearchSubmit} className="hidden w-full max-w-md md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                value={internalQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-8 bg-slate-50 border-slate-200 text-xs md:text-sm focus-visible:ring-[#013880] rounded-full"
              />
              {internalQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        )}

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Search button - mobile only */}
          {showSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-600"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Pencarian</span>
            </Button>
          )}

          {/* AI Badge Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#013880]/10 border border-[#013880]/20 text-[11px] font-bold text-[#013880]">
            <Sparkles className="h-3 w-3 text-[#013880] animate-pulse" />
            <span>Asisten AI myITS Siap</span>
          </div>

          {/* Notification bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-slate-900">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[9px] bg-red-600"
                  >
                    {notificationCount}
                  </Badge>
                )}
                <span className="sr-only">Pemberitahuan</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-2" align="end">
              <div className="px-2 py-1.5 text-xs font-bold text-slate-900 border-b border-slate-100 flex justify-between items-center">
                <span>Pemberitahuan Sistem</span>
                <span className="text-[10px] text-[#013880] font-bold">3 Baru</span>
              </div>
              <div className="space-y-1.5 py-2">
                <div className="p-2 rounded-lg bg-blue-50/60 hover:bg-blue-50 cursor-pointer text-xs">
                  <p className="font-semibold text-slate-800">Pencocokan Beasiswa KSE: 95% Cocok</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Batas pendaftaran tersisa 15 hari lagi.</p>
                </div>
                <div className="p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs">
                  <p className="font-semibold text-slate-800">Staff Ahli HIMATEKTRO Terbuka</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Sesuai dengan keahlian Arduino & C++ Anda.</p>
                </div>
                <div className="p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-xs">
                  <p className="font-semibold text-slate-800">Scan CV Terbaru Sukses</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">8 Peluang baru kini teridentifikasi.</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full ring-2 ring-blue-100 hover:ring-[#013880]/30 transition-all p-0 overflow-hidden"
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#013880] to-[#0D47A1] flex items-center justify-center text-white shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold text-slate-800">{userName}</p>
                  <p className="text-xs text-slate-500">
                    S1 Teknik Elektro FTEIC ITS
                  </p>
                  <Badge variant="outline" className="w-fit text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 mt-1">
                    Mahasiswa Aktif (IPK 3.72)
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4 text-[#013880]" />
                <span>Profil Lengkap Saya</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/matches")}>
                <Sparkles className="mr-2 h-4 w-4 text-[#013880]" />
                <span>Rekomendasi Peluang (Matches)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/gap-analysis")}>
                <Settings className="mr-2 h-4 w-4 text-slate-600" />
                <span>Analisis Kualifikasi (Gap)</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout || (() => router.push("/"))} className="text-red-600 font-medium">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar dari Akun (Logout)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile search expanded form */}
        {showSearch && mobileSearchOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white p-3 border-b border-slate-200 md:hidden z-30 shadow-md">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <Input
                type="search"
                value={internalQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Cari peluang..."
                className="w-full text-xs"
                autoFocus
              />
              <Button size="sm" type="submit" className="bg-gradient-to-r from-[#013880] to-[#0D47A1] text-white">
                Cari
              </Button>
            </form>
          </div>
        )}
      </header>

      {/* MOBILE SLIDE-OVER NAVIGATION DRAWER (FOR SMARTPHONE & TABLET) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Slide-Over Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-[285px] max-w-[85vw] bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-250 border-r border-slate-200">
            {/* Drawer Header Brand */}
            <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#013880] to-[#0D47A1] text-white shadow-xs">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold leading-tight tracking-tight text-slate-900">
                    myITS
                  </span>
                  <span className="text-[11px] font-bold leading-tight text-[#013880]">
                    CampusMatch
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-slate-800"
                onClick={() => setMobileDrawerOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Drawer Navigation Links */}
            <div className="flex-1 overflow-y-auto p-3 space-y-5 text-xs">
              {drawerNavItems.map((group) => (
                <div key={group.category} className="space-y-1">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {group.category}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href === "/dashboard" && pathname === "/");
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileDrawerOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all min-h-[44px]",
                            isActive
                              ? "bg-[#013880]/10 text-[#013880] font-bold"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-4 w-4 shrink-0",
                              isActive ? "text-[#013880]" : "text-slate-400"
                            )}
                          />
                          <span>{item.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Profile Identity Info */}
            <div className="border-t border-slate-100 p-3 bg-slate-50">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-[#013880] to-[#0D47A1] text-xs font-bold text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="truncate text-xs font-bold text-slate-900">
                    {userName}
                  </span>
                  <span className="truncate text-[10px] text-slate-500">
                    S1 Teknik Elektro (5009221000)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
