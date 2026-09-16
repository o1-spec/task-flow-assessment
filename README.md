# TaskFlow — Production-Grade SaaS Task Management Application

A production-quality task management SaaS application built with **Next.js 15 (App Router)**, **TypeScript**, **PostgreSQL**, **Prisma ORM**, and **Tailwind CSS**.

TaskFlow transforms practical assessment requirements into an interview-ready, full-stack product featuring public product landing, secure session authentication, strict server-side user task ownership, an overview dashboard, and a task management workspace with search, filtering, and sorting.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack & Rationale](#tech-stack--rationale)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Database Setup & Migrations](#database-setup--migrations)
8. [Architecture & Technical Decisions](#architecture--technical-decisions)
9. [API Reference](#api-reference)
10. [Assumptions](#assumptions)
11. [Realistic Future Improvements](#realistic-future-improvements)

---

## Project Overview

TaskFlow is designed to help professionals and engineering teams stay organized, hit approaching deadlines, and maintain focus. The application separates concerns into three distinct areas:

1. **Public Marketing Surface (`/`)**: A responsive SaaS landing page with navigation, hero section, interactive dashboard preview, feature showcases, a 3-step workflow guide, and a high-converting bottom call-to-action.
2. **Authentication Flow (`/login`, `/register`, `/forgot-password`)**: Client- and server-validated user authentication backed by `bcryptjs` password hashing and secure HTTP-only session cookies.
3. **Authenticated Workspace (`/dashboard`, `/tasks`, `/tasks/[id]`, `/settings`)**: A private workspace protected by Next.js Edge Middleware and server-side authorization checks, ensuring users only access their own tasks.

---

## Features

- **Session Authentication**: Secure user registration, sign-in, and sign-out with `bcryptjs` salted password hashing and generic login security messaging.
- **Strict User Ownership**: Multi-tenant database design where tasks belong directly to a user; server-side queries and mutations reject unauthorized access with zero data leakage.
- **Overview Dashboard (`/dashboard`)**:
  - Time-of-day dynamic greeting (`"Good morning, Alex"`).
  - Summary metric cards: Total, To Do, In Progress, Completed, Overdue.
  - Interactive completion progress indicator (% completed).
  - Recent tasks feed (most recently created or updated).
  - Upcoming deadlines list sorted by urgency.
- **Task Workspace (`/tasks`)**:
  - Full CRUD operations (Create, Read, Update, Delete) with interactive modals.
  - Live debounced search across titles and descriptions.
  - Status filtering (`All`, `To Do`, `In Progress`, `Completed`, `Overdue`).
  - Multi-criteria sorting (`Newest`, `Oldest`, `Due soon`, `Due later`, `Title A–Z`).
  - Contextual empty states for empty workspace, missing search results, and empty filters.
- **Detailed Task View (`/tasks/[id]`)**:
  - Full metadata display (title, description, status pill, overdue tag, due date, created date, last updated date).
  - One-click status toggling (`Mark Complete` / `Reopen task`).
  - Edit modal and confirmation dialog for deletion.
  - Safe 404 handling when viewing nonexistent or unowned tasks.
- **User Settings (`/settings`)**:
  - Profile details (name and email modification with email conflict guards).
  - Password change with current-password verification and confirmation matching.
  - Security overview inspecting session parameters (`httpOnly`, `SameSite=lax`).
- **Responsive Layout**:
  - Desktop: Persistent dark sidebar, breadcrumbs, and spacious workspace.
  - Mobile/Tablet: Header bar with profile initials and full slide-down navigation drawer.
- **Error Handling & Validation**:
  - Unified Zod schemas executed on both client and API route boundaries.
  - Safe API error formatting that never leaks raw database stack traces.

---

## Tech Stack & Rationale

| Technology | Purpose | Why It Was Chosen |
| :--- | :--- | :--- |
| **Next.js 15 (App Router)** | Full-Stack Framework | Hybrid React Server Components (RSC) provide instant data fetching and SEO while client components offer rich interactivity. |
| **TypeScript (Strict)** | Language | Type safety across database models, API payloads, form values, and component props prevents runtime errors. |
| **Prisma ORM (v6)** | Database Access | Declarative schema modeling, automated type-safe client generation, and deterministic SQL migrations. |
| **PostgreSQL** | Relational Database | ACID guarantees, foreign-key constraints, compound indexes, and cloud compatibility (e.g., Supabase, Neon, AWS RDS, Docker). |
| **Tailwind CSS** | Styling | Utility-first CSS providing a consistent design system with restrained colors, soft shadows, and responsive breakpoints without bloated stylesheets. |
| **bcryptjs** | Password Hashing | Battle-tested, zero-dependency pure JS implementation of bcrypt; safe across diverse container and serverless runtimes. |
| **jose** | JWT Session Management | Lightweight, Web Cryptography API compliant standard for signing and verifying tokens in both Node.js and Next.js Edge Middleware. |
| **Zod** | Schema Validation | Declarative type-inferred schemas ensuring input correctness before data reaches database mutations. |
| **Sonner** | Notification Toasts | Non-intrusive, accessible toast notifications for async user actions. |
| **Vitest** | Testing Suite | Fast, ESM-native unit testing for business logic, validation rules, and schema edge cases. |

---

## Project Structure

```text
taskflow-assessment/
├── prisma/
│   ├── migrations/             # SQL migration files
│   ├── schema.prisma           # Prisma schema (User & Task models)
│   └── seed.ts                 # Demo seed script (demo user + tasks)
├── public/                     # Static assets & icons
├── src/
│   ├── app/
│   │   ├── (app)/              # Authenticated route group
│   │   │   ├── dashboard/      # Overview dashboard page
│   │   │   ├── settings/       # Profile & account security
│   │   │   ├── tasks/          # Task management & detail pages
│   │   │   │   ├── [id]/       # Individual task detail screen
│   │   │   │   └── page.tsx    # "My Tasks" directory
│   │   │   └── layout.tsx      # Authenticated shell layout
│   │   ├── (auth)/             # Authentication route group
│   │   │   ├── forgot-password/# Reset password UI & simulation
│   │   │   ├── login/          # Login screen
│   │   │   ├── register/       # Registration screen
│   │   │   └── layout.tsx      # Centered auth card layout
│   │   ├── api/                # Backend API routes
│   │   │   ├── auth/           # /register, /login, /logout, /me
│   │   │   ├── health/         # Healthcheck with DB ping
│   │   │   ├── tasks/          # User-scoped task CRUD
│   │   │   └── user/           # Profile & password mutation endpoints
│   │   ├── globals.css         # Base styles & typography
│   │   ├── layout.tsx          # Root HTML/Body wrapper with Toaster
│   │   ├── not-found.tsx       # 404 error page
│   │   ├── error.tsx           # Global error boundary
│   │   └── page.tsx            # Public SaaS landing page
│   ├── components/
│   │   ├── app-shell.tsx       # Application sidebar & mobile navigation
│   │   ├── dashboard/          # Dashboard widgets & recent tasks feed
│   │   ├── landing/            # Landing page sections (hero, navbar, features, etc.)
│   │   ├── settings/           # Profile & security forms
│   │   ├── tasks/              # TaskCard, TaskDashboard, TaskForm, StatCard
│   │   └── ui/                 # Reusable Button, Modal, StatusPill
│   ├── lib/
│   │   ├── api.ts              # Error response handlers & status utilities
│   │   ├── auth.ts             # Password hashing, token signing, session cookies
│   │   ├── auth-validation.ts  # Zod schemas for auth flows
│   │   ├── prisma.ts           # Global PrismaClient singleton
│   │   ├── task-validation.ts  # Zod schemas for task CRUD
│   │   ├── types.ts            # Shared TypeScript type definitions
│   │   └── utils.ts            # Formatting, overdue calculation, class merging
│   └── middleware.ts           # Edge middleware for route protection
├── .env.example                # Example environment configuration
├── docker-compose.yml          # Local PostgreSQL Docker setup
├── package.json
└── README.md
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example environment configuration:

```bash
cp .env.example .env
```

Ensure `.env` contains valid database credentials and a secure session secret:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/taskflow?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/taskflow?schema=public"
SESSION_SECRET="your-secure-random-string-at-least-32-chars-long"
```

### 3. Apply database migrations

Deploy the Prisma migrations to your PostgreSQL database:

```bash
npx prisma migrate deploy
```

### 4. Seed demo user and tasks

Seed the database with sample data including a pre-configured demo account:

```bash
npm run db:seed
```

**Default Demo Credentials:**
- **Email:** `demo@taskflow.dev`
- **Password:** `TaskFlow123!`

*(The login page also provides a one-click "Auto-fill credentials" button for quick review).*

### 5. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Yes | PostgreSQL connection string (pooled URL when using Supabase or serverless). |
| `DIRECT_URL` | Optional | Direct PostgreSQL connection string for running migrations. |
| `SESSION_SECRET` | Yes | 32+ character secret string used to sign and verify HMAC session tokens. |

---

## Database Setup & Migrations

### Local PostgreSQL with Docker (Optional)

If you don't have a local PostgreSQL instance installed, launch one using Docker:

```bash
docker compose up -d db
```

Then run:

```bash
npx prisma migrate deploy
npm run db:seed
```

### Prisma Schema

```prisma
enum TaskStatus {
  TODO
  IN_PROGRESS
  COMPLETED
}

model User {
  id           String   @id @default(cuid())
  name         String   @db.VarChar(100)
  email        String   @unique @db.VarChar(255)
  passwordHash String   @db.Text
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  tasks        Task[]

  @@index([email])
}

model Task {
  id          String     @id @default(cuid())
  title       String     @db.VarChar(120)
  description String     @db.Text
  status      TaskStatus @default(TODO)
  dueDate     DateTime
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  userId      String
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([userId, status])
  @@index([userId, dueDate])
  @@index([userId, createdAt])
  @@index([status])
  @@index([dueDate])
  @@index([createdAt])
}
```

---

## Architecture & Technical Decisions

### 1. Why Custom Session Authentication (HTTP-Only Cookies)?
Rather than introducing heavy third-party authentication services (like Clerk or Auth0) or dealing with the breaking beta changes of NextAuth in Next.js 15, we implemented native session cookies using `bcryptjs` and `jose`:
- Demonstrates complete mastery of authentication fundamentals: salted password hashing, HTTP-only cookie security flags (`httpOnly`, `SameSite=lax`, `secure`), and edge-compatible token verification.
- Zero external vendor lock-in. Works 100% offline, in Docker containers, and in automated test environments.
- Immune to client-side XSS token theft (unlike storing tokens in `localStorage`).

### 2. Edge Middleware Route Protection
The Next.js `middleware.ts` runs at the Edge, intercepting incoming requests before rendering:
- Unauthenticated visitors attempting to access `/dashboard`, `/tasks/*`, or `/settings` are redirected to `/login?from=[pathname]`.
- Already-authenticated users visiting `/login`, `/register`, or `/forgot-password` are redirected straight to `/dashboard`.

### 3. Server-Side Ownership Enforcement
Security cannot rely solely on the UI hiding edit or delete buttons:
- Every query and mutation in `/api/tasks` and `/api/tasks/[id]` explicitly verifies `userId: session.id`.
- Requesting `/tasks/[id]` for a task owned by another user yields a clean `404 Not Found`, preventing malicious actors from confirming the existence of tasks via ID enumeration.

### 4. Why "Overdue" is Calculated Rather than Stored as a Database Status
A task's due date continuously ages relative to the current timestamp. Storing an `OVERDUE` enum in the database would create stale data unless an external cron job updated every row continuously. Instead, TaskFlow calculates overdue status dynamically:
$$\text{isOverdue} = (\text{dueDate} < \text{currentDate}) \land (\text{status} \neq \text{COMPLETED})$$
In queries, this is efficiently resolved in PostgreSQL:
```sql
WHERE "dueDate" < NOW() AND "status" != 'COMPLETED'
```
Supported by the compound index on `(userId, dueDate)`.

### 5. UTC Date Normalization
Due dates are normalized to UTC midnight (`YYYY-MM-DDT00:00:00.000Z`) during parsing and formatting. This prevents date "slipping" across different user browser timezones.

---

## Quality & Verification Commands

```bash
# Run linting, TypeScript typecheck, and unit tests
npm run check

# Run unit tests only
npm test

# Run production build
npm run build
```

---

## Assumptions

1. **Email Uniqueness**: User emails are unique case-insensitively and converted to lowercase.
2. **Permanent Deletion**: Task deletion is irreversible and requires explicit confirmation in the UI.
3. **Password Reset Simulation**: In the absence of an external transactional email provider (such as SendGrid or Postmark), `/forgot-password` renders a realistic confirmation state indicating that instructions were dispatched.
4. **Single-Organization Scope**: Tasks belong directly to individual users. Workspaces are private to each user account.

---

## Realistic Future Improvements

- **Team Workspaces & Collaboration**: Allow users to create organizations, invite team members, and assign tasks to teammates.
- **Labels & Tags**: Categorize tasks across projects or functional domains (e.g., `#engineering`, `#design`).
- **Activity Audit Log**: Track history of modifications, status transitions, and timestamps per task.
- **Email & Push Notifications**: Automated notifications for tasks due within 24 hours.
- **Recurring Tasks**: Support daily, weekly, or monthly recurring task schedules.
