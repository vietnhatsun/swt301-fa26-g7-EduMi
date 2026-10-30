"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  Lock,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Send,
  HelpCircle,
  Type,
  PenTool,
  FileText,
  Sparkles,
  Info,
  Check,
  BookOpen,
  ShieldAlert,
  ShieldCheck,
  CheckSquare,
} from "lucide-react";
import {
  ExamItem,
  ExamQuestion,
  getExamQuestions,
  calculateTrueFalseScore,
  isShortAnswerCorrect,
  TrueFalseItem,
} from "./exam-data";
import MathRenderer from "@/components/common/MathRenderer";
import ExamExitConfirmModal from "./ExamExitConfirmModal";
import ExamSubmitConfirmModal from "./ExamSubmitConfirmModal";
import ExamResultView from "./ExamResultView";
import {
  saveExamSubmission,
  getSubjectCode,
  ExamSubmissionRecord,
} from "./exam-storage";

export type TextScaleOption = "75%" | "100%" | "125%" | "150%";

const TEXT_SCALE_MAP: Record<
  TextScaleOption,
  {
    label: string;
    description: string;
    titleSize: string;
    instructionSize: string;
    contentSize: string;
    optionTextSize: string;
    badgeSize: string;
    optionPadding: string;
    checkIconSize: string;
    flagButtonSize: string;
    hintSize: string;
  }
> = {
  "75%": {
    label: "75%",
    description: "Cỡ chữ 75% (nhỏ gọn)",
    titleSize: "text-sm",
    instructionSize: "text-[11px]",
    contentSize: "text-[15px] sm:text-base",
    optionTextSize: "text-xs sm:text-sm",
    badgeSize: "h-7 w-7 text-xs rounded-lg",
    optionPadding: "p-3",
    checkIconSize: "h-4 w-4",
    flagButtonSize: "text-[10px] px-2 py-0.5",
    hintSize: "text-xs p-3",
  },
  "100%": {
    label: "100%",
    description: "Cỡ chữ 100% (chuẩn)",
    titleSize: "text-base sm:text-lg",
    instructionSize: "text-xs",
    contentSize: "text-lg sm:text-xl",
    optionTextSize: "text-sm sm:text-base",
    badgeSize: "h-9 w-9 text-sm rounded-xl",
    optionPadding: "p-4 sm:p-4.5",
    checkIconSize: "h-5 w-5",
    flagButtonSize: "text-[11px] px-2.5 py-1",
    hintSize: "text-xs sm:text-sm p-4",
  },
  "125%": {
    label: "125%",
    description: "Cỡ chữ 125% (lớn)",
    titleSize: "text-lg sm:text-xl",
    instructionSize: "text-sm",
    contentSize: "text-xl sm:text-2xl",
    optionTextSize: "text-base sm:text-lg",
    badgeSize: "h-11 w-11 text-base rounded-xl",
    optionPadding: "p-4.5 sm:p-5",
    checkIconSize: "h-6 w-6",
    flagButtonSize: "text-xs px-3 py-1",
    hintSize: "text-sm sm:text-base p-4.5",
  },
  "150%": {
    label: "150%",
    description: "Cỡ chữ 150% (rất lớn)",
    titleSize: "text-xl sm:text-2xl",
    instructionSize: "text-base",
    contentSize: "text-2xl sm:text-3xl",
    optionTextSize: "text-lg sm:text-xl",
    badgeSize: "h-12 w-12 text-lg rounded-2xl",
    optionPadding: "p-5 sm:p-6",
    checkIconSize: "h-7 w-7",
    flagButtonSize: "text-sm px-3.5 py-1.5",
    hintSize: "text-base sm:text-lg p-5",
  },
};

interface ExamRoomClientProps {
  exam: ExamItem;
  mode: "exam" | "practice";
  initialQuestions?: ExamQuestion[];
}

export default function ExamRoomClient({ exam, mode, initialQuestions }: ExamRoomClientProps) {
  const router = useRouter();
  const isExamMode = mode === "exam";

  // Text Scale state (75%, 100%, 125%, 150%) - applies ONLY to Question Card
  const [textScale, setTextScale] = useState<TextScaleOption>("100%");

  // Load saved text scale preference
  useEffect(() => {
    const saved = localStorage.getItem("edumi_exam_text_scale") as TextScaleOption | null;
    if (saved && TEXT_SCALE_MAP[saved]) {
      setTextScale(saved);
    }
  }, []);

  const handleSetTextScale = (val: TextScaleOption) => {
    setTextScale(val);
    try {
      localStorage.setItem("edumi_exam_text_scale", val);
    } catch {}
  };

  const scaleConfig = TEXT_SCALE_MAP[textScale];

  // Questions Bank
  const questions: ExamQuestion[] = React.useMemo(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      return initialQuestions;
    }
    return getExamQuestions(exam.id);
  }, [exam.id, initialQuestions]);

  // Current Question Pointer
  const [currentIndex, setCurrentIndex] = useState(0);

  // User Answers State: keys are question IDs, values are selected option ("A".."D") or typed text answers
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // True / False State: Record<questionId, Record<itemId, boolean>>
  const [tfAnswers, setTfAnswers] = useState<Record<string, Record<string, boolean>>>({});
  // Flagged questions
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  // Anti-cheat violations (tab switching / focus loss)
  const [violations, setViolations] = useState(0);
  const [showViolationToast, setShowViolationToast] = useState(false);
  const [showPasteToast, setShowPasteToast] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter in question list sidebar: all | single_choice | true_false | short_answer | essay
  const [paletteFilter, setPaletteFilter] = useState<
    "all" | "single_choice" | "true_false" | "short_answer" | "essay"
  >("all");

  // Time Countdown (in seconds)
  const initialSeconds = isExamMode ? exam.durationMinutes * 60 : 60 * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [timeSpent, setTimeSpent] = useState(0);

  // Modals & View state
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showPracticeHint, setShowPracticeHint] = useState(false);
  const [showRubricDetails, setShowRubricDetails] = useState(true);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  // Separate question groups according to official THPT C3 structure
  const singleChoiceQuestions = React.useMemo(
    () => questions.filter((q) => q.type === "single_choice" || (!q.type && q.options && q.options.length > 0)),
    [questions]
  );
  const trueFalseQuestions = React.useMemo(
    () => questions.filter((q) => q.type === "true_false"),
    [questions]
  );
  const shortAnswerQuestions = React.useMemo(
    () => questions.filter((q) => q.type === "short_answer"),
    [questions]
  );
  const essayQuestions = React.useMemo(
    () => questions.filter((q) => q.type === "essay"),
    [questions]
  );
  const mcQuestions = React.useMemo(
    () => [...singleChoiceQuestions, ...trueFalseQuestions],
    [singleChoiceQuestions, trueFalseQuestions]
  );
  const hasEssayQuestions = essayQuestions.length > 0;
  const hasTrueFalseQuestions = trueFalseQuestions.length > 0;
  const hasShortAnswerQuestions = shortAnswerQuestions.length > 0;

  // Helper: check if a question is answered
  const isQuestionAnswered = useCallback(
    (q: ExamQuestion) => {
      if (q.type === "essay" || q.type === "short_answer") {
        return Boolean(answers[q.id]?.trim());
      }
      if (q.type === "true_false") {
        const qTf = tfAnswers[q.id];
        if (!qTf) return false;
        const totalItems = q.trueFalseItems?.length || 4;
        return Object.keys(qTf).length >= totalItems;
      }
      return Boolean(answers[q.id]);
    },
    [answers, tfAnswers]
  );

  // Helper: check partial true/false answer count
  const getTrueFalseAnsweredCount = useCallback(
    (qId: string) => {
      return Object.keys(tfAnswers[qId] || {}).length;
    },
    [tfAnswers]
  );

  // Count answered
  const answeredCount = React.useMemo(() => {
    return questions.filter((q) => isQuestionAnswered(q)).length;
  }, [questions, isQuestionAnswered]);

  const singleChoiceAnsweredCount = React.useMemo(() => {
    return singleChoiceQuestions.filter((q) => Boolean(answers[q.id])).length;
  }, [singleChoiceQuestions, answers]);

  const trueFalseAnsweredCount = React.useMemo(() => {
    return trueFalseQuestions.filter((q) => isQuestionAnswered(q)).length;
  }, [trueFalseQuestions, isQuestionAnswered]);

  const shortAnswerAnsweredCount = React.useMemo(() => {
    return shortAnswerQuestions.filter((q) => Boolean(answers[q.id]?.trim())).length;
  }, [shortAnswerQuestions, answers]);

  const mcAnsweredCount = React.useMemo(() => {
    return singleChoiceAnsweredCount + trueFalseAnsweredCount + shortAnswerAnsweredCount;
  }, [singleChoiceAnsweredCount, trueFalseAnsweredCount, shortAnswerAnsweredCount]);

  const essayAnsweredCount = React.useMemo(() => {
    return essayQuestions.filter((q) => isQuestionAnswered(q)).length;
  }, [essayQuestions, isQuestionAnswered]);

  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  // Format Time Display (MM:SS)
  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Helper: Word count
  const getWordCount = (text: string = "") => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

  // Anti-Cheat: Block Pasting into text area or inputs
  const handleBlockPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setShowPasteToast(true);
  };

  // Core Submit & Save to Storage logic
  const submitAndSaveExam = useCallback(() => {
    const isDgnl = exam.category === "ĐGNL ĐHQG";
    const totalQ = questions.length;

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    let earnedAutoPoints = 0;
    let maxAutoPoints = 0;

    // 1. Single Choice evaluation (Phần I)
    singleChoiceQuestions.forEach((q) => {
      const qPts = q.points || 0.25;
      maxAutoPoints += qPts;
      const selected = answers[q.id];
      if (!selected) {
        skippedCount++;
      } else if (selected === q.correctAnswer) {
        correctCount++;
        earnedAutoPoints += qPts;
      } else {
        wrongCount++;
      }
    });

    // 2. True / False evaluation (Phần II) - Quy chuẩn Bộ GD&ĐT
    trueFalseQuestions.forEach((q) => {
      const qPts = q.points || 1.0;
      maxAutoPoints += qPts;
      const userTf = tfAnswers[q.id] || {};
      const tfCount = Object.keys(userTf).length;

      if (tfCount === 0) {
        skippedCount++;
      } else {
        const tfResult = calculateTrueFalseScore(userTf, q.trueFalseItems);
        earnedAutoPoints += tfResult.points;
        if (tfResult.correctCount === tfResult.totalItems) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }
    });

    // 3. Short Answer evaluation (Phần III) - Hỗ trợ chuẩn hóa số thập phân 20.5 = 20,5
    shortAnswerQuestions.forEach((q) => {
      const qPts = q.points || 0.5;
      maxAutoPoints += qPts;
      const userText = answers[q.id]?.trim();
      if (!userText) {
        skippedCount++;
      } else if (isShortAnswerCorrect(userText, q.correctAnswer)) {
        correctCount++;
        earnedAutoPoints += qPts;
      } else {
        wrongCount++;
      }
    });

    // 4. Essay evaluation (Phần IV): Giữ trạng thái chờ giáo viên chấm
    const essayWordCounts: Record<string, number> = {};
    let essayDoneCount = 0;
    let essaySkippedCount = 0;

    essayQuestions.forEach((q) => {
      const text = answers[q.id]?.trim() || "";
      const wc = getWordCount(text);
      essayWordCounts[q.id] = wc;

      if (text) {
        essayDoneCount++;
      } else {
        essaySkippedCount++;
        skippedCount++;
      }
    });

    const totalAutoGradedCount =
      singleChoiceQuestions.length + trueFalseQuestions.length + shortAnswerQuestions.length;
    const hasEssay = essayQuestions.length > 0;
    const isPureEssay = hasEssay && totalAutoGradedCount === 0;

    let rawScore = 0;
    let finalScore = 0;
    const maxScore = isDgnl ? 1200 : 10;
    let scoreDisplay = "";
    let accuracyPercent = 0;

    if (isPureEssay) {
      scoreDisplay = "Chờ chấm điểm / 10";
      rawScore = 0;
      finalScore = 0;
      accuracyPercent = essayDoneCount > 0 ? 100 : 0;
    } else if (totalAutoGradedCount > 0 && maxAutoPoints > 0) {
      accuracyPercent = Math.min(100, Math.round((earnedAutoPoints / maxAutoPoints) * 100));

      if (isDgnl) {
        finalScore = Math.round((earnedAutoPoints / maxAutoPoints) * 1200);
        rawScore = finalScore;
        scoreDisplay = `${finalScore} / 1200`;
      } else if (hasEssay) {
        // Có tự luận: hiển thị điểm trắc nghiệm đã chấm và số câu tự luận chờ chấm
        finalScore = Number(earnedAutoPoints.toFixed(2));
        rawScore = finalScore;
        scoreDisplay = `${finalScore}đ (+ Chờ chấm ${essayQuestions.length} câu tự luận)`;
      } else {
        // Đề trắc nghiệm thuần túy: chuẩn hóa về thang điểm 10 nếu tổng điểm khác 10
        if (Math.abs(maxAutoPoints - 10) < 0.1) {
          finalScore = Number(earnedAutoPoints.toFixed(2));
        } else {
          finalScore = Number(((earnedAutoPoints / maxAutoPoints) * 10).toFixed(1));
        }
        rawScore = finalScore;
        scoreDisplay = `${finalScore} / ${maxScore}`;
      }
    }

    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
    const durationFormatted = `${Math.max(1, Math.ceil(timeSpent / 60))} phút`;

    const status: "Đã hoàn thành" | "Đạt" | "Cần cố gắng" =
      isPureEssay || rawScore >= (isDgnl ? 800 : 8.0)
        ? "Đã hoàn thành"
        : rawScore >= (isDgnl ? 600 : 5.0)
        ? "Đạt"
        : "Cần cố gắng";

    const record: ExamSubmissionRecord = {
      id: `sub_${Date.now()}`,
      examId: exam.id,
      examTitle: exam.title,
      cardCode: exam.cardCode,
      subject: exam.subject,
      subjectCode: getSubjectCode(exam.subject),
      category: exam.category,
      date: dateFormatted,
      duration: durationFormatted,
      durationSeconds: timeSpent,
      score: scoreDisplay,
      rawScore: finalScore,
      maxScore,
      accuracyPercent,
      correctCount,
      wrongCount,
      skippedCount,
      totalQuestions: totalQ,
      violations,
      status,
      badgeColor:
        status === "Đã hoàn thành" || status === "Đạt"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-rose-50 text-rose-700 border-rose-200",
      userAnswers: answers,
      essayAnswers: answers,
      essayWordCounts,
      hasEssay,
      essayCount: essayQuestions.length,
      essaySubmittedCount: essayDoneCount,
      multipleChoiceScore: totalAutoGradedCount > 0 ? finalScore : undefined,
      essayPendingGrading: hasEssay,
      mode,
      completedAt: now.toISOString(),
    };

    saveExamSubmission(record);
    if (typeof document !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setIsSubmitModalOpen(false);
    setIsCompleted(true);
  }, [
    answers,
    tfAnswers,
    exam,
    mode,
    questions,
    singleChoiceQuestions,
    trueFalseQuestions,
    shortAnswerQuestions,
    essayQuestions,
    timeSpent,
    violations,
  ]);

  // Timer Tick
  useEffect(() => {
    if (isCompleted) return;

    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);

      if (isExamMode) {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            submitAndSaveExam();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamMode, isCompleted, submitAndSaveExam]);

  // Anti-Cheat: Tab Switching / Visibility Listener
  useEffect(() => {
    if (isCompleted || !isExamMode) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations((prev) => prev + 1);
        setShowViolationToast(true);
      }
    };

    const handleWindowBlur = () => {
      setViolations((prev) => prev + 1);
      setShowViolationToast(true);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [isCompleted, isExamMode]);

  // Anti-Cheat: Lắng nghe sự kiện Toàn màn hình & ghi nhận vi phạm khi thoát
  useEffect(() => {
    if (typeof document === "undefined") return;

    // Cập nhật trạng thái toàn màn hình ban đầu
    setIsFullscreen(!!document.fullscreenElement);

    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);

      // Nếu đang trong chế độ thi thử mà thoát toàn màn hình -> tính vi phạm
      if (isExamMode && !active && !isCompleted && !isExitModalOpen && !isSubmitModalOpen) {
        setViolations((prev) => prev + 1);
        setShowViolationToast(true);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isExamMode, isCompleted, isExitModalOpen, isSubmitModalOpen]);

  // Auto hide violation toast after 4 seconds
  useEffect(() => {
    if (showViolationToast) {
      const timer = setTimeout(() => {
        setShowViolationToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showViolationToast]);

  // Auto hide paste toast after 4 seconds
  useEffect(() => {
    if (showPasteToast) {
      const timer = setTimeout(() => {
        setShowPasteToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showPasteToast]);

  // Select Option Handler for MC (A, B, C, D)
  const handleSelectOption = (optionId: "A" | "B" | "C" | "D") => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  // Select True/False Handler for true_false questions (sub-items a, b, c, d)
  const handleSelectTrueFalse = (qId: string, itemId: string, value: boolean) => {
    setTfAnswers((prev) => {
      const qTf = { ...(prev[qId] || {}) };
      qTf[itemId] = value;
      const next = { ...prev, [qId]: qTf };

      // Also serialize to answers[qId] so it is persisted in userAnswers
      setAnswers((prevAns) => ({
        ...prevAns,
        [qId]: JSON.stringify(next[qId]),
      }));

      return next;
    });
  };

  // Text Answer change handler for short_answer and essay
  const handleTextAnswerChange = (text: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: text,
    }));
  };

  // Toggle Flag Question Handler
  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  // Keyboard navigation & Shortcuts (A, B, C, D, Arrow Left/Right)
  // Prevent overriding when user is typing in textarea or input!
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted || isExitModalOpen || isSubmitModalOpen) return;

      const activeEl = document.activeElement;
      const isTyping =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        (activeEl as HTMLElement)?.isContentEditable;
      if (isTyping) return;

      const key = e.key.toUpperCase();
      if (key === "ARROWLEFT" && currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
        setShowPracticeHint(false);
      } else if (key === "ARROWRIGHT" && currentIndex < totalQuestions - 1) {
        setCurrentIndex((i) => i + 1);
        setShowPracticeHint(false);
      } else if (["A", "B", "C", "D"].includes(key)) {
        if (
          currentQuestion?.type === "single_choice" ||
          currentQuestion?.type === "true_false" ||
          (currentQuestion?.options && currentQuestion.options.length > 0)
        ) {
          handleSelectOption(key as "A" | "B" | "C" | "D");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, totalQuestions, isCompleted, isExitModalOpen, isSubmitModalOpen, currentQuestion]);

  // Request Fullscreen helper
  const requestFullscreenMode = () => {
    if (typeof document !== "undefined" && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  // Handlers
  const handleConfirmExit = () => {
    if (typeof document !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setIsExitModalOpen(false);
    router.push("/exam");
  };

  const handleConfirmSubmit = () => {
    submitAndSaveExam();
  };

  const handleRetakeExam = () => {
    setAnswers({});
    setTfAnswers({});
    setFlaggedQuestions({});
    setViolations(0);
    setSecondsRemaining(initialSeconds);
    setTimeSpent(0);
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  // If completed, show Result View
  if (isCompleted) {
    return (
      <main className="min-h-screen bg-[#f0f4f8] py-8 text-[#10213a]">
        <ExamResultView
          exam={exam}
          questions={questions}
          userAnswers={answers}
          violations={violations}
          timeSpentSeconds={timeSpent}
          onRetake={handleRetakeExam}
          mode={mode}
        />
      </main>
    );
  }

  const currentWordCount = getWordCount(answers[currentQuestion?.id || ""] || "");
  const minWords = currentQuestion?.wordLimit?.min;
  const maxWords = currentQuestion?.wordLimit?.max;

  return (
    <div className="flex min-h-screen flex-col bg-[#eef2f6] text-[#10213a] font-sans">
      {/* ── Top Bar Header ── */}
      <header className="relative z-30 flex h-[72px] items-center justify-between border-b border-slate-200/90 bg-white px-4 sm:px-8 shadow-xs">
        {/* Left: Branding & Mascot */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-emerald-50 border border-emerald-200">
            <Image
              src="/Capybara_ôm_huy_hiệu_ngôi_sao-removebg-preview.png"
              alt="EduMi Exam Mascot"
              fill
              className="object-contain p-0.5"
            />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 leading-tight">
              EduMi Classroom Exam
            </div>
            <div className="text-[11px] font-medium text-slate-400">
              Phòng thi Trắc nghiệm & Tự luận
            </div>
          </div>
        </div>

        {/* Center: Title & Subtitle */}
        <div className="hidden md:flex flex-col items-center text-center">
          <h1 className="text-sm sm:text-base font-black text-slate-900 max-w-lg truncate">
            {exam.cardCode}: {exam.title}
          </h1>
          <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-2">
            <span>
              Mã đề: <strong className="text-slate-800">{exam.examCode}</strong>
            </span>
            <span>·</span>
            <span>{totalQuestions} câu hỏi</span>
            {hasEssayQuestions && (
              <>
                <span>·</span>
                <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2 py-0.2 text-[10px] font-black text-indigo-700">
                  Có phần Tự luận
                </span>
              </>
            )}
            <span>·</span>
            <span className="text-emerald-700">Ghi nhận vi phạm</span>
          </div>
        </div>

        {/* Floating Circle Exit 'X' Button directly underneath Header Center */}
        <button
          type="button"
          onClick={() => setIsExitModalOpen(true)}
          className="absolute -bottom-4.5 left-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-[#3b4754] hover:bg-slate-900 text-white shadow-md transition-all cursor-pointer z-30 hover:scale-105 active:scale-95"
          title="Rời phòng thi"
          aria-label="Rời phòng thi"
        >
          <X className="h-4 w-4 stroke-[2.5]" />
        </button>

        {/* Right: Status Pills & Action */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Text Size Adjuster Bar (75%, 100%, 125%, 150%) */}
          <div className="flex items-center gap-0.5 sm:gap-1 rounded-full bg-slate-100 p-1 border border-slate-200/90 text-xs font-bold text-slate-600 shadow-2xs">
            <span className="flex items-center gap-1 px-2 text-[11px] font-bold text-slate-500">
              <Type className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden xl:inline">Cỡ chữ:</span>
            </span>
            {(["75%", "100%", "125%", "150%"] as const).map((scaleVal) => (
              <button
                key={scaleVal}
                type="button"
                onClick={() => handleSetTextScale(scaleVal)}
                className={`rounded-full px-2 sm:px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                  textScale === scaleVal
                    ? "bg-[#009b77] text-white shadow-xs font-black"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                }`}
                title={`Điều chỉnh kích thước cỡ chữ bài thi: ${scaleVal} (${TEXT_SCALE_MAP[scaleVal].description})`}
              >
                {scaleVal}
              </button>
            ))}
          </div>

          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 text-xs font-black text-emerald-800 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isExamMode ? "Đang làm bài" : "Đang luyện tập"}</span>
          </div>

          {/* Violation Badge */}
          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black shadow-2xs transition-colors ${
              violations > 0
                ? "bg-rose-50 border border-rose-300 text-rose-700 animate-bounce"
                : "bg-[#fff2e8] border border-[#fddbc2] text-[#c25e1a]"
            }`}
            title="Số lần học sinh chuyển tab hoặc mất tiêu điểm cửa sổ"
          >
            <span>Vi phạm: {violations}</span>
          </div>

          {/* Fullscreen Anti-Cheat Status Badge (Thay thế nút toggle thủ công) */}
          {isExamMode && (
            <div
              className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black shadow-2xs select-none transition-all ${
                isFullscreen
                  ? "bg-slate-900 text-white"
                  : "border border-rose-300 bg-rose-50 text-rose-700 animate-pulse"
              }`}
              title={
                isFullscreen
                  ? "Chế độ thi: Màn hình đã được khóa toàn màn hình & giám sát chống gian lận"
                  : "Cảnh báo: Bạn chưa ở chế độ toàn màn hình!"
              }
            >
              <Lock className="h-3.5 w-3.5 text-amber-400" />
              <span>{isFullscreen ? "Khóa toàn màn hình" : "Chưa mở toàn màn hình"}</span>
            </div>
          )}
        </div>
      </header>

      {/* ── Anti-Cheat Toast Warning: Tab Switching ── */}
      {showViolationToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-2xl border border-rose-300 bg-rose-600 text-white px-5 py-3 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div className="text-xs font-bold leading-tight">
            <div>⚠️ CẢNH BÁO PHÒNG THI:</div>
            <div className="font-normal opacity-95 text-[11px] mt-0.5">
              Hệ thống phát hiện bạn vừa rời khỏi màn hình làm bài! Lần vi phạm thứ <strong>{violations}</strong> đã được ghi nhận.
            </div>
          </div>
        </div>
      )}

      {/* ── Anti-Cheat Toast Warning: Paste Blocked ── */}
      {showPasteToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-600 text-white px-6 py-3.5 shadow-2xl animate-in slide-in-from-top-4 duration-200 max-w-md">
          <ShieldAlert className="h-5 w-5 shrink-0 text-white" />
          <div className="text-xs font-bold leading-tight">
            <div className="text-sm font-black">⚠️ KHÔNG THỂ DÁN VĂN BẢN:</div>
            <div className="font-normal opacity-95 text-[11px] mt-0.5">
              Để chống gian lận và sao chép từ bên ngoài, hệ thống khóa tính năng Dán (Paste). Thí sinh vui lòng tự gõ bài làm trực tiếp!
            </div>
          </div>
        </div>
      )}

      {/* ── Main Workspace Body ── */}
      <div className="mx-auto flex w-full max-w-[1880px] flex-1 gap-5 lg:gap-6 px-3 sm:px-5 lg:px-6 py-4 sm:py-5">
        {/* ── Left Sidebar: Timer, Progress & Question Palette ── */}
        <aside className="w-full sm:w-[290px] lg:w-[320px] shrink-0 flex flex-col">
          <div className="flex-1 rounded-[32px] bg-white p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div>
              {/* 1. Timer Block */}
              <div className="rounded-2xl bg-gradient-to-br from-[#009b77] via-[#008f6c] to-[#017a5c] p-4.5 text-white shadow-xs text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-white/90">
                  <Clock className="h-3.5 w-3.5" />
                  <span>THỜI GIAN CÒN LẠI</span>
                </div>
                <div className="mt-1 text-3xl sm:text-[38px] font-black tracking-wider leading-none text-white drop-shadow-xs">
                  {isExamMode ? formatTimer(secondsRemaining) : formatTimer(timeSpent)}
                </div>
                {!isExamMode && (
                  <div className="mt-1 text-[10px] font-bold text-white/80">
                    (Chế độ tự do không giới hạn giờ)
                  </div>
                )}
              </div>

              {/* 2. Progress Bar Section */}
              <div className="mt-5 pb-4 border-b border-slate-100">
                <div className="flex items-center justify-between text-xs font-black text-slate-800">
                  <span className="uppercase tracking-wide text-slate-600">Tiến độ làm bài</span>
                  <span className="text-[#009b77]">{Math.round(progressPercent)}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-gradient-to-r from-[#009b77] to-emerald-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>
                    Đã hoàn thành <strong className="text-slate-800">{answeredCount}/{totalQuestions}</strong> câu
                  </span>
                  {hasEssayQuestions && (
                    <span className="text-indigo-700 font-extrabold text-[10px]">
                      TL: {essayAnsweredCount}/{essayQuestions.length}
                    </span>
                  )}
                </div>
              </div>

              {/* 3. Question Number Palette Grid */}
              <div className="pt-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                    DANH SÁCH CÂU HỎI
                  </span>
                  {hasEssayQuestions && (
                    <span className="text-[10px] font-bold text-slate-400">
                      (TL = Tự luận)
                    </span>
                  )}
                </div>

                {/* Filter Tabs if exam has multiple question formats */}
                {(hasTrueFalseQuestions || hasShortAnswerQuestions || hasEssayQuestions) && (
                  <div className="flex flex-wrap items-center gap-1 mb-3 p-1 rounded-xl bg-slate-100 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setPaletteFilter("all")}
                      className={`px-2 py-1 rounded-lg text-center transition cursor-pointer ${
                        paletteFilter === "all"
                          ? "bg-white text-slate-900 shadow-2xs font-black"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Tất cả ({questions.length})
                    </button>
                    {singleChoiceQuestions.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setPaletteFilter("single_choice")}
                        className={`px-2 py-1 rounded-lg text-center transition cursor-pointer ${
                          paletteFilter === "single_choice"
                            ? "bg-white text-emerald-800 shadow-2xs font-black"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        ABCD ({singleChoiceQuestions.length})
                      </button>
                    )}
                    {trueFalseQuestions.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setPaletteFilter("true_false")}
                        className={`px-2 py-1 rounded-lg text-center transition cursor-pointer ${
                          paletteFilter === "true_false"
                            ? "bg-white text-purple-800 shadow-2xs font-black"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Đ/S ({trueFalseQuestions.length})
                      </button>
                    )}
                    {shortAnswerQuestions.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setPaletteFilter("short_answer")}
                        className={`px-2 py-1 rounded-lg text-center transition cursor-pointer ${
                          paletteFilter === "short_answer"
                            ? "bg-white text-sky-800 shadow-2xs font-black"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Điền số ({shortAnswerQuestions.length})
                      </button>
                    )}
                    {essayQuestions.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setPaletteFilter("essay")}
                        className={`px-2 py-1 rounded-lg text-center transition cursor-pointer ${
                          paletteFilter === "essay"
                            ? "bg-white text-indigo-700 shadow-2xs font-black"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Tự luận ({essayQuestions.length})
                      </button>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[340px] overflow-y-auto pr-1">
                  {questions.map((q, idx) => {
                    const isAnswered = isQuestionAnswered(q);
                    const isCurrent = idx === currentIndex;
                    const isFlagged = Boolean(flaggedQuestions[q.id]);
                    const isEssay = q.type === "essay";
                    const isTrueFalse = q.type === "true_false";
                    const isShortAnswer = q.type === "short_answer";
                    const isSingleChoice = q.type === "single_choice" || (!q.type && q.options && q.options.length > 0);

                    // True/False partial count
                    const tfCount = isTrueFalse ? getTrueFalseAnsweredCount(q.id) : 0;
                    const tfTotal = q.trueFalseItems?.length || 4;
                    const isTfPartial = isTrueFalse && tfCount > 0 && tfCount < tfTotal;

                    // Check if dimmed by filter
                    const isDimmed =
                      paletteFilter !== "all" &&
                      ((paletteFilter === "single_choice" && !isSingleChoice) ||
                        (paletteFilter === "true_false" && !isTrueFalse) ||
                        (paletteFilter === "short_answer" && !isShortAnswer) ||
                        (paletteFilter === "essay" && !isEssay));

                    let btnStyles = "border border-slate-200 bg-white text-slate-700 hover:border-slate-300";

                    if (isCurrent) {
                      if (isTrueFalse) {
                        btnStyles = "border-2 border-purple-600 bg-white text-purple-700 font-black ring-2 ring-purple-500/25 shadow-xs";
                      } else if (isShortAnswer) {
                        btnStyles = "border-2 border-sky-600 bg-white text-sky-700 font-black ring-2 ring-sky-500/25 shadow-xs";
                      } else if (isEssay) {
                        btnStyles = "border-2 border-indigo-600 bg-white text-indigo-700 font-black ring-2 ring-indigo-500/25 shadow-xs";
                      } else {
                        btnStyles = "border-2 border-[#009b77] bg-white text-[#009b77] font-black ring-2 ring-[#009b77]/25 shadow-xs";
                      }
                    } else if (isAnswered) {
                      if (isTrueFalse) {
                        btnStyles = "border border-purple-300 bg-purple-50 text-purple-800 font-black";
                      } else if (isShortAnswer) {
                        btnStyles = "border border-sky-300 bg-sky-50 text-sky-800 font-black";
                      } else if (isEssay) {
                        btnStyles = "border border-indigo-300 bg-indigo-50 text-indigo-800 font-black";
                      } else {
                        btnStyles = "border border-[#009b77]/40 bg-[#e0f5ee] text-[#007a5e] font-black";
                      }
                    } else if (isTfPartial) {
                      btnStyles = "border-2 border-amber-400 bg-amber-50/70 text-amber-900 font-black";
                    }

                    // Format badge tag
                    const typeBadgeText = isTrueFalse
                      ? "Đ/S"
                      : isShortAnswer
                      ? "ĐS"
                      : isEssay
                      ? "TL"
                      : "TN";

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          setCurrentIndex(idx);
                          setShowPracticeHint(false);
                        }}
                        className={`relative flex h-11 w-full items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${btnStyles} ${
                          isDimmed ? "opacity-25 pointer-events-none" : ""
                        }`}
                        title={`Câu ${idx + 1} (${typeBadgeText})${
                          isAnswered ? " - Đã làm" : isTfPartial ? ` - Đã chọn ${tfCount}/${tfTotal} ý` : " - Chưa làm"
                        }`}
                      >
                        <span className="relative z-10">{idx + 1}</span>

                        {/* Format badge indicator on top-left */}
                        <span
                          className={`absolute top-0.5 left-1 text-[8px] font-black px-1 rounded-sm leading-tight ${
                            isCurrent
                              ? isTrueFalse
                                ? "bg-purple-600 text-white"
                                : isShortAnswer
                                ? "bg-sky-600 text-white"
                                : isEssay
                                ? "bg-indigo-600 text-white"
                                : "bg-[#009b77] text-white"
                              : isAnswered
                              ? isTrueFalse
                                ? "bg-purple-200 text-purple-900"
                                : isShortAnswer
                                ? "bg-sky-200 text-sky-900"
                                : isEssay
                                ? "bg-indigo-200 text-indigo-900"
                                : "bg-emerald-200 text-emerald-900"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {typeBadgeText}
                        </span>

                        {/* Partial indicator for True/False */}
                        {isTfPartial && !isAnswered && (
                          <span className="absolute bottom-0.5 right-1 text-[8px] font-black text-amber-700">
                            {tfCount}/{tfTotal}
                          </span>
                        )}

                        {/* Flagged icon */}
                        {isFlagged && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-amber-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-900" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Anti-Cheat Guidelines Card */}
            <div className="mt-5 rounded-2xl border border-[#ffeed3] bg-[#fff6ea] p-3.5 text-[11px] font-medium leading-relaxed text-[#b35900] shadow-2xs">
              <div className="flex items-center gap-1.5 font-black text-[#964a00] mb-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Quy chế bảo vệ phòng thi:</span>
              </div>
              <p>
                Không rời tab, đổi cửa sổ hoặc sao chép/dán nội dung từ bên ngoài. Mọi hành vi vi phạm đều được hệ thống ghi nhận tự động.
              </p>
            </div>
          </div>
        </aside>

        {/* ── Right Main Panel: Question Card ── */}
        <main className="flex-1 flex flex-col justify-between rounded-[32px] bg-white p-6 sm:p-8 shadow-sm border border-slate-200/80 min-h-[580px]">
          <div>
            {/* Question Card Top Header */}
            {/* Question Card Top Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <h2 className={`${scaleConfig.titleSize} font-black tracking-wide text-[#009b77] transition-all`}>
                    CÂU HỎI {currentIndex + 1}
                  </h2>
                  {currentQuestion?.type === "single_choice" && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-black text-emerald-800 shadow-2xs">
                      <span>Phần I: TN 4 Lựa chọn</span>
                    </span>
                  )}
                  {currentQuestion?.type === "true_false" && (
                    <span className="flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-xs font-black text-purple-800 shadow-2xs">
                      <CheckSquare className="h-3 w-3 text-purple-600" />
                      <span>Phần II: Đúng / Sai</span>
                    </span>
                  )}
                  {currentQuestion?.type === "short_answer" && (
                    <span className="flex items-center gap-1 rounded-full bg-sky-50 border border-sky-200 px-2.5 py-0.5 text-xs font-black text-sky-800 shadow-2xs">
                      <FileText className="h-3 w-3 text-sky-600" />
                      <span>Phần III: Trả lời ngắn</span>
                    </span>
                  )}
                  {currentQuestion?.type === "essay" && (
                    <span className="flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-black text-indigo-700 shadow-2xs">
                      <PenTool className="h-3 w-3" />
                      <span>Phần IV: Tự luận</span>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleToggleFlag}
                  className={`flex items-center gap-1 rounded-full ${scaleConfig.flagButtonSize} font-bold transition-all cursor-pointer ${
                    flaggedQuestions[currentQuestion?.id || ""]
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                  title="Đánh dấu câu này để xem lại sau"
                >
                  <Flag className={`h-3 w-3 ${flaggedQuestions[currentQuestion?.id || ""] ? "fill-amber-600 text-amber-600" : ""}`} />
                  <span>{flaggedQuestions[currentQuestion?.id || ""] ? "Đã gắn cờ" : "Gắn cờ"}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                {currentQuestion?.points && (
                  <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-800 border border-emerald-200/80">
                    +{currentQuestion.points} điểm
                  </span>
                )}
                <div className={`${scaleConfig.instructionSize} font-semibold text-slate-500 transition-all`}>
                  {currentQuestion?.instruction ||
                    (currentQuestion?.type === "true_false"
                      ? "Trong mỗi ý a), b), c), d), thí sinh chọn Đúng hoặc Sai"
                      : currentQuestion?.type === "short_answer"
                      ? "Điền kết quả số vào ô trống"
                      : currentQuestion?.type === "essay"
                      ? "Trình bày bài làm tự luận"
                      : "Chọn một đáp án đúng (A, B, C hoặc D)")}
                </div>
              </div>
            </div>

            {/* Question Content Body */}
            <div className="py-4 sm:py-6">
              <div className={`${scaleConfig.contentSize} font-bold leading-relaxed text-slate-900 transition-all whitespace-pre-line`}>
                <MathRenderer text={currentQuestion?.content} />
              </div>
            </div>

            {/* ── CASE 1: Multiple Choice Options (A, B, C, D) ── */}
            {(currentQuestion?.type === "single_choice" || (!currentQuestion?.type && currentQuestion?.options && currentQuestion.options.length > 0)) && (
              <div className="space-y-3">
                {currentQuestion?.options?.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.id;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left rounded-2xl border ${scaleConfig.optionPadding} transition-all flex items-center gap-4 cursor-pointer active:scale-[0.99] select-none ${
                        isSelected
                          ? "border-2 border-[#009b77] bg-[#eefaf5] shadow-xs text-slate-950 font-bold"
                          : "border-slate-200 bg-white hover:border-[#009b77]/50 hover:bg-slate-50/70 text-slate-800"
                      }`}
                    >
                      {/* Badge Letter A/B/C/D */}
                      <span
                        className={`flex ${scaleConfig.badgeSize} shrink-0 items-center justify-center font-black transition-all ${
                          isSelected
                            ? "bg-[#009b77] text-white shadow-xs"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {opt.id}
                      </span>

                      {/* Option Text */}
                      <span className={`flex-1 ${scaleConfig.optionTextSize} leading-relaxed transition-all`}>
                        <MathRenderer text={opt.text} />
                      </span>

                      {/* Selected Checkmark Indicator */}
                      {isSelected && (
                        <CheckCircle2 className={`${scaleConfig.checkIconSize} shrink-0 text-[#009b77] transition-all`} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── CASE 2: True / False Questions (Phần II: Đúng / Sai chuẩn Bộ GD&ĐT) ── */}
            {currentQuestion?.type === "true_false" && (
              <div className="space-y-4">
                {/* Bộ GD&ĐT progressive rubric reminder */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-purple-200 bg-purple-50/70 p-3.5 text-xs text-purple-950 shadow-2xs">
                  <div className="flex items-center gap-2 font-black text-purple-900">
                    <Sparkles className="h-4 w-4 text-purple-600 shrink-0" />
                    <span>Quy chuẩn chấm điểm Bộ GD&ĐT:</span>
                    <span className="font-semibold text-purple-800">
                      Đúng 1 ý = <strong>0.1đ</strong> · Đúng 2 ý = <strong>0.25đ</strong> · Đúng 3 ý = <strong>0.5đ</strong> · Đúng 4 ý = <strong>1.0đ</strong>
                    </span>
                  </div>
                  <div className="rounded-full bg-purple-200/80 px-2.5 py-0.5 text-[11px] font-black text-purple-900">
                    Đã chọn: {getTrueFalseAnsweredCount(currentQuestion.id)} / {currentQuestion.trueFalseItems?.length || 4} ý
                  </div>
                </div>

                {/* Sub-items a, b, c, d */}
                <div className="space-y-3">
                  {currentQuestion.trueFalseItems?.map((item) => {
                    const userVal = tfAnswers[currentQuestion.id]?.[item.id];
                    const isTrue = userVal === true;
                    const isFalse = userVal === false;

                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border p-4 transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                          userVal !== undefined
                            ? "border-purple-200 bg-gradient-to-r from-purple-50/20 via-white to-purple-50/10 shadow-2xs"
                            : "border-slate-200 bg-white hover:border-purple-300"
                        }`}
                      >
                        {/* Sub-item label & text */}
                        <div className="flex items-start gap-3 flex-1">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all ${
                              userVal !== undefined
                                ? "bg-purple-600 text-white shadow-xs"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {item.id})
                          </span>
                          <div className="text-sm sm:text-base font-semibold leading-relaxed text-slate-800 pt-0.5">
                            <MathRenderer text={item.content} />
                          </div>
                        </div>

                        {/* True / False Toggle Buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {/* Button ĐÚNG */}
                          <button
                            type="button"
                            onClick={() => handleSelectTrueFalse(currentQuestion.id, item.id, true)}
                            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black transition-all cursor-pointer active:scale-95 ${
                              isTrue
                                ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400"
                                : "border border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/60"
                            }`}
                          >
                            <Check className={`h-4 w-4 ${isTrue ? "stroke-[3]" : ""}`} />
                            <span>ĐÚNG</span>
                          </button>

                          {/* Button SAI */}
                          <button
                            type="button"
                            onClick={() => handleSelectTrueFalse(currentQuestion.id, item.id, false)}
                            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black transition-all cursor-pointer active:scale-95 ${
                              isFalse
                                ? "bg-rose-600 text-white shadow-md ring-2 ring-rose-400"
                                : "border border-slate-200 bg-white text-slate-700 hover:border-rose-400 hover:bg-rose-50/60"
                            }`}
                          >
                            <X className={`h-4 w-4 ${isFalse ? "stroke-[3]" : ""}`} />
                            <span>SAI</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── CASE 3: Short Answer Input (Phần III: Trả lời ngắn điền kết quả số) ── */}
            {currentQuestion?.type === "short_answer" && (
              <div className="space-y-3">
                <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor={`sa-input-${currentQuestion.id}`}
                      className="text-xs font-black uppercase tracking-wider text-sky-900 flex items-center gap-1.5"
                    >
                      <FileText className="h-4 w-4 text-sky-600" />
                      <span>Ô điền đáp án của thí sinh (kết quả số):</span>
                    </label>
                    {answers[currentQuestion.id]?.trim() && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Check className="h-3 w-3" /> Đã nhập câu trả lời
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      id={`sa-input-${currentQuestion.id}`}
                      type="text"
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) => handleTextAnswerChange(e.target.value)}
                      onPaste={handleBlockPaste}
                      placeholder="Nhập kết quả số (ví dụ: 20.5 hoặc 12)..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base sm:text-lg font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:border-sky-500 focus:outline-none focus:ring-3 focus:ring-sky-100 transition shadow-inner font-mono"
                      autoComplete="off"
                    />
                    {answers[currentQuestion.id] && (
                      <button
                        type="button"
                        onClick={() => handleTextAnswerChange("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        title="Xóa câu trả lời"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <p className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
                    <Info className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                    <span>
                      Lưu ý: Hỗ trợ số nguyên, số thập phân (dấu chấm '.' hoặc dấu phẩy ',' ví dụ 20.5 hay 20,5 đều được công nhận), số âm. Hệ thống khóa chức năng dán (Paste).
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* ── CASE 3: Rich Essay Studio (Phần thi Tự luận gõ bài trực tiếp) ── */}
            {currentQuestion?.type === "essay" && (
              <div className="space-y-5">
                {/* Writing Area Container */}
                <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 p-4 sm:p-5 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-indigo-100">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                        <PenTool className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                          <span>Khung soạn thảo bài làm tự luận</span>
                          <span className="flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                            <ShieldCheck className="h-3 w-3 text-emerald-600" />
                            Khóa chức năng dán (Paste)
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500">
                          Thí sinh tự soạn thảo trực tiếp bài làm vào ô bên dưới (không hỗ trợ đính kèm ảnh bên ngoài để chống gian lận)
                        </div>
                      </div>
                    </div>

                    {/* Live Word Count & Target Indicator */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 px-3 py-1 text-xs font-bold text-indigo-900">
                        <span>✍️ {currentWordCount} từ</span>
                        <span className="text-indigo-400">·</span>
                        <span className="text-indigo-700">{(answers[currentQuestion.id] || "").length} ký tự</span>
                      </div>

                      {minWords && (
                        <div
                          className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                            currentWordCount >= minWords && (!maxWords || currentWordCount <= maxWords)
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : currentWordCount < minWords
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-rose-100 text-rose-800 border border-rose-300"
                          }`}
                        >
                          {currentWordCount >= minWords && (!maxWords || currentWordCount <= maxWords)
                            ? `✓ Đạt độ dài (${minWords}${maxWords ? `-${maxWords}` : "+"} từ)`
                            : currentWordCount < minWords
                            ? `Cần thêm ${minWords - currentWordCount} từ`
                            : `Vượt ${currentWordCount - (maxWords || 0)} từ`}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Main Essay Textarea */}
                  <div className="relative">
                    <textarea
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) => handleTextAnswerChange(e.target.value)}
                      onPaste={handleBlockPaste}
                      placeholder="Nhập toàn bộ nội dung bài làm tự luận của bạn tại đây... (Thí sinh tự gõ trực tiếp bài làm, chia thành các đoạn văn, mở bài, thân bài, kết bài hoặc các bước giải chi tiết)."
                      rows={10}
                      className="w-full rounded-2xl border border-slate-300 bg-white p-4 text-sm sm:text-base font-normal leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-100 transition shadow-inner resize-y min-h-[240px]"
                    />
                  </div>

                  {/* Anti-cheat & Auto-save status footer */}
                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 px-1">
                    <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Hệ thống tự động lưu bài làm liên tục vào bộ nhớ phòng thi</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 font-medium">
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                      <span>Không sao chép từ nguồn ngoài · Tự nhập bài làm để bài thi được công nhận</span>
                    </span>
                  </div>
                </div>

                {/* ── Rubric & Grading Criteria Box ── */}
                {currentQuestion.rubricCriteria && currentQuestion.rubricCriteria.length > 0 && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                    <button
                      type="button"
                      onClick={() => setShowRubricDetails(!showRubricDetails)}
                      className="flex w-full items-center justify-between text-left text-xs font-black text-amber-950 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4 text-amber-700" />
                        <span>Thang điểm & Tiêu chuẩn chấm thi của giáo viên:</span>
                      </span>
                      <span className="text-[11px] font-bold text-amber-800">
                        {showRubricDetails ? "Thu gọn" : "Xem chi tiết tiêu chí"}
                      </span>
                    </button>

                    {showRubricDetails && (
                      <div className="mt-3 space-y-2 border-t border-amber-200/80 pt-3 animate-in fade-in duration-150">
                        {currentQuestion.rubricCriteria.map((criterion, crIdx) => (
                          <div
                            key={crIdx}
                            className="flex items-start gap-2 text-xs font-semibold text-amber-900/90"
                          >
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-900 text-[10px] font-black mt-0.5">
                              {crIdx + 1}
                            </span>
                            <span>{criterion}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Practice Mode: Toggle Solution Hint */}
            {!isExamMode && (
              <div className="mt-6 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPracticeHint(!showPracticeHint)}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span>{showPracticeHint ? "Ẩn phương pháp giải" : "Xem gợi ý & Phương pháp giải câu này"}</span>
                </button>

                {showPracticeHint && (
                  <div className={`mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 ${scaleConfig.hintSize} text-slate-800 animate-in fade-in duration-150`}>
                    <strong className="text-emerald-900 font-black block mb-1">
                      🐾 Hướng dẫn từ Gia sư Capybara:
                    </strong>
                    <div className="whitespace-pre-line leading-relaxed">
                      {currentQuestion?.explanation}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Bottom Action Navigation Bar ── */}
          <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6">
            {/* Left: Previous and Next Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (currentIndex > 0) {
                    setCurrentIndex((i) => i - 1);
                    setShowPracticeHint(false);
                  }
                }}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 rounded-xl bg-slate-100 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Câu trước</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentIndex < totalQuestions - 1) {
                    setCurrentIndex((i) => i + 1);
                    setShowPracticeHint(false);
                  }
                }}
                disabled={currentIndex === totalQuestions - 1}
                className="flex items-center gap-1 rounded-xl bg-slate-100 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
              >
                <span>Câu tiếp theo</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Right: Submit Button */}
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[#0d7d6b] hover:bg-[#096859] px-7 py-2.5 text-xs sm:text-sm font-black text-white shadow-md transition hover:shadow-lg cursor-pointer active:scale-95"
            >
              <Send className="h-4 w-4" />
              <span>Nộp bài thi</span>
            </button>
          </footer>
        </main>
      </div>

      {/* ── Modals ── */}
      <ExamExitConfirmModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirmExit={handleConfirmExit}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
      />

      <ExamSubmitConfirmModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        violations={violations}
        timeRemaining={formatTimer(secondsRemaining)}
        singleChoiceAnswered={singleChoiceAnsweredCount}
        totalSingleChoice={singleChoiceQuestions.length}
        trueFalseAnswered={trueFalseAnsweredCount}
        totalTrueFalse={trueFalseQuestions.length}
        shortAnswerAnswered={shortAnswerAnsweredCount}
        totalShortAnswer={shortAnswerQuestions.length}
        essayAnswered={essayAnsweredCount}
        totalEssay={essayQuestions.length}
        multipleChoiceAnswered={mcAnsweredCount}
        totalMultipleChoice={singleChoiceQuestions.length + trueFalseQuestions.length + shortAnswerQuestions.length}
      />

      {/* ── Modal Bắt Buộc Toàn Màn Hình Trong Chế Độ Thi (Tự động mở và khóa) ── */}
      {isExamMode && !isFullscreen && !isCompleted && !isExitModalOpen && !isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[28px] border border-amber-200 bg-white p-6 sm:p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 ring-8 ring-amber-50">
              <ShieldAlert className="h-8 w-8" />
            </div>

            <h3 className="mt-4 text-lg font-black text-slate-900">
              Yêu cầu Chế độ Toàn Màn Hình
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Quy chế phòng thi EduMi quy định bài thi phải được thực hiện ở chế độ <strong>Toàn màn hình</strong> để kích hoạt tính năng khóa màn hình giám sát chống gian lận.
            </p>

            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-[11px] font-bold text-rose-700">
              ⚠️ Rời khỏi toàn màn hình hoặc chuyển tab sẽ bị ghi nhận lỗi vi phạm phòng thi!
            </div>

            <button
              type="button"
              onClick={requestFullscreenMode}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-black text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 cursor-pointer active:scale-98"
            >
              <Lock className="h-4 w-4" />
              <span>Xác nhận &amp; Mở lại toàn màn hình</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
