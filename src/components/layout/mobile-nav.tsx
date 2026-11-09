"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Users,
  BookOpen,
  Building2,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Mobile navigation items
const mobileNavItems = [
  { title: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { title: "Rekan", href: "/study-partners", icon: Users },
  { title: "Materi", href: "/learning-materials", icon: BookOpen },
  { title: "Reservasi", href: "/facility-booking", icon: Building2 },
  { title: "Peluang", href: "/opportunities", icon: Compass },
  { title: "Profil", href: "/profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-lg",
        "md:hidden" // Only visible on mobile
      )}
    >
      <div className="flex h-16 items-center justify-around px-2">
        {mobileNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/dashboard" && pathname === "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-medium transition-colors min-w-0",
                isActive
                  ? "text-[#013880] font-bold"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg transition-all",
                  isActive && "bg-[#013880]/10 text-[#013880]"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-[#013880]" : "text-slate-400"
                  )}
                />
              </div>
              <span className="leading-tight truncate max-w-full px-0.5">{item.title}</span>
            </Link>
          );
        })}
      </div>

      {/* Safe area spacer for devices with home indicators */}
      <div className="h-safe-area-inset-bottom bg-background" />
    </nav>
  );
}
