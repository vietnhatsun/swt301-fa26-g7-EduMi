"use client";

import React, { useState, useRef, useEffect, Suspense, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  CheckCircle2,
  RotateCcw,
  ArrowLeft,
  KeyRound,
  AlertCircle,
  X,
} from "lucide-react";

import CapybaraMascot from "@/components/common/CapybaraMascot";
import { createBrowserClient } from "@/lib/supabase";

type AuthMode = "login" | "register";
type RoleType = "student" | "teacher" | "parent";
type StepType = "form" | "verify";

interface AuthContainerProps {
  initialMode: AuthMode;
}

interface ToastState {
  type: "error" | "success" | "warning";
  title?: string;
  message: string;
}

function AuthToastListener({
  onToast,
  onPrefillEmail,
}: {
  onToast: (type: "error" | "success" | "warning", message: string, title?: string) => void;
  onPrefillEmail: (email: string) => void;
}) {
  const searchParams = useSearchParams();
  const isVerified = searchParams.get("verified") === "true";
  const errorParam = searchParams.get("error");
  const emailParam = searchParams.get("email");

  useEffect(() => {
    if (emailParam) {
      onPrefillEmail(emailParam);
    }

    if (isVerified) {
      onToast(
        "success",
        "Tài khoản của bạn đã được xác thực thành công! Vui lòng đăng nhập.",
        "Xác thực thành công 🎉"
      );
    } else if (errorParam === "account_exists_with_password") {
      onToast(
        "warning",
        emailParam
          ? `Email ${emailParam} đã được đăng ký bằng mật khẩu. Hệ thống không cho phép dùng chung với Google. Vui lòng nhập mật khẩu bên dưới.`
          : "Email này đã được đăng ký bằng mật khẩu. Vui lòng nhập mật khẩu để đăng nhập.",
        "Tài khoản đã có mật khẩu ⚠️"
      );
    } else if (errorParam === "oauth_failed") {
      onToast(
        "error",
        "Đăng nhập với Google không thành công hoặc đã bị hủy. Vui lòng thử lại.",
        "Đăng nhập thất bại"
      );
    }
  }, [searchParams, isVerified, errorParam, emailParam, onToast, onPrefillEmail]);

  return null;
}

export default function AuthContainer({ initialMode }: AuthContainerProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [step, setStep] = useState<StepType>("form");
  const [hasSwitched, setHasSwitched] = useState(false);

  // Form states
  const [role, setRole] = useState<RoleType>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // OTP states
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);

  // ── FLOATING TOAST NOTIFICATION STATE (Cố định góc dưới bên phải) ──
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((type: "error" | "success" | "warning", message: string, title?: string) => {
    setToast({ type, message, title });
  }, []);

  const handlePrefillEmail = useCallback((prefilledEmail: string) => {
    setEmail(prefilledEmail);
    setMode("login");
  }, []);

  // Tự động ẩn toast sau 6 giây
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Smooth Card Height Animation — two-phase imperative approach:
  // Phase 1 (sync, before mode changes): snapshot current height as start
  // Phase 2 (after render): measure rendered target height and begin transition
  const cardRef = useRef<HTMLDivElement>(null);
  const contentInnerRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);
  const animFrameRef = useRef<number | null>(null);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      // Phase 1: lock start height
      if (cardRef.current) {
        setCardHeight(cardRef.current.offsetHeight);
      }
      setHasSwitched(true);
      if (currentPath.includes("register")) {
        setMode("register");
      } else {
        setMode("login");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Phase 2: after each mode/step change, once React has rendered the new content,
  // measure the real unclipped offsetHeight of the inner wrapper + 2px borders, and animate toward it.
  useEffect(() => {
    if (!hasSwitched) return;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    animFrameRef.current = requestAnimationFrame(() => {
      animFrameRef.current = requestAnimationFrame(() => {
        if (contentInnerRef.current) {
          // contentInnerRef.offsetHeight is the unclipped content height
          // + 2px accounts for cardRef's top and bottom borders (box-sizing: border-box)
          const targetH = contentInnerRef.current.offsetHeight + 2;
          setCardHeight(targetH);
        }
      });
    });

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mode, step, hasSwitched]);

  // Countdown timer cho nút gửi lại OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "verify" && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, resendCooldown]);

  // Focus ô OTP đầu tiên khi chuyển sang bước verify
  useEffect(() => {
    if (step === "verify") {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  // Chuyển đổi mượt giữa Đăng nhập và Đăng ký (mở rộng / thu gọn form)
  const handleModeSwitch = (newMode: AuthMode) => {
    if (newMode === mode) return;

    // Phase 1: lock the CURRENT height synchronously before any state changes
    if (cardRef.current) {
      const currentH = cardRef.current.offsetHeight;
      cardRef.current.style.height = `${currentH}px`;
      setCardHeight(currentH);
    }

    setHasSwitched(true);
    setToast(null);
    setStep("form");
    setMode(newMode);

    // Cập nhật URL trên thanh địa chỉ mà không reload trang
    const newPath = newMode === "register" ? "/register" : "/login";
    window.history.pushState(null, "", newPath);
  };

  // Đăng nhập / Đăng ký với Google
  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setToast(null);
      const supabase = createBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
        },
      });

      if (error) {
        showToast("error", "Không thể kết nối với dịch vụ đăng nhập Google: " + error.message, "Đăng nhập Google thất bại");
        setIsGoogleLoading(false);
      }
    } catch (err: unknown) {
      console.error("[Google Auth Error]:", err);
      showToast("error", "Đã xảy ra lỗi khi đăng nhập với Google.", "Lỗi hệ thống");
      setIsGoogleLoading(false);
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (mode === "login") {
      // ── XỬ LÝ ĐĂNG NHẬP ──
      if (!email.trim() || !password) {
        showToast("warning", "Vui lòng nhập đầy đủ Email và Mật khẩu.", "Thiếu thông tin");
        return;
      }

      setIsLoading(true);

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.needVerification) {
            showToast("warning", data.error, "Chưa xác thực tài khoản");
            setEmail(data.email || email);
          } else {
            showToast("error", data.error || "Đăng nhập thất bại. Vui lòng thử lại.", "Đăng nhập không thành công");
          }
          setIsLoading(false);
          return;
        }

        const redirectUrl = data.redirectUrl || "/profile";
        const roleLabel = data.roleLabel || "hồ sơ";

        // Đăng nhập thành công -> chuyển hướng theo vai trò tài khoản
        showToast("success", `Đăng nhập thành công! Đang chuyển hướng vào cổng ${roleLabel}...`, "Đăng nhập thành công 🎉");
        setTimeout(() => {
          router.push(redirectUrl);
        }, 600);
      } catch (err: unknown) {
        console.error("[Login Client Error]:", err);
        showToast("error", "Lỗi kết nối máy chủ. Vui lòng kiểm tra lại mạng.", "Mất kết nối");
        setIsLoading(false);
      }
    } else {
      // ── XỬ LÝ ĐĂNG KÝ ──
      if (!fullName.trim() || !email.trim() || !password) {
        showToast("warning", "Vui lòng điền đầy đủ tất cả các trường thông tin.", "Thiếu thông tin");
        return;
      }

      if (password.length < 8) {
        showToast("warning", "Mật khẩu phải có tối thiểu 8 ký tự.", "Mật khẩu quá ngắn");
        return;
      }

      setIsLoading(true);

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            password,
            role,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          showToast("error", data.error || "Đăng ký thất bại. Vui lòng thử lại.", "Đăng ký không thành công");
          setIsLoading(false);
          return;
        }

        // Đăng ký thành công -> Chuyển sang bước OTP inline
        setIsLoading(false);
        setStep("verify");
        setResendCooldown(60);
        setCanResend(false);
        showToast("success", "Mã xác thực OTP đã được gửi đến hộp thư của bạn.", "Mã OTP đã gửi ✉️");
      } catch (err: unknown) {
        console.error("[Register Client Error]:", err);
        showToast("error", "Lỗi kết nối máy chủ. Vui lòng kiểm tra lại mạng.", "Mất kết nối");
        setIsLoading(false);
      }
    }
  };

  // Xử lý nhập OTP 6 số
  const handleOtpChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, "");
    if (!cleanVal && value !== "") return;

    const newDigits = [...otpDigits];

    if (cleanVal.length > 1) {
      const pastedDigits = cleanVal.slice(0, 6).split("");
      pastedDigits.forEach((digit, i) => {
        if (index + i < 6) {
          newDigits[index + i] = digit;
        }
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(index + pastedDigits.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    pastedData.split("").forEach((char, idx) => {
      newDigits[idx] = char;
    });
    setOtpDigits(newDigits);

    const targetIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[targetIndex]?.focus();
  };

  // Xử lý gửi xác thực OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setToast(null);

    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      showToast("warning", "Vui lòng nhập đủ 6 chữ số mã OTP.", "Chưa đủ 6 số");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: fullOtp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.error || "Mã xác thực không hợp lệ hoặc đã hết hạn.", "Xác thực không thành công");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setIsVerifiedSuccess(true);
      showToast("success", "Xác thực tài khoản thành công! Đang chuyển đến trang đăng nhập...", "Xác thực thành công 🎉");

      setTimeout(() => {
        handleModeSwitch("login");
        router.push("/login?verified=true");
      }, 1500);
    } catch (err: unknown) {
      console.error("[Verify OTP Error]:", err);
      showToast("error", "Lỗi kết nối máy chủ. Vui lòng thử lại.", "Mất kết nối");
      setIsLoading(false);
    }
  };

  // Xử lý gửi lại OTP
  const handleResendOtp = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setToast(null);

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.error || "Không thể gửi lại mã OTP.", "Gửi lại thất bại");
        setIsResending(false);
        return;
      }

      setIsResending(false);
      setResendCooldown(60);
      setCanResend(false);
      setOtpDigits(["", "", "", "", "", ""]);
      showToast("success", "Mã xác thực mới đã được gửi vào hộp thư của bạn.", "Đã gửi lại mã OTP ✉️");
      otpInputRefs.current[0]?.focus();
    } catch (err: unknown) {
      console.error("[Resend OTP Error]:", err);
      showToast("error", "Không thể kết nối máy chủ để gửi lại mã.", "Mất kết nối");
      setIsResending(false);
    }
  };

  return (
    <main className="h-screen max-h-screen w-full bg-[#f8faf8] text-[#0f172a] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-[#10b981]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-[#059669]/8 blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#34d399]/10 blur-[120px] pointer-events-none" />

      {/* Main: 50% Left (Form Card), 50% Right (Full Bleed Cover Image) */}
      <div className="w-full h-full flex flex-col lg:flex-row items-stretch relative z-10">

        {/* ── LEFT COLUMN (50%): Form Card (Neo đáy bằng justify-end để khi mở rộng card sẽ vươn lên trên mượt mà) ── */}
        <div className="w-full lg:w-1/2 h-full flex flex-col justify-end items-center pb-5 sm:pb-8 lg:pb-10 pt-4 px-6 sm:px-12 lg:px-14 xl:px-20 overflow-y-auto lg:overflow-hidden">

          {/* Card Container với Mascot Capybara ngồi ở trên đỉnh card */}
          <div className="w-full max-w-[450px] mx-auto relative pt-16 sm:pt-20">

            {/* Mascot Capybara: Trồi lên khi Đăng nhập, thụt xuống núp sau form khi Đăng ký (đồng bộ 1600ms) */}
            <div
              className={`absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 z-0 transition-all duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${mode === "login"
                ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
                : "translate-y-32 sm:translate-y-40 opacity-0 scale-95 pointer-events-none"
                }`}
            >
              <CapybaraMascot isPasswordFocused={isPasswordFocused && !showPassword} />
            </div>

            {/* Card chính: có hiệu ứng mở rộng lên trên siêu mượt (đồng bộ 1600ms) */}
            <div
              ref={cardRef}
              style={{ height: cardHeight !== undefined ? `${cardHeight}px` : undefined }}
              className="relative z-10 bg-white border border-emerald-100/80 rounded-2xl sm:rounded-[24px] shadow-[0_15px_40px_rgba(16,185,129,0.08),0_4px_12px_rgba(0,0,0,0.03)] overflow-hidden transition-[height] duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            >
              <div ref={contentInnerRef}>
                {/* Top Header Switcher Bar (Forest Green) */}
                <div className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#065f46] px-5 py-3 flex items-center justify-between border-b border-emerald-900/20">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-sm flex-shrink-0 relative bg-white">
                      <Image
                        src="/favicon.jpg"
                        alt="EduMi Logo"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
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

                  {/* Switcher Pill Bar với viên trượt chuyển động chuẩn xác 100% */}
                  <div className="relative grid grid-cols-2 items-center bg-black/40 p-0.5 rounded-full border border-white/15 w-[156px]">
                    {/* Sliding background indicator */}
                    <div
                      className={`absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-white shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${mode === "login"
                        ? "translate-x-0"
                        : "translate-x-[calc(100%+2px)]"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleModeSwitch("login")}
                      className={`relative z-10 font-bold text-[10px] py-1 text-center rounded-full transition-colors duration-200 cursor-pointer select-none ${mode === "login" ? "text-[#064e3b]" : "text-emerald-100 hover:text-white"
                        }`}
                    >
                      ĐĂNG NHẬP
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModeSwitch("register")}
                      className={`relative z-10 font-bold text-[10px] py-1 text-center rounded-full transition-colors duration-200 cursor-pointer select-none ${mode === "register" ? "text-[#064e3b]" : "text-emerald-100 hover:text-white"
                        }`}
                    >
                      ĐĂNG KÝ
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-7">

                  {/* ── BƯỚC XÁC THỰC OTP (NẾU ĐANG Ở STEP VERIFY CỦA ĐĂNG KÝ) ── */}
                  {step === "verify" ? (
                    <div className="text-left animate-fadeIn">
                      <button
                        type="button"
                        onClick={() => {
                          setStep("form");
                          setToast(null);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#059669] hover:text-[#064e3b] mb-3 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Đổi thông tin đăng ký</span>
                      </button>

                      <div className="mb-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-[#059669] flex items-center justify-center mb-2.5 shadow-sm">
                          <KeyRound className="w-5 h-5" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f172a] mb-1">
                          Xác thực mã OTP ✉️
                        </h1>
                        <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
                          Mã xác thực 6 số đã được gửi đến:
                          <br />
                          <span className="font-semibold text-[#047857]">{email}</span>
                        </p>
                      </div>

                      <div className="my-5">
                        <label className="block text-xs font-semibold text-[#334155] mb-2 text-center">
                          Nhập 6 chữ số xác thực
                        </label>
                        <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                          {otpDigits.map((digit, index) => (
                            <input
                              key={index}
                              ref={(el) => {
                                otpInputRefs.current[index] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              onPaste={handleOtpPaste}
                              disabled={isVerifiedSuccess}
                              className={`w-11 h-12 sm:w-12 sm:h-14 text-center font-bold text-lg sm:text-xl rounded-xl border transition-all outline-none ${digit
                                ? "bg-white border-[#10b981] text-[#064e3b] shadow-sm ring-2 ring-[#10b981]/20"
                                : "bg-[#f8fafc] border-slate-200 text-[#0f172a] focus:bg-white focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
                                }`}
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleVerifyOtp()}
                        disabled={isLoading || isVerifiedSuccess || otpDigits.join("").length !== 6}
                        className="w-full py-2.5 sm:py-3 px-5 rounded-xl bg-gradient-to-r from-[#10b981] via-[#059669] to-[#047857] hover:from-[#059669] hover:to-[#065f46] text-white font-bold text-xs sm:text-sm shadow-[0_8px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_10px_25px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : isVerifiedSuccess ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Đã kích hoạt thành công</span>
                          </>
                        ) : (
                          <>
                            <span>Xác thực tài khoản</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Chưa nhận được mã?</span>
                        {canResend ? (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={isResending}
                            className="font-bold text-[#059669] hover:text-[#064e3b] inline-flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            {isResending ? (
                              <span className="animate-pulse">Đang gửi...</span>
                            ) : (
                              <>
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Gửi lại mã OTP</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-slate-400 font-medium">
                            Gửi lại sau <strong className="text-[#059669]">{resendCooldown}s</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* ── FORM CHÍNH: ĐĂNG NHẬP HOẶC ĐĂNG KÝ (EXPANDING SMOOTHLY) ── */
                    <div>
                      {/* Tiêu đề mượt mà */}
                      <div className="mb-3.5 text-left transition-all duration-300">
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0f172a] mb-1">
                          {mode === "login" ? "Chào mừng trở lại! 👋" : "Bắt đầu cùng EduMi 🚀"}
                        </h1>
                        <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
                          {mode === "login" ? (
                            <>
                              Đăng nhập vào <span className="text-[#059669] font-semibold">EduMi</span> để tiếp tục học và luyện đề.
                            </>
                          ) : (
                            <>
                              Đăng ký tài khoản <span className="text-[#059669] font-semibold">EduMi</span> để bắt đầu học tập.
                            </>
                          )}
                        </p>
                      </div>

                      {/* Lắng nghe thông báo URL và kích hoạt Floating Toast */}
                      <Suspense fallback={null}>
                        <AuthToastListener
                          onToast={showToast}
                          onPrefillEmail={handlePrefillEmail}
                        />
                      </Suspense>

                      {/* Google OAuth Button */}
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading || isGoogleLoading}
                        className="w-full flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#10b981]/50 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm hover:shadow group cursor-pointer disabled:opacity-60 mb-3"
                      >
                        {isGoogleLoading ? (
                          <div className="w-4 h-4 border-2 border-slate-400 border-t-[#10b981] rounded-full animate-spin" />
                        ) : (
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
                        )}
                        <span>
                          {isGoogleLoading
                            ? "Đang kết nối Google..."
                            : mode === "login"
                              ? "Tiếp tục với Google"
                              : "Đăng ký nhanh với Google"}
                        </span>
                      </button>

                      {/* Cụm nội dung (Divider + Form + Button + Security) */}
                      <div>
                        {/* Divider */}
                        <div className="relative my-3 text-center">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                          </div>
                          <div className="relative flex justify-center">
                            <span
                              key={hasSwitched ? mode : "initial"}
                              className={`bg-white px-3 text-[10px] text-[#94a3b8] uppercase tracking-wider font-semibold ${hasSwitched ? "animate-fade-slide-rtl" : ""
                                }`}
                            >
                              {mode === "login" ? "Hoặc bằng Email" : "Hoặc tạo bằng Email"}
                            </span>
                          </div>
                        </div>

                        {/* Form Fields */}
                        <form onSubmit={handleSubmit} className="space-y-3">
                          {/* Cả cụm trường thông tin: Role tabs, Họ và tên (khi ở Đăng ký), Email, Mật khẩu
                            Fade cùng 1 lúc từ phải sang trái khi chuyển đổi form */}
                          <div
                            key={hasSwitched ? `fields-cluster-${mode}` : "fields-cluster-initial"}
                            className={`space-y-3 ${hasSwitched ? "animate-fade-slide-rtl" : ""}`}
                          >
                            {/* KHU VỰC ĐĂNG KÝ (Role selector + Họ và tên) - Cụm ảnh 2 */}
                            {mode === "register" && (
                              <div className="space-y-3">
                                {/* Role Selection Tabs */}
                                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl">
                                  <button
                                    type="button"
                                    onClick={() => setRole("student")}
                                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${role === "student"
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
                                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${role === "teacher"
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
                                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${role === "parent"
                                      ? "bg-[#059669] text-white shadow-sm"
                                      : "text-slate-600 hover:text-slate-900"
                                      }`}
                                  >
                                    <Users className="w-3.5 h-3.5" />
                                    <span>Phụ huynh</span>
                                  </button>
                                </div>

                                {/* Họ và tên Field */}
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
                                      required={mode === "register"}
                                      className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border border-slate-200 focus:bg-white focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 rounded-xl text-xs sm:text-sm text-[#0f172a] placeholder-[#94a3b8] transition-all outline-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Email Field (Dùng chung cho cả 2) */}
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
                                  className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border border-slate-200 focus:bg-white focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 rounded-xl text-xs sm:text-sm text-[#0f172a] placeholder-[#94a3b8] transition-all outline-none"
                                />
                              </div>
                            </div>

                            {/* Password Field (Dùng chung cho cả 2) */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-semibold text-[#334155]">
                                  Mật khẩu
                                </label>
                                {mode === "login" && (
                                  <Link
                                    href="/forgot-password"
                                    className="text-[11px] text-[#059669] hover:text-[#047857] hover:underline font-semibold transition-colors"
                                  >
                                    Quên mật khẩu?
                                  </Link>
                                )}
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
                                  className="w-full pl-9 pr-10 py-2 bg-[#f8fafc] border border-slate-200 focus:bg-white focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 rounded-xl text-xs sm:text-sm text-[#0f172a] placeholder-[#94a3b8] transition-all outline-none"
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
                          </div>

                          {/* Submit Button (Chuyển đổi text mượt mà) */}
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 py-2.5 sm:py-3 px-5 rounded-xl bg-gradient-to-r from-[#10b981] via-[#059669] to-[#047857] hover:from-[#059669] hover:to-[#065f46] text-white font-bold text-xs sm:text-sm shadow-[0_8px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_10px_25px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <span
                                key={hasSwitched ? mode : "initial"}
                                className={`${hasSwitched ? "animate-fade-slide-rtl" : ""
                                  } inline-flex items-center gap-2`}
                              >
                                <span>{mode === "login" ? "Đăng nhập" : "Đăng ký ngay"}</span>
                                <ArrowRight className="w-4 h-4" />
                              </span>
                            )}
                          </button>

                          {/* Security text */}
                          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium select-none">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>Thông tin được bảo mật tuyệt đối</span>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
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

      {/* ── FLOATING TOAST NOTIFICATION (GÓC DƯỚI BÊN PHẢI MÀN HÌNH) ── */}
      {toast && (
        <div
          role="alert"
          aria-live="assertive"
          className={`fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md w-[calc(100vw-3rem)] p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.18),0_4px_12px_rgba(0,0,0,0.08)] border backdrop-blur-xl bg-white/95 flex items-start gap-3.5 transition-all duration-300 animate-slide-up-fade ${toast.type === "error"
            ? "border-red-200/90"
            : toast.type === "success"
              ? "border-emerald-200/90"
              : "border-amber-200/90"
            }`}
        >
          {/* Icon Badge */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs ${toast.type === "error"
              ? "bg-red-50 text-red-600 border border-red-100"
              : toast.type === "success"
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-amber-50 text-amber-600 border border-amber-100"
              }`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="w-5 h-5" />
            ) : toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-1 text-left">
            {toast.title && (
              <h4 className="font-bold text-xs sm:text-sm tracking-tight mb-0.5 text-slate-900">
                {toast.title}
              </h4>
            )}
            <p className="text-xs text-slate-600 font-medium leading-relaxed break-words">
              {toast.message}
            </p>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => setToast(null)}
            className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0 cursor-pointer"
            title="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </main>
  );
}
