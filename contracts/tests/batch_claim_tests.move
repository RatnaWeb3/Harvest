#[test_only]
module harvest::batch_claim_tests {
    use std::signer;
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use harvest::registry;
    use harvest::batch_claim;

    // ==================== Test Addresses ====================

    const ADMIN: address = @0xAD;
    const USER: address = @0xBEEF;
    const PROTOCOL_A: address = @0xA;
    const PROTOCOL_B: address = @0xB;
    const PROTOCOL_C: address = @0xC;

    // ==================== Test Setup ====================

    fun setup_test_env(admin: &signer, user: &signer) {
        // Create test accounts
        account::create_account_for_test(signer::address_of(admin));
        account::create_account_for_test(signer::address_of(user));

        // Initialize timestamp for testing
        let aptos = account::create_signer_for_test(@0x1);
        timestamp::set_time_has_started_for_testing(&aptos);

        // Initialize registry
        registry::initialize(admin);
    }

    fun setup_with_protocols(admin: &signer, user: &signer) {
        setup_test_env(admin, user);

        // Register multiple protocols
        registry::register_protocol(
            admin,
            PROTOCOL_A,
            b"Yuzu",
            PROTOCOL_A,
            b"claim_rewards",
        );
        registry::register_protocol(
            admin,
            PROTOCOL_B,
            b"Joule",
            PROTOCOL_B,
            b"claim_rewards",
        );
        registry::register_protocol(
            admin,
            PROTOCOL_C,
            b"Meridian",
            PROTOCOL_C,
            b"claim_rewards",
        );

        // Initialize batch claim events for user
        batch_claim::init_events(user);
    }

    // ==================== Registry Tests ====================

    #[test(admin = @0xAD, user = @0xBEEF)]
    fun test_register_protocol(admin: &signer, user: &signer) {
        setup_test_env(admin, user);

        registry::register_protocol(
            admin,
            PROTOCOL_A,
            b"Yuzu",
            PROTOCOL_A,
            b"claim_rewards",
        );

        assert!(registry::is_active(signer::address_of(admin), PROTOCOL_A), 1);
    }

    #[test(admin = @0xAD, user = @0xBEEF)]
    fun test_deactivate_protocol(admin: &signer, user: &signer) {
        setup_test_env(admin, user);
        let admin_addr = signer::address_of(admin);

        registry::register_protocol(admin, PROTOCOL_A, b"Test", PROTOCOL_A, b"claim");
        assert!(registry::is_active(admin_addr, PROTOCOL_A), 1);

        registry::deactivate_protocol(admin, PROTOCOL_A);
        assert!(!registry::is_active(admin_addr, PROTOCOL_A), 2);
    }

    #[test(admin = @0xAD, user = @0xBEEF)]
    fun test_activate_protocol(admin: &signer, user: &signer) {
        setup_test_env(admin, user);
        let admin_addr = signer::address_of(admin);

        registry::register_protocol(admin, PROTOCOL_A, b"Test", PROTOCOL_A, b"claim");
        registry::deactivate_protocol(admin, PROTOCOL_A);
        registry::activate_protocol(admin, PROTOCOL_A);

        assert!(registry::is_active(admin_addr, PROTOCOL_A), 1);
    }

    // ==================== Batch Claim Happy Path Tests ====================

    #[test(admin = @0xAD, user = @0xBEEF)]
    fun test_batch_claim_single_protocol(admin: &signer, user: &signer) {
        setup_with_protocols(admin, user);
        let admin_addr = signer::address_of(admin);

        let protocols = vector::singleton(PROTOCOL_A);
        batch_claim::batch_claim(user, admin_addr, protocols);

        assert!(batch_claim::has_events(signer::address_of(user)), 1);
    }

    #[test(admin = @0xAD, user = @0xBEEF)]
    fun test_batch_claim_multiple_protocols(admin: &signer, user: &signer) {
        setup_with_protocols(admin, user);
        let admin_addr = signer::address_of(admin);

        let protocols = vector::empty();
        vector::push_back(&mut protocols, PROTOCOL_A);
        vector::push_back(&mut protocols, PROTOCOL_B);
        vector::push_back(&mut protocols, PROTOCOL_C);

        batch_claim::batch_claim(user, admin_addr, protocols);
        assert!(batch_claim::has_events(signer::address_of(user)), 1);
    }

    #[test(admin = @0xAD, user = @0xBEEF)]
    fun test_single_claim(admin: &signer, user: &signer) {
        setup_with_protocols(admin, user);
        let admin_addr = signer::address_of(admin);

        batch_claim::single_claim(user, admin_addr, PROTOCOL_A);
        assert!(batch_claim::has_events(signer::address_of(user)), 1);
    }

    #[test(admin = @0xAD, user = @0xBEEF)]
    fun test_init_events(admin: &signer, user: &signer) {
        setup_test_env(admin, user);

        assert!(!batch_claim::has_events(signer::address_of(user)), 1);
        batch_claim::init_events(user);
        assert!(batch_claim::has_events(signer::address_of(user)), 2);
    }

    #[test(admin = @0xAD, user = @0xBEEF)]
    fun test_validate_batch(admin: &signer, user: &signer) {
        setup_with_protocols(admin, user);
        let admin_addr = signer::address_of(admin);

        // Deactivate one protocol
        registry::deactivate_protocol(admin, PROTOCOL_C);

        let protocols = vector::empty();
        vector::push_back(&mut protocols, PROTOCOL_A);
        vector::push_back(&mut protocols, PROTOCOL_B);
        vector::push_back(&mut protocols, PROTOCOL_C);

        let (valid, invalid) = batch_claim::validate_batch(admin_addr, &protocols);
        assert!(valid == 2, 1);
        assert!(invalid == 1, 2);
    }

    // ==================== Error Condition Tests ====================

    #[test(admin = @0xAD, user = @0xBEEF)]
    #[expected_failure(abort_code = 20)] // EEMPTY_BATCH
    fun test_empty_batch_fails(admin: &signer, user: &signer) {
        setup_test_env(admin, user);
        let admin_addr = signer::address_of(admin);

        batch_claim::batch_claim(user, admin_addr, vector::empty());
    }

    #[test(admin = @0xAD, user = @0xBEEF)]
    #[expected_failure(abort_code = 21)] // EBATCH_SIZE_EXCEEDED
    fun test_batch_size_exceeded_fails(admin: &signer, user: &signer) {
        setup_test_env(admin, user);
        let admin_addr = signer::address_of(admin);

        // Create batch with 11 protocols (max is 10)
        let protocols = vector::empty();
        let i = 0;
        while (i < 11) {
            vector::push_back(&mut protocols, @0x100);
            i = i + 1;
        };

        batch_claim::batch_claim(user, admin_addr, protocols);
    }

    #[test(admin = @0xAD, user = @0xBEEF)]
    #[expected_failure(abort_code = 2)] // EINVALID_PROTOCOL
    fun test_single_claim_inactive_protocol_fails(admin: &signer, user: &signer) {
        setup_test_env(admin, user);
        let admin_addr = signer::address_of(admin);

        // Try to claim from unregistered protocol
        batch_claim::single_claim(user, admin_addr, PROTOCOL_A);
    }

    #[test(admin = @0xAD)]
    #[expected_failure(abort_code = 2)] // EPROTOCOL_EXISTS
    fun test_register_duplicate_protocol_fails(admin: &signer) {
        account::create_account_for_test(signer::address_of(admin));
        registry::initialize(admin);

        registry::register_protocol(admin, PROTOCOL_A, b"Test", PROTOCOL_A, b"claim");
        registry::register_protocol(admin, PROTOCOL_A, b"Test2", PROTOCOL_A, b"claim");
    }

    // ==================== View Function Tests ====================

    #[test]
    fun test_max_batch_size() {
        assert!(batch_claim::max_batch_size() == 10, 1);
    }

    #[test(admin = @0xAD, user = @0xBEEF)]
    fun test_registry_exists(admin: &signer, user: &signer) {
        setup_test_env(admin, user);
        let admin_addr = signer::address_of(admin);

        assert!(registry::registry_exists(admin_addr), 1);
        assert!(!registry::registry_exists(@0x999), 2);
    }

    #[test(admin = @0xAD, user = @0xBEEF)]
    fun test_get_admin(admin: &signer, user: &signer) {
        setup_test_env(admin, user);
        let admin_addr = signer::address_of(admin);

        assert!(registry::get_admin(admin_addr) == admin_addr, 1);
    }
}
