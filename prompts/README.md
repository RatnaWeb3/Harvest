# Harvest Completion Prompts

This directory contains executable prompts to complete the Harvest application from ~35% to 100%.

## Overview

Based on the completion analysis, the app is:
- **~80% complete** for hackathon demo (UI + mock data)
- **~35% complete** for production (needs real data, backend, deployment)

These prompts will bring it to **100% production-ready**.

## Prompt Execution Order

### Phase 1: Foundation (Prompts 1-2)
Research and deploy core infrastructure.

| # | Prompt | Description | Est. Time |
|---|--------|-------------|-----------|
| 1 | Protocol Research | Find real module addresses for all protocols | 2-4 hours |
| 2 | Contract Deployment | Complete and deploy Move contracts | 4-6 hours |

### Phase 2: Real Data (Prompts 3-5)
Replace mock data with real on-chain data.

| # | Prompt | Description | Est. Time |
|---|--------|-------------|-----------|
| 3 | Indexer Setup | Set up GraphQL indexer integration | 2-3 hours |
| 4 | Protocol Data | Implement real data fetching | 4-6 hours |
| 5 | Claim Transactions | Implement end-to-end claiming | 3-4 hours |

### Phase 3: Additional Protocols (Prompts 6-8)
Add remaining protocol integrations.

| # | Prompt | Description | Est. Time |
|---|--------|-------------|-----------|
| 6 | Thunderhead | Liquid staking integration | 2-3 hours |
| 7 | Echelon + LayerBank | Lending integrations | 3-4 hours |
| 8 | Canopy | Yield vault integration | 2-3 hours |

### Phase 4: Features (Prompts 9)
Implement advanced features.

| # | Prompt | Description | Est. Time |
|---|--------|-------------|-----------|
| 9 | Auto-Compound | Implement auto-compound feature | 4-5 hours |

### Phase 5: Backend (Prompts 10-11)
Build and connect backend infrastructure.

| # | Prompt | Description | Est. Time |
|---|--------|-------------|-----------|
| 10 | Backend API | Build Node.js backend | 6-8 hours |
| 11 | Frontend Integration | Connect frontend to backend | 3-4 hours |

### Phase 6: Complete Ecosystem (Prompts 12-14)
Finish all integrations and add notifications.

| # | Prompt | Description | Est. Time |
|---|--------|-------------|-----------|
| 12 | Remaining Protocols | Mosaic, Moveposition, Matrix.fun | 3-4 hours |
| 13 | Airdrop System | Real airdrop tracking | 4-5 hours |
| 14 | Notifications | Telegram + Discord integration | 4-5 hours |

### Phase 7: Ship (Prompts 15-16)
Test and deploy to production.

| # | Prompt | Description | Est. Time |
|---|--------|-------------|-----------|
| 15 | E2E Testing | Comprehensive testing and bug fixes | 4-6 hours |
| 16 | Deployment | Production deployment | 3-4 hours |

## How to Run Prompts

### In a fresh Claude session:

```
run prompt 1
```

Or run multiple:
```
run prompts 1-3
```

### After completing a prompt:

Report back to strategy session:
```
completed prompt 1
```

### If a prompt is blocked:

Document the blocker and skip to next prompt if possible:
```
prompt 1 blocked: Yuzu contracts not deployed yet
```

## Dependencies

```
Prompt 1 ──┬── Prompt 2
           │
           └── Prompt 3 ── Prompt 4 ── Prompt 5
                                        │
                              ┌─────────┴─────────┐
                              │                   │
                         Prompts 6-8          Prompt 9
                              │                   │
                              └─────────┬─────────┘
                                        │
                                   Prompt 10 ── Prompt 11
                                        │
                              ┌─────────┴─────────┐
                              │                   │
                         Prompt 12           Prompts 13-14
                              │                   │
                              └─────────┬─────────┘
                                        │
                                   Prompt 15 ── Prompt 16
```

## Issue Documentation

Before starting each prompt, read relevant issues:
- `docs/issues/ui/README.md` - UI/Frontend issues
- `docs/issues/move/README.md` - Move/Contract issues
- `docs/issues/indexer/README.md` - Indexer issues
- `docs/issues/movement/README.md` - Movement network issues
- `docs/issues/tooling/README.md` - Development tooling issues

Document any new issues discovered during prompt execution.

## Skills to Load

Each prompt specifies which skill to load:
- `move-dev` - For contract and blockchain work
- `ui-dev` - For frontend development
- `code-structure` - For file organization

## Estimated Total Time

- **Minimum (parallel work):** 30-40 hours
- **Realistic (sequential):** 50-60 hours
- **With blockers/debugging:** 70-80 hours

## Success Criteria

After all prompts complete:
- [ ] All 10 protocols integrated with real data
- [ ] Move contracts deployed on mainnet
- [ ] Backend API running with database
- [ ] Claims work end-to-end
- [ ] Auto-compound works
- [ ] Airdrop tracking works
- [ ] Notifications work
- [ ] Production deployed at harvest.app
