# GearUp Frontend 🏋️ — Rent Sports & Outdoor Gear Instantly

A Next.js (App Router) frontend for the GearUp sports & outdoor gear rental platform. Consumes the [GearUp backend API](<তোমার backend GitHub link>) built in the previous assignment.

Built for Programming Hero's **Next Level AI-Driven Software Engineering Bootcamp — Level 2, Assignment 5**.

---

## 🚀 Live Deployment

- **App URL:** `https://<your-vercel-frontend-domain>.vercel.app`
- **Backend API:** `https://<your-vercel-backend-domain>.vercel.app`
- **GitHub Repo:** `https://github.com/zesanahmed/gearup-frontend`

---

## 🔑 Admin Credentials

| Field | Value |
|---|---|
| Email | `admin@gearup.com` |
| Password | `Admin@123456` |

(Same admin account seeded on the backend — see the backend repo's README for seeding instructions.)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling / Components | Tailwind CSS + shadcn/ui (Base UI primitives, Vega preset) |
| Server state | TanStack Query (React Query) |
| Forms & validation | React Hook Form + Zod |
| Auth | JWT stored in an httpOnly cookie, verified with `jose` in Next.js Middleware |
| Payments | Stripe.js (Checkout redirect) |
| Deployment | Vercel |

---

## ✨ Features

**Public**
- Home page with featured gear
- Gear browse page with search, category/price/availability filters, and pagination
- Gear details page with image, specs, provider info, and reviews

**Customer**
- Registration (role selection) and login
- Date-range "Rent Now" flow with live price estimate and past-date prevention
- Order history, order detail, and order cancellation
- Stripe Checkout payment flow with dedicated success/cancel pages
- Payment history
- Review submission for returned rentals

**Provider**
- Dashboard overview (listed gear, pending orders, active rentals)
- Full gear inventory CRUD, including an availability toggle
- Incoming order management with status-transition actions (Confirm → Mark Picked Up → Mark Returned)

**Admin**
- Platform-wide overview stats
- User management with search, pagination, and suspend/activate actions
- Gear and rental oversight tables

**Cross-cutting**
- Role-based route protection via Next.js Middleware (reads the httpOnly session cookie)
- Consistent toast-based error feedback for every API failure
- Route-level `loading.tsx` and `error.tsx`, plus a root `global-error.tsx` and `not-found.tsx`

---

## 📐 Architecture

### Why a BFF (Backend-for-Frontend) layer

Next.js Middleware runs on the Edge runtime and can only read **cookies**, not `localStorage`. Since the backend returns the JWT in a JSON body, this app never stores the token in the browser directly. Instead:

- `app/api/auth/{login,register,logout}/route.ts` call the real backend, then set/clear an **httpOnly, `SameSite=Lax`** cookie.
- `app/api/backend/[...path]/route.ts` is a catch-all proxy: it reads the cookie server-side, attaches `Authorization: Bearer <token>`, and forwards the request to the backend. All authenticated API calls in the app go through this proxy via `lib/api-client.ts`.
- `middleware.ts` reads the same cookie to protect `/dashboard/**` routes and enforce role-based access.

This keeps the JWT out of client-side JavaScript entirely (XSS-resistant) and satisfies the "protect routes with Next.js Middleware" requirement, since Middleware genuinely has something to read.

`SameSite=Lax` (not `Strict`) is required specifically so the cookie survives the top-level redirect Stripe performs back to `/payment/success`.

### Folder structure

```
app/
├── (public)/ page.tsx, gear/, gear/[id]/       # browsing
├── auth/{login,register}/                       # auth forms
├── dashboard/{customer,provider,admin}/         # role dashboards, each with its own layout.tsx
├── payment/{success,cancel}/                    # Stripe return pages
├── api/
│   ├── auth/{login,register,logout}/route.ts    # BFF: sets/clears the session cookie
│   └── backend/[...path]/route.ts               # generic authenticated proxy to the backend
├── layout.tsx, loading.tsx, error.tsx, global-error.tsx, not-found.tsx
components/
├── ui/                                          # shadcn-generated primitives
└── shared/                                      # Navbar, GearCard, StatusBadge, forms, etc.
hooks/                                           # TanStack Query hooks per domain (gear, rentals, payments, provider, admin, auth)
lib/                                             # api-client, auth (session helper), validations, utils
types/                                           # shared API response types
middleware.ts                                    # role-based route protection
```

---

## ⚙️ Local Setup

```bash
git clone https://github.com/zesanahmed/gearup-frontend.git
cd gearup-frontend
npm install
```

### Environment variables — `.env.local`

```env
BACKEND_API_URL=https://<your-gearup-backend>.vercel.app
JWT_ACCESS_SECRET=<must match the backend's JWT_ACCESS_SECRET exactly>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> `BACKEND_API_URL` and `JWT_ACCESS_SECRET` are server-only (no `NEXT_PUBLIC_` prefix) since only the proxy routes and Middleware ever touch them.

```bash
npm run dev
```
Visit `http://localhost:3000`.

---

## 📬 API Integration

See [`API_INTEGRATION.md`](./API_INTEGRATION.md) for the full page-to-endpoint mapping.

---

## 🧠 Key Design Decisions

- **Cookie-based session, not localStorage** — required for Middleware to enforce role-based protection (see Architecture above).
- **All backend calls proxied through the Next.js server** — avoids needing CORS configuration on the backend and keeps the backend URL/JWT out of client bundles.
- **Client-side search & pagination for Admin → Users** — the backend's `/api/admin/users` returns a flat list with no query params; filtering/paging happens in the browser. Fine at this scale; would move server-side for a larger user base.
- **Image URLs, not file uploads** — matches the backend's `images: string[]` field. `next.config.ts` allows all HTTPS hostnames as a result, since providers can paste any public image link.
- **USD via Stripe Checkout** — matches the backend's Stripe configuration; no SSLCommerz/BDT flow.

---

## 👤 Author

**Zesan Ahmed**
Programming Hero — Level 2, Next Level AI-Driven Software Engineering Bootcamp
