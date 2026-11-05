"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Sparkles,
  X,
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
  searchPlaceholder = "Cari beasiswa, ormawa, keahlian, atau komite...",
  className,
}: HeaderProps) {
  const router = useRouter();
  const [internalQuery, setInternalQuery] = React.useState(searchQuery);
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);

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
        className="shrink-0 md:hidden"
        onClick={onMenuToggle}
      >
        <Menu className="h-5 w-5 text-slate-700" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-slate-900 md:text-xl truncate">{title}</h1>
      </div>

      {/* Search bar - hidden on mobile */}
      <form onSubmit={handleSearchSubmit} className="hidden w-full max-w-md md:flex">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            value={internalQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-8 bg-slate-50 border-slate-200 text-xs md:text-sm focus-visible:ring-blue-600 rounded-full"
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

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Search button - mobile only */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-slate-600"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>

        {/* AI Badge Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-semibold text-blue-700">
          <Sparkles className="h-3 w-3 text-blue-600 animate-pulse" />
          <span>AI Engine Ready</span>
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
              <span className="sr-only">Notifikasi</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-2" align="end">
            <div className="px-2 py-1.5 text-xs font-bold text-slate-900 border-b border-slate-100 flex justify-between items-center">
              <span>Pemberitahuan Sistem</span>
              <span className="text-[10px] text-blue-600 font-medium">3 Baru</span>
            </div>
            <div className="space-y-1.5 py-2">
              <div className="p-2 rounded-lg bg-blue-50/60 hover:bg-blue-50 cursor-pointer text-xs">
                <p className="font-semibold text-slate-800">Pencocokan Beasiswa KSE: 95% Match</p>
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
              className="relative h-9 w-9 rounded-full ring-2 ring-blue-100 hover:ring-blue-300 transition-all p-0"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={userAvatarUrl} alt={userName} />
                <AvatarFallback className="bg-blue-600 text-xs font-bold text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
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
              <User className="mr-2 h-4 w-4 text-blue-600" />
              <span>Profil Lengkap Saya</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/matches")}>
              <Sparkles className="mr-2 h-4 w-4 text-indigo-600" />
              <span>Hasil Pencocokan (My Matches)</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/gap-analysis")}>
              <Settings className="mr-2 h-4 w-4 text-slate-600" />
              <span>Analisis Kesenjangan (Gap)</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout || (() => router.push("/"))} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar / Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile search expanded form */}
      {mobileSearchOpen && (
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
            <Button size="sm" type="submit" className="bg-blue-600 text-white">
              Cari
            </Button>
          </form>
        </div>
      )}
    </header>
  );
}
