export type Quality = "Poor" | "Average" | "Good" | "Excellent";

export interface User { id: number; name: string; email: string; target_role: string }

export interface Question {
  id: number; question: string; skill: string; skill_name: string; difficulty: string; type: string;
}

export interface Feedback {
  summary: string; went_well: string[]; missing?: string[]; improve: string[]; recommended_topic: string;
  evaluation_consistency?: "consistent" | "questionable" | "not_checked"; source: "llm" | "template";
}

export interface SkillScore {
  skill: string; name: string; score: number | null; attempts?: number; status: string;
}

export interface Report {
  overall_score: number; technical_score: number | null; communication_score: number | null;
  skills: { skill: string; name: string; score: number; status: string }[];
  strong_areas: string[]; needs_improvement: string[];
  skill_gaps: { skill: string; name: string; score: number; status: string }[];
  questions_answered: number; good_excellent: number; average: number; poor: number;
}

export interface AnswerRecord {
  question: string; skill: string; difficulty: string; answer: string;
  ml_prediction: Quality; score: number; feedback: Feedback;
}

export interface InterviewState {
  id: number; type: string; status: string; score: number | null; created_at: string;
  total_questions: number; answered: number; current_question: Question | null;
  answers: AnswerRecord[]; report: Report | null;
}

export interface AnswerResult {
  question: Question; ml_prediction: Quality; score: number; probabilities: Record<string, number>; model_agreement: number;
  feedback: Feedback; next_question: Question | null; completed: boolean; answered: number; total: number;
}

export interface HistoryItem {
  id: number; type: string; score: number | null; status: string; created_at: string;
  total_questions: number; answered: number;
}

export interface Dashboard {
  total_interviews: number; average_score: number | null; strongest_skill: string | null; weakest_skill: string | null;
  skills: SkillScore[]; score_history: { id: number; score: number; created_at: string }[]; recent: HistoryItem[];
}
