# Harvest Deployment Guide

## Overview

Harvest is deployed as a full-stack application with:
- **Frontend**: Next.js on Vercel
- **Backend**: Node.js/Express on Railway or Render
- **Database**: PostgreSQL

**Network**: Movement Testnet

## URLs

| Service | URL |
|---------|-----|
| Frontend | https://harvest.app (or your domain) |
| Backend | https://api.harvest.app |
| Network | Movement Testnet |

## Active Protocols

| Protocol | Address |
|----------|---------|
| **Joule** | `0x7ada55ecf28c22d62f0b05c21ecb20c5767ef743fb0bb2cf486948d0a24413bf` |

## Coming Soon

- Yuzu (CLMM DEX)
- Meridian (Liquid Staking)
- Thunderhead (stMOVE)

---

## Deployment Steps

### 1. Database Setup

#### Option A: Railway PostgreSQL
```bash
npm install -g @railway/cli
railway login
railway link
railway add postgresql
```

#### Option B: Supabase
1. Create project at [supabase.com](https://supabase.com)
2. Get connection string from Settings > Database

#### Run Migrations
```bash
psql $DATABASE_URL < backend/migrations/001_initial.sql
```

### 2. Backend Deployment

#### Option A: Railway
```bash
cd backend
npm run build
railway init
railway up
```

#### Option B: Render
1. Connect GitHub repo to Render
2. Create Web Service pointing to `backend/`
3. Set environment variables (see below)
4. Deploy

#### Option C: Docker
```bash
cd backend
npm run build
docker build -t harvest-backend .
docker run -p 4000:4000 \
  -e DATABASE_URL=postgresql://... \
  -e FRONTEND_URL=https://harvest.app \
  harvest-backend
```

### 3. Frontend Deployment

#### Vercel (Recommended)
```bash
cd frontend
npm i -g vercel
vercel --prod
```

Or connect via Vercel Dashboard:
1. Import repository
2. Set root directory to `frontend`
3. Configure environment variables
4. Deploy

---

## Environment Variables

### Frontend

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_NETWORK` | Network to connect to | `testnet` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.harvest.app` |
| `NEXT_PUBLIC_JOULE_ADDRESS` | Joule contract address | `0x7ada55...` |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy app ID | `your-privy-id` |

### Backend

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://...` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://harvest.app` |
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `production` |

---

## DNS Configuration

If using custom domain:

```
harvest.app      -> Vercel
api.harvest.app  -> Railway/Render backend
```

---

## Verification Checklist

After deployment, verify:

```
[ ] Backend health check passes
    curl https://api.harvest.app/health

[ ] Frontend loads without errors
    curl -I https://harvest.app

[ ] Wallet connects on testnet

[ ] Joule positions load (if user has positions)

[ ] Claim transaction works

[ ] Leaderboard loads from API
    curl https://api.harvest.app/api/leaderboard

[ ] Coming Soon protocols display correctly

[ ] No console errors

[ ] Mobile view works
```

---

## Monitoring

### Vercel Analytics
Automatic for Vercel deployments.

### UptimeRobot
Set up monitors for:
- `https://harvest.app`
- `https://api.harvest.app/health`

---

## Updating

### Frontend
```bash
git push origin main  # Auto-deploys via Vercel
```

### Backend
```bash
cd backend
npm run build
railway up  # Or push to main for auto-deploy
```

### Database Migrations
```bash
psql $DATABASE_URL < migrations/XXX_new_migration.sql
```

---

## Troubleshooting

### Backend won't start
1. Check `DATABASE_URL` is correct
2. Verify migrations ran successfully
3. Check logs: `railway logs` or Render dashboard

### Frontend shows connection errors
1. Verify `NEXT_PUBLIC_API_URL` points to backend
2. Check CORS settings in backend
3. Ensure `FRONTEND_URL` matches actual frontend domain

### Wallet won't connect
1. Verify user is on Movement testnet
2. Check Privy configuration
3. Ensure `NEXT_PUBLIC_NETWORK=testnet`

---

## Notes

- This is **TESTNET** deployment, not mainnet
- Only **Joule** is fully functional
- Other protocols show "Coming Soon" status
- Monitor error rates after launch
- Be ready to hotfix issues

---

## Next Steps After Testnet

1. Gather user feedback
2. Fix any discovered issues
3. Wait for other protocols to deploy their rewards
4. Add protocols as they become available
5. Eventually deploy to mainnet
