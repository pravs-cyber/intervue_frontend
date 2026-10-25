"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { QualityBadge, SkillBar, Spinner, StatCard, StatusBadge } from "@/components/Ui";
import { api } from "@/services/api";
import type { InterviewState } from "@/types";

function Result() {
  const id = Number(useSearchParams().get("id"));
  const [iv, setIv] = useState<InterviewState | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { api.getInterview(id).then(setIv).catch((e) => setError(e.message)); }, [id]);

  if (error) return <AppShell><p className="text-rose-600">{error}</p></AppShell>;
  if (!iv) return <AppShell><Spinner /></AppShell>;
  const r = iv.report;
  if (!r) return <AppShell><p>This interview has no report yet. <Link className="text-indigo-600" href={`/interview?id=${id}`}>Continue it</Link>.</p></AppShell>;
  const practice = r.skill_gaps.filter((g) => g.status !== "Strong" && g.skill !== "Communication").map((g) => g.skill).join(",");

  return (
    <AppShell>
      <h1 className="mb-6 text-2xl font-bold">Interview Report</h1>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Overall Score" value={`${r.overall_score}%`} />
          <StatCard label="Technical Skills" value={r.technical_score === null ? "–" : `${r.technical_score}%`} />
          <StatCard label="Communication" value={r.communication_score === null ? "–" : `${r.communication_score}%`} />
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <StatCard label="Questions Answered" value={r.questions_answered} />
          <StatCard label="Good / Excellent" value={r.good_excellent} />
          <StatCard label="Average" value={r.average} />
          <StatCard label="Poor" value={r.poor} />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card space-y-3">
            <h2 className="font-semibold">Skills in this interview</h2>
            {r.skills.map((s) => <SkillBar key={s.skill} name={s.name} score={s.score} status={s.status} />)}
          </div>
          <div className="card space-y-4">
            <div><h2 className="mb-1 font-semibold text-emerald-700">Strong Areas</h2>
              {r.strong_areas.length ? <ul className="list-disc pl-5 text-sm">{r.strong_areas.map((s) => <li key={s}>{s}</li>)}</ul> : <p className="text-sm text-slate-500">None yet – keep practising.</p>}</div>
            <div><h2 className="mb-1 font-semibold text-rose-700">Needs Improvement</h2>
              {r.needs_improvement.length ? <ul className="list-disc pl-5 text-sm">{r.needs_improvement.map((s) => <li key={s}>{s}</li>)}</ul> : <p className="text-sm text-slate-500">Nothing below 60%.</p>}</div>
            <div><h2 className="mb-1 font-semibold">Your Skill Gaps</h2>
              <ol className="list-decimal pl-5 text-sm">{r.skill_gaps.map((g) => <li key={g.skill}>{g.name} – {g.score}% <StatusBadge status={g.status} /></li>)}</ol></div>
            {practice && <Link href={`/interview/setup?topics=${practice}`} className="btn">Practice weak topics</Link>}
          </div>
        </div>

        <div className="card">
          <h2 className="mb-3 font-semibold">Question review</h2>
          <div className="divide-y divide-slate-100">
            {iv.answers.map((a, i) => (
              <div key={i} className="space-y-1 py-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{i + 1}. {a.question}</p>
                  <QualityBadge quality={a.ml_prediction} />
                </div>
                <p className="text-xs text-slate-500">{a.skill} · {a.difficulty} · {a.score}%</p>
                <p className="text-slate-600">Your answer: {a.answer}</p>
                {a.feedback.improve?.length > 0 && <p className="text-slate-600"><b>Improve:</b> {a.feedback.improve.join(" ")}</p>}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3"><Link href="/interview/setup" className="btn">New Interview</Link><Link href="/dashboard" className="btn-outline">Dashboard</Link></div>
      </div>
    </AppShell>
  );
}

export default function ResultPage() {
  return <Suspense fallback={null}><Result /></Suspense>;
}
