/// Meridian Protocol Adapter
///
/// Adapter for claiming rewards from Meridian DeFi protocol.
/// Meridian is the native liquidity layer on Movement with:
/// - Liquid staking (mMOVE)
/// - Yield vaults
/// - MOVE/MERID incentives
///
/// Twitter: @meridian_money
///
/// NOTE: Contract addresses TBA - mainnet deployment pending
module harvest::meridian_adapter {
    use std::signer;

    // ==================== Constants ====================

    /// Meridian module address - TBA
    const MERIDIAN_MODULE: address = @0x0;

    /// Protocol identifier
    const PROTOCOL_NAME: vector<u8> = b"Meridian";

    // ==================== Error Codes ====================

    const E_NOT_DEPLOYED: u64 = 1;
    const E_NO_REWARDS: u64 = 2;

    // ==================== View Functions ====================

    /// Check if Meridian protocol is available
    public fun is_available(): bool {
        MERIDIAN_MODULE != @0x0
    }

    /// Get protocol name
    public fun protocol_name(): vector<u8> {
        PROTOCOL_NAME
    }

    /// Get protocol module address
    public fun module_address(): address {
        MERIDIAN_MODULE
    }

    /// Check if user has claimable rewards
    public fun has_rewards(_user: address): bool {
        // TODO: Call meridian::rewards::has_pending(user)
        false
    }

    /// Get claimable reward amount
    public fun get_claimable(_user: address): u64 {
        // TODO: Call meridian::rewards::pending_amount(user)
        0
    }

    /// Get user's staked amount (MOVE)
    public fun get_staked_amount(_user: address): u64 {
        // TODO: Query meridian::staking::get_stake(user)
        0
    }

    /// Get user's mMOVE balance
    public fun get_mmove_balance(_user: address): u64 {
        // TODO: Query meridian::liquid_staking::balance(user)
        0
    }

    /// Get mMOVE/MOVE exchange rate (scaled by 1e8)
    public fun get_exchange_rate(): u64 {
        // TODO: Query meridian::liquid_staking::exchange_rate()
        // Returns value like 105000000 for rate of 1.05
        100000000 // 1.0 default
    }

    /// Get user's vault positions value
    public fun get_vault_value(_user: address): u64 {
        // TODO: Query meridian::vault::get_user_value(user)
        0
    }

    // ==================== Entry Functions ====================

    /// Claim all available rewards from Meridian
    public fun claim_all(user: &signer): u64 {
        assert!(is_available(), E_NOT_DEPLOYED);

        let user_addr = signer::address_of(user);
        let claimable = get_claimable(user_addr);

        if (claimable == 0) {
            return 0
        };

        // TODO: Call meridian::rewards::claim(user)
        // meridian::rewards::claim(user);

        claimable
    }

    /// Claim staking rewards
    public fun claim_staking_rewards(user: &signer): u64 {
        assert!(is_available(), E_NOT_DEPLOYED);
        // TODO: Call meridian::staking::claim(user)
        let _ = signer::address_of(user);
        0
    }

    /// Claim vault rewards
    public fun claim_vault_rewards(user: &signer, _vault_id: u64): u64 {
        assert!(is_available(), E_NOT_DEPLOYED);
        // TODO: Call meridian::vault::claim(user, vault_id)
        let _ = signer::address_of(user);
        0
    }

    /// Claim all rewards for batch_claim integration
    public fun claim(user: &signer): u64 {
        claim_all(user)
    }
}
