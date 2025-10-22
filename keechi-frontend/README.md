# Keechi Frontend - Production Ready

Salon & Parlour Booking Platform Frontend (Next.js 14 + React + Tailwind CSS)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your backend API URL
```

### 3. Run Development Server
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

### 4. Build for Production
```bash
npm run build
npm start
```

## 📄 Pages

- `/` - Home page with hero section
- `/salons` - Browse salons by area
- `/book/[id]` - Book appointment at salon
- `/admin` - Admin dashboard (password protected)

## 🛠️ Key Features

- ✅ Browse salons with area-based filtering
- ✅ Book appointments with date/time picker
- ✅ Admin dashboard for managing bookings & salons
- ✅ Toast notifications for user feedback
- ✅ Mobile responsive design
- ✅ React Query for efficient data fetching

## 🔑 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

## 🚀 Deploy to Vercel

1. Push code to GitHub
2. Import project on Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy!

## 📦 Dependencies

- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching & caching
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

## 🎨 Styling

Using Tailwind CSS with custom colors:
- Primary: Pink (`#EC4899`)
- Secondary: Purple (`#8B5CF6`)

All components are mobile-first and fully responsive.

## 🔐 Admin Access

- Navigate to `/admin`
- Enter admin password (from backend .env)
- Manage bookings and salons
