# HANDOFF: Backend Port into `Splocko/leaf-pathways`

**Written:** 2026-07-06  
**Stopped at:** Safe checkpoint — no further porting. All work below is **uncommitted** on branch `feat/backend-integration`.  
**Next agent:** Read this entire file before touching code.

---

## Mission (one paragraph)

Port the **entire backend** from the OLD official-website repo (`Programmer1-Future/LEAF-test`) into **THIS** repo (`Splocko/leaf-pathways`, local path `/Users/saood/leaf redesign`), which is the **canonical base** because it has the fast redesign. **PUBLIC pages must keep the redesign's look** (Hanken Grotesk, inline styles, shadcn tokens, performance). **`/admin` is ported as-is** — function over styling; old Tailwind tokens/CSS there are fine. Everything reads/writes the **same Supabase project** `cueuwyazwjikiogxsbrs`. When complete, the finished result will **eventually be pushed to the OLD repo** `Programmer1-Future/LEAF-test` (not Splocko). Work only on `feat/backend-integration` (or a child branch). **Never touch `main`. Never delete user content. Never force-push.**

---

## Repos

| Role | GitHub | Local path |
|------|--------|------------|
| **NEW base (work here)** | `Splocko/leaf-pathways` | `/Users/saood/leaf redesign` |
| **OLD source (read-only reference)** | `Programmer1-Future/LEAF-test` | `/Users/saood/leaf redesign/.merge-tmp/.merge-tmp/LEAF-test` |
| **Eventual push target** | `Programmer1-Future/LEAF-test` | Do **not** push yet |
| **Harmless WIP on old repo** | PR #2 branch `merge/redesign-into-official` | `lib/storage.ts` + `MERGE_PLAN.md` only — leave alone |

**Layout difference:** NEW repo uses `src/app/`, `src/components/`, `src/lib/` with `@/*` → `./src/*`. OLD repo uses root `app/`, `components/`, `lib/` with `@/*` → `./*`. When copying, **drop the `src/` prefix** on destination paths.

**Do not commit** `.merge-tmp/` or `.leaf-diagnose/` (full old-repo clones; huge; `.leaf-diagnose/` is an accidental duplicate workspace). Add to `.gitignore` if committing.

---

## User decisions (confirmed)

1. **Direction reversed:** NEW redesign repo is base; port backend **from** OLD **into** NEW (not the other way around).
2. **Port EVERYTHING** backend: Supabase, live data, newsletter, community form, competition, Upstash middleware, admin CMS, migrations.
3. **Public pages:** preserve redesign design/fonts/tokens/performance exactly.
4. **`/admin`:** port exactly as old repo; styling can stay ugly/old.
5. **Same Supabase project** `cueuwyazwjikiogxsbrs`; only bucket **paths** may change later (not host/CSP/preconnect).
6. **Live data everywhere** — no coming-soon placeholders where old repo has real Supabase queries.
7. **Never delete, never force-push, never touch `main`.**
8. **Build green + `npm run dev`** and report localhost URL when done.
9. **Graceful degradation** if env vars missing; document what user must supply.

---

## Current branch & commit state

```
Branch: feat/backend-integration
Commits ahead of cleanup/nav-pages-placeholders: ZERO (branch pointer only; no backend commits yet)
HEAD: 84595fe — "Fix mobile menu trapped by header backdrop-filter; bolder LEAF wordmark"
```

**Critical:** ~36 untracked files + 26 modified tracked files exist **only in the working tree**. Nothing from the backend port has been committed. **First action for next agent: `git add` relevant files (exclude `.merge-tmp/`, `.leaf-diagnose/`) and commit WIP** so work is not lost.

```bash
cd "/Users/saood/leaf redesign"
git branch --show-current          # feat/backend-integration
git status --short                 # see full list below
git log --oneline -5
```

**`npm install`:** ✅ Complete (verified `@upstash/ratelimit`, `@tiptap/react` present in `node_modules`).  
**`npm run dev`:** ❌ Not running (no `next dev` process).  
**`next build`:** ❌ Not green. Last attempt failed; one fix applied (privacy + Logo); rebuild was interrupted — **status unknown**.

---

## Styling regression — suspected cause & fix steps

### Diagnosis

**`src/app/globals.css`, `tailwind.config.ts`, and `src/app/layout.tsx` were NOT modified** in the backend port diff. The redesign's shadcn/Hanken token stack is still on disk.

**Likely causes of "public pages lost styling":**

1. **Large uncommitted rewrites to public components** (26 tracked files, −2130 / +1319 lines), especially:
   - `src/components/navbar.tsx`
   - `src/components/footer.tsx`
   - `src/app/about/page.tsx`, `contact/page.tsx`, `events/page.tsx`, all `media/**` pages, event detail pages
   - Deleted pages: `about/impact`, `about/mission`, `about/team`, `partners/page.tsx`
2. **Broken/incomplete build** — dev server may be serving error overlay or stale `.next` cache.
3. **`ToastProvider` wrap** in `src/components/providers.tsx` — unlikely to break layout; low risk.
4. **`CommunityForm` modal** uses old Tailwind classes (`font-montserrat`, `gold`, `forest-green`) — affects modal only when open, not whole site.

**NOT the cause (for public pages):** Old `globals.css` was **not** copied into this repo.

### Fix public styling FIRST (recommended)

Restore public chrome + pages from last known-good commit on the redesign branch:

```bash
cd "/Users/saood/leaf redesign"

# Restore core chrome + layout pages from HEAD commit (before uncommitted edits)
git checkout HEAD -- \
  src/components/navbar.tsx \
  src/components/footer.tsx \
  src/components/providers.tsx \
  src/app/about/page.tsx \
  src/app/contact/page.tsx \
  src/app/events/page.tsx \
  src/app/events/apprenticeship-bootcamp/page.tsx \
  src/app/events/commercial-awareness/page.tsx \
  src/app/events/engineering-innovation/page.tsx \
  src/app/events/finance-bootcamp/page.tsx \
  src/app/events/healthcare-bootcamp/page.tsx \
  src/app/events/host-event/page.tsx \
  src/app/events/leaf-hacks/page.tsx \
  src/app/media/page.tsx \
  src/app/media/blog/page.tsx \
  src/app/media/podcast/page.tsx \
  src/app/media/webinars/page.tsx \
  src/app/about/impact/page.tsx \
  src/app/about/mission/page.tsx \
  src/app/about/team/page.tsx \
  src/app/partners/page.tsx

# Re-apply ONLY backend wiring changes to restored files:
#   - footer: newsletter POST to /api/newsletter (firstName + email)
#   - footer: privacy links → /privacy
#   - join-community-dialog: open CommunityForm instead of href="#"
#   - media/webinars/page.tsx: live Supabase query (re-copy from current WIP or re-implement)
#   - events/page.tsx: keep getUpcomingEvents() call (data layer already live)

rm -rf .next && npm run dev
```

**Do NOT revert:** `src/lib/*`, `src/app/api/*`, `src/app/admin/*`, `src/components/CommunityForm.tsx`, `src/middleware.ts`, `supabase-migrations/`, `.env.example`.

### Fix `/admin` styling (separate from public)

Admin components use OLD Tailwind tokens (`gold`, `forest-green`, `font-poppins`, `font-montserrat`, `btn-gradient`) that **do not exist** in `tailwind.config.ts`. Either:

**Option A (quick):** Add old tokens to `tailwind.config.ts` under `extend.colors` and `extend.fontFamily` (copy from OLD repo `tailwind.config.js` lines 11–68).

**Option B:** Import an `admin-globals.css` only on `/admin` layout (scoped).

---

## 13-item backend port checklist

| # | Task | Status | Detail |
|---|------|--------|--------|
| 1 | **Supabase clients** (browser + SSR + service-role) | **PARTIAL** | `src/lib/supabase.ts`, `src/utils/supabase/server.ts` copied. Service-role via `createServerSupabaseClient()`. Not used everywhere yet. |
| 2 | **Live data layers** (events, blog, webinars, podcast) | **PARTIAL** | `src/lib/events.ts`, `src/lib/blog.ts`, `src/lib/webinars.ts` wired to Supabase. **Podcast:** still stub (`src/app/media/podcast/page.tsx` unchanged stub). Homepage still uses hardcoded event cards in `src/app/page.tsx`. |
| 3 | **Wire forms** (newsletter, join/rejoin, privacy links) | **PARTIAL** | Footer → `/api/newsletter` ✅. Join dialog → `CommunityForm` ✅. Privacy links → `/privacy` ✅. **MemberCounter** copied but not mounted on public pages. |
| 4 | **`lib/images.ts`** resizing helper | **DONE** | `src/lib/images.ts` — use in blog/events/webinars renders. Blog/events libs call it; public pages using hardcoded URLs may not. |
| 5 | **Competition feature** | **PARTIAL** | `src/app/competition/results/[token]/page.tsx` copied. **`scripts/run_pipeline.py` and related scripts NOT copied.** Needs `SUPABASE_SERVICE_ROLE_KEY`. |
| 6 | **Upstash middleware** | **DONE** | `src/middleware.ts` copied; matches `/api/*`. Fails open if Redis env missing. |
| 7 | **Admin CMS** (`/admin` as-is) | **PARTIAL** | `src/app/admin/page.tsx` + `src/components/admin/*` copied. **Build not verified.** Missing old Tailwind tokens. Hardcoded fallback login in `AdminLogin.tsx` (see Admin section). |
| 8 | **`/privacy` (+ terms links)** | **DONE** | `src/app/privacy/page.tsx` rewritten in NEW design. Footer terms also points to `/privacy` (no separate terms page in old repo). |
| 9 | **Supabase migrations folder** | **DONE** | `supabase-migrations/` (18 SQL files) copied to repo root. |
| 10 | **`.env.example`** | **DONE** | `.env.example` at repo root. |
| 11 | **`package.json` reconciliation** | **DONE** | Deps added; `npm install` succeeded. TipTap pinned to `3.23.6` to avoid peer conflict. |
| 12 | **Build green (`next build`)** | **NOT DONE** | Failed on missing `Navigation`/`Logo` on old privacy import; privacy rewritten + `Logo.tsx` copied. Rebuild interrupted — **run and fix**. |
| 13 | **Dev server + verify** | **NOT DONE** | Never started. Target: `http://localhost:3000`. |

---

## What's DONE (files created/modified)

### Created (untracked — must `git add`)

```
.env.example
create-admins.mjs
supabase-migrations/                    (18 SQL files)
public/images/                          (leaflogo.png, leaf-icon.png, etc. for admin Logo)

src/lib/images.ts
src/lib/supabase.ts
src/lib/scrollToSection.ts
src/lib/blog.ts                         (live Supabase queries)
src/lib/events.ts                       (live getUpcomingEvents + date helpers)
src/lib/webinars.ts                     (live Supabase queries)
src/middleware.ts
src/utils/supabase/server.ts

src/app/api/newsletter/route.ts
src/app/admin/page.tsx
src/app/competition/results/[token]/page.tsx
src/app/privacy/page.tsx                (NEW design, not old Navigation import)
src/app/media/blog/[slug]/page.tsx      (untracked — may be from prior cleanup

src/components/CommunityForm.tsx
src/components/MemberCounter.tsx
src/components/Logo.tsx
src/components/admin/                    (10 files — AdminLogin, EventsManager, BlogManager, etc.)
src/components/ui/toast.tsx
src/components/ui/confirm-dialog.tsx
src/components/ui/gradient-button.tsx
```

### Modified (tracked, uncommitted)

```
package.json, package-lock.json         (+ backend deps)
src/components/footer.tsx               (newsletter API wire + firstName field + /privacy links)
src/components/join-community-dialog.tsx (opens CommunityForm)
src/components/providers.tsx            (ToastProvider wrap)
+ 22 public page files (navbar, about, contact, events, media, etc.) — see styling section
```

---

## What's NOT DONE (exact steps)

1. **Commit WIP** — `git add` all backend files; exclude `.merge-tmp/`, `.leaf-diagnose/`; commit on `feat/backend-integration`.
2. **Restore public styling** — commands in Styling section; re-wire footer/join/webinars only.
3. **`next build` until green** — fix any remaining import/type errors.
4. **Copy competition scripts** from OLD:
   - `.merge-tmp/.merge-tmp/LEAF-test/scripts/run_pipeline.py`
   - `generate_certificates.py`, `generate_reports.py`, `merge_results.py`, `send_results_emails.py`
   - → `scripts/` in NEW repo
5. **Podcast page** — OLD repo has **no** `/podcast` route or Supabase table. Keep external links (YouTube/Spotify/Apple) or static embeds; document as non-DB.
6. **Wire homepage** `src/app/page.tsx` — replace hardcoded Supabase image URLs with `getUpcomingEvents()` or DB-driven cards + `lib/images.ts`.
7. **Use `resizedStorageImage`** on all blog/event image renders in public pages.
8. **Mount `MemberCounter`** somewhere public (old repo had it on homepage).
9. **Admin Tailwind tokens** — add `gold`, `forest-green`, fonts to `tailwind.config.ts` OR admin-only CSS.
10. **Admin auth** — verify Supabase Auth users exist; hardcoded fallback: `admin@leafpathways.com` / `LeafPathways2024!` (in `AdminLogin.tsx` — rotate in production).
11. **`create-admins.mjs`** — run once with service role to seed admin users (from OLD repo).
12. **CSP / `next.config`** — OLD has strict CSP allowing `cueuwyazwjikiogxsbrs.supabase.co`. NEW `next.config.mjs` is empty `{}`. Consider porting `headers()` from OLD `next.config.js` for production.
13. **`npm run dev`** — report `http://localhost:3000`; smoke-test each feature below.

---

## Exact file mapping (OLD → NEW)

| OLD path (under `.merge-tmp/.merge-tmp/LEAF-test/`) | NEW path |
|-----------------------------------------------------|----------|
| `lib/supabase.ts` | `src/lib/supabase.ts` ✅ |
| `utils/supabase/server.ts` | `src/utils/supabase/server.ts` ✅ |
| `lib/images.ts` | `src/lib/images.ts` ✅ |
| `lib/events.ts` (date helpers only) | merged into `src/lib/events.ts` ✅ |
| `lib/scrollToSection.ts` | `src/lib/scrollToSection.ts` ✅ |
| `middleware.ts` | `src/middleware.ts` ✅ |
| `app/api/newsletter/route.ts` | `src/app/api/newsletter/route.ts` ✅ |
| `components/CommunityForm.tsx` | `src/components/CommunityForm.tsx` ✅ |
| `components/MemberCounter.tsx` | `src/components/MemberCounter.tsx` ✅ |
| `components/NewsletterForm.tsx` | **not copied** — footer wired inline instead |
| `components/Logo.tsx` | `src/components/Logo.tsx` ✅ |
| `components/admin/*` | `src/components/admin/*` ✅ |
| `components/ui/toast.tsx` | `src/components/ui/toast.tsx` ✅ |
| `components/ui/confirm-dialog.tsx` | `src/components/ui/confirm-dialog.tsx` ✅ |
| `components/ui/gradient-button.tsx` | `src/components/ui/gradient-button.tsx` ✅ |
| `app/admin/page.tsx` | `src/app/admin/page.tsx` ✅ |
| `app/competition/results/[token]/page.tsx` | `src/app/competition/results/[token]/page.tsx` ✅ |
| `app/privacy/page.tsx` | `src/app/privacy/page.tsx` ✅ (rewritten, not verbatim) |
| `app/blog/page.tsx` + `[slug]` | NEW uses `src/app/media/blog/` — data via `src/lib/blog.ts` ✅ |
| `app/events/page.tsx` | NEW `src/app/events/page.tsx` — uses `getUpcomingEvents()` ✅ |
| `app/webinars/page.tsx` | NEW `src/app/media/webinars/page.tsx` — uses `getWebinars()` ✅ |
| `supabase-migrations/*` | `supabase-migrations/*` ✅ |
| `create-admins.mjs` | `create-admins.mjs` ✅ |
| `scripts/run_pipeline.py` + competition scripts | `scripts/` ❌ NOT COPIED |
| `next.config.js` (CSP headers) | `next.config.mjs` ❌ NOT PORTED |
| `netlify.toml` | ❌ NOT PORTED (optional for Splocko; needed for OLD repo deploy) |
| `lib/storage.ts` | ❌ NOT in NEW repo (only on OLD PR #2). Create if centralizing bucket names. |

---

## Env vars needed

Copy `.env.example` → `.env.local`:

```bash
# REQUIRED for live public data + community + admin
NEXT_PUBLIC_SUPABASE_URL=https://cueuwyazwjikiogxsbrs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Supabase dashboard>

# REQUIRED for competition results pages (server-side reads)
SUPABASE_SERVICE_ROLE_KEY=<from Supabase dashboard — server only>

# REQUIRED for newsletter subscribe
RESEND_API_KEY=<from resend.com>

# OPTIONAL — API rate limiting (middleware fails open without these)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# OPTIONAL — Resend extras
RESEND_SEGMENT_ID=
RESEND_FROM_EMAIL=LEAF Pathways <noreply@leafpathways.com>
RESEND_WELCOME_TEMPLATE_ID=
```

| Env var | Enables |
|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` + `ANON_KEY` | Events, blog, webinars, community signup, admin (client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Competition results, `create-admins.mjs`, admin storage uploads |
| `RESEND_API_KEY` | `/api/newsletter` POST |
| `UPSTASH_*` | Rate limit on `/api/*` |

**Without anon key:** public data layers return `[]` / empty states (`ContentUnavailable`). **Without Resend:** newsletter returns 500. **Without service role:** competition pages 404/error.

---

## Package.json reconciliation status

**Added to `package.json`:**

```
@hookform/resolvers, @tiptap/extension-image|link|placeholder, @tiptap/pm,
@tiptap/react, @tiptap/starter-kit (all pinned 3.23.6),
@upstash/ratelimit, dotenv, sharp (devDep)
```

**Already present:** `@supabase/ssr`, `@supabase/supabase-js`, `@upstash/redis`, `framer-motion@12`, `next@14.2.3`, etc.

**Conflict resolved:** TipTap extensions pinned to `3.23.6` (not `^`) — `npm install` without `--legacy-peer-deps` succeeded.

**Not added:** `supabase` CLI package, `playwright` (OLD devDeps) — add only if needed.

---

## Database / Supabase schema reference

**Project:** `cueuwyazwjikiogxsbrs`  
**Host:** `https://cueuwyazwjikiogxsbrs.supabase.co` (do not change CSP/preconnect)

### Tables (from migrations + code usage)

| Table | Used by |
|-------|---------|
| `events` | `getUpcomingEvents()`, admin EventsManager, homepage (should) |
| `blog_posts` | `getPosts()`/`getPost()`, admin BlogManager |
| `webinars` | `getWebinars()`, admin WebinarsManager |
| `community_members` | CommunityForm, MemberCounter, admin MembersManager |
| `app_settings` | CommunityForm (WhatsApp unlock flags), CommunitiesManager |
| `competition_participants` | `/competition/results/[token]` (service-role only) |

### Storage buckets

| Bucket | Purpose | TODO |
|--------|---------|------|
| `event-images` | Event card images | `TODO: official bucket name` if migrating |
| `blog-images` | Blog cover uploads (admin) | same |
| `competition-pdfs` | PDF certs/reports (pipeline) | same |

**Bucket constant (optional):** OLD PR #2 added `lib/storage.ts` — not in NEW repo yet. Hardcoded in `src/lib/events.ts` line ~24: `.../event-images/events`.

### Key queries (match OLD repo)

**Events (upcoming):**
```ts
supabase.from('events').select('*').eq('is_active', true).neq('is_published', false).order('date', { ascending: true })
// filter out past via resolveEventStatus / isEventPastByDate
```

**Blog:**
```ts
supabase.from('blog_posts').select('*').eq('is_published', true).order('published_at', { ascending: false })
```

**Webinars:**
```ts
supabase.from('webinars').select('*').eq('is_published', true).order('webinar_date', { ascending: false })
```

**Community insert:** `community_members` via `getSupabaseClient()` in `CommunityForm.tsx`.

---

## Admin CMS port checklist

### Files present ✅

- `src/app/admin/page.tsx`
- `src/components/admin/AdminLogin.tsx`
- `src/components/admin/AdminSidebar.tsx`
- `src/components/admin/DashboardOverview.tsx`
- `src/components/admin/EventsManager.tsx`
- `src/components/admin/BlogManager.tsx`
- `src/components/admin/WebinarsManager.tsx`
- `src/components/admin/MembersManager.tsx`
- `src/components/admin/CommunitiesManager.tsx`
- `src/components/admin/AnalyticsPage.tsx`
- `src/components/admin/types.ts` (imports `EventDatePrecision`, `EventStatus` from `@/lib/events`)

### Dependencies admin needs

| Dependency | Status |
|------------|--------|
| `@/lib/supabase` (`getSupabaseClient`) | ✅ |
| `@/lib/events` (date helpers) | ✅ |
| `@/lib/images` (`resizedStorageImage`) | ✅ |
| `@/components/ui/toast` | ✅ |
| `@/components/ui/confirm-dialog` | ✅ |
| `@/components/Logo` | ✅ |
| TipTap packages | ✅ in package.json |
| Old Tailwind tokens (`gold`, `forest-green`, `btn-gradient`) | ❌ missing from `tailwind.config.ts` |
| `public/images/leaflogo.png` etc. | ✅ copied |

### Auth model (do not guess — use this)

1. **Hardcoded fallback** in `AdminLogin.tsx`: `admin@leafpathways.com` / `LeafPathways2024!` → stores `leaf_admin_session` in `localStorage`.
2. **Supabase Auth** `signInWithPassword` for real admin users.
3. Admin page checks session in `app/admin/page.tsx` (read that file for gating logic).
4. `create-admins.mjs` seeds users via service role.

---

## Build & dev commands

```bash
cd "/Users/saood/leaf redesign"

# 1. Ensure deps
npm install

# 2. Env
cp .env.example .env.local
# fill keys

# 3. Build (must pass before merge)
npm run build

# 4. Dev
npm run dev
# → http://localhost:3000
```

### Last known build errors (may be fixed)

```
Module not found: '../../components/Navigation'  → privacy page (FIXED: rewritten)
Module not found: '@/components/Logo'            → admin (FIXED: Logo copied)
```

**Run `npm run build` to get current error list.**

---

## How to verify each feature

| Feature | URL / action | Expect |
|---------|--------------|--------|
| Live events list | `/events` → "What's coming up" | Rows from Supabase (not "Database not connected") with anon key set |
| Event programmes | `/events` → "What we run" | Static programme cards (seed data) — OK |
| Blog | `/media/blog` | Posts from `blog_posts` |
| Blog post | `/media/blog/[slug]` | HTML body renders |
| Webinars | `/media/webinars` | Cards from `webinars` or ComingSoon if empty |
| Newsletter | Footer form → Subscribe | 200 from `/api/newsletter`; needs Resend key |
| Join community | Navbar "Join" → modal | CommunityForm opens; submit → `community_members` |
| Privacy | Footer links | `/privacy` loads |
| Admin | `/admin` | Login works; TipTap editors load |
| Competition | `/competition/results/<token>` | Needs service role + DB row |
| Rate limit | Rapid POST `/api/newsletter` | 429 after limit (needs Upstash) |

---

## Pitfalls & things NOT to do

- ❌ **Never touch `main`**
- ❌ **Never force-push**
- ❌ **Never delete** `supabase-migrations/`, admin files, or user content
- ❌ **Do not** copy OLD `app/` tree into NEW (duplicate routes)
- ❌ **Do not** replace NEW `globals.css` / `tailwind.config.ts` with OLD versions (breaks public design)
- ❌ **Do not** commit `.merge-tmp/` or `.leaf-diagnose/`
- ❌ **Do not** push to `Programmer1-Future/LEAF-test` until user says so
- ⚠️ **Podcast** has no Supabase backend in OLD repo — external links only
- ⚠️ **Homepage** `src/app/page.tsx` still has hardcoded Supabase image URLs — migrate to live data
- ⚠️ **`zod` version** NEW=`^4.4.3`, OLD=`^3.22.4` — admin may need v3 API if forms break
- ⚠️ **Hardcoded admin password** in source — security debt

---

## Recommended order of remaining work

1. **Commit current WIP** (preserve all ported backend files).
2. **Restore public page styling** (checkout HEAD for chrome/pages; re-wire footer/join/webinars only).
3. **`npm run build`** — fix errors until green.
4. **Add admin Tailwind tokens** to `tailwind.config.ts` (minimal extend block from OLD config).
5. **Wire homepage** to live events + `lib/images.ts`.
6. **Copy competition `scripts/`** from OLD repo.
7. **Port CSP headers** to `next.config.mjs` (optional but recommended for prod).
8. **Create `lib/storage.ts`** with `STORAGE_BUCKETS` + `TODO: official bucket name` (optional).
9. **`npm run dev`** — full smoke test with `.env.local` filled.
10. **Document env vars** for user; commit final state.
11. **Eventually:** push branch to Splocko; later merge into `Programmer1-Future/LEAF-test` per user.

---

## Quick reference: OLD repo clone path

```
/Users/saood/leaf redesign/.merge-tmp/.merge-tmp/LEAF-test
```

Clone was made from `https://github.com/Programmer1-Future/LEAF-test` (public). Branch `merge/redesign-into-official` exists on remote with harmless scaffold commit only.

---

## Git status snapshot (at handoff time)

```
Branch: feat/backend-integration
Modified: 26 files (see git diff --stat)
Untracked: 36 paths (backend port artifacts + .merge-tmp + .leaf-diagnose)
Commits on feat/backend-integration beyond cleanup/nav-pages-placeholders: 0
```

**End of handoff.**
