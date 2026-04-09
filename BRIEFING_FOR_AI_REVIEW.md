# WorkWings.nl — Complete Platform Briefing
**Date:** April 9, 2026
**Author:** Claude (AI) + Samba Jarju
**Purpose:** Handover document for AI assistants to understand what's built, what's missing, and what needs improvement.

---

## 1. WHAT IS WORKWINGS

WorkWings is a Dutch freelance shift platform for hospitality, retail, logistics, and events. It connects companies needing temporary workers with freelancers (ZZP'ers). Competitors: **Temper** (€4.90/hr fee, 100K+ freelancers) and **YoungOnes** (younger demographic).

**Business model:**
- Service fee: €3.50/hr charged to company (Temper charges €4.90)
- Fast payout fee: €0.75/hr (workers can get paid in 5 days instead of waiting for company payment)
- Premium company features (planned): €49-199/month

**Three interfaces:**
1. **Marketing site** (`/` for freelancers, `/zakelijk` for companies) — landing pages
2. **Worker PWA** (`/shifts`, `/dashboard`, `/profile`, `/mijn-shifts`, `/chat`) — mobile-first
3. **Company admin** (`/admin/*`) — Stripe-like light dashboard
4. **Master admin** (`/master`) — platform-wide overview for Samba

---

## 2. TECH STACK

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Frontend | React 19, TypeScript 5+, Tailwind CSS 4 |
| UI Components | shadcn/ui (planned), Lucide React icons |
| Animations | Framer Motion 12+ |
| Database | Supabase (PostgreSQL with RLS) |
| Auth | Supabase Auth (Google OAuth + Email/Password) |
| Payments OUT | Revolut Business API (SEPA payouts to workers) — LIVE, TESTED with real €5 |
| Payments IN | Revolut Merchant API (iDEAL for companies) — keys stored, not yet integrated |
| Invoice PDFs | @react-pdf/renderer |
| Deployment | Vercel (auto-deploy on push to main) |
| Repo | github.com/sambajarju2-png/workwings |

**Brand colors:** Navy #023047, Pink #EF476F, Teal #A7DADC, White

---

## 3. DATABASE SCHEMA (Supabase — 17 tables, all RLS-enabled)

### Core tables:
- `workers` — id (uuid=auth.uid), email, first_name, last_name, phone, iban, city, sectors[], btw_number, kvk_number, payout_preference (fast/normal), shifts_without_btw, btw_restricted, rating_avg, total_shifts
- `companies` — id, name, kvk_number, logo_url, header_image_url, description, address, city, postal_code, sectors[], contact_email, brand_color, status
- `company_members` — links auth users to companies (user_id → company_id, role)
- `locations` — company locations with address, city, dress_code, parking_info
- `shifts` — company_id, location_id, title, sector, date, start_time, end_time, rate_per_hour, workers_needed, workers_filled, status, description, requirements[]
- `applications` — shift_id, worker_id, proposed_rate, status (pending/accepted/rejected)

### Financial tables:
- `invoices` — per worker per shift. Tracks: amount, fee (€3.50/hr), net_amount, payout_type (fast/normal), fast_payout_fee, company_payment_status (unpaid/paid), worker_payout_status (pending/scheduled/paid)
- `company_payments` — when company pays WorkWings (total_amount, bank_reference, status)
- `company_payment_invoices` — junction table linking company payments to specific worker invoices
- `payouts` — individual SEPA transfers to workers via Revolut (revolut_payment_id, worker_iban, status)
- `platform_settings` — key-value store for Revolut OAuth tokens

### Other tables:
- `check_ins` — GPS-verified clock in/out (planned)
- `reviews` — bidirectional reviews (planned)
- `messages` — per-shift chat (planned)
- `flexpool` — favorite workers per company
- `notifications` — push notifications (planned)
- `platform_admins` — superadmin access (sambajarju2@gmail.com)

---

## 4. WHAT'S BUILT AND WORKING

### ✅ Marketing Site
- `/` — Freelancer landing (Hero with "Werk. Verdien. Leef.", stats, how it works, features, comparison, sectors, testimonials, CTA)
- `/zakelijk` — Company landing (benefits, comparison vs Temper/YoungOnes, company testimonials)
- Dark/light mode toggle
- PWA manifest, SEO (JSON-LD, sitemap.xml, robots.txt, /llms.txt)

### ✅ Auth & Onboarding
- Login: Google OAuth + email/password (freelancers get Google option, companies email only)
- Worker signup: 3-step (account → profile with BTW/KVK → sectors) → creates Supabase auth user + workers row
- Company signup: KVK auto-fill (free test API) → creates companies + company_members rows
- Auth callback handles Google OAuth redirects
- **Issue:** Google OAuth returns redirect_uri_mismatch — needs Supabase URL config fix

### ✅ Worker App (all pages use real Supabase data)
- `/shifts` — Browse shifts from Supabase with sector filters
- `/shifts/[id]` — Shift detail with company info, location, requirements + **Solliciteren button** (creates application)
- `/dashboard` — Worker stats, BTW warning, upcoming accepted shifts
- `/mijn-shifts` — Tabs: Aankomend / In afwachting / Afgerond
- `/profile` — Real worker data, stats, sectors, info fields, logout
- `/chat` — Placeholder only (Supabase Realtime planned)
- Bottom nav: Ontdek / Mijn Shifts / Chat / Account

### ✅ Company Admin Dashboard (Stripe-like, always light mode)
- `/admin` — Real stats dashboard (open shifts, apps, fill %, spending)
- `/admin/shifts` — Shifts list from Supabase
- `/admin/shifts/new` — Create shift form (writes to Supabase, loads company locations)
- `/admin/shifts/[id]` — Shift detail + applications with accept/reject
- `/admin/applications` — All applications with accept/reject
- `/admin/flexpool` — Favorite workers with block/unblock
- `/admin/settings` — Settings hub
- `/admin/settings/profile` — Edit company: name, logo upload, header image upload, description, KVK, website, email, phone, address
- `/admin/settings/locations` — Add/manage locations (name, city, address, dress code, parking)

### ✅ Master Admin (`/master`)
- Platform-wide stats (revenue, paid out, received, invoices, shifts, workers, companies)
- Tabs: Overview, Invoices, Payouts, Shifts, Workers, Companies
- Invoice table with PDF download links
- Payout table with Revolut payment IDs

### ✅ Payment System
- Revolut Business API fully connected (OAuth2 + JWT certificate auth)
- Real €5 payout sent and received (payment ID: 69d7aad5-0ae0-a64c-a89d-294a07e72985)
- Invoice generation API (POST /api/payments/generate-invoices)
- Company payment tracking (POST /api/payments/company-payment) — links payments to specific worker invoices
- Worker payout API (POST /api/payments/payout-worker) — triggers SEPA via Revolut
- Daily cron at 09:00 for fast payouts (GET /api/payments/process-fast-payouts)
- Invoice PDF generation (GET /api/invoices/[id]/pdf?type=freelancer|company)

### ✅ Infrastructure
- 35+ Vercel deployments, all successful
- Supabase project: xbzaqwpptwutschrkahy (eu-west-1)
- RLS policies on all tables
- Company images in Supabase Storage bucket
- KVK lookup API at /api/kvk

---

## 5. WHAT'S MISSING / NOT YET BUILT

### 🔴 Critical (needed for launch)
1. **Google OAuth fix** — Supabase URL configuration needed (Site URL + redirect URLs)
2. **Worker profile editing** — users can view but can't edit their profile fields (phone, IBAN, BTW, city)
3. **Middleware route protection** — currently anyone can access /admin or /master without auth check
4. **Email confirmations** — Supabase sends verification email but no custom templates
5. **Company payment collection** — Revolut Merchant API keys are stored but iDEAL/card payment flow not built
6. **Shift application flow** — worker can apply but there's no notification to the company

### 🟡 Important (needed for first users)
7. **In-app chat** — Supabase Realtime channel per shift (worker ↔ company messaging)
8. **Push notifications** — Web Push API for shift updates, application status changes
9. **GPS check-in/out** — Browser Geolocation API for hour verification
10. **Worker earnings dashboard** — show past earnings, invoices, payout history
11. **Company invoice payment page** — company sees their invoices and pays via iDEAL
12. **Reviews system** — bidirectional reviews after shift completion
13. **Rate negotiation** — worker can propose different rate when applying
14. **Substitution feature** — worker can offer their accepted shift to someone else (Wet DBA compliance)

### 🟢 Nice to Have (growth features)
15. **AI shift matching** — Claude Haiku recommends shifts based on worker history/skills/location
16. **Map view** — Mapbox showing shifts on a map
17. **660-hour compliance** — auto-track and warn when worker approaches 660 hours with same company
18. **ABM outreach system** — personalized sales emails to acquire companies
19. **Referral system** — invite friends, earn bonus
20. **Worker skill badges** — verified skills like "Barista Level 2"
21. **Auto-invoicing** — generate and send invoices automatically after shift
22. **Company analytics** — Recharts dashboard with fill rates, costs, worker performance
23. **Multi-language (next-intl)** — NL primary, EN secondary
24. **Blog/CMS (Sanity)** — SEO content for sector pages

---

## 6. DESIGN DECISIONS MADE

| Decision | Rationale |
|----------|-----------|
| Dark mode: soft navy (#011825) not black | Brand consistency, warm feel |
| Admin always light mode | Stripe-like, professional for companies |
| No emojis anywhere | Lucide icons only — cleaner, more professional |
| Revolut over Stripe Connect | Samba has Revolut account, SEPA free, simpler for NL-only |
| Finqle for scale | What Temper uses — add later for instant payouts |
| @react-pdf/renderer for invoices | Works on Vercel, YoungOnes-style invoices |
| PWA not native app | Faster iteration, no app store, instant updates |
| Bottom nav: Ontdek/Mijn Shifts/Chat/Account | Matches Temper/YoungOnes pattern |
| 3-shift BTW grace period | Allow workers to start without BTW, then require it |

---

## 7. ENVIRONMENT VARIABLES (Vercel)

| Variable | Status |
|----------|--------|
| NEXT_PUBLIC_SUPABASE_URL | ✅ Set |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY | ✅ Set |
| SUPABASE_SERVICE_ROLE_KEY | ✅ Set |
| REVOLUT_CLIENT_ID | ✅ Set |
| REVOLUT_BUSINESS_PRIVATE_KEY | ✅ Set |
| REVOLUT_MERCHANT_SECRET_KEY | ✅ Set |
| REVOLUT_MERCHANT_PUBLIC_KEY | ✅ Set |
| REVOLUT_ENVIRONMENT | ✅ production |
| KVK_API_KEY | ❌ Not set (using free test API) |
| MAILGUN_API_KEY | ❌ Not set |
| ANTHROPIC_API_KEY | ❌ Not set |
| MAPBOX_TOKEN | ❌ Not set |
| POSTHOG_KEY | ❌ Not set |
| SENTRY_DSN | ❌ Not set |

---

## 8. FILE STRUCTURE

```
src/
├── app/
│   ├── page.tsx                    # Freelancer landing
│   ├── zakelijk/page.tsx           # Company landing
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login (Google + email)
│   │   ├── signup/page.tsx         # Choose worker/company
│   │   ├── signup/worker/page.tsx  # 3-step worker onboarding
│   │   ├── signup/company/page.tsx # Company onboarding + KVK
│   │   └── callback/route.ts      # OAuth callback
│   ├── (worker)/
│   │   ├── layout.tsx              # Bottom nav layout
│   │   ├── dashboard/page.tsx      # Worker home
│   │   ├── shifts/page.tsx         # Browse shifts
│   │   ├── shifts/[id]/page.tsx    # Shift detail + apply
│   │   ├── mijn-shifts/page.tsx    # My shifts tabs
│   │   ├── chat/page.tsx           # Chat placeholder
│   │   └── profile/page.tsx        # Profile
│   ├── admin/
│   │   ├── layout.tsx              # Sidebar layout
│   │   ├── page.tsx                # Dashboard
│   │   ├── shifts/page.tsx         # Shifts list
│   │   ├── shifts/new/page.tsx     # Create shift
│   │   ├── shifts/[id]/page.tsx    # Shift detail
│   │   ├── applications/page.tsx   # Applications
│   │   ├── flexpool/page.tsx       # Flexpool
│   │   └── settings/              # Settings hub + profile + locations
│   ├── master/page.tsx             # Platform admin
│   └── api/
│       ├── shifts/                 # Shifts API
│       ├── payments/               # Invoice generation, company payments, worker payouts
│       ├── invoices/[id]/pdf/      # PDF generation
│       ├── revolut/                # OAuth authorize, callback, health
│       ├── kvk/                    # KVK company lookup
│       └── master/                 # Master admin data
├── lib/
│   ├── revolut.ts                  # Revolut Business API client (JWT auth)
│   ├── supabase-browser.ts         # Browser Supabase client
│   ├── supabase-server.ts          # Server Supabase client
│   └── invoices/                   # PDF templates (freelancer + company)
└── components/                     # Marketing page components
```

---

## 9. LEGAL REQUIREMENTS (Dutch Market)

### Wet DBA Compliance (partially implemented)
- ✅ Workers set own rate (rate negotiation planned)
- ❌ Substitution feature not built
- ✅ Workers choose shifts freely
- ❌ 660-hour tracking not built
- ❌ Modelovereenkomst van opdracht not generated

### KVK & Tax
- ✅ KVK lookup for companies
- ✅ BTW tracking for workers (3-shift grace period)
- ❌ KVK verification for workers not enforced

### GDPR/AVG
- ❌ Privacy policy not written
- ❌ Cookie consent not implemented
- ❌ Data deletion flow not built

---

## 10. QUESTIONS FOR REVIEW

1. **Onboarding UX** — Is the 3-step worker signup optimal? Should we add phone verification?
2. **Payment flow** — Is the "fast (5 days) / normal (after company pays)" model clear enough for workers?
3. **Company dashboard** — What features would make companies choose WorkWings over Temper?
4. **Mobile UX** — The worker app is mobile-first PWA — are we missing any critical mobile patterns?
5. **Growth strategy** — Should we focus on one sector first (e.g., horeca) or go broad?
6. **Legal** — What's the minimum legal documentation needed before accepting real users?
7. **Notification strategy** — Email-first or push-first for shift updates?
8. **Pricing** — Is €3.50/hr competitive enough vs Temper's €4.90? Should we go lower for launch?
