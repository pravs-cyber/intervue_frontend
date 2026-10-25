"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import AppShell from "@/components/AppShell";
import { api } from "@/services/api";

const TYPES = [
  { id: "technical", title: "Technical", desc: "DSA, OOP, DBMS, SQL, OS, CN, Java, Python" },
  { id: "hr", title: "HR", desc: "Behavioural and communication questions" },
  { id: "resume", title: "Resume-based", desc: "Questions generated from your resume" },
];
const TOPICS: [string, string][] = [["DSA", "DSA"], ["OOP", "OOP"], ["DBMS", "DBMS"], ["SQL", "SQL"], ["OS", "Operating Systems"], ["CN", "Computer Networks"], ["Java", "Java"], ["Python", "Python"]];

function Setup() {
  const router = useRouter();
  const params = useSearchParams();
  const preset = (params.get("topics") || "").split(",").filter(Boolean);
  const [type, setType] = useState("technical");
  const [topics, setTopics] = useState<string[]>(preset);
  const [num, setNum] = useState(5);
  const [resume, setResume] = useState("");
  const [resumeInfo, setResumeInfo] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const toggle = (t: string) => setTopics((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    try {
      const r = await api.uploadResume(f);
      setResume(r.text);
      setResumeInfo(`Detected skills: ${r.parsed.skills.join(", ") || "none"} · Projects found: ${r.parsed.projects.length}`);
    } catch (err) { setError((err as Error).message); }
  }

  async function start() {
    setBusy(true); setError("");
    try {
      const iv = await api.startInterview({ type, topics, num_questions: num, resume_text: resume });
      router.push(`/interview?id=${iv.id}`);
    } catch (err) { setError((err as Error).message); setBusy(false); }
  }

  return (
    <AppShell>
      <h1 className="mb-6 text-2xl font-bold">Set up your interview</h1>
      <div className="max-w-2xl space-y-6">
        <div>
          <p className="label">Interview type</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {TYPES.map((t) => (
              <button key={t.id} onClick={() => setType(t.id)}
                className={`rounded-xl border p-4 text-left ${type === t.id ? "border-indigo-600 bg-indigo-50" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                <p className="font-semibold">{t.title}</p>
                <p className="mt-1 text-xs text-slate-600">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {type === "technical" && (
          <div>
            <p className="label">Topics <span className="font-normal text-slate-500">(leave empty for all)</span></p>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map(([id, name]) => (
                <button key={id} onClick={() => toggle(id)}
                  className={`rounded-full border px-3 py-1 text-sm ${topics.includes(id) ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 bg-white text-slate-700"}`}>
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {type === "resume" && (
          <div className="space-y-2">
            <label className="label">Upload resume (.pdf or .txt) or paste the text below</label>
            <input type="file" accept=".pdf,.txt" onChange={onFile} className="text-sm" />
            {resumeInfo && <p className="text-xs text-emerald-700">{resumeInfo}</p>}
            <textarea className="input h-40" placeholder="Paste resume text here (use headings like Skills, Projects, Education, Experience)" value={resume} onChange={(e) => setResume(e.target.value)} />
          </div>
        )}

        <div>
          <p className="label">Number of questions</p>
          <div className="flex gap-2">
            {[5, 10].map((n) => (
              <button key={n} onClick={() => setNum(n)} className={`rounded-lg border px-4 py-1.5 text-sm ${num === n ? "border-indigo-600 bg-indigo-50 font-semibold" : "border-slate-300 bg-white"}`}>{n}</button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button className="btn px-6" onClick={start} disabled={busy}>{busy ? "Preparing questions..." : "Start Interview"}</button>
      </div>
    </AppShell>
  );
}

export default function SetupPage() {
  return <Suspense fallback={null}><Setup /></Suspense>;
}
