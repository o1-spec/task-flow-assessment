# TaskFlow — Task Management Application

A production-standard single-user implementation of the Software Engineering Internship practical assessment. The application supports creating, viewing, updating, deleting, searching, filtering, and sorting tasks, with PostgreSQL persistence and server-side validation.

## Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (works with Supabase PostgreSQL)
- Zod validation
- Sonner notifications
- Vitest

## Why this implementation

The brief requires each task to contain a title, description, status, due date, and created date, and requires full CRUD with database persistence and appropriate handling of invalid input and common errors. This implementation keeps those requirements central while adding production-oriented structure: API validation, explicit error responses, reusable UI components, loading/empty/error states, database indexes, responsive layouts, security headers, tests, and deployment-friendly configuration.

Authentication was intentionally not added because the assessment describes a single user managing tasks and does not define accounts, ownership, or permissions. Adding authentication would invent a requirement and make local review less convenient. In a multi-user product, the natural next step would be a `User` model plus task ownership and authorization checks.

## Features

- Create tasks with title, description, status, and due date
- View all tasks in a responsive dashboard
- View an individual task page
- Edit any task
- Delete tasks with a confirmation step
- Search title and description
- Filter by status
- Sort by creation date, due date, or title
- Dashboard counts for total, in-progress, completed, and overdue tasks
- Server-side Zod validation
- 404 handling for missing tasks
- Error boundary and loading states
- Responsive desktop/mobile UI
- PostgreSQL persistence
- Seed data for easy review
- Basic validation tests
- Security response headers
- Database health-check endpoint

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the database

Copy the example environment file:

```bash
cp .env.example .env
```

Set both values to your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
```

For Supabase, you can use the PostgreSQL connection details from the project dashboard. If you use a pooled URL for `DATABASE_URL`, set `DIRECT_URL` to a direct/non-pooled connection for Prisma migrations.

### 3. Create the database tables

```bash
npx prisma migrate deploy
```

### 4. Add demo data (optional)

```bash
npm run db:seed
```

### 5. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Local PostgreSQL with Docker (optional)

If you do not want to use Supabase locally:

```bash
docker compose up -d db
```

Then use:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskflow?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/taskflow?schema=public"
```

## Quality checks

```bash
npm run check
npm run build
```

## API

### `GET /api/health`

Checks that the application is running and can reach PostgreSQL. Returns `503` when the database is unavailable.

### `GET /api/tasks`

Optional query parameters:

- `search`
- `status=TODO|IN_PROGRESS|COMPLETED|ALL`
- `sort=created-desc|due-asc|due-desc|title-asc`

### `POST /api/tasks`

```json
{
  "title": "Prepare submission",
  "description": "Review the application and documentation.",
  "status": "IN_PROGRESS",
  "dueDate": "2026-09-18"
}
```

### `GET /api/tasks/:id`

Returns one task or `404`.

### `PATCH /api/tasks/:id`

Accepts one or more task fields.

### `DELETE /api/tasks/:id`

Deletes the task and returns `204`.

## Project structure

```text
src/
  app/
    api/tasks/          API route handlers
    tasks/[id]/         Individual task page
    page.tsx            Dashboard
  components/
    tasks/              Task-specific components
    ui/                 Reusable UI primitives
  lib/                  Prisma, validation, types, utilities
prisma/
  schema.prisma         Database schema
  seed.ts               Demo data
```

## Notable decisions

1. **PostgreSQL + Prisma** — relational persistence fits structured task data and Prisma gives a clear schema, migrations, and type-safe queries.
2. **Next.js App Router** — keeps the frontend, API, and server-rendered detail page in one repository while preserving clear boundaries.
3. **Zod at the API boundary** — browser validation improves UX, but the API remains the source of truth and rejects malformed input independently.
4. **UTC-normalised due dates** — due dates are stored at UTC midnight and formatted in UTC to avoid calendar-day shifts across time zones.
5. **No optimistic deletion** — destructive actions wait for a confirmed server response so the UI does not imply data was deleted when the database operation failed.
6. **Indexes on status/due date/created date** — inexpensive indexes that support the app's primary filtering and ordering patterns.
7. **No invented account system** — the brief does not define users or authorization. The codebase can be extended with ownership if that becomes a requirement.

## Production deployment

Before deploying:

1. Provision a production PostgreSQL database (Supabase, Neon, RDS, Render PostgreSQL, etc.).
2. Set `DATABASE_URL` and `DIRECT_URL` in the host environment.
3. Run production migrations with:

```bash
npx prisma migrate deploy
```

4. Build and start:

```bash
npm run build
npm start
```

The repository includes a Dockerfile and Next.js standalone output is already enabled for compact production images.

## Assumptions

- The application is single-user because no authentication or ownership requirements were provided.
- A task must always have a due date.
- Task statuses are limited to To do, In progress, and Completed.
- Deleting a task is permanent.
