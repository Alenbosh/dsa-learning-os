# DSA Learning OS

A personal learning dashboard for tracking LeetCode progress, mastering DSA topics, and building a consistent study habit — built with Next.js, Prisma, and Supabase.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)

---

## Features

**LeetCode Tracker** — log every problem you solve with difficulty, time taken, patterns, mistakes, and confidence. Tag by topic, flag for revisit, and sync directly from LeetCode.

**DSA Study Board** — a Kanban board to manage your DSA topics across four stages: Not Started, In Progress, Needs Revision, and Done. Drag cards between columns and attach notes and resources to each topic.

**Problem–Topic Linking** — link any LeetCode problem directly to one or more DSA topics. See exactly which problems reinforce which concepts.

**Spaced Repetition (SM-2)** — uses the SM-2 algorithm to automatically schedule topic reviews. Rate your recall (0–5) after each session and the next review date is calculated for you. Due topics surface on the dashboard every day.

**Weekly Review** — a dedicated page showing your week-by-week activity: problems solved by day, topics reviewed, average SM-2 rating, and a full problem list. Navigate backwards through any previous week.

**Tech Stack Tracker** — track technologies you want to learn, are currently learning, or are comfortable with. Attach resources and projects to each entry.

**Activity Heatmap** — GitHub-style solve heatmap to visualise your consistency over the past year.

**Solve Streak** — tracks your current daily solving streak.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | NextAuth.js (Google OAuth) |
| Styling | Tailwind CSS |
| Rich Text | Tiptap |
| Drag & Drop | @hello-pangea/dnd |
| State | Zustand + SWR |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (PostgreSQL)
- A Google OAuth app ([console.cloud.google.com](https://console.cloud.google.com))

### Installation

```bash
git clone https://github.com/your-username/dsa-learning-os.git
cd dsa-learning-os
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL=your_supabase_connection_string
DIRECT_URL=your_supabase_direct_connection_string

NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Database Setup

```bash
# Apply migrations
npx prisma migrate dev --name init

# (Optional) seed default DSA topics
npm run db:seed

# Open Prisma Studio to inspect data
npm run db:studio
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
├── (app)/              # Authenticated app routes
│   ├── page.tsx        # Dashboard / Home
│   ├── leetcode/       # LeetCode tracker
│   ├── dsa/            # DSA Study Board
│   ├── review/         # Weekly Review
│   ├── techstack/      # Tech Stack tracker
│   └── settings/       # Settings & LeetCode sync
├── api/                # API routes
│   ├── problems/
│   ├── topics/
│   ├── review/         # SM-2 spaced repetition
│   ├── weekly-review/
│   └── techstack/
components/
├── dsa/                # DSA board components + SpacedRepetitionQueue
├── leetcode/           # Problem table, modal, heatmap
├── review/             # WeeklyReviewClient
├── layout/             # Sidebar, Topbar
└── shared/             # StatsCard
prisma/
└── schema.prisma       # Full DB schema
```

---

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Generate Prisma client + build
npm run db:push      # Push schema changes without migration
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed default topics
```

---

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Problem notes with code blocks (Tiptap editor)
- [ ] LeetCode contest tracker
- [ ] Export progress as PDF
- [ ] Dark/light theme toggle
- [ ] Shared profiles / leaderboard

---

## License

Copyright (c) 2026 Manish Rajak

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

