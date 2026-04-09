# WORKWINGS — AI DEVELOPER HANDOVER

> **Read this entire document before making any changes.**
> This is a production codebase with real money flowing (Revolut SEPA payouts confirmed).

---

## QUICK START

```bash
# Clone
git clone https://github.com/sambajarju2-png/workwings.git
cd workwings

# Install
npm install

# Dev
npm run dev

# Type-check (ALWAYS do this before pushing)
npx tsc --noEmit

# Push (force push to main, auto-deploys to Vercel)
git config user.email "sambajarju2@gmail.com"
git config user.name "Samba Jarju"
git add -A && git commit -m "descriptive message" && git push origin main --force
```

**Live URL:** https://workwings.vercel.app
**GitHub:** https://github.com/sambajarju2-png/workwings
**Vercel project:** `prj_UiHQOPPEiFm7KQliVM3R7lofda4j` (team: `team_Oxrk37sevVZa5pQWfEpqR1lR`)
**Supabase project:** `xbzaqwpptwutschrkahy` (eu-west-1)

---

## WHAT IS WORKWINGS

Dutch freelance shift platform. Think Temper/YoungOnes but cheaper (€3.50/hr vs €4.90/hr fee), with in-app chat, company reviews, and AI matching. Three interfaces sharing one Supabase database:

1. **Marketing site** — `/` (freelancers) and `/zakelijk` (companies)
2. **Worker PWA** — `/shifts`, `/dashboard`, `/profile`, `/chat`, `/mijn-shifts`, `/earnings`
3. **Company admin** — `/admin/*` (Stripe-like, always light mode)
4. **Master admin** — `/master` (only sambajarju2@gmail.com)

---

## CRITICAL RULES

### 1. NO middleware.ts
Next.js 16 uses `proxy.ts` (NOT `middleware.ts`). Having both causes build failure. Auth logic lives in `src/proxy.ts`.

### 2. Tailwind v4 dark mode
CSS uses `@theme inline` (fonts only) + `@theme` (colors). Dark mode via `@custom-variant dark (&:where(.dark, .dark *))` with next-themes. Admin is always light — no dark mode.

### 3. RLS bypass pattern
Direct Supabase client-side inserts often fail due to RLS timing after signup. Pattern: use server-side API routes with `SUPABASE_SERVICE_ROLE_KEY` for write operations. See `/api/auth/register-company` and `/api/locations` as examples.

### 4. No emojis
Zero emojis anywhere. Only Lucide React icons.

### 5. Brand colors (DO NOT CHANGE)
```
Navy:  #023047  (backgrounds, headers)
Pink:  #EF476F  (CTAs, highlights, accent)
Teal:  #A7DADC  (secondary, success)
Dark mode bg: #011825 (soft navy, not black)
```

### 6. Always view files before editing
After any `str_replace`, your cached view is stale. Re-view before making more edits to the same file.

---

## TECH STACK

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16.2.3 | App Router, Turbopack, `proxy.ts` not `middleware.ts` |
| Frontend | React 19, TypeScript 5+ | |
| Styling | Tailwind CSS 4 | `@import "tailwindcss"` syntax, NOT v3 |
| Animations | Framer Motion 12+ | |
| Icons | Lucide React | Zero emojis |
| Dark mode | next-themes | attribute="class", `@custom-variant dark` |
| Database | Supabase PostgreSQL | RLS on all 19 tables |
| Auth | Supabase Auth | Google OAuth + email/password |
| Payments OUT | Revolut Business API | JWT certificate auth (RS256), OAuth2, SEPA payouts |
| Payments IN | Revolut Merchant API | iDEAL checkout for companies |
| Invoice PDFs | @react-pdf/renderer | Freelancer + company + modelovereenkomst |
| JWT | jose | For Revolut JWT signing |
| Deployment | Vercel | Auto-deploy on push to main |

---

## FILE STRUCTURE

```
src/
├── proxy.ts                          # Route protection (NOT middleware.ts!)
├── app/
│   ├── layout.tsx                    # Root layout (cookie consent, SW register)
│   ├── globals.css                   # Tailwind + theme variables
│   ├── page.tsx                      # Freelancer landing page
│   ├── zakelijk/page.tsx             # Company landing page
│   ├── privacy/page.tsx              # Privacy policy (public)
│   ├── voorwaarden/page.tsx          # Terms & conditions (public)
│   ├── cookies/page.tsx              # Cookie policy (public)
│   │
│   ├── (auth)/                       # Auth pages (public)
│   │   ├── login/page.tsx            # Google + email login
│   │   ├── signup/page.tsx           # Choose worker/company
│   │   ├── signup/worker/page.tsx    # 3-step worker onboarding
│   │   ├── signup/company/page.tsx   # Company signup + KVK auto-fill
│   │   └── callback/route.ts        # OAuth callback handler
│   │
│   ├── (worker)/                     # Worker app (auth required)
│   │   ├── layout.tsx                # Bottom nav (Ontdek/Mijn Shifts/Chat/Account)
│   │   ├── dashboard/page.tsx        # Worker home — stats, upcoming shifts
│   │   ├── shifts/page.tsx           # Browse shifts (real Supabase data)
│   │   ├── shifts/[id]/page.tsx      # Shift detail + apply button
│   │   ├── mijn-shifts/page.tsx      # Tabs: Aankomend/In afwachting/Afgerond
│   │   ├── chat/page.tsx             # Real-time Supabase Realtime chat
│   │   ├── earnings/page.tsx         # Invoices, earned, pending amounts
│   │   ├── profile/page.tsx          # Inline editable profile
│   │   └── profile/edit/page.tsx     # Separate edit page (fallback)
│   │
│   ├── admin/                        # Company dashboard (auth required, always light)
│   │   ├── layout.tsx                # Sidebar nav
│   │   ├── page.tsx                  # Dashboard — stats, recent shifts
│   │   ├── shifts/page.tsx           # All shifts
│   │   ├── shifts/new/page.tsx       # Create shift form
│   │   ├── shifts/[id]/page.tsx      # Shift detail + accept/reject applications
│   │   ├── applications/page.tsx     # All applications
│   │   ├── flexpool/page.tsx         # Favorite workers
│   │   ├── payments/page.tsx         # Invoices + iDEAL pay button
│   │   └── settings/
│   │       ├── page.tsx              # Settings hub
│   │       ├── profile/page.tsx      # Company profile editor (logo, header, details)
│   │       └── locations/page.tsx    # Manage locations
│   │
│   ├── master/page.tsx               # Platform admin (sambajarju2@gmail.com only)
│   │
│   └── api/
│       ├── auth/
│       │   ├── register-company/     # Creates auth user + company + company_members
│       │   └── register-worker/      # Creates auth user + worker record
│       ├── shifts/                   # GET shifts, GET shift by ID
│       ├── locations/                # GET/POST locations (service role)
│       ├── kvk/                      # KVK company lookup (auto-fill)
│       ├── checkin/                  # GPS check-in/out
│       ├── compliance/check-660/     # 660-hour tracking
│       ├── substitution/             # Shift substitution (Wet DBA)
│       ├── contracts/[id]/           # Auto-generated modelovereenkomst PDF
│       ├── invoices/[id]/pdf/        # Invoice PDF (freelancer or company)
│       ├── payments/
│       │   ├── generate-invoices/    # Create invoices after shift
│       │   ├── company-payment/      # Record company payment → link to invoices
│       │   ├── payout-worker/        # Trigger Revolut SEPA payout
│       │   ├── process-fast-payouts/ # Vercel cron (daily 09:00)
│       │   └── invoices/             # List invoices
│       ├── merchant/
│       │   ├── create-order/         # Revolut Merchant iDEAL checkout
│       │   └── webhook/              # Payment confirmation webhook
│       ├── revolut/
│       │   ├── authorize/            # OAuth consent redirect
│       │   ├── callback/             # Token exchange + store
│       │   ├── health/               # Connection test
│       │   ├── setup-webhook/        # Register Business API webhook
│       │   └── webhook/              # Payout status updates
│       └── master/                   # Platform-wide data
│
├── lib/
│   ├── revolut.ts                    # Revolut Business API client (JWT + OAuth2)
│   ├── push.ts                       # Push notification helpers
│   ├── supabase-browser.ts           # Browser Supabase client
│   ├── supabase-server.ts            # Server Supabase client
│   └── invoices/
│       ├── freelancer-invoice.tsx     # Worker invoice PDF template
│       ├── company-invoice.tsx        # Company invoice PDF template
│       └── modelovereenkomst.tsx      # ABU/I-ZO contract PDF template
│
├── components/
│   ├── navbar.tsx                    # Marketing navbar
│   ├── footer.tsx                    # Marketing footer (legal links)
│   ├── hero.tsx                      # Freelancer hero
│   ├── cookie-consent.tsx            # Cookie banner
│   ├── sw-register.tsx               # Service worker registration
│   ├── json-ld.tsx                   # SEO structured data
│   └── [other marketing sections]
│
public/
├── sw.js                             # Service worker (offline + push)
├── manifest.json                     # PWA manifest
└── icons/                            # PWA icons
```

---

## DATABASE (Supabase — 19 tables, all RLS)

| Table | Rows | Purpose |
|-------|------|---------|
| workers | 1 | Freelancer profiles (id = auth.uid) |
| companies | 8 | Company profiles (6 seeded + 2 real) |
| company_members | 2 | Links auth users to companies |
| locations | 6 | Company locations (address, dress code, parking) |
| shifts | 8 | Shift listings (6 seeded + 2 real) |
| applications | 1 | Worker → shift applications (pending/accepted/rejected) |
| check_ins | 0 | GPS clock in/out records |
| reviews | 0 | Bidirectional reviews |
| messages | 0 | Per-shift chat (Supabase Realtime) |
| invoices | 1 | Per worker per shift (company_payment_status + worker_payout_status) |
| payouts | 1 | SEPA transfers to workers (revolut_payment_id) |
| company_payments | 0 | When companies pay WorkWings |
| company_payment_invoices | 0 | Junction: which invoices a company payment covers |
| flexpool | 0 | Favorite workers per company |
| notifications | 0 | Push/email notifications |
| hour_tracking | 0 | 660-hour per worker×company |
| substitutions | 0 | Shift substitution requests (Wet DBA) |
| platform_settings | 1 | Revolut OAuth tokens |
| platform_admins | 1 | Superadmin access (sambajarju2@gmail.com) |

### Key columns to know:
- `workers.payout_preference`: 'fast' (5 days, €0.75/hr fee) or 'normal' (after company pays, free)
- `workers.btw_number`: NULL = no BTW. 3 shifts allowed without BTW.
- `workers.shifts_without_btw`: counter for BTW grace period
- `invoices.company_payment_status`: 'unpaid' | 'paid'
- `invoices.worker_payout_status`: 'pending' | 'scheduled' | 'paid' | 'failed'
- `invoices.payout_type`: 'fast' | 'normal'

---

## REVOLUT INTEGRATION (LIVE — REAL MONEY)

### Business API (payouts to workers)
- **Auth:** JWT certificate (RS256) → OAuth2 authorization_code flow
- **Token storage:** `platform_settings` table (key: `revolut_tokens`)
- **Token refresh:** automatic via refresh_token
- **JWT issuer:** `workwings.vercel.app` (must match certificate config)
- **JWT audience:** `https://revolut.com`
- **EUR account:** `6b7a1bfd-7adb-40cd-a910-a50833a98a27`
- **Real payout sent:** €5 to NL47REVO7953306581 (payment ID: `69d7aad5-0ae0-a64c-a89d-294a07e72985`)
- **Webhook registered:** TransactionCreated, TransactionStateChanged

### Merchant API (accepting company payments)
- **Auth:** Bearer token (secret key)
- **Flow:** POST /api/merchant/create-order → Revolut checkout URL → company pays via iDEAL → webhook confirms → invoices marked paid
- **Webhook:** POST /api/merchant/webhook

### Key file: `src/lib/revolut.ts`
- Handles PKCS#1 → PKCS#8 key conversion (Vercel strips newlines from PEM)
- Caches tokens in Supabase (not in-memory, because serverless)
- All methods return `{ success: true/false, error?, data? }`

---

## PAYMENT FLOW

```
SHIFT COMPLETED → generate-invoices API
  ↓
Invoice per worker (amount + €3.50/hr fee + optional €0.75/hr fast fee)
  ↓
┌─────────────────────────────┐  ┌──────────────────────────────┐
│ FAST PAYOUT                 │  │ NORMAL PAYOUT                │
│ scheduled_payout_date =     │  │ worker_payout_status =       │
│   shift_date + 5 days       │  │   'pending' until company    │
│ Vercel cron at 09:00 daily  │  │   pays → then 'scheduled'    │
│ triggers Revolut SEPA       │  │   → then Revolut SEPA        │
└─────────────────────────────┘  └──────────────────────────────┘
  ↓                                ↓
Company pays via iDEAL (Revolut Merchant API)
  ↓
company_payment → company_payment_invoices (junction)
  ↓
Worker gets paid via Revolut Business API → payout record
```

---

## ENV VARS (Vercel)

| Variable | Status | Purpose |
|----------|--------|---------|
| NEXT_PUBLIC_SUPABASE_URL | ✅ | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY | ✅ | Supabase anon key |
| SUPABASE_SERVICE_ROLE_KEY | ✅ | Server-side admin access |
| REVOLUT_CLIENT_ID | ✅ | Business API OAuth |
| REVOLUT_BUSINESS_PRIVATE_KEY | ✅ | JWT signing (PEM) |
| REVOLUT_MERCHANT_SECRET_KEY | ✅ | Merchant API |
| REVOLUT_MERCHANT_PUBLIC_KEY | ✅ | Merchant API |
| REVOLUT_ENVIRONMENT | ✅ | `production` |
| KVK_API_KEY | ❌ | Uses free test API |
| MAILGUN_API_KEY | ❌ | No email yet |
| ANTHROPIC_API_KEY | ❌ | No AI matching yet |
| MAPBOX_TOKEN | ❌ | No maps yet |
| NEXT_PUBLIC_VAPID_PUBLIC_KEY | ❌ | No push yet |
| VAPID_PRIVATE_KEY | ❌ | No push yet |

---

## KNOWN GOTCHAS

1. **middleware.ts will BREAK the build** — Next.js 16 only uses `proxy.ts`
2. **Tailwind v4 dark mode** — must use `@custom-variant dark (&:where(.dark, .dark *))` + split `@theme inline` (fonts) from `@theme` (colors)
3. **RLS after signUp** — session isn't active immediately. Use server-side API routes with service_role
4. **Revolut PEM key** — Vercel strips newlines. Code handles `\\n` replacement + PKCS#1→PKCS#8 conversion
5. **locations.lat/lng** — now nullable (was NOT NULL, caused insert failures)
6. **@react-pdf/renderer** — works on Vercel but needs `any` type casting for `renderToBuffer`
7. **Safari OKLCH** — Tailwind v4 OKLCH colors don't render on older Safari. Use hex for critical elements

---

## WHAT'S BUILT AND WORKING (all pages use real Supabase data)

### Marketing
- [x] Freelancer landing (/) — hero, stats, how it works, features, comparison, sectors, testimonials
- [x] Company landing (/zakelijk) — benefits, comparison vs Temper/YoungOnes, testimonials
- [x] Dark/light mode toggle
- [x] PWA manifest + service worker + offline caching
- [x] SEO (JSON-LD, sitemap.xml, robots.txt, /llms.txt)

### Auth
- [x] Login (Google OAuth + email/password)
- [x] Worker signup (3-step: account → profile with BTW/KVK → sectors)
- [x] Company signup (KVK auto-fill → details → account)
- [x] Route protection via proxy.ts
- [x] Session management

### Worker App
- [x] Dashboard (stats, BTW warning, upcoming shifts)
- [x] Shift browse (real data from Supabase)
- [x] Shift detail + apply button (creates application)
- [x] Mijn Shifts (tabs: Aankomend/In afwachting/Afgerond)
- [x] Profile (inline editing: name, city, phone, IBAN, BTW, KVK, payout preference)
- [x] Chat (Supabase Realtime per-shift conversations)
- [x] Earnings (invoice list, totals, PDF download)

### Company Admin
- [x] Dashboard (real stats from company data)
- [x] Shifts CRUD (list, create, detail)
- [x] Applications (accept/reject with worker info)
- [x] Flexpool (favorite workers, block/unblock)
- [x] Payments (invoice list + iDEAL pay button)
- [x] Settings hub → Company profile editor (logo, header, all fields)
- [x] Settings → Locations management (add, list)

### Master Admin
- [x] Platform-wide stats
- [x] All invoices, payouts, shifts, workers, companies
- [x] Protected by platform_admins table

### Payments
- [x] Revolut Business API (SEPA payouts — real €5 sent)
- [x] Revolut Merchant API (iDEAL checkout flow)
- [x] Invoice generation (per worker per shift)
- [x] Company payment tracking (linked to specific invoices)
- [x] Fast/normal payout terms
- [x] Vercel cron for daily fast payout processing
- [x] Webhook for payout status updates

### Legal/Compliance
- [x] Auto-generated modelovereenkomst PDF (ABU/I-ZO, Belastingdienst nr. 9092076897)
- [x] 660-hour tracking API (warning at 580h, blocked at 660h)
- [x] Substitution API (vervangingsrecht — Wet DBA)
- [x] BTW 3-shift grace period tracking
- [x] Privacy policy (/privacy)
- [x] Algemene Voorwaarden (/voorwaarden)
- [x] Cookie policy (/cookies)
- [x] Cookie consent banner

### PDFs
- [x] Freelancer invoice (GET /api/invoices/[id]/pdf?type=freelancer)
- [x] Company invoice (GET /api/invoices/[id]/pdf?type=company)
- [x] Modelovereenkomst (GET /api/contracts/[application_id])

---

## WHAT'S MISSING / NEEDS WORK

### 🔴 Priority 1 — Before first real users
1. **Email notifications** — Workers need to know when accepted/rejected. Companies need to know about new applications. No Mailgun/Resend integration yet.
2. **Push notifications** — Service worker handler exists but VAPID keys not configured. Need to generate VAPID keys and add to env vars.
3. **Rate negotiation UI** — `proposed_rate` field exists in applications table but the shift detail apply flow doesn't let workers propose a different rate. Need to add a "Onderhandel tarief" toggle.
4. **Admin chat** — Companies can't see/respond to chat messages yet. Only worker-side chat is built. Need to add chat to admin shift detail or a separate admin chat page.
5. **Shift status transitions** — No automatic shift status changes (open → filled when workers_filled >= workers_needed, completed after end time).
6. **BTW enforcement** — Counter exists but shift application doesn't actually block workers without BTW after 3 shifts.

### 🟡 Priority 2 — Growth features
7. **Map view** — Mapbox showing shifts on a map (token not set)
8. **AI shift matching** — Claude Haiku recommendations (API key not set)
9. **Company analytics** — Recharts dashboard (fill rates, costs, worker performance)
10. **Reviews system** — Table exists, no UI. Bidirectional reviews after shift completion.
11. **Referral system** — Invite friends, earn bonus
12. **Worker skill badges** — Verified skills
13. **Multi-language (next-intl)** — NL primary, EN secondary

### 🟢 Priority 3 — Scale
14. **Blog/CMS (Sanity)** — SEO content for sector pages
15. **ABM outreach** — Personalized sales emails for company acquisition
16. **Instant payouts** — SEPA Instant via Revolut (currently regular SEPA)
17. **Data export** — GDPR right to data portability
18. **Account deletion** — GDPR right to erasure

---

## DEPLOYMENT PATTERN

```bash
cd /home/claude/workwings

# 1. Always type-check first
npx tsc --noEmit

# 2. If clean, push
git config user.email "sambajarju2@gmail.com"
git config user.name "Samba Jarju"
git add -A
git commit -m "descriptive message"
git push origin main --force

# 3. Verify deploy via Vercel MCP or check:
# https://vercel.com/samba-jarjus-projects/workwings
```

Vercel auto-deploys on push. Build takes ~30-60 seconds. If build fails, check the error — most common issues:
- `middleware.ts` exists (delete it, use `proxy.ts`)
- TypeScript errors (fix them)
- Import errors (wrong path)

---

## TESTING ENDPOINTS

```bash
# Health check — Revolut connection
curl https://workwings.vercel.app/api/revolut/health

# Shifts API
curl https://workwings.vercel.app/api/shifts

# Single shift
curl https://workwings.vercel.app/api/shifts/aaaa1111-1111-1111-1111-aaaaaaaaaaaa

# Invoice PDF
curl https://workwings.vercel.app/api/invoices/a0000001-0001-0001-0001-000000000001/pdf?type=freelancer

# Modelovereenkomst PDF
curl https://workwings.vercel.app/api/contracts/9372761a-6e39-498c-be3c-60c85b250341

# 660-hour check
curl "https://workwings.vercel.app/api/compliance/check-660?worker_id=11111111-aaaa-bbbb-cccc-dddddddddddd"
```

---

## STYLE GUIDE

- **Bold, energetic, young** — hospitality workers and students, NOT corporate
- Large typography, generous whitespace, bold CTAs
- Mobile-first PWA
- Glass morphism cards, gradient accents OK
- Framer Motion animations everywhere
- Font: Geist Sans + Geist Mono (local woff2)
- Admin: Stripe-like, clean white, spacious, no dark mode
- Worker app: dark/light mode, soft navy dark theme
- NO generic AI aesthetic. NO purple gradients.
- NO emojis. Only Lucide icons.

---

## CONTACT

**Owner:** Samba Jarju (sambajarju2@gmail.com)
**GitHub:** sambajarju2-png
**Company:** WorkWings B.V. (in oprichting)
**KVK:** 83474889 (Samba BV)
