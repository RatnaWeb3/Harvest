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

## Git Configuration (DUAL ACCOUNT)

**Primary Account:** RatnaWeb3
```
user.name: RatnaWeb3
user.email: cashoutai1005@gmail.com
```

**Secondary Account:** DarthStormerXII
```
user.name: DarthStormerXII
user.email: darthstormer.ai@gmail.com
```

### Auto-Commit Rule (RANDOM ACCOUNT)
**IMPORTANT:** After EVERY response that modifies code/files, you MUST:
1. Randomly select either RatnaWeb3 or DarthStormerXII for the commit
2. Set the git config for that account
3. Commit and push

```bash
# Example for RatnaWeb3:
cd /Users/gabrielantonyxaviour/Documents/starters/movement/Harvest && \
git config user.name "RatnaWeb3" && \
git config user.email "cashoutai1005@gmail.com" && \
git add -A && \
git commit -m "$(cat <<'EOF'
<concise description of changes>
EOF
)" && \
git push

# Example for DarthStormerXII:
cd /Users/gabrielantonyxaviour/Documents/starters/movement/Harvest && \
git config user.name "DarthStormerXII" && \
git config user.email "darthstormer.ai@gmail.com" && \
git add -A && \
git commit -m "$(cat <<'EOF'
<concise description of changes>
EOF
)" && \
git push
```

Repo: RatnaWeb3/Harvest

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
