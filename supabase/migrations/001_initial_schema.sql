-- WorkWings Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE worker_status AS ENUM ('pending', 'active', 'suspended', 'deleted');
CREATE TYPE company_plan AS ENUM ('free', 'starter', 'pro', 'enterprise');
CREATE TYPE shift_status AS ENUM ('draft', 'open', 'filled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn', 'no_show');
CREATE TYPE invoice_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE reviewer_type AS ENUM ('worker', 'company');
CREATE TYPE sender_type AS ENUM ('worker', 'company', 'system');
CREATE TYPE company_member_role AS ENUM ('owner', 'admin', 'manager', 'viewer');
CREATE TYPE sector AS ENUM ('horeca', 'retail', 'logistics', 'events', 'cleaning', 'delivery', 'construction', 'other');

-- ============================================
-- TABLES
-- ============================================

-- Workers
CREATE TABLE workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text UNIQUE NOT NULL,
  email text,
  first_name text NOT NULL,
  last_name text NOT NULL,
  kvk_number text,
  iban text,
  profile_photo_url text,
  bio text,
  sectors sector[] DEFAULT '{}',
  city text,
  lat numeric,
  lng numeric,
  reliability_score numeric DEFAULT 5.0,
  total_shifts int DEFAULT 0,
  total_hours numeric DEFAULT 0,
  rating_avg numeric DEFAULT 0,
  verified_at timestamptz,
  status worker_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Companies
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  kvk_number text UNIQUE NOT NULL,
  logo_url text,
  brand_color text,
  description text,
  sectors sector[] DEFAULT '{}',
  contact_email text NOT NULL,
  contact_phone text,
  stripe_account_id text,
  plan company_plan DEFAULT 'free',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Company team members
CREATE TABLE company_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role company_member_role DEFAULT 'admin',
  invited_at timestamptz DEFAULT now(),
  UNIQUE(company_id, user_id)
);

-- Physical locations
CREATE TABLE locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  parking_info text,
  dress_code text
);

-- Shifts
CREATE TABLE shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  sector sector NOT NULL,
  title text NOT NULL,
  description text,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  rate_per_hour numeric NOT NULL CHECK (rate_per_hour > 0),
  workers_needed int NOT NULL DEFAULT 1 CHECK (workers_needed > 0),
  workers_filled int DEFAULT 0,
  status shift_status DEFAULT 'open',
  requirements text[] DEFAULT '{}',
  auto_accept_flexpool boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Applications
CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  worker_id uuid NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  proposed_rate numeric,
  status application_status DEFAULT 'pending',
  applied_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  rejected_at timestamptz,
  UNIQUE(shift_id, worker_id)
);

-- Check-ins (GPS verified)
CREATE TABLE check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  worker_id uuid NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  checked_in_at timestamptz,
  check_in_lat numeric,
  check_in_lng numeric,
  checked_out_at timestamptz,
  check_out_lat numeric,
  check_out_lng numeric,
  break_minutes int DEFAULT 0,
  total_hours numeric,
  photo_url text,
  UNIQUE(shift_id, worker_id)
);

-- Reviews (bidirectional)
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  reviewer_type reviewer_type NOT NULL,
  reviewer_id uuid NOT NULL,
  reviewed_id uuid NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  categories jsonb DEFAULT '{}',
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(shift_id, reviewer_id)
);

-- Chat messages (per shift)
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  sender_type sender_type NOT NULL,
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Invoices
CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  worker_id uuid NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  fee numeric NOT NULL,
  net_amount numeric NOT NULL,
  pdf_url text,
  status invoice_status DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Payouts
CREATE TABLE payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  method text NOT NULL,
  stripe_transfer_id text,
  status payout_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Flexpool (favorite workers)
CREATE TABLE flexpool (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  worker_id uuid NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  blocked boolean DEFAULT false,
  UNIQUE(company_id, worker_id)
);

-- Notifications
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  user_type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  type text NOT NULL,
  data jsonb DEFAULT '{}',
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_workers_phone ON workers(phone);
CREATE INDEX idx_workers_city ON workers(city);
CREATE INDEX idx_workers_sectors ON workers USING GIN(sectors);
CREATE INDEX idx_workers_status ON workers(status);

CREATE INDEX idx_companies_kvk ON companies(kvk_number);
CREATE INDEX idx_company_members_user ON company_members(user_id);
CREATE INDEX idx_company_members_company ON company_members(company_id);

CREATE INDEX idx_locations_company ON locations(company_id);
CREATE INDEX idx_locations_city ON locations(city);

CREATE INDEX idx_shifts_company ON shifts(company_id);
CREATE INDEX idx_shifts_date ON shifts(date);
CREATE INDEX idx_shifts_status ON shifts(status);
CREATE INDEX idx_shifts_sector ON shifts(sector);
CREATE INDEX idx_shifts_date_status ON shifts(date, status);

CREATE INDEX idx_applications_shift ON applications(shift_id);
CREATE INDEX idx_applications_worker ON applications(worker_id);
CREATE INDEX idx_applications_status ON applications(status);

CREATE INDEX idx_check_ins_shift ON check_ins(shift_id);
CREATE INDEX idx_check_ins_worker ON check_ins(worker_id);

CREATE INDEX idx_reviews_shift ON reviews(shift_id);
CREATE INDEX idx_reviews_reviewed ON reviews(reviewed_id);

CREATE INDEX idx_messages_shift ON messages(shift_id);
CREATE INDEX idx_messages_created ON messages(created_at);

CREATE INDEX idx_invoices_worker ON invoices(worker_id);
CREATE INDEX idx_invoices_company ON invoices(company_id);

CREATE INDEX idx_flexpool_company ON flexpool(company_id);
CREATE INDEX idx_flexpool_worker ON flexpool(worker_id);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE flexpool ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Workers: can read/update own profile
CREATE POLICY "Workers can view own profile" ON workers FOR SELECT USING (id = auth.uid());
CREATE POLICY "Workers can update own profile" ON workers FOR UPDATE USING (id = auth.uid());

-- Companies: members can view their company
CREATE POLICY "Company members can view company" ON companies FOR SELECT
  USING (id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "Company admins can update company" ON companies FOR UPDATE
  USING (id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')));

-- Company members: can view members of own company
CREATE POLICY "View own company members" ON company_members FOR SELECT
  USING (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));

-- Locations: company members can manage
CREATE POLICY "Company members can view locations" ON locations FOR SELECT
  USING (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "Company admins can manage locations" ON locations FOR ALL
  USING (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'manager')));

-- Shifts: public read for open shifts, company manages own
CREATE POLICY "Anyone can view open shifts" ON shifts FOR SELECT USING (status = 'open');
CREATE POLICY "Company members can view own shifts" ON shifts FOR SELECT
  USING (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));
CREATE POLICY "Company can manage own shifts" ON shifts FOR ALL
  USING (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'manager')));

-- Applications: visible to shift owner + applicant
CREATE POLICY "Workers can view own applications" ON applications FOR SELECT USING (worker_id = auth.uid());
CREATE POLICY "Workers can create applications" ON applications FOR INSERT WITH CHECK (worker_id = auth.uid());
CREATE POLICY "Company can view shift applications" ON applications FOR SELECT
  USING (shift_id IN (SELECT id FROM shifts WHERE company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid())));
CREATE POLICY "Company can update applications" ON applications FOR UPDATE
  USING (shift_id IN (SELECT id FROM shifts WHERE company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid())));

-- Check-ins: worker + company can view
CREATE POLICY "Workers can view own check-ins" ON check_ins FOR SELECT USING (worker_id = auth.uid());
CREATE POLICY "Workers can manage own check-ins" ON check_ins FOR ALL USING (worker_id = auth.uid());
CREATE POLICY "Company can view shift check-ins" ON check_ins FOR SELECT
  USING (shift_id IN (SELECT id FROM shifts WHERE company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid())));

-- Reviews: public read (after both parties submit)
CREATE POLICY "Anyone can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- Messages: shift participants only
CREATE POLICY "Shift participants can view messages" ON messages FOR SELECT
  USING (
    shift_id IN (SELECT shift_id FROM applications WHERE worker_id = auth.uid() AND status = 'accepted')
    OR shift_id IN (SELECT id FROM shifts WHERE company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()))
  );
CREATE POLICY "Shift participants can send messages" ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND (
      shift_id IN (SELECT shift_id FROM applications WHERE worker_id = auth.uid() AND status = 'accepted')
      OR shift_id IN (SELECT id FROM shifts WHERE company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()))
    )
  );

-- Invoices: visible to worker + company
CREATE POLICY "Workers can view own invoices" ON invoices FOR SELECT USING (worker_id = auth.uid());
CREATE POLICY "Company can view own invoices" ON invoices FOR SELECT
  USING (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));

-- Payouts: worker only
CREATE POLICY "Workers can view own payouts" ON payouts FOR SELECT USING (worker_id = auth.uid());

-- Flexpool: company only
CREATE POLICY "Company can manage flexpool" ON flexpool FOR ALL
  USING (company_id IN (SELECT company_id FROM company_members WHERE user_id = auth.uid()));

-- Notifications: own only
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- ============================================
-- REALTIME (for chat & live updates)
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE applications;
ALTER PUBLICATION supabase_realtime ADD TABLE shifts;
