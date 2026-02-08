# Store Ratings App (React + Express + PostgreSQL)

## Features
- Single login system with role-based access
- Roles: SYSTEM_ADMIN, NORMAL_USER, STORE_OWNER
- Normal users can sign up, login, rate stores (1–5), update their password
- Admin can create stores and users, view dashboards, filter/sort listings
- Store owners can see average rating and list of users who rated their store

## Tech
- Backend: Express + Prisma + PostgreSQL + JWT
- Frontend: React (Vite) + Role-based routes
- Hosting: Backend on Render, Frontend on Vercel

---

## Local Setup

### Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
