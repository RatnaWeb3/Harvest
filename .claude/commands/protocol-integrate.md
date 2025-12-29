# Protocol Integration

Add a new Movement ecosystem protocol integration.

**Usage:**
- `/protocol-integrate yuzu` - Integrate Yuzu protocol
- `/protocol-integrate joule` - Integrate Joule protocol

**Supported Protocols:**
- `yuzu` - CLMM DEX
- `joule` - Lending
- `meridian` - DeFi Hyperapp
- `thunderhead` - Liquid Staking
- `canopy` - Yield Marketplace
- `echelon` - Money Market
- `layerbank` - Lending
- `mosaic` - DEX Aggregator

**Process:**

1. **Research Phase:**
   - Find protocol's Move module addresses
   - Identify view functions (positions, rewards)
   - Identify entry functions (claim)
   - Check for SDK or API availability

2. **Configuration Phase:**
   - Add protocol config to `constants/protocols/{protocol}.ts`
   - Add to protocol registry in `constants/protocols/index.ts`
   - Add protocol icon to `public/icons/`

3. **Service Phase:**
   - Create `lib/services/protocols/{protocol}-service.ts`
   - Implement `getPositions(address)`
   - Implement `getPendingRewards(address)`
   - Implement `buildClaimTransaction()`
   - Add to ProtocolAggregator

4. **UI Phase:**
   - Add protocol to dashboard display
   - Create claim button with TransactionDialog
   - Test end-to-end flow

**Skills Required:**
- `protocol-dev` - Main integration skill
- `move-integration` - For contract calls
- `ui-dev` - For UI components

**Example:**
```
/protocol-integrate yuzu
```

This will guide you through integrating Yuzu's LP positions and rewards claiming.
