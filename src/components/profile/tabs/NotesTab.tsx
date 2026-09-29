"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Camera,
  ClipboardPaste,
  Sparkles,
  Trash2,
  Upload,
  Clock,
  BookOpen,
  Pin,
  ChevronDown,
  ChevronUp,
  Check,
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
  const [isSessionDropdownOpen, setIsSessionDropdownOpen] = useState(false);
  const sessionDropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown chọn chủ đề khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sessionDropdownRef.current &&
        !sessionDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSessionDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <div className="space-y-4">
      {/* ── THANH CÔNG CỤ & DROPDOWN CHỦ ĐỀ Ở TRÊN CÙNG ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          {/* Trái: Chụp ghi chú mới, Dán kiến thức, Ghim & Thêm mới chủ đề */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
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

            {/* Nút 3: Ghim (Always-on-top PiP) */}
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
              <span>{pipWindow ? "Đang ghim (Đóng)" : "Ghim"}</span>
            </button>

            {/* Nút 4: Thêm mới chủ đề */}
            <button
              type="button"
              onClick={() => setShowNewSessionModal(true)}
              className="py-1.5 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:shadow"
              title="Thêm mới chủ đề"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-700" />
              <span>Thêm mới chủ đề</span>
            </button>
          </div>

          {/* Phải: DROPDOWN CHỌN CHỦ ĐỀ (Thay thế nút thu gọn & danh sách thẻ cuộn ngang) */}
          <div className="relative self-end sm:self-center" ref={sessionDropdownRef}>
            <button
              type="button"
              onClick={() => setIsSessionDropdownOpen(!isSessionDropdownOpen)}
              className="inline-flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl border border-emerald-300/90 bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-950 font-bold text-xs transition-all cursor-pointer shadow-2xs hover:shadow w-full sm:w-auto min-w-[200px] max-w-[340px]"
              title="Nhấn để chọn chủ đề bài học khác"
            >
              <div className="flex items-center gap-2 truncate">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate font-black text-slate-900">
                  {currentSession?.title || "Chọn chủ đề..."}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-emerald-700 shrink-0 transition-transform duration-200 ${
                  isSessionDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Menu Dropdown danh sách chủ đề */}
            {isSessionDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-72 sm:w-84 rounded-2xl bg-white border border-slate-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.12)] p-2 z-40 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Danh sách chủ đề ({sessions.length})
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1 pr-0.5 scrollbar-thin">
                  {sessions.map((sess) => {
                    const isSelected = sess.id === activeSessionId;
                    const cardCount =
                      sess.columns.lecture.length +
                      sess.columns.supplementary.length +
                      sess.columns.questions.length;

                    return (
                      <button
                        key={sess.id}
                        type="button"
                        onClick={() => {
                          setActiveSessionId(sess.id);
                          setIsSessionDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-emerald-50 text-emerald-950 border border-emerald-200/90 font-bold"
                            : "hover:bg-slate-50 text-slate-800 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {/* Khối ngày nhỏ */}
                          <div
                            className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center shrink-0 text-center leading-none ${
                              isSelected
                                ? "bg-emerald-600 text-white shadow-2xs"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <span className="text-[11px] font-black">{sess.dateDay}</span>
                            <span className="text-[7px] font-bold uppercase">{sess.dateMonth}</span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold truncate">
                              {sess.title}
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span className="font-semibold text-emerald-700">
                                {cardCount} thẻ
                              </span>
                              <span>·</span>
                              <span className="truncate">{sess.subject}</span>
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 3 CỘT CORNELL NOTES BOARD (Trải rộng toàn màn hình) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 items-start">
        {/* ══════ CỘT 1: NỘI DUNG BÀI HỌC (Xanh nước biển) ══════ */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#eff6ff] via-[#e0f2fe]/70 to-[#f0f9ff] rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-blue-200/80 shadow-[0_4px_24px_rgba(37,99,235,0.06)] flex flex-col min-h-[460px]">
          {/* Hoa văn nền sóng lượn xanh nước biển (phong cách ảnh 2) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none text-blue-500/10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 360 600"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M-20,90 Q90,40 180,95 T380,80 L380,-10 L-20,-10 Z"
              fill="currentColor"
              opacity="0.5"
            />
            <path
              d="M-20,180 Q100,120 200,190 T380,150"
              stroke="currentColor"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <path
              d="M-20,320 Q80,250 190,330 T380,280"
              stroke="currentColor"
              strokeWidth="36"
              strokeLinecap="round"
            />
            <path
              d="M-20,460 Q110,390 220,470 T380,420"
              stroke="currentColor"
              strokeWidth="32"
              strokeLinecap="round"
            />
            <path
              d="M-20,570 Q90,510 200,580 T380,530"
              stroke="currentColor"
              strokeWidth="40"
              strokeLinecap="round"
            />
          </svg>

          {/* Column Header */}
          <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-blue-200/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs ring-2 ring-blue-400/20" />
              <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                Nội dung bài học
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-blue-800 border border-blue-200 shadow-2xs">
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
            className="relative z-10 mt-3.5 w-full py-2 px-3 rounded-xl border border-dashed border-blue-300 hover:border-blue-500 bg-white/70 hover:bg-white text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm thẻ</span>
          </button>

          {/* Cards List */}
          <div className="relative z-10 mt-3.5 space-y-3 flex-1 overflow-y-auto pr-0.5">
            {currentSession.columns.lecture.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-blue-200 rounded-2xl my-auto bg-white/60 backdrop-blur-2xs">
                Chưa có thẻ nào trong mục này. Bấm{" "}
                <span className="font-bold text-blue-600">+ Thêm thẻ</span> để
                bắt đầu ghi chú!
              </div>
            ) : (
              currentSession.columns.lecture.map((card) => (
                <div
                  key={card.id}
                  className="bg-white/95 backdrop-blur-xs rounded-2xl p-4 border border-blue-100/90 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all group relative"
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

        {/* ══════ CỘT 2: NỘI DUNG BỔ SUNG QUAN TRỌNG (Đỏ) ══════ */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#fff1f2] via-[#ffe4e6]/70 to-[#fff5f5] rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-rose-200/80 shadow-[0_4px_24px_rgba(225,29,72,0.06)] flex flex-col min-h-[460px]">
          {/* Hoa văn nền đường vệt & sóng đỏ (phong cách ảnh 2) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none text-rose-500/10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 360 600"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M-20,110 Q120,50 220,120 T380,90"
              stroke="currentColor"
              strokeWidth="32"
              strokeLinecap="round"
            />
            <rect x="40" y="180" width="16" height="55" rx="8" transform="rotate(-35 40 180)" fill="currentColor" opacity="0.85" />
            <rect x="170" y="160" width="18" height="65" rx="9" transform="rotate(-35 170 160)" fill="currentColor" opacity="0.7" />
            <rect x="280" y="210" width="16" height="50" rx="8" transform="rotate(-35 280 210)" fill="currentColor" opacity="0.8" />
            <rect x="90" y="310" width="18" height="60" rx="9" transform="rotate(-35 90 310)" fill="currentColor" opacity="0.6" />
            <rect x="220" y="330" width="18" height="70" rx="9" transform="rotate(-35 220 330)" fill="currentColor" opacity="0.75" />
            <rect x="50" y="450" width="16" height="55" rx="8" transform="rotate(-35 50 450)" fill="currentColor" opacity="0.6" />
            <rect x="190" y="460" width="18" height="65" rx="9" transform="rotate(-35 190 460)" fill="currentColor" opacity="0.7" />
            <path
              d="M-20,550 Q140,490 250,560 T380,520"
              stroke="currentColor"
              strokeWidth="36"
              strokeLinecap="round"
            />
          </svg>

          {/* Column Header */}
          <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-rose-200/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs ring-2 ring-rose-400/20" />
              <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                Nội dung bổ sung quan trọng
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-rose-800 border border-rose-200 shadow-2xs">
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
            className="relative z-10 mt-3.5 w-full py-2 px-3 rounded-xl border border-dashed border-rose-300 hover:border-rose-500 bg-white/70 hover:bg-white text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm thẻ</span>
          </button>

          {/* Cards List */}
          <div className="relative z-10 mt-3.5 space-y-3 flex-1 overflow-y-auto pr-0.5">
            {currentSession.columns.supplementary.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-rose-200 rounded-2xl my-auto bg-white/60 backdrop-blur-2xs">
                Ghi lại các lưu ý, mẹo giải đề hoặc cạm bẫy hay gặp tại đây.
              </div>
            ) : (
              currentSession.columns.supplementary.map((card) => (
                <div
                  key={card.id}
                  className="bg-white/95 backdrop-blur-xs rounded-2xl p-4 border border-rose-100/90 hover:border-rose-300 shadow-2xs hover:shadow-md transition-all group relative"
                >
                  {card.sticker && (
                    <div className="mb-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          card.stickerColor ||
                          "bg-rose-50 text-rose-800 border-rose-200"
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

        {/* ══════ CỘT 3: CÂU HỎI ĐỂ CỦNG CỐ KIẾN THỨC (Xanh lá cây) ══════ */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#f0fdf4] via-[#dcfce7]/70 to-[#f6fef9] rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-emerald-200/80 shadow-[0_4px_24px_rgba(5,150,105,0.06)] flex flex-col min-h-[460px]">
          {/* Hoa văn nền sóng lượn xanh lá cây (phong cách ảnh 2) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none text-emerald-600/10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 360 600"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M-20,80 C80,30 200,140 380,70"
              stroke="currentColor"
              strokeWidth="30"
              strokeLinecap="round"
            />
            <path
              d="M-20,220 C90,160 210,270 380,200"
              stroke="currentColor"
              strokeWidth="34"
              strokeLinecap="round"
            />
            <path
              d="M-20,360 C100,300 220,410 380,340"
              stroke="currentColor"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <path
              d="M-20,490 C110,430 230,540 380,480"
              stroke="currentColor"
              strokeWidth="36"
              strokeLinecap="round"
            />
            <circle cx="280" cy="140" r="45" fill="currentColor" opacity="0.4" />
            <circle cx="70" cy="420" r="55" fill="currentColor" opacity="0.35" />
          </svg>

          {/* Column Header */}
          <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-emerald-200/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs ring-2 ring-emerald-400/20" />
              <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                Câu hỏi để củng cố kiến thức
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-emerald-800 border border-emerald-200 shadow-2xs">
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
            className="relative z-10 mt-3.5 w-full py-2 px-3 rounded-xl border border-dashed border-emerald-300 hover:border-emerald-500 bg-white/70 hover:bg-white text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm thẻ</span>
          </button>

          {/* Cards List */}
          <div className="relative z-10 mt-3.5 space-y-3 flex-1 overflow-y-auto pr-0.5">
            {currentSession.columns.questions.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-emerald-200 rounded-2xl my-auto bg-white/60 backdrop-blur-2xs">
                Tạo câu hỏi gợi nhớ (Active Recall) để ôn tập bài giảng đạt hiệu
                quả cao nhất!
              </div>
            ) : (
              currentSession.columns.questions.map((card) => (
                <div
                  key={card.id}
                  className="bg-white/95 backdrop-blur-xs rounded-2xl p-4 border border-emerald-100/90 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all group relative"
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

      {/* ── MODAL: TẠO CHỦ ĐỀ MỚI ── */}
      {showNewSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Tạo chủ đề mới
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
                  Tên chủ đề:
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
                  Tạo chủ đề
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
