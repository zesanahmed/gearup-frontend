# API Integration Map — GearUp Frontend

This document maps each frontend page/component to the backend endpoint(s) it consumes.

Backend repo: `<তোমার backend GitHub link>`
Backend base URL: set via `BACKEND_API_URL` (server-only env var, proxied through `/api/backend/*`)

## Architecture Note

All backend calls go through two proxy layers instead of calling the backend directly from the browser:

1. **`app/api/backend/[...path]/route.ts`** — a catch-all proxy that forwards any `/api/backend/*` request to the real backend, injecting the `Authorization: Bearer <token>` header from the httpOnly `token` cookie. Used by `lib/api-client.ts` for all authenticated/general API calls.
2. **`app/api/auth/{login,register,logout}/route.ts`** — dedicated routes that call the backend's auth endpoints and set/clear the `token` httpOnly cookie, so `middleware.ts` can read it for route protection.

This avoids exposing the backend URL or JWT to client-side JavaScript and satisfies the "protect routes with Next.js Middleware" requirement (Middleware can only read cookies, not `localStorage`).

## Public Pages

| Frontend Route | Component                | Backend Endpoint                                              |
| -------------- | ------------------------ | ------------------------------------------------------------- |
| `/`            | `app/page.tsx`           | `GET /api/gear` (featured, limit=8)                           |
| `/gear`        | `app/gear/page.tsx`      | `GET /api/gear` (filters + pagination), `GET /api/categories` |
| `/gear/[id]`   | `app/gear/[id]/page.tsx` | `GET /api/gear/:id`                                           |

## Auth

| Frontend Route   | Component                             | Backend Endpoint                                                 |
| ---------------- | ------------------------------------- | ---------------------------------------------------------------- |
| `/auth/register` | `app/auth/register/page.tsx`          | `POST /api/auth/register` (via `app/api/auth/register/route.ts`) |
| `/auth/login`    | `app/auth/login/page.tsx`             | `POST /api/auth/login` (via `app/api/auth/login/route.ts`)       |
| (logout action)  | `components/shared/logout-button.tsx` | Clears cookie only; no backend call needed                       |
| Session check    | `hooks/use-session.ts`, `lib/auth.ts` | `GET /api/auth/me`                                               |

## Customer Dashboard

| Frontend Route                        | Component                                         | Backend Endpoint                                        |
| ------------------------------------- | ------------------------------------------------- | ------------------------------------------------------- |
| `/dashboard/customer`                 | `app/dashboard/customer/page.tsx`                 | `GET /api/rentals`                                      |
| `/dashboard/customer/orders`          | `app/dashboard/customer/orders/page.tsx`          | `GET /api/rentals`, `PATCH /api/rentals/:id/cancel`     |
| `/dashboard/customer/orders/[id]`     | `app/dashboard/customer/orders/[id]/page.tsx`     | `GET /api/rentals/:id`, `PATCH /api/rentals/:id/cancel` |
| `/dashboard/customer/orders/[id]/pay` | `app/dashboard/customer/orders/[id]/pay/page.tsx` | `POST /api/payments/create`                             |
| `/dashboard/customer/payments`        | `app/dashboard/customer/payments/page.tsx`        | `GET /api/payments`                                     |
| Rent Now form                         | `components/shared/rent-gear-form.tsx`            | `POST /api/rentals`                                     |
| Review form                           | `components/shared/review-form.tsx`               | `POST /api/reviews`                                     |
| `/payment/success`, `/payment/cancel` | —                                                 | No API call; reads Stripe `session_id` from URL params  |

## Provider Dashboard

| Frontend Route                       | Component                                        | Backend Endpoint                                                                                              |
| ------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `/dashboard/provider`                | `app/dashboard/provider/page.tsx`                | `GET /api/provider/gear`, `GET /api/provider/orders`                                                          |
| `/dashboard/provider/gear`           | `app/dashboard/provider/gear/page.tsx`           | `GET /api/provider/gear`, `DELETE /api/provider/gear/:id`, `PUT /api/provider/gear/:id` (availability toggle) |
| `/dashboard/provider/gear/new`       | `app/dashboard/provider/gear/new/page.tsx`       | `POST /api/provider/gear`                                                                                     |
| `/dashboard/provider/gear/[id]/edit` | `app/dashboard/provider/gear/[id]/edit/page.tsx` | `GET /api/gear/:id`, `PUT /api/provider/gear/:id`                                                             |
| `/dashboard/provider/orders`         | `app/dashboard/provider/orders/page.tsx`         | `GET /api/provider/orders`, `PATCH /api/provider/orders/:id`                                                  |

## Admin Dashboard

| Frontend Route             | Component                              | Backend Endpoint                                                        |
| -------------------------- | -------------------------------------- | ----------------------------------------------------------------------- |
| `/dashboard/admin`         | `app/dashboard/admin/page.tsx`         | `GET /api/admin/users`, `GET /api/admin/gear`, `GET /api/admin/rentals` |
| `/dashboard/admin/users`   | `app/dashboard/admin/users/page.tsx`   | `GET /api/admin/users`, `PATCH /api/admin/users/:id`                    |
| `/dashboard/admin/gear`    | `app/dashboard/admin/gear/page.tsx`    | `GET /api/admin/gear`                                                   |
| `/dashboard/admin/rentals` | `app/dashboard/admin/rentals/page.tsx` | `GET /api/admin/rentals`                                                |

## Known Limitations / Design Decisions

- Admin user search & pagination are implemented client-side (the backend `/api/admin/users` endpoint returns a flat list without query params). Reasonable at current scale; would move to backend-level pagination for a larger user base.
- Payment currency is USD (matches backend's Stripe configuration); no SSLCommerz/BDT flow implemented.
- Image uploads are URL-based (providers paste an image link) rather than file upload, matching the backend's `images: string[]` field — `next.config.ts` allows all HTTPS hostnames as a result.
