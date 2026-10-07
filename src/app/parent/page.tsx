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
import ParentLinkChildTab from "@/components/parent/tabs/ParentLinkChildTab";
import ParentSettingsTab from "@/components/parent/tabs/ParentSettingsTab";
import { createBrowserClient } from "@/lib/supabase";

interface LinkedChild {
  id: string;
  fullName: string;
  studentCode: string;
  grade: string;
  avatarUrl: string | null;
  schoolName: string;
}

const MOCK_CHILDREN: LinkedChild[] = [
  {
    id: "child-1",
    fullName: "Nguyễn Minh Khang",
    studentCode: "EDM-784920",
    grade: "Lớp 12A1",
    avatarUrl: null,
    schoolName: "THPT Chuyên Hà Nội - Amsterdam",
  },
  {
    id: "child-2",
    fullName: "Nguyễn Hà My",
    studentCode: "EDM-632190",
    grade: "Lớp 9B",
    avatarUrl: null,
    schoolName: "THCS Chu Văn An",
  },
];

export default function ParentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ParentTabId>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [parentName, setParentName] = useState("Nguyễn Văn Tuấn");
  const [parentEmail, setParentEmail] = useState("tuan.nguyen@gmail.com");
  const [linkedChildren, setLinkedChildren] = useState<LinkedChild[]>(MOCK_CHILDREN);
  const [activeChildId, setActiveChildId] = useState<string>("child-1");
  const [isLoading, setIsLoading] = useState(true);

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

  const activeChild =
    linkedChildren.find((c) => c.id === activeChildId) || linkedChildren[0];

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
          />
        );
      case "progress":
        return <ParentProgressTab childName={activeChild?.fullName} />;
      case "activity":
        return <ParentActivityTab childName={activeChild?.fullName} />;
      case "goals":
        return <ParentGoalsTab childName={activeChild?.fullName} />;
      case "notifications":
        return (
          <ParentNotificationsTab
            onNavigateTab={(tab) => setActiveTab(tab as ParentTabId)}
          />
        );
      case "link-child":
        return <ParentLinkChildTab />;
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
