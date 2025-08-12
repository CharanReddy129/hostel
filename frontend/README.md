# Hostel Admin Frontend

Admin-only Next.js 14 frontend scaffold for the Hostel/PG Management SaaS.

## Quick Start

1. Install deps:
```bash
npm install
```
2. Run dev server:
```bash
npm run dev
```
3. Open http://localhost:3000

## Structure

- `src/app` with App Router and `(admin)` layout
- Simple `Navbar` and `Sidebar`
- Admin pages: `dashboard`, `hostels`, `rooms`, `beds`, `tenants`, `notices`, `reports`

API integration can be wired to `NEXT_PUBLIC_API_URL` later.


