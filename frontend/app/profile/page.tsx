"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { api, auth } from "@/services/api";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const u = auth.user();
    if (u) { setName(u.name); setRole(u.target_role); setEmail(u.email); }
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      const u = await api.updateProfile({ name, target_role: role });
      auth.save(auth.token() as string, u);
      setMsg("Profile saved.");
    } catch (err) { setMsg((err as Error).message); }
  }

  return (
    <AppShell>
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>
      <form onSubmit={save} className="card max-w-md space-y-4">
        <div><label className="label">Email</label><input className="input bg-slate-50" value={email} disabled /></div>
        <div><label className="label">Name</label><input className="input" required value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div><label className="label">Target role</label><input className="input" value={role} onChange={(e) => setRole(e.target.value)} /></div>
        {msg && <p className="text-sm text-slate-600">{msg}</p>}
        <div className="flex gap-3">
          <button className="btn">Save</button>
          <button type="button" className="btn-outline" onClick={() => { auth.clear(); router.push("/"); }}>Log out</button>
        </div>
      </form>
    </AppShell>
  );
}
