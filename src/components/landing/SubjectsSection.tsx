"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  Layers,
  GraduationCap,
} from "lucide-react";

export default function SubjectsSection() {
  const [activeTab, setActiveTab] = useState<"all" | "khtn" | "khxh" | "dgnl">("all");

  const subjects = [
    {
      id: "math",
      group: "khtn",
      name: "Toán Học 12",
      icon: "📐",
      tag: "Định dạng mới 2026",
      tagColor: "bg-blue-100 text-blue-800 border-blue-200",
      testsCount: "150+ Bộ đề thi",
      questionsCount: "4,500 câu trắc nghiệm",
      learners: "12.4k học sinh",
      desc: "Chuyên đề Hàm số, Tích phân, Mũ & Logarit, Hình không gian Oxyz và trắc nghiệm đúng/sai.",
    },
    {
      id: "english",
      group: "khtn",
      name: "Tiếng Anh THPT",
      icon: "🇬🇧",
      tag: "Trọng tâm điểm 9+",
      tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      testsCount: "200+ Bộ đề thi",
      questionsCount: "6,000 câu hỏi",
      learners: "14.2k học sinh",
      desc: "Luyện ngữ pháp 12 thì, bẫy từ vựng đồng nghĩa - trái nghĩa, kỹ năng đọc hiểu Reading Passage.",
    },
    {
      id: "literature",
      group: "khxh",
      name: "Ngữ Văn 12",
      icon: "📖",
      tag: "Dàn ý & Bài mẫu 8.5+",
      tagColor: "bg-amber-100 text-amber-800 border-amber-200",
      testsCount: "85 Chuyên đề",
      questionsCount: "180 Bài văn mẫu",
      learners: "9.8k học sinh",
      desc: "Kỹ năng làm phần Đọc hiểu, bí quyết viết Nghị luận xã hội cuốn hút và phân tích tác phẩm sâu sắc.",
    },
    {
      id: "physics",
      group: "khtn",
      name: "Vật Lý 12",
      icon: "⚡",
      tag: "Ma trận đề mới",
      tagColor: "bg-purple-100 text-purple-800 border-purple-200",
      testsCount: "95+ Bộ đề",
      questionsCount: "3,200 câu hỏi",
      learners: "7.9k học sinh",
      desc: "Dao động cơ học, Sóng cơ, Dòng điện xoay chiều, Sóng ánh sáng và câu hỏi thực hành thí nghiệm.",
    },
    {
      id: "chemistry",
      group: "khtn",
      name: "Hóa Học 12",
      icon: "🧪",
      tag: "Vận dụng cao",
      tagColor: "bg-rose-100 text-rose-800 border-rose-200",
      testsCount: "90+ Bộ đề",
      questionsCount: "2,800 câu hỏi",
      learners: "6.5k học sinh",
      desc: "Este - Lipit, Peptit, Kim loại kiềm, Điện phân và bài tập hóa học thực tiễn đời sống.",
    },
    {
      id: "dgnl",
      group: "dgnl",
      name: "Đánh Giá Năng Lực (ĐGNL)",
      icon: "🎯",
      tag: "HSA & V-SAT 2026",
      tagColor: "bg-teal-100 text-teal-800 border-teal-200",
      testsCount: "60+ Bộ đề chuẩn",
      questionsCount: "3,000 câu hỏi",
      learners: "11.1k học sinh",
      desc: "Đề thi ĐHQG Hà Nội, ĐHQG TP.HCM bám sát cấu trúc Tư duy định lượng, định tính và khoa học.",
    },
    {
      id: "biology",
      group: "khtn",
      name: "Sinh Học 12",
      icon: "🌿",
      tag: "Khối B00 Y Dược",
      tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      testsCount: "75+ Bộ đề",
      questionsCount: "2,400 câu hỏi",
      learners: "5.2k học sinh",
      desc: "Cơ chế di truyền và biến dị, Quy luật di truyền Men-đen, Tiến hóa và Sinh thái học.",
    },
    {
      id: "history",
      group: "khxh",
      name: "Lịch Sử & Địa Lý",
      icon: "🌏",
      tag: "Sơ đồ Mindmap",
      tagColor: "bg-orange-100 text-orange-800 border-orange-200",
      testsCount: "80+ Bộ đề",
      questionsCount: "2,600 câu hỏi",
      learners: "6.1k học sinh",
      desc: "Mốc lịch sử Việt Nam và thế giới bằng Flashcard, phân tích Atlat và bảng số liệu Địa lý.",
    },
  ];

  const filteredSubjects = subjects.filter((s) => {
    if (activeTab === "all") return true;
    return s.group === activeTab;
  });

  return (
    <section id="exams" className="py-20 lg:py-28 bg-[#f8faf8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>CHINH PHỤC MỌI KHỐI THI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Kho đề & Chuyên đề trọng tâm <br />
              <span className="text-emerald-700">chuẩn ma trận mới 2026</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl font-medium">
              Được biên soạn và thẩm định kỹ lưỡng bởi đội ngũ giáo viên giàu kinh nghiệm luyện thi THPT Quốc Gia và Đánh giá năng lực.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-300"
              }`}
            >
              Tất cả môn (8)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("khtn")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "khtn"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-300"
              }`}
            >
              Khoa học tự nhiên
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("khxh")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "khxh"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-300"
              }`}
            >
              Khoa học xã hội
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("dgnl")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "dgnl"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-300"
              }`}
            >
              ĐGNL ĐHQG
            </button>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSubjects.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100/80 shadow-[0_4px_20px_rgba(6,78,59,0.04)] hover:shadow-[0_16px_36px_rgba(6,78,59,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-2xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    {sub.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${sub.tagColor}`}
                  >
                    {sub.tag}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                  {sub.desc}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Số đề thi:</span>
                    <span className="font-bold text-slate-800">{sub.testsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Đang học:</span>
                    <span className="font-bold text-emerald-700">{sub.learners}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link
                  href="/register"
                  className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-600 hover:text-white text-emerald-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 group-hover:bg-emerald-600 group-hover:text-white shadow-xs"
                >
                  <span>Luyện thi ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
