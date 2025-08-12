# Backend API for Hostel/PG Management SaaS (Admin)

This is a minimal Express + Prisma (TypeScript) backend to power the admin frontend. It focuses on CRUD for hostels, rooms, beds, tenants (check-in/out), and notices. Auth is intentionally omitted for now, per request.

Quick start
- Copy .env.example to .env and keep DATABASE_URL pointing to SQLite for local dev.
- Install dependencies, generate Prisma client, run migrations, seed, and start the dev server.

Commands
```bash
# from repo root
cd backend

# install deps
npm install

# generate prisma client
npm run prisma:generate

# create DB and apply schema
npm run prisma:migrate -- --name init

# seed data
npm run seed

# run dev server on http://localhost:5000
npm run dev
```

API base URL
- http://localhost:5000/api/v1

Endpoints (initial)
- GET    /hostels
- POST   /hostels
- PUT    /hostels/:id
- DELETE /hostels/:id
- GET    /rooms
- POST   /rooms
- PUT    /rooms/:id
- DELETE /rooms/:id
- GET    /beds
- POST   /beds
- PUT    /beds/:id
- PUT    /beds/:id/status
- DELETE /beds/:id
- GET    /tenants
- POST   /tenants           (check-in; creates user + stay)
- PUT    /tenants/:id       (update tenant stay or user fields)
- POST   /tenants/:id/check-out
- GET    /notices
- POST   /notices
- PUT    /notices/:id
- DELETE /notices/:id
- GET    /reports           (placeholder)

Notes
- Seed script creates a sample organization, admin user, hostel, room, beds, and a notice.
- You can switch to PostgreSQL later by updating prisma/schema.prisma datasource and DATABASE_URL in .env.
- CORS is set to http://localhost:3000 by default to match the frontend dev server.

