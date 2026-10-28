"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useEventContext } from "@/lib/store/event-context";
import { GuestItem } from "@/lib/types";
import { downloadCSV } from "@/lib/utils";
import {
  Users2,
  Plus,
  Trash2,
  Edit2,
  Search,
  Download,
  Share2,
  CheckCircle2,
  XCircle,
  Clock,
  Utensils,
  Copy,
  ExternalLink,
  X,
} from "lucide-react";

export default function GuestListPage() {
  const {
    guests,
    addGuest,
    updateGuest,
    deleteGuest,
    confirmedGuestsCount,
    confirmedAttendingCount,
    activeEvent,
  } = useEventContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDiet, setFilterDiet] = useState<string>("all");
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState<any>("Close Friends");
  const [dietary, setDietary] = useState<any>("Vegetarian");
  const [rsvpStatus, setRsvpStatus] = useState<any>("pending");
  const [plusOnes, setPlusOnes] = useState(0);
  const [tableNo, setTableNo] = useState("");
  const [notes, setNotes] = useState("");

  const publicRsvpUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/rsvp/${activeEvent.id}`
      : `/rsvp/${activeEvent.id}`;

  const copyShareLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(publicRsvpUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleExportCSV = () => {
    const headers = "Name,Category,RSVP Status,Plus Ones,Total Attending,Dietary Preference,Phone,Email,Table\n";
    const rows = guests
      .map(
        (g) =>
          `"${g.name}","${g.category}","${g.rsvp_status}",${g.plus_ones},${
            g.rsvp_status === "accepted" ? 1 + g.plus_ones : 0
          },"${g.dietary_preference}","${g.phone || ""}","${g.email || ""}","${
            g.table_number || ""
          }"`
      )
      .join("\n");

    downloadCSV(`${activeEvent.title.replace(/\s+/g, "_")}_Guests.csv`, headers + rows);
  };

  const openAddModal = () => {
    setEditingGuest(null);
    setName("");
    setEmail("");
    setPhone("");
    setCategory("Close Friends");
    setDietary("Vegetarian");
    setRsvpStatus("pending");
    setPlusOnes(0);
    setTableNo("");
    setNotes("");
    setGuestModalOpen(true);
  };

  const openEditModal = (guest: GuestItem) => {
    setEditingGuest(guest);
    setName(guest.name);
    setEmail(guest.email || "");
    setPhone(guest.phone || "");
    setCategory(guest.category);
    setDietary(guest.dietary_preference);
    setRsvpStatus(guest.rsvp_status);
    setPlusOnes(guest.plus_ones);
    setTableNo(guest.table_number || "");
    setNotes(guest.notes || "");
    setGuestModalOpen(true);
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingGuest) {
      updateGuest(editingGuest.id, {
        name,
        email: email || undefined,
        phone: phone || undefined,
        category,
        dietary_preference: dietary,
        rsvp_status: rsvpStatus,
        plus_ones: Number(plusOnes),
        table_number: tableNo || undefined,
        notes: notes || undefined,
      });
    } else {
      addGuest({
        name,
        email: email || undefined,
        phone: phone || undefined,
        category,
        dietary_preference: dietary,
        rsvp_status: rsvpStatus,
        plus_ones: Number(plusOnes),
        table_number: tableNo || undefined,
        notes: notes || undefined,
      });
    }
    setGuestModalOpen(false);
  };

  // Filtered guests
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.phone && g.phone.includes(searchQuery)) ||
      (g.email && g.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === "all" || g.rsvp_status === filterStatus;
    const matchesDiet = filterDiet === "all" || g.dietary_preference === filterDiet;

    return matchesSearch && matchesStatus && matchesDiet;
  });

  // Dietary counts of confirmed attendees
  const confirmedAttendees = guests.filter((g) => g.rsvp_status === "accepted");
  const vegCount = confirmedAttendees
    .filter((g) => g.dietary_preference === "Vegetarian")
    .reduce((s, g) => s + 1 + g.plus_ones, 0);
  const jainCount = confirmedAttendees
    .filter((g) => g.dietary_preference === "Pure Veg / Jain")
    .reduce((s, g) => s + 1 + g.plus_ones, 0);
  const nonVegCount = confirmedAttendees
    .filter((g) => g.dietary_preference === "Non-Vegetarian")
    .reduce((s, g) => s + 1 + g.plus_ones, 0);

  // Recommended buffer plates (+10%)
  const recommendedBufferPlates = Math.ceil(confirmedAttendingCount * 1.1);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-plum-950">
              Guest List & RSVP Management
            </h1>
            <p className="text-xs text-[#756B5B] mt-0.5">
              Track invitee attendance, plus-ones, dietary requirements, and catering estimates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={copyShareLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-plum-900 bg-lavender-200 hover:bg-lavender-300 border border-lavender-300 transition-all"
            >
              <Share2 className="h-3.5 w-3.5 text-coral-600" />
              <span>{copiedLink ? "Link Copied!" : "Share RSVP Link"}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#222126] bg-white hover:bg-warmgray-50 border border-[#DED7CA] shadow-sm transition-all"
            >
              <Download className="h-3.5 w-3.5 text-[#756B5B]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft transition-all"
            >
              <Plus className="h-4 w-4 text-coral-400" />
              <span>Add Guest</span>
            </button>
          </div>
        </div>

        {/* Catering Portions & RSVP Summary Card */}
        <div className="rounded-3xl border border-[#EAE5DC] bg-white p-6 sm:p-8 shadow-soft">
          <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-plum-800 text-white flex items-center justify-center">
                <Utensils className="h-4.5 w-4.5 text-coral-400" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-plum-950">
                  Catering Requirement Calculator
                </h3>
                <p className="text-xs text-[#756B5B]">
                  Real-time headcount & portion estimates derived from accepted RSVPs
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#756B5B]">Total Headcount:</span>
              <div className="font-serif text-xl font-bold text-plum-950">
                {confirmedAttendingCount} Pax
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#ECE7DE]">
              <span className="text-[11px] font-bold text-[#756B5B] uppercase">Pure Veg</span>
              <div className="font-serif text-xl font-bold text-green-700 mt-1">
                {vegCount} Plates
              </div>
              <div className="text-[10px] text-[#756B5B]">Standard vegetarian spread</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#ECE7DE]">
              <span className="text-[11px] font-bold text-[#756B5B] uppercase">Jain Friendly</span>
              <div className="font-serif text-xl font-bold text-amber-700 mt-1">
                {jainCount} Plates
              </div>
              <div className="text-[10px] text-[#756B5B]">No onion / garlic required</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#ECE7DE]">
              <span className="text-[11px] font-bold text-[#756B5B] uppercase">Non-Veg</span>
              <div className="font-serif text-xl font-bold text-coral-600 mt-1">
                {nonVegCount} Plates
              </div>
              <div className="text-[10px] text-[#756B5B]">Chicken / Mutton / Seafood</div>
            </div>

            <div className="p-4 rounded-2xl bg-lavender-100/70 border border-lavender-300">
              <span className="text-[11px] font-bold text-plum-900 uppercase">Recommended Order</span>
              <div className="font-serif text-xl font-bold text-plum-950 mt-1">
                {recommendedBufferPlates} Plates
              </div>
              <div className="text-[10px] text-plum-800">Includes 10% caterer buffer</div>
            </div>
          </div>
        </div>

        {/* Guest List Directory & Search */}
        <div className="rounded-3xl border border-[#EAE5DC] bg-white p-6 sm:p-8 shadow-soft space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#998E7D] h-4 w-4" />
              <input
                type="text"
                placeholder="Search guest by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#DED7CA] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-plum-800 capitalize"
              >
                <option value="all">All RSVP Statuses</option>
                <option value="accepted">Accepted ({confirmedGuestsCount})</option>
                <option value="pending">Pending</option>
                <option value="declined">Declined</option>
              </select>

              <select
                value={filterDiet}
                onChange={(e) => setFilterDiet(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#DED7CA] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-plum-800"
              >
                <option value="all">All Diets</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Pure Veg / Jain">Jain</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#ECE7DE] text-[#756B5B] uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-3">Guest</th>
                  <th className="py-3 px-3">Group</th>
                  <th className="py-3 px-3">RSVP Status</th>
                  <th className="py-3 px-3">Dietary</th>
                  <th className="py-3 px-3">Plus-Ones</th>
                  <th className="py-3 px-3">Table</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE7DE]">
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-warmgray-50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-plum-950">
                      <div>{guest.name}</div>
                      {guest.notes && (
                        <div className="text-[10px] text-[#756B5B] font-normal truncate max-w-xs">
                          {guest.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[#756B5B]">{guest.category}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          guest.rsvp_status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : guest.rsvp_status === "declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {guest.rsvp_status === "accepted" && <CheckCircle2 className="h-3 w-3" />}
                        {guest.rsvp_status === "declined" && <XCircle className="h-3 w-3" />}
                        {guest.rsvp_status === "pending" && <Clock className="h-3 w-3" />}
                        <span>{guest.rsvp_status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-plum-900 font-medium">
                      {guest.dietary_preference}
                    </td>
                    <td className="py-3 px-3 text-[#756B5B]">
                      {guest.plus_ones > 0 ? `+${guest.plus_ones}` : "0"}
                    </td>
                    <td className="py-3 px-3 text-[#756B5B]">
                      {guest.table_number || "—"}
                    </td>
                    <td className="py-3 px-3 text-[#756B5B]">
                      <div>{guest.phone || "—"}</div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(guest)}
                          className="p-1 rounded text-[#756B5B] hover:text-plum-900 hover:bg-warmgray-200"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteGuest(guest.id)}
                          className="p-1 rounded text-[#756B5B] hover:text-red-600 hover:bg-warmgray-200"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredGuests.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#756B5B]">
                      No guests found. Click "+ Add Guest" or share the public RSVP link with your friends and family.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Guest Modal */}
      {guestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#EAE5DC] p-6 shadow-hover space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-3">
              <h3 className="font-serif text-lg font-bold text-plum-950">
                {editingGuest ? "Edit Guest" : "Add New Guest"}
              </h3>
              <button
                onClick={() => setGuestModalOpen(false)}
                className="p-1 rounded text-[#756B5B] hover:bg-warmgray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGuestSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#5D2962] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Deshmukh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Group Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  >
                    <option value="Family">Family</option>
                    <option value="Close Friends">Close Friends</option>
                    <option value="Work">Work / Colleagues</option>
                    <option value="VIP">VIP</option>
                    <option value="Relatives">Relatives</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    RSVP Status
                  </label>
                  <select
                    value={rsvpStatus}
                    onChange={(e) => setRsvpStatus(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted (Confirmed)</option>
                    <option value="declined">Declined</option>
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
                    value={plusOnes}
                    onChange={(e) => setPlusOnes(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Dietary Preference
                  </label>
                  <select
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Pure Veg / Jain">Pure Veg / Jain</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                    <option value="Halal">Halal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Table / Seating
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Table 2"
                    value={tableNo}
                    onChange={(e) => setTableNo(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5D2962] mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Coming with spouse, requested low-noise seating..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGuestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#756B5B] hover:bg-warmgray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft"
                >
                  {editingGuest ? "Save Changes" : "Add Guest"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
