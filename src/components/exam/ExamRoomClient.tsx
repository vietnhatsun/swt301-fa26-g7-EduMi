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
  Maximize2,
  Minimize2,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Send,
  HelpCircle,
  Type,
} from "lucide-react";
import { ExamItem, ExamQuestion, getExamQuestions } from "./exam-data";
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
}

export default function ExamRoomClient({ exam, mode }: ExamRoomClientProps) {
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
    return getExamQuestions(exam.id);
  }, [exam.id]);

  // Current Question Pointer
  const [currentIndex, setCurrentIndex] = useState(0);

  // User State
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [violations, setViolations] = useState(0);
  const [showViolationToast, setShowViolationToast] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Time Countdown (in seconds)
  const initialSeconds = isExamMode ? exam.durationMinutes * 60 : 60 * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [timeSpent, setTimeSpent] = useState(0);

  // Modals & View state
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showPracticeHint, setShowPracticeHint] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  // Format Time Display (MM:SS)
  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Core Submit & Save to Storage logic
  const submitAndSaveExam = useCallback(() => {
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    questions.forEach((q) => {
      const selected = answers[q.id];
      if (!selected) {
        skippedCount++;
      } else if (selected === q.correctAnswer) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const isDgnl = exam.category === "ĐGNL ĐHQG";
    const totalQ = questions.length;
    const rawScore = totalQ > 0 ? (correctCount / totalQ) * (isDgnl ? 1200 : 10) : 0;
    const finalScore = isDgnl ? Math.round(rawScore) : Number(rawScore.toFixed(1));
    const maxScore = isDgnl ? 1200 : 10;
    const accuracyPercent = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;

    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
    const durationFormatted = `${Math.max(1, Math.ceil(timeSpent / 60))} phút`;

    const status: "Đã hoàn thành" | "Đạt" | "Cần cố gắng" =
      rawScore >= (isDgnl ? 800 : 8.0)
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
      score: `${finalScore} / ${maxScore}`,
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
      mode,
      completedAt: now.toISOString(),
    };

    saveExamSubmission(record);
    setIsSubmitModalOpen(false);
    setIsCompleted(true);
  }, [answers, exam, mode, questions, timeSpent, violations]);

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

  // Auto hide violation toast after 4 seconds
  useEffect(() => {
    if (showViolationToast) {
      const timer = setTimeout(() => {
        setShowViolationToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showViolationToast]);

  // Select Answer Handler
  const handleSelectOption = (optionId: "A" | "B" | "C" | "D") => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted || isExitModalOpen || isSubmitModalOpen) return;

      const key = e.key.toUpperCase();
      if (key === "ARROWLEFT" && currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
        setShowPracticeHint(false);
      } else if (key === "ARROWRIGHT" && currentIndex < totalQuestions - 1) {
        setCurrentIndex((i) => i + 1);
        setShowPracticeHint(false);
      } else if (["A", "B", "C", "D"].includes(key)) {
        handleSelectOption(key as "A" | "B" | "C" | "D");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, totalQuestions, isCompleted, isExitModalOpen, isSubmitModalOpen]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Handlers
  const handleConfirmExit = () => {
    setIsExitModalOpen(false);
    router.push("/exam");
  };

  const handleConfirmSubmit = () => {
    submitAndSaveExam();
  };

  const handleRetakeExam = () => {
    setAnswers({});
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

  return (
    <div className="flex min-h-screen flex-col bg-[#eef2f6] text-[#10213a] select-none font-sans">
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
              Không gian làm bài tập trung
            </div>
          </div>
        </div>

        {/* Center: Title & Subtitle */}
        <div className="hidden md:flex flex-col items-center text-center">
          <h1 className="text-sm sm:text-base font-black text-slate-900 max-w-lg truncate">
            {exam.cardCode}: {exam.title}
          </h1>
          <div className="text-[11px] font-semibold text-slate-500">
            Mã đề: <span className="font-bold text-slate-800">{exam.examCode}</span> ·{" "}
            {totalQuestions} câu hỏi ·{" "}
            <span className="text-emerald-700">Tự động ghi nhận vi phạm</span>
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
          {/* Text Size Adjuster Bar (75%, 100%, 125%, 150%) - Controls Question Card Font Size */}
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

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
            title={isFullscreen ? "Thu nhỏ cửa sổ" : "Mở toàn màn hình"}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </header>

      {/* ── Anti-Cheat Toast Warning ── */}
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

      {/* ── Main Workspace Body (Expanded to near full width on left/right) ── */}
      <div className="mx-auto flex w-full max-w-[1880px] flex-1 gap-5 lg:gap-6 px-3 sm:px-5 lg:px-6 py-4 sm:py-5">
        {/* ── Left Sidebar: Unified Single Card for Timer, Progress & Question Palette ── */}
        <aside className="w-full sm:w-[290px] lg:w-[320px] shrink-0 flex flex-col">
          <div className="flex-1 rounded-[32px] bg-white p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div>
              {/* 1. Timer Block inside the single card */}
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
                <div className="mt-2 text-[11px] font-bold text-slate-500">
                  Đã trả lời <strong className="text-slate-800">{answeredCount}/{totalQuestions}</strong> câu
                </div>
              </div>

              {/* 3. Question Number Palette Grid */}
              <div className="pt-4">
                <div className="mb-3 text-[11px] font-black uppercase tracking-wider text-slate-700">
                  DANH SÁCH CÂU HỎI
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[360px] overflow-y-auto pr-1">
                  {questions.map((q, idx) => {
                    const isAnswered = Boolean(answers[q.id]);
                    const isCurrent = idx === currentIndex;
                    const isFlagged = Boolean(flaggedQuestions[q.id]);

                    let btnStyles = "border border-slate-200 bg-white text-slate-700 hover:border-slate-300";

                    if (isCurrent) {
                      btnStyles = "border-2 border-[#009b77] bg-white text-[#009b77] font-black ring-2 ring-[#009b77]/25 shadow-xs";
                    } else if (isAnswered) {
                      btnStyles = "border border-[#009b77]/40 bg-[#e0f5ee] text-[#007a5e] font-black";
                    }

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          setCurrentIndex(idx);
                          setShowPracticeHint(false);
                        }}
                        className={`relative flex h-11 w-full items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${btnStyles}`}
                        title={`Câu ${idx + 1}${isAnswered ? " (Đã chọn đáp án)" : ""}`}
                      >
                        <span>{idx + 1}</span>
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

            {/* 4. Anti-Cheat Guidelines Card (Bottom of the SAME single card) */}
            <div className="mt-6 rounded-2xl border border-[#ffeed3] bg-[#fff6ea] p-3.5 text-[11px] font-medium leading-relaxed text-[#b35900] shadow-2xs">
              <div className="flex items-center gap-1.5 font-black text-[#964a00] mb-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Quy chế phòng thi:</span>
              </div>
              <p>
                Không rời tab, đổi cửa sổ hoặc thoát toàn màn hình trong khi làm bài. Mỗi lần vi phạm đều được ghi nhận.
              </p>
            </div>
          </div>
        </aside>

        {/* ── Right Main Panel: Question Card (Scales ONLY this box with textScale) ── */}
        <main className="flex-1 flex flex-col justify-between rounded-[32px] bg-white p-6 sm:p-8 shadow-sm border border-slate-200/80 min-h-[520px]">
          <div>
            {/* Question Card Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <h2 className={`${scaleConfig.titleSize} font-black tracking-wide text-[#009b77] transition-all`}>
                  CÂU HỎI {currentIndex + 1}
                </h2>
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

              <div className={`${scaleConfig.instructionSize} font-semibold text-slate-500 transition-all`}>
                {currentQuestion?.instruction || "Chọn một đáp án đúng"}
              </div>
            </div>

            {/* Question Content Body */}
            <div className="py-4 sm:py-6">
              <h3 className={`${scaleConfig.contentSize} font-bold leading-relaxed text-slate-900 transition-all`}>
                {currentQuestion?.content}
              </h3>
            </div>

            {/* Answer Options Stack (A, B, C, D) */}
            <div className="space-y-3">
              {currentQuestion?.options.map((opt) => {
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
                      {opt.text}
                    </span>

                    {/* Selected Checkmark Indicator */}
                    {isSelected && (
                      <CheckCircle2 className={`${scaleConfig.checkIconSize} shrink-0 text-[#009b77] transition-all`} />
                    )}
                  </button>
                );
              })}
            </div>

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
                    {currentQuestion?.explanation}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Bottom Action Navigation Bar (Matching Reference Image) ── */}
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

            {/* Right: Submit Button (Bold Teal Button matching Reference) */}
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[#0d7d6b] hover:bg-[#096859] px-7 py-2.5 text-xs sm:text-sm font-black text-white shadow-md transition hover:shadow-lg cursor-pointer active:scale-95"
            >
              <Send className="h-4 w-4" />
              <span>Nộp bài</span>
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
      />
    </div>
  );
}
