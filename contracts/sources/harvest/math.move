/// Math utilities for Harvest - safe arithmetic operations
module harvest::math {
    use harvest::errors;

    const MAX_U64: u64 = 18446744073709551615;

    /// Safe addition with overflow check
    public fun safe_add(a: u64, b: u64): u64 {
        assert!(a <= MAX_U64 - b, errors::overflow());
        a + b
    }

    /// Safe subtraction with underflow check
    public fun safe_sub(a: u64, b: u64): u64 {
        assert!(a >= b, errors::overflow());
        a - b
    }

    /// Safe multiplication with overflow check
    public fun safe_mul(a: u64, b: u64): u64 {
        if (a == 0 || b == 0) return 0;
        assert!(a <= MAX_U64 / b, errors::overflow());
        a * b
    }

    /// Safe division with zero check
    public fun safe_div(a: u64, b: u64): u64 {
        assert!(b > 0, errors::division_by_zero());
        a / b
    }

    /// Calculate percentage (basis points: 10000 = 100%)
    public fun calculate_percentage(amount: u64, bps: u64): u64 {
        let result = ((amount as u128) * (bps as u128)) / 10000u128;
        assert!(result <= (MAX_U64 as u128), errors::overflow());
        (result as u64)
    }

    /// Calculate share of total
    public fun calculate_share(amount: u64, share: u64, total: u64): u64 {
        assert!(total > 0, errors::division_by_zero());
        let result = ((amount as u128) * (share as u128)) / (total as u128);
        assert!(result <= (MAX_U64 as u128), errors::overflow());
        (result as u64)
    }

    /// Get minimum of two values
    public fun min(a: u64, b: u64): u64 { if (a < b) { a } else { b } }

    /// Get maximum of two values
    public fun max(a: u64, b: u64): u64 { if (a > b) { a } else { b } }

    /// Clamp value between min and max
    public fun clamp(value: u64, min_val: u64, max_val: u64): u64 {
        if (value < min_val) { min_val }
        else if (value > max_val) { max_val }
        else { value }
    }

    /// Check if value is within range (inclusive)
    public fun in_range(value: u64, min_val: u64, max_val: u64): bool {
        value >= min_val && value <= max_val
    }
}
