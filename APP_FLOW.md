# Harvest - App Flow & Testing Guide

## Quick Start Testing

### Prerequisites
```bash
# Terminal 1: Frontend (port 3004)
cd frontend && npm install && npm run dev

# Terminal 2: Backend (port 4000)
cd backend && npm install && npm run dev
```

### Environment Variables
**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_PRIVY_APP_ID=<privy_app_id>
NEXT_PUBLIC_MOVEMENT_RPC_URL=https://aptos.testnet.porto.movementlabs.xyz/v1
SHINAMI_KEY=<server_side_shinami_key>
```

---

## Testing Checklist

### 1. Wallet Connection
- [ ] Visit `http://localhost:3004`
- [ ] Click "Launch App" or "Connect Wallet"
- [ ] Login via Privy (email) or native Aptos wallet
- [ ] Verify wallet address shows in header
- [ ] Test disconnect button

### 2. Dashboard (`/dashboard`)
- [ ] Portfolio value displays correctly
- [ ] Quick stats show: Total Value, Pending Rewards, Avg APY, Protocol Count
- [ ] Positions table shows LP/Lending/Staking positions
- [ ] Rewards breakdown card lists claimable rewards
- [ ] Charts render properly

### 3. Single Claim Flow
- [ ] Click "Claim" on any pending reward
- [ ] Transaction modal appears with status
- [ ] Wallet prompts for signature
- [ ] Success shows tx hash + explorer link
- [ ] Dashboard refreshes after claim

### 4. Batch Claim Flow
- [ ] Click "Claim All" button
- [ ] Selection modal shows all protocols
- [ ] Select multiple protocols
- [ ] Progress tracker shows each claim
- [ ] Gasless sponsorship attempts first (if configured)
- [ ] Results summary shows success/failed

### 5. Rewards Page (`/rewards`)
- [ ] **Pending Tab**: All rewards grouped by protocol
- [ ] **History Tab**: Past claims with filters
- [ ] **Compound Tab**: Coming soon cards

### 6. Airdrops Page (`/airdrops`)
- [ ] Airdrop grid loads
- [ ] Filter by status works
- [ ] Search by protocol works
- [ ] Click card opens detail modal
- [ ] Eligibility displays correctly

### 7. Leaderboard (`/leaderboard`)
- [ ] Rankings table loads
- [ ] Period selector (Weekly/Monthly/All-Time)
- [ ] User rank card shows if connected
- [ ] Share button works

---

## User Flows

### Flow 1: First-Time User
```
/ (Home) → Connect Wallet → /dashboard → View Portfolio → Claim Rewards
```

### Flow 2: Returning User
```
/ → Auto-redirect to /dashboard → View pending rewards → Batch claim
```

### Flow 3: Airdrop Hunter
```
/airdrops → Filter by "Claiming" → Check eligibility → Claim airdrop
```

### Flow 4: Competitive Farmer
```
/leaderboard → Check rank → /rewards → Claim all → Improve rank
```

---

## Page Structure

| Route | Purpose |
|-------|---------|
| `/` | Landing page, redirects to dashboard if connected |
| `/dashboard` | Main portfolio overview + quick claims |
| `/rewards` | Detailed rewards management + history |
| `/airdrops` | Airdrop discovery + eligibility |
| `/leaderboard` | Top farmers ranking |

---

## Data Flow

```
User → Privy/Wallet → Frontend Hooks
                         ├→ usePortfolio → Protocol Services → RPC
                         ├→ usePendingRewards → Protocol Services → RPC
                         ├→ useLeaderboard → Backend API → PostgreSQL
                         └→ useClaimHistory → Backend API → PostgreSQL

Claim Transaction:
  Build Payload → Sign (Privy/Native) → Sponsor (Shinami) → Movement Chain
```

---

## Key Components

**Layout**: `header.tsx`, `sidebar.tsx`

**Dashboard**: `quick-stats.tsx`, `portfolio-summary.tsx`, `positions-table.tsx`, `rewards-breakdown.tsx`

**Rewards**: `claim-button.tsx`, `claim-all-modal.tsx`, `batch-progress.tsx`, `tx-status-modal.tsx`

**Shared**: `wallet-button.tsx`, `token-display.tsx`, `protocol-badge.tsx`, `loading-skeleton.tsx`

---

## Smart Contracts

Located in `/contracts/sources/harvest/`:

| Module | Purpose |
|--------|---------|
| `registry.move` | Protocol registry management |
| `batch_claim.move` | Batch claiming entry point |
| `protocol_adapter.move` | Standard protocol interface |
| `adapters/*.move` | Protocol-specific adapters |

---

## API Endpoints

```
GET  /api/claims/:address    - User claim history
POST /api/claims             - Record new claim
GET  /api/leaderboard        - Global rankings
GET  /api/leaderboard/:addr  - User rank
POST /api/sponsor            - Gasless sponsorship (Next.js)
GET  /health                 - Health check
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Wallet won't connect | Check Privy app ID in env |
| No positions showing | Check RPC URL, verify wallet has positions |
| Claims failing | Check contract addresses, ensure sufficient gas |
| Gasless not working | Verify SHINAMI_KEY on server |
| Backend errors | Check DATABASE_URL, run migrations |
