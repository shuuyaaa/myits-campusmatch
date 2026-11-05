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
  Settings,
  Users,
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

const adminNavItems: NavItem[] = [
  { title: "Manage Opportunities", href: "/admin/opportunities", icon: Settings },
  { title: "Review Applicants", href: "/admin/applicants", icon: Users },
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
          ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
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
  user = { name: "Student User", role: "Student", initials: "SU" },
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
          "relative flex h-screen flex-col border-r bg-card transition-all duration-300",
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
              <SectionLabel label="Main" collapsed={collapsed} />
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                  collapsed={collapsed}
                />
              ))}
            </div>

            {/* Profile section */}
            <div className="flex flex-col gap-1">
              <SectionLabel label="Profile" collapsed={collapsed} />
              {profileNavItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                  collapsed={collapsed}
                />
              ))}
            </div>

            {/* Admin section - only shown for ADMIN role */}
            {role === "ADMIN" && (
              <div className="flex flex-col gap-1">
                <SectionLabel label="Admin" collapsed={collapsed} />
                {adminNavItems.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            )}
          </nav>
        </ScrollArea>

        {/* User info at bottom */}
        <div className="border-t p-3">
          <Separator className="mb-3 hidden" />
          <div
            className={cn(
              "flex items-center gap-3",
              collapsed && "justify-center"
            )}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-primary/20 text-xs font-semibold text-primary dark:text-blue-400">
                {user.initials || user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-sm font-medium">
                  {user.name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
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
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={onLogout}
                  >
                    <LogOut className="h-4 w-4" />
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
