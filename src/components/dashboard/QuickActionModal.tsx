"use client";

import { useState } from "react";
import { X, Plus, Wallet, CheckSquare, UserPlus } from "lucide-react";
import { useEventContext } from "@/lib/store/event-context";
import { BudgetCategory } from "@/lib/types";

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "expense" | "task" | "guest";
}

export function QuickActionModal({
  isOpen,
  onClose,
  initialTab = "expense",
}: QuickActionModalProps) {
  const { addExpense, addTask, addGuest } = useEventContext();
  const [tab, setTab] = useState<"expense" | "task" | "guest">(initialTab);

  // Expense form state
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState<BudgetCategory>("catering");
  const [expenseEst, setExpenseEst] = useState("");
  const [expenseActual, setExpenseActual] = useState("");
  const [expensePaid, setExpensePaid] = useState("");
  const [expenseNotes, setExpenseNotes] = useState("");

  // Task form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState("General");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskIsEventDay, setTaskIsEventDay] = useState(false);

  // Guest form state
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestCategory, setGuestCategory] = useState<any>("Close Friends");
  const [guestDiet, setGuestDiet] = useState<any>("Vegetarian");
  const [guestPlusOnes, setGuestPlusOnes] = useState(0);

  if (!isOpen) return null;

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim()) return;
    addExpense({
      title: expenseTitle,
      category: expenseCategory,
      estimated_amount: Number(expenseEst) || 0,
      actual_amount: Number(expenseActual) || Number(expenseEst) || 0,
      paid_amount: Number(expensePaid) || 0,
      payment_status: Number(expensePaid) >= Number(expenseActual || expenseEst) && Number(expensePaid) > 0 ? "paid" : Number(expensePaid) > 0 ? "partial" : "pending",
      notes: expenseNotes,
    });
    setExpenseTitle("");
    setExpenseEst("");
    setExpenseActual("");
    setExpensePaid("");
    setExpenseNotes("");
    onClose();
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      title: taskTitle,
      category: taskCategory,
      priority: taskPriority,
      status: "pending",
      due_date: taskDueDate || undefined,
      is_event_day: taskIsEventDay,
      order_index: 10,
    });
    setTaskTitle("");
    setTaskDueDate("");
    onClose();
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    addGuest({
      name: guestName,
      email: guestEmail || undefined,
      phone: guestPhone || undefined,
      category: guestCategory,
      rsvp_status: "pending",
      plus_ones: Number(guestPlusOnes) || 0,
      dietary_preference: guestDiet,
    });
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setGuestPlusOnes(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-[#EAE5DC] shadow-hover overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ECE7DE] px-6 py-4 bg-[#FAF8F4]">
          <h3 className="font-serif text-lg font-bold text-plum-950">
            Quick Add
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#756B5B] hover:bg-warmgray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-[#ECE7DE] bg-warmgray-50 p-1.5 gap-1.5">
          <button
            onClick={() => setTab("expense")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === "expense"
                ? "bg-white text-plum-900 shadow-sm border border-[#DED7CA]"
                : "text-[#756B5B] hover:text-plum-900"
            }`}
          >
            <Wallet className="h-4 w-4 text-coral-500" />
            <span>Add Expense</span>
          </button>
          <button
            onClick={() => setTab("task")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === "task"
                ? "bg-white text-plum-900 shadow-sm border border-[#DED7CA]"
                : "text-[#756B5B] hover:text-plum-900"
            }`}
          >
            <CheckSquare className="h-4 w-4 text-coral-500" />
            <span>Add Task</span>
          </button>
          <button
            onClick={() => setTab("guest")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === "guest"
                ? "bg-white text-plum-900 shadow-sm border border-[#DED7CA]"
                : "text-[#756B5B] hover:text-plum-900"
            }`}
          >
            <UserPlus className="h-4 w-4 text-coral-500" />
            <span>Add Guest</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {tab === "expense" && (
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5D2962] mb-1">
                  Expense Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stage floral arrangement & fairy lights"
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Category
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as BudgetCategory)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm capitalize"
                  >
                    <option value="catering">Catering</option>
                    <option value="venue">Venue</option>
                    <option value="decoration">Decoration</option>
                    <option value="photography">Photography</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="invitations">Invitations</option>
                    <option value="transportation">Transportation</option>
                    <option value="gifts">Gifts & Favors</option>
                    <option value="miscellaneous">Miscellaneous</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Estimated Cost (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 15000"
                    value={expenseEst}
                    onChange={(e) => setExpenseEst(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Actual / Final Cost (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 14500"
                    value={expenseActual}
                    onChange={(e) => setExpenseActual(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Amount Paid (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={expensePaid}
                    onChange={(e) => setExpensePaid(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5D2962] mb-1">
                  Notes / Vendor details
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional payment notes or invoice reference..."
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#756B5B] hover:bg-warmgray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft"
                >
                  Save Expense
                </button>
              </div>
            </form>
          )}

          {tab === "task" && (
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5D2962] mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taste test dessert samples with baker"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="eventDayCheck"
                  checked={taskIsEventDay}
                  onChange={(e) => setTaskIsEventDay(e.target.checked)}
                  className="rounded border-[#DED7CA] text-plum-800 focus:ring-plum-800 h-4 w-4"
                />
                <label htmlFor="eventDayCheck" className="text-xs text-[#222126] font-medium">
                  This task is part of the Event-Day schedule / minute-by-minute timeline
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#756B5B] hover:bg-warmgray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft"
                >
                  Save Task
                </button>
              </div>
            </form>
          )}

          {tab === "guest" && (
            <form onSubmit={handleGuestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5D2962] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98220 00000"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Group
                  </label>
                  <select
                    value={guestCategory}
                    onChange={(e) => setGuestCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-xs"
                  >
                    <option value="Family">Family</option>
                    <option value="Close Friends">Close Friends</option>
                    <option value="Work">Work</option>
                    <option value="VIP">VIP</option>
                    <option value="Relatives">Relatives</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Dietary
                  </label>
                  <select
                    value={guestDiet}
                    onChange={(e) => setGuestDiet(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-xs"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Pure Veg / Jain">Jain</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Plus-Ones
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={guestPlusOnes}
                    onChange={(e) => setGuestPlusOnes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#756B5B] hover:bg-warmgray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft"
                >
                  Add Guest
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
