"use client";

import { BottomNav } from "./navbar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg pb-20">
      <main className="max-w-4xl mx-auto px-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

