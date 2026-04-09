"use client";
import { usePathname } from "next/navigation";
import { Search, Briefcase, MessageSquare, User } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/shifts", icon: Search, label: "Ontdek" },
  { href: "/mijn-shifts", icon: Briefcase, label: "Mijn Shifts" },
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/profile", icon: User, label: "Account" },
];

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between bg-surface/90 backdrop-blur-lg border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#EF476F" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-foreground font-bold text-lg">Work<span style={{ color: "#EF476F" }}>Wings</span></span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Content */}
      <main className="flex-1 pb-20">{children}</main>

      {/* Bottom nav — like Temper/YoungOnes */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-lg flex items-center justify-around">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}
                className="flex flex-col items-center gap-0.5 px-3 py-1">
                <item.icon size={22} strokeWidth={active ? 2.5 : 1.5}
                  style={{ color: active ? "#EF476F" : "var(--color-foreground-subtle)" }} />
                <span className="text-[10px] font-semibold"
                  style={{ color: active ? "#EF476F" : "var(--color-foreground-subtle)" }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
