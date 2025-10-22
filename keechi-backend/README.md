# Keechi Backend - Production Ready

Salon & Parlour Booking Platform Backend (Express + Node.js + Prisma + PostgreSQL)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL and credentials
```

### 3. Setup Database
```bash
# Run migrations
npm run prisma:migrate

# Seed demo data
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
# Server runs on http://localhost:5000
```

## 📡 API Endpoints

### Salons
- `GET /api/salons` - Get all salons (optional query: `?area=Gulshan`)
- `GET /api/salons/:id` - Get single salon
- `POST /api/salons` - Create salon
- `PATCH /api/salons/:id` - Update salon
- `DELETE /api/salons/:id` - Delete salon

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking

### Admin
- `POST /api/admin/login` - Login with password

## 🔑 Environment Variables

```env
DATABASE_URL=postgresql://user:password@host:5432/keechi_db
PORT=5000
NODE_ENV=development
ADMIN_PASSWORD=admin123
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
FRONTEND_URL=http://localhost:3000
```

## 🐘 Database Setup (Supabase)

1. Create Supabase project
2. Copy PostgreSQL connection string
3. Add to `.env` as `DATABASE_URL`
4. Run `npm run prisma:migrate`

## 🚀 Deploy to Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repo
4. Set environment variables in Render dashboard
5. Run build command: `npm install && npx prisma migrate deploy`
6. Run start command: `npm start`

## 📝 Notes

- All endpoints are CORS-enabled
- Admin routes should be protected in production
- Implement JWT verification for admin endpoints
- Use strong admin passwords in production
