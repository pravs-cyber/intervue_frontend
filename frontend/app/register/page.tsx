"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, auth } from "@/services/api";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", target_role: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const r = await api.register(form);
      auth.save(r.token, r.user);
      router.push("/dashboard");
    } catch (err) { setError((err as Error).message); } finally { setBusy(false); }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold">Create your <span className="text-indigo-600">Intervue</span> account</h1>
        <div><label className="label">Name</label><input className="input" required value={form.name} onChange={set("name")} /></div>
        <div><label className="label">Email</label><input className="input" type="email" required value={form.email} onChange={set("email")} /></div>
        <div><label className="label">Password (min 8 characters)</label><input className="input" type="password" minLength={8} required value={form.password} onChange={set("password")} /></div>
        <div><label className="label">Target role (optional)</label><input className="input" placeholder="e.g. Data Science Fresher" value={form.target_role} onChange={set("target_role")} /></div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button className="btn w-full" disabled={busy}>{busy ? "Creating..." : "Register"}</button>
        <p className="text-center text-sm text-slate-600">Already registered? <Link href="/login" className="font-medium text-indigo-600">Log in</Link></p>
      </form>
    </div>
  );
}
