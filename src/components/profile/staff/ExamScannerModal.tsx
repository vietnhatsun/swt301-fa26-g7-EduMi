"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  X,
  Upload,
  FileText,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Trash2,
  CheckSquare,
  Hash,
  PenTool,
  ArrowRight,
  Eye,
  Check,
  ScanLine,
  Zap,
  Info,
  Plus,
  Layers,
  BookOpen,
  Square,
  Clock,
  StopCircle,
} from "lucide-react";
import { ExamQuestion } from "@/components/exam/exam-data";
import MathRenderer from "@/components/common/MathRenderer";

interface ExamScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyQuestions: (
    questions: ExamQuestion[],
    mode: "replace" | "append" | "fill_template",
    meta?: { examTitle?: string; subject?: string }
  ) => void;
  currentQuestionCount: number;
  currentSubject?: string;
}

const SAMPLE_RAW_EXAM = `KỲ THI TỐT NGHIỆP TRUNG HỌC PHỔ THÔNG NĂM 2026
MÔN: TOÁN HỌC - MÃ ĐỀ: 101

PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn. Thí sinh trả lời từ câu 1 đến câu 12. Mỗi câu hỏi thí sinh chỉ chọn một phương án.
Câu 1: Cho hàm số y = f(x) có bảng biến thiên. Điểm cực đ... của hàm số là điểm nào dưới đây?
A. x = 2
B. x = -2
C. y = 2
D. x = 0

Câu 2: Tập nghiệm của bất phương trình log2(x - 1) < 3 là:
A. (1; 9)
B. (-∞; 9)
C. (1; 8)
D. (1; +∞)

PHẦN II. Câu trắc nghiệm đúng sai. Thí sinh trả lời từ câu 1 đến câu 4.
Câu 1: Cho hàm số f(x) = x^3 - 3x^2 + 2 có đồ thị (C).
a) Đạo hàm f'(x) = 3x^2 - 6x.
b) Hàm số đồng biến trên khoảng (0; 2).
c) Giá trị cực tiểu của hàm số bằng -2.
d) Đồ thị cắt trục hoành tại đúng 3 điểm phân biệt.

PHẦN III. Câu trắc nghiệm trả lời ngắn.
Câu 1: Một doanh nghiệp dự tính hàm lợi nhuận P(x) = -0.1x^2 + 4.1x - 15 (triệu đồng). Tìm sản lượng x (tấn) để doanh nghiệp đạt lợi nhuận lớn nhất?

BẢNG ĐÁP ÁN VÀ LỜI GIẢI ĐỀ THI:
Phần I: 1.A | 2.A
Phần II: Câu 1: a-Đ, b-S, c-Đ, d-Đ
Phần III: Câu 1: 20.5 (Giải thích: Đỉnh parabol x = -b/(2a) = 20.5)`;

const SAMPLE_LITERATURE_EXAM = `Đề thi tốt nghiệp THPT 2025 – Môn Ngữ văn (phần câu hỏi)
Bộ Giáo dục và Đào tạo – Đề thi chính thức (2 trang)
Thời gian làm bài: 120 phút, không kể thời gian phát đề

I. ĐỌC HIỂU (4,0 điểm)
Đọc văn bản: Những vùng trời khác nhau (Nguyễn Minh Châu, trích Tuyển tập truyện ngắn hay nhất của Nguyễn Minh Châu, NXB Văn học, 2022, tr.33–35).
(Ngữ liệu đọc hiểu không chép lại ở đây, xem trong đề gốc.)
Thực hiện các yêu cầu:
Câu 1. Xác định ngôi kể được sử dụng trong văn bản.
Câu 2. Trong văn bản, quê hương của Lê và quê hương của Sơn gắn với hai dòng sông nào?
Câu 3. Phân tích tác dụng của biện pháp tu từ so sánh trong câu văn sau (câu văn ví đại đội của Lê như một gốc cây lớn, nhựa cây ứ đầy tỏa ra thành hai nhánh; xem câu nguyên văn trong đề gốc).
Câu 4. Nêu vai trò của chi tiết hai người bạn chia nhau tấm giát nằm, vài tấm áo sặc mùi thuốc đạn và chia nhau bầu trời Tổ quốc trên đầu (xem nguyên văn trong đề gốc) trong việc thể hiện nội dung văn bản.
Câu 5. Hai ngữ liệu sau đây có sự tương đồng nào về ý nghĩa?
(Ngữ liệu thứ nhất trích từ truyện Những vùng trời khác nhau của Nguyễn Minh Châu, nói về những vùng trời mà các chiến sĩ đã đi qua. Ngữ liệu thứ hai trích từ bài thơ Tiếng hát con tàu của Chế Lan Viên. Xem nguyên văn trong đề gốc.)

II. VIẾT (6,0 điểm)
Câu 1 (2,0 điểm)
Anh/Chị hãy viết đoạn văn nghị luận (khoảng 200 chữ) phân tích tình cảm của Lê dành cho Sơn trong văn bản ở phần Đọc hiểu.
Câu 2 (4,0 điểm)
Từ kết quả đọc hiểu văn bản Những vùng trời khác nhau và những hiểu biết về bối cảnh đất nước đang có nhiều thay đổi lớn lao, anh/chị hãy viết bài văn nghị luận (khoảng 600 chữ) với chủ đề: vùng trời quê hương nào cũng là bầu trời Tổ quốc.
HẾT
• Thí sinh không được sử dụng tài liệu.
• Giám thị không giải thích gì thêm.`;

/**
 * PHASE 1: Nén ảnh bất đồng bộ trước khi gửi OCR / AI
 * - Giảm dung lượng mỗi trang ảnh xuống < 400KB
 * - Max dimension: 1800px, WebP quality 0.82
 * - Nền trắng #FFFFFF giúp tăng độ tương phản cho chữ in và công thức Toán
 * - Kiểm tra signal?.aborted để ngắt tức thì nếu người dùng bấm "Dừng quét"
 */
export async function compressImageForOCR(
  file: File,
  signal?: AbortSignal
): Promise<File> {
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  // Bỏ qua nếu là PDF hoặc ảnh đã nhẹ hơn 450KB
  if (file.type === "application/pdf" || file.size <= 450 * 1024) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    if (signal?.aborted) {
      bitmap.close();
      throw new DOMException("Aborted", "AbortError");
    }

    const MAX_DIM = 1800;
    let { width, height } = bitmap;
    if (width > MAX_DIM || height > MAX_DIM) {
      const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }

    // Nền trắng giúp tăng độ tương phản cho chữ in và công thức Toán
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.82)
    );

    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
      type: "image/webp",
    });
  } catch (err: any) {
    if (err?.name === "AbortError" || signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    console.warn("[CompressImage] Fallback to original file:", err);
    return file;
  }
}

/**
 * PHASE 4: Thẻ câu hỏi Preview được bọc React.memo
 * Tránh re-render toàn bộ 50 câu khi đổi filter tab hoặc xóa 1 câu
 */
const ScannedQuestionCard = React.memo(function ScannedQuestionCard({
  q,
  idx,
  onRemove,
}: {
  q: ExamQuestion;
  idx: number;
  onRemove: (idx: number) => void;
}) {
  const isSingle = q.type === "single_choice";
  const isTf = q.type === "true_false";
  const isShort = q.type === "short_answer";
  const isEssay = q.type === "essay";

  const badgeColor = isSingle
    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
    : isTf
    ? "bg-purple-100 text-purple-800 border-purple-200"
    : isShort
    ? "bg-sky-100 text-sky-800 border-sky-200"
    : "bg-amber-100 text-amber-800 border-amber-200";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:shadow-xs transition space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-white text-xs font-black">
            {q.questionNumber || idx + 1}
          </span>
          <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-black ${badgeColor}`}>
            {q.part || "Phần I"} • {isSingle ? "Trắc nghiệm ABCD" : isTf ? "Đúng/Sai" : isShort ? "Điền số" : "Tự luận"}
          </span>
          {q.correctAnswer && (
            <span className="rounded-md bg-emerald-600 text-white px-2 py-0.5 text-[10px] font-black">
              Đáp án: {q.correctAnswer}
            </span>
          )}
          <span className="text-[11px] font-bold text-slate-400">
            ({q.points || 0.25} điểm)
          </span>
        </div>

        <button
          type="button"
          onClick={() => onRemove(idx)}
          title="Loại bỏ câu này khỏi danh sách nhập"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Nội dung câu hỏi đã phục hồi */}
      <div className="text-xs font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
        <MathRenderer text={q.content} />
      </div>

      {/* Hiển thị options trắc nghiệm ABCD */}
      {isSingle && q.options && q.options.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
          {q.options.map((opt) => {
            const isCorrect = q.correctAnswer === opt.id;
            return (
              <div
                key={opt.id}
                className={`flex items-start gap-2 rounded-xl p-2 text-xs transition ${
                  isCorrect
                    ? "bg-emerald-50 border border-emerald-300 font-bold text-emerald-900"
                    : "bg-slate-50 text-slate-700"
                }`}
              >
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-black ${
                  isCorrect ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                }`}>
                  {opt.id}
                </span>
                <span className="leading-relaxed">
                  <MathRenderer text={opt.text} />
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Hiển thị 4 ý Đúng / Sai */}
      {isTf && q.trueFalseItems && q.trueFalseItems.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {q.trueFalseItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl bg-purple-50/50 border border-purple-100 p-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-black text-purple-700 uppercase">
                  {item.id})
                </span>
                <span className="text-slate-700 font-medium leading-relaxed">
                  <MathRenderer text={item.content} />
                </span>
              </div>
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-black ${
                  item.isCorrect
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {item.isCorrect ? "✓ Đúng" : "✗ Sai"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Hiển thị đáp án điền số */}
      {isShort && (
        <div className="inline-flex items-center gap-2 rounded-xl bg-sky-50 border border-sky-200 px-3 py-1.5 text-xs text-sky-900">
          <span className="font-bold">Đáp án chuẩn:</span>
          <span className="font-mono font-black text-sky-700 text-sm">
            <MathRenderer text={q.correctAnswer || "Chưa có"} />
          </span>
        </div>
      )}

      {/* Hiển thị tự luận barem */}
      {isEssay && (
        <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-3 text-xs space-y-2">
          {q.rubricCriteria && q.rubricCriteria.length > 0 && (
            <div>
              <p className="font-bold text-amber-950 mb-1">
                Tiêu chí chấm điểm (Barem):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {q.rubricCriteria.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-lg bg-amber-100/90 text-amber-900 border border-amber-200 px-2 py-0.5 text-[11px] font-semibold"
                  >
                    ✓ <MathRenderer text={c} />
                  </span>
                ))}
              </div>
            </div>
          )}
          {q.sampleEssayAnswer && (
            <div>
              <p className="font-bold text-amber-950 mb-0.5">
                Dàn ý & Lời giải gợi ý:
              </p>
              <div className="text-slate-700 text-[11px] whitespace-pre-line bg-white/80 rounded-lg p-2 border border-amber-200/50 leading-relaxed">
                <MathRenderer text={q.sampleEssayAnswer} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lời giải thích */}
      {q.explanation && !isEssay && (
        <div className="text-[11px] text-slate-500 italic bg-slate-50 rounded-lg p-2 leading-relaxed">
          💡 <strong>Giải thích:</strong> <MathRenderer text={q.explanation} />
        </div>
      )}
    </div>
  );
});

export default function ExamScannerModal({
  isOpen,
  onClose,
  onApplyQuestions,
  currentQuestionCount,
  currentSubject = "Toán học",
}: ExamScannerModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [rawText, setRawText] = useState("");
  const [engine, setEngine] = useState<"auto" | "datalab" | "gemini">("auto");

  // Quá trình xử lý
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Controller để hủy / dừng request tức thì
  const abortControllerRef = useRef<AbortController | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Kết quả
  const [scannedQuestions, setScannedQuestions] = useState<ExamQuestion[]>([]);
  const [examMeta, setExamMeta] = useState<{ examTitle?: string; subject?: string; engineUsed?: string }>({});
  const [previewFilter, setPreviewFilter] = useState<"all" | "single_choice" | "true_false" | "short_answer" | "essay">("all");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dừng quét tức thì
  const handleStopScan = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsScanning(false);
    setScanStep("");
    setErrorMessage("Đã dừng quá trình quét theo yêu cầu của bạn.");
  };

  // Đóng modal an toàn (nếu đang scan thì dừng trước)
  const handleCloseModal = () => {
    if (isScanning) {
      handleStopScan();
    }
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected]);
      setErrorMessage(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const dropped = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...dropped]);
      setErrorMessage(null);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleScan = async () => {
    if (activeTab === "upload" && files.length === 0) {
      setErrorMessage("Vui lòng chọn ít nhất 1 tệp đề thi (PDF hoặc ảnh).");
      return;
    }
    if (activeTab === "paste" && !rawText.trim()) {
      setErrorMessage("Vui lòng dán nội dung đề thi vào ô văn bản.");
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsScanning(true);
    setErrorMessage(null);
    setElapsedSeconds(0);
    setScanStep(`Đang phân tích đề thi (Môn ${currentSubject})...`);

    // Bộ đếm thời gian thực
    timerIntervalRef.current = setInterval(() => {
      setElapsedSeconds((sec) => sec + 1);
    }, 1000);

    const timer1 = setTimeout(() => {
      if (controller.signal.aborted) return;
      setScanStep(
        activeTab === "upload"
          ? "Datalab OCR / Trích xuất công thức & bảng đáp án..."
          : "AI đang đọc câu hỏi, bù khuyết từ mờ & lập barem..."
      );
    }, 1500);

    const timer2 = setTimeout(() => {
      if (controller.signal.aborted) return;
      setScanStep("AI đang định dạng chuẩn cấu trúc Bộ GD&ĐT & điền đáp án...");
    }, 4500);

    // Timeout an toàn sau 60s nếu mạng chập chờn hoặc đề thi nhiều trang
    const timeoutTimer = setTimeout(() => {
      if (!controller.signal.aborted) {
        controller.abort();
        setErrorMessage("Thời gian xử lý quá 60 giây. Vui lòng bấm thử lại hoặc chọn động cơ 'Gemini Multimodal Direct'.");
        setIsScanning(false);
      }
    }, 60000);

    try {
      let res: Response;
      if (activeTab === "upload" && files.length > 0) {
        // Nén ảnh bất đồng bộ trước khi gửi lên Server (Phase 1)
        setScanStep(`Đang nén & tối ưu ${files.length} trang tài liệu...`);
        const compressedFiles: File[] = [];
        for (let i = 0; i < files.length; i++) {
          if (controller.signal.aborted) throw new DOMException("Aborted", "AbortError");
          setScanStep(`Đang tối ưu ảnh trang ${i + 1}/${files.length} (chuẩn hóa độ tương phản)...`);
          const cf = await compressImageForOCR(files[i], controller.signal);
          compressedFiles.push(cf);
        }

        if (controller.signal.aborted) throw new DOMException("Aborted", "AbortError");

        setScanStep(
          engine === "gemini"
            ? `Đang gửi hình ảnh phân tích trực tiếp qua AI Vision (Môn ${currentSubject})...`
            : `Đang gửi sang Datalab OCR bóc tách công thức LaTeX & bảng đáp án...`
        );

        const formData = new FormData();
        compressedFiles.forEach((f) => formData.append("file", f));
        formData.append("engine", engine);
        formData.append("subject", currentSubject);
        res = await fetch("/api/staff/scan-exam", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });
      } else {
        setScanStep("AI đang phân tích câu hỏi & lập barem chấm...");
        res = await fetch("/api/staff/scan-exam", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawText, engine, subject: currentSubject }),
          signal: controller.signal,
        });
      }

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timeoutTimer);

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể quét đề thi. Vui lòng thử lại.");
      }

      setScannedQuestions(data.questions || []);
      setExamMeta({
        examTitle: data.examTitle,
        subject: data.subject || currentSubject,
        engineUsed: data.engineUsed,
      });
      setScanStep("");
    } catch (err: any) {
      if (err.name === "AbortError" || controller.signal.aborted) {
        setErrorMessage("Đã dừng quá trình quét theo yêu cầu của bạn.");
      } else {
        setErrorMessage(err.message || "Đã xảy ra lỗi không mong muốn.");
      }
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timeoutTimer);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      abortControllerRef.current = null;
      setIsScanning(false);
    }
  };

  const handleRemoveQuestion = useCallback((idx: number) => {
    setScannedQuestions((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleReset = () => {
    setScannedQuestions([]);
    setFiles([]);
    setRawText("");
    setErrorMessage(null);
    setScanStep("");
  };

  // Thống kê câu hỏi quét được (useMemo)
  const { singleCount, tfCount, shortCount, essayCount } = useMemo(() => {
    let single = 0, tf = 0, short = 0, essay = 0;
    for (const q of scannedQuestions) {
      if (q.type === "single_choice") single++;
      else if (q.type === "true_false") tf++;
      else if (q.type === "short_answer") short++;
      else if (q.type === "essay") essay++;
    }
    return { singleCount: single, tfCount: tf, shortCount: short, essayCount: essay };
  }, [scannedQuestions]);

  const filteredPreview = useMemo(() => {
    return scannedQuestions.filter((q) =>
      previewFilter === "all" ? true : q.type === previewFilter
    );
  }, [scannedQuestions, previewFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-sky-50/40">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
              <ScanLine className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">
                  AI Exam Scanner & Answer Filler
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-black text-emerald-800">
                  <BookOpen className="h-3 w-3 text-emerald-600" />
                  Môn: {currentSubject}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow-2xs">
                  <Sparkles className="h-3 w-3" />
                  Datalab + Gemini
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Quét trang đề thi & bảng đáp án, tự động bù khuyết câu chữ bị mờ và fill toàn bộ câu hỏi + đáp án
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseModal}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Thông báo lỗi nếu có */}
          {errorMessage && (
            <div className="flex items-start gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-800">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
              <div className="text-xs font-medium space-y-1">
                <p className="font-bold">Lỗi quét đề thi:</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* CHƯA CÓ KẾT QUẢ: GIAO DIỆN NHẬP LIỆU */}
          {scannedQuestions.length === 0 ? (
            <div className="space-y-4">
              {/* TABS CHỌN CÁCH NHẬP */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer ${
                      activeTab === "upload"
                        ? "bg-sky-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Tải tệp đề thi & Bảng đáp án
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("paste")}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition cursor-pointer ${
                      activeTab === "paste"
                        ? "bg-sky-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Dán nội dung thô (Paste Text)
                  </button>
                </div>

                {/* Chọn Engine */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs">
                  <span className="font-bold text-slate-400">Động cơ:</span>
                  <select
                    value={engine}
                    onChange={(e: any) => setEngine(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 outline-none focus:border-sky-500"
                  >
                    <option value="auto">Datalab OCR + Gemini AI</option>
                    <option value="gemini">Gemini Multimodal Direct</option>
                  </select>
                </div>
              </div>

              {/* NỘI DUNG TAB 1: TẢI TỆP */}
              {activeTab === "upload" && (
                <div className="space-y-3">
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center transition cursor-pointer ${
                      files.length > 0
                        ? "border-sky-400 bg-sky-50/30"
                        : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 hover:border-slate-300"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-sky-600 shadow-2xs group-hover:scale-105 transition">
                        <Upload className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">
                          Kéo thả các trang đề thi & bảng đáp án vào đây hoặc <span className="text-sky-600">bấm để chọn</span>
                        </p>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">
                          Hỗ trợ chọn nhiều trang cùng lúc (.pdf, .png, .jpg, .webp). Tự động khớp đề với bảng đáp án ở trang cuối!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Danh sách tệp đã chọn */}
                  {files.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                          Các trang / tệp đã chọn ({files.length} tệp):
                        </span>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:underline cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Thêm trang khác
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {files.map((f, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700 font-bold text-[10px]">
                                {idx + 1}
                              </span>
                              <span className="font-semibold text-slate-800 truncate" title={f.name}>
                                {f.name}
                              </span>
                              <span className="text-[10px] text-slate-400 shrink-0">
                                ({(f.size / 1024).toFixed(0)} KB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile(idx);
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1 transition"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 rounded-xl bg-amber-50/80 border border-amber-200/70 p-3 text-amber-900 text-xs">
                    <Zap className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>Quy trình thông minh:</strong> Bạn có thể tải lên cùng lúc **các trang câu hỏi** và **trang bảng đáp án**. AI sẽ đọc bảng đáp án và tự động ghép đúng phương án (A, B, C, D hoặc Đúng/Sai) vào từng câu từ Câu 1 đến Câu 50!
                    </span>
                  </div>
                </div>
              )}

              {/* NỘI DUNG TAB 2: DÁN VĂN BẢN */}
              {activeTab === "paste" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                      Nội dung đề thi & Bảng đáp án thô:
                    </label>
                    <button
                      type="button"
                      onClick={() => setRawText(currentSubject === "Ngữ văn" ? SAMPLE_LITERATURE_EXAM : SAMPLE_RAW_EXAM)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Thử dán đề mẫu môn {currentSubject}
                    </button>
                  </div>

                  <textarea
                    rows={9}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Dán toàn bộ văn bản đề thi và bảng đáp án ở cuối vào đây (hỗ trợ cả các câu bị mất chữ hoặc chưa có đáp án)..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 font-mono text-xs text-slate-800 outline-none focus:border-sky-500 focus:bg-white focus:ring-3 focus:ring-sky-500/10 transition leading-relaxed"
                  />
                </div>
              )}

              {/* THANH TRẠNG THÁI TIẾN TRÌNH KHI SCANNING */}
              {isScanning && (
                <div className="rounded-2xl border border-sky-300 bg-gradient-to-r from-sky-50 via-indigo-50/40 to-white p-5 space-y-3.5 shadow-sm animate-in fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-800 block">
                          {scanStep || "Đang phân tích đề thi..."}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700">
                            <Clock className="h-3 w-3" />
                            Đang xử lý: {elapsedSeconds}s
                          </span>
                          <span className="text-[10px] text-slate-400">• Tự động bù khuyết câu chữ & khớp đáp án</span>
                        </div>
                      </div>
                    </div>

                    {/* NÚT DỪNG QUÉT TRỰC TIẾP */}
                    <button
                      type="button"
                      onClick={handleStopScan}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 px-3.5 py-1.5 text-xs font-black text-rose-700 transition cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
                      title="Dừng ngay lập tức và giữ nguyên nội dung bạn đã nhập"
                    >
                      <Square className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
                      <span>Dừng quét</span>
                    </button>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-200/70 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(95, 20 + elapsedSeconds * 4)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ĐÃ CÓ KẾT QUẢ: GIAO DIỆN PREVIEW DANH SÁCH CÂU HỎI */
            <div className="space-y-4">
              {/* THANH TỔNG QUAN KẾT QUẢ */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50/30 p-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      Quét thành công {scannedQuestions.length} câu hỏi & tự điền đáp án
                    </h4>
                    <p className="text-xs font-semibold text-slate-500">
                      Môn: <span className="font-bold text-emerald-800">{examMeta.subject || currentSubject}</span> • 
                      Động cơ: <span className="font-bold text-emerald-700">{examMeta.engineUsed || "AI Vision"}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Quét tệp khác
                </button>
              </div>

              {/* LỌC THEO PHẦN */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setPreviewFilter("all")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap ${
                    previewFilter === "all"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Tất cả ({scannedQuestions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFilter("single_choice")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap ${
                    previewFilter === "single_choice"
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  }`}
                >
                  Phần I: Trắc nghiệm ({singleCount})
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFilter("true_false")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap ${
                    previewFilter === "true_false"
                      ? "bg-purple-600 text-white"
                      : "bg-purple-50 text-purple-800 hover:bg-purple-100"
                  }`}
                >
                  Phần II: Đúng/Sai ({tfCount})
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFilter("short_answer")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap ${
                    previewFilter === "short_answer"
                      ? "bg-sky-600 text-white"
                      : "bg-sky-50 text-sky-800 hover:bg-sky-100"
                  }`}
                >
                  Phần III: Điền số ({shortCount})
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFilter("essay")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black transition cursor-pointer whitespace-nowrap ${
                    previewFilter === "essay"
                      ? "bg-amber-600 text-white"
                      : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                  }`}
                >
                  Tự luận / Ngữ văn ({essayCount})
                </button>
              </div>

              {/* DANH SÁCH CÂU HỎI PREVIEW (MEMOIZED) */}
              <div className="space-y-3 max-h-[46vh] overflow-y-auto pr-1">
                {filteredPreview.map((q, idx) => (
                  <ScannedQuestionCard
                    key={q.id || idx}
                    q={q}
                    idx={idx}
                    onRemove={handleRemoveQuestion}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/80">
          <div className="text-xs text-slate-500 font-medium">
            {scannedQuestions.length > 0 ? (
              <span>
                Hiện tại trong đề có <strong>{currentQuestionCount}</strong> câu khung. Quét được <strong>{scannedQuestions.length}</strong> câu hỏi.
              </span>
            ) : (
              <span>Môn đang chuẩn bị quét: <strong>{currentSubject}</strong>. Tự động bù khuyết & điền đáp án.</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {scannedQuestions.length === 0 ? (
              <>
                {isScanning ? (
                  <button
                    type="button"
                    onClick={handleStopScan}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-rose-600/20 transition cursor-pointer"
                  >
                    <Square className="h-4 w-4 fill-white" />
                    <span>Dừng quét ({elapsedSeconds}s)</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="w-1/2 sm:w-auto rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      disabled={(activeTab === "upload" && files.length === 0) || (activeTab === "paste" && !rawText.trim())}
                      onClick={handleScan}
                      className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-sky-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Bắt đầu Quét ({files.length > 0 ? `${files.length} tệp` : "Văn bản"})</span>
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                {/* 1. Điền vào khung có sẵn */}
                {currentQuestionCount > 0 && (
                  <button
                    type="button"
                    onClick={() => onApplyQuestions(scannedQuestions, "fill_template", examMeta)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2.5 text-xs font-black text-indigo-800 transition cursor-pointer shadow-2xs"
                    title="Điền nội dung và đáp án vào đúng vị trí các câu hỏi trong khung hiện tại"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    Khớp vào khung hiện có
                  </button>
                )}

                {/* 2. Ghi đè toàn bộ */}
                <button
                  type="button"
                  onClick={() => onApplyQuestions(scannedQuestions, "replace", examMeta)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  Ghi đè ({scannedQuestions.length} câu)
                </button>

                {/* 3. Nối tiếp */}
                <button
                  type="button"
                  onClick={() => onApplyQuestions(scannedQuestions, "append", examMeta)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition cursor-pointer"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  Nối tiếp vào sau
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
