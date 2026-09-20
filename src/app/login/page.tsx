"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import CapybaraMascot from "@/components/common/CapybaraMascot";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }

    setIsLoading(true);
    // Tạm thời mô phỏng xử lý đăng nhập client-side
    setTimeout(() => {
      setIsLoading(false);
      alert(`Đăng nhập thành công với tài khoản: ${email}`);
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Đang chuyển hướng tới cổng đăng nhập Google OAuth...");
    }, 600);
  };

  return (
    <main className="h-screen max-h-screen w-full bg-[#f8faf8] text-[#0f172a] relative overflow-hidden flex items-center">
      {/* Background ambient lighting with soft natural green & warm white tones */}
      <div className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-[#10b981]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-[#059669]/8 blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#34d399]/10 blur-[120px] pointer-events-none" />

      {/* Main: 50% Left (Logo & Form), 50% Right (Full Bleed Cover Image) */}
      <div className="w-full h-full flex flex-col lg:flex-row items-stretch relative z-10">
        
        {/* ── LEFT COLUMN (50%): Login Form (Phong cách Trắng & Xanh lá) ── */}
        <div className="w-full lg:w-1/2 h-full flex flex-col justify-end items-center pb-5 sm:pb-8 lg:pb-10 pt-4 px-6 sm:px-12 lg:px-14 xl:px-20 overflow-y-auto lg:overflow-hidden">
          
          {/* Center: Login Card with Peeking Capybara Mascot */}
          <div className="w-full max-w-[450px] mx-auto relative pt-16 sm:pt-20">
            {/* Capybara Mascot peeking over the top of the card */}
            <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 z-0">
              <CapybaraMascot isPasswordFocused={isPasswordFocused && !showPassword} />
            </div>

            <div className="relative z-10 bg-white/95 backdrop-blur-xl border border-emerald-100/80 rounded-2xl sm:rounded-[24px] shadow-[0_15px_40px_rgba(16,185,129,0.08),0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden">
              
              {/* Top Header Switcher Bar (Forest Green đồng điệu ảnh bìa tự nhiên) */}
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
                  <span className="bg-white text-[#064e3b] font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-sm cursor-default">
                    ĐĂNG NHẬP
                  </span>
                  <Link
                    href="/register"
                    className="text-emerald-100 hover:text-white font-medium text-[10px] px-2.5 py-0.5 rounded-full transition-colors"
                  >
                    ĐĂNG KÝ
                  </Link>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-7">
                {/* Title & Subtitle */}
                <div className="mb-4 text-left">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f172a] mb-1">
                    Chào mừng trở lại! 👋
                  </h1>
                <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
                  Đăng nhập vào <span className="text-[#059669] font-semibold">EduMi</span> để tiếp tục học và luyện đề.
                </p>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#10b981]/50 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm hover:shadow group cursor-pointer disabled:opacity-60"
              >
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Tiếp tục với Google</span>
              </button>

              {/* Divider */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-[11px] text-[#94a3b8] uppercase tracking-wider font-semibold">
                    Hoặc bằng Email
                  </span>
                </div>
              </div>

              {/* Error Message if any */}
              {errorMessage && (
                <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 animate-fade-in-up">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Email Field */}
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#334155]">
                      Mật khẩu
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] text-[#059669] hover:text-[#047857] hover:underline font-semibold transition-colors"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
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
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94a3b8] hover:text-[#475569] transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button (Green Gradient) */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-1 py-2.5 sm:py-3 px-5 rounded-xl bg-gradient-to-r from-[#10b981] via-[#059669] to-[#047857] hover:from-[#059669] hover:to-[#065f46] text-white font-bold text-xs sm:text-sm shadow-[0_8px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_10px_25px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Đăng nhập</span>
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
