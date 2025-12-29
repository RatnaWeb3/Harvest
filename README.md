# Harvest - $MOVE Rewards Aggregator

Harvest is an all-in-one dashboard for tracking, claiming, and auto-compounding rewards across the Movement ecosystem. Built on Movement chain using Move smart contracts.

## Features

- **Portfolio Dashboard** - View all your DeFi positions across Movement protocols
- **Batch Claiming** - Claim rewards from multiple protocols in a single transaction
- **Airdrop Tracker** - Track upcoming airdrops and check eligibility
- **Leaderboard** - See top farmers in the Movement ecosystem
- **Auto-Compound** - Automatically reinvest rewards (coming soon)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Wallet | Privy SDK, Aptos Wallet Adapter |
| State | React Query, Zustand |
| Contracts | Move (Movement/Aptos-compatible) |

## Quick Start

### Prerequisites

- Node.js 20+
- Movement CLI (`aptos` with Movement configuration)

### Frontend Setup

```bash
cd frontend
npm install
cp .env.production.example .env.local
# Edit .env.local with your values
npm run dev
```

### Contract Deployment

```bash
cd contracts

# Compile
aptos move compile --named-addresses harvest=default

# Test
aptos move test --named-addresses harvest=default

# Deploy to testnet
npx ts-node scripts/deploy.ts --network=testnet

# Deploy to mainnet
npx ts-node scripts/deploy.ts --network=mainnet
```

## Environment Variables

Copy `frontend/.env.production.example` to `.env.local` and configure:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy app ID from dashboard |
| `NEXT_PUBLIC_MOVEMENT_RPC_URL` | Movement RPC endpoint |
| `NEXT_PUBLIC_HARVEST_REGISTRY_ADDRESS` | Deployed registry contract |

## Project Structure

```
Harvest/
├── frontend/                  # Next.js application
│   ├── app/                   # Pages and routes
│   │   ├── dashboard/         # Main dashboard
│   │   ├── rewards/           # Rewards management
│   │   ├── airdrops/          # Airdrop tracking
│   │   └── leaderboard/       # Leaderboard
│   ├── components/            # React components
│   │   ├── layout/            # Layout components
│   │   ├── shared/            # Reusable components
│   │   └── ui/                # shadcn/ui components
│   └── lib/                   # Utilities and services
│       └── move/              # Move abstraction layer
│
├── contracts/                 # Move smart contracts
│   ├── sources/harvest/       # Contract modules
│   │   ├── registry.move      # Protocol registry
│   │   ├── batch_claim.move   # Batch claiming
│   │   └── adapters/          # Protocol adapters
│   ├── tests/                 # Move unit tests
│   └── scripts/               # Deployment scripts
│
└── prompts/                   # Development prompts
```

## Supported Protocols

| Protocol | Type | Status |
|----------|------|--------|
| Yuzu | CLMM DEX | Planned |
| Joule | Lending | Planned |
| Meridian | DeFi Hyperapp | Planned |
| Thunderhead | Liquid Staking | Planned |
| Canopy | Yield Marketplace | Planned |

## Development

### Running Tests

```bash
# Frontend
cd frontend && npm run lint

# Contracts
cd contracts && aptos move test
```

### Building for Production

```bash
cd frontend
npm run build
```

## Architecture

### Move Abstraction Layer

All protocol interactions use the abstraction layer in `lib/move/`:

```typescript
import { useAptosWallet, useAptosClient } from '@/lib/move'

const { signAndSubmitTransaction } = useAptosWallet()
const client = useAptosClient()
```

### Component Structure

Each feature follows a decomposed structure:

```
app/{feature}/
├── page.tsx              # Page orchestration (< 150 lines)
├── components/           # Feature components
├── hooks/                # Business logic hooks
├── types.ts              # Type definitions
└── constants.ts          # Configuration
```

## Deployment

### Vercel (Frontend)

1. Connect repository to Vercel
2. Set environment variables
3. Deploy

### Movement Network (Contracts)

```bash
cd contracts
npx ts-node scripts/deploy.ts --network=mainnet
```

## Security

- All wallet interactions are handled through the Move abstraction layer
- Environment variables for all secrets
- Security headers configured in `next.config.ts`
- No private keys in code

## License

MIT

## Contributing

1. Follow the file size limits (max 300 lines per file)
2. Use the Move abstraction layer for wallet interactions
3. Add loading and error states to all components
4. Ensure mobile responsiveness
