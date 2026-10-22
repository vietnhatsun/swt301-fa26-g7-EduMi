"use client";

import { ExamItem, ExamQuestion, getExamQuestions, MOCK_EXAMS } from "./exam-data";

export interface ExamSubmissionRecord {
  id: string; // e.g. "sub_1791873912345"
  examId: string;
  examTitle: string;
  cardCode: string;
  subject: string;
  subjectCode: "math" | "literature" | "english" | "physics" | "chemistry" | "biology" | "history" | "geography";
  category: string;
  date: string; // e.g. "13/10/2026"
  duration: string; // e.g. "52 phút"
  durationSeconds: number;
  score: string; // e.g. "8.5 / 10" or "950 / 1200"
  rawScore: number;
  maxScore: number;
  accuracyPercent: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  totalQuestions: number;
  violations: number;
  status: "Đã hoàn thành" | "Đạt" | "Cần cố gắng";
  badgeColor: string;
  userAnswers: Record<string, string>;
  essayAnswers?: Record<string, string>;
  essayAttachments?: Record<string, string[]>;
  essayWordCounts?: Record<string, number>;
  hasEssay?: boolean;
  essayCount?: number;
  essaySubmittedCount?: number;
  multipleChoiceScore?: number;
  essayPendingGrading?: boolean;
  mode: "exam" | "practice";
  completedAt: string; // ISO string
}

const STORAGE_KEY = "edumi_exam_submissions";

export function getSubjectCode(subject: string): ExamSubmissionRecord["subjectCode"] {
  switch (subject) {
    case "Toán học":
      return "math";
    case "Ngữ văn":
      return "literature";
    case "Tiếng Anh":
      return "english";
    case "Vật lý":
      return "physics";
    case "Hóa học":
      return "chemistry";
    case "Sinh học":
      return "biology";
    case "Lịch sử":
      return "history";
    case "Địa lý":
      return "geography";
    default:
      return "math";
  }
}

/**
 * Save an exam submission to localStorage
 */
export function saveExamSubmission(submission: ExamSubmissionRecord): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getExamSubmissions();
    // Filter out if duplicate ID exists, then put new one at the start
    const updated = [submission, ...existing.filter((item) => item.id !== submission.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch custom event so other components (e.g. HistoryTab) can react in real time
    window.dispatchEvent(new CustomEvent("edumi_exam_submitted", { detail: submission }));
  } catch (error) {
    console.error("[Exam Storage] Failed to save submission:", error);
  }
}

/**
 * Get all exam submissions from localStorage
 */
export function getExamSubmissions(): ExamSubmissionRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.error("[Exam Storage] Failed to load submissions:", error);
    return [];
  }
}

/**
 * Find submission by ID
 */
export function getExamSubmissionById(id: string): ExamSubmissionRecord | null {
  const all = getExamSubmissions();
  return all.find((item) => item.id === id) || null;
}

/**
 * Helper to generate questions & exam item for review if not directly available
 */
export function getExamAndQuestionsForSubmission(submission: ExamSubmissionRecord): {
  exam: ExamItem;
  questions: ExamQuestion[];
} {
  const foundExam = MOCK_EXAMS.find((e) => e.id === submission.examId);
  const exam: ExamItem = foundExam || {
    id: submission.examId,
    examCode: submission.cardCode || "EDM-EXAM",
    category: (submission.category as any) || "THPT Quốc Gia",
    subject: (submission.subject as any) || "Toán học",
    cardCode: submission.cardCode || "EDUMI",
    title: submission.examTitle,
    description: "Bộ đề ôn tập chính thức từ hệ thống EduMi.",
    durationMinutes: Math.ceil(submission.durationSeconds / 60) || 50,
    questionCount: submission.totalQuestions || 10,
    difficulty: "Vận dụng (7-8.5đ)",
    attempts: 42100,
    rating: 4.9,
    bgClass: "bg-[#0d9488]",
    accentClass: "text-[#0d9488]",
    pattern: "waves",
    author: "Hội đồng Khảo thí EduMi",
  };

  const questions = getExamQuestions(submission.examId);
  return { exam, questions };
}
