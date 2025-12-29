# Debug

Strategic debugging for Harvest issues.

**Usage:**
- `/debug` - Interactive debug mode
- `/debug <issue description>` - Debug specific issue

**Debug Categories:**

## 1. Move Contract Issues

**Symptoms:**
- Transaction failures
- Unexpected abort codes
- View function errors

**Steps:**
1. Check Move.toml dependencies
2. Verify module addresses are correct
3. Check function signatures match
4. Review error codes in contract
5. Test with Aptos CLI directly

**Common Issues:**
- Wrong named addresses in deployment
- Type argument mismatches
- Resource not found (not initialized)
- Insufficient permissions

## 2. Frontend Integration Issues

**Symptoms:**
- Wallet not connecting
- Transactions not submitting
- Data not loading

**Steps:**
1. Check wallet adapter setup in `lib/move/`
2. Verify Aptos client configuration
3. Check view function payload format
4. Verify entry function arguments
5. Check console for errors

**Common Issues:**
- Wrong network configuration
- Incorrect function path format
- Type argument format issues
- Missing wallet connection

## 3. Protocol Integration Issues

**Symptoms:**
- Position data not loading
- Rewards showing 0
- Claim transaction failing

**Steps:**
1. Verify protocol module addresses
2. Check view function exists and is correct
3. Parse response data correctly
4. Test with known working address
5. Check protocol's explorer

**Common Issues:**
- Wrong module address
- Function renamed in protocol update
- Response format changed
- User has no positions

## 4. UI/Styling Issues

**Symptoms:**
- Components not rendering
- Styling broken
- Responsive issues

**Steps:**
1. Check component imports
2. Verify shadcn/ui installed correctly
3. Check Tailwind classes
4. Inspect element in browser
5. Check for hydration errors

**Common Issues:**
- Missing 'use client' directive
- Server/client component mismatch
- Tailwind purging classes
- CSS variable not defined

## Debug Commands

```bash
# Check Aptos CLI
aptos info

# Test view function
aptos move view --function-id 'module::module_name::function_name' --args 'address:0x...'

# Check account resources
aptos account list --account default

# Frontend logs
cd frontend && npm run dev
# Check browser console
```

## Reporting

After debugging, report:
1. Root cause identified
2. Solution implemented
3. Files modified
4. How to prevent in future
