#!/bin/bash
# Harvest Move Contract Test Script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTRACTS_DIR="$(dirname "$SCRIPT_DIR")"

echo "========================================="
echo "Harvest Move Contract Tests"
echo "========================================="
echo ""

cd "$CONTRACTS_DIR"

# Run all tests
echo "Running all tests..."
aptos move test --skip-fetch-latest-git-deps

echo ""
echo "========================================="
echo "All tests passed!"
echo "========================================="
