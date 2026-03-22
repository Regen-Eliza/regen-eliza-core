// @ts-nocheck
import { ethers } from "ethers";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as dotenv from "dotenv";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const CELO_RPC = "https://forno.celo.org";
const BASE_RPC  = "https://mainnet.base.org";
const PRIVATE_KEY = process.env.CELO_PRIVATE_KEY!;
const AGENT_ID = 1851;

// ERC-8004 registry on both chains
const REGISTRY = "0x8004a169fb4a3325136eb29fa0ceb6d2e539a432";

// Minimal ABI — just setMetadataURI
const ABI = [
  "function setMetadataURI(uint256 agentId, string calldata uri) external",
  "function getMetadataURI(uint256 agentId) view returns (string)"
];

async function updateChain(rpc: string, chainName: string, newCID: string) {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const wallet   = new ethers.Wallet(PRIVATE_KEY, provider);
  const registry = new ethers.Contract(REGISTRY, ABI, wallet);

  const uri = `ipfs://${newCID}`;
  console.log(`\n[${chainName}] Updating agent ${AGENT_ID} → ${uri}`);

  const current = await registry.getMetadataURI(AGENT_ID);
  console.log(`[${chainName}] Current URI: ${current}`);

  const tx = await registry.setMetadataURI(AGENT_ID, uri, { gasLimit: 100000 });
  console.log(`[${chainName}] TX submitted: ${tx.hash}`);
  await tx.wait();
  console.log(`[${chainName}] ✅ Confirmed`);
}

const NEW_CID = process.argv[2];
if (!NEW_CID) {
  console.error("Usage: npx ts-node scripts/update-metadata-uri.ts <NEW_IPFS_CID>");
  process.exit(1);
}

(async () => {
  await updateChain(CELO_RPC, "Celo", NEW_CID);
  await updateChain(BASE_RPC,  "Base", NEW_CID);
  console.log("\n✅ Both chains updated.");
})();
