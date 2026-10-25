import type { Quality } from "@/types";

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

const STATUS_STYLE: Record<string, string> = {
  Strong: "bg-emerald-50 text-emerald-700",
  Developing: "bg-amber-50 text-amber-700",
  "Needs Improvement": "bg-rose-50 text-rose-700",
  "Not attempted": "bg-slate-100 text-slate-500",
};
export function StatusBadge({ status }: { status: string }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[status] ?? STATUS_STYLE["Not attempted"]}`}>{status}</span>;
}

const QUALITY_STYLE: Record<Quality, string> = {
  Poor: "bg-rose-50 text-rose-700 border-rose-200",
  Average: "bg-amber-50 text-amber-700 border-amber-200",
  Good: "bg-sky-50 text-sky-700 border-sky-200",
  Excellent: "bg-emerald-50 text-emerald-700 border-emerald-200",
};
export function QualityBadge({ quality }: { quality: Quality }) {
  return <span className={`rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${QUALITY_STYLE[quality]}`}>{quality}</span>;
}

export function SkillBar({ name, score, status }: { name: string; score: number | null; status?: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{name}</span>
        <span className="flex items-center gap-2">
          {status && <StatusBadge status={status} />}
          <span className="w-10 text-right tabular-nums text-slate-600">{score === null ? "–" : `${score}%`}</span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-indigo-600" style={{ width: `${score ?? 0}%` }} />
      </div>
    </div>
  );
}

export function ScoreLine({ points }: { points: { label: string; score: number }[] }) {
  if (points.length === 0) return <p className="text-sm text-slate-500">Complete an interview to see your score history.</p>;
  const W = 400, H = 150, P = 24;
  const x = (i: number) => (points.length === 1 ? W / 2 : P + (i * (W - 2 * P)) / (points.length - 1));
  const y = (s: number) => H - P - (s / 100) * (H - 2 * P);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.score)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0, 50, 100].map((g) => (
        <g key={g}>
          <line x1={P} x2={W - P} y1={y(g)} y2={y(g)} stroke="#e2e8f0" />
          <text x={2} y={y(g) + 3} fontSize="9" fill="#94a3b8">{g}</text>
        </g>
      ))}
      <path d={d} fill="none" stroke="#4f46e5" strokeWidth="2" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.score)} r="4" fill="#4f46e5" />
          <text x={x(i)} y={y(p.score) - 8} fontSize="9" textAnchor="middle" fill="#475569">{p.score}</text>
        </g>
      ))}
    </svg>
  );
}

export function Spinner({ text = "Loading..." }: { text?: string }) {
  return <p className="p-6 text-sm text-slate-500">{text}</p>;
}

export const TYPE_LABEL: Record<string, string> = { technical: "Technical", hr: "HR", resume: "Resume-based" };
export const fmtDate = (s: string) => new Date(s.replace(" ", "T") + "Z").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
