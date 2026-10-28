"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useEventContext } from "@/lib/store/event-context";
import { formatINR, formatDate } from "@/lib/utils";
import { BudgetCategory, ExpenseItem } from "@/lib/types";
import {
  Wallet,
  Plus,
  Trash2,
  Edit2,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  PieChart as PieIcon,
  ChevronDown,
  X,
  FileDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

const CATEGORIES: { id: BudgetCategory; label: string }[] = [
  { id: "catering", label: "Catering & Bar" },
  { id: "venue", label: "Venue & Hospitality" },
  { id: "decoration", label: "Decor & Floral" },
  { id: "photography", label: "Photography & Reels" },
  { id: "entertainment", label: "DJ & Performances" },
  { id: "invitations", label: "Invitations & Tech" },
  { id: "transportation", label: "Logistics & Cabs" },
  { id: "gifts", label: "Gifts & Favors" },
  { id: "miscellaneous", label: "Contingency Buffer" },
];

export default function BudgetManagerPage() {
  const {
    activeEvent,
    updateEvent,
    totalBudget,
    totalActualSpending,
    totalEstimatedSpending,
    totalPaid,
    remainingBudget,
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    budgets,
    setBudgets,
  } = useEventContext();

  const [editingBudgetModal, setEditingBudgetModal] = useState(false);
  const [newTotalBudget, setNewTotalBudget] = useState(totalBudget);
  const [addExpenseModal, setAddExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);

  // Filter category
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  // AI Cost Savings state
  const [aiSavingsLoading, setAiSavingsLoading] = useState(false);
  const [aiSavingsData, setAiSavingsData] = useState<{
    totalEstimatedSavings: number;
    suggestions: any[];
  } | null>(null);

  // Form states for adding/editing expense
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<BudgetCategory>("catering");
  const [formEst, setFormEst] = useState("");
  const [formActual, setFormActual] = useState("");
  const [formPaid, setFormPaid] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formDueDate, setFormDueDate] = useState("");

  const filteredExpenses =
    selectedCategoryFilter === "all"
      ? expenses
      : expenses.filter((e) => e.category === selectedCategoryFilter);

  // Auto-allocate with AI
  const handleAutoAllocate = async () => {
    try {
      const res = await fetch("/api/ai/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total_budget: totalBudget,
          category: activeEvent.category,
          priority_categories: activeEvent.priority_categories,
        }),
      });
      const data = await res.json();
      if (data.success && data.allocations) {
        setBudgets(data.allocations);
      }
    } catch (e) {
      console.warn("Failed to auto allocate budget:", e);
    }
  };

  // Get AI Cost savings
  const handleGetCostSavings = async () => {
    setAiSavingsLoading(true);
    try {
      const res = await fetch("/api/ai/cost-savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalBudget,
          currentSpending: totalActualSpending,
          guestCount: activeEvent.expected_guests,
          expenses: expenses.map((e) => ({
            category: e.category,
            title: e.title,
            amount: e.actual_amount || e.estimated_amount,
          })),
        }),
      });
      const data = await res.json();
      if (data.success && data.savings) {
        setAiSavingsData(data.savings);
      }
    } catch (e) {
      console.warn("Failed to get cost savings:", e);
    } finally {
      setAiSavingsLoading(false);
    }
  };

  const handleSaveBudgetTotal = (e: React.FormEvent) => {
    e.preventDefault();
    updateEvent({ total_budget: Number(newTotalBudget) });
    setEditingBudgetModal(false);
  };

  const openAddModal = () => {
    setEditingExpense(null);
    setFormTitle("");
    setFormCategory("catering");
    setFormEst("");
    setFormActual("");
    setFormPaid("");
    setFormNotes("");
    setFormDueDate("");
    setAddExpenseModal(true);
  };

  const openEditModal = (item: ExpenseItem) => {
    setEditingExpense(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormEst(String(item.estimated_amount));
    setFormActual(String(item.actual_amount));
    setFormPaid(String(item.paid_amount));
    setFormNotes(item.notes || "");
    setFormDueDate(item.due_date || "");
    setAddExpenseModal(true);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const est = Number(formEst) || 0;
    const act = Number(formActual) || est;
    const paid = Number(formPaid) || 0;
    const status = paid >= act && paid > 0 ? "paid" : paid > 0 ? "partial" : "pending";

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        title: formTitle,
        category: formCategory,
        estimated_amount: est,
        actual_amount: act,
        paid_amount: paid,
        payment_status: status,
        notes: formNotes,
        due_date: formDueDate || undefined,
      });
    } else {
      addExpense({
        title: formTitle,
        category: formCategory,
        estimated_amount: est,
        actual_amount: act,
        paid_amount: paid,
        payment_status: status,
        notes: formNotes,
        due_date: formDueDate || undefined,
      });
    }
    setAddExpenseModal(false);
  };

  // Bar chart comparing Allocated vs Actual Spending per category
  const comparisonChartData = CATEGORIES.map((cat) => {
    const allocated =
      budgets.find((b) => b.category === cat.id)?.allocated_amount || 0;
    const spent = expenses
      .filter((e) => e.category === cat.id)
      .reduce((sum, item) => sum + (item.actual_amount || item.estimated_amount), 0);

    return {
      category: cat.label.split(" ")[0],
      Allocated: allocated,
      Spent: spent,
    };
  }).filter((item) => item.Allocated > 0 || item.Spent > 0);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-plum-950">
              Budget & Expense Manager
            </h1>
            <p className="text-xs text-[#756B5B] mt-0.5">
              Track allocated funds, vendor deposits, and real-time INR spending.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleAutoAllocate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-plum-900 bg-lavender-200 hover:bg-lavender-300 border border-lavender-300 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-coral-600" />
              <span>AI Auto-Allocate</span>
            </button>

            <button
              onClick={handleGetCostSavings}
              disabled={aiSavingsLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-coral-900 bg-coral-100 hover:bg-coral-200 border border-coral-200 transition-all"
            >
              <TrendingDown className="h-3.5 w-3.5 text-coral-600" />
              <span>{aiSavingsLoading ? "Calculating..." : "Find Cost Savings"}</span>
            </button>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft transition-all"
            >
              <Plus className="h-4 w-4 text-coral-400" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* 4 Financial Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#756B5B]">Total Target Budget</span>
              <button
                onClick={() => setEditingBudgetModal(true)}
                className="text-[11px] font-bold text-coral-600 hover:underline"
              >
                Edit Target
              </button>
            </div>
            <div className="font-serif text-2xl font-bold text-plum-950 mt-2">
              {formatINR(totalBudget)}
            </div>
            <div className="text-[11px] text-[#756B5B] mt-1">
              ~₹{Math.round(totalBudget / activeEvent.expected_guests)} / guest
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-soft">
            <span className="text-xs font-semibold text-[#756B5B]">Committed / Spent</span>
            <div className="font-serif text-2xl font-bold text-plum-950 mt-2">
              {formatINR(totalActualSpending)}
            </div>
            <div className="text-[11px] text-[#756B5B] mt-1">
              {Math.round((totalActualSpending / (totalBudget || 1)) * 100)}% of target used
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-soft">
            <span className="text-xs font-semibold text-[#756B5B]">Total Paid / Deposited</span>
            <div className="font-serif text-2xl font-bold text-green-700 mt-2">
              {formatINR(totalPaid)}
            </div>
            <div className="text-[11px] text-[#756B5B] mt-1">
              {formatINR(totalActualSpending - totalPaid)} balance pending
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAE5DC] bg-white p-5 shadow-soft">
            <span className="text-xs font-semibold text-[#756B5B]">Remaining Budget</span>
            <div
              className={`font-serif text-2xl font-bold mt-2 ${
                remainingBudget >= 0 ? "text-plum-950" : "text-coral-600"
              }`}
            >
              {formatINR(remainingBudget)}
            </div>
            <div className="text-[11px] mt-1">
              {remainingBudget >= 0 ? (
                <span className="text-green-700 font-medium">✓ On track</span>
              ) : (
                <span className="text-coral-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Overspent by {formatINR(Math.abs(remainingBudget))}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* AI Cost-Savings Recommendations Modal / Banner */}
        {aiSavingsData && (
          <div className="rounded-3xl border border-coral-200 bg-coral-50/70 p-6 shadow-soft space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-coral-600" />
                <h3 className="font-serif text-lg font-bold text-coral-950">
                  Potential Cost Savings: {formatINR(aiSavingsData.totalEstimatedSavings)}
                </h3>
              </div>
              <button
                onClick={() => setAiSavingsData(null)}
                className="text-xs font-bold text-coral-700 hover:text-coral-950"
              >
                Dismiss
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiSavingsData.suggestions.map((sug: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-coral-200/80 shadow-sm space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-plum-950">{sug.title}</span>
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      Save {formatINR(sug.potentialSavingsINR)}
                    </span>
                  </div>
                  <p className="text-xs text-[#756B5B] leading-relaxed">
                    {sug.actionableTip}
                  </p>
                  <div className="text-[11px] text-coral-800 font-medium pt-1">
                    Trade-off: {sug.tradeOff}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget vs Spending Visual Bar Chart */}
        <div className="rounded-3xl border border-[#EAE5DC] bg-white p-6 sm:p-8 shadow-soft">
          <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-4 mb-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-plum-950">
                Budget Allocation vs. Real Expenditure
              </h3>
              <p className="text-xs text-[#756B5B]">
                Comparison across categories in INR
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#756B5B" }} />
                <YAxis tick={{ fontSize: 11, fill: "#756B5B" }} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  formatter={(val: number) => [formatINR(val)]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #DED7CA",
                    backgroundColor: "#FFFFFF",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="Allocated" fill="#4C234F" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Spent" fill="#FF8066" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Tracking Table */}
        <div className="rounded-3xl border border-[#EAE5DC] bg-white p-6 sm:p-8 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE7DE] pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-plum-950">
                Itemized Expenses & Vendor Invoices
              </h3>
              <p className="text-xs text-[#756B5B]">
                {expenses.length} tracked items
              </p>
            </div>

            {/* Filter by category */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-[#756B5B]">Filter:</label>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#DED7CA] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-plum-800 capitalize"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#ECE7DE] text-[#756B5B] uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-3">Expense Item</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Estimated</th>
                  <th className="py-3 px-3">Actual</th>
                  <th className="py-3 px-3">Paid Deposit</th>
                  <th className="py-3 px-3">Balance</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE7DE]">
                {filteredExpenses.map((exp) => {
                  const balance = (exp.actual_amount || exp.estimated_amount) - exp.paid_amount;
                  return (
                    <tr key={exp.id} className="hover:bg-warmgray-50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-plum-950 max-w-xs">
                        <div>{exp.title}</div>
                        {exp.notes && (
                          <div className="text-[10px] text-[#756B5B] font-normal truncate">
                            {exp.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 capitalize text-[#756B5B]">
                        {exp.category}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#222126]">
                        {formatINR(exp.estimated_amount)}
                      </td>
                      <td className="py-3 px-3 font-bold text-plum-950">
                        {formatINR(exp.actual_amount)}
                      </td>
                      <td className="py-3 px-3 font-medium text-green-700">
                        {formatINR(exp.paid_amount)}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#756B5B]">
                        {formatINR(balance)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            exp.payment_status === "paid"
                              ? "bg-green-100 text-green-800"
                              : exp.payment_status === "partial"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-coral-100 text-coral-800"
                          }`}
                        >
                          {exp.payment_status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(exp)}
                            className="p-1 rounded text-[#756B5B] hover:text-plum-900 hover:bg-warmgray-200 transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteExpense(exp.id)}
                            className="p-1 rounded text-[#756B5B] hover:text-red-600 hover:bg-warmgray-200 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredExpenses.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#756B5B]">
                      No expenses logged in this category. Click "+ Add Expense" above to record one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Target Budget Modal */}
      {editingBudgetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-[#EAE5DC] p-6 shadow-hover space-y-4">
            <h3 className="font-serif text-lg font-bold text-plum-950">
              Update Total Budget
            </h3>
            <form onSubmit={handleSaveBudgetTotal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5D2962] mb-1">
                  Target Amount in INR (₹)
                </label>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  required
                  value={newTotalBudget}
                  onChange={(e) => setNewTotalBudget(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm font-bold text-plum-950"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBudgetModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#756B5B] hover:bg-warmgray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Expense Modal */}
      {addExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#EAE5DC] p-6 shadow-hover space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-3">
              <h3 className="font-serif text-lg font-bold text-plum-950">
                {editingExpense ? "Edit Expense" : "Add New Expense"}
              </h3>
              <button
                onClick={() => setAddExpenseModal(false)}
                className="p-1 rounded text-[#756B5B] hover:bg-warmgray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#5D2962] mb-1">
                  Item Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Banquet Hall Advance Deposit"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as BudgetCategory)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm capitalize"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Estimated Cost (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 10000"
                    value={formEst}
                    onChange={(e) => setFormEst(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Actual / Quoted Cost (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 9500"
                    value={formActual}
                    onChange={(e) => setFormActual(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Amount Paid (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 4000"
                    value={formPaid}
                    onChange={(e) => setFormPaid(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5D2962] mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5D2962] mb-1">
                  Vendor Notes / Payment Mode
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Paid token via GPay, balance on event night..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddExpenseModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#756B5B] hover:bg-warmgray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft"
                >
                  {editingExpense ? "Save Changes" : "Record Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
