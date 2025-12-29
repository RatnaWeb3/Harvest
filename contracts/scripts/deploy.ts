/**
 * Harvest Contract Deployment Script
 *
 * Deploys Harvest contracts to Movement Network
 *
 * Usage:
 *   npx ts-node scripts/deploy.ts --network testnet
 *   npx ts-node scripts/deploy.ts --network mainnet
 */

import { execSync } from "child_process";

interface DeployConfig {
  network: "testnet" | "mainnet";
  nodeUrl: string;
  faucetUrl?: string;
}

const NETWORKS: Record<string, DeployConfig> = {
  testnet: {
    network: "testnet",
    nodeUrl: "https://testnet.movementnetwork.xyz/v1",
    faucetUrl: "https://faucet.testnet.movementnetwork.xyz",
  },
  mainnet: {
    network: "mainnet",
    nodeUrl: "https://mainnet.movementnetwork.xyz/v1",
  },
};

function run(cmd: string): string {
  console.log(`\n> ${cmd}\n`);
  return execSync(cmd, { encoding: "utf8", stdio: "inherit" }) as unknown as string;
}

async function deploy() {
  const networkArg = process.argv.find((arg) => arg.startsWith("--network="));
  const network = networkArg?.split("=")[1] || "testnet";
  const config = NETWORKS[network];

  if (!config) {
    console.error(`Unknown network: ${network}`);
    console.error("Available networks: testnet, mainnet");
    process.exit(1);
  }

  console.log("=".repeat(50));
  console.log(`Deploying Harvest to ${network}`);
  console.log(`Node URL: ${config.nodeUrl}`);
  console.log("=".repeat(50));

  // Step 1: Compile contracts
  console.log("\n[1/4] Compiling contracts...");
  run("aptos move compile --named-addresses harvest=default");

  // Step 2: Run tests
  console.log("\n[2/4] Running tests...");
  run("aptos move test --named-addresses harvest=default");

  // Step 3: Publish to network
  console.log("\n[3/4] Publishing to network...");
  run(
    `aptos move publish --named-addresses harvest=default --assume-yes --url ${config.nodeUrl}`
  );

  // Step 4: Output deployment info
  console.log("\n[4/4] Deployment complete!");
  console.log("=".repeat(50));
  console.log("\nNext steps:");
  console.log("1. Run registry initialization if first deploy");
  console.log("2. Register protocol adapters");
  console.log("3. Update frontend .env with contract addresses");
  console.log("=".repeat(50));
}

deploy().catch((error) => {
  console.error("Deployment failed:", error);
  process.exit(1);
});
