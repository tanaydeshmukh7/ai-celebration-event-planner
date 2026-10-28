import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Indian Rupee (INR) currency: e.g. ₹1,50,000
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "₹0";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Compact Indian currency formatting: e.g. ₹1.5 L, ₹25 K
 */
export function formatINRCompact(amount: number): string {
  if (isNaN(amount)) return "₹0";
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)} K`;
  }
  return `₹${amount}`;
}

/**
 * Format a date string into readable format: e.g. 15 Nov, 2026
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return "Date not set";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Calculate days remaining until target date
 */
export function daysUntil(dateString?: string): { days: number; isPast: boolean } {
  if (!dateString) return { days: 0, isPast: false };
  const target = new Date(dateString);
  const now = new Date();
  // Strip time for clean day comparison
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return {
    days: Math.abs(diffDays),
    isPast: diffDays < 0,
  };
}

/**
 * Generate a random UUID-like string for client-side demo objects
 */
export function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Trigger browser download of CSV string
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
