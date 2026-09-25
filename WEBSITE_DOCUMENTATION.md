# Kezera Tech Website — Complete Technical Documentation
### Version 2.0 — Fully Updated

> This document explains everything about how the Kezera Tech website was built,
> from the tools used to every page, feature, and database table.
> Written so that anyone reading it can understand the codebase from zero.

---

## Table of Contents

1. [What Kind of Website Is This?](#1-what-kind-of-website-is-this)
2. [The Technology Stack](#2-the-technology-stack)
3. [All Packages and Why They Were Included](#3-all-packages-and-why-they-were-included)
4. [Complete Project Folder Structure](#4-complete-project-folder-structure)
5. [How Next.js App Router Works](#5-how-nextjs-app-router-works)
6. [The Database — Supabase](#6-the-database--supabase)
7. [All Database Tables (22 Tables)](#7-all-database-tables-22-tables)
8. [Authentication System](#8-authentication-system)
9. [Maintenance Mode System](#9-maintenance-mode-system)
10. [The Public Website — All Pages](#10-the-public-website--all-pages)
11. [The Admin Dashboard — All Sections](#11-the-admin-dashboard--all-sections)
12. [Shared Components](#12-shared-components)
13. [How Styling Works](#13-how-styling-works)
14. [Environment Variables](#14-environment-variables)
15. [How Data Flows Through the App](#15-how-data-flows-through-the-app)
16. [Row Level Security (RLS)](#16-row-level-security-rls)
17. [API Routes](#17-api-routes)
18. [SEO, Sitemap and Robots](#18-seo-sitemap-and-robots)
19. [Social Media Integration](#19-social-media-integration)
20. [Dynamic Icon System](#20-dynamic-icon-system)
21. [Key Code Patterns](#21-key-code-patterns)
22. [How to Read Any File in This Project](#22-how-to-read-any-file-in-this-project)
23. [Admin Dashboard — Complete User Guide](#23-admin-dashboard--complete-user-guide)
24. [Glossary](#24-glossary)

---

## 1. What Kind of Website Is This?

This is a **full-stack company website** for Kezera Tech with two distinct parts:

**Part 1 — The Public Website** (`https://kezeratech.com`)
What visitors see. It includes:
- Homepage with live sections: services, projects, products, industries, testimonials, news previews, blog previews, advertisements
- Individual detail pages for every service, project, product, blog article, and news article
- Contact form, quote request form, careers page with job listings and application form
- About, Industries, FAQ, News, Blog, Privacy Policy, Terms, Cookie Policy pages
- Maintenance page shown to visitors when the site is under maintenance

**Part 2 — The Admin Dashboard** (`https://kezeratech.com/admin`)
A private section only accessible to logged-in admins. It allows full management of all website content without touching any code. The admin session persists in localStorage so you stay logged in between visits.

These two parts share the same Supabase database. The admin writes data, the public website reads it.

---

## 2. The Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Next.js | 13.5.1 | Routing, rendering, API routes |
| Language | TypeScript | 5.2.2 | Type safety across all files |
| Styling | Tailwind CSS | 3.3.3 | Utility-first CSS framework |
| UI Components | Radix UI + shadcn/ui | Various | Accessible base components |
| Database | Supabase (PostgreSQL) | 2.58.0 | Database, auth, file storage |
| Icons | Lucide React | 0.446.0 | SVG icon library |
| Fonts | Inter + Manrope | via next/font | Body text and headings |
| Animations | tailwindcss-animate | 1.0.7 | CSS animation utilities |
| Notifications | Sonner | 1.5.0 | Toast popup messages |
| Date handling | date-fns | 3.6.0 | Date formatting |
| Form handling | react-hook-form | 7.53.0 | Form state management |
| Validation | Zod | 3.23.8 | Data schema validation |
| Theme | next-themes | 0.3.0 | Dark/light mode |
| Middleware | Next.js Middleware | built-in | Maintenance mode redirects |
| Hosting target | Vercel / Netlify | — | Deployment platforms |

---

## 3. All Packages and Why They Were Included

### Core Framework

**`next` (13.5.1)**
The foundation of the entire project. Provides:
- File-based routing (each `page.tsx` = one URL)
- Server-side rendering for SEO
- API routes (backend code inside the same project)
- Middleware (code that runs before every request)
- Image and font optimization

**`react` and `react-dom` (18.2.0)**
The UI library Next.js builds on. Everything visible is a React component.

**`typescript` (5.2.2)**
Adds types to JavaScript. Every file ends in `.tsx` (TypeScript + JSX).
Catches errors at development time before they reach the browser.

---

### Styling

**`tailwindcss` (3.3.3)**
Style directly in JSX using class names:
```tsx
<div className="flex items-center gap-4 rounded-lg border p-6 bg-card">
```
No separate CSS files needed for most styling.

**`tailwindcss-animate` (1.0.7)**
Adds animation classes like `animate-fade-in`, `animate-spin`, `animate-pulse`.
Used for loading skeletons, hero animations, and the pulsing dot indicators.

**`autoprefixer` + `postcss`**
Required build tools for Tailwind CSS to function correctly.

**`class-variance-authority` (cva)**
Powers the variant system in shadcn/ui components.
Allows `Button` to have `variant="default"`, `variant="outline"`, `variant="destructive"` etc.

**`clsx` + `tailwind-merge`**
Combined in the `cn()` utility function used throughout the project:
```typescript
// lib/utils.ts
export function cn(...inputs) {
  return twMerge(clsx(inputs)); // combines and deduplicates Tailwind classes
}
```

---

### UI Components (Radix UI)

All `@radix-ui/react-*` packages are accessible, unstyled UI primitives.
shadcn/ui wraps them with Tailwind styling. You own the component code in `components/ui/`.

| Package | Used for |
|---|---|
| `react-accordion` | FAQ accordion expand/collapse |
| `react-alert-dialog` | Delete confirmation popups in admin |
| `react-dialog` | Add/Edit modals in admin |
| `react-dropdown-menu` | Dropdown menus |
| `react-label` | Accessible form labels |
| `react-select` | Dropdown select fields |
| `react-switch` | Toggle switches (Published, Active, Visible) |
| `react-tabs` | Settings page tabs |
| `react-slot` | Powers Button's `asChild` prop |
| `react-toast` | Base toast (superseded by Sonner) |

---

### Database and Backend

**`@supabase/supabase-js` (2.58.0)**
The official Supabase client. Used for:
- All database queries: `supabase.from('table').select()`
- Authentication: `supabase.auth.signInWithPassword()`
- File storage: `supabase.storage.from('media').upload()`

There are two ways it is initialized in this project:
1. **Browser client** (`lib/supabase.ts`) — uses the anon key, has RLS restrictions
2. **Server client** (created inline in API routes) — uses the service role key, bypasses RLS

---

### Icons

**`lucide-react` (0.446.0)**
1000+ clean SVG icons. Used everywhere.
The `DynamicIcon` component (`components/dynamic-icon.tsx`) maps icon name strings to their components so admin users can type icon names like `Globe` or `HeartPulse` in forms.

---

### Forms and Validation

**`react-hook-form` (7.53.0)** — Efficient form state management
**`@hookform/resolvers` (3.9.0)** — Connects react-hook-form with Zod
**`zod` (3.23.8)** — Schema-based data validation

---

### Utilities

**`date-fns` (3.6.0)** — Date formatting throughout the site
```tsx
format(new Date(post.publish_date), 'MMMM d, yyyy') // → "September 10, 2026"
```

**`sonner` (1.5.0)** — Toast notifications
```tsx
toast.success('Message sent!');
toast.error('Failed to save: column not found');
```

**`next-themes` (0.3.0)** — Dark/light mode with localStorage persistence

---

## 4. Complete Project Folder Structure

```
projectdashboardincluded/
│
├── app/                              # All pages (Next.js App Router)
│   ├── layout.tsx                    # Root layout — fonts, theme, toaster
│   ├── page.tsx                      # Homepage (/)
│   ├── globals.css                   # CSS variables, custom utilities
│   ├── robots.ts                     # /robots.txt — SEO crawler rules
│   ├── sitemap.ts                    # /sitemap.xml — dynamic sitemap
│   ├── not-found.tsx                 # Custom 404 page
│   │
│   ├── about/page.tsx                # /about
│   ├── blog/
│   │   ├── page.tsx                  # /blog (article list)
│   │   └── [slug]/page.tsx           # /blog/article-slug (detail)
│   ├── careers/
│   │   ├── page.tsx                  # /careers (job listings)
│   │   └── [id]/page.tsx             # /careers/job-id (apply)
│   ├── contact/page.tsx              # /contact
│   ├── cookie-policy/page.tsx        # /cookie-policy
│   ├── faq/page.tsx                  # /faq
│   ├── industries/page.tsx           # /industries
│   ├── maintenance/page.tsx          # /maintenance (shown in maintenance mode)
│   ├── news/
│   │   ├── page.tsx                  # /news (article list)
│   │   └── [slug]/page.tsx           # /news/article-slug (detail)
│   ├── privacy/page.tsx              # /privacy
│   ├── products/
│   │   ├── page.tsx                  # /products (list)
│   │   └── [slug]/page.tsx           # /products/product-slug (detail)
│   ├── projects/
│   │   ├── page.tsx                  # /projects (list)
│   │   └── [slug]/page.tsx           # /projects/project-slug (detail)
│   ├── request-a-quote/page.tsx      # /request-a-quote
│   ├── services/
│   │   ├── page.tsx                  # /services (list)
│   │   └── [slug]/page.tsx           # /services/service-slug (detail)
│   ├── terms/page.tsx                # /terms
│   │
│   ├── admin/                        # Admin dashboard (auth protected)
│   │   ├── layout.tsx                # Admin layout wrapper (adds AuthProvider)
│   │   ├── page.tsx                  # /admin — dashboard home with live stats
│   │   ├── login/page.tsx            # /admin/login
│   │   ├── settings/page.tsx         # /admin/settings
│   │   ├── services/page.tsx         # /admin/services
│   │   ├── projects/page.tsx         # /admin/projects
│   │   ├── products/page.tsx         # /admin/products
│   │   ├── industries/page.tsx       # /admin/industries
│   │   ├── blog/
│   │   │   ├── page.tsx              # /admin/blog (post list)
│   │   │   ├── new/page.tsx          # /admin/blog/new (create)
│   │   │   └── [id]/edit/page.tsx    # /admin/blog/:id/edit
│   │   ├── news/
│   │   │   ├── page.tsx              # /admin/news (article list)
│   │   │   ├── new/page.tsx          # /admin/news/new (create)
│   │   │   └── [id]/edit/page.tsx    # /admin/news/:id/edit
│   │   ├── advertisements/page.tsx   # /admin/advertisements
│   │   ├── faqs/page.tsx             # /admin/faqs
│   │   ├── testimonials/page.tsx     # /admin/testimonials
│   │   ├── messages/page.tsx         # /admin/messages
│   │   ├── quotes/page.tsx           # /admin/quotes
│   │   ├── newsletter/page.tsx       # /admin/newsletter
│   │   ├── applications/page.tsx     # /admin/applications
│   │   └── media/page.tsx            # /admin/media
│   │
│   └── api/                          # Server-side API routes
│       ├── newsletter/route.ts       # POST /api/newsletter
│       └── maintenance/route.ts      # GET /api/maintenance
│
├── components/                       # Reusable UI components
│   ├── navbar.tsx                    # Top navigation bar
│   ├── footer.tsx                    # Site footer (dynamic from Supabase)
│   ├── page-hero.tsx                 # Hero banner with breadcrumb
│   ├── section-heading.tsx           # Reusable section title
│   ├── hero-animation.tsx            # Animated hero background
│   ├── kezera-logo.tsx               # Logo SVG components
│   ├── dynamic-icon.tsx              # Renders Lucide icons by name string
│   │
│   ├── ui/                           # shadcn/ui components (you own the code)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── switch.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── label.tsx
│   │   ├── accordion.tsx
│   │   └── ... (more)
│   │
│   └── admin/
│       ├── admin-layout.tsx          # Sidebar + topbar + auth protection
│       └── admin-table.tsx           # Reusable data table for admin pages
│
├── lib/                              # Utility and configuration files
│   ├── supabase.ts                   # Supabase client (with localStorage session)
│   ├── auth-context.tsx              # React Context for auth state
│   ├── site-data.ts                  # Static data: nav links, approach steps, etc.
│   └── utils.ts                      # cn() helper and other utilities
│
├── middleware.ts                     # Maintenance mode redirect middleware
│
├── supabase/
│   └── migrations/
│       ├── 20260909122007_kezera_tech_schema.sql   # Core 20-table schema
│       ├── 20260910_add_mission_vision.sql          # Adds mission/vision columns
│       └── 20260910_advertisements_news.sql         # Advertisements + News tables
│
├── public/                           # Static files served directly
│
├── .env                              # Environment variables (secret keys)
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies
```

---

## 5. How Next.js App Router Works

Every `page.tsx` inside `app/` becomes a URL:

| File | URL |
|---|---|
| `app/page.tsx` | `kezeratech.com/` |
| `app/about/page.tsx` | `kezeratech.com/about` |
| `app/news/page.tsx` | `kezeratech.com/news` |
| `app/news/[slug]/page.tsx` | `kezeratech.com/news/any-slug` |
| `app/admin/page.tsx` | `kezeratech.com/admin` |
| `app/api/newsletter/route.ts` | `POST kezeratech.com/api/newsletter` |

### Dynamic Routes `[slug]` and `[id]`

The square brackets mean that part of the URL is a variable:
- `/blog/how-we-built-this` → `slug = "how-we-built-this"`
- `/careers/abc-123` → `id = "abc-123"`

Inside the page: `const { slug } = useParams<{ slug: string }>();`
Then query Supabase using that slug to get the right record.

### Layout Files

`layout.tsx` files wrap all pages inside their folder:
- `app/layout.tsx` → wraps EVERY page (fonts, theme, toaster)
- `app/admin/layout.tsx` → wraps every admin page (adds `AuthProvider`)

### `'use client'`

Most pages in this project have `'use client'` at the top.
This is required when a component uses React hooks (`useState`, `useEffect`) or browser events (`onClick`). Without it, Next.js tries to render the component on the server where those don't exist.

---

## 6. The Database — Supabase

Supabase provides:
1. **PostgreSQL database** — stores all content
2. **Authentication** — handles admin login with JWT sessions
3. **Row Level Security (RLS)** — controls who reads/writes each table
4. **Storage** — hosts uploaded files (images, documents) in the `media` bucket
5. **Auto-generated REST API** — every table automatically gets a REST endpoint

### Supabase Client (`lib/supabase.ts`)

```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'kezera-admin-auth', // session key in localStorage
  },
});
```

The session is stored in `localStorage` under the key `kezera-admin-auth`.
This means you stay logged into the admin dashboard until you explicitly sign out —
even if you close the browser tab or navigate away.

### The Two API Keys

| Key | Where used | Access level |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser — all pages | Limited by RLS policies |
| `SUPABASE_SERVICE_ROLE_KEY` | Server API routes only | Full access, bypasses RLS |

---

## 7. All Database Tables (22 Tables)

### Original 20 Tables (from core schema)

| Table | Purpose | Public access |
|---|---|---|
| `site_settings` | Company name, tagline, description, mission, vision, email, phone, address, business hours, social links, SEO, maintenance mode | Read always |
| `services` | Service catalog | Read if `is_published = true` |
| `projects` | Portfolio case studies | Read if `is_published = true` |
| `products` | Product catalog | Read if `is_published = true` |
| `industries` | Industries served | Read if `is_published = true` |
| `blog_posts` | Blog articles (has `category` column added via migration) | Read if `is_published = true` |
| `blog_categories` | Blog category labels | Read always |
| `blog_tags` | Blog tag labels | Read always |
| `team_members` | Team profiles | Read if `is_published = true` |
| `testimonials` | Client testimonials | Read if `is_visible = true` |
| `faqs` | FAQ questions | Read if `is_published = true` |
| `contact_messages` | Contact form submissions | Insert only (public), Full CRUD (admin) |
| `quote_requests` | Quote form submissions | Insert only (public), Full CRUD (admin) |
| `job_positions` | Job listings | Read if `is_published = true` |
| `job_applications` | Job applications | Insert only (public), Full CRUD (admin) |
| `newsletter_subscribers` | Email subscribers | Insert only (public), Full CRUD (admin) |
| `media_items` | Media library metadata | Read always |
| `navigation_items` | Nav menu config | Read always |
| `audit_logs` | Admin action history | Admin only |
| `tech_stack` | Technology display | Read if `is_published = true` |

### Added via Migrations

**`site_settings` additions** (`20260910_add_mission_vision.sql`)
- `mission text` — company mission statement
- `vision text` — company vision statement

**`advertisements`** (`20260910_advertisements_news.sql`)
New table for homepage promotional banners:

| Column | Type | Purpose |
|---|---|---|
| `title` | text | Main heading of the ad |
| `subtitle` | text | Secondary line below title |
| `description` | text | Short promotional message |
| `image_url` | text | Optional image shown in the ad |
| `cta_label` | text | Button text (e.g. "Learn More") |
| `cta_href` | text | Button link (page path or URL) |
| `badge_text` | text | Small badge label (e.g. "NEW", "50% OFF") |
| `bg_color` | text | Tailwind gradient class for background |
| `is_active` | boolean | Whether shown on website |
| `sort_order` | int | Display order when multiple ads exist |
| `starts_at` | timestamptz | Optional start date/time |
| `ends_at` | timestamptz | Optional end date/time |

**`news`** (`20260910_advertisements_news.sql`)
New table for company news and announcements:

| Column | Type | Purpose |
|---|---|---|
| `title` | text | Article headline |
| `slug` | text | URL-friendly identifier (unique) |
| `excerpt` | text | Short summary shown in listings |
| `content` | text | Full article body |
| `featured_image_url` | text | Hero image URL |
| `author` | text | Author name |
| `category` | text | Category label (e.g. Announcement) |
| `tags` | jsonb | Array of tag strings |
| `is_published` | boolean | Whether visible on website |
| `is_featured` | boolean | Whether shown as hero at top of news page |
| `publish_date` | timestamptz | When to show the article |
| `seo_title` | text | SEO page title |
| `seo_description` | text | SEO meta description |

---

## 8. Authentication System

The admin login system is built entirely on Supabase Auth.

### Files Involved

**`lib/auth-context.tsx`** — React Context that provides auth state to all admin pages:
- `user` — logged in user object (null if not logged in)
- `loading` — true while checking session on page load
- `signIn(email, password)` — calls `supabase.auth.signInWithPassword()`
- `signOut()` — calls `supabase.auth.signOut()` and clears state

**How session persistence works:**
```
Page loads
  → supabase.auth.getSession() checks localStorage for saved JWT token
  → If valid token found → user is restored, no login needed
  → If no token → user is null → redirected to /admin/login

Sign in
  → Supabase validates credentials
  → Returns JWT token
  → Token saved to localStorage under 'kezera-admin-auth'
  → User stays logged in until Sign Out is clicked or token expires (~1 week)
```

**`components/admin/admin-layout.tsx`** — Enforces auth on every admin page:
```
Is this the login page?  → render it directly, no auth check
Is auth still loading?   → show spinner with logo
User is null?            → router.replace('/admin/login') + show spinner
User is logged in?       → show full sidebar layout
```

**`app/admin/login/page.tsx`** — The login form. Calls `signIn(email, password)`.
On success, Next.js router navigates to `/admin` automatically via the auth state change.

---

## 9. Maintenance Mode System

Maintenance mode allows the admin to take the public website offline for visitors while keeping the admin dashboard accessible.

### How It Works

Three files work together:

**`app/api/maintenance/route.ts`** — Server API endpoint:
- Queries `site_settings.maintenance_mode` and `maintenance_message` from Supabase
- Returns JSON with `{ maintenance_mode: boolean, maintenance_message: string }`
- Uses `Cache-Control: no-store` so changes take effect instantly
- Uses the service role key so it always has database access

**`middleware.ts`** — Runs before every public page request:
```
Request comes in for /about
  → Is it an admin/api/maintenance path? → bypass, serve normally
  → Call /api/maintenance to check the DB setting
  → maintenance_mode = true? → redirect to /maintenance
  → maintenance_mode = false? → serve the page normally
```

Bypass paths (always accessible even in maintenance mode):
- `/admin` and all admin pages
- `/api/maintenance` (the check itself)
- `/api/` (all API routes)
- `/maintenance` (the maintenance page itself)
- `/_next` (Next.js assets)

**`app/maintenance/page.tsx`** — The maintenance page visitors see:
- Displays the Kezera Tech logo and mark
- Shows the custom message you set in Admin → Settings → System
- Shows the company email for contact
- Has an animated pulsing "Under Maintenance" badge

### How to Enable/Disable

1. Go to **Admin → Settings → System tab**
2. Toggle **Maintenance Mode** ON or OFF
3. Update the **Maintenance Message** if needed
4. Click **Save System Settings**
5. Changes take effect immediately on the next visitor page load

---

## 10. The Public Website — All Pages

### Homepage (`/`)

The most complex page. Fetches 8 data sources in parallel using `Promise.all`:

```typescript
Promise.all([
  services (published, ordered, limit 6),
  projects (published, ordered, limit 4),
  products (published, ordered, limit 3),
  blog_posts (published, by date desc, limit 3),
  industries (published, ordered, limit 10),
  site_settings (company_name, tagline, description),
  testimonials (visible, ordered, limit 6),
  advertisements (active, ordered, limit 5),
])
```

**Homepage sections in order:**
1. **Hero** — animated headline, CTA buttons, "01 Ideas / 02 Technology / 03 Impact"
2. **Advertisements** — live banner strip (only shown when active ads exist)
3. **Who We Are** — company description from `site_settings`
4. **Services** — live grid from `services` table
5. **Featured Projects** — live grid from `projects` table
6. **Why Kezera Tech** — static from `lib/site-data.ts`
7. **Our Approach** — static 7-step process from `lib/site-data.ts`
8. **Technology** — static tech stack from `lib/site-data.ts`
9. **Products** — live list from `products` table
10. **Industries** — live grid from `industries` table
11. **Testimonials** — live grid from `testimonials` table
12. **News Preview** — live 3-article preview from `news` table (hidden when empty)
13. **Blog/Insights** — live 3-article preview from `blog_posts` table
14. **CTA Banner** — "Have an idea? Let's build it." gradient section

Every section shows a clean empty state (placeholder card) when no data exists.
The Advertisements section and News preview section are completely hidden when empty — they don't take up space.

### About (`/about`)

Loads `company_name`, `description`, `mission`, `vision` from `site_settings`.
Displays company values (static — 4 cards) and the mission/vision cards dynamically.
Falls back to sensible default text if Supabase returns nothing.

### Services (`/services` and `/services/[slug]`)

**List page** — Loads all published services from Supabase. Shows loading skeleton, then a grid of service cards. Each card links to the detail page.

**Detail page** — Loads the full service record by slug. Renders:
- Title, description (full_description or short_description)
- Benefits grid (from `benefits` JSONB array)
- Technologies used (from `technologies` JSONB array)
- Process steps (from `process` JSONB array of `{step, description}` objects)
- CTA button — if `cta_href` contains `@` it opens as `mailto:` link, otherwise as page link

### Projects (`/projects` and `/projects/[slug]`)

**List page** — Published projects grid with industry tags, project type badges, featured flag.

**Detail page** — Full case study with challenge, solution, result in three columns.
Shows images (from `images` JSONB array), technologies, project and GitHub links.

### Products (`/products` and `/products/[slug]`)

**List page** — Each product shown as a horizontal card with availability badge (Coming Soon / In Development / Available).

**Detail page** — Logo, availability badge, description, features grid, technologies, download/documentation/website links, screenshots gallery.

### Blog (`/blog` and `/blog/[slug]`)

**List page** — Published articles in a 3-column grid with featured image, date, author, excerpt, tags.

**Detail page** — Full article with featured image, content rendered paragraph by paragraph, tags.

### News (`/news` and `/news/[slug]`)

**List page** — Has a **featured article hero** at the top (the article with `is_featured = true`).
Below that: category filter buttons, article grid.
Category filter uses client-side filtering — no extra API call.

**Detail page** — Same structure as blog detail, plus a **Related Articles** section at the bottom showing other articles from the same category.

### Advertisements (Homepage only)

Active advertisements appear as banner strips between the hero and the "Who We Are" section.
Each banner shows:
- Optional image (small, left side)
- Badge text (e.g. "NEW", "LIMITED")
- Title and subtitle
- Description text
- CTA button (external links open in new tab, internal links use Next.js router)

Background colors are Tailwind gradient classes selected in the admin.

### Contact (`/contact`)

- Loads email, phone, address, business_hours from `site_settings`
- Form fields: Name*, Email*, Phone, Company, Message*
- On submit: saves to `contact_messages` with `status: 'new'`, `is_read: false`
- Shows success screen after submission
- "Send another message" button fully resets all form fields

### Request a Quote (`/request-a-quote`)

- Full project brief form with 12 fields
- Required: Name, Email, Project Type, Description
- Optional: Phone, Company, Industry, Website, Goals, Features, Budget, Timeline
- On submit: saves all fields to `quote_requests` with `status: 'new'`, `is_read: false`
- "Submit another request" button fully resets all 12 form fields

### Careers (`/careers` and `/careers/[id]`)

**List page** — Loads open, published job positions. Shows title, department badge, location, employment type, deadline, description preview, and "Apply now" button.

**Detail/Application page** — Shows full job details (responsibilities, requirements, preferred skills).
On the right side: application form with name, email, phone, CV URL, portfolio URL, LinkedIn URL, cover letter.
On submit: saves to `job_applications` with the `job_position_id` linked to the position.

### FAQ (`/faq`)

Loads published FAQs from Supabase ordered by `sort_order`.
Groups questions by category if multiple categories exist.
Uses Radix UI Accordion for expand/collapse.

### Industries (`/industries`)

Grid of published industries with dynamic icon (Lucide name or emoji) and description.

### Maintenance (`/maintenance`)

Shown automatically to visitors when maintenance mode is ON.
Shows logo, company name, custom message from settings, pulsing "Under Maintenance" badge, and company email link.
Admin paths remain accessible.

### Legal Pages

- `/privacy` — Full Privacy Policy
- `/terms` — Full Terms & Conditions
- `/cookie-policy` — Full Cookie Policy with cookie table

All legal pages are static (no database queries needed).

---

## 11. The Admin Dashboard — All Sections

Access: `https://kezeratech.com/admin`
Session: Persists in localStorage until Sign Out is clicked.

### Sidebar Navigation Structure

```
Dashboard
│
Content ▼
  ├── Blog Posts
  ├── FAQs
  ├── Testimonials
  └── News
│
Marketing
  └── Advertisements
│
Business
  ├── Services
  ├── Projects
  ├── Products
  └── Industries
│
Communication
  ├── Messages
  ├── Quote Requests
  ├── Newsletter
  └── Job Applications
│
System
  ├── Media Library
  └── Settings
```

### Dashboard (`/admin`)

Fetches live counts from 8 tables and displays them as stat cards.
Also fetches the 5 most recent Messages and Quote Requests for the Recent Activity panels.
Unread items show a colored dot indicator.

### Content → Blog Posts

- **List** — Title, author, status (published/draft), publish date. Publish/Unpublish toggle, edit link, delete.
- **New Article** (`/admin/blog/new`) — Two-column layout: main content (title, slug, excerpt, content, image) + sidebar (author, category, tags, publish date, SEO). Save as Draft or Publish.
- **Edit Article** (`/admin/blog/:id/edit`) — Same layout, pre-filled with existing data.

**Important:** Image URLs must be pasted from the Media Library. Upload in Media → copy URL → paste here.

### Content → FAQs

Full CRUD — add, edit, delete, publish/unpublish.
Category field groups questions on the public FAQ page.
Sort Order controls display sequence.

### Content → Testimonials

Full CRUD — add, edit, delete, show/hide.
Star rating selector (click stars to set 1–5).
Profile image URL (upload in Media first).
Sort Order controls display sequence on homepage.

### Content → News

- **List** — Title, category, author, status, featured flag, date. Publish/Unpublish, Feature/Unfeature, edit, delete.
- **New Article** (`/admin/news/new`) — Same layout as blog. Has Featured Article toggle — only one article should be featured at a time (it becomes the hero on the news page).
- **Edit Article** (`/admin/news/:id/edit`) — Pre-filled edit form.

### Marketing → Advertisements

Full CRUD for homepage banner ads.

**Fields:**
- Title, Subtitle, Badge Text (e.g. "NEW", "50% OFF")
- Description — short promotional message
- Image URL — optional small image shown on the left of the banner
- CTA Label + CTA Link — button text and destination
- Background Color — click one of 7 color presets
- Start Date / End Date — optional scheduled display window
- Sort Order — order when multiple ads are active
- Active toggle — master switch to show/hide on homepage

### Business → Services, Projects, Products, Industries

All four follow the same CRUD pattern:
- List with search, publish toggle, edit, delete
- Add/Edit modal or page with all fields
- Published toggle controls visibility on the public website
- Sort Order controls display order

**Services fields:** title, slug (auto), icon (Lucide name), short description, full description, CTA label, CTA link, SEO title, SEO description, published, featured, sort order

**Projects fields:** title, slug, client, industry, project type, description, challenge, solution, result, project URL, GitHub URL, completion date, SEO fields, published, featured, sort order

**Products fields:** name, slug, category, availability (Coming Soon/In Development/Available), description, full description, pricing info, website/download/documentation URLs, SEO fields, published, sort order

**Industries fields:** name, icon (Lucide name or emoji), description, sort order, published

### Communication → Messages

Read-only list of contact form submissions.
- Blue dot = unread, automatically marked read when opened
- Click eye icon to view full message details
- Status buttons: new / read / contacted / archived
- Reply via email link (opens your email client)

### Communication → Quote Requests

Same as messages but richer:
- View all 12 submitted fields
- Internal Notes — private notes visible only to admin, saves to database
- Pipeline status: new → contacted → in-discussion → proposal-sent → won / lost / archived
- Reply via email link

### Communication → Newsletter

- Three stat cards: Total Subscribers, Active, This Month
- Searchable subscriber table with name, email, subscription date
- Active toggle — deactivate individual subscribers without deleting
- Export CSV button — downloads all subscribers as a CSV file for use in email tools

### Communication → Job Applications

- Loads all applications with the linked job position title
- Indigo dot = unread, automatically marked "reviewing" when opened
- View CV URL, Portfolio URL, LinkedIn URL as clickable links
- Cover letter displayed in full
- Status pipeline: new → reviewing → shortlisted → interviewed → hired / rejected

### System → Media Library

File storage using Supabase Storage (requires `media` bucket in Supabase → Storage → Buckets).

- **Upload** — click Upload File, choose image/video/PDF/document
- **Preview** — images show as thumbnails, other files show file type icon
- **Copy URL** — hover any file, click copy icon → URL copied to clipboard
- **Open** — opens file in new browser tab
- **Delete** — with confirmation dialog
- **Search** — filter by filename
- File size displayed under each file

**How to use image URLs:**
1. Upload image in Media Library
2. Hover the image → click copy icon
3. Paste the URL into any image field (blog featured image, service icon, product logo, advertisement image, testimonial profile photo, etc.)

### System → Settings

Five tabs:

**Company tab:**
- Company Name, Tagline, Description (shown in footer and homepage)
- Mission Statement (shown on About page)
- Vision Statement (shown on About page)
- Email, Phone, Address, Business Hours (shown on contact page and footer)

**Social tab:**
- LinkedIn, GitHub, Telegram, Facebook, Instagram, YouTube, X/Twitter, TikTok
- Only platforms with a URL filled in will show icons in the footer
- Leave blank to hide that platform

**SEO tab:**
- Default SEO Title (used when page has no specific title)
- Default Meta Description
- Default OG Image URL

**Security tab:**
- Informational — authentication is managed by Supabase

**System tab:**
- Maintenance Mode toggle — when ON, all visitors see the maintenance page
- Maintenance Message — the text shown on the maintenance page

---

## 12. Shared Components

### `components/navbar.tsx`

Fixed top navigation bar. Features:
- Transparent when at page top, frosted glass when scrolled (uses `useEffect` + scroll listener)
- Active page highlighted with an underline indicator
- Dark/light mode toggle button
- "Start a Project" CTA button (links to `/request-a-quote`)
- Mobile: hamburger menu slides in from the right, closes on route change
- Links from `lib/site-data.ts` NAV_LINKS array
- Current links: About, Services, Products, Projects, **News**, Insights, Careers

### `components/footer.tsx`

Loads dynamically from Supabase `site_settings`:
- Company tagline (from `tagline` field)
- Email, phone, address (from contact fields)
- Social media icons — only displayed for platforms that have a URL configured
- Copyright line uses `company_name` from settings
- Services column — loaded dynamically from published `services` table (always in sync)
- Company, Resources, Legal link columns (static from `lib/site-data.ts`)
- Newsletter subscription form (uses `/api/newsletter` endpoint)

**Supported social platforms:**
LinkedIn, GitHub, Telegram, Facebook, Instagram, YouTube, X/Twitter, TikTok

### `components/page-hero.tsx`

Used at the top of every inner page. Automatically adds a breadcrumb:
```
Home > About
Home > Contact
Home > News
```

Props:
- `eyebrow` — small label above title
- `title` — main headline
- `description` — subtitle
- `cta` — optional button
- `backHref` + `backLabel` — optional back link

### `components/dynamic-icon.tsx`

Renders a Lucide icon from a name string. Supports both PascalCase and kebab-case:

```tsx
<DynamicIcon name="Globe" className="h-5 w-5" />      // ✅ PascalCase
<DynamicIcon name="heart-pulse" className="h-5 w-5" /> // ✅ auto-converts to HeartPulse
<DynamicIcon name="🏥" className="text-xl" />          // ✅ emoji rendered as-is
```

Over 100 icons are mapped including: all tech icons, business icons, healthcare, education, construction, hospitality, legal, agriculture, transport, real estate, media, and more.

---

## 13. How Styling Works

### CSS Variables (`app/globals.css`)

All colors are CSS variables that switch between light and dark mode:
```css
:root {
  --background: 0 0% 100%;      /* white */
  --foreground: 222 47% 11%;    /* dark text */
  --accent: 199 100% 40%;       /* brand blue */
  --card: 0 0% 98%;             /* card backgrounds */
}
.dark {
  --background: 222 47% 5%;     /* dark background */
  --foreground: 210 40% 98%;    /* light text */
}
```

Tailwind is configured to use these:
```typescript
colors: {
  background: 'hsl(var(--background))',
  accent: { DEFAULT: 'hsl(var(--accent))' },
}
```

### Typography

- **Inter** → `font-sans` → body text
- **Manrope** → `font-heading` → headings, numbers, logo

### Custom Utility Classes

Defined in `globals.css`:
- `grid-bg` — subtle grid pattern for hero backgrounds
- `text-gradient-brand` — blue-to-cyan gradient text
- `glass` — frosted glass navbar effect
- `container-kezera` — standard max-width container
- `container-kezera-wide` — wider container for full sections
- `section-padding` — consistent vertical spacing

---

## 14. Environment Variables

File: `.env` (never commit this to git)

```bash
# Your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://drspvzesmqccbnijmqja.supabase.co

# Public anon key — safe to expose (RLS protects the data)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Secret service role key — NEVER expose in browser code
# Only used in server-side API routes
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Variables starting with `NEXT_PUBLIC_` are included in the browser bundle.
Variables without that prefix are server-only.

When deploying to Vercel or Netlify, add all three variables in the hosting platform's environment variables settings.

---

## 15. How Data Flows Through the App

### Visitor reads a page

```
Visitor opens /services
  → app/services/page.tsx loads
  → useEffect fires after component renders
  → supabase.from('services').select().eq('is_published', true)
  → Supabase checks RLS: public can read is_published=true rows
  → Returns array of service objects
  → setServices(data) triggers re-render
  → Loading skeleton replaced with real service cards
```

### Admin saves content

```
Admin creates a new service, clicks "Create Service"
  → save() function runs
  → supabase.from('services').insert(formData)
  → Supabase checks RLS: authenticated user → allowed
  → Row created in database
  → load() runs to refresh the table
  → Modal closes, new service appears in the list
  → Visitor refreshes /services → new service appears there too
```

### Visitor submits contact form

```
Visitor fills form, clicks "Send message"
  → handleSubmit() runs
  → supabase.from('contact_messages').insert({ name, email, phone, company, message })
  → Supabase checks RLS: anon can INSERT → allowed
  → Row saved to database
  → Success screen shown to visitor
  → Admin opens /admin/messages → sees new message with blue unread dot
```

### Newsletter subscription

```
Visitor enters email in footer, clicks arrow
  → fetch('/api/newsletter', { method: 'POST', body: { email } })
  → app/api/newsletter/route.ts runs on the SERVER
  → Creates Supabase client with SERVICE ROLE key (bypasses RLS)
  → supabase.from('newsletter_subscribers').upsert({ email })
  → Returns success
  → Toast shows "You are subscribed"
  → Admin sees in /admin/newsletter
```

### Maintenance mode check

```
Any visitor requests /about
  → middleware.ts runs before the page loads
  → fetch('/api/maintenance') — checks DB setting
  → maintenance_mode = false → allow request through → page loads
  → maintenance_mode = true → redirect to /maintenance page
  → Admin requests /admin/* → bypassed, never redirected
```

---

## 16. Row Level Security (RLS)

RLS is Supabase's permission system. Every table has policies.

### Policy types in this project

**Public read (published content):**
```sql
CREATE POLICY "public_read_published_services" ON services
  FOR SELECT TO anon, authenticated USING (is_published = true);
```

**Public insert only (forms):**
```sql
CREATE POLICY "public_insert_contact_messages" ON contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);
```

**Admin full access:**
```sql
CREATE POLICY "authenticated_all_services" ON services
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

**`FOR ALL`** covers SELECT + INSERT + UPDATE + DELETE in one policy.

### Why RLS matters for this project

When the admin saves content through the dashboard, Supabase checks if the logged-in user has an `authenticated_all_*` policy on that table. Without these policies, saves silently fail.

All admin write policies were added by running SQL in the Supabase SQL Editor.

---

## 17. API Routes

### `POST /api/newsletter`
File: `app/api/newsletter/route.ts`

Used by the footer newsletter subscription form.
Uses the service role key (server-side only) to bypass RLS and write directly.
Uses `upsert` to prevent duplicate email subscriptions.

### `GET /api/maintenance`
File: `app/api/maintenance/route.ts`

Used by `middleware.ts` to check whether maintenance mode is enabled.
Queries `site_settings.maintenance_mode` and `maintenance_message`.
Returns `{ maintenance_mode: boolean, maintenance_message: string }`.
Uses `Cache-Control: no-store` so toggleing the setting takes effect immediately.

---

## 18. SEO, Sitemap and Robots

### Global Metadata (`app/layout.tsx`)

```typescript
export const metadata = {
  title: {
    default: 'Kezera Tech — Designing the Future Through Technology',
    template: '%s | Kezera Tech', // individual pages can set their own title
  },
  description: 'Kezera Tech is a technology company...',
  keywords: ['software development Ethiopia', 'web development Addis Ababa', ...24 keywords],
  openGraph: { ... },   // Facebook/LinkedIn preview cards
  twitter: { ... },     // Twitter/X card metadata
};
```

### Dynamic Sitemap (`app/sitemap.ts`)

Generates `/sitemap.xml` with:
- All 13 static pages with priority scores
- All published services (`/services/slug`)
- All published projects (`/projects/slug`)
- All published products (`/products/slug`)
- All published blog posts (`/blog/slug`)
- Falls back to static-only if Supabase is unreachable during build

### Robots (`app/robots.ts`)

Blocks search engine crawlers from indexing:
- `/admin` and all admin pages
- `/api` routes

Allows crawling of all public pages.
Points to the sitemap URL.

---

## 19. Social Media Integration

Social links are stored as a JSONB object in `site_settings.social_links`:

```json
{
  "linkedin":  "https://linkedin.com/company/kezeratech",
  "github":    "https://github.com/kezeratech",
  "telegram":  "https://t.me/kezeratech",
  "facebook":  "https://facebook.com/kezeratech",
  "instagram": "https://instagram.com/kezeratech",
  "youtube":   "https://youtube.com/@kezeratech",
  "twitter":   "https://x.com/kezeratech",
  "tiktok":    "https://tiktok.com/@kezeratech"
}
```

The footer only renders icons for keys that have a non-empty URL value.
TikTok uses a custom inline SVG since Lucide doesn't include brand logos.
All others use Lucide icons.

To add a social link: **Admin → Settings → Social tab → paste URL → Save Links**

---

## 20. Dynamic Icon System

File: `components/dynamic-icon.tsx`

Allows admin users to type icon names in form fields instead of uploading image files.

### How it works

```typescript
export function DynamicIcon({ name, className, ...props }) {
  // 1. Try direct lookup: "Globe" → Globe component
  const Icon = ICON_MAP[name];
  if (Icon) return <Icon className={className} />;

  // 2. Auto-convert kebab-case: "heart-pulse" → "HeartPulse" → HeartPulse component
  const pascalName = name.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
  const IconFromKebab = ICON_MAP[pascalName];
  if (IconFromKebab) return <IconFromKebab className={className} />;

  // 3. Fallback: render as text/emoji
  return <span>{name}</span>;
}
```

### Supported icon names (examples)

| Category | Icon names |
|---|---|
| Tech | `Globe`, `Smartphone`, `Code2`, `Monitor`, `Server`, `Cloud`, `Database`, `Cpu` |
| Business | `Briefcase`, `BriefcaseBusiness`, `Building2`, `TrendingUp`, `DollarSign` |
| Healthcare | `HeartPulse`, `Stethoscope`, `Pill`, `FlaskConical` |
| Education | `GraduationCap`, `BookOpen`, `School`, `LibraryBig` |
| Construction | `HardHat`, `Construction`, `Hammer`, `Cog` |
| Hospitality | `Hotel`, `Utensils`, `ChefHat`, `Coffee` |
| Legal | `Landmark`, `Scale`, `Shield`, `FileText` |
| Transport | `Car`, `Truck`, `Plane`, `Ship`, `Train` |
| Finance | `Banknote`, `PiggyBank`, `Wallet`, `CreditCard` |

Both `HeartPulse` and `heart-pulse` work. Emojis like `🏥` also work.

---

## 21. Key Code Patterns

### Pattern 1 — Parallel data fetching
```typescript
const [result1, result2, result3] = await Promise.all([
  supabase.from('table1').select(),
  supabase.from('table2').select(),
  supabase.from('table3').select(),
]);
// Runs all at the same time — much faster than sequential awaits
```

### Pattern 2 — Loading skeleton
```tsx
{loading ? (
  <div className="h-6 w-48 rounded bg-muted animate-pulse" />
) : (
  <p>{actualData}</p>
)}
```

### Pattern 3 — Empty state
```tsx
{items.length === 0 ? (
  <div className="border border-dashed rounded-xl p-10 text-center">
    No items yet.
  </div>
) : (
  items.map(item => <Card key={item.id} />)
)}
```

### Pattern 4 — CRUD state machine
Every admin content page uses this pattern:
```
state: items[], loading, modalOpen, editId, form, deleteId
openAdd() → clear form, editId=null, open modal
openEdit(item) → fill form, set editId, open modal
save() → if editId: UPDATE else INSERT, then reload()
delete() → DELETE by id, then reload()
```

### Pattern 5 — Null over empty string for optional fields
```typescript
// Always use || null for optional fields to avoid empty string issues
featured_image_url: form.featured_image_url.trim() || null,
category: form.category || null,
phone: form.phone || null,
```

### Pattern 6 — JSONB array guard
```typescript
// Always guard JSONB array columns from the database
const benefits = Array.isArray(service.benefits) ? service.benefits : [];
```

### Pattern 7 — Admin table auto-refresh
```typescript
async function save() {
  await supabase.from('table').insert(data);
  setModalOpen(false);
  load(); // always re-fetch after write to show latest state
}
```

---

## 22. How to Read Any File in This Project

When opening any file, look in this order:

1. **Imports** — what this file depends on
2. **Interfaces** — what shape the data has (`interface Service { id: string; title: string; ... }`)
3. **State** — what the component remembers (`const [services, setServices] = useState([])`)
4. **useEffect** — what runs when the page first loads (usually the data fetch)
5. **Event handlers** — functions called by user actions (`async function save()`)
6. **return JSX** — what is rendered on screen

The `return (...)` block contains JSX — it looks like HTML but is TypeScript.
Curly braces `{}` inside JSX mean "run JavaScript here".

---

## 23. Admin Dashboard — Complete User Guide

### First Time Setup

1. Run `npm run dev` in the project terminal
2. Open `http://localhost:3001/admin/login`
3. Sign in with your Supabase admin email and password
4. Go to **Settings → Company** and fill in all your company information
5. Click **Save Changes** on each tab

### Daily workflow

**To add a service:**
Admin → Business → Services → New Service → fill fields → toggle Published ON → Create Service

**To write a blog post:**
Admin → Content → Blog Posts → New Article → write content → set author, category, tags → Publish

**To write a news article:**
Admin → Content → News → New Article → write content → toggle Featured if it's the main story → Publish

**To create an advertisement:**
Admin → Marketing → Advertisements → New Advertisement → fill title, description, CTA → pick background color → toggle Active ON → Create Advertisement

**To read messages:**
Admin → Communication → Messages → click eye icon on any message → blue dot disappears (marked as read)

**To manage newsletter:**
Admin → Communication → Newsletter → see subscriber count → Export CSV when ready to send

**To enable maintenance mode:**
Admin → System → Settings → System tab → toggle Maintenance Mode ON → Save System Settings

**To upload images:**
Admin → System → Media Library → Upload File → hover file → click copy icon → paste URL anywhere

---

## 24. Glossary

| Term | Meaning |
|---|---|
| **Next.js** | React framework with routing, SSR, API routes, and middleware |
| **React** | JavaScript library for building components |
| **TypeScript** | JavaScript with type annotations |
| **Tailwind CSS** | Utility-first CSS using class names |
| **Supabase** | Cloud database, auth, and storage service |
| **PostgreSQL** | The relational database Supabase runs on |
| **RLS** | Row Level Security — Supabase permission rules per table |
| **Component** | A reusable piece of UI code |
| **Props** | Parameters passed to a component |
| **State** | Data a component remembers; changes cause re-renders |
| **Hook** | Special React function like `useState`, `useEffect` |
| **useEffect** | Runs code after a component renders (used for data fetching) |
| **useState** | Stores a value; changing it re-renders the component |
| **Context** | Shares data across many components without prop drilling |
| **Middleware** | Code that runs before every page request in Next.js |
| **JSX** | HTML-like syntax used in React/TypeScript files |
| **API Route** | Server-side code inside Next.js that handles HTTP requests |
| **Slug** | URL-friendly text, e.g. `web-development` from `Web Development` |
| **CRUD** | Create, Read, Update, Delete — the four basic database operations |
| **Upsert** | Insert if row doesn't exist, update if it does |
| **JSONB** | PostgreSQL column that stores JSON arrays or objects |
| **JWT** | JSON Web Token — how Supabase stores your login session |
| **localStorage** | Browser storage that persists between page loads |
| **ENV** | Environment variable — secret value stored outside the code |
| **Bundle** | The compiled JavaScript file sent to the browser |
| **SSR** | Server-Side Rendering — page built on server before sending |
| **CSR** | Client-Side Rendering — page built in the browser using JS |
| **shadcn/ui** | Collection of accessible components you own the code for |
| **Radix UI** | Low-level accessible UI primitives (no styles) |
| **lucide-react** | SVG icon library for React |
| **Promise.all** | Runs multiple async operations in parallel |
| **Async/Await** | Modern JavaScript for handling asynchronous operations |
| **Maintenance mode** | State where visitors see a holding page instead of the website |
| **Featured article** | News article displayed as a large hero at the top of the news page |
| **Advertisement** | Homepage promotional banner managed from the admin |
| **Anon key** | Supabase public key safe to expose in the browser |
| **Service role key** | Supabase secret key used server-side only, bypasses RLS |

---

*Kezera Tech Website Documentation — Version 2.0 — September 2026*
*Updated to include: News section, Advertisements section, Maintenance Mode system, Social media integration (GitHub + TikTok), Dynamic icon system, Session persistence, Media Library, and all admin pages.*
