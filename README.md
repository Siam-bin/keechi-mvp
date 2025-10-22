# 🚀 KEECHI MVP - PRODUCTION READY

**Dhaka's Local Salons — One Click Away.**

A full-stack salon & parlour booking platform built with Next.js 14, Express, PostgreSQL, and Prisma.

---

## 🎯 QUICK SETUP (5 MINUTES)

### Prerequisites
- Node.js 18+
- PostgreSQL or Supabase account

### Step 1: Backend Setup
```bash
cd keechi-backend
npm install
cp .env.example .env
# Edit .env - Add your DATABASE_URL (see Database Setup below)
npx prisma migrate deploy
npx prisma db seed
npm run dev
# ✅ Backend runs on http://localhost:5000
```

### Step 2: Frontend Setup
```bash
cd ../keechi-frontend
npm install
cp .env.local.example .env.local
# Keep defaults (connects to localhost:5000)
npm run dev
# ✅ Frontend runs on http://localhost:3000
```

### Step 3: Test It!
- **Home**: http://localhost:3000
- **Salons**: http://localhost:3000/salons → Click "Book Now"
- **Admin**: http://localhost:3000/admin (password: `admin123`)
- **API Health**: http://localhost:5000/health

---

## 📦 ENVIRONMENT VARIABLES

### Backend: `keechi-backend/.env`

**Development (with Supabase):**
```env
DATABASE_URL="postgresql://postgres.PROJECT:[PASSWORD]@db.PROJECT.supabase.co:5432/postgres?sslmode=require"
PORT=5000
NODE_ENV=development
ADMIN_PASSWORD=admin123
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_here
FRONTEND_URL=http://localhost:3000
```

**Production:**
```env
DATABASE_URL="postgresql://[supabase_connection]"
PORT=5000
NODE_ENV=production
ADMIN_PASSWORD=use_a_very_strong_random_password
JWT_SECRET=generate_a_new_random_key_32_chars_minimum
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

### Frontend: `keechi-frontend/.env.local`

**Development:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Production:**
```env
NEXT_PUBLIC_API_URL=https://your-keechi-api.onrender.com/api
```

---

## 💾 DATABASE SETUP

### Option 1: Supabase (Recommended - Cloud)
1. Create account at https://supabase.com
2. Create new project
3. Go to Settings → Database → Connection String (Use Session)
4. Copy and paste into `.env` as `DATABASE_URL`
5. Run: `npx prisma migrate deploy`

### Option 2: Local PostgreSQL
```bash
# Create database
createdb keechi_db

# Add to .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/keechi_db"

# Run migrations
npx prisma migrate deploy
```

### Option 3: NeonDB (Cloud Alternative)
1. Sign up at https://neon.tech
2. Create project
3. Copy connection string as `DATABASE_URL`

---

## 📁 PROJECT STRUCTURE

```
keechi.pilot/
├── keechi-backend/              # Express + Node.js
│   ├── src/routes/              # API endpoints
│   ├── prisma/schema.prisma     # Database schema
│   └── package.json
├── keechi-frontend/             # Next.js 14
│   ├── src/app/                 # Pages & routes
│   ├── src/components/          # UI components
│   ├── src/hooks/               # Custom React hooks
│   └── package.json
├── README.md                    # This file (comprehensive documentation)
├── package.json                 # Monorepo config
├── vercel.json                  # Vercel deployment config
└── render.yaml                  # Render deployment config
```

---

## 🎨 DESIGN SYSTEM & UI COMPONENTS

### Color Palette
- **Primary Gold**: `#FBBF24` - Buttons, highlights, badges
- **Primary Teal**: `#2B7A78` - Brand color for headers
- **Secondary Teal**: `#3AAFA9` - Accents and gradients
- **Soft Mint**: `#DEF2F1` - Highlight backgrounds
- **Off-White**: `#F9FAFB` - Primary background
- **Dark Slate**: `#1F2937` - Primary text
- **Charcoal**: `#1F1F1F` - Dark backgrounds

### Key Design Features
✨ **Professional Components**
- Rounded-3xl/4xl corners on all cards (iOS-style)
- Smooth 300ms transitions on interactive elements
- Generous whitespace and padding
- Consistent Lucide React icons
- Hover elevation effects with shadow depth

📱 **Responsive Design**
- Mobile-first approach
- Touch-friendly button sizes (minimum 44px)
- Adaptive grid layouts (1 → 2 → 3 columns)
- Proper spacing for all screen sizes

♿ **Accessibility**
- WCAG AA color contrast ratios
- Clear focus indicators for keyboard navigation
- Semantic HTML structure
- Icon + text combinations for clarity

---

## 🏠 SALON CARD REDESIGN (SalonCardModern.js)

Three modern, premium card variations are included, inspired by apps like Fresha, StyleSeat, and Booksy.

**Location**: `/src/components/SalonCardModern.js`

### Card Variation 1: Compact Style ✅
**Best for**: Grid layouts, salon listings page

```javascript
import { SalonCardCompact } from "@/components/SalonCardModern";

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {salons.map(salon => (
    <SalonCardCompact key={salon.id} salon={salon} featured={false} />
  ))}
</div>
```

**Features**:
- Square aspect ratio on mobile, landscape on larger screens
- Featured badge (optional) - top left
- Floating rating badge - top right
- Open/Closed status indicator - bottom left
- Services preview text - truncated 2 lines
- Gold "Book Now" button
- Smooth hover: image zoom, shadow increase, scale 1.02x

### Card Variation 2: Overlay Style ✅
**Best for**: Featured section, hero cards, promotional listings

```javascript
import { SalonCardOverlay } from "@/components/SalonCardModern";

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {featuredSalons.map(salon => (
    <SalonCardOverlay key={salon.id} salon={salon} featured={true} />
  ))}
</div>
```

**Features**:
- Full-width image with dark gradient overlay
- Content positioned over image at bottom
- Featured badge and rating overlay - top corners
- Premium visual impact (Fresha/StyleSeat inspired)
- White text on gradient background
- Status badge and book button in footer

### Card Variation 3: Split Style ✅
**Best for**: Search results, detail listings, larger screens

```javascript
import { SalonCardSplit } from "@/components/SalonCardModern";

<div className="space-y-4">
  {salons.map(salon => (
    <SalonCardSplit key={salon.id} salon={salon} featured={false} />
  ))}
</div>
```

**Features**:
- Side-by-side layout (vertical on mobile, horizontal on desktop)
- Image left (40% width on desktop)
- Content right with better readability
- Clean compact rating badge
- Status badge and book button in footer
- Perfect for search results

### Data Requirements for Cards

Each `salon` object should have:
```javascript
{
  id: 1,
  name: "Glam Salon Dhaka",
  area: "Banani, Dhaka",
  rating: 4.8,
  imageUrl: "https://...",
  services: ["Haircut", "Hair Coloring", "Facial"],  // Array or string
  servicesTagline: "Hair • Color • Spa"              // Optional custom tagline
}
```

### Service Tagline Priority
Cards prioritize services display in this order:
1. `salon.servicesTagline` - Custom text set by shop owner
2. `salon.services` array - Auto-formatted from services list
3. `"Beauty Services"` - Default fallback text

---

## 🔧 SERVICES MANAGEMENT - FULL CRUD

Shop owners can now fully manage services from the dashboard.

**Location**: `/src/app/dashboard/page.js`

### Features Included
✅ **Create**: Add new services  
✅ **Read**: Display services list  
✅ **Update**: Edit existing services  
✅ **Delete**: Remove services with confirmation  

### How Shop Owners Use It

1. Login to shop owner account
2. Go to **Dashboard** → **Services** tab
3. Click **"Add Service"** to create new or **"Edit"** to modify
4. Fill in:
   - Service Name (required)
   - Description (optional)
   - Price (required)
   - Duration in minutes (required)
5. Click **"Update Service"** or **"Add Service"** to save
6. Click **"Delete"** to remove a service (with confirmation)

### API Endpoints (All require shop owner auth)
```
GET    /api/services/owner/my-services   - Fetch your services
POST   /api/services                      - Create new service
PATCH  /api/services/:id                  - Update existing service
DELETE /api/services/:id                  - Delete service
```

### Handler Functions Implemented
- `handleEditService(service)` - Load service data into form
- `handleDeleteService(serviceId)` - Remove service with confirmation
- `handleCancelEdit()` - Reset form and exit edit mode
- `handleAddService()` - Create or update service based on state

---

## 📝 DYNAMIC SERVICES TAGLINE

Shop owners can customize the services tagline displayed on salon cards.

**Location**: `/src/components/ShopEditForm.js`

### How to Use

1. Go to **Dashboard** → **Settings** tab
2. Scroll to "Details" section
3. Find "Services Tagline" input field
4. Enter custom services text (e.g., "Hair Styling • Hair Coloring • Facial • Massage • Threading")
5. Click **"Save Changes"**
6. Custom tagline now displays on all salon cards

### Data Flow
```
Shop Owner Dashboard Settings
    ↓
    PATCH /api/shops/:id with servicesTagline
    ↓
Backend: Shop.servicesTagline field
    ↓
GET /api/salons retrieves updated data
    ↓
SalonCardModern.js displays custom tagline on cards
```

### Fallback Logic
If shop owner doesn't set custom tagline:
1. System checks for services array
2. If found, uses first 3 services (formatted with • separator)
3. If no services, shows "Beauty Services" (default)

### Files Modified
- `src/components/ShopEditForm.js` - Added servicesTagline field and input
- `src/components/SalonCardModern.js` - Updated all 3 card variants to prioritize tagline

### Backend Integration Required
Update Prisma schema to support servicesTagline:
```javascript
// In schema.prisma
model Shop {
  // ... existing fields
  servicesTagline String?  // Optional, nullable
  // ... other fields
}
```

---

## 🚀 DEPLOYMENT

### Backend → Render

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Create Render Web Service**
   - Visit [render.com](https://render.com)
   - New → Web Service
   - Connect GitHub repo
   - Root Directory: `keechi-backend`
   - Build Command: `npm install && npx prisma migrate deploy`
   - Start Command: `npm start`

3. **Set Environment Variables** (in Render dashboard):
```
DATABASE_URL=postgresql://...
PORT=5000
NODE_ENV=production
ADMIN_PASSWORD=very_strong_password
JWT_SECRET=random_key_32_chars_minimum
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

4. **Deploy!** Copy your Render URL (e.g., https://keechi-api.onrender.com)

### Frontend → Vercel

1. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import GitHub repo
   - Root Directory: `keechi-frontend`

2. **Set Environment Variable**:
```
NEXT_PUBLIC_API_URL=https://keechi-api.onrender.com/api
```

3. **Deploy!** ✅

### Database → Supabase
Already done if you used Supabase in setup (handles all backups & scaling automatically).

---

## 🐛 TROUBLESHOOTING

### "Cannot find module" errors
```bash
rm -r node_modules package-lock.json
npm install
```

### "Failed to load salons" in frontend
- Check backend is running: `http://localhost:5000/health`
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Check browser console for CORS errors

### Database connection errors
- Verify DATABASE_URL format is correct
- Check PostgreSQL/Supabase is running
- Verify credentials

### Prisma migration errors
```bash
# Reset database (development only!)
npx prisma migrate reset
npx prisma db seed
```

### Services show "[object Object]"
- Ensure services are array of strings: `["Haircut", "Coloring"]`
- Or pre-formatted string: `"Haircut • Coloring"`

### Images not loading on salon cards
- Check `salon.imageUrl` is valid
- Component shows emoji placeholder if URL is empty

---

## 📋 FEATURES INCLUDED

### User Features ✅
- Browse salons by area
- Search & filter salons
- View dynamic services tagline
- Book appointments (date, time, service, notes)
- View salon ratings
- Toast notifications
- Mobile responsive design

### Shop Owner Features ✅
- Dashboard with tabs (Bookings, Services, Settings)
- Full service management (Create, Read, Update, Delete)
- Customize services tagline for salon card display
- Edit shop profile and images
- View and manage bookings
- Track booking statuses

### Admin Features ✅
- Secure password-protected login
- Manage all bookings (4 statuses: Pending, Confirmed, Completed, Cancelled)
- Add/Edit/Delete salons
- View all booking details and statistics
- Manage admin accounts

### Technical Features ✅
- JWT authentication with role-based access (Guest, User, ShopOwner, Admin)
- CORS enabled for cross-origin requests
- Comprehensive error handling and validation
- Database migrations with Prisma
- Seed data (3 demo salons with services)
- React Query caching for performance
- Tailwind CSS responsive styling
- Production-ready deployment configs

---

## 📊 TECH STACK

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| UI Icons | Lucide React |
| State Management | React Query, Context API |
| Backend | Express.js, Node.js 18+ |
| Database | PostgreSQL (Supabase/NeonDB) |
| ORM | Prisma |
| Authentication | JWT tokens |
| Deployment | Vercel (frontend), Render (backend) |

---

## 🔑 DEMO CREDENTIALS & INFO

- **Admin Password**: `admin123` (change in production!)
- **Demo Salons**: Glamour Dhaka, Beauty Parlour Elite, Style Hub
- **API Health Check**: http://localhost:5000/health
- **Frontend URL**: http://localhost:3000
- **Backend URL**: http://localhost:5000

### Test Accounts
- **Admin Login**: Go to `/admin`, password: `admin123`
- **Shop Owner**: Create account via signup, then verify email
- **User**: Browse salons anonymously or create account to book

---

## 📖 QUICK REFERENCE

### Common Commands

**Backend Development**
```bash
cd keechi-backend
npm run dev              # Start development server
npx prisma studio      # View database GUI
npx prisma migrate dev --name "<migration_name>"  # Create migration
npm run seed            # Seed demo data
```

**Frontend Development**
```bash
cd keechi-frontend
npm run dev             # Start development server
npm run build           # Production build
npm run lint            # Run ESLint
```

### API Routes Summary
```
Auth:
  POST   /api/auth/login
  POST   /api/auth/logout

Salons:
  GET    /api/salons                    # List all salons
  GET    /api/salons/:id                # Get salon details
  POST   /api/salons (admin only)       # Create salon
  PATCH  /api/salons/:id (admin only)   # Update salon
  DELETE /api/salons/:id (admin only)   # Delete salon

Services:
  GET    /api/services/owner/my-services (shop owner)
  POST   /api/services (shop owner)
  PATCH  /api/services/:id (shop owner)
  DELETE /api/services/:id (shop owner)

Bookings:
  GET    /api/bookings (admin)
  POST   /api/bookings                  # Create booking
  PATCH  /api/bookings/:id (admin)      # Update booking status
```

---

## 🎯 NEXT STEPS

### Optional Enhancements
1. **Booking Modal** - Click "Book Now" opens booking form in modal
2. **Favorite Button** - Save favorite salons (requires auth)
3. **Reviews & Ratings** - Customer reviews on salon cards
4. **Map Integration** - Show salon locations on map
5. **Notifications** - Email/SMS booking confirmations
6. **Payment Integration** - Stripe/Bkash payment processing
7. **Video/Gallery** - Multiple salon images and video tours
8. **Advanced Search** - Filter by services, price, rating

### Performance Optimizations
- Image optimization with Next.js Image component
- Database query optimization with Prisma
- Caching strategy with React Query
- Code splitting and lazy loading
- CDN for static assets

---

## 📞 SUPPORT

For issues or questions:
1. Check the **Troubleshooting** section above
2. Check `/keechi-backend/README.md` for backend-specific help
3. Check `/keechi-frontend/README.md` for frontend-specific help
4. Review database logs: `npx prisma db seed`

---

**Made with 💇 for Dhaka's salons!**

Last Updated: October 2025  
Status: ✅ Production Ready
