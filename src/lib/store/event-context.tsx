"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  EventItem,
  BudgetAllocation,
  ExpenseItem,
  TaskItem,
  VendorItem,
  EventVendorLink,
  GuestItem,
  InspirationItem,
  AIPlanSummary,
  UserProfile,
} from "../types";
import {
  INITIAL_DEMO_EVENT,
  INITIAL_BUDGETS,
  INITIAL_EXPENSES,
  INITIAL_TASKS,
  INITIAL_VENDORS_DIRECTORY,
  INITIAL_EVENT_VENDORS,
  INITIAL_GUESTS,
  INITIAL_INSPIRATION,
  INITIAL_AI_PLAN,
} from "./mock-data";
import { generateUUID } from "../utils";
import { isSupabaseConfigured, createClient } from "../supabase/client";

interface EventContextType {
  // Auth & Mode
  user: UserProfile | null;
  isDemoMode: boolean;
  loginAsGuest: () => void;
  logout: () => void;
  setUser: (user: UserProfile | null) => void;

  // Active Event
  activeEvent: EventItem;
  eventsList: EventItem[];
  setActiveEventId: (id: string) => void;
  createEvent: (newEvent: Omit<EventItem, "id" | "user_id" | "created_at" | "updated_at">) => EventItem;
  updateEvent: (updated: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;

  // Budget & Expenses
  budgets: BudgetAllocation[];
  expenses: ExpenseItem[];
  setBudgets: (budgets: BudgetAllocation[]) => void;
  addExpense: (expense: Omit<ExpenseItem, "id" | "event_id" | "created_at">) => void;
  updateExpense: (id: string, updated: Partial<ExpenseItem>) => void;
  deleteExpense: (id: string) => void;
  totalBudget: number;
  totalEstimatedSpending: number;
  totalActualSpending: number;
  totalPaid: number;
  remainingBudget: number;

  // Tasks
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, "id" | "event_id" | "created_at">) => void;
  updateTask: (id: string, updated: Partial<TaskItem>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  completedTasksCount: number;
  pendingTasksCount: number;

  // Vendors
  vendorsDirectory: VendorItem[];
  eventVendors: EventVendorLink[];
  shortlistVendor: (vendorId: string) => void;
  removeEventVendor: (linkId: string) => void;
  updateVendorStatus: (linkId: string, status: EventVendorLink["status"], quote?: number, deposit?: number) => void;
  addCustomVendor: (vendor: Omit<VendorItem, "id" | "is_sample">) => void;

  // Guests
  guests: GuestItem[];
  addGuest: (guest: Omit<GuestItem, "id" | "event_id" | "created_at">) => void;
  updateGuest: (id: string, updated: Partial<GuestItem>) => void;
  deleteGuest: (id: string) => void;
  confirmedGuestsCount: number;
  confirmedAttendingCount: number; // includes plus ones

  // Inspiration
  inspirationItems: InspirationItem[];
  toggleSaveInspiration: (id: string) => void;
  addInspirationItem: (item: Omit<InspirationItem, "id">) => void;

  // AI Plan
  currentAIPlan: AIPlanSummary;
  setAIPlan: (plan: AIPlanSummary) => void;
  applyAIPlanToEvent: (plan: AIPlanSummary) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "celebration_planner_state_v1";

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // User state
  const [user, setUser] = useState<UserProfile | null>({
    id: "demo-user-1",
    full_name: "Aarav Sharma",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    city: "Pune",
  });
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Core Event Data States
  const [eventsList, setEventsList] = useState<EventItem[]>([INITIAL_DEMO_EVENT]);
  const [activeEventId, setActiveEventId] = useState<string>(INITIAL_DEMO_EVENT.id);
  const [budgets, setBudgetsState] = useState<BudgetAllocation[]>(INITIAL_BUDGETS);
  const [expenses, setExpensesState] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [tasks, setTasksState] = useState<TaskItem[]>(INITIAL_TASKS);
  const [vendorsDirectory, setVendorsDirectory] = useState<VendorItem[]>(INITIAL_VENDORS_DIRECTORY);
  const [eventVendors, setEventVendors] = useState<EventVendorLink[]>(INITIAL_EVENT_VENDORS);
  const [guests, setGuestsState] = useState<GuestItem[]>(INITIAL_GUESTS);
  const [inspirationItems, setInspirationItems] = useState<InspirationItem[]>(INITIAL_INSPIRATION);
  const [currentAIPlan, setAIPlanState] = useState<AIPlanSummary>(INITIAL_AI_PLAN);

  // Load saved state from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.eventsList?.length) setEventsList(parsed.eventsList);
        if (parsed.activeEventId) setActiveEventId(parsed.activeEventId);
        if (parsed.budgets) setBudgetsState(parsed.budgets);
        if (parsed.expenses) setExpensesState(parsed.expenses);
        if (parsed.tasks) setTasksState(parsed.tasks);
        if (parsed.eventVendors) setEventVendors(parsed.eventVendors);
        if (parsed.guests) setGuestsState(parsed.guests);
        if (parsed.currentAIPlan) setAIPlanState(parsed.currentAIPlan);
        if (parsed.inspirationItems) setInspirationItems(parsed.inspirationItems);
        if (parsed.user) setUser(parsed.user);
      }
    } catch (e) {
      console.warn("Failed to load local storage state:", e);
    }
    setMounted(true);
  }, []);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    if (!mounted) return;
    try {
      const stateToSave = {
        eventsList,
        activeEventId,
        budgets,
        expenses,
        tasks,
        eventVendors,
        guests,
        currentAIPlan,
        inspirationItems,
        user,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn("Failed to persist state:", e);
    }
  }, [
    mounted,
    eventsList,
    activeEventId,
    budgets,
    expenses,
    tasks,
    eventVendors,
    guests,
    currentAIPlan,
    inspirationItems,
    user,
  ]);

  const activeEvent =
    eventsList.find((e) => e.id === activeEventId) || eventsList[0] || INITIAL_DEMO_EVENT;

  // Active event-filtered items
  const activeBudgets = budgets.filter((b) => b.event_id === activeEvent.id);
  const activeExpenses = expenses.filter((e) => e.event_id === activeEvent.id);
  const activeTasks = tasks.filter((t) => t.event_id === activeEvent.id);
  const activeEventVendors = eventVendors.filter((v) => v.event_id === activeEvent.id);
  const activeGuests = guests.filter((g) => g.event_id === activeEvent.id);

  // Financial calculations
  const totalBudget = activeEvent.total_budget || 0;
  const totalEstimatedSpending = activeExpenses.reduce((sum, item) => sum + (Number(item.estimated_amount) || 0), 0);
  const totalActualSpending = activeExpenses.reduce((sum, item) => sum + (Number(item.actual_amount) || Number(item.estimated_amount) || 0), 0);
  const totalPaid = activeExpenses.reduce((sum, item) => sum + (Number(item.paid_amount) || 0), 0);
  const remainingBudget = totalBudget - totalActualSpending;

  // Task metrics
  const completedTasksCount = activeTasks.filter((t) => t.status === "completed").length;
  const pendingTasksCount = activeTasks.filter((t) => t.status !== "completed").length;

  // Guest metrics
  const confirmedGuestsCount = activeGuests.filter((g) => g.rsvp_status === "accepted").length;
  const confirmedAttendingCount = activeGuests
    .filter((g) => g.rsvp_status === "accepted")
    .reduce((sum, g) => sum + 1 + (Number(g.plus_ones) || 0), 0);

  // Authentication Helpers
  const loginAsGuest = () => {
    setUser({
      id: "demo-guest-" + Date.now(),
      full_name: "Demo Celebrator",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      city: "Pune",
    });
    setIsDemoMode(true);
  };

  const logout = () => {
    setUser(null);
  };

  // Event CRUD
  const createEvent = (data: Omit<EventItem, "id" | "user_id" | "created_at" | "updated_at">): EventItem => {
    const newId = "evt-" + generateUUID().slice(0, 8);
    const newEvent: EventItem = {
      ...data,
      id: newId,
      user_id: user?.id || "demo-user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setEventsList((prev) => [newEvent, ...prev]);
    setActiveEventId(newId);
    return newEvent;
  };

  const updateEvent = (updated: Partial<EventItem>) => {
    setEventsList((prev) =>
      prev.map((evt) =>
        evt.id === activeEvent.id
          ? { ...evt, ...updated, updated_at: new Date().toISOString() }
          : evt
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEventsList((prev) => {
      const filtered = prev.filter((e) => e.id !== id);
      if (activeEventId === id && filtered.length > 0) {
        setActiveEventId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Expenses CRUD
  const addExpense = (item: Omit<ExpenseItem, "id" | "event_id" | "created_at">) => {
    const newExp: ExpenseItem = {
      ...item,
      id: "exp-" + generateUUID().slice(0, 8),
      event_id: activeEvent.id,
      created_at: new Date().toISOString(),
    };
    setExpensesState((prev) => [newExp, ...prev]);
  };

  const updateExpense = (id: string, updated: Partial<ExpenseItem>) => {
    setExpensesState((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, ...updated, updated_at: new Date().toISOString() } : exp))
    );
  };

  const deleteExpense = (id: string) => {
    setExpensesState((prev) => prev.filter((exp) => exp.id !== id));
  };

  const setBudgets = (newBudgets: BudgetAllocation[]) => {
    const withEventId = newBudgets.map((b) => ({ ...b, event_id: activeEvent.id }));
    setBudgetsState((prev) => [
      ...prev.filter((b) => b.event_id !== activeEvent.id),
      ...withEventId,
    ]);
  };

  // Tasks CRUD
  const addTask = (item: Omit<TaskItem, "id" | "event_id" | "created_at">) => {
    const newTask: TaskItem = {
      ...item,
      id: "tsk-" + generateUUID().slice(0, 8),
      event_id: activeEvent.id,
      created_at: new Date().toISOString(),
    };
    setTasksState((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updated: Partial<TaskItem>) => {
    setTasksState((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated, updated_at: new Date().toISOString() } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasksState((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasksState((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === "completed" ? "pending" : "completed";
          return { ...t, status: nextStatus, updated_at: new Date().toISOString() };
        }
        return t;
      })
    );
  };

  // Vendors CRUD
  const shortlistVendor = (vendorId: string) => {
    const exists = eventVendors.some(
      (ev) => ev.event_id === activeEvent.id && ev.vendor_id === vendorId
    );
    if (exists) return;

    const vendor = vendorsDirectory.find((v) => v.id === vendorId);
    const newLink: EventVendorLink = {
      id: "evl-" + generateUUID().slice(0, 8),
      event_id: activeEvent.id,
      vendor_id: vendorId,
      vendor: vendor,
      status: "shortlisted",
      quoted_price: vendor?.starting_price || 0,
      negotiated_price: vendor?.starting_price || 0,
      deposit_paid: 0,
      created_at: new Date().toISOString(),
    };
    setEventVendors((prev) => [newLink, ...prev]);
  };

  const removeEventVendor = (linkId: string) => {
    setEventVendors((prev) => prev.filter((ev) => ev.id !== linkId));
  };

  const updateVendorStatus = (
    linkId: string,
    status: EventVendorLink["status"],
    quote?: number,
    deposit?: number
  ) => {
    setEventVendors((prev) =>
      prev.map((ev) => {
        if (ev.id === linkId) {
          return {
            ...ev,
            status,
            quoted_price: quote !== undefined ? quote : ev.quoted_price,
            negotiated_price: quote !== undefined ? quote : ev.negotiated_price,
            deposit_paid: deposit !== undefined ? deposit : ev.deposit_paid,
          };
        }
        return ev;
      })
    );
  };

  const addCustomVendor = (vendor: Omit<VendorItem, "id" | "is_sample">) => {
    const newVendor: VendorItem = {
      ...vendor,
      id: "vnd-" + generateUUID().slice(0, 8),
      is_sample: false,
    };
    setVendorsDirectory((prev) => [newVendor, ...prev]);
    shortlistVendor(newVendor.id);
  };

  // Guests CRUD
  const addGuest = (guest: Omit<GuestItem, "id" | "event_id" | "created_at">) => {
    const newGuest: GuestItem = {
      ...guest,
      id: "gst-" + generateUUID().slice(0, 8),
      event_id: activeEvent.id,
      created_at: new Date().toISOString(),
    };
    setGuestsState((prev) => [newGuest, ...prev]);
  };

  const updateGuest = (id: string, updated: Partial<GuestItem>) => {
    setGuestsState((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updated } : g))
    );
  };

  const deleteGuest = (id: string) => {
    setGuestsState((prev) => prev.filter((g) => g.id !== id));
  };

  // Inspiration
  const toggleSaveInspiration = (id: string) => {
    setInspirationItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_saved: !item.is_saved } : item
      )
    );
  };

  const addInspirationItem = (item: Omit<InspirationItem, "id">) => {
    const newItem: InspirationItem = {
      ...item,
      id: "insp-" + generateUUID().slice(0, 8),
      event_id: activeEvent.id,
    };
    setInspirationItems((prev) => [newItem, ...prev]);
  };

  // AI Plan Actions
  const setAIPlan = (plan: AIPlanSummary) => {
    setAIPlanState(plan);
  };

  const applyAIPlanToEvent = (plan: AIPlanSummary) => {
    setAIPlanState(plan);

    // 1. Update event theme and color palette
    updateEvent({
      theme: plan.recommendedTheme,
      color_palette: plan.colorPalette,
    });

    // 2. Generate and apply budgets
    const newBudgets: BudgetAllocation[] = plan.budgetStrategy.map((strat) => ({
      id: generateUUID(),
      event_id: activeEvent.id,
      category: strat.category,
      allocated_amount: strat.amount,
      percentage: strat.percentage,
    }));
    setBudgets(newBudgets);

    // 3. Populate new milestone tasks if active tasks are sparse
    const newTasks: TaskItem[] = plan.keyMilestones.map((m, idx) => ({
      id: "tsk-" + generateUUID().slice(0, 8),
      event_id: activeEvent.id,
      title: m.title,
      description: `Target timeframe: ${m.timeline}`,
      category: "Milestone",
      priority: m.priority,
      status: "pending",
      is_event_day: false,
      order_index: idx + 1,
      created_at: new Date().toISOString(),
    }));

    // Add event day schedule as tasks
    plan.eventDaySchedule.forEach((sched, idx) => {
      newTasks.push({
        id: "tsk-day-" + generateUUID().slice(0, 8),
        event_id: activeEvent.id,
        title: `${sched.time}: ${sched.activity}`,
        description: `Lead: ${sched.responsibility}`,
        category: "Schedule",
        priority: "high",
        status: "pending",
        due_time: sched.time.split("-")[0]?.trim(),
        is_event_day: true,
        order_index: 20 + idx,
        created_at: new Date().toISOString(),
      });
    });

    setTasksState((prev) => [...newTasks, ...prev.filter((t) => t.event_id !== activeEvent.id)]);
  };

  return (
    <EventContext.Provider
      value={{
        user,
        isDemoMode,
        loginAsGuest,
        logout,
        setUser,

        activeEvent,
        eventsList,
        setActiveEventId,
        createEvent,
        updateEvent,
        deleteEvent,

        budgets: activeBudgets,
        expenses: activeExpenses,
        setBudgets,
        addExpense,
        updateExpense,
        deleteExpense,
        totalBudget,
        totalEstimatedSpending,
        totalActualSpending,
        totalPaid,
        remainingBudget,

        tasks: activeTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        completedTasksCount,
        pendingTasksCount,

        vendorsDirectory,
        eventVendors: activeEventVendors,
        shortlistVendor,
        removeEventVendor,
        updateVendorStatus,
        addCustomVendor,

        guests: activeGuests,
        addGuest,
        updateGuest,
        deleteGuest,
        confirmedGuestsCount,
        confirmedAttendingCount,

        inspirationItems,
        toggleSaveInspiration,
        addInspirationItem,

        currentAIPlan,
        setAIPlan,
        applyAIPlanToEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEventContext() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return context;
}
