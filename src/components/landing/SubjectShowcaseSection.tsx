"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BookOpen, FileText, GraduationCap, X } from "lucide-react";

const subjectCards = [
  { label: "Toán học", left: 48, top: 7 },
  { label: "Vật lý", left: 392, top: 7 },
  { label: "Hóa học", left: 736, top: 7 },
  { label: "Sinh học", left: 1081, top: 7 },
  { label: "Ngữ văn", left: 48, top: 262 },
  { label: "Tiếng Anh", left: 392, top: 262 },
  { label: "Lịch sử", left: 736, top: 262 },
  { label: "Địa lý", left: 1081, top: 262 },
];

const destinationOptions = [
  { label: "Lớp học", href: "/classes", icon: GraduationCap, tone: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { label: "Tài liệu", href: "/materials", icon: BookOpen, tone: "bg-sky-50 text-sky-700 border-sky-100" },
  { label: "Phòng thi", href: "/exam", icon: FileText, tone: "bg-amber-50 text-amber-700 border-amber-100" },
];

export default function SubjectShowcaseSection() {
  const [activeSubject, setActiveSubject] = useState<(typeof subjectCards)[number] | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (sectionRef.current && !sectionRef.current.contains(event.target as Node)) setActiveSubject(null);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveSubject(null);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const menuLeft = activeSubject ? Math.min(activeSubject.left + 32, 1140) : 0;
  const menuTop = activeSubject ? activeSubject.top + 86 : 0;

  return (
    <section className="bg-[#f8faf8] px-4 pb-8 pt-[20px]">
      <div ref={sectionRef} className="relative mx-auto h-[524px] w-[1468px] max-w-full overflow-hidden">
        <Image src="/subject-new.png" alt="Danh sách môn học EduMi" width={1774} height={633} priority className="pointer-events-none h-full w-full select-none object-cover" />

        {subjectCards.map((subject) => {
          const isActive = activeSubject?.label === subject.label;
          return (
            <button
              key={subject.label}
              type="button"
              aria-label={`Chọn hành động cho môn ${subject.label}`}
              onClick={() => setActiveSubject(isActive ? null : subject)}
              className={`absolute z-10 h-[238px] w-[335px] rounded-[16px] outline-none transition focus-visible:ring-4 focus-visible:ring-[#06a66b]/35 ${isActive ? "bg-white/18 ring-4 ring-emerald-500/30" : "hover:bg-white/10"}`}
              style={{ left: subject.left, top: subject.top }}
            >
              <span className="sr-only">{subject.label}</span>
            </button>
          );
        })}

        {activeSubject && (
          <div className="absolute z-20 w-[300px] rounded-[22px] border border-white/80 bg-white p-3 shadow-[0_18px_42px_rgba(15,42,30,0.22)]" style={{ left: menuLeft, top: menuTop }}>
            <div className="mb-3 flex items-start justify-between gap-3 rounded-2xl bg-emerald-50 px-4 py-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wide text-emerald-700">Môn được chọn</p>
                <h3 className="mt-0.5 text-[20px] font-black tracking-[-0.035em] text-[#10213a]">{activeSubject.label}</h3>
              </div>
              <button type="button" onClick={() => setActiveSubject(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:text-slate-900" aria-label="Đóng lựa chọn">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-2">
              {destinationOptions.map((option) => {
                const Icon = option.icon;
                const href = `${option.href}?subject=${encodeURIComponent(activeSubject.label)}`;
                return (
                  <Link key={option.label} href={href} className={`flex h-14 items-center gap-3 rounded-2xl border px-4 text-[15px] font-black transition hover:-translate-y-0.5 hover:shadow-md ${option.tone}`}>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80"><Icon className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1">{option.label}</span>
                    <span className="text-[18px]">→</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
