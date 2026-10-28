"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useEventContext } from "@/lib/store/event-context";
import { formatINR, formatDate, downloadCSV } from "@/lib/utils";
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  MapPin,
  Users2,
  Wallet,
  Clock,
  Store,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function ReportsAndExportPage() {
  const {
    activeEvent,
    totalBudget,
    totalActualSpending,
    totalPaid,
    remainingBudget,
    budgets,
    expenses,
    tasks,
    guests,
    confirmedGuestsCount,
    confirmedAttendingCount,
    eventVendors,
    vendorsDirectory,
    currentAIPlan,
  } = useEventContext();

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleExportBudgetCSV = () => {
    const headers = "Category,Expense Title,Estimated (INR),Actual (INR),Paid (INR),Status,Notes\n";
    const rows = expenses
      .map(
        (e) =>
          `"${e.category}","${e.title}",${e.estimated_amount},${e.actual_amount},${e.paid_amount},"${e.payment_status}","${e.notes || ""}"`
      )
      .join("\n");
    downloadCSV(`${activeEvent.title.replace(/\s+/g, "_")}_Budget.csv`, headers + rows);
  };

  const handleExportGuestsCSV = () => {
    const headers = "Name,Category,RSVP,Plus Ones,Dietary Preference,Phone,Email\n";
    const rows = guests
      .map(
        (g) =>
          `"${g.name}","${g.category}","${g.rsvp_status}",${g.plus_ones},"${g.dietary_preference}","${g.phone || ""}","${g.email || ""}"`
      )
      .join("\n");
    downloadCSV(`${activeEvent.title.replace(/\s+/g, "_")}_Guests.csv`, headers + rows);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header - Screen only */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <div>
            <h1 className="font-serif text-2xl font-bold text-plum-950">
              Celebration Summary & Export Dossier
            </h1>
            <p className="text-xs text-[#756B5B] mt-0.5">
              Printable client-ready dossier, day-of run sheets, and CSV exports.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportBudgetCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-plum-900 bg-white hover:bg-warmgray-50 border border-[#DED7CA] shadow-sm transition-all"
            >
              <Download className="h-3.5 w-3.5 text-coral-600" />
              <span>Budget CSV</span>
            </button>

            <button
              onClick={handleExportGuestsCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-plum-900 bg-white hover:bg-warmgray-50 border border-[#DED7CA] shadow-sm transition-all"
            >
              <Download className="h-3.5 w-3.5 text-coral-600" />
              <span>Guest CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft transition-all"
            >
              <Printer className="h-4 w-4 text-coral-400" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Master Report Document */}
        <div className="rounded-3xl border border-[#EAE5DC] bg-white p-6 sm:p-12 shadow-soft space-y-10">
          {/* Document Header */}
          <div className="border-b-2 border-plum-900 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-coral-600 tracking-wider">
                Official Event Master Plan
              </span>
              <h2 className="font-serif text-3xl font-bold text-plum-950 mt-1">
                {activeEvent.title}
              </h2>
              <div className="flex flex-wrap gap-4 text-xs text-[#756B5B] mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-coral-500" />
                  <span>{formatDate(activeEvent.event_date)}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-coral-500" />
                  <span>{activeEvent.venue_name || activeEvent.city}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Users2 className="h-3.5 w-3.5 text-coral-500" />
                  <span>{activeEvent.expected_guests} Expected Guests</span>
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-[#756B5B]">Total Budget</div>
              <div className="font-serif text-2xl font-bold text-plum-950">
                {formatINR(totalBudget)}
              </div>
              <div className="text-[11px] text-green-700 font-semibold">
                {formatINR(remainingBudget)} Remaining Buffer
              </div>
            </div>
          </div>

          {/* Section 1: Executive Concept & Theme */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-plum-950 border-b border-[#ECE7DE] pb-2">
              1. Executive Concept & Aesthetic
            </h3>
            <p className="text-xs text-[#222126] leading-relaxed">
              {currentAIPlan?.overview || activeEvent.notes || "Comprehensive celebration plan curated by CelebrationAI."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-[#FAF8F4] border border-[#ECE7DE] text-xs">
                <span className="font-bold text-plum-900 block mb-1">Theme Directive:</span>
                <span>{currentAIPlan?.recommendedTheme || activeEvent.theme}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#FAF8F4] border border-[#ECE7DE] text-xs">
                <span className="font-bold text-plum-900 block mb-1">Catering Format:</span>
                <span>{currentAIPlan?.cateringRecommendation?.style || activeEvent.food_preference}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Financial Breakdown */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-plum-950 border-b border-[#ECE7DE] pb-2">
              2. Budget & Expense Status
            </h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#ECE7DE] text-[#756B5B] uppercase text-[10px] font-bold">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Estimated</th>
                  <th className="py-2">Actual</th>
                  <th className="py-2">Paid</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE7DE]">
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td className="py-2 font-medium text-plum-950">{exp.title}</td>
                    <td className="py-2 capitalize text-[#756B5B]">{exp.category}</td>
                    <td className="py-2">{formatINR(exp.estimated_amount)}</td>
                    <td className="py-2 font-bold">{formatINR(exp.actual_amount)}</td>
                    <td className="py-2 text-green-700">{formatINR(exp.paid_amount)}</td>
                    <td className="py-2 uppercase text-[10px] font-bold">{exp.payment_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 3: Event-Day Run Sheet */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-plum-950 border-b border-[#ECE7DE] pb-2">
              3. Day-of Minute-by-Minute Timeline
            </h3>
            <div className="space-y-2">
              {tasks
                .filter((t) => t.is_event_day)
                .map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-start gap-4 p-2.5 rounded-xl border border-[#ECE7DE] text-xs"
                  >
                    <span className="font-bold text-coral-600 w-24 shrink-0">
                      {slot.due_time || "Scheduled"}
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-plum-950">{slot.title}</div>
                      {slot.description && (
                        <div className="text-[11px] text-[#756B5B]">{slot.description}</div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Section 4: Vendor Contact Directory */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-plum-950 border-b border-[#ECE7DE] pb-2">
              4. Shortlisted & Booked Vendor Contacts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {eventVendors.map((link) => {
                const vendor =
                  link.vendor || vendorsDirectory.find((v) => v.id === link.vendor_id);
                return (
                  <div
                    key={link.id}
                    className="p-3.5 rounded-xl border border-[#ECE7DE] bg-[#FAF8F4]"
                  >
                    <div className="flex items-center justify-between font-bold text-plum-950">
                      <span>{vendor?.name}</span>
                      <span className="capitalize text-[10px] text-coral-600 bg-coral-50 px-2 py-0.5 rounded">
                        {link.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#756B5B] mt-1">
                      {vendor?.category} • {formatINR(link.quoted_price)}
                    </div>
                    <div className="text-[11px] text-plum-900 font-medium mt-1">
                      Phone: {vendor?.contact_phone || "—"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: Guest Headcount & Dietary Breakdown */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-plum-950 border-b border-[#ECE7DE] pb-2">
              5. Attendance & Catering Portions
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-xl bg-[#FAF8F4] border border-[#ECE7DE]">
                <div className="text-xl font-serif font-bold text-plum-950">
                  {confirmedAttendingCount}
                </div>
                <div className="text-[11px] text-[#756B5B]">Total Confirmed Attendance</div>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F4] border border-[#ECE7DE]">
                <div className="text-xl font-serif font-bold text-green-700">
                  {guests.filter((g) => g.rsvp_status === "accepted" && g.dietary_preference === "Vegetarian").length}
                </div>
                <div className="text-[11px] text-[#756B5B]">Pure Vegetarian Count</div>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF8F4] border border-[#ECE7DE]">
                <div className="text-xl font-serif font-bold text-coral-600">
                  {guests.filter((g) => g.rsvp_status === "accepted" && g.dietary_preference === "Non-Vegetarian").length}
                </div>
                <div className="text-[11px] text-[#756B5B]">Non-Vegetarian Count</div>
              </div>
            </div>
          </div>

          {/* Document Footer */}
          <div className="pt-6 border-t border-[#ECE7DE] text-center text-xs text-[#998E7D]">
            Generated on {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} • Powered by CelebrationAI
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
