/// Batch claim module for Harvest
/// Enables claiming rewards from multiple protocols in a single transaction
module harvest::batch_claim {
    use std::vector;
    use std::signer;
    use aptos_framework::timestamp;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::account;
    use harvest::errors;
    use harvest::registry;

    // ==================== Constants ====================

    /// Maximum protocols per batch claim
    const MAX_BATCH_SIZE: u64 = 10;

    // ==================== Structs ====================

    /// Claim request for a single protocol
    struct ClaimRequest has drop, copy {
        protocol: address,
    }

    /// Stores batch claim events for a user account
    struct BatchClaimEvents has key {
        claim_events: EventHandle<BatchClaimEvent>,
    }

    /// Event emitted after a successful batch claim
    struct BatchClaimEvent has drop, store {
        user: address,
        protocols_claimed: u64,
        successful_claims: u64,
        failed_claims: u64,
        timestamp: u64,
    }

    /// Individual claim result tracking
    struct ClaimResult has drop, copy {
        protocol: address,
        success: bool,
    }

    // ==================== Entry Functions ====================

    /// Initialize event handle for a user account
    public entry fun init_events(account: &signer) {
        let addr = signer::address_of(account);
        if (!exists<BatchClaimEvents>(addr)) {
            move_to(account, BatchClaimEvents {
                claim_events: account::new_event_handle<BatchClaimEvent>(account),
            });
        };
    }

    /// Batch claim rewards from multiple protocols
    /// @param user - The signer claiming rewards
    /// @param registry_addr - Address where protocol registry is stored
    /// @param protocols - Vector of protocol addresses to claim from
    public entry fun batch_claim(
        user: &signer,
        registry_addr: address,
        protocols: vector<address>,
    ) acquires BatchClaimEvents {
        let len = vector::length(&protocols);

        // Validate batch
        assert!(len > 0, errors::empty_batch());
        assert!(len <= MAX_BATCH_SIZE, errors::batch_size_exceeded());

        let successful_claims = 0u64;
        let failed_claims = 0u64;

        // Process each protocol
        let i = 0;
        while (i < len) {
            let protocol = *vector::borrow(&protocols, i);

            // Verify protocol is registered and active
            if (registry::is_active(registry_addr, protocol)) {
                // Execute claim for this protocol
                let success = execute_protocol_claim(user, protocol);
                if (success) {
                    successful_claims = successful_claims + 1;
                } else {
                    failed_claims = failed_claims + 1;
                };
            } else {
                failed_claims = failed_claims + 1;
            };

            i = i + 1;
        };

        // Emit batch claim event
        emit_batch_claim_event(
            user,
            len,
            successful_claims,
            failed_claims
        );
    }

    /// Claim from a single protocol with validation
    public entry fun single_claim(
        user: &signer,
        registry_addr: address,
        protocol: address,
    ) acquires BatchClaimEvents {
        // Verify protocol is active
        assert!(
            registry::is_active(registry_addr, protocol),
            errors::invalid_protocol()
        );

        let success = execute_protocol_claim(user, protocol);

        // Emit event even for single claims
        emit_batch_claim_event(
            user,
            1,
            if (success) { 1 } else { 0 },
            if (success) { 0 } else { 1 }
        );
    }

    // ==================== Internal Functions ====================

    /// Execute a claim for a specific protocol
    /// NOTE: This is a placeholder - actual protocol-specific claim logic
    /// would need to be implemented per protocol or use dynamic dispatch
    fun execute_protocol_claim(_user: &signer, _protocol: address): bool {
        // TODO: Implement protocol-specific claim logic
        // This would involve:
        // 1. Looking up the protocol's claim function from registry
        // 2. Calling the protocol's claim function
        // 3. Returning success/failure
        //
        // For now, returns true as placeholder
        // In production, this would integrate with each protocol's
        // specific claim mechanism
        true
    }

    /// Emit a batch claim event
    fun emit_batch_claim_event(
        user: &signer,
        protocols_claimed: u64,
        successful_claims: u64,
        failed_claims: u64,
    ) acquires BatchClaimEvents {
        let user_addr = signer::address_of(user);

        // Initialize events if not exists
        if (!exists<BatchClaimEvents>(user_addr)) {
            move_to(user, BatchClaimEvents {
                claim_events: account::new_event_handle<BatchClaimEvent>(user),
            });
        };

        let events = borrow_global_mut<BatchClaimEvents>(user_addr);
        event::emit_event(&mut events.claim_events, BatchClaimEvent {
            user: user_addr,
            protocols_claimed,
            successful_claims,
            failed_claims,
            timestamp: timestamp::now_seconds(),
        });
    }

    // ==================== View Functions ====================

    #[view]
    /// Get maximum batch size
    public fun max_batch_size(): u64 {
        MAX_BATCH_SIZE
    }

    #[view]
    /// Check if user has initialized events
    public fun has_events(user: address): bool {
        exists<BatchClaimEvents>(user)
    }

    // ==================== Helper Functions ====================

    /// Create a claim request
    public fun create_claim_request(protocol: address): ClaimRequest {
        ClaimRequest { protocol }
    }

    /// Get protocol from claim request
    public fun get_claim_protocol(request: &ClaimRequest): address {
        request.protocol
    }

    /// Validate a batch of protocols before claiming
    public fun validate_batch(
        registry_addr: address,
        protocols: &vector<address>
    ): (u64, u64) {
        let len = vector::length(protocols);
        let valid = 0u64;
        let invalid = 0u64;

        let i = 0;
        while (i < len) {
            let protocol = *vector::borrow(protocols, i);
            if (registry::is_active(registry_addr, protocol)) {
                valid = valid + 1;
            } else {
                invalid = invalid + 1;
            };
            i = i + 1;
        };

        (valid, invalid)
    }
}
