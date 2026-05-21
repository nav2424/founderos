# FounderOS

A **web-based** personal founder operating system — runs entirely in your browser (Chrome, Safari, mobile, or desktop). No desktop app or install required.

Manage multiple brands, goals, tasks, reminders, ideas, KPIs, and weekly execution — built for solo founders, not teams.

## Features

- **Dashboard** — Top priorities, overdue tasks, reminders, brand cards, goals, KPIs, quick capture
- **Brands** — Multi-brand portfolio — start empty, add your own
- **Tasks** — Kanban + table, filters, impact/effort priority scoring
- **Goals** — Yearly → weekly with progress bars
- **Ideas** — Inbox, categories, convert to task, archive
- **KPIs** — Cards + charts, manual entries
- **Calendar** — In-app reminders (upcoming / overdue)
- **Playbooks** — SOPs per brand
- **Weekly Review** — Guided reflection + history
- **Quick Capture** — `⌘K` to add task, idea, reminder, or goal
- **AI Assistant** — Paste brain dumps; creates brands, tasks, goals, KPIs, and more (`⌘⇧A`)

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- shadcn/ui-style components (Radix)
- Supabase (auth + database)
- Zustand (client state + localStorage persist)
- Recharts
- Lucide icons

## Quick Start (Browser — Local)

1. Install dependencies:

```bash
npm install
```

2. Run the web dev server:

```bash
npm run dev
```

3. Open **[http://localhost:3000](http://localhost:3000)** in your browser

4. Sign up or sign in (with Supabase configured in `.env.local`) to use the full web app with cloud sync

## Full Setup (Supabase)

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project
2. Copy **Project URL** and **anon key** from Settings → API
### 2. Run the database schema

In the Supabase SQL Editor, run the contents of:

```
supabase/schema.sql
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENAI_API_KEY=sk-your-openai-key
```

### 4. Enable Email Auth

In Supabase → Authentication → Providers, enable **Email**.

### 5. Sign up and add your data

1. Start the app: `npm run dev`
2. Sign up at `/signup`
3. Add brands, tasks, goals, and KPIs from the app — no sample data is pre-loaded

## Project Structure

```
src/
  app/
    (app)/          # Protected app routes
      dashboard/
      brands/
      tasks/
      goals/
      calendar/
      ideas/
      kpis/
      playbooks/
      weekly-review/
      settings/
    (auth)/         # Login & signup
  components/       # UI + layout + feature components
  hooks/
  lib/              # Types, utils, Supabase
  store/            # Zustand store
supabase/
  schema.sql
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` | Quick capture |
| `⌘⇧A` | Open AI Assistant |
| `⌘⇧D` | Go to dashboard |
| `⌘⇧T` | Go to tasks |

## AI Assistant

Open **AI Assistant** from the sidebar, the floating bot button, or `⌘⇧A`. Paste notes, lists, or instructions — the assistant creates and updates brands, tasks, goals, ideas, KPIs, reminders, playbooks, and weekly reviews in your workspace.

Requires `OPENAI_API_KEY` in `.env.local` (and Netlify env vars for production). Uses `gpt-4o-mini` by default.

## Priority Scoring

Tasks and ideas use **Impact ÷ Effort** (each 1–5). Higher scores surface first as high-leverage work.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |

## Deploy on Netlify (access from any device)

FounderOS uses Next.js server features (middleware, Supabase auth), so deploy with Netlify’s **Next.js runtime** — not as a static site.

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "FounderOS initial"
git remote add origin https://github.com/YOUR_USER/founderos.git
git push -u origin main
```

Ensure `.env.local` is **not** committed (it’s in `.gitignore`).

### 2. Create a Netlify site

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Connect GitHub and select your repo
3. Netlify should detect settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Plugin:** `@netlify/plugin-nextjs` (handles Next.js automatically)

### 3. Environment variables (Netlify UI)

**Site settings → Environment variables → Add:**

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase **anon** key (public) |
| `NEXT_PUBLIC_APP_URL` | Your Netlify URL, e.g. `https://founderos.netlify.app` |
| `OPENAI_API_KEY` | OpenAI API key for AI Assistant |

Redeploy after saving variables (**Deploys → Trigger deploy**).

### 4. Configure Supabase Auth for production

In [Supabase Dashboard](https://supabase.com/dashboard) → **Authentication** → **URL configuration**:

- **Site URL:** `https://YOUR-SITE.netlify.app`
- **Redirect URLs:** add:
  - `https://YOUR-SITE.netlify.app/**`
  - `http://localhost:3000/**` (optional, for local dev)

### 5. Use on any device

Open your Netlify URL on phone, tablet, or laptop — same login, data synced via Supabase.

**Custom domain (optional):** Netlify → **Domain management** → add your domain, then update `NEXT_PUBLIC_APP_URL` and Supabase redirect URLs to match.

## License

Private — personal use.
