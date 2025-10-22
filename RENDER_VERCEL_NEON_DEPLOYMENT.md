# 🚀 RENDER + NEON + VERCEL DEPLOYMENT GUIDE

**Complete step-by-step guide for deploying Keechi MVP**

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│              (Siam-bin/keechi-mvp - main branch)        │
└──────────┬────────────────────────┬──────────────────────┘
           │                        │
    ┌──────▼──────┐         ┌──────▼──────┐
    │   Vercel    │         │   Render    │
    │ (Frontend)  │◄───────►│ (Backend)   │
    │ Next.js 14  │ HTTP/s  │ Express API │
    │ Auto-deploy │         │ Auto-deploy │
    │ Free tier   │         │ Free tier   │
    └─────────────┘         └──────┬──────┘
                                   │
                            ┌──────▼──────┐
                            │    Neon     │
                            │ PostgreSQL  │
                            │  Free tier  │
                            │ 10GB storage│
                            └─────────────┘
```

---

## Part 1: Database Setup (Neon) - 5 minutes

### Step 1: Create Neon Account

1. Go to **https://console.neon.tech**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Neon to access your GitHub account
5. Verify your email

### Step 2: Create PostgreSQL Project

1. Click **"New Project"** or **"Create Project"**
2. Enter project name: `keechi-mvp`
3. Select region closest to you (or Asia for Dhaka)
4. Click **"Create project"**

### Step 3: Get Connection String

1. After project creation, you'll see the connection string
2. Look for the **"Database URL"** tab
3. Click the copy button next to the connection string
4. It will look like:
   ```
   postgresql://user:password@ep-xxx.region.neon.tech/keechi_mvp?sslmode=require
   ```

**⚠️ SAVE THIS - You'll need it for Render!**

---

## Part 2: Backend Deployment (Render) - 10 minutes

### Step 1: Create Render Account

1. Go to **https://render.com**
2. Click **"Sign Up"**
3. Choose **"Sign Up with GitHub"**
4. Authorize Render to access your GitHub account

### Step 2: Create Web Service

1. From dashboard, click **"New +"** (top right)
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Search for **"keechi-mvp"** and select it
5. Click **"Connect"**

### Step 3: Configure Web Service

**Fill in the form:**

| Field | Value |
|-------|-------|
| **Name** | `keechi-api` |
| **Environment** | `Node` |
| **Region** | `Singapore` (closest to Dhaka) |
| **Branch** | `main` |
| **Build Command** | `cd keechi-backend && npm install && npx prisma migrate deploy` |
| **Start Command** | `cd keechi-backend && npm start` |

### Step 4: Add Environment Variables

Click **"Advanced"** and add these variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste the Neon connection string from Step 1 |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `JWT_SECRET` | Generate random string: `openssl rand -base64 32` |
| `ADMIN_PASSWORD` | Strong password (or keep default: `admin123`) |
| `FRONTEND_URL` | Will update after Vercel deployment |

**Note:** Click "Add Environment Variable" for each one.

### Step 5: Deploy

1. Scroll down and click **"Create Web Service"**
2. Wait for deployment (usually 2-3 minutes)
3. You'll see a "Building" status, then "Live"
4. Your backend URL will be: `https://keechi-api.onrender.com`

**Copy this URL - you'll need it for Vercel!**

### Step 6: Monitor Logs

1. Click on your service
2. Go to "Logs" tab to see deployment logs
3. Look for message: `Server running on port 5000`
4. If there are errors, check them here

---

## Part 3: Frontend Deployment (Vercel) - 5 minutes

### Step 1: Go to Vercel

1. Visit **https://vercel.com**
2. Sign in with GitHub (if not already signed in)

### Step 2: Import Project

1. Click **"New Project"**
2. Click **"Import Git Repository"**
3. Search for **"keechi-mvp"** 
4. Click **"Import"**

### Step 3: Configure Project

**Framework:** Should auto-detect as "Next.js"

**Root Directory:** Click the dropdown and select:
```
keechi-frontend
```

### Step 4: Set Environment Variables

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://keechi-api.onrender.com/api` |

**⚠️ IMPORTANT:** This must start with `NEXT_PUBLIC_` to be accessible in browser!

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for deployment (usually 1-2 minutes)
3. You'll see a "Building" status, then "Live"
4. Your frontend URL will be: `https://keechi-mvp.vercel.app`

### Step 6: Update Backend CORS

Go back to Render dashboard:

1. Click on your `keechi-api` service
2. Go to "Environment" tab
3. Click "Edit" next to environment variables
4. Update `FRONTEND_URL`: `https://keechi-mvp.vercel.app`
5. Click "Save"
6. Service will auto-redeploy

---

## Part 4: Test Everything - 5 minutes

### Test 1: Frontend Loads

1. Open **https://keechi-mvp.vercel.app** in browser
2. Should see homepage without errors
3. Check browser console (F12) for errors

### Test 2: Salon Listing

1. Navigate to **"Salons"** page
2. Should load salon cards
3. Check for API errors in console

### Test 3: API Health

1. Open **https://keechi-api.onrender.com/health** in browser
2. Should return JSON response
3. If error, check Render logs

### Test 4: Admin Login

1. Go to **https://keechi-mvp.vercel.app/admin**
2. Login with:
   - Email: `admin@keechi.com`
   - Password: Value from `ADMIN_PASSWORD` env var
3. Dashboard should load

### Test 5: Booking Flow

1. Go to Salons page
2. Click on a salon
3. Try to book a service
4. Should complete without errors

---

## Part 5: Monitoring & Logs

### Vercel Monitoring

1. Go to **https://vercel.com/dashboard**
2. Click your project
3. View real-time analytics:
   - Requests per second
   - Error rate
   - Average response time

### Render Monitoring

1. Go to **https://dashboard.render.com**
2. Click your service
3. View logs and metrics:
   - CPU usage
   - Memory usage
   - Response times

### Neon Monitoring

1. Go to **https://console.neon.tech**
2. Click your project
3. View database metrics:
   - Active connections
   - Database size
   - Query performance

---

## Part 6: Post-Deployment Setup

### Update FRONTEND_URL in Render

After Vercel URL is ready:

1. Go to Render dashboard
2. Click `keechi-api` service
3. Go to "Environment"
4. Update `FRONTEND_URL` to your Vercel URL
5. Click "Save" (triggers redeploy)

### Setup Custom Domain (Optional)

**For Vercel Frontend:**
1. Dashboard → Project Settings → Domains
2. Add your custom domain
3. Follow DNS instructions

**For Render Backend:**
1. Dashboard → Service Settings → Custom Domain
2. Add your custom domain
3. Follow DNS instructions

---

## Troubleshooting

### Problem: 502 Bad Gateway on Render

**Cause:** Service failed to start

**Solution:**
1. Check Render logs for errors
2. Verify DATABASE_URL is correct
3. Run migrations manually: `npx prisma migrate deploy`
4. Check if PORT is set correctly

### Problem: API calls fail from frontend

**Cause:** CORS or wrong API URL

**Solution:**
1. Check NEXT_PUBLIC_API_URL in Vercel
2. Verify Render service is running
3. Check Render logs for connection errors
4. Verify database connection string

### Problem: Database connection timeout

**Cause:** Connection pooling issue

**Solution:**
1. Use session pooling in Neon connection string
2. Restart Render service
3. Check Neon console for active connections

### Problem: Too many database connections

**Cause:** Connection pool exhausted

**Solution:**
1. In Neon console, enable connection pooling
2. Set pool size limit in Prisma
3. Restart Render service

---

## Environment Variables Reference

### Backend (Render)

```bash
# Database Connection
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/keechi_mvp?sslmode=require

# Server Config
NODE_ENV=production
PORT=5000

# Security
JWT_SECRET=generate-random-32-character-string
ADMIN_PASSWORD=your-secure-password

# CORS
FRONTEND_URL=https://keechi-mvp.vercel.app
```

### Frontend (Vercel)

```bash
# API Connection (must start with NEXT_PUBLIC_)
NEXT_PUBLIC_API_URL=https://keechi-api.onrender.com/api
```

---

## Cost Analysis

| Service | Tier | Cost |
|---------|------|------|
| **Vercel** | Hobby (free) | $0/month |
| **Render** | Free | $0/month* |
| **Neon** | Free | $0/month |
| **Total** | | **$0/month** |

*Render free tier has limitations: service sleeps after 15 min inactivity. For always-on service, upgrade to Starter ($7/month).

---

## Upgrading Later

When you need better performance:

### Vercel
- $20/month Pro tier (higher function limits, faster builds)
- Enterprise for custom needs

### Render
- $7/month Starter tier (always-on, better performance)
- $25/month Standard tier (more resources)

### Neon
- $0-50+/month depending on usage (pay-as-you-go)
- Free tier: 10GB storage, 1M compute units

---

## Switching to Heroku Later

You can migrate from Render to Heroku at ANY time:

1. Nothing needs to change in code
2. Just update `NEXT_PUBLIC_API_URL` in Vercel
3. Deploy backend to Heroku instead of Render
4. Everything else stays the same

---

## Checklist

### Pre-Deployment
- [ ] GitHub code pushed: https://github.com/Siam-bin/keechi-mvp
- [ ] Neon account created
- [ ] Render account created
- [ ] Vercel account created

### Neon Setup
- [ ] Project created
- [ ] Database created
- [ ] Connection string copied

### Render Setup
- [ ] GitHub repository connected
- [ ] Root directory set to `keechi-backend`
- [ ] Build & start commands configured
- [ ] Environment variables set
- [ ] Deployed successfully
- [ ] Service is "Live"

### Vercel Setup
- [ ] GitHub repository imported
- [ ] Root directory set to `keechi-frontend`
- [ ] NEXT_PUBLIC_API_URL set
- [ ] Deployed successfully
- [ ] Frontend URL obtained

### Post-Deployment
- [ ] Frontend loads without errors
- [ ] Admin login works
- [ ] Salons page loads
- [ ] API health check passes
- [ ] Booking flow works
- [ ] Logs checked for errors
- [ ] FRONTEND_URL updated in Render
- [ ] Both services monitoring enabled

---

## Quick Command Reference

```bash
# View Render logs locally
render logs --tail keechi-api

# Test API locally
curl https://keechi-api.onrender.com/health

# Check frontend build
vercel inspect

# View deployment history
vercel list deployments

# Rollback to previous deployment
vercel rollback
```

---

## Support & Resources

- **Render Docs:** https://render.com/docs
- **Neon Docs:** https://neon.tech/docs
- **Vercel Docs:** https://vercel.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Docs:** https://nextjs.org/docs

---

**🎉 Your MVP is now LIVE on production!**

For monitoring, setup Sentry or LogRocket for error tracking.

*Document Version: 1.0*  
*Last Updated: October 23, 2025*
