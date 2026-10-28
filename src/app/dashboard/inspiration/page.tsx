"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useEventContext } from "@/lib/store/event-context";
import { InspirationItem } from "@/lib/types";
import {
  Palette,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Check,
  Plus,
  Layers,
  Heart,
  Tag,
  X,
} from "lucide-react";

const CATEGORY_TABS = [
  { id: "all", label: "All Inspirations" },
  { id: "theme", label: "Themes" },
  { id: "decoration", label: "Decor & Floral" },
  { id: "palette", label: "Color Palettes" },
  { id: "table_setting", label: "Table Settings" },
  { id: "food", label: "Food Display" },
  { id: "invitation", label: "Invitations" },
];

export default function InspirationStudioPage() {
  const {
    inspirationItems,
    toggleSaveInspiration,
    addInspirationItem,
    updateEvent,
    activeEvent,
  } = useEventContext();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);
  const [generatingAI, setGeneratingAI] = useState(false);

  const filteredItems =
    selectedCategory === "all"
      ? inspirationItems
      : inspirationItems.filter((item) => item.category === selectedCategory);

  const handleApplyPaletteToEvent = (colors: string[]) => {
    updateEvent({ color_palette: colors });
    setAppliedNotification("Color palette applied to your active event!");
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  const handleApplyThemeToEvent = (themeTitle: string, colors: string[]) => {
    updateEvent({ theme: themeTitle, color_palette: colors });
    setAppliedNotification(`"${themeTitle}" applied as your active event theme!`);
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  const handleGenerateAIInspiration = async () => {
    setGeneratingAI(true);
    try {
      // Simulate/call AI generation
      setTimeout(() => {
        addInspirationItem({
          title: "Golden Hour Terrace & Edison Glow",
          category: "theme",
          description:
            "Golden amber string lighting with olive eucalyptus leaf table runners, rattan wicker armchairs, and acoustic live guitar corner.",
          color_codes: ["#E5A93C", "#4A6B53", "#4C234F", "#FAF8F4"],
          image_url:
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
          tags: ["Edison", "Acoustic", "Golden Hour"],
          is_saved: true,
        });
        setGeneratingAI(false);
      }, 900);
    } catch (e) {
      setGeneratingAI(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-plum-950">
              Inspiration Studio
            </h1>
            <p className="text-xs text-[#756B5B] mt-0.5">
              Explore curated decor concepts, color swatches, table scapes, and dress codes.
            </p>
          </div>

          <button
            onClick={handleGenerateAIInspiration}
            disabled={generatingAI}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-plum-800 hover:bg-plum-900 shadow-soft transition-all"
          >
            <Sparkles className="h-4 w-4 text-coral-400" />
            <span>{generatingAI ? "Dreaming up themes..." : "AI Generate Fresh Concept"}</span>
          </button>
        </div>

        {appliedNotification && (
          <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <Check className="h-4 w-4" />
            <span>{appliedNotification}</span>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-[#ECE7DE]">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === tab.id
                  ? "bg-plum-800 text-white shadow-sm"
                  : "bg-white border border-[#DED7CA] text-[#756B5B] hover:bg-warmgray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Inspiration Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-[#EAE5DC] bg-white overflow-hidden shadow-soft hover:shadow-hover transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Visual */}
                <div className="relative h-48 w-full bg-warmgray-200 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-plum-950/80 text-white uppercase tracking-wider backdrop-blur-sm">
                    {item.category.replace("_", " ")}
                  </span>
                  <button
                    onClick={() => toggleSaveInspiration(item.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-xl bg-white/90 text-plum-900 shadow-sm hover:scale-110 transition-transform"
                    aria-label="Save idea"
                  >
                    {item.is_saved ? (
                      <BookmarkCheck className="h-4 w-4 text-coral-600 fill-coral-600" />
                    ) : (
                      <Bookmark className="h-4 w-4 text-[#756B5B]" />
                    )}
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-serif text-base font-bold text-plum-950">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#756B5B] leading-relaxed">
                    {item.description}
                  </p>

                  {/* Color Palette Swatches */}
                  {item.color_codes?.length > 0 && (
                    <div className="pt-1">
                      <div className="text-[10px] uppercase font-bold text-[#998E7D] mb-1.5">
                        Color Swatches
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.color_codes.map((code, idx) => (
                          <div
                            key={idx}
                            title={code}
                            className="h-6 w-6 rounded-lg border border-[#DED7CA] shadow-xs cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: code }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-[#FAF8F4] border border-[#ECE7DE] text-[#756B5B] px-2 py-0.5 rounded-md font-medium"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 pt-0 border-t border-[#ECE7DE] mt-4 flex items-center justify-between">
                {item.category === "palette" ? (
                  <button
                    onClick={() => handleApplyPaletteToEvent(item.color_codes)}
                    className="w-full py-2 rounded-xl text-xs font-bold text-plum-900 bg-lavender-200 hover:bg-lavender-300 border border-lavender-300 transition-all text-center"
                  >
                    Apply Palette to Event
                  </button>
                ) : (
                  <button
                    onClick={() => handleApplyThemeToEvent(item.title, item.color_codes)}
                    className="w-full py-2 rounded-xl text-xs font-bold text-plum-900 bg-lavender-200 hover:bg-lavender-300 border border-lavender-300 transition-all text-center"
                  >
                    Set as Event Theme
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
