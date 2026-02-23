"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { keys } from "@/lib/i18n/keys";
import { ChevronDown, ArrowUpRight, LogOut, LayoutDashboard, PlusCircle, MessageSquarePlus, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import ScrollRotatingAsterisk from "../custom/ScrollingRotatingAsterisk";
import { useAuthStore } from "@/stores/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateEventDialog } from "@/components/dialogs/create-event-dialog";
import { CreateForumDialog } from "@/components/dialogs/create-forum-dialog";
import { LanguageSwitcher } from "@/components/locale/language-switcher";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { labelKey: keys.nav.sharing, href: "/events", textKey: keys.nav.events },
  { labelKey: keys.nav.innovation, href: "/forums", textKey: keys.nav.forums },
  { labelKey: keys.nav.dashboard, href: "/dashboard", textKey: keys.nav.dashboard },
];

function isNavItemActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  if (href !== "/" && pathname.startsWith(href + "/")) return true;
  return false;
}

function getInitials(user: User) {
  const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "";
  if (typeof name === "string" && name.includes(" ")) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return (name as string).slice(0, 2).toUpperCase() || "U";
}

export function Navbar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [createForumOpen, setCreateForumOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full flex">
      {/* Left: Green box - white asterisk only */}
      <div className="flex items-center justify-center min-h-[80px] p-4 bg-primary shrink-0">
      <ScrollRotatingAsterisk
        size="size-8"
        mode="scroll"
        fill="current"
        color="text-white"
      />
      </div>

      {/* Mapinly text - outside green box */}
      <div className="flex flex-col justify-center min-h-[80px] pl-4 pr-2 md:pl-6 md:pr-4 bg-black/70 backdrop-blur-md text-white shrink-0">
        <Link href="/">
          <span className="font-semibold text-base md:text-lg leading-tight">{t(keys.nav.brand)}</span>
        </Link>
      </div>

      {/* Center: Nav links (desktop only) */}
      <nav
        className={cn(
          "flex-1 hidden md:flex items-center justify-center gap-4 sm:gap-6 md:gap-10 px-4 md:px-8 min-h-[80px]",
          "bg-black/70 backdrop-blur-md text-white"
        )}
      >
        {navItems.map((item) => {
          const active = isNavItemActive(pathname ?? "", item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col gap-0.5 group"
            >
              <span
                className={cn(
                  "text-xs hidden sm:block",
                  active ? "text-white/70" : "text-white/50"
                )}
              >
                {t(item.labelKey)}
              </span>
              <span
                className={cn(
                  "font-medium transition-colors text-sm md:text-base",
                  active ? "text-white" : "text-white/60 group-hover:text-white"
                )}
              >
                {t(item.textKey)}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Right: Language + user (desktop) or hamburger (mobile); on mobile grows to fill width so navbar is full width */}
      <div className="flex flex-1 min-w-0 items-stretch justify-end bg-black/70 backdrop-blur-md text-white md:flex-initial md:shrink-0 md:justify-start md:items-center">
        <div className="hidden md:flex items-center gap-4 px-4 md:px-6">
          <LanguageSwitcher />
        </div>
        {user ? (
          <div className="hidden md:flex md:items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 focus:outline-none"
                  aria-label={t(keys.nav.openUserMenu)}
                >
                  <Avatar className="size-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt="" />
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="size-4 text-white/70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-40 border border-white/20 rounded-none bg-black/90 text-white backdrop-blur-md"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="flex cursor-pointer items-center gap-2 focus:bg-white/10 focus:text-white data-highlighted:bg-white/10"
                  >
                    <LayoutDashboard className="size-4" />
                    {t(keys.nav.dashboard)}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCreateEventOpen(true)}
                  className="flex cursor-pointer items-center gap-2 focus:bg-white/10 focus:text-white data-highlighted:bg-white/10"
                >
                  <PlusCircle className="size-4" />
                  {t(keys.nav.createEvent)}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCreateForumOpen(true)}
                  className="flex cursor-pointer items-center gap-2 focus:bg-white/10 focus:text-white data-highlighted:bg-white/10"
                >
                  <MessageSquarePlus className="size-4" />
                  {t(keys.nav.createForum)}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer focus:bg-white/10 focus:text-white data-highlighted:bg-white/10"
                >
                  <LogOut className="size-4" />
                  {t(keys.nav.signOut)}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Link
            href="/auth"
            className={cn(
              "hidden md:flex items-center justify-center gap-2 px-4 md:px-6",
              "bg-secondary text-secondary-foreground",
              "font-medium text-sm",
              "hover:bg-secondary/90 transition-colors"
            )}
          >
            {t(keys.nav.login)}
            <ArrowUpRight className="size-4" />
          </Link>
        )}

        {/* Mobile menu: hamburger + sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="md:hidden flex items-center justify-center p-4 text-white focus:outline-none"
              aria-label={t(keys.nav.openUserMenu)}
            >
              <Menu className="size-6" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full max-w-sm border-white/20 bg-black/95 text-white rounded-none p-0"
          >
            <div className="flex flex-col gap-6 px-6 pt-14 pb-8">
              {navItems.map((item) => {
                const active = isNavItemActive(pathname ?? "", item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex flex-col gap-0.5 py-2",
                      active ? "text-white" : "text-white/70"
                    )}
                  >
                    <span className="text-xs text-white/50">{t(item.labelKey)}</span>
                    <span className="font-medium">{t(item.textKey)}</span>
                  </Link>
                );
              })}
              <div className="border-t border-white/20 pt-4">
                <LanguageSwitcher />
              </div>
              {user ? (
                <div className="border-t border-white/20 pt-4 flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-white/90 hover:text-white"
                  >
                    <LayoutDashboard className="size-4" />
                    {t(keys.nav.dashboard)}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setCreateEventOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 py-2 text-left text-white/90 hover:text-white"
                  >
                    <PlusCircle className="size-4" />
                    {t(keys.nav.createEvent)}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCreateForumOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 py-2 text-left text-white/90 hover:text-white"
                  >
                    <MessageSquarePlus className="size-4" />
                    {t(keys.nav.createForum)}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 py-2 text-left text-white/90 hover:text-white"
                  >
                    <LogOut className="size-4" />
                    {t(keys.nav.signOut)}
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 mt-2",
                    "bg-secondary text-secondary-foreground",
                    "font-medium text-sm rounded-none",
                    "hover:bg-secondary/90 transition-colors"
                  )}
                >
                  {t(keys.nav.login)}
                  <ArrowUpRight className="size-4" />
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <CreateEventDialog open={createEventOpen} onOpenChange={setCreateEventOpen} />
      <CreateForumDialog open={createForumOpen} onOpenChange={setCreateForumOpen} />
    </header>
  );
}
