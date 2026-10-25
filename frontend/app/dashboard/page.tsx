"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { ScoreLine, SkillBar, Spinner, StatCard, TYPE_LABEL, fmtDate } from "@/components/Ui";
import { api } from "@/services/api";
import type { Dashboard } from "@/types";

export default function DashboardPage() {
  const [d, setD] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { api.dashboard().then(setD).catch((e) => setError(e.message)); }, []);

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/interview/setup" className="btn">Start Interview</Link>
      </div>
      {error && <p className="text-rose-600">{error}</p>}
      {!d ? <Spinner /> : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Interviews" value={d.total_interviews} />
            <StatCard label="Average Score" value={d.average_score === null ? "–" : `${d.average_score}%`} />
            <StatCard label="Strongest Skill" value={d.strongest_skill ?? "–"} />
            <StatCard label="Weakest Skill" value={d.weakest_skill ?? "–"} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card space-y-3">
              <h2 className="font-semibold">Skill Scores</h2>
              {d.skills.map((s) => <SkillBar key={s.skill} name={s.name} score={s.score} />)}
            </div>
            <div className="card">
              <h2 className="mb-3 font-semibold">Interview Score History</h2>
              <ScoreLine points={d.score_history.map((h) => ({ label: String(h.id), score: Math.round(h.score) }))} />
            </div>
          </div>
          <div className="card">
            <h2 className="mb-3 font-semibold">Recent Interviews</h2>
            {d.recent.length === 0 ? <p className="text-sm text-slate-500">No interviews yet. Start your first one!</p> : (
              <ul className="divide-y divide-slate-100">
                {d.recent.map((r) => (
                  <li key={r.id} className="flex items-center justify-between py-2 text-sm">
                    <span>{TYPE_LABEL[r.type]} interview · {fmtDate(r.created_at)}</span>
                    <span className="flex items-center gap-4">
                      <span className="font-semibold">{r.score === null ? "In progress" : `${r.score}%`}</span>
                      <Link className="text-indigo-600" href={r.status === "completed" ? `/interview/result?id=${r.id}` : `/interview?id=${r.id}`}>
                        {r.status === "completed" ? "Report" : "Resume"}
                      </Link>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
