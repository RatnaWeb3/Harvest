# Harvest - $MOVE Rewards Aggregator & Yield Dashboard

Harvest is an all-in-one dashboard for tracking, claiming, and auto-compounding rewards across the Movement ecosystem. Built on Movement chain using Move smart contracts.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Wallet:** Privy SDK
- **State:** React Query + Zustand
- **Charts:** Recharts
- **Contracts:** Move (Movement/Aptos-compatible)
- **Backend:** Node.js/Bun, Express/Hono, PostgreSQL, Redis

---

## Git Configuration (MANDATORY)

**ALWAYS use these credentials for ALL commits and pushes:**

| Setting | Value |
|---------|-------|
| **User Name** | `gabrielantonyxaviour` |
| **User Email** | `gabrielantony56@gmail.com` |

Before making any commits, ALWAYS run:
```bash
git config user.name "gabrielantonyxaviour"
git config user.email "gabrielantony56@gmail.com"
```

**DO NOT use any other git identity for this project.**

---

## Critical Rules

**NEVER mock or create placeholder code.** If blocked, STOP and explain why.

- No scope creep - only implement what's requested
- No assumptions - ask for clarification
- Follow existing patterns in codebase
- Verify work before completing
- Use conventional commits (`feat:`, `fix:`, `refactor:`)

---

## File Size Limits (CRITICAL)

**HARD LIMIT: 300 lines per file maximum. NO EXCEPTIONS.**

Files over 300 lines (~25000 tokens) CANNOT be read by AI tools and block development.

### Limits by File Type

| File Type | Max Lines | Purpose |
|-----------|-----------|---------|
| `page.tsx` | 150 | Orchestration only |
| `*-tab.tsx` | 250 | Tab components |
| `use-*.ts` | 200 | Hooks with business logic |
| `types.ts` | 100 | Type definitions |
| `constants.ts` | 150 | Module addresses, configs |
| `*-service.ts` | 300 | API services |
| `components/shared/*.tsx` | 150 | Reusable UI |
| `*.move` | 300 | Move modules |

### Required Feature Structure

Every feature page MUST be decomposed:

```
app/{feature}/
├── page.tsx              # Orchestration only (< 150 lines)
├── components/
│   ├── dashboard-tab.tsx # Tab components (< 250 lines each)
│   ├── rewards-tab.tsx
│   └── shared/
│       ├── protocol-select.tsx
│       └── token-display.tsx
├── hooks/
│   ├── use-portfolio.ts     # Business logic (< 200 lines)
│   └── use-rewards.ts
├── types.ts              # Type definitions (< 100 lines)
└── constants.ts          # Module addresses (< 150 lines)
```

### When to Decompose

| Trigger | Action |
|---------|--------|
| File > 300 lines | MUST decompose immediately |
| 3+ useState hooks | Extract to custom hook |
| Multiple tabs/sections | Split into separate components |
| Module addresses in component | Move to constants.ts |
| Types inline | Move to types.ts |

**See `code-structure` skill for detailed patterns.**

---

## Documentation Lookup (MANDATORY)

**ALWAYS use Context7 MCP for documentation. NEVER use WebFetch for docs.**

Context7 is the ONLY reliable way to get up-to-date SDK/library documentation. WebFetch fails frequently and returns incomplete/unusable results.

### How to Use Context7

```
1. First resolve the library ID:
   mcp__context7__resolve-library-id({ libraryName: "aptos" })

2. Then fetch the docs:
   mcp__context7__get-library-docs({
     context7CompatibleLibraryID: "/aptos-labs/aptos-ts-sdk",
     topic: "sendTransaction",
     mode: "code"
   })
```

### When to Use Context7

| Scenario | Action |
|----------|--------|
| Need SDK/library docs | **USE CONTEXT7** |
| Checking API usage | **USE CONTEXT7** |
| Finding code examples | **USE CONTEXT7** |
| Learning library patterns | **USE CONTEXT7** |
| Any documentation need | **USE CONTEXT7** |

### Common Libraries in This Project

| Library | Context7 ID |
|---------|-------------|
| Aptos SDK | `/aptos-labs/aptos-ts-sdk` |
| Next.js | `/vercel/next.js` |
| React | `/facebook/react` |
| shadcn/ui | `/shadcn-ui/ui` |
| Privy | `/privy-io/privy-js` |

### DO NOT

- **NEVER use WebFetch for documentation** - It's unreliable and often fails
- **NEVER guess SDK usage** - Always verify with Context7 first
- **NEVER assume API signatures** - Look them up via Context7

---

## Skills (LOAD BEFORE STARTING TASKS)

**IMPORTANT: Always load the appropriate skill BEFORE starting any task.** Skills provide essential context, patterns, and instructions for each domain.

### How to Use Skills

Load a skill by invoking it at the start of your task:
```
skill: "ui-dev"
skill: "move-integration"
skill: "move-contracts"
```

### Required Skills by Task Type

| Task Type | Required Skill | Examples |
|-----------|----------------|----------|
| **Any New Code** | `code-structure` | File size limits, decomposition patterns, component architecture |
| **UI/Frontend** | `ui-dev` | Building components, styling, layouts, animations, responsive design, shadcn/ui |
| **Move Contract Interactions** | `move-integration` | View functions, entry functions, wallet interactions |
| **Move Contract Development** | `move-contracts` | Writing Move modules, testing, deployments, verification |
| **Protocol Integrations** | `protocol-dev` | Integrating Movement ecosystem protocols (Yuzu, Joule, Meridian) |
| **Database Operations** | `supabase-operations` | Supabase tables, migrations, RLS policies, data operations |
| **E2E Testing** | `playwright-testing` | Browser automation, test writing, parallel testing |
| **Strategic Planning** | `strategy` | NO-CODE mode, breaking goals into executable prompts |

### Skill Loading Rules

1. **ALWAYS load a skill** when the task matches any skill description above
2. **Load BEFORE writing any code** - skills contain critical patterns and conventions
3. **Multiple skills** - If a task spans multiple domains, load the primary skill first
4. **Don't skip skills** - Even for "simple" tasks, skills ensure consistency

### Examples

```
User: "Add a button to connect wallet"
→ Load skill: "ui-dev" (for component) AND "move-integration" (for wallet logic)

User: "Write a test for the batch claim module"
→ Load skill: "move-contracts"

User: "Integrate Yuzu protocol for rewards"
→ Load skill: "protocol-dev"

User: "Add a new column to the users table"
→ Load skill: "supabase-operations"
```

---

## Multi-Prompt System

This project uses a multi-session prompt system for complex features.

### How It Works

1. **`/strategy <goal>`** - Enter planning mode, breaks goal into executable prompts
2. **Prompts written to `prompts/`** - As `1.md`, `2.md`, `3.md`, etc.
3. **Run prompts in fresh sessions** - "run prompt 1" or "run prompts 1-3"
4. **Report completion** - "completed prompt 1"
5. **Strategy session generates next batch** - Until goal is complete

### Running Prompts

When asked to run a prompt:

1. **Read** `prompts/N.md` completely
2. **Activate** the skill specified in the prompt (if any)
3. **Execute** ALL requirements in the prompt
4. **Verify** using the verification steps provided
5. **Delete** the prompt file after successful completion
6. **Report** what was accomplished
7. **List** remaining prompts in `prompts/`

---

## Repository Structure

```
Harvest/
├── PRD.md                      # Product Requirements Document
├── claude.md                   # This file
├── .claude/
│   ├── commands/               # Claude slash commands
│   └── skills/                 # Claude skills for different tasks
│
├── frontend/                   # Next.js application
│   ├── app/                    # Pages and API routes
│   │   ├── dashboard/          # Main dashboard
│   │   ├── rewards/            # Rewards management
│   │   ├── airdrops/           # Airdrop tracking
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── Harvest/        # Harvest-specific components
│   │   ├── protocols/          # Protocol-specific components
│   │   ├── move/               # Move wallet components
│   │   └── ui/                 # Shadcn/ui components
│   ├── lib/
│   │   ├── move/               # Move client setup and utilities
│   │   └── services/           # API and blockchain services
│   └── constants/
│       ├── protocols/          # Protocol configs and addresses
│       └── tokens/             # Token metadata
│
├── contracts/                  # Move smart contracts
│   ├── sources/                # Move source files
│   │   └── Harvest/        # Harvest modules
│   ├── tests/                  # Move unit tests
│   ├── scripts/                # Deployment scripts
│   └── Move.toml               # Move package manifest
│
└── prompts/                    # Generated prompts (for multi-session)
```

---

## The Move Abstraction Layer (CRITICAL)

**THIS IS THE KEY ARCHITECTURAL PATTERN.**

All protocol interactions MUST use the Move abstraction layer:

```typescript
// CORRECT - Use abstraction
import { useAptosWallet, useAptosClient, AptosWalletButton } from '@/lib/move'

// WRONG - Direct imports without abstraction
import { useWallet } from '@aptos-labs/wallet-adapter-react'  // NEVER DO THIS IN COMPONENTS
```

### Interface Location

`frontend/lib/move/`:

| File | Purpose |
|------|---------|
| `index.ts` | Stable exports (NEVER changes) |
| `types.ts` | Shared TypeScript types |
| `client.ts` | Aptos client configuration |
| `constants.ts` | Common module addresses |

---

## Adding Protocol Integrations

### Step 1: Create Decomposed Structure

**IMPORTANT: Follow file size limits. No file > 300 lines.**

```
frontend/
├── app/protocols/{protocol}/
│   ├── page.tsx              # < 150 lines - orchestration only
│   ├── components/
│   │   ├── rewards-tab.tsx   # < 250 lines - main tab
│   │   ├── positions-tab.tsx # < 250 lines - positions tab
│   │   └── shared/
│   │       └── position-card.tsx  # < 150 lines
│   ├── hooks/
│   │   ├── use-{protocol}-rewards.ts  # < 200 lines
│   │   └── use-{protocol}-positions.ts
│   ├── types.ts              # < 100 lines
│   └── constants.ts          # < 150 lines
├── lib/services/{protocol}-service.ts  # < 300 lines
└── constants/protocols/{protocol}/index.ts
```

### Step 2: Create Protocol Service

```typescript
// lib/services/{protocol}-service.ts

class ProtocolService {
  async getPositions(address: string) { /* ... */ }
  async getPendingRewards(address: string) { /* ... */ }
  async claimRewards(params: ClaimParams) { /* ... */ }
}

export const protocolService = new ProtocolService()
```

### Step 3: Create Hook

```typescript
// hooks/use-{protocol}-rewards.ts

import { useAptosClient, useAptosWallet } from '@/lib/move'
import { protocolService } from '@/lib/services/{protocol}-service'

export function useProtocolRewards() {
  const { account, signAndSubmitTransaction } = useAptosWallet()
  const client = useAptosClient()

  const claimRewards = async () => {
    if (!account) return
    const tx = await protocolService.claimRewards({ address: account.address })
    await signAndSubmitTransaction(tx)
  }

  return { claimRewards, /* ... */ }
}
```

---

## Move Contract Development

### Project Structure

```
contracts/
├── Move.toml                 # Package manifest
├── sources/
│   └── Harvest/
│       ├── batch_claim.move  # Batch claiming module
│       ├── portfolio.move    # Portfolio tracking
│       └── rewards.move      # Reward calculations
├── tests/
│   └── batch_claim_tests.move
└── scripts/
    └── deploy.ts
```

### Module Naming Convention

| Pattern | Example | Use Case |
|---------|---------|----------|
| `module_name` | `batch_claim` | Module names (snake_case) |
| `FunctionName` | `claim_rewards` | Entry functions (snake_case) |
| `StructName` | `ClaimRequest` | Struct names (PascalCase) |

### Testing Commands

```bash
# Run all tests
cd contracts && aptos move test

# Run specific test
aptos move test --filter batch_claim

# Compile
aptos move compile

# Deploy
aptos move publish --named-addresses Harvest=default
```

---

## Movement Ecosystem Protocols

### Integrated Protocols

| Protocol | Type | Module Address | Status |
|----------|------|----------------|--------|
| **Yuzu** | CLMM DEX | TBD | Planned |
| **Joule** | Lending | TBD | Planned |
| **Meridian** | DeFi Hyperapp | TBD | Planned |
| **Thunderhead** | Liquid Staking | TBD | Planned |
| **Canopy** | Yield Marketplace | TBD | Planned |

### Adding a New Protocol

1. Research protocol's Move module addresses
2. Create service in `lib/services/{protocol}-service.ts`
3. Create hooks in `app/protocols/{protocol}/hooks/`
4. Add UI components following decomposition pattern
5. Update constants in `constants/protocols/`

---

## Common Patterns

### View Function Call

```typescript
import { useAptosClient } from '@/lib/move'

const client = useAptosClient()

const result = await client.view({
  function: `${MODULE_ADDRESS}::module_name::view_function`,
  type_arguments: [],
  arguments: [address],
})
```

### Entry Function Transaction

```typescript
import { useAptosWallet } from '@/lib/move'

const { signAndSubmitTransaction } = useAptosWallet()

const tx = await signAndSubmitTransaction({
  data: {
    function: `${MODULE_ADDRESS}::module_name::entry_function`,
    typeArguments: [],
    functionArguments: [amount],
  },
})
```

### Debounced Data Fetching

```typescript
useEffect(() => {
  const timer = setTimeout(() => fetchData(), 500)
  return () => clearTimeout(timer)
}, [fetchData])
```

---

## Commands Reference

| Command | Description |
|---------|-------------|
| `/strategy <goal>` | Enter planning mode, generate prompts for complex features |
| `/debug` | Strategic debugging across contracts and frontend |
| `/deploy-contracts` | Deploy Move contracts to Movement |
| `/protocol-integrate` | Add a protocol integration to the project |
| `/unused-cleanup` | Find and remove unused dependencies |

---

## Issues & Learnings System

### Before Starting These Tasks, Read Relevant Issues:

| Task Type | Read First |
|-----------|------------|
| UI/Frontend | `../docs/issues/ui/README.md` |
| Move contracts | `../docs/issues/move/README.md` |
| Indexing/GraphQL | `../docs/issues/indexer/README.md` |
| Movement network | `../docs/issues/movement/README.md` |

### When to Document a New Learning

**DOCUMENT if ALL of these are true:**
1. It caused repeated back-and-forth debugging (wasted user's time)
2. It's non-obvious (you wouldn't naturally avoid it)
3. It will happen again in future projects
4. The fix isn't easily searchable in official docs

**DO NOT document:**
- Basic syntax errors or typos
- Standard patterns you already know
- One-off edge cases unlikely to repeat
- Things covered in official documentation

### How to Add a Learning

1. Determine category: `ui/`, `move/`, `indexer/`, or `movement/`
2. Read the existing README.md in that folder
3. Add new issue following the template format (increment ID)
4. Keep it focused: problem → root cause → solution → prevention

---

## DO NOT

- **Create files over 300 lines** - They cannot be read by AI tools
- **Put everything in page.tsx** - Decompose into components, hooks, types, constants
- **Use WebFetch for documentation** - ALWAYS use Context7 MCP instead
- **Skip loading skills** - Always load appropriate skill before starting work
- **Guess SDK/API usage** - Look it up via Context7 first
- Import wallet hooks directly in components (use abstraction)
- Create directories outside established structure
- Put module addresses inline in components
- Skip the abstraction layer
- Start coding without loading the relevant skill first

## DO

- **Keep files under 300 lines** - Decompose early and often
- **Load `code-structure` skill** - For any new component or protocol
- **Use Context7 MCP for ALL documentation** - It's the only reliable method
- **Load skills FIRST** - Before any task, load the matching skill(s)
- **Verify SDK patterns via Context7** - Before implementing any library integration
- Extract business logic to hooks
- Keep page.tsx as pure orchestration
- Put module addresses in constants.ts, types in types.ts
- Handle loading/error states
- Use the Move abstraction layer consistently
