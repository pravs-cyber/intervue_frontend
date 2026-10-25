import type { AnswerResult, Dashboard, HistoryItem, InterviewState, SkillScore, User } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const auth = {
  token: () => (typeof window === "undefined" ? null : localStorage.getItem("token")),
  save: (token: string, user: User) => { localStorage.setItem("token", token); localStorage.setItem("user", JSON.stringify(user)); },
  user: (): User | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  },
  clear: () => { localStorage.removeItem("token"); localStorage.removeItem("user"); },
};

async function request<T>(path: string, options: RequestInit = {}, isForm = false): Promise<T> {
  const headers: Record<string, string> = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  const token = auth.token();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { ...options, headers });
  } catch {
    throw new Error("Cannot reach the backend. Is it running on " + BASE + "?");
  }
  if (res.status === 401 && token) {
    auth.clear();
    window.location.href = "/login";
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = Array.isArray(body.detail) ? body.detail.map((d: { msg: string }) => d.msg).join(", ") : body.detail;
    throw new Error(detail || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

const post = (body: unknown) => ({ method: "POST", body: JSON.stringify(body) });

export const api = {
  register: (b: { name: string; email: string; password: string; target_role: string }) =>
    request<{ token: string; user: User }>("/api/auth/register", post(b)),
  login: (b: { email: string; password: string }) => request<{ token: string; user: User }>("/api/auth/login", post(b)),
  updateProfile: (b: { name: string; target_role: string }) => request<User>("/api/me", { method: "PUT", body: JSON.stringify(b) }),
  uploadResume: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<{ text: string; parsed: { skills: string[]; projects: string[] } }>("/api/resume", { method: "POST", body: form }, true);
  },
  startInterview: (b: { type: string; topics: string[]; num_questions: number; resume_text: string }) =>
    request<InterviewState>("/api/interviews", post(b)),
  getInterview: (id: number) => request<InterviewState>(`/api/interviews/${id}`),
  submitAnswer: (id: number, answer: string) => request<AnswerResult>(`/api/interviews/${id}/answer`, post({ answer })),
  dashboard: () => request<Dashboard>("/api/dashboard"),
  skills: () => request<{ skills: SkillScore[]; gaps: SkillScore[] }>("/api/skills"),
  history: () => request<{ interviews: HistoryItem[] }>("/api/history"),
  deleteInterview: (id: number) => request<{ deleted: number }>(`/api/interviews/${id}`, { method: "DELETE" }),
  deleteHistory: () => request<{ deleted: number }>("/api/history", { method: "DELETE" }),
};
