/// Joule Protocol Adapter
///
/// Adapter for claiming rewards from Joule lending protocol.
/// Joule is a decentralized lending/borrowing platform on Movement.
///
/// Docs: https://docs.joule.finance
/// Contract: https://docs.joule.finance/docs/money-market/contract-addresses
///
/// Supported claims:
/// - MOVE incentive rewards
/// - Protocol token emissions
///
/// NOTE: Movement testnet address available, mainnet TBA
module harvest::joule_adapter {
    use std::signer;

    // ==================== Constants ====================

    /// Joule module address (Movement testnet)
    /// Testnet: 0x7ada55ecf28c22d62f0b05c21ecb20c5767ef743fb0bb2cf486948d0a24413bf
    const JOULE_MODULE: address = @0x7ada55ecf28c22d62f0b05c21ecb20c5767ef743fb0bb2cf486948d0a24413bf;

    /// Protocol identifier
    const PROTOCOL_NAME: vector<u8> = b"Joule";

    // ==================== Error Codes ====================

    const E_NOT_DEPLOYED: u64 = 1;
    const E_NO_REWARDS: u64 = 2;

    // ==================== View Functions ====================

    /// Check if Joule protocol is available
    public fun is_available(): bool {
        // TODO: Check if joule module exists at JOULE_MODULE
        JOULE_MODULE != @0x0
    }

    /// Get protocol name
    public fun protocol_name(): vector<u8> {
        PROTOCOL_NAME
    }

    /// Get protocol module address
    public fun module_address(): address {
        JOULE_MODULE
    }

    /// Check if user has claimable rewards
    public fun has_rewards(_user: address): bool {
        // TODO: Call joule::incentives::has_unclaimed_rewards(user)
        false
    }

    /// Get claimable reward amount
    public fun get_claimable(_user: address): u64 {
        // TODO: Call joule::incentives::get_pending_rewards(user)
        0
    }

    /// Get total supplied value for a user
    public fun get_total_supplied(_user: address): u64 {
        // TODO: Query joule::lending_pool::get_user_supply(user)
        0
    }

    /// Get total borrowed value for a user
    public fun get_total_borrowed(_user: address): u64 {
        // TODO: Query joule::lending_pool::get_user_borrow(user)
        0
    }

    /// Get user's health factor (scaled by 100)
    public fun get_health_factor(_user: address): u64 {
        // TODO: Query joule::risk::get_health_factor(user)
        // Returns value like 210 for health factor of 2.10
        0
    }

    // ==================== Entry Functions ====================

    /// Claim all available rewards from Joule
    public fun claim_all(user: &signer): u64 {
        assert!(is_available(), E_NOT_DEPLOYED);

        let user_addr = signer::address_of(user);
        let claimable = get_claimable(user_addr);

        if (claimable == 0) {
            return 0
        };

        // TODO: Call joule::incentives::claim_all(user)
        // joule::incentives::claim_all(user);

        claimable
    }

    /// Claim rewards from a specific market
    public fun claim_from_market(_user: &signer, _market_id: u64): u64 {
        assert!(is_available(), E_NOT_DEPLOYED);
        // TODO: Call joule::incentives::claim_market(user, market_id)
        0
    }

    /// Claim all rewards for batch_claim integration
    public fun claim(user: &signer): u64 {
        claim_all(user)
    }
}
