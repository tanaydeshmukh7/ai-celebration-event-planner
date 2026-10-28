export type EventCategory =
  | 'wedding'
  | 'birthday'
  | 'anniversary'
  | 'corporate'
  | 'college'
  | 'community'
  | 'other';

export type BudgetFlexibility = 'strict' | 'flexible' | 'open';
export type Formality = 'Casual' | 'Semi-formal' | 'Formal' | 'Black Tie';
export type FoodPreference = 'Vegetarian' | 'Mixed' | 'Pure Veg / Jain' | 'Vegan' | 'Non-Vegetarian';
export type PlanningIntensity = 'Relaxed' | 'Moderate' | 'Detail-oriented';
export type DIYPreference = 'Full DIY' | 'Balanced' | 'Full Professional';
export type EventStatus = 'planning' | 'active' | 'completed' | 'cancelled';

export type BudgetCategory =
  | 'venue'
  | 'catering'
  | 'decoration'
  | 'photography'
  | 'entertainment'
  | 'invitations'
  | 'transportation'
  | 'gifts'
  | 'miscellaneous';

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  city?: string;
  phone?: string;
  created_at?: string;
}

export interface EventItem {
  id: string;
  user_id: string;
  title: string;
  category: EventCategory;
  event_date: string; // YYYY-MM-DD
  start_time?: string; // HH:mm
  end_time?: string; // HH:mm
  city: string;
  venue_name?: string;
  venue_address?: string;
  is_outdoor: boolean;
  expected_guests: number;
  total_budget: number;
  budget_flexibility: BudgetFlexibility;
  priority_categories: BudgetCategory[];
  theme?: string;
  color_palette: string[];
  formality: Formality;
  food_preference: FoodPreference;
  cultural_requirements?: string;
  planning_intensity: PlanningIntensity;
  diy_preference: DIYPreference;
  must_have_features: string[];
  notes?: string;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface BudgetAllocation {
  id: string;
  event_id: string;
  category: BudgetCategory;
  allocated_amount: number;
  percentage: number;
  created_at?: string;
}

export interface ExpenseItem {
  id: string;
  event_id: string;
  category: BudgetCategory;
  title: string;
  estimated_amount: number;
  actual_amount: number;
  paid_amount: number;
  payment_status: 'pending' | 'partial' | 'paid';
  vendor_id?: string;
  due_date?: string;
  paid_date?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface TaskItem {
  id: string;
  event_id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  due_date?: string;
  due_time?: string;
  is_event_day: boolean;
  order_index: number;
  created_at: string;
  updated_at?: string;
}

export interface VendorItem {
  id: string;
  user_id?: string | null;
  name: string;
  category:
    | 'venue'
    | 'catering'
    | 'decoration'
    | 'photography'
    | 'entertainment'
    | 'florist'
    | 'makeup'
    | 'coordinator';
  city: string;
  price_range: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  starting_price: number;
  rating: number;
  review_count: number;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  website?: string;
  image_url: string;
  description: string;
  highlights: string[];
  is_sample: boolean;
}

export interface EventVendorLink {
  id: string;
  event_id: string;
  vendor_id: string;
  vendor?: VendorItem;
  status: 'shortlisted' | 'contacted' | 'quoted' | 'booked' | 'declined';
  quoted_price: number;
  negotiated_price: number;
  deposit_paid: number;
  notes?: string;
  created_at: string;
}

export interface GuestItem {
  id: string;
  event_id: string;
  name: string;
  email?: string;
  phone?: string;
  category: 'Family' | 'Close Friends' | 'Work' | 'VIP' | 'Relatives' | 'Other';
  rsvp_status: 'pending' | 'accepted' | 'declined';
  plus_ones: number;
  dietary_preference: 'Vegetarian' | 'Non-Vegetarian' | 'Pure Veg / Jain' | 'Vegan' | 'Gluten-Free' | 'Halal';
  table_number?: string;
  notes?: string;
  created_at: string;
}

export interface InspirationItem {
  id: string;
  event_id?: string;
  user_id?: string;
  title: string;
  category: 'theme' | 'decoration' | 'palette' | 'invitation' | 'table_setting' | 'dress_code' | 'food';
  description: string;
  color_codes: string[];
  image_url: string;
  tags: string[];
  is_saved: boolean;
}

export interface AIPlanSummary {
  overview: string;
  recommendedTheme: string;
  colorPalette: string[];
  budgetStrategy: {
    category: BudgetCategory;
    percentage: number;
    amount: number;
    tips: string;
  }[];
  keyMilestones: {
    title: string;
    timeline: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }[];
  eventDaySchedule: {
    time: string;
    activity: string;
    responsibility: string;
  }[];
  cateringRecommendation: {
    style: string;
    estimatedCostPerPlate: number;
    recommendedMenu: string[];
  };
  decorAndThemeIdeas: string[];
  costSavingOpportunities: string[];
}
