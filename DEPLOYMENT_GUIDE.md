# 🚀 KEECHI DEPLOYMENT GUIDE
## Complete Deployment to Vercel, Heroku & Neon

**Date:** October 23, 2025  
**Status:** Ready for Production Deployment

---

## 📋 DEPLOYMENT ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    END-USER BROWSER                         │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ↓
┌─────────────────────────────────────────────────────────────┐
│          VERCEL (Frontend - Next.js 14)                     │
│  - Global CDN with automatic scaling                        │
│  - Serverless functions (optional)                          │
│  - Environment: NEXT_PUBLIC_API_URL                         │
│  - Auto-deploy from GitHub on push                          │
└────────────────────────┬────────────────────────────────────┘
                         │ API Calls (REST)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│      HEROKU (Backend - Express.js)                          │
│  - Node.js dyno (auto-scaling)                              │
│  - Environment: DATABASE_URL, JWT_SECRET, etc.              │
│  - Auto-restart on crashes                                  │
│  - Add-ons: Postgres, Logging                               │
└────────────────────────┬────────────────────────────────────┘
                         │ SQL Queries
                         ↓
┌─────────────────────────────────────────────────────────────┐
│       NEON (Database - PostgreSQL)                          │
│  - Serverless PostgreSQL                                    │
│  - Auto-scaling compute                                     │
│  - Connection pooling via PgBouncer                         │
│  - Automatic backups & PITR                                 │
│  - Free tier: 3 databases, unlimited branching              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 PRE-DEPLOYMENT CHECKLIST

### ✅ Backend Preparation
- [ ] Create `.env.example` in `keechi-backend/` with all required variables
- [ ] Ensure `package.json` has correct `start` script
- [ ] Test locally: `npm run dev` works without errors
- [ ] Verify all environment variables are documented
- [ ] Check that `node_modules/` is in `.gitignore`
- [ ] Confirm Prisma migrations are committed to git

### ✅ Frontend Preparation
- [ ] Create `.env.local.example` in `keechi-frontend/` with `NEXT_PUBLIC_API_URL`
- [ ] Test build locally: `npm run build` completes successfully
- [ ] Verify all API calls use `NEXT_PUBLIC_API_URL` env variable
- [ ] Check that `.env.local` is in `.gitignore`
- [ ] Ensure `next.config.js` is configured correctly

### ✅ Repository Setup
- [ ] Push code to GitHub repository
- [ ] Repository is public or you have Vercel/Heroku access
- [ ] Git history is clean with meaningful commits
- [ ] `.gitignore` includes: `node_modules/`, `.env*`, `*.log`

---

## 📦 STEP 1: NEON DATABASE SETUP

### 1.1 Create Neon Account
1. Visit https://console.neon.tech
2. Sign up with GitHub/Email
3. Create new project (free tier available)
4. Choose region closest to your users (Asia if in Dhaka)

### 1.2 Create Database
1. In Neon console, go to "Databases"
2. Create new database (default: `neondb`)
3. Go to "Connection string" tab
4. Copy the **Pooled Connection String** (includes PgBouncer)

**Connection String Format:**
```
postgresql://username:password@ep-xxxx-xxxx.neon.tech/neondb?sslmode=require&pool_idle_in_transaction_session_timeout=120000
```

### 1.3 Initial Setup
```bash
# Save the connection string securely
# You'll use it for both local testing and Heroku deployment

# Test connection locally first (optional)
psql "postgresql://username:password@ep-xxxx.neon.tech/neondb"
```

### 1.4 Document Environment Variables
**Save these for later use:**
```
DATABASE_URL=postgresql://username:password@ep-xxxx.neon.tech/neondb?sslmode=require
```

✅ **Status:** Neon database created and ready

---

## 🚀 STEP 2: HEROKU BACKEND DEPLOYMENT

### 2.1 Heroku Account & CLI Setup

#### Create Account
1. Visit https://www.heroku.com
2. Sign up (free tier available)
3. Verify email address

#### Install Heroku CLI
```bash
# Windows: Download from https://devcenter.heroku.com/articles/heroku-cli
# Or use npm:
npm install -g heroku

# Verify installation
heroku --version
```

#### Login to Heroku
```bash
heroku login
# Opens browser to authenticate
```

### 2.2 Create Heroku Application

```bash
cd keechi-backend

# Create new Heroku app (name must be unique)
heroku create keechi-api-production

# Or if you have an existing app:
# heroku create  (auto-generates name)

# Verify app was created
heroku apps
```

**Your app URL will be:** `https://keechi-api-production.herokuapp.com`

### 2.3 Set Environment Variables

```bash
# Set DATABASE_URL (from Neon)
heroku config:set DATABASE_URL="postgresql://username:password@ep-xxxx.neon.tech/neondb?sslmode=require"

# Set other required variables
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
heroku config:set ADMIN_PASSWORD=your_secure_password_here
heroku config:set JWT_SECRET=your_long_random_secret_key_here_minimum_32_chars
heroku config:set FRONTEND_URL=https://keechi-frontend.vercel.app  # Update with actual Vercel URL

# Verify variables are set
heroku config
```

### 2.4 Create Procfile

Create file: `keechi-backend/Procfile`

```
web: node src/index.js
release: npx prisma migrate deploy
```

This ensures migrations run before app starts.

### 2.5 Verify Build Configuration

Ensure `keechi-backend/package.json` has:
```json
{
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

### 2.6 Deploy to Heroku

```bash
cd keechi-backend

# Add Heroku as remote (if not auto-created)
heroku git:remote -a keechi-api-production

# Deploy
git push heroku main

# View logs
heroku logs --tail

# If deployment fails, check detailed logs
heroku logs --app keechi-api-production
```

### 2.7 Test Backend Deployment

```bash
# Test health endpoint
curl https://keechi-api-production.herokuapp.com/health

# Expected response:
# { "status": "ok", "message": "Keechi Backend running on Heroku" }
```

### 2.8 Run Database Migrations

```bash
# The Procfile will run migrations on deployment
# But you can manually trigger with:
heroku run npx prisma migrate deploy

# Run seeds (optional - for demo data)
heroku run npx prisma db seed
```

✅ **Status:** Backend deployed on Heroku

---

## 🌐 STEP 3: VERCEL FRONTEND DEPLOYMENT

### 3.1 Vercel Account Setup

1. Visit https://vercel.com
2. Sign up with GitHub account
3. Authorize Vercel to access your GitHub repos

### 3.2 Import Project

1. In Vercel dashboard, click "New Project"
2. Select GitHub repository: `keechi-frontend`
3. **Root Directory:** Select `keechi-frontend/`
4. Click "Import"

### 3.3 Configure Environment Variables

In Vercel Project Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://keechi-api-production.herokuapp.com/api
```

**Important:** Only variables starting with `NEXT_PUBLIC_` are available in browser

### 3.4 Configure Build Settings

Vercel auto-detects Next.js, but verify:
- **Framework:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 3.5 Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Get your deployment URL: `https://keechi-xxxx.vercel.app`

### 3.6 Enable Preview Deployments

Vercel auto-creates preview deployments for pull requests. This is enabled by default.

### 3.7 Test Frontend Deployment

```bash
# Visit your Vercel URL
https://keechi-xxxx.vercel.app

# Test key flows:
# 1. Visit home page
# 2. Click "Browse Salons"
# 3. Check browser console for API calls
# 4. Verify API URL in Network tab
```

✅ **Status:** Frontend deployed on Vercel

---

## 🔌 STEP 4: CONNECT FRONTEND TO BACKEND

### 4.1 Update CORS in Backend

Edit `keechi-backend/src/index.js`:

```javascript
// Update CORS to include Vercel URL
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://keechi-xxxx.vercel.app',  // Your Vercel URL
    process.env.FRONTEND_URL
  ],
  credentials: true
}));
```

### 4.2 Redeploy Backend

```bash
cd keechi-backend
git add src/index.js
git commit -m "Update CORS for Vercel deployment"
git push heroku main
```

### 4.3 Verify API Connectivity

1. Open Vercel frontend
2. Open browser DevTools → Network tab
3. Try to load salons page
4. Check if API calls go to Heroku backend
5. Verify responses contain data

✅ **Status:** Frontend and Backend connected

---

## 🔐 STEP 5: SECURITY & OPTIMIZATION

### 5.1 Update Environment Variables

#### Backend (Heroku)
```bash
heroku config:set JWT_SECRET="$(openssl rand -base64 32)"
heroku config:set ADMIN_PASSWORD="strong_password_here"
```

#### Frontend (Vercel)
- Ensure `NEXT_PUBLIC_API_URL` points to Heroku
- No secrets in frontend environment!

### 5.2 Database Security

#### Neon
1. Enable SSL connections (automatic with Neon)
2. Create separate database role for app:
   ```sql
   CREATE ROLE keechi_app WITH LOGIN PASSWORD 'strong_password';
   GRANT CONNECT ON DATABASE neondb TO keechi_app;
   GRANT USAGE ON SCHEMA public TO keechi_app;
   GRANT ALL ON ALL TABLES IN SCHEMA public TO keechi_app;
   ```

3. Test connection:
   ```bash
   psql postgresql://keechi_app:password@ep-xxxx.neon.tech/neondb
   ```

### 5.3 Enable HTTPS

- ✅ Vercel: Automatic HTTPS with free certificate
- ✅ Heroku: Automatic HTTPS (subdomain)
- ✅ Neon: Automatic SSL (required)

### 5.4 Configure CORS Headers

Heroku backend should only accept requests from:
- Vercel frontend URL
- Localhost (for development)

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://keechi-frontend.vercel.app',
    process.env.FRONTEND_URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

✅ **Status:** Security configured

---

## 📊 STEP 6: DEPLOYMENT ANALYSIS & MONITORING

### 6.1 Performance Metrics

#### Frontend (Vercel)
- **Build Time:** 1-3 minutes
- **Time to First Byte (TTFB):** < 500ms (with CDN)
- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s

**Check Vercel Analytics:**
1. Vercel Dashboard → Project Settings
2. View real-time metrics
3. Monitor Core Web Vitals

#### Backend (Heroku)
- **Response Time:** < 200ms (typical)
- **Uptime:** 99.9% (free tier may have limited uptime)
- **Database Query Time:** < 100ms (depends on query complexity)

**Monitor Heroku:**
```bash
# View real-time logs
heroku logs --tail

# View metrics
heroku metrics
```

#### Database (Neon)
- **Connection Pool Limit:** Depends on plan
- **Storage:** Free tier has limit
- **Query Performance:** Monitor slow queries

**Monitor Neon:**
1. Neon Console → Monitoring
2. View connection count, storage usage
3. Check query performance

### 6.2 Deployment Checklist

| Component | Platform | Status | Notes |
|-----------|----------|--------|-------|
| Database | Neon | ✅ Ready | Pooled connection configured |
| Backend API | Heroku | ✅ Deployed | Running Node.js dyno |
| Frontend | Vercel | ✅ Deployed | Global CDN enabled |
| Environment Vars | All | ✅ Set | All required variables configured |
| CORS | Backend | ✅ Configured | Frontend URL allowed |
| HTTPS | All | ✅ Enabled | All endpoints secure |
| Database Migrations | Heroku | ✅ Automated | Run on deployment |
| Error Tracking | Sentry (optional) | ⏳ Pending | Recommend for production |
| Monitoring | Built-in | ✅ Enabled | Dashboard available |

### 6.3 Cost Analysis

#### Free Tier Costs

| Service | Free Tier | Limits | Monthly Cost |
|---------|-----------|--------|--------------|
| **Vercel** | ✅ Yes | Generous | $0 |
| **Heroku** | ⚠️ Limited | 550 dyno hours/month | $0 (limited) / $7+ (with add-ons) |
| **Neon** | ✅ Yes | 10GB storage, 1M compute | $0 |
| **Total** | Mixed | Basic features | ~$0-20/month |

#### Production Tier Costs (Estimated)

| Service | Plan | Cost | Notes |
|---------|------|------|-------|
| **Vercel** | Pro | $20/month | Higher limits, better performance |
| **Heroku** | Standard-1x | $25/month | 24/7 uptime, better performance |
| **Neon** | Pay-as-you-go | $50-100/month | Depends on usage |
| **Total** | Production | ~$95-145/month | For 10k+ daily users |

### 6.4 Scaling Strategy

#### Phase 1: MVP (Current)
- ✅ Vercel free (global CDN)
- ✅ Heroku free/hobby tier
- ✅ Neon free tier
- **Capacity:** 100-500 daily users

#### Phase 2: Growth
- Vercel Pro ($20/month)
- Heroku Standard ($25/month)
- Neon standard plan ($50/month)
- **Capacity:** 5k-50k daily users

#### Phase 3: Enterprise
- Vercel Enterprise (custom pricing)
- Heroku Private Spaces (custom)
- Neon Enterprise (custom)
- AWS/GCP for additional services
- **Capacity:** 100k+ daily users

---

## 📈 STEP 7: MONITORING & LOGGING

### 7.1 Backend Logs (Heroku)

```bash
# Real-time logs
heroku logs --tail

# Logs from specific time
heroku logs --since 10m --tail

# Specific dyno logs
heroku logs --dyno web

# Export logs
heroku logs > deployment.log
```

### 7.2 Database Monitoring (Neon)

1. Neon Console → Monitoring
2. Track:
   - Active connections
   - Connection pool saturation
   - Query durations
   - Storage usage

### 7.3 Frontend Analytics (Vercel)

1. Vercel Dashboard → Project → Analytics
2. Monitor:
   - Page views
   - Deployment status
   - Error rates
   - Core Web Vitals

### 7.4 Error Tracking (Optional)

**Add Sentry for error tracking:**

```bash
# Backend
npm install @sentry/node

# Frontend
npm install @sentry/nextjs
```

---

## 🔄 STEP 8: CONTINUOUS DEPLOYMENT

### 8.1 Automatic Frontend Deployments

Vercel automatically deploys when you push to GitHub:

```bash
# Push to main branch
git push origin main

# Vercel automatically:
# 1. Clones the repo
# 2. Installs dependencies
# 3. Builds the project
# 4. Deploys to global CDN
# 5. Creates preview URL for pull requests
```

### 8.2 Manual Backend Deployments

```bash
# Deploy backend to Heroku
git push heroku main

# Or specific branch:
git push heroku your-branch:main
```

### 8.3 GitHub Actions Workflow (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy backend to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: keechi-api-production
          heroku_email: your-email@gmail.com
          appdir: keechi-backend
```

---

## 🚨 STEP 9: TROUBLESHOOTING

### Frontend Issues

| Issue | Solution |
|-------|----------|
| **Blank page** | Check browser console for errors, verify API_URL in env vars |
| **API calls fail** | Check CORS headers, verify Heroku backend is running |
| **Slow performance** | Check Vercel analytics, verify no large images, enable caching |
| **Build fails** | Check build logs in Vercel, verify all dependencies are installed |

### Backend Issues

| Issue | Solution |
|-------|----------|
| **500 errors** | Check Heroku logs: `heroku logs --tail`, verify DATABASE_URL |
| **Database connection fails** | Test Neon connection locally, verify SSL mode |
| **Timeouts** | Increase dyno size, check query performance, optimize DB indexes |
| **Memory issues** | Increase dyno size ($25/month for Standard-1x), profile code |

### Database Issues

| Issue | Solution |
|-------|----------|
| **Connection pool exhausted** | Increase pool size in Neon, check for connection leaks |
| **Slow queries** | Enable query logging, analyze query plans, add indexes |
| **Storage full** | Clean up old data, migrate to larger plan |
| **SSL errors** | Verify SSL mode is set, use pooled connection string |

---

## ✅ DEPLOYMENT VERIFICATION

### Checklist

- [ ] Neon database accessible with valid credentials
- [ ] Heroku backend runs `node src/index.js` successfully
- [ ] Vercel frontend builds without errors
- [ ] Environment variables set on all platforms
- [ ] API calls from frontend reach backend successfully
- [ ] Database migrations executed automatically on deploy
- [ ] CORS headers configured correctly
- [ ] HTTPS enabled on all endpoints
- [ ] Error logs accessible and monitored
- [ ] Performance metrics within acceptable ranges

### Test Deployment

```bash
# 1. Check frontend loads
curl https://keechi-xxxx.vercel.app

# 2. Check backend responds
curl https://keechi-api-production.herokuapp.com/health

# 3. Test API endpoint
curl https://keechi-api-production.herokuapp.com/api/salons

# 4. Check frontend → backend communication
# Open browser, go to frontend URL, open DevTools Network tab
# Try to load salons - should see successful API calls
```

---

## 📝 DEPLOYMENT CONFIGURATION SUMMARY

### Frontend (Vercel)

```
Project: keechi-frontend
Framework: Next.js 14
Build Command: npm run build
Environment Variables:
  - NEXT_PUBLIC_API_URL=https://keechi-api-production.herokuapp.com/api
Auto-Deploy: Enabled on main branch push
Domain: https://keechi-xxxx.vercel.app
```

### Backend (Heroku)

```
App: keechi-api-production
Runtime: Node.js 18.x
Start Command: node src/index.js
Procfile Release: npx prisma migrate deploy
Environment Variables:
  - DATABASE_URL (from Neon)
  - NODE_ENV=production
  - JWT_SECRET
  - ADMIN_PASSWORD
  - FRONTEND_URL
Auto-Deploy: Manual (git push heroku main)
Domain: https://keechi-api-production.herokuapp.com
```

### Database (Neon)

```
Service: Neon PostgreSQL
Type: Serverless
Region: Asia (closest to Dhaka)
Connection: Pooled (PgBouncer)
Compute: Auto-scaling
Storage: Auto-scaling
Backups: Automatic
Restore: PITR (Point-in-time recovery)
```

---

## 🎯 NEXT STEPS

1. **Post-Deployment Monitoring**
   - Set up alerts for errors
   - Monitor response times
   - Track database performance

2. **User Testing**
   - Test all user flows (booking, reviews, admin)
   - Verify email notifications (if implemented)
   - Test on different devices/browsers

3. **Performance Optimization**
   - Enable image optimization (Next.js Image component)
   - Implement database query caching
   - Use Redis for session caching (optional)

4. **Security Hardening**
   - Enable rate limiting on API endpoints
   - Add request validation (Zod/Joi)
   - Implement API key authentication for admin endpoints

5. **Backup Strategy**
   - Configure automated Neon backups
   - Test restore procedures
   - Document disaster recovery plan

---

## 📞 SUPPORT & RESOURCES

- **Vercel Docs:** https://vercel.com/docs
- **Heroku Docs:** https://devcenter.heroku.com
- **Neon Docs:** https://neon.tech/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Express Docs:** https://expressjs.com
- **Prisma Docs:** https://www.prisma.io/docs

---

**🎉 Congratulations! Your Keechi platform is now live in production!**

**Frontend URL:** https://keechi-xxxx.vercel.app  
**Backend URL:** https://keechi-api-production.herokuapp.com  
**Database:** Neon PostgreSQL (fully managed)

---

*Last Updated: October 23, 2025*  
*Status: Production Deployment Complete* ✅
