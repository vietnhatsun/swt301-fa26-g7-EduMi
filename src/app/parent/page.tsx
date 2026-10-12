"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ParentSidebar, { ParentTabId } from "@/components/parent/ParentSidebar";
import ParentHeader from "@/components/parent/ParentHeader";
import ParentOverviewTab from "@/components/parent/tabs/ParentOverviewTab";
import ParentProgressTab from "@/components/parent/tabs/ParentProgressTab";
import ParentActivityTab from "@/components/parent/tabs/ParentActivityTab";
import ParentGoalsTab from "@/components/parent/tabs/ParentGoalsTab";
import ParentNotificationsTab from "@/components/parent/tabs/ParentNotificationsTab";
import ParentLinkChildTab, { LinkedChild } from "@/components/parent/tabs/ParentLinkChildTab";
import ParentSettingsTab from "@/components/parent/tabs/ParentSettingsTab";
import { createBrowserClient } from "@/lib/supabase";

const LOCAL_STORAGE_CHILDREN_KEY = "edumi_parent_linked_children";

export default function ParentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ParentTabId>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [parentName, setParentName] = useState("Nguyễn Văn Tuấn");
  const [parentEmail, setParentEmail] = useState("tuan.nguyen@gmail.com");
  
  // Mặc định: Phụ huynh mới đăng nhập sẽ CHƯA liên kết học sinh nào
  const [linkedChildren, setLinkedChildren] = useState<LinkedChild[]>([]);
  const [activeChildId, setActiveChildId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Khôi phục danh sách học sinh đã liên kết từ localStorage nếu có
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CHILDREN_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLinkedChildren(parsed);
          setActiveChildId(parsed[0].id);
        }
      }
    } catch (e) {
      console.warn("[Parent Linked Children Note]: Cannot parse local children", e);
    }
  }, []);

  // Check auth or load profile
  useEffect(() => {
    let isMounted = true;

    async function verifyAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data?.user && isMounted) {
            setParentName(data.user.fullName || "Phụ huynh EduMi");
            setParentEmail(data.user.email || "parent@edumi.vn");
          }
        }
      } catch (err) {
        console.warn("[Parent Auth Note]: Using default parent context", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    verifyAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  // Thêm học sinh khi liên kết thành công
  const handleLinkChild = (newChild: LinkedChild) => {
    setLinkedChildren((prev) => {
      const exists = prev.some((c) => c.studentCode === newChild.studentCode);
      const updated = exists
        ? prev.map((c) => (c.studentCode === newChild.studentCode ? newChild : c))
        : [...prev, newChild];
      try {
        localStorage.setItem(LOCAL_STORAGE_CHILDREN_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setActiveChildId(newChild.id);
  };

  // Hủy liên kết học sinh
  const handleUnlinkChild = (childId: string) => {
    setLinkedChildren((prev) => {
      const updated = prev.filter((c) => c.id !== childId);
      try {
        localStorage.setItem(LOCAL_STORAGE_CHILDREN_KEY, JSON.stringify(updated));
      } catch (e) {}
      if (activeChildId === childId) {
        setActiveChildId(updated.length > 0 ? updated[0].id : "");
      }
      return updated;
    });
  };

  // Thử nghiệm liên kết nhanh bằng mã
  const handleQuickLink = (code: string) => {
    if (code === "EDM-784920") {
      handleLinkChild({
        id: "child-1",
        fullName: "Nguyễn Minh Khang",
        studentCode: "EDM-784920",
        grade: "Lớp 12A1",
        avatarUrl: null,
        schoolName: "THPT Chuyên Hà Nội - Amsterdam",
        relationship: "Bố",
        linkedAt: new Date().toLocaleDateString("vi-VN"),
      });
    } else if (code === "EDM-632190") {
      handleLinkChild({
        id: "child-2",
        fullName: "Nguyễn Hà My",
        studentCode: "EDM-632190",
        grade: "Lớp 9B",
        avatarUrl: null,
        schoolName: "THCS Chu Văn An",
        relationship: "Bố",
        linkedAt: new Date().toLocaleDateString("vi-VN"),
      });
    } else {
      handleLinkChild({
        id: `child-${Date.now()}`,
        fullName: `Học sinh (${code})`,
        studentCode: code,
        grade: "Lớp 11A",
        avatarUrl: null,
        schoolName: "Trường THPT EduMi",
        relationship: "Bố",
        linkedAt: new Date().toLocaleDateString("vi-VN"),
      });
    }
  };

  const activeChild =
    linkedChildren.find((c) => c.id === activeChildId) ||
    (linkedChildren.length > 0 ? linkedChildren[0] : null);

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
      window.location.href = "/login";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f8faf8]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-emerald-800 tracking-wider uppercase animate-pulse">
            Đang tải cổng phụ huynh EduMi...
          </p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <ParentOverviewTab
            childName={activeChild?.fullName}
            childGrade={activeChild?.grade}
            childSchool={activeChild?.schoolName}
            onNavigateTab={(tab) => setActiveTab(tab as ParentTabId)}
            onQuickLink={handleQuickLink}
          />
        );
      case "progress":
        return (
          <ParentProgressTab
            childName={activeChild?.fullName}
            onNavigateTab={(tab) => setActiveTab(tab as ParentTabId)}
            onQuickLink={handleQuickLink}
          />
        );
      case "activity":
        return (
          <ParentActivityTab
            childName={activeChild?.fullName}
            onNavigateTab={(tab) => setActiveTab(tab as ParentTabId)}
            onQuickLink={handleQuickLink}
          />
        );
      case "goals":
        return (
          <ParentGoalsTab
            childName={activeChild?.fullName}
            onNavigateTab={(tab) => setActiveTab(tab as ParentTabId)}
            onQuickLink={handleQuickLink}
          />
        );
      case "notifications":
        return (
          <ParentNotificationsTab
            onNavigateTab={(tab) => setActiveTab(tab as ParentTabId)}
          />
        );
      case "link-child":
        return (
          <ParentLinkChildTab
            linkedChildren={linkedChildren}
            onLinkChild={handleLinkChild}
            onUnlinkChild={handleUnlinkChild}
            onNavigateTab={(tab) => setActiveTab(tab as ParentTabId)}
          />
        );
      case "settings":
        return (
          <ParentSettingsTab
            parentName={parentName}
            parentEmail={parentEmail}
          />
        );
      default:
        return (
          <ParentOverviewTab
            childName={activeChild?.fullName}
            childGrade={activeChild?.grade}
            childSchool={activeChild?.schoolName}
            onNavigateTab={(tab) => setActiveTab(tab as ParentTabId)}
            onQuickLink={handleQuickLink}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8faf8] overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <div className="hidden lg:flex h-full flex-shrink-0">
        <ParentSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          parentName={parentName}
          linkedChildren={linkedChildren}
          activeChildId={activeChildId}
          onChildChange={setActiveChildId}
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
            <ParentSidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setIsMobileSidebarOpen(false);
              }}
              isCollapsed={false}
              onToggleCollapse={() => setIsMobileSidebarOpen(false)}
              parentName={parentName}
              linkedChildren={linkedChildren}
              activeChildId={activeChildId}
              onChildChange={(id) => {
                setActiveChildId(id);
                setIsMobileSidebarOpen(false);
              }}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <ParentHeader
          fullName={parentName}
          activeChildName={activeChild?.fullName}
          onTabChange={setActiveTab}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onLogout={handleLogout}
        />

        {/* Scrollable Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderTabContent()}</div>
        </main>
      </div>
    </div>
  );
}
