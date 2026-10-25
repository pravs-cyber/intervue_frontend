import Link from "next/link";

const FEATURES = [
  ["AI Mock Interviews", "Role-based technical, HR and resume-based interviews."],
  ["ML Answer Evaluation", "A trained TF-IDF + Random Forest model rates every answer."],
  ["Adaptive Questions", "Difficulty goes up or down based on how you answer."],
  ["Skill Gap Detection", "See exactly which subjects are holding you back."],
  ["Personalized Feedback", "Specific feedback and a recommended topic after each answer."],
  ["Progress Tracking", "Score history and skill charts across all interviews."],
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-xl font-extrabold tracking-tight text-indigo-600">INTERVUE</span>
        <div className="flex gap-3">
          <Link href="/login" className="btn-outline">Log in</Link>
          <Link href="/register" className="btn">Sign up</Link>
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold leading-tight tracking-tight">Prepare Smarter.<br />Interview Better.</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
          AI-powered mock interviews that evaluate your answers and identify your skill gaps.
        </p>
        <Link href="/register" className="btn mt-8 px-6 py-3 text-base">Start Interview</Link>
      </section>
      <section className="mx-auto grid max-w-5xl gap-4 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(([t, d]) => (
          <div key={t} className="card">
            <h3 className="font-semibold text-slate-900">{t}</h3>
            <p className="mt-1 text-sm text-slate-600">{d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
