"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileSidebar, { ProfileTabId } from "@/components/profile/ProfileSidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import OverviewTab from "@/components/profile/tabs/OverviewTab";
import PersonalInfoTab from "@/components/profile/tabs/PersonalInfoTab";
import NotesTab from "@/components/profile/tabs/NotesTab";
import ClassesTab from "@/components/profile/tabs/ClassesTab";
import MaterialsTab from "@/components/profile/tabs/MaterialsTab";
import HistoryTab from "@/components/profile/tabs/HistoryTab";
import TransactionsTab from "@/components/profile/tabs/TransactionsTab";
import TeacherProfileDashboard from "@/components/profile/teacher/TeacherProfileDashboard";
import { createBrowserClient } from "@/lib/supabase";

interface ProfileSession {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl: string | null;
  studentCode: string;
  streakCount: number;
  longestStreak: number;
  totalPoints: number;
  schoolName?: string;
  gradeLevel?: string;
  phoneNumber?: string;
  teacherCode?: string;
  headline?: string;
  subjects?: string[];
  ratingAvg?: number;
  totalReviews?: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ProfileTabId>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra phiên đăng nhập và tải thông tin học sinh
  useEffect(() => {
    let isMounted = true;

    async function verifyAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          // Chưa đăng nhập -> chuyển hướng về trang đăng nhập
          router.replace("/login");
          return;
        }

        const data = await res.json();
        if (data?.user) {
          if (isMounted) {
            setProfileData(data.user);
            setIsLoading(false);
          }
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.error("[Auth Verify Error]:", err);
        router.replace("/login");
      }
    }

    verifyAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  // Xử lý đăng xuất tài khoản
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      try {
        const supabase = createBrowserClient();
        await supabase.auth.signOut();
      } catch (sbErr) {
        console.warn("[Supabase SignOut Error]:", sbErr);
      }
    } catch (err) {
      console.error("[Logout Error]:", err);
    } finally {
      router.push("/login");
    }
  };

  // Màn hình chờ khi đang xác thực phiên đăng nhập
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f8faf8]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-emerald-800 tracking-wider uppercase animate-pulse">
            Đang tải hồ sơ người dùng...
          </p>
        </div>
      </div>
    );
  }

  // Dữ liệu an toàn hiển thị
  const currentProfile = profileData || {
    id: "",
    fullName: "Học sinh EduMi",
    email: "student@edumi.vn",
    studentCode: "EDM-784920",
    role: "student",
    avatarUrl: null,
    streakCount: 0,
    longestStreak: 0,
    totalPoints: 0,
  };

  if (currentProfile.role === "teacher") {
    return <TeacherProfileDashboard teacher={currentProfile} onLogout={handleLogout} />;
  }

  const currentStudent = currentProfile;

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            fullName={currentStudent.fullName}
            streakCount={currentStudent.streakCount}
            studentCode={currentStudent.studentCode}
          />
        );
      case "classes":
        return <ClassesTab />;
      case "personal":
        return (
          <PersonalInfoTab
            initialFullName={currentStudent.fullName}
            initialEmail={currentStudent.email}
            studentCode={currentStudent.studentCode}
          />
        );
      case "notes":
        return <NotesTab fullName={currentStudent.fullName} />;
      case "materials":
        return <MaterialsTab />;
      case "flashcards":
        return (
          <div className="bg-white rounded-3xl p-8 border border-emerald-100 text-center py-16">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Thẻ ghi nhớ Flashcard thông minh ✨
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Tính năng lặp lại ngắt quãng (Spaced Repetition) với Flashcard AI sẽ sớm có mặt trên EduMi.
            </p>
          </div>
        );
      case "history":
        return <HistoryTab />;
      case "transactions":
        return <TransactionsTab />;
      case "settings":
        return (
          <div className="bg-white rounded-3xl p-8 border border-emerald-100 text-center py-16">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Cài đặt tài khoản & Thông báo ⚙️
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Tùy chỉnh thông báo qua Email, Zalo và đổi mật khẩu bảo vệ tài khoản.
            </p>
          </div>
        );
      default:
        return (
          <OverviewTab
            fullName={currentStudent.fullName}
            streakCount={currentStudent.streakCount}
            studentCode={currentStudent.studentCode}
            onNavigateTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8faf8] overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <div className="hidden lg:flex h-full flex-shrink-0">
        <ProfileSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          studentCode={currentStudent.studentCode}
          fullName={currentStudent.fullName}
          onLogout={handleLogout}
        />
      </div>

      {/* ── Mobile Sidebar Drawer ── */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 h-full flex">
            <ProfileSidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setIsMobileSidebarOpen(false);
              }}
              isCollapsed={false}
              onToggleCollapse={() => setIsMobileSidebarOpen(false)}
              studentCode={currentStudent.studentCode}
              fullName={currentStudent.fullName}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <ProfileHeader
          fullName={currentStudent.fullName}
          streakCount={currentStudent.streakCount}
          onTabChange={setActiveTab}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onLogout={handleLogout}
        />

        {/* Scrollable Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className={activeTab === "notes" ? "max-w-7xl mx-auto" : "max-w-6xl mx-auto"}>
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

