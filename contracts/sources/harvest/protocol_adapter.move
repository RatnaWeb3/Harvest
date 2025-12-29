/// Protocol Adapter Interface Documentation
///
/// This module documents the interface that protocol adapters must implement.
/// Move does not have formal interfaces/traits, so each adapter implements
/// these functions directly with consistent signatures.
///
/// Each protocol adapter should provide:
///
/// 1. has_rewards(user: address): bool
///    - Check if user has any claimable rewards
///    - Returns true if rewards > 0
///
/// 2. get_claimable(user: address): u64
///    - Get the amount of claimable rewards for user
///    - Returns the amount in the protocol's reward token smallest unit
///
/// 3. claim(user: &signer): u64
///    - Execute the claim operation for the user
///    - Returns the amount claimed
///    - May abort on failure
///
/// Optional functions:
///
/// 4. get_positions(user: address): vector<PositionInfo>
///    - Get all user positions in the protocol
///    - Protocol-specific return type
///
/// 5. estimate_gas(): u64
///    - Estimate gas cost for a claim operation
///    - Useful for batch claim optimization
module harvest::protocol_adapter {
    // ==================== Constants ====================

    /// Adapter version for compatibility checking
    const ADAPTER_VERSION: u64 = 1;

    /// Standard error codes for adapters
    const ENO_REWARDS: u64 = 100;
    const ECLAIM_FAILED: u64 = 101;
    const EPROTOCOL_UNAVAILABLE: u64 = 102;

    // ==================== Public Getters ====================

    /// Get the current adapter interface version
    public fun version(): u64 { ADAPTER_VERSION }

    /// Standard error: no rewards available
    public fun err_no_rewards(): u64 { ENO_REWARDS }

    /// Standard error: claim execution failed
    public fun err_claim_failed(): u64 { ECLAIM_FAILED }

    /// Standard error: protocol unavailable
    public fun err_protocol_unavailable(): u64 { EPROTOCOL_UNAVAILABLE }
}
