# Harvest Production Prompts - Joule Testnet Focus

## Overview

The Harvest app focuses on **Joule (Movement Testnet)** as the only live protocol integration. Other protocols (Yuzu, Meridian, Thunderhead) are displayed as "Coming Soon" in the UI.

**Decision:** Only Joule has confirmed contract addresses on Movement testnet. Other protocol deployments are TBA.

**Current State:**
- Frontend UI complete (Dashboard, Rewards, Airdrops, Leaderboard)
- Protocol services structured
- Joule testnet: `0x7ada55ecf28c22d62f0b05c21ecb20c5767ef743fb0bb2cf486948d0a24413bf`
- Other protocols: Coming Soon (no addresses available)

---

## Reworked Prompt Structure

### Phase 1: Core Integration (SEQUENTIAL)

| # | Prompt | Description |
|---|--------|-------------|
| 1 | Protocol Configuration | Configure Joule as active, mark others as Coming Soon |
| 2 | Joule Data Integration | Real on-chain queries for Joule positions & rewards |
| 3 | Claim Transactions | Wire up Joule claim functionality |
| 4 | Coming Soon UI | Add Coming Soon states for inactive protocols |

### Phase 2: Backend & Polish (PARALLEL after Phase 1)

| # | Prompt | Description |
|---|--------|-------------|
| 5 | Backend API | Build Node.js backend with PostgreSQL |
| 6 | Frontend-Backend Integration | Connect frontend to backend API |

### Phase 3: Ship (FINAL)

| # | Prompt | Description |
|---|--------|-------------|
| 7 | E2E Testing | Test Joule flows, fix bugs |
| 8 | Testnet Deployment | Deploy to Movement testnet |

---

## Execution Order

```
[Prompt 1: Protocol Config]
         |
         v
[Prompt 2: Joule Data]
         |
         v
[Prompt 3: Claim Transactions]
         |
    +----+----+
    |         |
    v         v
[Prompt 4]  [Prompt 5]
Coming Soon  Backend
    |         |
    +----+----+
         |
         v
[Prompt 6: Frontend-Backend]
         |
         v
[Prompt 7: E2E Testing]
         |
         v
[Prompt 8: Deployment]
```

---

## Protocol Status

| Protocol | Status | Address |
|----------|--------|---------|
| **Joule** | Active | `0x7ada55ecf28c22d62f0b05c21ecb20c5767ef743fb0bb2cf486948d0a24413bf` |
| Yuzu | Coming Soon | TBA |
| Meridian | Coming Soon | TBA |
| Thunderhead | Coming Soon | TBA |
| Canopy | Coming Soon | TBA |
| Echelon | Coming Soon | TBA |

---

## How to Run Prompts

### In a fresh Claude session:

```
run prompt 1
```

### After completing a prompt:
```
completed prompt 1
```

---

## Quick Reference

| Prompt | File | Est. Time | Can Parallel With |
|--------|------|-----------|-------------------|
| 1 | `1.md` | 1-2 hrs | None |
| 2 | `2.md` | 2-3 hrs | None |
| 3 | `3.md` | 2-3 hrs | None |
| 4 | `4.md` | 2-3 hrs | 5 |
| 5 | `5.md` | 4-6 hrs | 4 |
| 6 | `6.md` | 2-3 hrs | None |
| 7 | `7.md` | 3-4 hrs | None |
| 8 | `8.md` | 2-3 hrs | None |

**Total: 8 prompts, ~18-27 hours**
