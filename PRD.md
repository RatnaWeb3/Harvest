# PRD: Harvest — $MOVE Rewards Aggregator & Yield Dashboard

## Track: The People's Choice

---

## Executive Summary

Harvest is an all-in-one dashboard for tracking, claiming, and auto-compounding rewards across the Movement ecosystem. It aggregates airdrops, LP rewards, staking yields, and protocol incentives into a single interface with one-click harvesting.

---

## Problem Statement

Movement ecosystem users face:

1. **Fragmented rewards** — Rewards scattered across 10+ protocols
2. **Manual claiming** — Must visit each protocol individually
3. **Missed airdrops** — Hard to track eligibility across programs
4. **No compounding** — Rewards sit idle, not earning yield
5. **Poor visibility** — No unified view of total earnings

**Community Pain:** The Movement Discord is full of "where do I claim?" questions.

---

## Solution Overview

### Core Features

1. **Dashboard** — See all rewards in one place
2. **Claim All** — Harvest from multiple protocols in one tx
3. **Auto-Compound** — Reinvest rewards automatically
4. **Airdrop Tracker** — Check eligibility for upcoming drops
5. **Leaderboard** — Compete for top farmer status

### Why People's Choice?

- **Direct community value** — Everyone wants to maximize rewards
- **High engagement** — Daily active usage (checking yields)
- **Viral potential** — Share earnings, referral bonuses
- **Clear revenue** — Premium features, referral fees

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       Harvest Dashboard                              │
│                  (Next.js + React + Privy Wallet)                       │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Portfolio │  │   Rewards   │  │   Airdrops  │  │  Leaderboard│   │
│  │   Overview  │  │   Manager   │  │   Tracker   │  │             │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Harvest API                                   │
│                      (Node.js Backend)                                  │
│                                                                          │
│  - Protocol integrations                                                │
│  - Reward calculations                                                   │
│  - Airdrop eligibility checks                                           │
│  - Leaderboard aggregation                                              │
│  - Auto-compound scheduler                                              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Movement Chain  │    │  Protocol APIs   │    │  GraphQL Indexer │
│  (Direct RPC)    │    │                  │    │                  │
└──────────────────┘    │  ┌────────────┐  │    └──────────────────┘
                        │  │  Meridian  │  │
                        │  └────────────┘  │
                        │  ┌────────────┐  │
                        │  │   Yuzu     │  │
                        │  └────────────┘  │
                        │  ┌────────────┐  │
                        │  │   Joule    │  │
                        │  └────────────┘  │
                        │  ┌────────────┐  │
                        │  │  Canopy    │  │
                        │  └────────────┘  │
                        │  ┌────────────┐  │
                        │  │   More...  │  │
                        │  └────────────┘  │
                        └──────────────────┘
```

### Protocol Integrations (Move Alliance Projects)

| Protocol | Type | Rewards |
|----------|------|---------|
| **Meridian** | DeFi Hyperapp | LP fees, MOVE incentives |
| **Yuzu** | CLMM DEX | Trading fees, LP rewards |
| **Joule** | Lending | Interest, MOVE rewards |
| **Canopy** | Yield Marketplace | Optimized yields |
| **Echelon** | Money Market | Lending interest |
| **LayerBank** | Lending | Interest, points |
| **Mosaic** | DEX Aggregator | Referral rewards |
| **Moveposition** | Lending | Yield |
| **Thunderhead** | Liquid Staking | Staking rewards |
| **Matrix.fun** | Engagement | Quest rewards |

### Data Models

```typescript
interface UserPortfolio {
  address: string;

  // Positions
  positions: Position[];

  // Claimable rewards
  pendingRewards: {
    protocol: string;
    token: string;
    amount: string;
    usdValue: number;
    claimable: boolean;
  }[];

  // Historical
  totalClaimed: number;      // USD
  totalEarned: number;       // USD

  // Airdrops
  eligibleAirdrops: Airdrop[];
}

interface Position {
  protocol: string;
  type: "lp" | "lending" | "staking" | "vault";
  asset: string;
  balance: string;
  usdValue: number;
  apy: number;
  pendingRewards: string;
}

interface Airdrop {
  name: string;
  protocol: string;
  status: "upcoming" | "live" | "claimable" | "ended";
  eligible: boolean;
  allocation?: string;
  claimDeadline?: Date;
  requirements: string[];
  checkEligibility: () => Promise<boolean>;
}
```

### Smart Contract: Batch Claimer

```move
module Harvest::batch_claim {
    use std::vector;
    use aptos_framework::coin;

    struct ClaimRequest has drop {
        protocol: address,
        function_name: vector<u8>,
        type_args: vector<TypeInfo>,
        args: vector<vector<u8>>
    }

    /// Claim rewards from multiple protocols in one transaction
    public entry fun batch_claim(
        user: &signer,
        requests: vector<ClaimRequest>
    ) {
        let i = 0;
        let len = vector::length(&requests);

        while (i < len) {
            let request = vector::borrow(&requests, i);

            // Dynamic dispatch to each protocol's claim function
            // This is simplified - actual impl needs entry function calls
            execute_claim(user, request);

            i = i + 1;
        };
    }

    /// Auto-compound: claim and restake in one tx
    public entry fun claim_and_compound(
        user: &signer,
        claim_requests: vector<ClaimRequest>,
        compound_target: CompoundTarget
    ) {
        // 1. Batch claim all rewards
        batch_claim(user, claim_requests);

        // 2. Swap to target token if needed
        // 3. Deposit into compound target
        execute_compound(user, compound_target);
    }

    struct CompoundTarget has drop {
        protocol: address,
        pool_id: u64,
        // Swap path if rewards != deposit token
        swap_path: vector<address>
    }
}
```

---

## Feature Specifications

### MVP (Hackathon Scope)

| Feature | Priority | Effort |
|---------|----------|--------|
| Portfolio dashboard | P0 | Medium |
| 3 protocol integrations | P0 | High |
| Pending rewards display | P0 | Medium |
| Single-protocol claim | P0 | Low |
| Privy wallet connection | P0 | Low |
| Basic airdrop tracker | P0 | Medium |

### Post-MVP Features

| Feature | Priority | Effort |
|---------|----------|--------|
| Batch claim (multi-protocol) | P1 | High |
| Auto-compound vaults | P1 | High |
| All Movement protocols | P1 | Medium |
| Leaderboard | P1 | Medium |
| Notifications (Telegram/Discord) | P2 | Medium |
| Tax reporting export | P2 | Medium |
| Mobile app | P2 | High |

---

## User Interface Design

### Dashboard Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🌾 Harvest                          [0x1234...abcd] [Disconnect]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─ Portfolio Summary ─────────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │  Total Value          Pending Rewards        24h Earnings           │ │
│  │  $12,450.32          $234.56 🔥             +$45.23 (+0.36%)        │ │
│  │                       ↳ Claim All                                   │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─ Active Positions ───────────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │  Protocol       Position           Value        APY     Rewards    │ │
│  │  ─────────────────────────────────────────────────────────────────  │ │
│  │  🔵 Yuzu       MOVE/USDC LP      $5,230.00    42.3%    $89.50     │ │
│  │                                                        [Claim]     │ │
│  │  ─────────────────────────────────────────────────────────────────  │ │
│  │  🟢 Joule      USDC Lending      $4,100.00    12.5%    $42.00     │ │
│  │                                                        [Claim]     │ │
│  │  ─────────────────────────────────────────────────────────────────  │ │
│  │  🟣 Meridian   MOVE Staking      $2,500.00    25.0%    $78.20     │ │
│  │                                                        [Claim]     │ │
│  │  ─────────────────────────────────────────────────────────────────  │ │
│  │  ⚪ Thunderhead stMOVE           $620.32      18.2%    $24.86     │ │
│  │                                                        [Auto]      │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌─ Pending Airdrops ───────────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │  🎁 Cornucopia Rush        ELIGIBLE ✅     Est: 5,000 MOVE         │ │
│  │     Ends in 14 days                        [Check Details]          │ │
│  │                                                                      │ │
│  │  🎁 Matrix.fun Quest       IN PROGRESS     Points: 2,340           │ │
│  │     Complete 3 more tasks                  [View Tasks]             │ │
│  │                                                                      │ │
│  │  🎁 New Protocol TBA       UPCOMING        Requirements unknown     │ │
│  │     Snapshot: Jan 15                       [Set Reminder]           │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Claim All Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Claim All Rewards                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  You have rewards in 4 protocols:                                       │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │  ☑️  Yuzu           89.50 MOVE      ($134.25)                      │ │
│  │  ☑️  Joule          42.00 USDC      ($42.00)                       │ │
│  │  ☑️  Meridian       78.20 MOVE      ($117.30)                      │ │
│  │  ☑️  Thunderhead    24.86 stMOVE    ($37.29)                       │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Total: $330.84                                                         │
│  Estimated gas: ~$0.15                                                  │
│                                                                          │
│  ┌─ After Claim ─────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  │  ○ Send to wallet                                                 │ │
│  │  ● Auto-compound into Yuzu MOVE/USDC (42.3% APY)                 │ │
│  │  ○ Auto-compound into Joule USDC (12.5% APY)                     │ │
│  │  ○ Custom (swap & deposit)                                        │ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  [      Cancel      ]              [   🌾 Harvest All   ]              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Leaderboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      🏆 Top Farmers This Week                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Rank    Farmer              Harvested       Positions    Streak        │
│  ─────────────────────────────────────────────────────────────────────  │
│  🥇 1    0xwhale...          $45,230         12           42 days       │
│  🥈 2    0xdegen...          $32,100         8            28 days       │
│  🥉 3    0xfarmer...         $28,500         15           35 days       │
│     4    0xyield...          $21,200         6            14 days       │
│     5    0xmove...           $18,900         9            21 days       │
│  ─────────────────────────────────────────────────────────────────────  │
│  📍 156  You (0x1234...)     $330            4            7 days        │
│                                                                          │
│  [Daily] [Weekly] [Monthly] [All-Time]                                  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Revenue Model

### Freemium Features

| Feature | Free | Pro ($9.99/mo) |
|---------|------|----------------|
| Dashboard | ✅ | ✅ |
| Manual claim | ✅ | ✅ |
| 3 protocols | ✅ | ✅ |
| All protocols | ❌ | ✅ |
| Batch claim | ❌ | ✅ |
| Auto-compound | ❌ | ✅ |
| Notifications | ❌ | ✅ |
| Tax export | ❌ | ✅ |
| API access | ❌ | ✅ |

### Referral Program
- 10% of referred user's subscription (forever)
- Paid in MOVE tokens

### Protocol Partnerships
- Featured placement for protocols
- Integration fees from new protocols
- Shared revenue on compound deposits

### Revenue Projections

| Milestone | Users | Pro Users | MRR |
|-----------|-------|-----------|-----|
| Month 1 | 1,000 | 50 | $500 |
| Month 3 | 5,000 | 400 | $4,000 |
| Month 6 | 20,000 | 2,000 | $20,000 |

---

## Technical Requirements

### Frontend Stack
- **Framework:** Next.js 16 with App Router
- **Wallet:** Privy SDK
- **State:** React Query + Zustand
- **Charts:** Recharts
- **Styling:** Tailwind CSS + shadcn/ui

### Backend Stack
- **Runtime:** Node.js / Bun
- **Framework:** Express or Hono
- **Database:** PostgreSQL (user settings, cache)
- **Cache:** Redis (position data, prices)
- **Jobs:** BullMQ (auto-compound scheduler)

### Blockchain Integration
- Movement TypeScript SDK
- GraphQL indexer for event history
- Direct RPC for real-time balances

---

## Success Metrics

### Hackathon Demo

| Metric | Target |
|--------|--------|
| Dashboard loads positions | ✅ |
| Shows pending rewards | ✅ |
| Claim works (1 protocol) | ✅ |
| Airdrop tracker | ✅ |
| Clean UI | ✅ |

### Post-Launch

| Metric | Week 1 | Month 1 | Month 3 |
|--------|--------|---------|---------|
| Connected wallets | 500 | 3,000 | 15,000 |
| DAU | 100 | 500 | 2,500 |
| Total claimed | $10K | $100K | $1M |
| Pro subscribers | 10 | 200 | 1,500 |

---

## Go-To-Market

### Phase 1: Movement Community (Week 1-2)
- Movement Discord announcement
- Twitter thread with demo
- Partner with Move Alliance projects

### Phase 2: Airdrop Hunters (Week 2-4)
- Crypto Twitter campaign
- YouTube tutorials
- Airdrop tracking communities

### Phase 3: DeFi Users (Month 2+)
- DefiLlama integration
- DeFi newsletters
- Comparison content vs other aggregators

---

## Development Timeline

### Week 1: Core Dashboard
- [ ] Privy integration
- [ ] Portfolio fetching (Yuzu, Joule, Meridian)
- [ ] Rewards calculation
- [ ] Basic UI

### Week 2: Claims & Airdrops
- [ ] Single-protocol claims
- [ ] Airdrop tracker UI
- [ ] Cornucopia integration
- [ ] Movement ecosystem programs

### Week 3: Polish
- [ ] Leaderboard
- [ ] Historical earnings chart
- [ ] Mobile responsive
- [ ] Documentation

### Week 4: Demo
- [ ] Demo video
- [ ] Bug fixes
- [ ] Submission

---

## Why This Wins People's Choice

1. **Direct value** — Everyone in Movement wants to maximize yields
2. **Daily usage** — Checking rewards is addictive
3. **Community asks for this** — Constant Discord questions
4. **Viral** — Leaderboard + referrals drive sharing
5. **Clear upgrade path** — Free → Pro is obvious value

---

## Appendix

### Protocol API Research

| Protocol | API Status | Claim Function |
|----------|------------|----------------|
| Yuzu | GraphQL available | `claim_rewards` |
| Joule | RPC queries | `claim_interest` |
| Meridian | SDK available | `harvest` |
| Thunderhead | Direct RPC | `claim_staking_rewards` |
| Canopy | TBD | TBD |

### Team Requirements
- 1 Full-stack developer (dashboard)
- 1 Move developer (batch claimer contract)
- 1 Designer (UI/UX)
