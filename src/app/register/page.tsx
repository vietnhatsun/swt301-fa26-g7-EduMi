"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Users,
} from "lucide-react";

import CapybaraMascot from "@/components/common/CapybaraMascot";

type RoleType = "student" | "teacher" | "parent";

export default function RegisterPage() {
  const [role, setRole] = useState<RoleType>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName || !email || !password) {
      setErrorMessage("Vui lòng điền đầy đủ tất cả các trường thông tin.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Mật khẩu phải có tối thiểu 8 ký tự.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Đăng ký thành công tài khoản [${role.toUpperCase()}]: ${email}`);
    }, 1200);
  };

  return (
    <main className="h-screen max-h-screen w-full bg-[#f8faf8] text-[#0f172a] relative overflow-hidden flex items-center">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-[#10b981]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-[#059669]/8 blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#34d399]/10 blur-[120px] pointer-events-none" />

      {/* Main: 50% Left (Register Form), 50% Right (Full Bleed Cover Image) */}
      <div className="w-full h-full flex flex-col lg:flex-row items-stretch relative z-10">
        
        {/* ── LEFT COLUMN (50%): Register Form (Đồng nhất 100% với Login) ── */}
        <div className="w-full lg:w-1/2 h-full flex flex-col justify-end items-center pb-5 sm:pb-8 lg:pb-10 pt-4 px-6 sm:px-12 lg:px-14 xl:px-20 overflow-y-auto lg:overflow-hidden">
          
          {/* Center: Register Card with Peeking Capybara Mascot */}
          <div className="w-full max-w-[450px] mx-auto relative pt-16 sm:pt-20">
            {/* Capybara Mascot peeking over the top of the card */}
            <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 z-0">
              <CapybaraMascot isPasswordFocused={isPasswordFocused && !showPassword} />
            </div>

            <div className="relative z-10 bg-white/95 backdrop-blur-xl border border-emerald-100/80 rounded-2xl sm:rounded-[24px] shadow-[0_15px_40px_rgba(16,185,129,0.08),0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden">
              
              {/* Top Header Switcher Bar (Forest Green đồng nhất với Login) */}
              <div className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#065f46] px-5 py-3 flex items-center justify-between border-b border-emerald-900/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center shadow-sm flex-shrink-0">
                    EDM
                  </div>
                  <div>
                    <h2 className="text-white text-xs sm:text-sm font-bold tracking-tight leading-tight">
                      EduMi Platform
                    </h2>
                    <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-200/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Trực tuyến
                    </span>
                  </div>
                </div>

                {/* Switcher: ĐĂNG NHẬP / ĐĂNG KÝ */}
                <div className="flex items-center gap-0.5 bg-black/30 p-0.5 rounded-full border border-white/15 backdrop-blur-sm">
                  <Link
                    href="/login"
                    className="text-emerald-100 hover:text-white font-medium text-[10px] px-2.5 py-0.5 rounded-full transition-colors"
                  >
                    ĐĂNG NHẬP
                  </Link>
                  <span className="bg-white text-[#064e3b] font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm cursor-default">
                    ĐĂNG KÝ
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-7">
                {/* Title & Subtitle */}
                <div className="mb-3.5 text-left">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f172a] mb-1">
                    Bắt đầu cùng EduMi 🚀
                  </h1>
                  <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
                    Đăng ký tài khoản <span className="text-[#059669] font-semibold">EduMi</span> để bắt đầu học tập.
                  </p>
                </div>

                {/* Role Selection Tabs */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl mb-3.5">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === "student"
                        ? "bg-[#059669] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Học sinh</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("teacher")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === "teacher"
                        ? "bg-[#059669] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Giáo viên</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("parent")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      role === "parent"
                        ? "bg-[#059669] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Phụ huynh</span>
                  </button>
                </div>

                {/* Error Alert */}
                {errorMessage && (
                  <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1 text-left">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94a3b8]">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        required
                        className="w-full pl-9 pr-3 py-2.5 bg-[#f8fafc] border border-slate-200 focus:bg-white focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 rounded-xl text-xs sm:text-sm text-[#0f172a] placeholder-[#94a3b8] transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1 text-left">
                      Địa chỉ Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94a3b8]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@edumi.vn"
                        required
                        className="w-full pl-9 pr-3 py-2.5 bg-[#f8fafc] border border-slate-200 focus:bg-white focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 rounded-xl text-xs sm:text-sm text-[#0f172a] placeholder-[#94a3b8] transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1 text-left">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94a3b8]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-9 pr-10 py-2.5 bg-[#f8fafc] border border-slate-200 focus:bg-white focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 rounded-xl text-xs sm:text-sm text-[#0f172a] placeholder-[#94a3b8] transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94a3b8] hover:text-[#475569] cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-1 py-2.5 sm:py-3 px-5 rounded-xl bg-gradient-to-r from-[#10b981] via-[#059669] to-[#047857] hover:from-[#059669] hover:to-[#065f46] text-white font-bold text-xs sm:text-sm shadow-[0_8px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_10px_25px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Đăng ký ngay</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Security text under button */}
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium select-none">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Thông tin được bảo mật tuyệt đối</span>
                  </div>
                </form>

              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN (50%): Cover Image Full Bleed (Tràn viền 100%) ── */}
        <div className="hidden lg:block lg:w-1/2 h-full relative overflow-hidden bg-[#f8faf8]">
          <Image
            src="/background-image-login-page.png"
            alt="EduMi Learning Cover"
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
        </div>

      </div>
    </main>
  );
}
