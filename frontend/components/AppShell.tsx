"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/services/api";
import type { User } from "@/types";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/interview/setup", label: "New Interview" },
  { href: "/skills", label: "Skills" },
  { href: "/history", label: "History" },
  { href: "/profile", label: "Profile" },
];

export default function AppShell({ children, minimal = false }: { children: React.ReactNode; minimal?: boolean }) {
  const router = useRouter();
  const path = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!auth.token()) { router.replace("/login"); return; }
    setUser(auth.user());
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <div className="flex min-h-screen">
      {!minimal && (
        <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-4 md:flex">
          <Link href="/dashboard" className="mb-8 px-2 text-xl font-extrabold tracking-tight text-indigo-600">INTERVUE</Link>
          <nav className="flex flex-1 flex-col gap-1">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${path === n.href ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"}`}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-slate-200 pt-3 text-sm">
            <p className="truncate font-medium">{user?.name}</p>
            <button className="mt-1 text-slate-500 hover:text-slate-900" onClick={() => { auth.clear(); router.push("/"); }}>Log out</button>
          </div>
        </aside>
      )}
      <main className="flex-1 p-4 md:p-8">
        {minimal && <p className="mb-6 text-lg font-extrabold tracking-tight text-indigo-600">INTERVUE</p>}
        {!minimal && (
          <div className="mb-4 flex gap-3 overflow-x-auto md:hidden">
            {NAV.map((n) => <Link key={n.href} href={n.href} className="whitespace-nowrap text-sm font-medium text-indigo-700">{n.label}</Link>)}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
