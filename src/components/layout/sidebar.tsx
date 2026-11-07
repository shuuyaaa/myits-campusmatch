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
  FileText,
  Send,
  LogOut,
  ChevronLeft,
  GraduationCap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Navigation item type
interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

// Navigation sections
const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Opportunities", href: "/opportunities", icon: Compass },
  { title: "My Matches", href: "/matches", icon: Target },
  { title: "Gap Analysis", href: "/gap-analysis", icon: TrendingUp },
];

const profileNavItems: NavItem[] = [
  { title: "My Profile", href: "/profile", icon: User },
  { title: "CV Upload", href: "/cv-upload", icon: FileText },
];

const organizerNavItems: NavItem[] = [
  { title: "Bagikan Info Peluang", href: "/admin/opportunities", icon: Send },
];

// User info type
interface UserInfo {
  name: string;
  role: string;
  avatarUrl?: string;
  initials?: string;
}

// Sidebar props
interface SidebarProps {
  role?: "STUDENT" | "ADMIN";
  user?: UserInfo;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onLogout?: () => void;
  className?: string;
}

// Navigation link component
function NavLink({
  item,
  isActive,
  collapsed,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
}) {
  const linkContent = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
        isActive
          ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-semibold"
          : "text-muted-foreground hover:text-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary dark:text-blue-400")} />
      {!collapsed && <span>{item.title}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {item.title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}

// Section label component
function SectionLabel({
  label,
  collapsed,
}: {
  label: string;
  collapsed: boolean;
}) {
  if (collapsed) return null;
  return (
    <h4 className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
      {label}
    </h4>
  );
}

export function Sidebar({
  role = "STUDENT",
  user = { name: "Praditya Haekal Islami Al Haqiqi", role: "Departemen Teknik Elektro", initials: "PH" },
  collapsed = false,
  onCollapsedChange,
  onLogout,
  className,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "sticky top-0 z-40 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white dark:bg-slate-900 transition-all duration-300",
          collapsed ? "w-[68px]" : "w-[260px]",
          className
        )}
      >
        {/* Logo / Brand */}
        <div
          className={cn(
            "flex h-16 items-center border-b px-4",
            collapsed ? "justify-center" : "gap-3"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight tracking-tight">
                myITS
              </span>
              <span className="text-xs font-medium leading-tight text-primary dark:text-blue-400">
                CampusMatch
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute -right-3 top-[4.25rem] z-10 h-6 w-6 rounded-full border bg-background shadow-sm hover:bg-accent",
            "hidden md:flex"
          )}
          onClick={() => onCollapsedChange?.(!collapsed)}
        >
          <ChevronLeft
            className={cn(
              "h-3 w-3 transition-transform",
              collapsed && "rotate-180"
            )}
          />
          <span className="sr-only">
            {collapsed ? "Expand sidebar" : "Collapse sidebar"}
          </span>
        </Button>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="flex flex-col gap-6 px-3">
            {/* Main section */}
            <div className="flex flex-col gap-1">
              <SectionLabel label="Navigasi Utama" collapsed={collapsed} />
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={
                    pathname === item.href ||
                    (item.href === "/dashboard" && pathname === "/")
                  }
                  collapsed={collapsed}
                />
              ))}
            </div>

            {/* Profile section */}
            <div className="flex flex-col gap-1">
              <SectionLabel label="Profil & Berkas" collapsed={collapsed} />
              {profileNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                  collapsed={collapsed}
                />
              ))}
            </div>

            {/* Bagikan Info Peluang Section */}
            <div className="flex flex-col gap-1">
              <SectionLabel label="Publikasi Terbuka" collapsed={collapsed} />
              {organizerNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </nav>
        </ScrollArea>

        {/* User info at bottom - Menempel kokoh di dasar sidebar (mentok bawah) */}
        <div className="mt-auto shrink-0 border-t border-slate-200 bg-white dark:bg-slate-900 p-3">
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-xl p-1.5 transition-colors",
              collapsed ? "justify-center" : "bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
            )}
          >
            <Avatar className="h-8 w-8 shrink-0 border border-blue-200">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-blue-600 text-xs font-bold text-white">
                {user.initials || "PH"}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-1 flex-col overflow-hidden min-w-0">
                <span className="truncate text-xs font-bold text-slate-900 dark:text-white">
                  {user.name}
                </span>
                <span className="truncate text-[10px] text-slate-500 font-medium">
                  {user.role}
                </span>
              </div>
            )}
            {!collapsed && (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                    onClick={onLogout}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="sr-only">Logout</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Logout</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
