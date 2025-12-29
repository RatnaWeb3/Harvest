# Deploy Move Contracts

Deploy Move modules to Movement network.

**Usage:**
- `/deploy-contracts` - Deploy all contracts to devnet
- `/deploy-contracts testnet` - Deploy to testnet
- `/deploy-contracts mainnet` - Deploy to mainnet (careful!)

**Process:**

1. **Pre-deployment checks:**
   - Run `aptos move test` to ensure all tests pass
   - Compile with `aptos move compile`
   - Check Move.toml is configured correctly

2. **Deployment:**
   - Deploy using `aptos move publish`
   - Record deployed module addresses
   - Verify deployment was successful

3. **Post-deployment:**
   - Update `frontend/constants/protocols/` with new addresses
   - Verify modules are accessible via view functions
   - Update any environment files

**Requirements:**
- Aptos CLI installed and configured
- Valid account with sufficient balance for gas
- Tests must pass before deployment

**Example:**
```bash
# In contracts directory
aptos move test
aptos move compile
aptos move publish --named-addresses Harvest=default
```

**Verification:**
- Check explorer for deployed modules
- Call view functions from frontend
- Test entry functions with test transaction
