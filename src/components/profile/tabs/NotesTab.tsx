"use client";

import React, { useState } from "react";
import {
  BookMarked,
  Plus,
  Search,
  Calendar,
  Tag,
  FileText,
  Trash2,
} from "lucide-react";

export default function NotesTab() {
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  const filters = ["Tất cả", "Tiếng Anh", "Toán học", "Ngữ văn", "Vật lý"];

  const initialNotes = [
    {
      id: "1",
      title: "Tổng hợp 50 Idioms thường gặp trong bài thi Speaking Part 2",
      subject: "Tiếng Anh",
      date: "21/09/2026",
      preview:
        "1. A piece of cake: Rất dễ dàng\n2. Break a leg: Chúc may mắn\n3. Under the weather: Cảm thấy không khỏe...",
      tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "2",
      title: "Công thức đạo hàm và ứng dụng khảo sát hàm số",
      subject: "Toán học",
      date: "18/09/2026",
      preview:
        "Quy tắc tính đạo hàm hàm hợp: (u(v(x)))' = u'(v(x)) * v'(x). Chú ý điều kiện xác định của căn thức...",
      tagColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: "3",
      title: "Dàn ý phân tích tác phẩm 'Vợ Nhặt' - Kim Lân",
      subject: "Ngữ văn",
      date: "15/09/2026",
      preview:
        "Mở bài: Giới thiệu Kim Lân - nhà văn của nông thôn. Thân bài: Bối cảnh nạn đói 1945, nhân vật Tràng và Thị...",
      tagColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  const [notes, setNotes] = useState(initialNotes);

  const filteredNotes =
    activeFilter === "Tất cả"
      ? notes
      : notes.filter((n) => n.subject === activeFilter);

  const handleDelete = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80 mb-1">
            HỌC TẬP · SỔ TAY GHI CHÚ
          </p>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Sổ ghi chú & Tài liệu học tập
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lưu lại kiến thức quan trọng, từ vựng và công thức cần nhớ.
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm ghi chú mới</span>
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex-shrink-0 ${
              activeFilter === f
                ? "bg-[#064e3b] text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Notes Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-2xl p-5 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${note.tagColor}`}
                >
                  {note.subject}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3" />
                  {note.date}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                {note.title}
              </h3>

              <p className="text-xs text-slate-500 mt-2.5 line-clamp-3 leading-relaxed whitespace-pre-line font-medium">
                {note.preview}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 group-hover:underline cursor-pointer">
                Xem chi tiết →
              </span>
              <button
                type="button"
                onClick={() => handleDelete(note.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                title="Xóa ghi chú"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
