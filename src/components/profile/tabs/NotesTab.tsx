"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Camera,
  ClipboardPaste,
  Maximize2,
  Minimize2,
  Sparkles,
  Trash2,
  Upload,
  Clock,
  BookOpen,
  Pin,
} from "lucide-react";
import { QuickNotesPiPContent, openPiPWindowHelper } from "../QuickNotesPiP";

export interface NoteCard {
  id: string;
  content: string;
  sticker?: string;
  stickerColor?: string;
  createdAt: string;
}

export interface StudySession {
  id: string;
  title: string;
  subject: string;
  dateDay: string;
  dateMonth: string;
  fullDate: string;
  columns: {
    lecture: NoteCard[]; // Nội dung bài học
    supplementary: NoteCard[]; // Nội dung bổ sung quan trọng
    questions: NoteCard[]; // Câu hỏi để củng cố kiến thức
  };
}

interface NotesTabProps {
  fullName?: string;
}

export default function NotesTab({
  fullName = "Nguyễn Ngọc Thạch 2k3",
}: NotesTabProps) {
  // ── Initial Sessions matching EduMi ──
  const [sessions, setSessions] = useState<StudySession[]>([
    {
      id: "session-new",
      title: "Chủ đề mới",
      subject: "IELTS",
      dateDay: "26",
      dateMonth: "TH9",
      fullDate: "26 THÁNG 9, 2026",
      columns: {
        lecture: [],
        supplementary: [],
        questions: [],
      },
    },
    {
      id: "session-1",
      title: "Tổng hợp 50 Idioms thường gặp trong bài thi Speaking Part 2",
      subject: "Tiếng Anh (IELTS)",
      dateDay: "26",
      dateMonth: "TH9",
      fullDate: "26 THÁNG 9, 2026",
      columns: {
        lecture: [
          {
            id: "lec-1",
            content:
              "1. A piece of cake: Rất dễ dàng\n→ Ví dụ: 'The final speaking task turned out to be a piece of cake after weeks of intensive practice.'",
            sticker: "⭐ Quan trọng",
            stickerColor: "bg-amber-50 text-amber-800 border-amber-200",
            createdAt: "08:15",
          },
          {
            id: "lec-2",
            content:
              "2. Break a leg: Chúc may mắn (thường dùng trước kỳ thi hoặc phỏng vấn)\n→ Ví dụ: 'My tutor wished me to break a leg right before entering the exam room.'",
            sticker: "🔥 Đề thi",
            stickerColor: "bg-rose-50 text-rose-800 border-rose-200",
            createdAt: "08:25",
          },
          {
            id: "lec-3",
            content:
              "3. Under the weather: Cảm thấy không khỏe, uể oải nhẹ do thời tiết\n→ Ví dụ: 'I was feeling slightly under the weather, but still managed to talk fluently.'",
            sticker: "💡 Cần nhớ",
            stickerColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
            createdAt: "08:40",
          },
        ],
        supplementary: [
          {
            id: "sup-1",
            content:
              "Nguyên tắc 2-3 Idioms: Không lạm dụng quá nhiều thành ngữ trong 2 phút nói; giám khảo IELTS chấm Lexical Resource ưu tiên ngữ cảnh tự nhiên.",
            sticker: "⚠️ Lưu ý",
            stickerColor: "bg-purple-50 text-purple-800 border-purple-200",
            createdAt: "09:00",
          },
          {
            id: "sup-2",
            content:
              "Collocations nâng band: Kết hợp idioms với các trạng từ tự nhiên như 'literally a piece of cake', 'somewhat under the weather'.",
            createdAt: "09:12",
          },
        ],
        questions: [
          {
            id: "que-1",
            content:
              "Câu hỏi củng cố: Hãy kể lại một kỷ niệm vượt qua thử thách học tập khó khăn và sử dụng ít nhất 2 idioms đã học?",
            sticker: "🎯 Luyện tập",
            stickerColor: "bg-blue-50 text-blue-800 border-blue-200",
            createdAt: "09:30",
          },
          {
            id: "que-2",
            content:
              "Phân biệt sắc thái biểu đạt giữa 'Under the weather' (sức khỏe thể chất) và 'Feeling blue' (tâm trạng buồn bã)?",
            createdAt: "09:45",
          },
        ],
      },
    },
    {
      id: "session-2",
      title: "Công thức đạo hàm và ứng dụng khảo sát hàm số",
      subject: "Toán học 12",
      dateDay: "24",
      dateMonth: "TH9",
      fullDate: "24 THÁNG 9, 2026",
      columns: {
        lecture: [
          {
            id: "lec-201",
            content:
              "Đạo hàm hàm hợp: (u(v(x)))' = u'(v(x)) · v'(x).\n→ Luôn kiểm tra tập xác định D trước khi giải phương trình y' = 0.",
            sticker: "⭐ Công thức vàng",
            stickerColor: "bg-amber-50 text-amber-800 border-amber-200",
            createdAt: "19:40",
          },
          {
            id: "lec-202",
            content:
              "Cực trị hàm bậc 3: y = ax³ + bx² + cx + d (a ≠ 0)\n→ y' = 3ax² + 2bx + c. Hàm số có 2 cực trị khi và chỉ khi Δ' = b² - 3ac > 0.",
            sticker: "🔥 Sẽ thi ĐH",
            stickerColor: "bg-rose-50 text-rose-800 border-rose-200",
            createdAt: "20:05",
          },
        ],
        supplementary: [
          {
            id: "sup-201",
            content:
              "Mẹo Casio 580VNX: Dùng TABLE (Mode 8) quét Step = (End - Start) / 29 để dò nhanh max/min trên đoạn [a, b].",
            sticker: "💡 Mẹo Casio",
            stickerColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
            createdAt: "20:20",
          },
        ],
        questions: [
          {
            id: "que-201",
            content:
              "Cho hàm số y = -x³ + 3x² - 1. Tìm các khoảng nghịch biến của hàm số?",
            createdAt: "20:45",
          },
        ],
      },
    },
    {
      id: "session-3",
      title: "Dàn ý phân tích tác phẩm 'Vợ Nhặt' - Kim Lân",
      subject: "Ngữ văn 12",
      dateDay: "21",
      dateMonth: "TH9",
      fullDate: "21 THÁNG 9, 2026",
      columns: {
        lecture: [
          {
            id: "lec-301",
            content:
              "Tình huống truyện độc đáo: Tràng nghèo, xấu xí lại 'nhặt' được vợ giữa nạn đói thảm khốc 1945 chỉ bằng bốn bát bánh đúc.",
            sticker: "⭐ Trọng tâm",
            stickerColor: "bg-amber-50 text-amber-800 border-amber-200",
            createdAt: "14:15",
          },
          {
            id: "lec-302",
            content:
              "Hình tượng bà cụ Tứ: Người mẹ nghèo với tấm lòng bao dung, vừa mừng vừa tủi xót, nén nỗi âu lo để thắp lên niềm tin vào tương lai.",
            createdAt: "14:40",
          },
        ],
        supplementary: [
          {
            id: "sup-301",
            content:
              "Chi tiết nghệ thuật đắt giá: Nồi cháo cám đắng chát trong bữa ăn đầu đón dâu – nốt trầm xót xa nhưng sáng ngời tình thương và khát vọng sống.",
            sticker: "🔥 Dẫn chứng điểm 8+",
            stickerColor: "bg-rose-50 text-rose-800 border-rose-200",
            createdAt: "15:00",
          },
        ],
        questions: [
          {
            id: "que-301",
            content:
              "Phân tích tâm trạng của nhân vật Tràng trong buổi sáng sau ngày đưa người vợ nhặt về nhà?",
            createdAt: "15:30",
          },
        ],
      },
    },
  ]);

  const [activeSessionId, setActiveSessionId] = useState<string>("session-new");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals & Popovers
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [targetColumn, setTargetColumn] = useState<
    "lecture" | "supplementary" | "questions"
  >("lecture");
  const [newCardText, setNewCardText] = useState("");
  const [newCardSticker, setNewCardSticker] = useState("");

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteContent, setPasteContent] = useState("");
  const [pasteTargetCol, setPasteTargetCol] = useState<
    "lecture" | "supplementary" | "questions"
  >("lecture");

  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [newSessionSubject, setNewSessionSubject] = useState("IELTS");

  const [pipWindow, setPipWindow] = useState<Window | null>(null);

  // Sync sessions to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("edumi_study_sessions");
        if (saved) {
          setSessions(JSON.parse(saved));
        }
      } catch (e) {
        console.warn("Failed to load saved sessions", e);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("edumi_study_sessions", JSON.stringify(sessions));
      } catch (e) {
        console.warn("Failed to save sessions", e);
      }
    }
  }, [sessions]);

  const handleTogglePiP = async () => {
    if (pipWindow && !pipWindow.closed) {
      pipWindow.close();
      setPipWindow(null);
      return;
    }
    const win = await openPiPWindowHelper(390, 620);
    if (win) {
      win.addEventListener("pagehide", () => {
        setPipWindow(null);
      });
      setPipWindow(win);
    }
  };

  // Get current active session
  const currentSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const totalCardsInActive =
    (currentSession?.columns.lecture.length || 0) +
    (currentSession?.columns.supplementary.length || 0) +
    (currentSession?.columns.questions.length || 0);

  // Available stickers
  const stickerOptions = [
    {
      label: "⭐ Quan trọng",
      color: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      label: "🔥 Sẽ thi ĐH",
      color: "bg-rose-50 text-rose-800 border-rose-200",
    },
    {
      label: "💡 Cần nhớ",
      color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      label: "⚠️ Lưu ý",
      color: "bg-purple-50 text-purple-800 border-purple-200",
    },
    {
      label: "🎯 Luyện tập",
      color: "bg-blue-50 text-blue-800 border-blue-200",
    },
    {
      label: "✅ Đã hiểu",
      color: "bg-teal-50 text-teal-800 border-teal-200",
    },
  ];

  // Handler: Add card
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardText.trim()) return;

    const matchedSticker = stickerOptions.find(
      (s) => s.label === newCardSticker
    );

    const newCard: NoteCard = {
      id: "card-" + Date.now(),
      content: newCardText.trim(),
      sticker: newCardSticker || undefined,
      stickerColor: matchedSticker?.color,
      createdAt: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setSessions((prev) =>
      prev.map((sess) => {
        if (sess.id !== activeSessionId) return sess;
        return {
          ...sess,
          columns: {
            ...sess.columns,
            [targetColumn]: [...sess.columns[targetColumn], newCard],
          },
        };
      })
    );

    setNewCardText("");
    setNewCardSticker("");
    setShowAddCardModal(false);
  };

  // Handler: Delete card
  const handleDeleteCard = (
    colKey: "lecture" | "supplementary" | "questions",
    cardId: string
  ) => {
    setSessions((prev) =>
      prev.map((sess) => {
        if (sess.id !== activeSessionId) return sess;
        return {
          ...sess,
          columns: {
            ...sess.columns,
            [colKey]: sess.columns[colKey].filter((c) => c.id !== cardId),
          },
        };
      })
    );
  };

  // Handler: Quick paste note
  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteContent.trim()) return;

    const newCard: NoteCard = {
      id: "card-" + Date.now(),
      content: pasteContent.trim(),
      sticker: "📋 Đã dán",
      stickerColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      createdAt: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setSessions((prev) =>
      prev.map((sess) => {
        if (sess.id !== activeSessionId) return sess;
        return {
          ...sess,
          columns: {
            ...sess.columns,
            [pasteTargetCol]: [...sess.columns[pasteTargetCol], newCard],
          },
        };
      })
    );

    setPasteContent("");
    setShowPasteModal(false);
  };

  // Handler: Mock camera / OCR upload
  const handleCameraUploadSim = () => {
    const ocrNotes: NoteCard[] = [
      {
        id: "ocr-1",
        content:
          "Trích xuất OCR từ ảnh bài giảng:\n• Trọng tâm bài học: Cấu trúc câu điều kiện loại 3 và Mix Conditionals\n• Công thức: If + S + had + V3/ed, S + would/could + have + V3/ed.",
        sticker: "📷 Từ ảnh chụp",
        stickerColor: "bg-blue-50 text-blue-800 border-blue-200",
        createdAt: "Vừa xong",
      },
    ];

    setSessions((prev) =>
      prev.map((sess) => {
        if (sess.id !== activeSessionId) return sess;
        return {
          ...sess,
          columns: {
            ...sess.columns,
            lecture: [...sess.columns.lecture, ...ocrNotes],
          },
        };
      })
    );

    setShowCameraModal(false);
  };

  // Handler: Create new session
  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) return;

    const now = new Date();
    const day = String(now.getDate());
    const month = `TH${now.getMonth() + 1}`;
    const fullDate = `${day} THÁNG ${now.getMonth() + 1}, ${now.getFullYear()}`;

    const newSession: StudySession = {
      id: "sess-" + Date.now(),
      title: newSessionTitle.trim(),
      subject: newSessionSubject || "Chung",
      dateDay: day,
      dateMonth: month,
      fullDate: fullDate,
      columns: {
        lecture: [],
        supplementary: [],
        questions: [],
      },
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setNewSessionTitle("");
    setShowNewSessionModal(false);
  };

  return (
    <div
      className={`transition-all duration-200 ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-[#f8faf8] p-4 sm:p-6 lg:p-8 overflow-y-auto flex flex-col"
          : "space-y-4"
      }`}
    >
      {/* ── KHỐI BUỔI HỌC Ở TRÊN CÙNG (Thay thế hoàn toàn khối header cũ) ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] space-y-4">
        {/* Hàng 1: Tiêu đề BUỔI HỌC, Nút Chụp ghi chú, Dán kiến thức & Công cụ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-3 border-b border-slate-100">
          {/* Trái: BUỔI HỌC + 2 Nút tác vụ nhanh */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-2 pr-2.5 sm:border-r border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
                <BookOpen className="w-4 h-4 text-emerald-700" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span>BUỔI HỌC</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                  {sessions.length}
                </span>
              </h2>
              <button
                type="button"
                onClick={() => setShowNewSessionModal(true)}
                className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Tạo buổi học mới"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Nút 1: Chụp ghi chú mới */}
            <button
              type="button"
              onClick={() => setShowCameraModal(true)}
              className="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs hover:shadow transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Chụp ghi chú mới</span>
            </button>

            {/* Nút 2: Dán kiến thức */}
            <button
              type="button"
              onClick={() => setShowPasteModal(true)}
              className="py-1.5 px-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/90 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dán kiến thức</span>
            </button>

            {/* Nút 3: Ghim nổi trên Google Meet (Always-on-top PiP) */}
            <button
              type="button"
              onClick={handleTogglePiP}
              className={`py-1.5 px-3.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 shadow-2xs hover:shadow transition-all cursor-pointer ${
                pipWindow
                  ? "bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500/30"
                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300"
              }`}
              title="Mở cửa sổ ghi chú nhỏ luôn ghim nổi trên Google Meet để note bài không cần chuyển tab"
            >
              <Pin className={`w-3.5 h-3.5 ${pipWindow ? "text-white" : "text-emerald-600"}`} />
              <span>{pipWindow ? "Đang ghim nổi (Đóng)" : "Ghim nổi trên Google Meet"}</span>
            </button>
          </div>

          {/* Phải: Nút công cụ Toàn màn hình */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Fullscreen button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 sm:p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer"
              title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Hàng 2: Danh sách các buổi học xếp hàng ngang (Horizontal Scroll) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
          {sessions.map((sess) => {
            const isSelected = sess.id === activeSessionId;
            const cardCount =
              sess.columns.lecture.length +
              sess.columns.supplementary.length +
              sess.columns.questions.length;

            return (
              <div
                key={sess.id}
                onClick={() => setActiveSessionId(sess.id)}
                className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer flex-shrink-0 flex items-center gap-3 min-w-[210px] max-w-[280px] ${
                  isSelected
                    ? "bg-emerald-50/90 border-emerald-500 shadow-xs ring-2 ring-emerald-500/25"
                    : "bg-white hover:bg-slate-50 border-slate-200/80 hover:border-emerald-200"
                }`}
              >
                {/* Date Block */}
                <div
                  className={`w-10 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border leading-none transition-colors ${
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  <span className="text-xs font-black tracking-tight">
                    {sess.dateDay}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-wider opacity-90 mt-0.5">
                    {sess.dateMonth}
                  </span>
                </div>

                {/* Session Details */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-xs font-bold leading-snug truncate transition-colors ${
                      isSelected
                        ? "text-emerald-950 font-black"
                        : "text-slate-800 hover:text-emerald-800"
                    }`}
                  >
                    {sess.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5 flex items-center gap-1.5 truncate">
                    <span className="font-semibold text-emerald-700">
                      {cardCount} thẻ
                    </span>
                    <span>·</span>
                    <span className="truncate">{sess.subject}</span>
                  </p>
                </div>
              </div>
            );
          })}

          {/* Quick Add Session card at end of scroll row */}
          <button
            type="button"
            onClick={() => setShowNewSessionModal(true)}
            className="p-3 rounded-2xl border border-dashed border-slate-300 hover:border-emerald-400 bg-slate-50/60 hover:bg-emerald-50/50 text-slate-600 hover:text-emerald-800 font-bold text-xs flex items-center gap-2 flex-shrink-0 transition-all cursor-pointer h-[54px]"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span className="whitespace-nowrap">Thêm buổi học</span>
          </button>
        </div>
      </div>

      {/* ── 3 CỘT CORNELL NOTES BOARD (Trải rộng toàn màn hình) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 items-start">
        {/* ══════ CỘT 1: NỘI DUNG BÀI HỌC (Blue Dot) ══════ */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(6,78,59,0.03)] flex flex-col min-h-[460px]">
          {/* Column Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs" />
              <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                Nội dung bài học
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {currentSession.columns.lecture.length}
            </span>
          </div>

          {/* Add card button */}
          <button
            type="button"
            onClick={() => {
              setTargetColumn("lecture");
              setShowAddCardModal(true);
            }}
            className="mt-3.5 w-full py-2 px-3 rounded-xl border border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/30 hover:bg-blue-50/70 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm thẻ</span>
          </button>

          {/* Cards List */}
          <div className="mt-3.5 space-y-3 flex-1 overflow-y-auto pr-0.5">
            {currentSession.columns.lecture.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl my-auto">
                Chưa có thẻ nào trong mục này. Bấm{" "}
                <span className="font-bold text-blue-600">+ Thêm thẻ</span> để
                bắt đầu ghi chú!
              </div>
            ) : (
              currentSession.columns.lecture.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all group relative"
                >
                  {card.sticker && (
                    <div className="mb-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          card.stickerColor ||
                          "bg-blue-50 text-blue-800 border-blue-200"
                        }`}
                      >
                        {card.sticker}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                    {card.content}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {card.createdAt}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCard("lecture", card.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      title="Xóa thẻ"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ══════ CỘT 2: NỘI DUNG BỔ SUNG QUAN TRỌNG (Purple Dot) ══════ */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(6,78,59,0.03)] flex flex-col min-h-[460px]">
          {/* Column Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-xs" />
              <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                Nội dung bổ sung quan trọng
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              {currentSession.columns.supplementary.length}
            </span>
          </div>

          {/* Add card button */}
          <button
            type="button"
            onClick={() => {
              setTargetColumn("supplementary");
              setShowAddCardModal(true);
            }}
            className="mt-3.5 w-full py-2 px-3 rounded-xl border border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/30 hover:bg-purple-50/70 text-purple-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm thẻ</span>
          </button>

          {/* Cards List */}
          <div className="mt-3.5 space-y-3 flex-1 overflow-y-auto pr-0.5">
            {currentSession.columns.supplementary.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl my-auto">
                Ghi lại các lưu ý, mẹo giải đề hoặc cạm bẫy hay gặp tại đây.
              </div>
            ) : (
              currentSession.columns.supplementary.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-purple-300 shadow-2xs hover:shadow-md transition-all group relative"
                >
                  {card.sticker && (
                    <div className="mb-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          card.stickerColor ||
                          "bg-purple-50 text-purple-800 border-purple-200"
                        }`}
                      >
                        {card.sticker}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                    {card.content}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {card.createdAt}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteCard("supplementary", card.id)
                      }
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      title="Xóa thẻ"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ══════ CỘT 3: CÂU HỎI ĐỂ CỦNG CỐ KIẾN THỨC (Green Dot) ══════ */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(6,78,59,0.03)] flex flex-col min-h-[460px]">
          {/* Column Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
              <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                Câu hỏi để củng cố kiến thức
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {currentSession.columns.questions.length}
            </span>
          </div>

          {/* Add card button */}
          <button
            type="button"
            onClick={() => {
              setTargetColumn("questions");
              setShowAddCardModal(true);
            }}
            className="mt-3.5 w-full py-2 px-3 rounded-xl border border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm thẻ</span>
          </button>

          {/* Cards List */}
          <div className="mt-3.5 space-y-3 flex-1 overflow-y-auto pr-0.5">
            {currentSession.columns.questions.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl my-auto">
                Tạo câu hỏi gợi nhớ (Active Recall) để ôn tập bài giảng đạt hiệu
                quả cao nhất!
              </div>
            ) : (
              currentSession.columns.questions.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all group relative"
                >
                  {card.sticker && (
                    <div className="mb-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          card.stickerColor ||
                          "bg-emerald-50 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        {card.sticker}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                    {card.content}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {card.createdAt}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCard("questions", card.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      title="Xóa thẻ"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL: THÊM THẺ MỚI ── */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Thêm thẻ vào</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {targetColumn === "lecture"
                    ? "Nội dung bài học"
                    : targetColumn === "supplementary"
                    ? "Nội dung bổ sung"
                    : "Câu hỏi củng cố"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCardModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Chọn phân mục cột:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetColumn("lecture")}
                    className={`py-2 px-2 text-center text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      targetColumn === "lecture"
                        ? "bg-blue-50 text-blue-700 border-blue-300"
                        : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    Bài học
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetColumn("supplementary")}
                    className={`py-2 px-2 text-center text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      targetColumn === "supplementary"
                        ? "bg-purple-50 text-purple-700 border-purple-300"
                        : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    Bổ sung
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetColumn("questions")}
                    className={`py-2 px-2 text-center text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      targetColumn === "questions"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    Câu hỏi
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nội dung ghi chú:
                </label>
                <textarea
                  rows={4}
                  required
                  value={newCardText}
                  onChange={(e) => setNewCardText(e.target.value)}
                  placeholder="Nhập kiến thức, công thức hoặc câu hỏi cần nhớ..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Gắn nhãn / Sticker (Tùy chọn):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {stickerOptions.map((stk) => (
                    <button
                      key={stk.label}
                      type="button"
                      onClick={() =>
                        setNewCardSticker(
                          newCardSticker === stk.label ? "" : stk.label
                        )
                      }
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        newCardSticker === stk.label
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {stk.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
                >
                  Lưu thẻ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CHỤP GHI CHÚ MỚI (Camera / OCR Scan) ── */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Chụp / Tải ảnh vở ghi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCameraModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Trí tuệ nhân tạo EduMi AI sẽ tự động phân tích ảnh chụp vở ghi hoặc slide bài giảng và phân loại vào 3 cột Cornell tương ứng.
            </p>

            <div className="border-2 border-dashed border-emerald-200 rounded-2xl p-6 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors cursor-pointer mb-4">
              <Upload className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">
                Nhấn để tải ảnh vở ghi hoặc kéo thả vào đây
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                PNG, JPG hoặc HEIC (Tối đa 15MB)
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCameraModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleCameraUploadSim}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Trích xuất với AI</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: DÁN KIẾN THỨC NHANH ── */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ClipboardPaste className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Dán kiến thức nhanh
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handlePasteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đích lưu trữ:
                </label>
                <select
                  value={pasteTargetCol}
                  onChange={(e) =>
                    setPasteTargetCol(
                      e.target.value as
                        | "lecture"
                        | "supplementary"
                        | "questions"
                    )
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="lecture">Nội dung bài học (Cột 1)</option>
                  <option value="supplementary">
                    Nội dung bổ sung quan trọng (Cột 2)
                  </option>
                  <option value="questions">
                    Câu hỏi để củng cố kiến thức (Cột 3)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Văn bản hoặc công thức cần lưu:
                </label>
                <textarea
                  rows={5}
                  required
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  placeholder="Dán đoạn tóm tắt bài học, từ vựng hoặc công thức cần ghi nhớ vào đây..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
                >
                  Lưu vào sổ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: TẠO BUỔI HỌC MỚI ── */}
      {showNewSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Tạo chủ đề / Buổi học mới
              </h3>
              <button
                type="button"
                onClick={() => setShowNewSessionModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên chủ đề bài học:
                </label>
                <input
                  type="text"
                  required
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  placeholder="Ví dụ: Thì quá khứ hoàn thành & Bài tập"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Môn học / Khóa học:
                </label>
                <select
                  value={newSessionSubject}
                  onChange={(e) => setNewSessionSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="IELTS">IELTS</option>
                  <option value="Tiếng Anh THPT">Tiếng Anh THPT</option>
                  <option value="Toán học 12">Toán học 12</option>
                  <option value="Ngữ văn 12">Ngữ văn 12</option>
                  <option value="Vật lý 12">Vật lý 12</option>
                  <option value="Hóa học 12">Hóa học 12</option>
                  <option value="Ghi chú chung">Ghi chú chung</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewSessionModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
                >
                  Tạo buổi học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* ── ALWAYS-ON-TOP PIP FLOATING WINDOW PORTAL ── */}
      {pipWindow &&
        pipWindow.document &&
        createPortal(
          <QuickNotesPiPContent
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={setActiveSessionId}
            onAddCard={(colKey, content, sticker, stickerColor) => {
              const newCard: NoteCard = {
                id: "card-" + Date.now(),
                content,
                sticker,
                stickerColor,
                createdAt: new Date().toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              };
              setSessions((prev) =>
                prev.map((sess) => {
                  if (sess.id !== activeSessionId) return sess;
                  return {
                    ...sess,
                    columns: {
                      ...sess.columns,
                      [colKey]: [...sess.columns[colKey], newCard],
                    },
                  };
                })
              );
            }}
            onDeleteCard={(colKey, cardId) => {
              handleDeleteCard(colKey, cardId);
            }}
            onAddSession={(title, subject) => {
              const now = new Date();
              const day = String(now.getDate());
              const month = `TH${now.getMonth() + 1}`;
              const fullDate = `${day} THÁNG ${now.getMonth() + 1}, ${now.getFullYear()}`;
              const newSession: StudySession = {
                id: "sess-" + Date.now(),
                title,
                subject,
                dateDay: day,
                dateMonth: month,
                fullDate,
                columns: { lecture: [], supplementary: [], questions: [] },
              };
              setSessions((prev) => [newSession, ...prev]);
              setActiveSessionId(newSession.id);
            }}
            onClose={() => {
              pipWindow.close();
              setPipWindow(null);
            }}
          />,
          pipWindow.document.body
        )}
    </div>
  );
}
