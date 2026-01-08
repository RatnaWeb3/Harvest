# Harvest - Movement Hackathon Submission

> **One Dashboard. All Rewards. Zero Hassle.**

Harvest is the ultimate rewards aggregator and yield dashboard for the Movement ecosystem, solving the fragmented DeFi experience by unifying portfolio tracking, reward claiming, and airdrop management into a single, gasless interface.

---

## The Problem

### DeFi Fragmentation is Killing User Experience

The Movement ecosystem is rapidly expanding with 10+ protocols launching across DEXs, lending markets, liquid staking, and yield optimizers. This growth creates a critical user experience problem:

**1. Scattered Rewards**
- Users must visit each protocol individually to check pending rewards
- No unified view of total claimable value across protocols
- Easy to forget about small rewards that accumulate over time

**2. Claim Fatigue**
- Each claim requires a separate transaction
- Users pay gas fees for every single claim
- Time-consuming process discourages regular harvesting

**3. Missed Airdrops**
- No centralized place to track upcoming airdrops
- Eligibility criteria scattered across Discord/Twitter
- Users miss claim windows and lose tokens

**4. No Portfolio Visibility**
- Total portfolio value requires manual calculation
- Performance tracking across protocols is impossible
- No way to compare yields across different strategies

### Real Impact

- **$2.3M+** in unclaimed rewards across DeFi protocols (industry estimate)
- **73%** of users forget to claim rewards from at least one protocol
- **Average user** interacts with 4.2 protocols but only actively monitors 1.8

---

## Our Solution: Harvest

Harvest is the **all-in-one rewards command center** for Movement DeFi users.

### Core Features

#### 1. Unified Dashboard
- **Single view** of all positions across Movement protocols
- **Real-time** portfolio value with 24h change tracking
- **APY comparison** across different yield strategies
- **Protocol breakdown** by category (LP, Lending, Staking, Vaults)

#### 2. One-Click Batch Claiming
- **Claim all rewards** from multiple protocols in one flow
- **Gasless transactions** via Shinami Gas Station sponsorship
- **Smart batching** to minimize transaction costs
- **Progress tracking** with real-time status updates

#### 3. Airdrop Command Center
- **Discover** upcoming airdrops in the Movement ecosystem
- **Check eligibility** instantly with connected wallet
- **Never miss** claim windows with notification reminders
- **Track status** (upcoming, claimable, claimed, missed)

#### 4. Farmer Leaderboard
- **Compete** with other Movement farmers
- **Track rankings** (weekly, monthly, all-time)
- **Share achievements** on social media
- **Gamification** to encourage active participation

#### 5. Claim History & Analytics
- **Complete history** of all reward claims
- **Filter and search** by protocol, date, amount
- **Export to CSV** for tax reporting
- **Performance analytics** over time

---

## Technical Architecture

### Frontend Stack
| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI library with latest features |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Accessible component library |
| **Recharts** | Data visualization |
| **React Query** | Server state management |
| **Zustand** | Client state management |

### Wallet Integration
| Technology | Purpose |
|------------|---------|
| **Privy SDK** | Email-based onboarding + wallet linking |
| **Aptos Wallet Adapter** | Native wallet support |
| **Custom Abstraction** | Unified interface for both |

### Smart Contracts (Move)
| Module | Purpose |
|--------|---------|
| `registry.move` | Protocol registry management |
| `batch_claim.move` | Atomic batch claiming |
| `protocol_adapter.move` | Standard protocol interface |
| `*_adapter.move` | Protocol-specific implementations |

### Backend Infrastructure
| Technology | Purpose |
|------------|---------|
| **Node.js/Bun** | Runtime environment |
| **Hono** | Lightweight web framework |
| **PostgreSQL** | Persistent data storage |
| **Redis** | Caching layer |

### Gasless Infrastructure
| Technology | Purpose |
|------------|---------|
| **Shinami Gas Station** | Transaction sponsorship |
| **Fee Payer Pattern** | Server-side gas payment |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │Dashboard │ │ Rewards  │ │ Airdrops │ │Leaderboard│           │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
└───────┼────────────┼────────────┼────────────┼──────────────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ usePortfolio│  │usePendingRwd│  │ useBatchClm │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│         ▼                ▼                ▼                      │
│  ┌─────────────────────────────────────────────┐                │
│  │         Protocol Service Layer              │                │
│  │  ┌─────┐ ┌─────┐ ┌────────┐ ┌──────────┐   │                │
│  │  │Yuzu │ │Joule│ │Meridian│ │Thunderhd │   │                │
│  │  └──┬──┘ └──┬──┘ └───┬────┘ └────┬─────┘   │                │
│  └─────┼───────┼────────┼───────────┼─────────┘                │
└────────┼───────┼────────┼───────────┼───────────────────────────┘
         │       │        │           │
         ▼       ▼        ▼           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MOVEMENT BLOCKCHAIN                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Harvest Smart Contracts                  │   │
│  │  ┌──────────┐  ┌────────────┐  ┌──────────────────────┐  │   │
│  │  │ Registry │  │ BatchClaim │  │  Protocol Adapters   │  │   │
│  │  └──────────┘  └────────────┘  └──────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌────────┐ ┌─────┐ ┌────────┐ ┌───────────┐ ┌───────┐         │
│  │  Yuzu  │ │Joule│ │Meridian│ │Thunderhead│ │Canopy │         │
│  └────────┘ └─────┘ └────────┘ └───────────┘ └───────┘         │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVICES                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Claims API  │  │ Leaderboard  │  │   Sponsor    │          │
│  │              │  │     API      │  │    (Shinami) │          │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘          │
│         │                 │                                      │
│         ▼                 ▼                                      │
│  ┌─────────────────────────────────┐                            │
│  │          PostgreSQL             │                            │
│  └─────────────────────────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Supported Protocols

### Launch Partners

| Protocol | Type | Integration Status |
|----------|------|-------------------|
| **Yuzu** | CLMM DEX | Integrated |
| **Joule** | Lending Protocol | Integrated |
| **Meridian** | DeFi Hyperapp | Integrated |
| **Thunderhead** | Liquid Staking | Planned |
| **Canopy** | Yield Marketplace | Planned |
| **Echelon** | Lending | Planned |
| **Mosaic** | DEX Aggregator | Planned |

### Integration Model
Each protocol integration follows a standard adapter pattern:
1. **Position Fetching** - Query user's active positions
2. **Reward Calculation** - Compute pending claimable rewards
3. **Claim Execution** - Build and execute claim transactions

---

## Business Model

### Revenue Streams

#### 1. Performance Fee (Primary)
- **0.5% fee** on claimed rewards through Harvest
- Only charged on successful claims
- Competitive vs. manual claiming (gas savings offset fee)

#### 2. Premium Features (Future)
- **Harvest Pro** subscription ($9.99/month)
  - Auto-compounding strategies
  - Advanced analytics
  - Priority gas sponsorship
  - API access

#### 3. Protocol Partnerships (B2B)
- **Featured placement** for new protocols
- **Integration bounties** from protocols wanting exposure
- **White-label solutions** for protocol-specific dashboards

#### 4. Sponsored Transactions
- **Shinami partnership** for gasless claims
- Revenue share on sponsored transaction volume
- Protocols can sponsor claims for their users

### Unit Economics

| Metric | Value |
|--------|-------|
| Avg claim value | $50 |
| Fee per claim | $0.25 (0.5%) |
| Gas savings per claim | $0.10 |
| Net value to user | $49.85 |
| Monthly active users (Y1) | 5,000 |
| Claims per user/month | 8 |
| Monthly revenue (Y1) | $10,000 |

### Growth Projections

| Year | MAU | Monthly Revenue | Annual Revenue |
|------|-----|-----------------|----------------|
| Y1 | 5,000 | $10,000 | $120,000 |
| Y2 | 25,000 | $50,000 | $600,000 |
| Y3 | 100,000 | $200,000 | $2,400,000 |

---

## Go-to-Market Strategy

### Phase 1: Launch (Month 1-2)
- Deploy on Movement mainnet
- Integrate top 3 protocols (Yuzu, Joule, Meridian)
- Launch gasless claiming feature
- Community announcement campaign

### Phase 2: Growth (Month 3-6)
- Add 5+ protocol integrations
- Launch leaderboard with rewards
- Implement airdrop tracking
- Partner with Movement Foundation

### Phase 3: Expansion (Month 6-12)
- Launch Harvest Pro subscription
- Add auto-compounding strategies
- Cross-chain expansion (Aptos, Sui)
- Mobile app development

### Marketing Channels
- **Movement Discord/Twitter** - Community engagement
- **DeFi influencer partnerships** - User acquisition
- **Protocol co-marketing** - Integration announcements
- **Leaderboard competitions** - Gamified engagement

---

## Competitive Advantage

### Why Harvest Wins

| Feature | Harvest | Manual | Other Aggregators |
|---------|---------|--------|-------------------|
| Unified Dashboard | Yes | No | Partial |
| Batch Claiming | Yes | No | Partial |
| Gasless Transactions | Yes | No | No |
| Movement Native | Yes | N/A | No |
| Airdrop Tracking | Yes | No | No |
| Gamification | Yes | No | No |

### Moats

1. **First Mover** - First comprehensive aggregator on Movement
2. **Protocol Relationships** - Direct integrations with ecosystem partners
3. **Gasless UX** - Shinami integration removes friction
4. **Network Effects** - Leaderboard creates community stickiness

---

## Future Roadmap

### Q1 2025
- [ ] Mainnet launch on Movement
- [ ] 5 protocol integrations
- [ ] Gasless claiming via Shinami
- [ ] Basic analytics dashboard

### Q2 2025
- [ ] Auto-compounding strategies
- [ ] Harvest Pro subscription
- [ ] 10+ protocol integrations
- [ ] Mobile-responsive PWA

### Q3 2025
- [ ] Cross-chain expansion (Aptos)
- [ ] Advanced yield strategies
- [ ] API for developers
- [ ] Institutional dashboard

### Q4 2025
- [ ] Native mobile apps (iOS/Android)
- [ ] DeFi portfolio management
- [ ] Tax reporting integration
- [ ] Multi-chain aggregation

### Long-term Vision
- **DeFi Operating System** for Movement ecosystem
- **Intelligent yield routing** via ML optimization
- **Social features** for collaborative farming
- **DAO governance** for protocol decisions

---

## Technical Achievements

### What We Built

1. **Unified Wallet Abstraction**
   - Single interface supporting Privy + native wallets
   - Seamless signing for both authentication methods

2. **Gasless Transaction Flow**
   - Shinami Gas Station integration
   - Server-side sponsorship with client signing
   - Automatic fallback to user gas

3. **Modular Protocol Architecture**
   - Standard adapter interface
   - Easy integration of new protocols
   - Consistent UX across integrations

4. **Move Smart Contracts**
   - Registry for protocol management
   - Batch claiming for atomic operations
   - Extensible adapter pattern

---

## Conclusion

Harvest transforms the fragmented Movement DeFi experience into a unified, gasless, and gamified rewards platform. By solving real user pain points with innovative technology, we're positioned to become the essential dashboard for every Movement user.

**One Dashboard. All Rewards. Zero Hassle.**
