-- ==============================================================================
-- AI Celebration & Event Planner: Initial Schema & Row Level Security
-- ==============================================================================

-- 1. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  city TEXT DEFAULT 'Pune',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('wedding', 'birthday', 'anniversary', 'corporate', 'college', 'community', 'other')),
  event_date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  city TEXT NOT NULL,
  venue_name TEXT,
  venue_address TEXT,
  is_outdoor BOOLEAN DEFAULT false,
  expected_guests INTEGER NOT NULL DEFAULT 50 CHECK (expected_guests > 0),
  total_budget NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_budget >= 0),
  budget_flexibility TEXT DEFAULT 'flexible' CHECK (budget_flexibility IN ('strict', 'flexible', 'open')),
  priority_categories TEXT[] DEFAULT ARRAY['venue', 'catering', 'decoration', 'photography'],
  theme TEXT,
  color_palette TEXT[] DEFAULT ARRAY['#4C234F', '#FF8066', '#EAE3F4'],
  formality TEXT DEFAULT 'Semi-formal' CHECK (formality IN ('Casual', 'Semi-formal', 'Formal', 'Black Tie')),
  food_preference TEXT DEFAULT 'Mixed' CHECK (food_preference IN ('Vegetarian', 'Mixed', 'Pure Veg / Jain', 'Vegan', 'Non-Vegetarian')),
  cultural_requirements TEXT,
  planning_intensity TEXT DEFAULT 'Moderate' CHECK (planning_intensity IN ('Relaxed', 'Moderate', 'Detail-oriented')),
  diy_preference TEXT DEFAULT 'Balanced' CHECK (diy_preference IN ('Full DIY', 'Balanced', 'Full Professional')),
  must_have_features TEXT[] DEFAULT '{}',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Budgets Table (Category Allocations)
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('venue', 'catering', 'decoration', 'photography', 'entertainment', 'invitations', 'transportation', 'gifts', 'miscellaneous')),
  allocated_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (allocated_amount >= 0),
  percentage NUMERIC(5, 2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_event_category UNIQUE (event_id, category)
);

-- 4. Expenses Table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  estimated_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  actual_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid')),
  vendor_id UUID,
  due_date DATE,
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date DATE,
  due_time TEXT,
  is_event_day BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Vendors Table (Directory of vetted/sample vendors)
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- NULL means public/system directory
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('venue', 'catering', 'decoration', 'photography', 'entertainment', 'florist', 'makeup', 'coordinator')),
  city TEXT NOT NULL,
  price_range TEXT NOT NULL DEFAULT '₹₹' CHECK (price_range IN ('₹', '₹₹', '₹₹₹', '₹₹₹₹')),
  starting_price NUMERIC(12, 2) DEFAULT 0,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 4.8 CHECK (rating >= 1.0 AND rating <= 5.0),
  review_count INTEGER NOT NULL DEFAULT 0,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  website TEXT,
  image_url TEXT,
  description TEXT,
  highlights TEXT[] DEFAULT '{}',
  is_sample BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Event Vendors Table (Shortlisted or Booked Vendors per Event)
CREATE TABLE IF NOT EXISTS public.event_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'shortlisted' CHECK (status IN ('shortlisted', 'contacted', 'quoted', 'booked', 'declined')),
  quoted_price NUMERIC(12, 2) DEFAULT 0,
  negotiated_price NUMERIC(12, 2) DEFAULT 0,
  deposit_paid NUMERIC(12, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_event_vendor UNIQUE (event_id, vendor_id)
);

-- 8. Guests Table
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  category TEXT NOT NULL DEFAULT 'Family' CHECK (category IN ('Family', 'Close Friends', 'Work', 'VIP', 'Relatives', 'Other')),
  rsvp_status TEXT NOT NULL DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'accepted', 'declined')),
  plus_ones INTEGER NOT NULL DEFAULT 0 CHECK (plus_ones >= 0),
  dietary_preference TEXT NOT NULL DEFAULT 'Vegetarian' CHECK (dietary_preference IN ('Vegetarian', 'Non-Vegetarian', 'Pure Veg / Jain', 'Vegan', 'Gluten-Free', 'Halal')),
  table_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Inspiration Items Table
CREATE TABLE IF NOT EXISTS public.inspiration_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('theme', 'decoration', 'palette', 'invitation', 'table_setting', 'dress_code', 'food')),
  description TEXT,
  color_codes TEXT[] DEFAULT '{}',
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_saved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. AI Plans Table (Snapshots and AI generations)
CREATE TABLE IF NOT EXISTS public.ai_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  prompt_used TEXT,
  plan_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- Indexes for Performance
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_event_id ON public.budgets(event_id);
CREATE INDEX IF NOT EXISTS idx_expenses_event_id ON public.expenses(event_id);
CREATE INDEX IF NOT EXISTS idx_tasks_event_id ON public.tasks(event_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_event_vendors_event_id ON public.event_vendors(event_id);
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON public.guests(event_id);
CREATE INDEX IF NOT EXISTS idx_inspiration_event_id ON public.inspiration_items(event_id);
CREATE INDEX IF NOT EXISTS idx_ai_plans_event_id ON public.ai_plans(event_id);

-- ==============================================================================
-- Row Level Security (RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspiration_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_plans ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update only their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Events: Users can CRUD only their own events
CREATE POLICY "Users can view own events"
  ON public.events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON public.events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON public.events FOR DELETE
  USING (auth.uid() = user_id);

-- Budgets: Accessible only if user owns the parent event
CREATE POLICY "Users can view budgets of own events"
  ON public.budgets FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = budgets.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can manage budgets of own events"
  ON public.budgets FOR ALL
  USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = budgets.event_id AND events.user_id = auth.uid()));

-- Expenses: Accessible only if user owns the parent event
CREATE POLICY "Users can view expenses of own events"
  ON public.expenses FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = expenses.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can manage expenses of own events"
  ON public.expenses FOR ALL
  USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = expenses.event_id AND events.user_id = auth.uid()));

-- Tasks: Accessible only if user owns the parent event
CREATE POLICY "Users can view tasks of own events"
  ON public.tasks FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = tasks.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can manage tasks of own events"
  ON public.tasks FOR ALL
  USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = tasks.event_id AND events.user_id = auth.uid()));

-- Vendors: Everyone can view public/sample vendors; users can view their custom added vendors
CREATE POLICY "Anyone can view sample or self-created vendors"
  ON public.vendors FOR SELECT
  USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Users can create custom vendors"
  ON public.vendors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own custom vendors"
  ON public.vendors FOR UPDATE
  USING (auth.uid() = user_id);

-- Event Vendors: Accessible only if user owns the parent event
CREATE POLICY "Users can view event_vendors of own events"
  ON public.event_vendors FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = event_vendors.event_id AND events.user_id = auth.uid()));

CREATE POLICY "Users can manage event_vendors of own events"
  ON public.event_vendors FOR ALL
  USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = event_vendors.event_id AND events.user_id = auth.uid()));

-- Guests: Accessible only if user owns the parent event (plus public insert for RSVP if link is provided)
CREATE POLICY "Users can view and manage guests of own events"
  ON public.guests FOR ALL
  USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = guests.event_id AND events.user_id = auth.uid()));

-- Inspiration items: Accessible to owner or public inspiration
CREATE POLICY "Users can view and manage own inspiration"
  ON public.inspiration_items FOR ALL
  USING (user_id IS NULL OR user_id = auth.uid());

-- AI Plans: Accessible only if user owns the parent event
CREATE POLICY "Users can view and manage ai_plans of own events"
  ON public.ai_plans FOR ALL
  USING (EXISTS (SELECT 1 FROM public.events WHERE events.id = ai_plans.event_id AND events.user_id = auth.uid()));

-- Trigger to create profile when auth.user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
