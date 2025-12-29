/// Protocol registry for Harvest batch claiming
module harvest::registry {
    use std::signer;
    use std::string::{Self, String};
    use aptos_std::simple_map::{Self, SimpleMap};

    const ENOT_ADMIN: u64 = 1;
    const EPROTOCOL_EXISTS: u64 = 2;
    const EPROTOCOL_NOT_FOUND: u64 = 3;
    const EREGISTRY_ALREADY_EXISTS: u64 = 5;

    struct ProtocolRegistry has key {
        protocols: SimpleMap<address, ProtocolInfo>,
        admin: address,
    }

    struct ProtocolInfo has store, drop, copy {
        name: String,
        claim_module: address,
        claim_function: String,
        active: bool,
    }

    /// Initialize the registry (call once by admin)
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<ProtocolRegistry>(admin_addr), EREGISTRY_ALREADY_EXISTS);
        move_to(admin, ProtocolRegistry {
            protocols: simple_map::new(),
            admin: admin_addr,
        });
    }

    /// Register a new protocol
    public entry fun register_protocol(
        admin: &signer,
        protocol_address: address,
        name: vector<u8>,
        claim_module: address,
        claim_function: vector<u8>,
    ) acquires ProtocolRegistry {
        let admin_addr = signer::address_of(admin);
        let registry = borrow_global_mut<ProtocolRegistry>(admin_addr);
        assert!(registry.admin == admin_addr, ENOT_ADMIN);
        assert!(!simple_map::contains_key(&registry.protocols, &protocol_address), EPROTOCOL_EXISTS);
        simple_map::add(&mut registry.protocols, protocol_address, ProtocolInfo {
            name: string::utf8(name),
            claim_module,
            claim_function: string::utf8(claim_function),
            active: true,
        });
    }

    /// Update an existing protocol
    public entry fun update_protocol(
        admin: &signer,
        protocol_address: address,
        name: vector<u8>,
        claim_module: address,
        claim_function: vector<u8>,
    ) acquires ProtocolRegistry {
        let admin_addr = signer::address_of(admin);
        let registry = borrow_global_mut<ProtocolRegistry>(admin_addr);
        assert!(registry.admin == admin_addr, ENOT_ADMIN);
        assert!(simple_map::contains_key(&registry.protocols, &protocol_address), EPROTOCOL_NOT_FOUND);
        let info = simple_map::borrow_mut(&mut registry.protocols, &protocol_address);
        info.name = string::utf8(name);
        info.claim_module = claim_module;
        info.claim_function = string::utf8(claim_function);
    }

    /// Activate a protocol
    public entry fun activate_protocol(
        admin: &signer,
        protocol_address: address,
    ) acquires ProtocolRegistry {
        let admin_addr = signer::address_of(admin);
        let registry = borrow_global_mut<ProtocolRegistry>(admin_addr);
        assert!(registry.admin == admin_addr, ENOT_ADMIN);
        assert!(simple_map::contains_key(&registry.protocols, &protocol_address), EPROTOCOL_NOT_FOUND);
        simple_map::borrow_mut(&mut registry.protocols, &protocol_address).active = true;
    }

    /// Deactivate a protocol
    public entry fun deactivate_protocol(
        admin: &signer,
        protocol_address: address,
    ) acquires ProtocolRegistry {
        let admin_addr = signer::address_of(admin);
        let registry = borrow_global_mut<ProtocolRegistry>(admin_addr);
        assert!(registry.admin == admin_addr, ENOT_ADMIN);
        assert!(simple_map::contains_key(&registry.protocols, &protocol_address), EPROTOCOL_NOT_FOUND);
        simple_map::borrow_mut(&mut registry.protocols, &protocol_address).active = false;
    }

    #[view]
    public fun get_protocol(registry_addr: address, protocol_address: address): ProtocolInfo acquires ProtocolRegistry {
        let registry = borrow_global<ProtocolRegistry>(registry_addr);
        assert!(simple_map::contains_key(&registry.protocols, &protocol_address), EPROTOCOL_NOT_FOUND);
        *simple_map::borrow(&registry.protocols, &protocol_address)
    }

    #[view]
    public fun is_active(registry_addr: address, protocol_address: address): bool acquires ProtocolRegistry {
        let registry = borrow_global<ProtocolRegistry>(registry_addr);
        if (!simple_map::contains_key(&registry.protocols, &protocol_address)) { return false };
        simple_map::borrow(&registry.protocols, &protocol_address).active
    }

    #[view]
    public fun registry_exists(addr: address): bool { exists<ProtocolRegistry>(addr) }

    #[view]
    public fun get_admin(registry_addr: address): address acquires ProtocolRegistry {
        borrow_global<ProtocolRegistry>(registry_addr).admin
    }
}
