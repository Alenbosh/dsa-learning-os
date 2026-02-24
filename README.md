# 🧠 DSA Learning OS

A personal full-stack dashboard to track LeetCode problems, DSA study topics, and your tech stack learning pipeline. Built with Next.js 14, Supabase, Prisma, and NextAuth.

---

## ✅ What's Included

| Module | Features |
|---|---|
| **LeetCode Tracker** | Problems table, difficulty/tag filters, 4 views, notes editor (Tiptap with syntax highlighting) |
| **DSA Study Board** | Kanban board with drag-and-drop, topic notes, revision queue on dashboard |
| **Tech Stack** | 4-stage learning pipeline (kanban), resources per tech, confidence tracking |
| **Dashboard** | Stats overview, GitHub-style solve heatmap, revision queue, streak counter |
| **Auth** | GitHub + Google OAuth via NextAuth, per-user data isolation |

---

## 🚀 Setup (30 minutes)

### 1. Create the Next.js project

```bash
npx create-next-app@latest dsa-learning-os \
  --typescript --tailwind --eslint --app \
  --src-dir=false --import-alias="@/*"

cd dsa-learning-os
```

### 2. Copy all files from this scaffold into the project root

The scaffold files map directly to the project structure. Copy them over, replacing the default `app/` and adding `components/`, `lib/`, `types/`, `prisma/`.

### 3. Install dependencies

```bash
npm install @prisma/client @supabase/supabase-js \
  next-auth@^4.24.7 "@auth/prisma-adapter" \
  @tiptap/react @tiptap/pm @tiptap/starter-kit \
  @tiptap/extension-placeholder \
  @tiptap/extension-code-block-lowlight lowlight \
  @hello-pangea/dnd swr zustand \
  react-calendar-heatmap react-tooltip \
  date-fns clsx tailwind-merge lucide-react \
  class-variance-authority react-hot-toast

npm install -D prisma ts-node @tailwindcss/typography \
  @types/react-calendar-heatmap
```

### 4. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → New project
2. Go to **Project Settings → Database → Connection String**
3. Copy the **Transaction** URL (port 6543) → `DATABASE_URL`
4. Copy the **Session** URL (port 5432) → `DIRECT_URL`
5. Go to **Project Settings → API** → copy URL and anon key

### 5. Set up GitHub OAuth

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. **New OAuth App**:
   - Homepage URL: `http://localhost:3000`
   - Callback URL: `http://localhost:3000/api/auth/callback/github`
3. Copy Client ID and Secret

### 6. Create `.env.local`

```bash
cp .env.local.example .env.local
# Fill in all values from steps 4 and 5

# Generate NEXTAUTH_SECRET:
openssl rand -base64 32
```

### 7. Push schema and seed

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 8. Run

```bash
npm run dev
# Open http://localhost:3000
```

---

## 📁 File Structure

```
app/
├── (app)/              # Auth-protected routes
│   ├── layout.tsx      # Sidebar + Topbar shell
│   ├── page.tsx        # Dashboard
│   ├── leetcode/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── dsa/page.tsx
│   └── techstack/page.tsx
├── api/
│   ├── auth/[...nextauth]/route.ts
│   ├── problems/route.ts + [id]/route.ts
│   ├── topics/route.ts + [id]/route.ts
│   └── techstack/route.ts + [id]/route.ts
└── auth/signin/page.tsx

components/
├── layout/        Sidebar, Topbar
├── leetcode/      ProblemsClient, ProblemsTable, ProblemModal,
│                  ProblemDetail, NotesEditor, SolveHeatmap
├── dsa/           DsaBoardClient, TopicCard, TopicModal, RevisionQueue
├── techstack/     TechStackClient, TechCard, TechModal
├── shared/        StatsCard
└── providers/     SessionProvider

lib/               prisma.ts, auth.ts, utils.ts
types/             index.ts
prisma/            schema.prisma, seed.ts
```

---


## 🔮 What to Build Next (v2)

- **Topic detail page** — `/dsa/[id]` with Tiptap notes + linked problems list
- **Problem-Topic linking** — link LeetCode problems directly to DSA topics
- **Spaced repetition** — SM-2 algorithm to auto-schedule revision
- **Weekly review** — summary page with stats per week
- **AI hints** — call Claude API for contextual problem hints
- **LeetCode URL autofill** — scrape problem title/difficulty from URL on paste
