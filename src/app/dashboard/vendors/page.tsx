"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useEventContext } from "@/lib/store/event-context";
import { formatINR } from "@/lib/utils";
import { VendorItem, EventVendorLink } from "@/lib/types";
import {
  Store,
  Search,
  Filter,
  Plus,
  Star,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Info,
  DollarSign,
  Tag,
  ShieldCheck,
  X,
} from "lucide-react";

const VENDOR_CATEGORIES = [
  { id: "all", label: "All Vendors" },
  { id: "venue", label: "Venues" },
  { id: "catering", label: "Catering" },
  { id: "decoration", label: "Decorators" },
  { id: "photography", label: "Photographers" },
  { id: "entertainment", label: "DJs & Music" },
  { id: "makeup", label: "Makeup & Styling" },
];

export default function VendorManagerPage() {
  const {
    vendorsDirectory,
    eventVendors,
    shortlistVendor,
    removeEventVendor,
    updateVendorStatus,
    addCustomVendor,
    activeEvent,
  } = useEventContext();

  const [activeTab, setActiveTab] = useState<"directory" | "shortlist">("directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [addCustomModal, setAddCustomModal] = useState(false);

  // Custom vendor form state
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState<any>("venue");
  const [customCity, setCustomCity] = useState(activeEvent.city || "Pune");
  const [customPriceRange, setCustomPriceRange] = useState<any>("₹₹");
  const [customStartingPrice, setCustomStartingPrice] = useState("");
  const [customPhone, setCustomPhone] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [customDesc, setCustomDesc] = useState("");

  // Edit quote/status modal state
  const [editingLink, setEditingLink] = useState<EventVendorLink | null>(null);
  const [quoteInput, setQuoteInput] = useState("");
  const [depositInput, setDepositInput] = useState("");
  const [statusInput, setStatusInput] = useState<EventVendorLink["status"]>("shortlisted");

  // Filter vendors
  const filteredDirectory = vendorsDirectory.filter((v) => {
    const matchesCat = selectedCategory === "all" || v.category === selectedCategory;
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateCustomVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    addCustomVendor({
      name: customName,
      category: customCategory,
      city: customCity,
      price_range: customPriceRange,
      starting_price: Number(customStartingPrice) || 0,
      rating: 4.8,
      review_count: 1,
      contact_phone: customPhone,
      contact_email: customEmail,
      description: customDesc || "Personal vendor added to event.",
      highlights: ["Personal Contact", "Custom Sourced"],
      image_url:
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    });

    setCustomName("");
    setCustomStartingPrice("");
    setCustomPhone("");
    setCustomEmail("");
    setCustomDesc("");
    setAddCustomModal(false);
    setActiveTab("shortlist");
  };

  const handleUpdateStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    updateVendorStatus(
      editingLink.id,
      statusInput,
      Number(quoteInput) || editingLink.quoted_price,
      Number(depositInput) || editingLink.deposit_paid
    );
    setEditingLink(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-plum-950">
              Vendor Directory & Shortlist
            </h1>
            <p className="text-xs text-[#756B5B] mt-0.5">
              Discover vetted celebration specialists or log your personal supplier contacts.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setAddCustomModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft transition-all"
            >
              <Plus className="h-4 w-4 text-coral-400" />
              <span>Add Custom Vendor</span>
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        <div className="rounded-2xl border border-lavender-300 bg-lavender-100/60 p-4 text-xs text-plum-950 flex items-start gap-3">
          <Info className="h-4.5 w-4.5 text-coral-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Transparent Directory Notice:</span> Directory entries are realistic curated benchmark vendors for Indian cities ({activeEvent.city}, Mumbai, Pune). You can shortlist them, track quoted pricing, log real deposit payments, or add your own real suppliers.
          </div>
        </div>

        {/* Tabs: Directory vs My Shortlisted Vendors */}
        <div className="flex border-b border-[#ECE7DE] gap-4">
          <button
            onClick={() => setActiveTab("directory")}
            className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
              activeTab === "directory"
                ? "text-plum-950 border-b-2 border-plum-800"
                : "text-[#756B5B] hover:text-plum-900"
            }`}
          >
            <Store className="h-4 w-4 text-coral-500" />
            <span>Curated Directory ({vendorsDirectory.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("shortlist")}
            className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 ${
              activeTab === "shortlist"
                ? "text-plum-950 border-b-2 border-plum-800"
                : "text-[#756B5B] hover:text-plum-900"
            }`}
          >
            <CheckCircle2 className="h-4 w-4 text-coral-500" />
            <span>Shortlisted & Booked ({eventVendors.length})</span>
          </button>
        </div>

        {/* TAB 1: Curated Directory */}
        {activeTab === "directory" && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#998E7D] h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by vendor name, service, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-xs bg-white"
                />
              </div>

              {/* Category selector */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {VENDOR_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? "bg-plum-800 text-white shadow-sm"
                        : "bg-white border border-[#DED7CA] text-[#756B5B] hover:bg-warmgray-50"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vendor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDirectory.map((vendor) => {
                const isShortlisted = eventVendors.some(
                  (ev) => ev.vendor_id === vendor.id
                );

                return (
                  <div
                    key={vendor.id}
                    className="rounded-3xl border border-[#EAE5DC] bg-white overflow-hidden shadow-soft hover:shadow-hover transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Vendor Image */}
                      <div className="relative h-44 w-full bg-warmgray-200">
                        <img
                          src={vendor.image_url}
                          alt={vendor.name}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-plum-950/80 text-white uppercase tracking-wider backdrop-blur-sm">
                          {vendor.category}
                        </span>
                        {vendor.is_sample && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/90 text-plum-900 shadow-sm">
                            Sample Vendor
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif text-base font-bold text-plum-950 leading-tight">
                            {vendor.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-600 shrink-0">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            <span>{vendor.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#756B5B]">
                          <MapPin className="h-3.5 w-3.5 text-coral-500 shrink-0" />
                          <span className="truncate">{vendor.address || vendor.city}</span>
                        </div>

                        <p className="text-xs text-[#756B5B] leading-relaxed line-clamp-2">
                          {vendor.description}
                        </p>

                        {/* Highlights */}
                        <div className="flex flex-wrap gap-1">
                          {vendor.highlights.map((h, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-[#FAF8F4] border border-[#ECE7DE] text-plum-900 px-2 py-0.5 rounded-md font-medium"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA / Price Bar */}
                    <div className="p-5 pt-0 border-t border-[#ECE7DE] mt-4 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-[#756B5B] uppercase font-bold">
                          Starting From
                        </div>
                        <div className="font-serif text-sm font-bold text-plum-950">
                          {vendor.starting_price > 0
                            ? formatINR(vendor.starting_price)
                            : vendor.price_range}
                        </div>
                      </div>

                      {isShortlisted ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-xl border border-green-200">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Shortlisted</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => shortlistVendor(vendor.id)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft transition-all"
                        >
                          + Shortlist
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Shortlisted & Booked Vendors */}
        {activeTab === "shortlist" && (
          <div className="space-y-4">
            <div className="rounded-3xl border border-[#EAE5DC] bg-white p-6 shadow-soft overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#ECE7DE] text-[#756B5B] uppercase font-bold text-[10px] tracking-wider">
                    <th className="py-3 px-3">Vendor</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Quoted Price</th>
                    <th className="py-3 px-3">Deposit Paid</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE7DE]">
                  {eventVendors.map((link) => {
                    const vendor = link.vendor || vendorsDirectory.find((v) => v.id === link.vendor_id);
                    return (
                      <tr key={link.id} className="hover:bg-warmgray-50 transition-colors">
                        <td className="py-3.5 px-3 font-semibold text-plum-950">
                          <div className="font-bold text-xs">{vendor?.name || "Vendor"}</div>
                          <div className="text-[11px] text-[#756B5B]">{vendor?.city}</div>
                        </td>
                        <td className="py-3.5 px-3 capitalize text-[#756B5B]">
                          {vendor?.category}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              link.status === "booked"
                                ? "bg-green-100 text-green-800"
                                : link.status === "quoted"
                                ? "bg-blue-100 text-blue-800"
                                : link.status === "contacted"
                                ? "bg-amber-100 text-amber-800"
                                : link.status === "declined"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-lavender-100 text-plum-800"
                            }`}
                          >
                            {link.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-plum-950">
                          {formatINR(link.quoted_price)}
                        </td>
                        <td className="py-3.5 px-3 font-medium text-green-700">
                          {formatINR(link.deposit_paid)}
                        </td>
                        <td className="py-3.5 px-3 text-[#756B5B]">
                          <div>{vendor?.contact_phone || "—"}</div>
                          <div className="text-[10px]">{vendor?.contact_email}</div>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingLink(link);
                                setQuoteInput(String(link.quoted_price));
                                setDepositInput(String(link.deposit_paid));
                                setStatusInput(link.status);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-[#DED7CA] hover:bg-warmgray-100 font-bold text-[11px] text-plum-900"
                            >
                              Manage
                            </button>
                            <button
                              onClick={() => removeEventVendor(link.id)}
                              className="p-1 rounded text-[#756B5B] hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {eventVendors.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-[#756B5B]">
                        No vendors shortlisted yet. Browse the curated directory and click "+ Shortlist".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Custom Vendor Modal */}
      {addCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#EAE5DC] p-6 shadow-hover space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-3">
              <h3 className="font-serif text-lg font-bold text-plum-950">
                Add Custom Vendor
              </h3>
              <button
                onClick={() => setAddCustomModal(false)}
                className="p-1 rounded text-[#756B5B] hover:bg-warmgray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomVendor} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#5D2962] mb-1">
                  Vendor / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dreamy Florals & Stage Pune"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Category
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm capitalize"
                  >
                    <option value="venue">Venue</option>
                    <option value="catering">Catering</option>
                    <option value="decoration">Decoration</option>
                    <option value="photography">Photography</option>
                    <option value="entertainment">Entertainment / DJ</option>
                    <option value="makeup">Makeup Artist</option>
                    <option value="coordinator">Coordinator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Estimated Quote (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 25000"
                    value={customStartingPrice}
                    onChange={(e) => setCustomStartingPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98220 00000"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D2962] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
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
                  placeholder="Recommended by friend, includes lighting..."
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddCustomModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#756B5B] hover:bg-warmgray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft"
                >
                  Save & Shortlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Status & Quoted Price Modal */}
      {editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-[#EAE5DC] p-6 shadow-hover space-y-4">
            <h3 className="font-serif text-lg font-bold text-plum-950">
              Manage Booking & Quote
            </h3>
            <form onSubmit={handleUpdateStatusSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#5D2962] mb-1">
                  Status
                </label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm capitalize"
                >
                  <option value="shortlisted">Shortlisted</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="booked">Booked (Confirmed)</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5D2962] mb-1">
                  Agreed / Quoted Price (₹)
                </label>
                <input
                  type="number"
                  value={quoteInput}
                  onChange={(e) => setQuoteInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5D2962] mb-1">
                  Deposit Paid (₹)
                </label>
                <input
                  type="number"
                  value={depositInput}
                  onChange={(e) => setDepositInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DED7CA] focus:outline-none focus:ring-2 focus:ring-plum-800 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#756B5B] hover:bg-warmgray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft"
                >
                  Update Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
