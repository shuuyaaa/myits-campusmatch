"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Target,
  TrendingUp,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Mobile navigation items (limited to 5 for bottom bar)
const mobileNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Explore", href: "/opportunities", icon: Compass },
  { title: "Matches", href: "/matches", icon: Target },
  { title: "Gap", href: "/gap-analysis", icon: TrendingUp },
  { title: "Profile", href: "/profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "md:hidden" // Only visible on mobile
      )}
    >
      <div className="flex h-16 items-center justify-around px-2">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary dark:text-blue-400"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg transition-all",
                  isActive && "bg-primary/10 dark:bg-primary/20"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4",
                    isActive && "text-primary dark:text-blue-400"
                  )}
                />
              </div>
              <span className="leading-none">{item.title}</span>
            </Link>
          );
        })}
      </div>

      {/* Safe area spacer for devices with home indicators */}
      <div className="h-safe-area-inset-bottom bg-background" />
    </nav>
  );
}
