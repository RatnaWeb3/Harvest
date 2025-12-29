#!/bin/bash
# Compile Harvest Move contracts

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTRACTS_DIR="$(dirname "$SCRIPT_DIR")"

echo "Compiling Harvest contracts..."
cd "$CONTRACTS_DIR"

aptos move compile --skip-fetch-latest-git-deps

echo "Compilation successful!"
