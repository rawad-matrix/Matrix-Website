# CLAUDE.md — Matrix Energy & Automation Website
## Complete Build Guide for Claude Code

---

## PROJECT OVERVIEW

**Company:** Matrix Energy & Automation sarl  
**Domain:** matrixea.co  
**Purpose:** Industrial B2B website + online training platform (buy courses like Udemy) + live IoT monitoring dashboard  
**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase · PWA · Vercel  

---

## GITHUB — PUSHING CHANGES

Repository: `https://github.com/rawad-matrix/Matrix-Website.git`  
Account: `rawad-matrix`

The GitHub Personal Access Token is stored in `.env.local` as `GITHUB_PAT`.  
To push, run:

```bash
git remote set-url origin "https://rawad-matrix:$(grep GITHUB_PAT .env.local | cut -d= -f2)@github.com/rawad-matrix/Matrix-Website.git"
git push origin main
```

Or manually read the token from `.env.local` and substitute it:

```bash
git remote set-url origin "https://rawad-matrix:<token-from-env.local>@github.com/rawad-matrix/Matrix-Website.git"
git push origin main
```

> If the token has expired, generate a new one at github.com → Settings → Developer settings → Personal access tokens, then update `GITHUB_PAT` in `.env.local`.

---

## CURRENT BUILD STATUS (as of 2026-05-16)

The project is **substantially complete**. Below is the definitive status of every feature:

### ✅ DONE
- **Foundation:** Next.js 16.2.6, React 19, Tailwind v4, all packages installed, design tokens, fonts, animation keyframes, utility classes
- **Layout:** Topbar, Navbar (sticky + scroll shadow + mobile overlay), Footer, MobileMenu, PublicShell wrapper, FloatingWhatsApp button
- **Homepage:** All 8 sections — Hero, ServicesGrid, WhyMatrix, BrandsRow, StatsCounter (count-up animation), CaseStudiesPreview, TrainingCTABanner, ContactStrip
- **Static pages:** System Integrator, Training, About, Contact (with form), Case Studies listing, Case Study detail, Install App
- **Auth:** Sign-in, Register, Supabase callback, auth layout, middleware.ts (protects /dashboard, /user, /checkout, /admin), useAuth hook
- **Course pages:** `/courses` catalog (with Level + Topic filters), `/courses/[slug]` detail — **all 7 courses are hardcoded as a static dict in the page file** (not fetched from Supabase); uses `generateStaticParams` for SSG
- **Enrollment flow:** `/checkout` page (bank transfer form with zod validation), creates `enrollments` row with `status: 'pending_payment'`, calls `/api/enroll` to notify admin, success confirmation screen; WhatsApp fallback button
- **API routes:** `/api/contact` (Supabase + Resend), `/api/enroll` (Resend notification), `/api/stripe/webhook` (scaffolded, inactive)
- **IoT Dashboard:** `/dashboard` — KPI cards, Recharts AreaChart (solar, time range chips), Motor grid (live from Supabase with static fallback), Power Sources panel (clickable rows), Active Alarms panel; polls Supabase every 30s via `useMonitoringData`
- **User Dashboard:** `/user/dashboard` — shows enrolled courses from Supabase, status pills, "Start Learning" link
- **Admin Panel:** `/admin` overview (KPI cards + recent enrollments table), `/admin/courses` (publish toggle via Supabase), `/admin/enrollments` (table with status management)
- **Database:** Full schema in `src/lib/supabase/schema.sql`, seed data in `src/lib/seed-courses.ts`; RLS policies for profiles, enrollments, courses, monitoring_data
- **PWA:** `public/manifest.json` complete (with shortcuts, categories, orientation)
- **Hooks:** `useAuth`, `useMonitoringData`, `useCountUp`, `useInView`
- **UI Components:** `Button.tsx` (all variants), `SectionHeader.tsx`, `ContactForm.tsx`

### ⚠️ PENDING / INCOMPLETE
- **PWA service worker:** `@ducanh2912/next-pwa` is installed but NOT wired in `next.config.ts` — Next.js 16 uses Turbopack by default which is incompatible. Wire it at Vercel deploy time by switching to webpack mode, or use a standalone service worker file.
- **Admin case studies page:** `/admin/case-studies/page.tsx` — full CRUD with image upload to Supabase Storage, slide-in drawer form, required/optional fields, publish/featured toggles.
- **Course detail from Supabase:** Currently all 7 courses are hardcoded. The DB seed exists but the detail page reads from a static dict. If you want dynamic courses, refactor to read from Supabase.
- **Image assets:** `/public/images/logo.jpg`, `icon-192.png`, `icon-512.png` need to be placed (logo source is at `/design-reference/matrix-logo.jpg`).
- **Vercel deployment:** Not yet deployed. Step 12 in the original plan.

---

## DESIGN REFERENCE FILES
All HTML design mockups are in `/design-reference/`. 
Reference these files constantly — they are the pixel-perfect source of truth.
- `Matrix Homepage v2.html` → homepage
- `Training.html` + `course-*.html` → training & course pages
- `Dashboard.html` → IoT monitoring dashboard
- `Admin Panel.html` → admin panel
- `About.html`, `Contact.html`, `Case Studies.html`, `Case Study Detail.html`
- `Sign In.html`, `Register.html`, `Install App.html`
- `System Integrator.html`
- `Training - Academic.html`, `Training - On-the-Job.html`, `Training - Hybrid.html`

---

## TECH STACK & ACTUAL VERSIONS

```
Next.js     16.2.6
React       19.2.4
TypeScript  5.x
Tailwind    4.x  (uses @theme inline in CSS — NO tailwind.config.ts)
Supabase    @supabase/supabase-js ^2, @supabase/ssr ^0.10
```

### All installed packages (from package.json):
```json
"dependencies": {
  "@ducanh2912/next-pwa": "^10.2.9",
  "@hookform/resolvers": "^5.2.2",
  "@stripe/react-stripe-js": "^6.3.0",
  "@stripe/stripe-js": "^9.5.0",
  "@supabase/ssr": "^0.10.3",
  "@supabase/supabase-js": "^2.105.4",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "lucide-react": "^1.16.0",
  "next": "16.2.6",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "react-hook-form": "^7.75.0",
  "recharts": "^3.8.1",
  "resend": "^6.12.3",
  "stripe": "^22.1.1",
  "tailwind-merge": "^3.6.0",
  "zod": "^4.4.3"
}
```

> **Note:** `@radix-ui` packages are NOT installed — UI was built with plain Tailwind + inline styles. Do not add radix unless needed for a specific new component.

---

## DESIGN SYSTEM — FOLLOW EXACTLY

> **CRITICAL:** The HTML design files are the ground truth. Every pixel detail in this section comes directly from the implemented designs. Do NOT deviate from these values.

### Color Variables

These are defined in `src/app/globals.css` as both CSS custom properties and Tailwind v4 theme tokens:

```css
/* In globals.css — already implemented */
:root {
  --blue: #1B6FCC;
  --blue-dark: #155AA8;
  --navy: #2A2F3A;
  --navy-mid: #363C49;
  --slate: #2A2F3A;
  --red: #DC2626;
  --red-dark: #B91C1C;
  --amber-warn: #FFB200;    /* Warning state only — alarms, warn dots */
  --success: #22C55E;
  --wa: #25D366;            /* WhatsApp green */
  --white: #FFFFFF;
  --off: #F8F9FB;           /* Light section backgrounds */
  --ink: #1F2330;           /* Primary text */
  --muted: #64748B;         /* Secondary text */
  --border: #E2E8F0;
  --topbar-bg: #F4F6FA;
}

@theme inline {
  --color-matrix-blue: #1B6FCC;
  --color-matrix-blue-dark: #155AA8;
  --color-matrix-navy: #2A2F3A;
  --color-matrix-navy-mid: #363C49;
  --color-matrix-red: #DC2626;
  --color-matrix-red-dark: #B91C1C;
  --color-matrix-amber: #FFB200;
  --color-matrix-success: #22C55E;
  --color-matrix-wa: #25D366;
  --color-matrix-off: #F8F9FB;
  --color-matrix-ink: #1F2330;
  --color-matrix-muted: #64748B;
  --color-matrix-border: #E2E8F0;
  --color-matrix-topbar: #F4F6FA;

  --font-barlow: var(--font-barlow-condensed), "Barlow Condensed", sans-serif;
  --font-dm: var(--font-dm-sans), "DM Sans", sans-serif;
  --font-mono: var(--font-jetbrains-mono), "JetBrains Mono", monospace;
}
```

> **Tailwind v4 note:** There is NO `tailwind.config.ts`. Colors and fonts are registered via `@theme inline` in `globals.css`. Use `bg-matrix-blue`, `text-matrix-navy`, etc. in Tailwind classes, OR use inline styles with hex values directly.

### Typography

Fonts are loaded in `src/app/layout.tsx` with these CSS variable names:

```ts
// The Next.js variable() option produces:
// --font-barlow-condensed  (Barlow Condensed)
// --font-dm-sans           (DM Sans)
// --font-jetbrains-mono    (JetBrains Mono)
```

In `globals.css` these are aliased via `@theme inline` to:
- `--font-barlow` → use as `font-barlow` Tailwind class
- `--font-dm`     → use as `font-dm` Tailwind class  
- `--font-mono`   → use as `font-mono` Tailwind class

**Typography rules:**
- `font-barlow` → all H1–H5, section titles, course titles, button text uppercase labels
- `font-dm` → body text, navigation links, descriptions, form labels
- `font-mono` → all numbers, stats, live values, KPI readings, timestamps, module numbers (01, 02…)

### Border Radius
**Sharp industrial aesthetic — max 2px everywhere.** Use `rounded-[2px]` in Tailwind. Never use `rounded-lg` or `rounded-xl`. The only exception is the logo-mark square at `rounded-[3px]`.

### Button Variants

```tsx
// components/ui/Button.tsx — already implemented
const variants = {
  primary: 'bg-[#1B6FCC] text-white hover:bg-[#155AA8] hover:translate-y-[-1px]',
  red: 'bg-[#DC2626] text-white hover:bg-[#B91C1C]',
  ghost: 'bg-transparent text-white border border-white/45 hover:border-[#1B6FCC] hover:text-[#1B6FCC]',
  dark: 'bg-[#2A2F3A] text-white hover:bg-black',
  whatsapp: 'bg-[#25D366] text-white hover:brightness-110',
  outline: 'bg-transparent text-[#1B6FCC] border border-[#1B6FCC] hover:bg-[#1B6FCC] hover:text-white',
}
// Base: px-[22px] py-[12px] font-dm font-semibold text-[13.5px] uppercase tracking-[0.04em] rounded-[2px] transition-all duration-150 inline-flex items-center gap-2
// Small: px-[18px] py-[10px] text-[12px]
// Large (hero): px-[28px] py-[16px] text-[14px]
```

---

## GLOBAL LAYOUT COMPONENTS

### Topbar (`components/layout/Topbar.tsx`) — BUILT

```
- Background: #F4F6FA (light gray)
- Border bottom: 1px solid #E2E8F0
- Height: 36px
- Font: DM Sans 13px weight 500
- Left: Phone icon + "+961 1 277 663" (tel link) | Email icon + "info@matrixea.co" (mailto) | Clock icon + "Mon–Sat 09:00–20:00"
- Right: Facebook, Instagram, TikTok, LinkedIn icon links (color: #1B6FCC on hover)
- Icon size: 14px (left icons), 15px (social icons)
- Mobile (<760px): hide last contact item and social icons beyond 2
```

### Main Navigation (`components/layout/Navbar.tsx`) — BUILT

```
- Background: #2A2F3A (navy)
- Height: 72px
- Position: sticky top-0 z-50
- Border bottom: 1px solid rgba(255,255,255,0.05)
- On scroll: add box-shadow: 0 6px 24px rgba(0,0,0,0.35) via JS class toggle
- Left: Logo (logo-mark 44×44px white bg rounded-[3px] + "Matrix" italic bold 22px white + "Energy & Automation" 9.5px uppercase 0.18em tracking white/60%)
- Center: Nav links — DM Sans 13px weight 500 uppercase tracking-[0.08em] text-white/78
  Active/hover: text-white + 2px blue underline animates from width 0 → 100% (left to right, 200ms ease)
- Right: "Get a Quote" button (primary variant, small) + burger menu (mobile)
- Nav items: Home | System Integrator | Training | About | Case Studies | Dashboard | Contact
- Mobile (<1024px): hide nav links, show burger → full-screen overlay with staggered fade-in animation
```

**Logo component:** White square with Matrix logo image (`/images/logo.jpg`) inside. Source file is at `/design-reference/matrix-logo.jpg` — copy it to `/public/images/logo.jpg`.

### Footer (`components/layout/Footer.tsx`) — BUILT

```
- Background: #2A2F3A (slate)
- Subtle circuit/grid pattern overlay: linear-gradient grid lines at 5% opacity using #1B6FCC
- Padding: 80px top, 40px bottom
- Three-column grid (desktop), single column (mobile)

Col 1: Logo (white version) + company description (2 lines) + social icon row
Col 2: Quick Links (System Integrator, Training, Courses, Case Studies, About, Dashboard, Contact)
Col 3: Contact info with blue-colored icons
  - Map pin: "3rd Floor, MUC University Bldg, Khaldeh Round About, Beirut — Lebanon"
  - Phone: "+961 1 277 663"
  - Email: "info@matrixea.co"
  - Clock: "Mon–Sat 09:00 – 20:00 · Sun closed"

Bottom bar (border-top 1px solid white/10):
- Left: "© 2026 Matrix Energy & Automation sarl. All rights reserved."
- Right: Privacy | Terms | Install App links

Icons in contact column: color #1B6FCC (blue accent), size 16px
```

### PublicShell (`components/layout/PublicShell.tsx`) — BUILT
Wraps all public pages: renders Topbar → Navbar → `{children}` → Footer → FloatingWhatsApp.

### FloatingWhatsApp (`components/layout/FloatingWhatsApp.tsx`) — BUILT
Fixed bottom-right, 56×56px circle, green bg, WhatsApp icon SVG. Present on all public pages.

### Section Header Pattern — BUILT

```tsx
// components/ui/SectionHeader.tsx — already exists
// Props: label (string), title (string), subtitle? (string), centered? (boolean)
// Renders:
// 1. [40px wide, 3px tall, #1B6FCC] horizontal line
// 2. LABEL text — DM Sans 12px uppercase tracking-[3px] color #1B6FCC
// 3. Title — Barlow Condensed 40-48px weight 800 color: var(--ink) OR white
// 4. Subtitle — DM Sans 18px color muted, max-width 600px
// Margin bottom: 56px
```

---

## PAGE SPECIFICATIONS

### Page: Home (`/`) — BUILT

**Hero Section:**
```
- min-height: 90vh
- Background layers (stacked via CSS):
  1. gradient: linear-gradient(115deg, rgba(42,47,58,.88) 0%, rgba(42,47,58,.65) 55%, rgba(42,47,58,.40) 100%)
  2. radial gradient for depth
  3. Base: #0A0A12
- ::before pseudo: circuit grid lines using linear-gradient(rgba(27,111,204,.04) 1px, transparent 1px) 0 0/40px 40px + radial highlight glows
- ::after pseudo: right-side decorative panel — clip-path polygon, striped overlay texture, border-left blue at 18% opacity
- Content (z-index 2, max-width 780px, left-aligned):
  [Animated tag pill] — blue bg at 12%, blue border at 35%, pulsing red dot animation, text: "AUTOMATION & ENERGY SOLUTIONS"
  [H1 — 86px desktop / 48px mobile, Barlow Condensed 800, uppercase, line-height 0.95]
    "POWERING LEBANON'S" (white)
    "INDUSTRIAL" (white) + "FUTURE" (color: --red, .accent class)
  [Lead — 18px, white/78, max-width 560px, line-height 1.6]
    "21 years of SCADA, PLC, and system integration experience across the Arab world and Africa."
  [CTA row — flex gap-14px]
    [Blue primary button] "Explore Solutions →"
    [Ghost button] "Our Case Studies"
- Hero stats bar (below content, border-top 1px white/12, padding-top 32px, max-width 680px):
  3 columns with blue border dividers:
  "1200+" Projects | "800+" Clients | "99%" Satisfaction
  Numbers: JetBrains Mono 36px white, accent span color: #1B6FCC
  Labels: DM Sans 11.5px uppercase tracking-[0.18em] white/60
- Corner chip (absolute bottom-right): glassmorphism card showing live data rows
  "SYSTEM STATUS" label + rows of values — decorative, static data is fine
  Hide on mobile
```

**Services Preview Section:** 6-card grid, white bg, border-left accent, hover lift. — BUILT

**Why Matrix Section:** Navy bg, 2-col split, checklist with blue checkmarks. — BUILT

**Brands/Partners Section:** Grayscale logos (Siemens, ABB, Allen Bradley, Delta, Veichi), hover to full color. — BUILT

**Stats Counter Banner:** Blue bg, 4 counters with count-up animation via IntersectionObserver. — BUILT

**Case Studies Preview:** 3-col card grid, full-bleed photo with gradient overlay, sector badge. — BUILT

**Training CTA Banner:** Navy bg, 2-col (text left, training types right). — BUILT

**Contact Strip:** Blue bg, centered CTA + two buttons (Contact + WhatsApp). — BUILT

---

### Page: System Integrator (`/system-integrator`) — BUILT
Follow `System Integrator.html` design exactly. EPC panels (E/P/C with large background letters), services grid, industries served, brands, process steps.

---

### Page: Training (`/training`) — BUILT
Three track cards (Academic / On-the-Job / Hybrid), curriculum grid linking to course slugs. References `Training.html`, `Training - Academic.html`, `Training - On-the-Job.html`, `Training - Hybrid.html`.

---

### Page: Course Detail (`/courses/[slug]`) — BUILT (static data)

**Implementation note:** All 7 courses are defined as a static TypeScript dict in the page file itself (`COURSES` constant). The page uses `generateStaticParams` for SSG. Data is NOT fetched from Supabase at runtime — to add/edit a course, update the dict in `src/app/courses/[slug]/page.tsx`.

**The 7 course slugs:**
- `siemens-tia-portal` — Advanced · 40h · $299
- `delta-plc` — Intermediate · 24h · $199
- `eplan-electric-p8` — Intermediate · 32h · $229
- `scada-hmi-development` — Advanced · 36h · $279
- `battery-systems-storage` — Intermediate · 20h · $179
- `veichi-vfd-servo` — Beginner · 16h · $149
- `vfd-fundamentals` — Beginner · 12h · $129

**Hero:** Navy bg, 2-col grid (content + metadata sidebar card with amber border), price display, "Enroll Now" → `/auth/sign-in?redirect=/checkout?course=slug`

**Body:** 2-col (modules 2-column grid left, sticky outcomes sidebar right)

**CTA row (bottom):** Navy bg, "Enroll Now" + WhatsApp enroll button

---

### Page: Courses Catalog (`/courses`) — BUILT

Filter bar (Level + Topic pills, sticky), 3-col course card grid (navy bg cards), empty state. Course data is hardcoded in the page. Filters work client-side against the hardcoded array.

---

### Page: Dashboard (`/dashboard`) — BUILT, Protected

Full-width dark-theme layout (bg: #F4F6FA outer, white panels). Header with "LIVE · WebSocket" pulse badge and Sign Out button. KPI row: Solar, Battery, Grid, Active Alarms. Main grid (2fr left / 1fr right): Recharts AreaChart + Motor grid on left; Power Sources (clickable rows, active = navy bg) + Active Alarms on right. Data from `useMonitoringData` (polls Supabase `monitoring_data` every 30s) with static fallback if DB is empty.

---

### Page: Auth (`/auth/sign-in` and `/auth/register`) — BUILT

```
- Full page, background: #F8F9FB
- Centered card: white bg, border 1px #E2E8F0, padding 48px, max-width 440px, rounded-[2px]
- Matrix logo at top (centered)
- Barlow Condensed 32px uppercase title
- Form fields: focus → border #1B6FCC
- Blue primary button full width
- Supabase email+password auth only. No OAuth.
```

---

### Page: Admin Panel (`/admin`) — BUILT, Admin Role Required

**Sidebar:** Defined as `AdminSidebar` component exported from `/admin/page.tsx`. Nav items: Overview | Courses | Enrollments | Case Studies | Settings (last two link to pages that may not exist yet). Sticky, 240px wide.

**Overview page (`/admin/page.tsx`):** KPI cards (total enrollments, pending payments, published courses, users) + recent enrollments table with status pills.

**Courses page (`/admin/courses/page.tsx`):** Table of all courses from Supabase with publish toggle (updates `is_published` in DB).

**Enrollments page (`/admin/enrollments/page.tsx`):** Full table with status update capability.

**Case Studies page (`/admin/case-studies/page.tsx`):** Full CRUD — table with publish/featured toggles, slide-in drawer form with required fields (title, tag, client, sector, year, description, systems_used) and optional fields (summary, photo upload to Supabase Storage, YouTube embed URL). Slug auto-generated from title.

---

### Page: User Dashboard (`/user/dashboard`) — BUILT, Protected

Shows enrolled courses (from Supabase `enrollments` joined with `courses`), status pills (Active / Pending Payment), "Start Learning" links → `/courses/[slug]`, "Browse More Courses" CTA.

---

### Page: Checkout (`/checkout`) — BUILT, Protected

Two-column layout: left (order summary card + WhatsApp alternative) | right (bank transfer form). Fetches course from Supabase by slug. Bank details hardcoded:
```
Bank: Bank of Beirut
Account: Matrix Energy & Automation sarl
IBAN: LB62 0999 0000 0001 0019 2556 2007
Branch: Khaldeh Branch
```
Form fields: Account Holder Name, Bank Name, Transfer Reference (required), Notes (optional). On submit: upserts enrollment with `status: 'pending_payment'`, calls `/api/enroll` to email admin. Success screen with "My Dashboard" + "Browse More Courses" buttons.

Stripe is NOT shown in the UI (scaffolded in `/api/stripe/webhook` only).

---

### Page: Contact (`/contact`) — BUILT

Split layout: left navy card (contact info + WhatsApp button + social links) | right form (via `ContactForm.tsx` — submits to `/api/contact` → Supabase + Resend). Google Maps iframe embed below.

---

### Page: Case Studies (`/case-studies` and `/case-studies/[slug]`) — BUILT

Listing: grid of cards with full-bleed photos and gradient overlays, sector badges. Detail: article layout with project stats sidebar. Both currently use static/mock data — connect to Supabase `case_studies` table when DB has real data.

---

### Page: About (`/about`) — BUILT

Company story timeline, team placeholder cards, certifications, stats counter banner.

---

### Page: Install App (`/install`) — BUILT

Platform-specific PWA install instructions (iOS/Android/Desktop detected via user agent).

---

## DATABASE SCHEMA (Supabase)

Schema file: `src/lib/supabase/schema.sql` — run in Supabase SQL Editor.

Tables: `profiles`, `courses`, `enrollments`, `case_studies`, `contact_submissions`, `monitoring_data`

RLS policies are defined in the schema. Key rules:
- Public can read published courses
- Users see only their own enrollments and profile
- Admins (role='admin') have full access to all tables
- Monitoring data: authenticated users only

Seed file: `src/lib/seed-courses.ts` — run once to populate courses table.

---

## ACTUAL FILE STRUCTURE

```
/src
  /app
    /page.tsx                             ← Home (all 8 sections)
    /system-integrator/page.tsx           ← ✅
    /training/page.tsx                    ← ✅
    /about/page.tsx                       ← ✅
    /contact/page.tsx                     ← ✅
    /case-studies/page.tsx                ← ✅
    /case-studies/[slug]/page.tsx         ← ✅
    /install/page.tsx                     ← ✅
    /courses/page.tsx                     ← ✅ (static data + client-side filter)
    /courses/[slug]/page.tsx              ← ✅ (static dict, SSG)
    /dashboard/page.tsx                   ← ✅ (protected, IoT dashboard)
    /dashboard/layout.tsx                 ← ✅
    /user/dashboard/page.tsx              ← ✅ (protected, enrolled courses)
    /user/layout.tsx                      ← ✅
    /checkout/page.tsx                    ← ✅ (protected, bank transfer)
    /admin/page.tsx                       ← ✅ (overview + AdminSidebar component)
    /admin/layout.tsx                     ← ✅
    /admin/courses/page.tsx               ← ✅
    /admin/enrollments/page.tsx           ← ✅
    /admin/case-studies/page.tsx          ← ✅
    /auth/sign-in/page.tsx                ← ✅
    /auth/register/page.tsx               ← ✅
    /auth/callback/route.ts               ← ✅
    /auth/layout.tsx                      ← ✅
    /api/contact/route.ts                 ← ✅
    /api/enroll/route.ts                  ← ✅
    /api/stripe/webhook/route.ts          ← ✅ (scaffolded, inactive)
    /layout.tsx                           ← ✅ (fonts, PublicShell)
    /globals.css                          ← ✅ (tokens, animations, utilities)
    /favicon.ico

  /components
    /layout
      Topbar.tsx                          ← ✅
      Navbar.tsx                          ← ✅
      Footer.tsx                          ← ✅
      MobileMenu.tsx                      ← ✅
      PublicShell.tsx                     ← ✅
      FloatingWhatsApp.tsx                ← ✅
    /ui
      Button.tsx                          ← ✅
      SectionHeader.tsx                   ← ✅
    /sections
      Hero.tsx                            ← ✅
      PageHero.tsx                        ← ✅
      ServicesGrid.tsx                    ← ✅
      WhyMatrix.tsx                       ← ✅
      BrandsRow.tsx                       ← ✅
      StatsCounter.tsx                    ← ✅
      CaseStudiesPreview.tsx              ← ✅
      TrainingCTABanner.tsx               ← ✅
      ContactStrip.tsx                    ← ✅
    /forms
      ContactForm.tsx                     ← ✅

  /hooks
    useAuth.ts                            ← ✅
    useMonitoringData.ts                  ← ✅ (30s polling)
    useCountUp.ts                         ← ✅
    useInView.ts                          ← ✅

  /lib
    /supabase
      client.ts                           ← ✅
      server.ts                           ← ✅
      schema.sql                          ← ✅ (run in Supabase SQL Editor)
    utils.ts                              ← ✅ (cn(), formatPrice())
    seed-courses.ts                       ← ✅ (run once)

  /types
    database.ts                           ← ✅

/public
  manifest.json                           ← ✅
  /images
    logo.jpg                              ← ❌ NEEDED (copy from /design-reference/matrix-logo.jpg)
    icon-192.png                          ← ❌ NEEDED (PWA icon)
    icon-512.png                          ← ❌ NEEDED (PWA icon)

/middleware.ts                            ← ✅ (full route protection)
/next.config.ts                           ← ✅ (Supabase image domains; PWA pending)
/design-reference/                        ← ✅ all HTML design files
```

---

## ENVIRONMENT VARIABLES

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email (Resend)
RESEND_API_KEY=your_resend_key
CONTACT_EMAIL_TO=info@matrixea.co

# Stripe (scaffold — leave empty until activated)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=https://matrixea.co
NEXT_PUBLIC_WHATSAPP_NUMBER=9611277663
```

---

## PWA CONFIGURATION

`public/manifest.json` is complete. The service worker is NOT yet wired.

When deploying to Vercel:
1. Switch `next dev --turbo` to `next dev` (webpack mode) to enable `@ducanh2912/next-pwa`
2. OR use a standalone `public/sw.js` with a simple cache-first strategy
3. Wire `next.config.ts` with the `withPWA` wrapper below:

```ts
import withPWA from '@ducanh2912/next-pwa'

const nextConfig = withPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: { disableDevLogs: true },
})({
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.in' },
    ],
  },
})

export default nextConfig
```

---

## ANIMATION PATTERNS

All keyframes are defined in `globals.css`. Use the utility classes:

```css
.animate-pulse-red   { animation: pulse-red   2.2s infinite; }
.animate-pulse-green { animation: pulse-green 2.2s infinite; }
.animate-pulse-blue  { animation: pulse-blue  2.2s infinite; }
.animate-fade-in-up  { animation: fade-in-up 0.6s ease forwards; }
.animate-fade-in     { animation: fade-in    0.4s ease forwards; }

/* Scroll reveal */
.reveal { opacity: 0; transform: translateY(32px); transition: opacity .7s ease, transform .7s ease; }
.reveal.in-view { opacity: 1; transform: translateY(0); }

/* Circuit overlay */
.circuit-grid { /* 40px grid lines in blue at 4% opacity */ }
.circuit-grid-subtle { /* 60px grid at 2.5% */ }
```

For scroll-triggered animations, use the `useInView` hook which adds `.in-view` class when element enters viewport.

**Staggered card animations:** `style={{ transitionDelay: `${index * 80}ms` }}`

**Counter animation:** `useCountUp` hook — ease-out cubic over 1400ms, triggers via `useInView`.

---

## RESPONSIVE BREAKPOINTS

```
sm: 640px   — mobile
md: 768px   — tablet portrait
lg: 1024px  — tablet landscape / small desktop
xl: 1280px  — desktop
2xl: 1536px — wide desktop
```

In Tailwind v4, use `max-[900px]:` syntax for non-standard breakpoints (as already done throughout the codebase).

Key responsive behaviors:
- Nav: hamburger at < 1024px
- Hero: decorative ::after panel hidden at < 900px
- Service cards: 3-col → 2-col (md) → 1-col (sm)
- Course cards: 3-col → 2-col (md) → 1-col (sm)
- Dashboard grid: 2fr/1fr → 1-col (< 980px)
- KPI row: 4-col → 2-col (< 900px)
- Motor grid: 3-col → 2-col (< 760px)
- Footer: 3-col → 1-col (md)
- Section padding: 110px → 72px (< 768px) via `.section-pad` utility class

---

## COURSE ENROLLMENT FLOW

```
1. User browses /courses → clicks a course → /courses/[slug]
2. Detail page shows price + "Enroll Now" button
3. "Enroll Now" href → /auth/sign-in?redirect=/checkout?course=[slug]
4. After sign-in, middleware allows /checkout → ?course=[slug] passed via searchParams
5. Checkout page fetches course from Supabase by slug
6. User fills bank transfer form (account name, bank, reference number)
7. On submit: upserts enrollment (status: 'pending_payment') + POST /api/enroll (Resend email to admin)
8. Success screen shown. Redirect to /user/dashboard available.
9. Admin logs into /admin/enrollments → changes status to 'active'
10. Student sees course as active in /user/dashboard
```

---

## STATIC CONTENT THAT MUST BE EXACT

### Contact Info (hardcoded everywhere, not from DB):
- Phone: `+961 1 277 663`
- Email: `info@matrixea.co`
- Address: `3rd Floor, MUC University Bldg, Khaldeh Round About, Beirut — Lebanon`
- Hours: `Mon–Sat 09:00 – 20:00 · Sunday Closed`
- WhatsApp: `https://wa.me/96171483747`
- Facebook: `#` (placeholder until real URL given)
- Instagram: `#`
- TikTok: `#`
- LinkedIn: `#`

### Company Stats (hardcoded):
- `1200+` Projects
- `800+` Clients
- `21` Years Experience
- `99%` Satisfaction

### Bank Details (hardcoded in checkout page):
- Bank: `Bank of Beirut`
- Account: `Matrix Energy & Automation sarl`
- IBAN: `LB62 0999 0000 0001 0019 2556 2007`
- Currency: `USD`
- Branch: `Khaldeh Branch`

### Company Description:
"With 21 years of specialized experience, we serve manufacturing, process, energy, water/wastewater, packaging, and OEM clients across Saudi Arabia, Iraq and Africa. Our services include turnkey integration, 24/7 maintenance, legacy migrations, cybersecurity hardening, and hands-on training."

### Brands:
Siemens | ABB | Allen Bradley | Delta | Veichi

---

## REMAINING WORK (what still needs to be done)

In priority order:

1. **Copy logo image:** `cp design-reference/matrix-logo.jpg public/images/logo.jpg` — fixes broken logo across entire site
2. **Create PWA icons:** Generate `icon-192.png` and `icon-512.png` from the logo, place in `public/images/`
3. ~~**Admin case studies page:**~~ ✅ Built — `/admin/case-studies/page.tsx`
4. **Wire PWA service worker:** Add `withPWA` wrapper to `next.config.ts` when switching to webpack mode for production build
5. **Deploy to Vercel:** Connect repo, set all env vars, connect Supabase project via Vercel integration
6. **Real case study data:** Seed `case_studies` table and make the listing/detail pages fetch from Supabase instead of using static mock data
7. **Supabase → course detail (optional):** Refactor `/courses/[slug]/page.tsx` to fetch from Supabase `courses` table instead of using the static dict, if admin-editable courses are needed

---

## CRITICAL RULES FOR CLAUDE CODE

1. **Follow the HTML files in `/design-reference/` as pixel-perfect truth.** When in doubt, extract exact CSS values from the design files.
2. **Never use `rounded-lg` or similar** — all radii are `rounded-[2px]` (sharp industrial).
3. **Never add amber/orange as a primary accent** — the accent is **blue `#1B6FCC`**. Amber `#FFB200` is **warning state only**.
4. **The topbar is light gray** (`#F4F6FA`), not amber. The nav is dark navy (`#2A2F3A`).
5. **Typography hierarchy is strict** — Barlow Condensed for headings, DM Sans for body, JetBrains Mono for numbers/data only.
6. **All section padding is 110px 0** on desktop — use the `.section-pad` utility class or `py-[110px]`.
7. **Cards never have border-radius** except 2px. No soft shadows — use precise values like `0 4px 16px rgba(0,0,0,0.08)`.
8. **Supabase Auth only** — no NextAuth, no Clerk. Use `@supabase/ssr` for all server-side auth.
9. **Protect routes via middleware.ts** — never rely on client-side auth checks for security.
10. **Tailwind v4 syntax** — no `tailwind.config.ts`. Add colors/fonts via `@theme inline` in `globals.css`. Use `max-[900px]:` for arbitrary breakpoints.
11. **Image placeholders:** Use a dark gradient with `.circuit-grid` overlay when real photos are not available.
12. **All buttons are uppercase** with `letter-spacing: 0.04em` and `font-weight: 600`.
13. **Nav link hover:** underline grows from left (width 0 → 100%, 200ms ease) using `::after` pseudo-element.
14. **Mobile menu:** full-screen overlay with navy background, links stagger-fade in.
15. **Float WhatsApp button:** Fixed bottom-right, present on all public pages via `PublicShell`.
16. **`AdminSidebar` is exported from `/admin/page.tsx`** — import it from there in all admin sub-pages.
17. **Course data is static in the page file** — to edit course content, modify the `COURSES` dict in `src/app/courses/[slug]/page.tsx` and the courses array in `src/app/courses/page.tsx`.

---

## VERCEL DEPLOYMENT

```
- Connect GitHub repo to Vercel
- Add all .env.local variables to Vercel Environment Variables
- Set NEXT_PUBLIC_APP_URL to https://matrixea.co
- Framework preset: Next.js (auto-detected)
- Build command: next build
- Install the Vercel-Supabase integration from Vercel marketplace for automatic env sync
- For PWA: add withPWA wrapper to next.config.ts (see PWA section above)
```

---

*Last updated: 2026-05-16. Reflects actual built state of the codebase.*
