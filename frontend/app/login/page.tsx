"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, auth } from "@/services/api";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const r = await api.login({ email, password });
      auth.save(r.token, r.user);
      router.push("/dashboard");
    } catch (err) { setError((err as Error).message); } finally { setBusy(false); }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold">Log in to <span className="text-indigo-600">Intervue</span></h1>
        <div><label className="label">Email</label><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><label className="label">Password</label><input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button className="btn w-full" disabled={busy}>{busy ? "Logging in..." : "Log in"}</button>
        <p className="text-center text-sm text-slate-600">No account? <Link href="/register" className="font-medium text-indigo-600">Register</Link></p>
      </form>
    </div>
  );
}
