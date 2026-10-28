"use client";

import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { QuickActionModal } from "../dashboard/QuickActionModal";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickActionModal, setQuickActionModal] = useState<{
    isOpen: boolean;
    tab: "expense" | "task" | "guest";
  }>({ isOpen: false, tab: "expense" });

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex">
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenQuickAction={(tab) => setQuickActionModal({ isOpen: true, tab })}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={quickActionModal.isOpen}
        initialTab={quickActionModal.tab}
        onClose={() => setQuickActionModal({ isOpen: false, tab: "expense" })}
      />
    </div>
  );
}
