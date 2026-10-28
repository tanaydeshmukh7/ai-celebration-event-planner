# CelebrationAI — Modern AI-Powered Celebration & Event Planner

CelebrationAI is a full-stack, AI-driven event-planning platform designed to turn simple ideas (e.g. *"A birthday party for 50 people in Pune with a budget of ₹30,000"*) into complete, actionable master plans.

Built with Next.js (App Router), TypeScript, Tailwind CSS, Supabase PostgreSQL, and Google Gemini AI.

---

## 🌟 Key Features

1. **AI Event Creation Wizard (4-Step)**
   - Captures Event Basics, Budget (INR), Style & Dietary Preferences, and DIY vs. Vendor Intensity.
   - Generates a bespoke celebration master plan via Gemini AI in under 3 seconds.

2. **Command Center Dashboard**
   - Live event countdown timer.
   - Real-time budget vs. committed expenditure with overspending alerts.
   - Task completion progress tracker.
   - Dynamic confirmed guest attendance calculator.
   - Category-wise spending donut chart (Recharts).

3. **Interactive AI Planning Workspace (Co-Pilot)**
   - Natural language interactive assistant with contextual awareness of active event details.
   - Pre-built suggested prompts (*"Reduce my budget by 20%"*, *"Create a vegetarian menu for 100 guests"*, *"Generate a minute-by-minute timeline"*).
   - "Apply Plan to Event" one-click button updating budgets, milestones, and decor themes directly.

4. **INR Budget & Expense Manager**
   - Auto-allocates budgets across 9 Indian event categories (Venue, Catering, Decor, Photography, Entertainment, Invitations, Logistics, Gifts, Contingency).
   - Add, edit, delete expenses; record advance deposits and remaining balances.
   - Visual comparison bar chart (Allocated vs. Spent).
   - AI Cost-Saving analyzer suggesting actionable compromises to save money.

5. **Timeline & Task Checklist**
   - Interactive milestone checklist with priority badges (Low, Medium, High, Urgent).
   - Filter by All, Pending, Completed, and Overdue.
   - Minute-by-minute chronological Event-Day Itinerary.
   - Automated deadline conflict detection.

6. **Vendor Directory & Comparison**
   - Curated directory of realistic vendors across Pune, Mumbai, Bangalore, and Delhi.
   - Side-by-side shortlisting, enquiry tracking, and quoted price management.
   - Add personal / custom vendor contacts.

7. **Guest List & Public RSVP Portal**
   - Manage RSVPs (Accepted, Pending, Declined) with plus-one counts.
   - Dietary requirements tracking (Pure Vegetarian, Non-Veg, Jain, Vegan, Halal).
   - Automatic Catering Requirement Calculator (pax breakdown + 10% safety buffer).
   - Public shareable RSVP page (`/rsvp/[eventId]`) for direct guest responses.
   - Export guest list to CSV.

8. **Inspiration Studio**
   - Curated themes, color harmony swatches, table scapes, and invitation styles.
   - One-click "Apply Palette to Event" and "Set as Event Theme".
   - AI-powered fresh concept generator.

9. **Summary Dossier & Print Export**
   - Clean printable executive event summary (`window.print()`).
   - Export Budget & Expenses to CSV.

---

## 🛠 Tech Stack

- **Framework:** Next.js 14+ (App Router, Server Actions, API Routes)
- **Language:** TypeScript 5.5+
- **Styling:** Tailwind CSS with custom editorial serif & clean sans typography
- **Design Tokens:** Warm off-white (`#FAF8F4`), Deep Plum (`#4C234F`), Coral (`#FF8066`), Soft Lavender (`#EAE3F4`)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS)
- **AI Engine:** Google Gemini AI API (`@google/generative-ai`)
- **Zero-Setup Mode:** Built-in Guest Demo Mode enabling 100% functionality out of the box without requiring external credentials.

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note on Zero-Setup Demo Mode:**
> If `GEMINI_API_KEY` or `NEXT_PUBLIC_SUPABASE_URL` are not provided, the application automatically activates **Demo Mode**. It includes pre-loaded sample data (Aarav's 30th Birthday Bash in Pune with ₹30,000 budget), persistent local storage, and intelligent AI fallback generation with zero crashes.

---

## 🗄️ Supabase Configuration & Migrations

To connect a live Supabase PostgreSQL database:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Run the schema migration from:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
4. Run the seed data script:
   ```
   supabase/seed.sql
   ```
5. In your Supabase Project Settings → **API**, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon / public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`
6. Add them to `.env.local`.

---

## 🤖 Google Gemini AI Configuration

To enable live generative AI responses:

1. Obtain a free API key at [Google AI Studio](https://aistudio.google.com/).
2. Add your key to `.env.local`:
   ```bash
   GEMINI_API_KEY=AIzaSy...
   ```
3. Restart the server. The AI workspace and creation wizard will now make real-time calls to Gemini 1.5 Flash with structured Zod response validation.

---

## 🚢 Deployment to Vercel

1. Push this repository to GitHub or GitLab.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your repository.
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel deployment domain)
5. Click **Deploy**.

---

## 🧪 Testing Checklist

- [x] **Guest Demo Flow:** One-click explore demo on landing page loads active Pune celebration.
- [x] **Wizard Generation:** Multi-step event creation calculates INR budget and builds schedule.
- [x] **Live Calculations:** Adding expenses immediately recalculates remaining budget and committed totals.
- [x] **Task Management:** Completing tasks immediately updates the dashboard progress bar.
- [x] **Vendor Shortlist:** Directory vendors can be shortlisted and quote statuses updated.
- [x] **Public RSVP:** Shareable link accepts guest submissions and updates catering portions in real time.
- [x] **AI Co-Pilot:** Suggested prompts trigger dynamic recalculations and budget adjustments.
- [x] **Export Dossier:** Printable view and CSV downloads function cleanly.
