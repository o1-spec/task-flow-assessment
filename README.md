# TaskFlow — Production-Grade SaaS Task Management Application

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

A modern, production-quality task management SaaS application built with **Next.js 15 (App Router)**, **TypeScript**, **PostgreSQL**, **Prisma ORM**, and **Tailwind CSS**.

TaskFlow was created for a Software Engineering internship assessment. It delivers a secure, multi-tenant SaaS experience featuring a public landing page, session-based authentication, strict server-side task ownership, an overview dashboard, and a full-featured task workspace with real-time search, status filtering, and sorting.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Tech Stack & Architecture](#tech-stack--architecture)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Database Setup & Migrations](#database-setup--migrations)
8. [Architecture & Technical Decisions](#architecture--technical-decisions)
9. [API Reference](#api-reference)
10. [Quality & Verification](#quality--verification)
11. [Assumptions & Notable Decisions](#assumptions--notable-decisions)
12. [Future Improvements](#future-improvements)

---

## Project Overview

TaskFlow is organized into three distinct product surfaces:

1. **Public Marketing Surface (`/`)**: A responsive SaaS landing page with navigation, hero section, interactive dashboard preview, feature highlights, a 3-step workflow guide, and a high-converting bottom call-to-action.
2. **Authentication Flow (`/login`, `/register`, `/forgot-password`)**: Client- and server-validated user authentication backed by `bcryptjs` password hashing and secure HTTP-only session cookies.
3. **Authenticated Workspace (`/dashboard`, `/tasks`, `/tasks/[id]`, `/settings`)**: A private workspace protected by Next.js Edge Middleware and server-side authorization checks, ensuring users can only view and modify their own tasks.

---

## Key Features

- **Session Authentication**: Secure user registration, sign-in, and sign-out with `bcryptjs` salted password hashing, password visibility toggles (`Eye` / `EyeOff`), and generic login security messaging.
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
  - Password change with current-password verification, confirmation matching, and visibility toggles.
  - Security overview inspecting session parameters (`httpOnly`, `SameSite=lax`).
- **Responsive Layout**:
  - Desktop: Persistent dark sidebar, breadcrumbs, and spacious workspace.
  - Mobile/Tablet: Header bar with profile initials and full slide-down navigation drawer.
- **Error Handling & Validation**:
  - Unified Zod schemas executed on both client and API route boundaries.
  - Safe API error formatting that never leaks raw database stack traces.

---

## Tech Stack & Architecture

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
├── public/                     # Static assets, icons, and favicon.svg
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
│   │   ├── icon.svg            # Branded application favicon
│   │   ├── layout.tsx          # Root HTML/Body wrapper with Toaster & icon metadata
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
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
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

If you prefer running a local PostgreSQL instance:

```bash
docker compose up -d db
```

Then deploy the schema:

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

### 1. Custom Session Authentication (HTTP-Only Cookies)
Rather than introducing heavy third-party authentication services (like Clerk or Auth0) or dealing with the breaking beta changes of NextAuth in Next.js 15, we implemented native session cookies using `bcryptjs` and `jose`:
- Demonstrates complete mastery of authentication fundamentals: salted password hashing, HTTP-only cookie security flags (`httpOnly`, `SameSite=lax`, `secure`), and edge-compatible token verification.
- Zero external vendor lock-in. Works 100% offline, in Docker containers, and in automated test environments.
- Immune to client-side XSS token theft (unlike storing tokens in `localStorage`).

### 2. Edge Middleware Route Protection
The Next.js `middleware.ts` runs at the Edge, intercepting incoming requests before rendering:
- Unauthenticated visitors attempting to access `/dashboard`, `/tasks/*`, or `/settings` are redirected to `/login?from=[pathname]`.
- Already-authenticated users visiting `/login`, `/register`, or `/forgot-password` are redirected straight to `/dashboard`.

### 3. Server-Side Ownership Enforcement
Security does not rely on the UI hiding buttons:
- Every query and mutation in `/api/tasks` and `/api/tasks/[id]` explicitly verifies `userId: session.id`.
- Requesting `/tasks/[id]` for a task owned by another user yields a clean `404 Not Found`, preventing malicious actors from confirming the existence of tasks via ID enumeration.

### 4. Dynamic Overdue Calculation
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

## API Reference

### Health
- `GET /api/health`: Database connectivity ping. Returns `200 { status: "ok", database: "reachable" }` or `503`.

### Authentication
- `POST /api/auth/register`: Register with `{ name, email, password, confirmPassword }`. Sets session cookie on success.
- `POST /api/auth/login`: Authenticate with `{ email, password, rememberMe? }`. Sets session cookie on success.
- `POST /api/auth/logout`: Clears the session cookie.
- `GET /api/auth/me`: Returns the active authenticated user profile.

### Tasks (All Scoped to Authenticated User)
- `GET /api/tasks`: List user's tasks with summary counts (`total`, `todo`, `inProgress`, `completed`, `overdue`).
  - Query parameters:
    - `search`: filters title and description
    - `status`: `TODO`, `IN_PROGRESS`, `COMPLETED`, `OVERDUE`, or `ALL`
    - `sort`: `created-desc`, `created-asc`, `due-asc`, `due-desc`, `title-asc`
- `POST /api/tasks`: Create task with `{ title, description, status, dueDate }`. Returns `201`.
- `GET /api/tasks/:id`: Retrieve single task by ID (returns `404` if unowned or nonexistent).
- `PATCH /api/tasks/:id`: Update fields on task (title, description, status, dueDate).
- `DELETE /api/tasks/:id`: Permanently delete task. Returns `204`.

### User Profile
- `GET /api/user/profile`: Returns user profile and total tasks count.
- `PATCH /api/user/profile`: Update user name and email.
- `POST /api/user/password`: Change password with current password verification.

---

## Quality & Verification

```bash
# Run all quality checks (ESLint, TypeScript typecheck, Vitest)
npm run check

# Run unit tests only
npm test

# Build for production
npm run build
```

---

## Assumptions & Notable Decisions

This section provides a short explanation of the assumptions and notable technical decisions made for this assessment submission:

### 1. Data Model & Minimum Task Attributes
- **Requirement Adherence**: Every task in TaskFlow strictly contains all 5 required attributes:
  - **Title**: String up to 120 characters, validated for non-empty input.
  - **Description**: Text field providing contextual detail.
  - **Status**: Tri-state enum (`TODO`, `IN_PROGRESS`, `COMPLETED`).
  - **Due Date**: ISO DateTime normalized to UTC midnight to avoid client timezone shifts.
  - **Created Date**: Auto-generated timestamp (`createdAt @default(now())`).
  - *Extension*: Added `updatedAt` for auditability and `userId` for data isolation.

### 2. Multi-Tenant Task Ownership (Notable Decision)
- Rather than a shared global task list where any visitor can alter any task, TaskFlow assumes tasks belong to authenticated accounts.
- **Server-Side Enforcement**: All database queries (`findMany`, `findFirst`, `update`, `delete`) enforce `where: { id, userId: session.id }`. Unowned task access returns a clean `404 Not Found` to prevent resource enumeration attacks.

### 3. Dynamic Overdue Calculation (Notable Decision)
- **Decision**: Overdue is not stored as a static enum value in the database because a task's due date continuously ages relative to real time. A stored `OVERDUE` status would become stale unless a background cron worker updated the database continuously.
- **Implementation**: Overdue status is calculated dynamically:
  $$\text{isOverdue} = (\text{dueDate} < \text{currentDate}) \land (\text{status} \neq \text{COMPLETED})$$
  In PostgreSQL queries, this is resolved via `WHERE "dueDate" < NOW() AND "status" != 'COMPLETED'` backed by a compound index on `(userId, dueDate)`.

### 4. Native Session Authentication Over External Lock-In (Notable Decision)
- Rather than introducing heavy third-party authentication services (e.g., Clerk, Auth0) or unstable beta packages, native session cookies were implemented using `bcryptjs` and `jose` (JWT).
- **Benefits**:
  - Zero external vendor lock-in.
  - Works 100% offline, in Docker, and in CI environments.
  - Mitigates XSS token theft via `httpOnly` and `SameSite=Lax` cookies.

### 5. Dialog Boxes & Destructive Action Safeguards (Assumption & Decision)
- **Permanent Deletion**: Task deletion is irreversible (hard delete).
- **Confirmation Dialogs**: To prevent accidental data loss or accidental session termination, interactive modal dialog boxes are required for:
  - Task deletion (both on the dashboard, task list, and task detail page).
  - Session sign-out (in desktop sidebar, mobile drawer, and settings).

### 6. Invalid Input Validation & Safe Error Handling (Requirement)
- **Validation**: Shared Zod schemas validate data on both client forms and API route handlers.
- **Error Responses**: Validation failures return structured `400 Bad Request` responses with field-specific messages (`{ message, fields: { title: [...] } }`). Database connection issues return generic `500` or `503` messages that never leak database connection strings or server stack traces.

### 7. Completion Status
- **All requirements completed**:
  1. Create a task (via modal dialogs on `/dashboard` and `/tasks`) ✅
  2. View a list of tasks (with live search, status filters, and sorting on `/tasks`) ✅
  3. View an individual task (dedicated route `/tasks/[id]` + quick view dialog) ✅
  4. Update a task (edit modal + one-click completion toggle) ✅
  5. Delete a task (with confirmation dialog box) ✅
  6. Database persistence (PostgreSQL with Prisma migrations) ✅
  7. Input validation and error handling (Zod + error boundaries) ✅
- There are no incomplete features or missing assessment requirements.

---

## Future Improvements

- **Team Workspaces & Collaboration**: Allow users to create organizations, invite team members, and assign tasks to teammates.
- **Labels & Tags**: Categorize tasks across projects or functional domains (e.g., `#engineering`, `#design`).
- **Activity Audit Log**: Track history of modifications, status transitions, and timestamps per task.
- **Email & Push Notifications**: Automated notifications for tasks due within 24 hours.
- **Recurring Tasks**: Support daily, weekly, or monthly recurring task schedules.
