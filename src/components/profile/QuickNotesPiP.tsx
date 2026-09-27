"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  X,
  Send,
  HelpCircle,
  AlertCircle,
  Pin,
  ExternalLink,
} from "lucide-react";
import { StudySession, NoteCard } from "./tabs/NotesTab";

interface QuickNotesPiPProps {
  sessions: StudySession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onAddCard: (
    colKey: "lecture" | "supplementary" | "questions",
    content: string,
    sticker?: string,
    stickerColor?: string
  ) => void;
  onDeleteCard: (
    colKey: "lecture" | "supplementary" | "questions",
    cardId: string
  ) => void;
  onAddSession?: (title: string, subject: string) => void;
  onClose: () => void;
}

export function QuickNotesPiPContent({
  sessions,
  activeSessionId,
  onSelectSession,
  onAddCard,
  onDeleteCard,
  onAddSession,
  onClose,
}: QuickNotesPiPProps) {
  const [selectedCol, setSelectedCol] = useState<
    "lecture" | "supplementary" | "questions"
  >("lecture");
  const [noteText, setNoteText] = useState("");
  const [selectedSticker, setSelectedSticker] = useState<string>("");
  const [feedFilter, setFeedFilter] = useState<string>("all");
  const [showNewTopicInput, setShowNewTopicInput] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");

  const currentSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const stickers = [
    {
      label: "⭐ Quan trọng",
      color: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      label: "🔥 Đề thi",
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
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!noteText.trim()) return;

    const matchedSticker = stickers.find((s) => s.label === selectedSticker);
    onAddCard(
      selectedCol,
      noteText.trim(),
      selectedSticker || undefined,
      matchedSticker?.color
    );

    setNoteText("");
    setSelectedSticker("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;
    if (onAddSession) {
      onAddSession(newTopicTitle.trim(), "Google Meet");
    }
    setNewTopicTitle("");
    setShowNewTopicInput(false);
  };

  // Combine cards for feed
  const lectureCards = currentSession?.columns.lecture || [];
  const supplementaryCards = currentSession?.columns.supplementary || [];
  const questionCards = currentSession?.columns.questions || [];

  const displayCards: {
    card: NoteCard;
    colKey: "lecture" | "supplementary" | "questions";
    colName: string;
    colColor: string;
  }[] = [
    ...lectureCards.map((c) => ({
      card: c,
      colKey: "lecture" as const,
      colName: "Bài học",
      colColor: "bg-blue-50 text-blue-700 border-blue-200",
    })),
    ...supplementaryCards.map((c) => ({
      card: c,
      colKey: "supplementary" as const,
      colName: "Bổ sung",
      colColor: "bg-purple-50 text-purple-700 border-purple-200",
    })),
    ...questionCards.map((c) => ({
      card: c,
      colKey: "questions" as const,
      colName: "Câu hỏi",
      colColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    })),
  ];

  const filteredCards =
    feedFilter === "all"
      ? displayCards
      : displayCards.filter((c) => c.colKey === feedFilter);

  return (
    <div className="flex flex-col h-screen bg-[#f8faf8] text-slate-800 font-sans select-none overflow-hidden">
      {/* ── TOP BAR (Always On Top) ── */}
      <div className="bg-[#064e3b] text-white p-3 flex items-center justify-between shadow-md flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-wide truncate">
                Sổ ghi chú EduMi
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            </div>
            <p className="text-[10px] text-emerald-200/90 truncate">
              Ghim nổi trên Google Meet
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 text-emerald-200 hover:text-white hover:bg-emerald-700/50 rounded-lg transition-colors cursor-pointer"
          title="Đóng cửa sổ nổi"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── TOPIC PICKER BAR ── */}
      <div className="bg-white px-3 py-2 border-b border-emerald-100 flex items-center justify-between gap-2 flex-shrink-0 shadow-2xs">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
            Chủ đề:
          </span>
          <select
            value={activeSessionId}
            onChange={(e) => onSelectSession(e.target.value)}
            className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 truncate focus:outline-none focus:border-emerald-500"
          >
            {sessions.map((sess) => (
              <option key={sess.id} value={sess.id}>
                {sess.title} ({sess.dateDay} {sess.dateMonth})
              </option>
            ))}
          </select>
        </div>

        {onAddSession && (
          <button
            type="button"
            onClick={() => setShowNewTopicInput(!showNewTopicInput)}
            className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer"
            title="Thêm chủ đề mới"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Inline Create Topic Form if toggled */}
      {showNewTopicInput && (
        <form
          onSubmit={handleCreateTopic}
          className="p-2 bg-emerald-50/70 border-b border-emerald-200 flex items-center gap-1.5 flex-shrink-0"
        >
          <input
            type="text"
            required
            autoFocus
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
            placeholder="Tên chủ đề mới (VD: Unit 5 IELTS)..."
            className="flex-1 px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs cursor-pointer"
          >
            Tạo
          </button>
        </form>
      )}

      {/* ── QUICK NOTE INPUT FORM (Chuyên dùng để note nhanh khi nghe giảng) ── */}
      <div className="p-3 bg-white border-b border-slate-200 flex-shrink-0 space-y-2">
        {/* Column selector */}
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCol("lecture")}
            className={`py-1 px-1.5 text-center text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
              selectedCol === "lecture"
                ? "bg-blue-50 text-blue-700 border-blue-300 shadow-2xs font-extrabold"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
            }`}
          >
            🔵 Bài học
          </button>
          <button
            type="button"
            onClick={() => setSelectedCol("supplementary")}
            className={`py-1 px-1.5 text-center text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
              selectedCol === "supplementary"
                ? "bg-purple-50 text-purple-700 border-purple-300 shadow-2xs font-extrabold"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
            }`}
          >
            🟣 Bổ sung
          </button>
          <button
            type="button"
            onClick={() => setSelectedCol("questions")}
            className={`py-1 px-1.5 text-center text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
              selectedCol === "questions"
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs font-extrabold"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
            }`}
          >
            🟢 Câu hỏi
          </button>
        </div>

        {/* Input Textarea */}
        <div className="relative">
          <textarea
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Gõ từ vựng, công thức nghe được từ Meet... (Ctrl + Enter để lưu)"
            className="w-full p-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white leading-relaxed resize-none transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Stickers & Quick Submit */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
            {stickers.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() =>
                  setSelectedSticker(
                    selectedSticker === s.label ? "" : s.label
                  )
                }
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                  selectedSticker === s.label
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!noteText.trim()}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold text-xs flex items-center gap-1 shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex-shrink-0"
          >
            <Send className="w-3 h-3" />
            <span>Lưu</span>
          </button>
        </div>
      </div>

      {/* ── CARDS FEED (Xem lại thẻ đã ghi) ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {/* Filter header */}
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pb-1">
          <span>Ghi chú trong buổi ({displayCards.length})</span>
          <div className="flex items-center gap-1 text-[10px]">
            <button
              type="button"
              onClick={() => setFeedFilter("all")}
              className={`px-1.5 py-0.5 rounded ${
                feedFilter === "all"
                  ? "bg-slate-200 text-slate-900 font-black"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setFeedFilter("lecture")}
              className={`px-1.5 py-0.5 rounded ${
                feedFilter === "lecture"
                  ? "bg-blue-100 text-blue-800 font-black"
                  : "text-slate-400 hover:text-blue-700"
              }`}
            >
              🔵
            </button>
            <button
              type="button"
              onClick={() => setFeedFilter("supplementary")}
              className={`px-1.5 py-0.5 rounded ${
                feedFilter === "supplementary"
                  ? "bg-purple-100 text-purple-800 font-black"
                  : "text-slate-400 hover:text-purple-700"
              }`}
            >
              🟣
            </button>
            <button
              type="button"
              onClick={() => setFeedFilter("questions")}
              className={`px-1.5 py-0.5 rounded ${
                feedFilter === "questions"
                  ? "bg-emerald-100 text-emerald-800 font-black"
                  : "text-slate-400 hover:text-emerald-700"
              }`}
            >
              🟢
            </button>
          </div>
        </div>

        {filteredCards.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl my-4">
            Chưa có ghi chú nào. Hãy nhập nội dung ở trên và nhấn Lưu!
          </div>
        ) : (
          filteredCards.map(({ card, colKey, colName, colColor }) => (
            <div
              key={card.id}
              className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all group relative"
            >
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border ${colColor}`}
                  >
                    {colName}
                  </span>
                  {card.sticker && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
                        card.stickerColor ||
                        "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {card.sticker}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{card.createdAt}</span>
                  <button
                    type="button"
                    onClick={() => onDeleteCard(colKey, card.id)}
                    className="p-1 hover:text-red-600 text-slate-300 rounded hover:bg-red-50 transition-colors ml-1 cursor-pointer"
                    title="Xóa"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                {card.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* ── FOOTER HELPER ── */}
      <div className="p-2 bg-emerald-50/70 border-t border-emerald-100 text-[10px] text-emerald-800 text-center font-medium flex items-center justify-center gap-1 flex-shrink-0">
        <Pin className="w-3 h-3 text-emerald-600" />
        <span>Kéo cửa sổ này đặt cạnh hoặc phủ góc trên Google Meet để note!</span>
      </div>
    </div>
  );
}

// ── UTILITY: Document Picture-in-Picture & Popup Window Opener ──
export async function openPiPWindowHelper(
  width = 390,
  height = 620
): Promise<Window | null> {
  if (typeof window === "undefined") return null;

  // 1. Try Document Picture-in-Picture API (Chrome/Edge 116+)
  if ("documentPictureInPicture" in window) {
    try {
      const pip = await (window as any).documentPictureInPicture.requestWindow({
        width,
        height,
      });

      // Copy stylesheets
      copyStyles(pip);

      pip.document.body.style.margin = "0";
      pip.document.body.style.backgroundColor = "#f8faf8";
      pip.document.title = "EduMi · Sổ ghi chú nổi (Ghim trên Google Meet)";

      return pip;
    } catch (err) {
      console.warn("Document PiP request failed, falling back to popup window:", err);
    }
  }

  // 2. Fallback: Compact Popup Window pinned to the right edge
  const left = Math.max(0, window.screen.availWidth - width - 20);
  const top = 60;
  const popup = window.open(
    "",
    "EduMiQuickNotes",
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );

  if (popup) {
    copyStyles(popup);
    popup.document.body.style.margin = "0";
    popup.document.body.style.backgroundColor = "#f8faf8";
    popup.document.title = "EduMi · Sổ ghi chú nổi (Ghim trên Google Meet)";
    return popup;
  }

  return null;
}

function copyStyles(targetWin: Window) {
  [...document.styleSheets].forEach((styleSheet) => {
    try {
      const cssRules = [...styleSheet.cssRules]
        .map((rule) => rule.cssText)
        .join("");
      const style = targetWin.document.createElement("style");
      style.textContent = cssRules;
      targetWin.document.head.appendChild(style);
    } catch (e) {
      if (styleSheet.href) {
        const link = targetWin.document.createElement("link");
        link.rel = "stylesheet";
        if (styleSheet.type) link.type = styleSheet.type;
        if (styleSheet.media.mediaText) link.media = styleSheet.media.mediaText;
        link.href = styleSheet.href;
        targetWin.document.head.appendChild(link);
      }
    }
  });
}
