/// Centralized error codes for Harvest modules
module harvest::errors {
    // Authorization errors
    const ENOT_AUTHORIZED: u64 = 1;
    const EINVALID_PROTOCOL: u64 = 2;

    // Claim errors
    const ENO_REWARDS_TO_CLAIM: u64 = 10;
    const ECLAIM_FAILED: u64 = 11;
    const EINSUFFICIENT_REWARDS: u64 = 12;

    // Batch errors
    const EEMPTY_BATCH: u64 = 20;
    const EBATCH_SIZE_EXCEEDED: u64 = 21;
    const EVECTOR_LENGTH_MISMATCH: u64 = 22;

    // Math errors
    const EOVERFLOW: u64 = 30;
    const EDIVISION_BY_ZERO: u64 = 31;

    // Compound errors
    const EINVALID_COMPOUND_TARGET: u64 = 40;
    const ESWAP_FAILED: u64 = 41;

    // Public getters
    public fun not_authorized(): u64 { ENOT_AUTHORIZED }
    public fun invalid_protocol(): u64 { EINVALID_PROTOCOL }
    public fun no_rewards_to_claim(): u64 { ENO_REWARDS_TO_CLAIM }
    public fun claim_failed(): u64 { ECLAIM_FAILED }
    public fun insufficient_rewards(): u64 { EINSUFFICIENT_REWARDS }
    public fun empty_batch(): u64 { EEMPTY_BATCH }
    public fun batch_size_exceeded(): u64 { EBATCH_SIZE_EXCEEDED }
    public fun vector_length_mismatch(): u64 { EVECTOR_LENGTH_MISMATCH }
    public fun overflow(): u64 { EOVERFLOW }
    public fun division_by_zero(): u64 { EDIVISION_BY_ZERO }
    public fun invalid_compound_target(): u64 { EINVALID_COMPOUND_TARGET }
    public fun swap_failed(): u64 { ESWAP_FAILED }
}
