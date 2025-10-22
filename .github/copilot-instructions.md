# Keechi MVP - Copilot Instructions

This is a production-ready, full-stack salon booking platform for Dhaka.

## Project Overview

- **Frontend**: Next.js 14 with App Router, Tailwind CSS, React Query
- **Backend**: Express + Node.js with Prisma ORM
- **Database**: PostgreSQL (Supabase or NeonDB recommended)
- **Deployment**: Vercel (frontend), Render (backend)

## Key Directories

- `keechi-backend/` - Express server, Prisma schema, API routes
- `keechi-frontend/` - Next.js app, React components, custom hooks
- `README.md` - Complete setup and deployment guide
- `SETUP.md` - Quick start (5-minute setup)
- `ENV_SETUP.md` - Environment variable templates

## Quick Commands

```bash
# Backend
cd keechi-backend
npm install
npm run dev

# Frontend
cd keechi-frontend
npm install
npm run dev

# Database migrations
cd keechi-backend
npx prisma migrate deploy
npx prisma db seed
```

## Important Notes

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`
- Admin password from `keechi-backend/.env` - default is `admin123`
- All sensitive data stored in `.env` files (not committed to git)

## Deployment

- Backend: Render.com (push `keechi-backend` folder)
- Frontend: Vercel.com (push `keechi-frontend` folder)
- Database: Supabase.com (PostgreSQL)

## When Making Changes

1. Always check `.env.example` files for required variables
2. Test locally before deploying
3. Update both `package.json` files if adding dependencies
4. Keep API routes consistent with frontend expectations
5. Maintain Tailwind CSS naming conventions for styling
