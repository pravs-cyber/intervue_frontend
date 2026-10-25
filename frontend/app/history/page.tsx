"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { Spinner, TYPE_LABEL, fmtDate } from "@/components/Ui";
import { api } from "@/services/api";
import type { HistoryItem } from "@/types";

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const [error, setError] = useState("");
  const load = () => api.history().then((r) => setItems(r.interviews)).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);
  const remove = async (id?: number) => {
    if (!confirm(id ? "Delete this interview and its answers?" : "Delete ALL interview history? Skill scores will be reset.")) return;
    try { await (id ? api.deleteInterview(id) : api.deleteHistory()); load(); } catch (e) { setError((e as Error).message); }
  };

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between"><h1 className="text-2xl font-bold">Interview History</h1>
        {!!items?.length && <button className="text-sm text-rose-600" onClick={() => remove()}>Delete all history</button>}</div>
      {error && <p className="text-rose-600">{error}</p>}
      {!items ? <Spinner /> : items.length === 0 ? <p className="text-slate-500">No interviews yet.</p> : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr><th className="p-3">Date</th><th className="p-3">Type</th><th className="p-3">Questions</th><th className="p-3">Score</th><th className="p-3" /></tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id} className="border-b border-slate-100 last:border-0">
                  <td className="p-3">{fmtDate(i.created_at)}</td>
                  <td className="p-3">{TYPE_LABEL[i.type]}</td>
                  <td className="p-3">{i.answered} / {i.total_questions}</td>
                  <td className="p-3 font-semibold">{i.score === null ? "In progress" : `${i.score}%`}</td>
                  <td className="p-3 text-right"><Link className="text-indigo-600" href={i.status === "completed" ? `/interview/result?id=${i.id}` : `/interview?id=${i.id}`}>{i.status === "completed" ? "View report" : "Resume"}</Link>
                    <button className="ml-4 text-rose-600" onClick={() => remove(i.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
