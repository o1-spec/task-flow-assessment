# TaskFlow — System Architecture & Design Document

This document outlines the architectural decisions, system topology, security boundaries, and data design of **TaskFlow**, submitted for the PowerLabs Software Engineer Internship practical assessment.

---

## 1. System Topology & Layers

TaskFlow adopts a modern, modular 3-tier architecture using the Next.js 15 App Router:

```
[ Client Browser (React 19) ]
         │
         ▼  (HTTPS / Secure Cookie)
[ Next.js Edge Middleware ] ──────────────► [ Redirect / Rewrite ]
         │  (Session Validated)
         ▼
[ Next.js Server Components & Route Handlers ]
         │
         ▼  (Type-safe Query Engine)
[ Prisma ORM Client (v6) ]
         │
         ▼  (PostgreSQL Wire Protocol / Pooling)
[ PostgreSQL Database (Supabase) ]
```

### Layer Breakdown

1. **Presentation Layer (React 19 + Tailwind CSS)**:
   - **Server Components (RSC)**: Fetch and render data directly on the server for initial page loads (e.g., Task Detail view), reducing client bundle size and latency.
   - **Client Components**: Handle dynamic state, debounced live search, interactive modal dialogs, and toast notifications.
2. **Routing & Edge Security Layer (Next.js Middleware)**:
   - Evaluates incoming request paths at the Edge before route execution.
   - Unauthenticated access to `/dashboard`, `/tasks/*`, or `/settings` is halted and redirected to `/login?from=[path]`.
   - Logged-in users attempting to access `/login` or `/register` are routed to `/dashboard`.
3. **Application & API Layer (Next.js App Router API)**:
   - RESTful route handlers in `src/app/api/*`.
   - Zod validation on incoming request payloads.
   - Session extraction and user ID injection into queries.
4. **Data Persistence Layer (Prisma ORM + PostgreSQL)**:
   - Relational database schema with foreign-key constraints and cascade rules.
   - Compound B-tree indexes supporting common sorting and filtering paths.

---

## 2. Authentication & Session Flow

Rather than relying on third-party black-box auth providers, TaskFlow uses an interview-explainable, zero-lock-in session architecture:

```
[ User Browser ]                  [ Next.js API / Edge ]            [ Database (PostgreSQL) ]
       │                                     │                                  │
       │─── 1. POST /api/auth/login ────────►│                                  │
       │    { email, password }              │─── 2. Query User by email ──────►│
       │                                     │◄─── Returns passwordHash ────────│
       │                                     │
       │                                     │─── 3. bcrypt.compare()
       │                                     │─── 4. Sign JWT with jose (HS256)
       │◄── 5. Set HTTP-Only Cookie ─────────│
       │    taskflow_session=<jwt>           │
       │                                     │
       │─── 6. GET /tasks (with Cookie) ────►│
       │                                     │─── 7. Verify JWT at Edge
       │                                     │─── 8. Query scoped to userId ───►│
       │◄── 9. Render User Tasks Only ───────│◄─── Returns user's records ──────│
```

### Security Properties
- **`HttpOnly`**: Cookie is inaccessible to client JavaScript, mitigating Cross-Site Scripting (XSS) session theft.
- **`SameSite=Lax`**: Guards against Cross-Site Request Forgery (CSRF).
- **`Secure`**: Set to `true` in production to enforce transmission over TLS/HTTPS.
- **Timing-Safe Password Comparison**: Uses `bcryptjs` constant-time comparison to prevent timing attacks.

---

## 3. Data Model & Schema Design

```
┌─────────────────────────┐            ┌─────────────────────────┐
│          User           │            │          Task           │
├─────────────────────────┤            ├─────────────────────────┤
│ id (PK, CUID)           │ 1        * │ id (PK, CUID)           │
│ name (VARCHAR 100)      │───────────<│ userId (FK, User.id)    │
│ email (UNIQUE, VARCHAR) │            │ title (VARCHAR 120)     │
│ passwordHash (TEXT)     │            │ description (TEXT)      │
│ createdAt (TIMESTAMP)   │            │ status (ENUM TaskStatus)│
│ updatedAt (TIMESTAMP)   │            │ dueDate (TIMESTAMP)     │
└─────────────────────────┘            │ createdAt (TIMESTAMP)   │
                                       │ updatedAt (TIMESTAMP)   │
                                       └─────────────────────────┘
```

### Indexing Strategy
To guarantee fast response times under growing dataset sizes, specific B-tree indexes are defined in `prisma/schema.prisma`:
- `User(email)`: Unique index for $O(1)$ login lookups and duplicate account prevention.
- `Task(userId)`: Index for basic user data isolation queries.
- `Task(userId, status)`: Compound index for filtered views (e.g., "In Progress" tasks).
- `Task(userId, dueDate)`: Compound index for deadline sorting and overdue calculation queries.
- `Task(userId, createdAt)`: Compound index for default chronologically descending order.

---

## 4. Key Architectural Decisions & Tradeoffs

| Decision | Alternative Considered | Why TaskFlow Chose This Approach |
| :--- | :--- | :--- |
| **Custom Session Cookies (`bcryptjs` + `jose`)** | NextAuth / Clerk / Firebase | Demonstrates mastery of core web security fundamentals; eliminates external vendor lock-in; runs completely offline and in Docker. |
| **Calculated "Overdue" Status** | Database Enum Value | Due dates age continuously. Storing an `OVERDUE` enum would produce stale data unless a continuous cron job executed against the database. Dynamic computation ($dueDate < currentDate \land status \neq COMPLETED$) is always accurate. |
| **UTC Midnight Normalization** | Local Datetime Strings | Normalizing due dates to `YYYY-MM-DDT00:00:00.000Z` prevents "date slipping" across time zones when users collaborate across regions. |
| **Fail-Closed Authorization** | Client-side filter only | All API endpoints and server page loaders strictly enforce `where: { id, userId: session.id }`. Accessing another user's task ID returns `404 Not Found` to prevent ID enumeration. |
| **No Optimistic Deletion** | Optimistic UI update | Deletion permanently removes records. Requiring server confirmation ensures the UI never falsely displays data as deleted when an error occurred. |

---

## 5. Scalability Considerations

1. **Connection Pooling**: Uses Supabase's transaction-mode connection pooler (`pgbouncer=true` on port 6543) to prevent connection exhaustion during concurrent serverless invocations.
2. **Stateless Edge Verification**: JWT session tokens are verified cryptographically in memory at the Edge without requiring an extra database roundtrip on every page navigation.
3. **Pagination Readiness**: API handlers return `meta: { count }` structures, allowing easy transition from `findMany()` to cursor- or offset-based pagination as task volume scales.
