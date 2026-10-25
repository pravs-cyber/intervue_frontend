"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { QualityBadge, Spinner } from "@/components/Ui";
import { api } from "@/services/api";
import type { AnswerResult, Question } from "@/types";

function Interview() {
  const router = useRouter();
  const id = Number(useSearchParams().get("id"));
  const [question, setQuestion] = useState<Question | null>(null);
  const [answered, setAnswered] = useState(0);
  const [total, setTotal] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) { router.replace("/interview/setup"); return; }
    api.getInterview(id).then((iv) => {
      if (iv.status === "completed") { router.replace(`/interview/result?id=${id}`); return; }
      setQuestion(iv.current_question); setAnswered(iv.answered); setTotal(iv.total_questions);
    }).catch((e) => setError(e.message));
  }, [id, router]);

  async function submit() {
    if (!answer.trim()) return;
    setBusy(true); setError("");
    try {
      const r = await api.submitAnswer(id, answer);
      setResult(r); setAnswered(r.answered);
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }

  function next() {
    if (!result) return;
    if (result.completed) { router.push(`/interview/result?id=${id}`); return; }
    setQuestion(result.next_question); setResult(null); setAnswer("");
  }

  if (error && !question) return <AppShell minimal><p className="text-rose-600">{error}</p><Link href="/dashboard" className="text-indigo-600">Back to dashboard</Link></AppShell>;
  if (!question) return <AppShell minimal><Spinner /></AppShell>;

  const shown = result ? result.question : question;
  const fb = result?.feedback;
  const pct = Math.round(((result ? answered : answered) / Math.max(total, 1)) * 100);

  return (
    <AppShell minimal>
      <div className="mx-auto max-w-2xl space-y-5">
        <div>
          <div className="mb-1 flex justify-between text-sm text-slate-600">
            <span>Question {answered + (result ? 0 : 1)} / {total}</span>
            <span>Skill: <b>{shown.skill_name}</b> · Difficulty: <b>{shown.difficulty}</b></span>
          </div>
          <div className="h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${pct}%` }} /></div>
        </div>

        <div className="card">
          <p className="text-lg font-medium leading-relaxed">{shown.question}</p>
        </div>

        {!result ? (
          <>
            <textarea className="input h-48" placeholder="Type your answer here..." value={answer} onChange={(e) => setAnswer(e.target.value)} disabled={busy} />
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <div className="flex justify-end"><button className="btn px-6" onClick={submit} disabled={busy || !answer.trim()}>{busy ? "Evaluating..." : "Submit Answer"}</button></div>
          </>
        ) : (
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><span className="text-sm text-slate-500">Predicted Answer Category</span><QualityBadge quality={result.ml_prediction} /></div>
              <span className="text-xl font-bold">{Math.round(result.score)}%</span>
            </div>
            {result.question?.type === "hr" && <p className="text-xs text-amber-700">HR answer: this category comes from the model trained on technical answers and is not validated for HR questions.</p>}
            <p className="text-xs text-slate-500">Model agreement {Math.round((result.model_agreement ?? 0) * 100)}%{(result.model_agreement ?? 1) < 0.5 && " - the classifier is unsure about this one"}</p>
            <p className="text-sm text-slate-700">{fb?.summary}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><p className="mb-1 text-sm font-semibold text-emerald-700">What went well</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">{fb?.went_well.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
              <div><p className="mb-1 text-sm font-semibold text-amber-700">What to improve</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">{fb?.improve.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
            </div>
            {!!fb?.missing?.length && <div><p className="mb-1 text-sm font-semibold text-rose-700">What was missing</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">{fb.missing.map((x, i) => <li key={i}>{x}</li>)}</ul></div>}
            {fb?.evaluation_consistency === "questionable" && <p className="text-xs text-amber-700">The feedback assistant flagged this category as questionable. The category still comes from the ML classifier.</p>}
            <p className="text-sm"><span className="font-semibold">Recommended topic:</span> {fb?.recommended_topic}</p>
            {fb?.source === "template" && <p className="text-xs text-slate-400">Feedback is template-based because no AI_API_KEY is configured. The category above comes from the trained ML classifier.</p>}
            <div className="flex justify-end"><button className="btn px-6" onClick={next}>{result.completed ? "View Report" : "Continue Interview"}</button></div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function InterviewPage() {
  return <Suspense fallback={null}><Interview /></Suspense>;
}
