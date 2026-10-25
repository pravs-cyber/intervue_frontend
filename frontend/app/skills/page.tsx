"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { SkillBar, Spinner, StatusBadge } from "@/components/Ui";
import { api } from "@/services/api";
import type { SkillScore } from "@/types";

export default function SkillsPage() {
  const [data, setData] = useState<{ skills: SkillScore[]; gaps: SkillScore[] } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { api.skills().then(setData).catch((e) => setError(e.message)); }, []);
  const practice = data?.gaps.filter((g) => g.skill !== "Communication" && g.status !== "Strong").map((g) => g.skill).join(",");

  return (
    <AppShell>
      <h1 className="mb-6 text-2xl font-bold">Skills</h1>
      {error && <p className="text-rose-600">{error}</p>}
      {!data ? <Spinner /> : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card space-y-4">
            <h2 className="font-semibold">All skill scores</h2>
            {data.skills.map((s) => <SkillBar key={s.skill} name={s.name} score={s.score} status={s.status} />)}
            <p className="text-xs text-slate-500">Below 60% = Needs Improvement · 60–75% = Developing · Above 75% = Strong</p>
          </div>
          <div className="card">
            <h2 className="mb-3 font-semibold">Your Skill Gaps</h2>
            {data.gaps.length === 0 ? <p className="text-sm text-slate-500">Complete an interview to detect your skill gaps.</p> : (
              <>
                <ol className="space-y-2">
                  {data.gaps.map((g, i) => (
                    <li key={g.skill} className="flex items-center justify-between text-sm">
                      <span>{i + 1}. {g.name} – {g.score}%</span><StatusBadge status={g.status} />
                    </li>
                  ))}
                </ol>
                {practice && <Link href={`/interview/setup?topics=${practice}`} className="btn mt-5">Practice these topics</Link>}
              </>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
