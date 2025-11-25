"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Search, Calendar, User } from "lucide-react";

const navItems = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/activities", label: "Activities", icon: Search },
  { href: "/app/schedule", label: "Schedule", icon: Calendar },
  { href: "/app/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-bg-cream safe-area-inset-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/app" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-[var(--radius-md)] transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-kidspass-text-muted hover:text-kidspass-text"
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6 transition-transform duration-200",
                  isActive && "scale-110"
                )}
                fill={isActive ? "currentColor" : "none"}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

interface TopNavProps {
  title?: string;
  showBack?: boolean;
  children?: React.ReactNode;
}

export function TopNav({ title, showBack, children }: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link
              href="/app"
              className="p-2 -ml-2 rounded-full hover:bg-bg-cream transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-kidspass-text"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          )}
          {title && (
            <h1 className="text-xl font-bold text-kidspass-text">{title}</h1>
          )}
        </div>
        {children}
      </div>
    </header>
  );
}

export function PublicNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl">🎨</span>
          <span className="text-2xl font-bold text-kidspass-text">KidsPass</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-kidspass-text font-semibold hover:text-primary transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 bg-primary text-kidspass-text font-semibold rounded-full hover:bg-primary-hover transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

