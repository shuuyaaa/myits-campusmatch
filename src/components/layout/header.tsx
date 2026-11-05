"use client";

import * as React from "react";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
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
  className?: string;
}

export function Header({
  title,
  onMenuToggle,
  userName = "Student User",
  userAvatarUrl,
  userInitials = "SU",
  notificationCount = 0,
  theme = "dark",
  onThemeToggle,
  onLogout,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6",
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
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
      </div>

      {/* Search bar - hidden on mobile */}
      <div className="hidden w-full max-w-sm md:flex">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search opportunities, skills..."
            className="w-full pl-8 bg-muted/50"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Search button - mobile only */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>

        {/* Notification bell */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {notificationCount > 9 ? "9+" : notificationCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={onThemeToggle}>
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* User avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatarUrl} alt={userName} />
                <AvatarFallback className="bg-primary/20 text-xs font-semibold text-primary dark:text-blue-400">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  myITS CampusMatch
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
