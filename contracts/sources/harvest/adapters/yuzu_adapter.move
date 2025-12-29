/// Yuzu Protocol Adapter
///
/// Adapter for claiming rewards from Yuzu CLMM DEX positions.
/// Yuzu is a concentrated liquidity AMM on Movement Network.
///
/// Docs: https://docs.yuzu.finance/technical/smart-contracts/yuzu-clmm
///
/// Functions supported:
/// - collect_fee: Claim trading fees from LP positions
/// - collect_reward: Claim farming incentive rewards
///
/// NOTE: Module address is TBA. Update YUZU_MODULE when deployed.
module harvest::yuzu_adapter {
    use std::signer;

    // ==================== Constants ====================

    /// Yuzu module address - update when deployed on Movement mainnet
    /// Check: https://docs.yuzu.finance for latest address
    const YUZU_MODULE: address = @0x0;

    /// Protocol identifier
    const PROTOCOL_NAME: vector<u8> = b"Yuzu";

    /// Maximum u128 for requesting all available fees/rewards
    const MAX_U128: u128 = 340282366920938463463374607431768211455;

    // ==================== Error Codes ====================

    const E_NOT_DEPLOYED: u64 = 1;
    const E_NO_REWARDS: u64 = 2;
    const E_INVALID_POSITION: u64 = 3;

    // ==================== View Functions ====================

    /// Check if Yuzu protocol is deployed and available
    public fun is_available(): bool {
        // TODO: Check if yuzuswap module exists at YUZU_MODULE
        // exists<yuzuswap::liquidity_pool::PoolRegistry>(YUZU_MODULE)
        YUZU_MODULE != @0x0
    }

    /// Get protocol name
    public fun protocol_name(): vector<u8> {
        PROTOCOL_NAME
    }

    /// Get protocol module address
    public fun module_address(): address {
        YUZU_MODULE
    }

    /// Check if user has claimable fee rewards
    /// NOTE: Requires position ID - positions are NFTs in Yuzu CLMM
    public fun has_fees(_user: address): bool {
        // TODO: Query user's position NFTs and check tokens_owed
        // Requires indexer or iterating position NFTs
        false
    }

    /// Check if user has claimable farming rewards
    public fun has_farming_rewards(_user: address): bool {
        // TODO: Query farming rewards from position
        false
    }

    // ==================== Entry Functions ====================

    /// Collect trading fees from a specific position
    ///
    /// Calls yuzuswap::scripts::collect_fee
    ///
    /// @param user - Signer with position ownership
    /// @param pool - Pool object reference
    /// @param position_id - Position NFT ID
    /// @param amount_0_requested - Max amount of token0 to collect
    /// @param amount_1_requested - Max amount of token1 to collect
    public fun collect_fee(
        _user: &signer,
        _pool: address,
        _position_id: u64,
        _amount_0_requested: u64,
        _amount_1_requested: u64,
    ): (u64, u64) {
        // TODO: Call yuzuswap::scripts::collect_fee
        //
        // yuzuswap::scripts::collect_fee(
        //     user,
        //     pool,
        //     position_id,
        //     amount_0_requested,
        //     amount_1_requested,
        //     signer::address_of(user)  // recipient
        // );

        assert!(is_available(), E_NOT_DEPLOYED);
        (0, 0)
    }

    /// Collect farming rewards from a specific position
    ///
    /// Calls yuzuswap::scripts::collect_reward
    ///
    /// @param user - Signer with position ownership
    /// @param pool - Pool object reference
    /// @param position_id - Position NFT ID
    /// @param reward_index - Index of reward token (0, 1, 2...)
    /// @param amount_requested - Max amount to collect
    public fun collect_reward(
        _user: &signer,
        _pool: address,
        _position_id: u64,
        _reward_index: u64,
        _amount_requested: u64,
    ): u64 {
        // TODO: Call yuzuswap::scripts::collect_reward
        //
        // yuzuswap::scripts::collect_reward(
        //     user,
        //     pool,
        //     position_id,
        //     reward_index,
        //     amount_requested,
        //     signer::address_of(user)  // recipient
        // );

        assert!(is_available(), E_NOT_DEPLOYED);
        0
    }

    /// Collect all fees from a position (max amounts)
    public fun collect_all_fees(
        user: &signer,
        pool: address,
        position_id: u64,
    ): (u64, u64) {
        collect_fee(
            user,
            pool,
            position_id,
            (MAX_U128 as u64),
            (MAX_U128 as u64)
        )
    }

    /// Claim all available rewards from Yuzu for batch_claim
    /// This is a simplified interface for the batch claim module
    ///
    /// @param user - Signer executing the claim
    /// @param position_ids - List of position IDs to claim from
    public fun claim_all(
        user: &signer,
        _position_ids: vector<u64>
    ): u64 {
        assert!(is_available(), E_NOT_DEPLOYED);

        let _user_addr = signer::address_of(user);
        let total_claimed: u64 = 0;

        // TODO: Iterate through positions and collect fees
        // for i in 0..vector::length(&position_ids) {
        //     let position_id = *vector::borrow(&position_ids, i);
        //     let pool = get_pool_for_position(position_id);
        //     let (amount0, amount1) = collect_all_fees(user, pool, position_id);
        //     total_claimed = total_claimed + amount0 + amount1;
        // }

        total_claimed
    }

}
