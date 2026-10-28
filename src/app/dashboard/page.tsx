"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useEventContext } from "@/lib/store/event-context";
import { formatINR, formatDate, daysUntil } from "@/lib/utils";
import {
  Wallet,
  CalendarCheck2,
  Users2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingDown,
  AlertCircle,
  Plus,
  CheckCircle2,
  Circle,
  Store,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";

const CHART_COLORS = [
  "#4C234F", // deep plum
  "#FF8066", // coral
  "#8E4A92", // medium plum
  "#ED5C3D", // deep coral
  "#BDA5DC", // soft lavender
  "#222126", // near-black
  "#E5A93C", // amber gold
  "#998E7D", // warm gray
  "#5D2962", // dark plum
];

export default function DashboardOverviewPage() {
  const {
    activeEvent,
    user,
    totalBudget,
    totalEstimatedSpending,
    totalActualSpending,
    remainingBudget,
    budgets,
    tasks,
    toggleTaskStatus,
    completedTasksCount,
    pendingTasksCount,
    confirmedGuestsCount,
    confirmedAttendingCount,
    currentAIPlan,
    eventVendors,
  } = useEventContext();

  const countdown = daysUntil(activeEvent.event_date);

  // Calculate task percentage
  const totalTasks = tasks.length;
  const taskProgressPct = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  // Prepare chart data from active budgets or expenses
  const budgetChartData =
    budgets.length > 0
      ? budgets.map((b) => ({
          name: b.category.charAt(0).toUpperCase() + b.category.slice(1),
          value: Number(b.allocated_amount) || 0,
        }))
      : [
          { name: "Catering", value: 12000 },
          { name: "Venue", value: 8000 },
          { name: "Decoration", value: 4000 },
          { name: "Entertainment", value: 3000 },
          { name: "Photography", value: 2000 },
        ];

  // Top 4 upcoming pending tasks
  const pendingTasksList = tasks
    .filter((t) => t.status !== "completed")
    .slice(0, 4);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Greeting & Active Celebration Banner */}
        <div className="rounded-3xl border border-[#EAE5DC] bg-white p-6 sm:p-8 shadow-soft relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-lavender-200 text-plum-900 border border-lavender-300 mb-2.5">
                <Sparkles className="h-3.5 w-3.5 text-coral-500" />
                <span>AI-Assisted Event Plan Active</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-plum-950">
                Welcome, {user?.full_name?.split(" ")[0] || "Planner"}!
              </h2>
              <p className="text-sm text-[#756B5B] mt-1">
                You're planning <span className="font-semibold text-plum-900">{activeEvent.title}</span> in {activeEvent.city}.
              </p>
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center gap-4 bg-[#FAF8F4] p-4 rounded-2xl border border-[#ECE7DE]">
              <div className="h-12 w-12 rounded-xl bg-plum-800 text-white flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6 text-coral-400" />
              </div>
              <div>
                <div className="text-xs text-[#756B5B] font-medium">Event Countdown</div>
                <div className="text-2xl font-serif font-bold text-plum-950">
                  {countdown.isPast ? (
                    <span className="text-xs font-bold text-coral-600">Celebration Past</span>
                  ) : (
                    <>
                      <span>{countdown.days}</span>{" "}
                      <span className="text-xs font-sans font-semibold text-[#756B5B]">Days Left</span>
                    </>
                  )}
                </div>
                <div className="text-[11px] text-[#756B5B]">
                  {formatDate(activeEvent.event_date)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Financial & Progress KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Budget */}
          <div className="rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#756B5B]">Total Budget</span>
              <div className="h-8 w-8 rounded-lg bg-lavender-100 flex items-center justify-center text-plum-800">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div className="font-serif text-2xl font-bold text-plum-950 mt-3">
              {formatINR(totalBudget)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="text-[#756B5B]">Planned:</span>
              <span className="font-bold text-plum-800">
                {formatINR(totalActualSpending)} committed
              </span>
            </div>
          </div>

          {/* Remaining Budget */}
          <div className="rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#756B5B]">Remaining Budget</span>
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  remainingBudget >= 0
                    ? "bg-green-100 text-green-700"
                    : "bg-coral-100 text-coral-700"
                }`}
              >
                <TrendingDown className="h-4 w-4" />
              </div>
            </div>
            <div
              className={`font-serif text-2xl font-bold mt-3 ${
                remainingBudget >= 0 ? "text-green-700" : "text-coral-600"
              }`}
            >
              {formatINR(remainingBudget)}
            </div>
            <div className="text-xs text-[#756B5B] mt-2">
              {remainingBudget >= 0 ? (
                <span className="text-green-700 font-medium">✓ Safe within limits</span>
              ) : (
                <span className="text-coral-600 font-semibold">⚠ Budget exceeded</span>
              )}
            </div>
          </div>

          {/* Task Progress */}
          <div className="rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#756B5B]">Preparation Progress</span>
              <div className="h-8 w-8 rounded-lg bg-lavender-100 flex items-center justify-center text-plum-800">
                <CalendarCheck2 className="h-4 w-4" />
              </div>
            </div>
            <div className="font-serif text-2xl font-bold text-plum-950 mt-3">
              {taskProgressPct}%
            </div>
            <div className="w-full bg-[#ECE7DE] h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-coral-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${taskProgressPct}%` }}
              />
            </div>
            <div className="text-[11px] text-[#756B5B] mt-1.5">
              {completedTasksCount} done of {totalTasks} milestones
            </div>
          </div>

          {/* Confirmed Guests */}
          <div className="rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#756B5B]">Confirmed Attendance</span>
              <div className="h-8 w-8 rounded-lg bg-lavender-100 flex items-center justify-center text-plum-800">
                <Users2 className="h-4 w-4" />
              </div>
            </div>
            <div className="font-serif text-2xl font-bold text-plum-950 mt-3">
              {confirmedAttendingCount} Guests
            </div>
            <div className="text-xs text-[#756B5B] mt-2">
              <span>{confirmedGuestsCount} RSVPs + plus-ones</span>
            </div>
          </div>
        </div>

        {/* Charts & Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Budget Allocation Chart (2 Cols) */}
          <div className="lg:col-span-2 rounded-3xl border border-[#EAE5DC] bg-white p-6 sm:p-8 shadow-soft flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-4 mb-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-plum-950">
                  Budget Allocation by Category
                </h3>
                <p className="text-xs text-[#756B5B]">
                  AI distribution calibrated for {activeEvent.category} in {activeEvent.city}
                </p>
              </div>
              <Link
                href="/dashboard/budget"
                className="text-xs font-bold text-plum-800 hover:text-coral-600 inline-flex items-center gap-1"
              >
                <span>Full Manager</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
              {/* Donut Chart */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {budgetChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(val: number) => [formatINR(val), "Allocated"]}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #DED7CA",
                        backgroundColor: "#FFFFFF",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {budgetChartData.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-warmgray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      />
                      <span className="font-medium text-[#222126]">{item.name}</span>
                    </div>
                    <span className="font-bold text-plum-900">
                      {formatINR(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Tasks & Urgent Milestones (1 Col) */}
          <div className="rounded-3xl border border-[#EAE5DC] bg-white p-6 sm:p-8 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-4 mb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-plum-950">
                    Next Milestones
                  </h3>
                  <p className="text-xs text-[#756B5B]">
                    {pendingTasksCount} pending items
                  </p>
                </div>
                <Link
                  href="/dashboard/timeline"
                  className="text-xs font-bold text-plum-800 hover:text-coral-600"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {pendingTasksList.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-[#ECE7DE] hover:border-plum-800 transition-all group"
                  >
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="mt-0.5 text-[#998E7D] group-hover:text-coral-500 transition-colors shrink-0"
                    >
                      <Circle className="h-4 w-4" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#222126] group-hover:text-plum-900 transition-colors truncate">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            task.priority === "urgent"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "high"
                              ? "bg-coral-100 text-coral-700"
                              : "bg-lavender-100 text-plum-800"
                          }`}
                        >
                          {task.priority}
                        </span>
                        {task.due_date && (
                          <span className="text-[10px] text-[#756B5B]">
                            Due: {formatDate(task.due_date)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {pendingTasksList.length === 0 && (
                  <div className="text-center py-8 text-xs text-[#756B5B]">
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    All scheduled milestones are complete!
                  </div>
                )}
              </div>
            </div>

            <Link
              href="/dashboard/timeline"
              className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#DED7CA] hover:bg-[#FAF8F4] text-xs font-bold text-plum-900 transition-colors"
            >
              <span>Open Task Checklist</span>
              <ArrowRight className="h-3.5 w-3.5 text-coral-600" />
            </Link>
          </div>
        </div>

        {/* AI Event Planning Workspace Snippet */}
        <div className="rounded-3xl border border-plum-200 bg-gradient-to-r from-plum-900 to-plum-950 p-6 sm:p-8 text-white shadow-soft">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-coral-500/20 text-coral-300 border border-coral-500/30">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Celebration Co-Pilot</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold">
                Theme: {currentAIPlan?.recommendedTheme || activeEvent.theme}
              </h3>
              <p className="text-xs sm:text-sm text-lavender-200 leading-relaxed">
                {currentAIPlan?.overview ||
                  "Your personalized plan is active. Adjust budget allocations, generate live food menus, or rebalance timelines in the AI Workspace."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/dashboard/ai-workspace"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-plum-950 bg-coral-500 hover:bg-coral-400 shadow-hover transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Open AI Workspace</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
