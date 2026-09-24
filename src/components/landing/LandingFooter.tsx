"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Heart,
} from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs sm:text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-10 h-10 rounded-2xl overflow-hidden border border-emerald-400/40 bg-emerald-950 p-0.5 flex-shrink-0">
                <Image
                  src="/capybara-mascot.png"
                  alt="EduMi Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight">
                  EduMi Platform
                </span>
                <p className="text-[11px] text-emerald-400 font-semibold">
                  Học thông minh cùng Capy
                </p>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Nền tảng giáo dục trực tuyến ứng dụng AI hàng đầu dành cho học sinh Việt Nam. Cung cấp giải pháp luyện đề chuẩn ma trận, phòng thi thử tính giờ và gia sư học tập thông minh 24/7.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Hotline: 1900 8888 (8:00 - 22:00 hàng ngày)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Email hỗ trợ: hotro@edumi.vn</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Khu Công nghệ cao, TP. Thủ Đức, TP. Hồ Chí Minh</span>
              </div>
            </div>
          </div>

          {/* Column 2: Học tập & Luyện thi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Học Tập & Luyện Thi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#exams" className="hover:text-emerald-400 transition-colors">
                  Kho đề thi THPT Quốc Gia
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors">
                  Phòng thi thử trực tuyến
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors">
                  Thẻ Flashcard Spaced Repetition
                </a>
              </li>
              <li>
                <a href="#classes" className="hover:text-emerald-400 transition-colors">
                  Lớp học ảo & Video Record
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors">
                  Sổ tay câu hỏi sai
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Môn học */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Môn Học Trọng Tâm
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#exams" className="hover:text-emerald-400 transition-colors">
                  Toán học 12 (Định dạng mới)
                </a>
              </li>
              <li>
                <a href="#exams" className="hover:text-emerald-400 transition-colors">
                  Tiếng Anh THPT & IELTS
                </a>
              </li>
              <li>
                <a href="#exams" className="hover:text-emerald-400 transition-colors">
                  Ngữ văn 12 & Dàn ý 8.5+
                </a>
              </li>
              <li>
                <a href="#exams" className="hover:text-emerald-400 transition-colors">
                  Vật lý & Hóa học chuyên sâu
                </a>
              </li>
              <li>
                <a href="#exams" className="hover:text-emerald-400 transition-colors">
                  Đánh giá năng lực HSA & V-SAT
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Về EduMi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Thông Tin & Pháp Lý
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#pricing" className="hover:text-emerald-400 transition-colors">
                  Bảng giá & Gói cước
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-emerald-400 transition-colors">
                  Gương mặt Thủ khoa
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors">
                  Đăng nhập tài khoản
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 EduMi Platform. Dự án SWP391. All rights reserved.</p>

          <div className="flex items-center gap-2">
            <span>Thiết kế & phát triển với</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>dành cho học sinh Việt Nam</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
