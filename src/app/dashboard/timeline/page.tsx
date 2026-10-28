"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useEventContext } from "@/lib/store/event-context";
import { formatDate, daysUntil } from "@/lib/utils";
import { TaskItem } from "@/lib/types";
import {
  CalendarCheck2,
  Plus,
  Trash2,
  Edit2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Filter,
  Sparkles,
  ArrowUpDown,
  X,
  ListTodo,
} from "lucide-react";

export default function TimelineTasksPage() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    activeEvent,
    currentAIPlan,
  } = useEventContext();

  const [activeTab, setActiveTab] = useState<"checklist" | "event_day">("checklist");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed" | "overdue">("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // Form states
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskCategory, setTaskCategory] = useState("General");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskDueTime, setTaskDueTime] = useState("");
  const [taskIsEventDay, setTaskIsEventDay] = useState(false);

  const openAddModal = (isEventDay: boolean = false) => {
    setEditingTask(null);
    setTaskTitle("");
    setTaskDesc("");
    setTaskCategory(isEventDay ? "Schedule" : "General");
    setTaskPriority("medium");
    setTaskDueDate(isEventDay ? activeEvent.event_date : "");
    setTaskDueTime(isEventDay ? "18:00" : "");
    setTaskIsEventDay(isEventDay);
    setTaskModalOpen(true);
  };

  const openEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDesc(task.description || "");
    setTaskCategory(task.category);
    setTaskPriority(task.priority);
    setTaskDueDate(task.due_date || "");
    setTaskDueTime(task.due_time || "");
    setTaskIsEventDay(task.is_event_day);
    setTaskModalOpen(true);
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        title: taskTitle,
        description: taskDesc,
        category: taskCategory,
        priority: taskPriority,
        due_date: taskDueDate || undefined,
        due_time: taskDueTime || undefined,
        is_event_day: taskIsEventDay,
      });
    } else {
      addTask({
        title: taskTitle,
        description: taskDesc,
        category: taskCategory,
        priority: taskPriority,
        status: "pending",
        due_date: taskDueDate || undefined,
        due_time: taskDueTime || undefined,
        is_event_day: taskIsEventDay,
        order_index: tasks.length + 1,
      });
    }
    setTaskModalOpen(false);
  };

  // Filter tasks
  const checklistTasks = tasks.filter((t) => !t.is_event_day);
  const eventDayTasks = tasks.filter((t) => t.is_event_day);

  const filteredChecklist = checklistTasks.filter((task) => {
    const isOverdue =
      task.due_date &&
      task.status !== "completed" &&
      new Date(task.due_date).getTime() < new Date().setHours(0, 0, 0, 0);

    if (statusFilter === "pending" && task.status === "completed") return false;
    if (statusFilter === "completed" && task.status !== "completed") return false;
    if (statusFilter === "overdue" && !isOverdue) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
    return true;
  });

  // Sort chronological for event day
  const sortedEventDayTasks = [...eventDayTasks].sort((a, b) => {
    const timeA = a.due_time || "00:00";
    const timeB = b.due_time || "00:00";
    return timeA.localeCompare(timeB);
  });

  // Detect schedule/deadline conflicts
  const hasConflict = (task: TaskItem) => {
    if (!task.due_date) return false;
    // Conflict if deadline is after the main event date
    return new Date(task.due_date).getTime() > new Date(activeEvent.event_date).getTime();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-plum-950">
              Timeline & Task Manager
            </h1>
            <p className="text-xs text-[#756B5B] mt-0.5">
              Orchestrate preparation checklists and minute-by-minute celebration schedules.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openAddModal(activeTab === "event_day")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft transition-all"
            >
              <Plus className="h-4 w-4 text-coral-400" />
              <span>
                {activeTab === "event_day" ? "Add Timeline Slot" : "Add Task"}
              </span>
            </button>
          </div>
        </div>

        {/* Tab switchers: Checklist vs Event Day Run */}
        <div className="flex border-b border-[#ECE7DE] gap-4">
          <button
            onClick={() => setActiveTab("checklist")}
            className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
              activeTab === "checklist"
                ? "text-plum-950 border-b-2 border-plum-800"
                : "text-[#756B5B] hover:text-plum-900"
            }`}
          >
            <ListTodo className="h-4 w-4 text-coral-500" />
            <span>Preparation Checklist ({checklistTasks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("event_day")}
            className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
              activeTab === "event_day"
                ? "text-plum-950 border-b-2 border-plum-800"
                : "text-[#756B5B] hover:text-plum-900"
            }`}
          >
            <Clock className="h-4 w-4 text-coral-500" />
            <span>Event-Day Itinerary ({eventDayTasks.length})</span>
          </button>
        </div>

        {/* TAB 1: Preparation Checklist */}
        {activeTab === "checklist" && (
          <div className="space-y-6">
            {/* Filters bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#EAE5DC] shadow-sm">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-xs font-bold text-[#756B5B] mr-2 flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5" /> Status:
                </span>
                {(["all", "pending", "completed", "overdue"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                      statusFilter === st
                        ? "bg-plum-800 text-white shadow-sm"
                        : "bg-warmgray-100 text-[#756B5B] hover:bg-warmgray-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-[#756B5B]">Priority:</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-1 rounded-xl border border-[#DED7CA] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-plum-800 capitalize"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              {filteredChecklist.map((task) => {
                const isConflict = hasConflict(task);
                const isOverdue =
                  task.due_date &&
                  task.status !== "completed" &&
                  new Date(task.due_date).getTime() < new Date().setHours(0, 0, 0, 0);

                return (
                  <div
                    key={task.id}
                    className={`flex items-start justify-between gap-4 p-4 rounded-2xl border transition-all ${
                      task.status === "completed"
                        ? "bg-[#FAF8F4] border-[#ECE7DE] opacity-75"
                        : "bg-white border-[#EAE5DC] shadow-soft hover:shadow-hover hover:border-plum-800"
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="mt-0.5 text-plum-800 hover:text-coral-600 transition-colors shrink-0"
                      >
                        {task.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-[#998E7D]" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-serif text-sm font-bold text-plum-950 truncate ${
                              task.status === "completed" ? "line-through text-[#756B5B]" : ""
                            }`}
                          >
                            {task.title}
                          </h3>
                        </div>

                        {task.description && (
                          <p className="text-xs text-[#756B5B] mt-0.5 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              task.priority === "urgent"
                                ? "bg-red-100 text-red-700"
                                : task.priority === "high"
                                ? "bg-coral-100 text-coral-700"
                                : task.priority === "medium"
                                ? "bg-lavender-100 text-plum-800"
                                : "bg-warmgray-100 text-[#756B5B]"
                            }`}
                          >
                            {task.priority}
                          </span>

                          <span className="text-[10px] text-[#756B5B] font-medium bg-[#FAF8F4] px-2 py-0.5 rounded border border-[#ECE7DE]">
                            {task.category}
                          </span>

                          {task.due_date && (
                            <span
                              className={`text-[10px] font-medium ${
                                isOverdue ? "text-red-600 font-bold" : "text-[#756B5B]"
                              }`}
                            >
                              Due: {formatDate(task.due_date)} {isOverdue && "(Overdue!)"}
                            </span>
                          )}

                          {isConflict && (
                            <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <AlertTriangle className="h-3 w-3" /> Deadline conflict: after event date!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditModal(task)}
                        className="p-1.5 rounded-lg text-[#756B5B] hover:text-plum-900 hover:bg-warmgray-100"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded-lg text-[#756B5B] hover:text-red-600 hover:bg-warmgray-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredChecklist.length === 0 && (
                <div className="p-12 text-center rounded-3xl bg-white border border-[#EAE5DC] text-xs text-[#756B5B]">
                  No tasks found matching your filter criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Minute-by-Minute Event-Day Itinerary */}
        {activeTab === "event_day" && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-lavender-100/70 p-4 border border-lavender-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-coral-600" />
                <div>
                  <h4 className="text-xs font-bold text-plum-900">
                    Day-of Master Schedule: {formatDate(activeEvent.event_date)}
                  </h4>
                  <p className="text-[11px] text-[#756B5B]">
                    Chronological timeline from setup load-in to final send-off.
                  </p>
                </div>
              </div>
              <button
                onClick={() => openAddModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-plum-800 text-white text-xs font-bold shadow-soft"
              >
                + Add Time Slot
              </button>
            </div>

            <div className="relative pl-6 border-l-2 border-plum-300 space-y-6 ml-4">
              {sortedEventDayTasks.map((slot) => (
                <div key={slot.id} className="relative group">
                  {/* Dot on timeline */}
                  <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-plum-800 border-4 border-white shadow-sm" />

                  <div className="rounded-2xl border border-[#EAE5DC] bg-white p-4 shadow-soft hover:shadow-hover transition-all">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-coral-600 bg-coral-50 px-2 py-0.5 rounded-md border border-coral-200">
                          {slot.due_time || "TBD"}
                        </span>
                        <h4 className="font-serif text-sm font-bold text-plum-950">
                          {slot.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(slot)}
                          className="p-1 rounded text-[#756B5B] hover:text-plum-900"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTask(slot.id)}
                          className="p-1 rounded text-[#756B5B] hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {slot.description && (
                      <p className="text-xs text-[#756B5B] mt-2 leading-relaxed">
                        {slot.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {sortedEventDayTasks.length === 0 && (
                <div className="p-8 text-center text-xs text-[#756B5B] bg-white rounded-2xl border border-[#ECE7DE]">
                  No day-of schedule slots created yet. Click "+ Add Time Slot" or generate one with AI.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Task Modal */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#EAE5DC] p-6 shadow-hover space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-3">
              <h3 className="font-serif text-lg font-bold text-plum-950">
                {editingTask ? "Edit Milestone" : "Add New Task"}
              </h3>
              <button
                onClick={() => setTaskModalOpen(false)}
                className="p-1 rounded text-[#756B5B] hover:bg-warmgray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleTaskSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#5D2962] mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Confirm final tasting session with caterer"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5D2962] mb-1">
                  Description / Responsible Person
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional instructions or contact..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Catering, Venue, Logistics"
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm capitalize"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Time (e.g. 19:30)
                  </label>
                  <input
                    type="time"
                    value={taskDueTime}
                    onChange={(e) => setTaskDueTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="taskIsEventDayInput"
                  checked={taskIsEventDay}
                  onChange={(e) => setTaskIsEventDay(e.target.checked)}
                  className="rounded border-[#DED7CA] text-plum-800 focus:ring-plum-800 h-4 w-4"
                />
                <label htmlFor="taskIsEventDayInput" className="text-xs text-[#222126] font-medium">
                  This belongs to the event-day timeline schedule
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#756B5B] hover:bg-warmgray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft"
                >
                  {editingTask ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
