import { ethers } from "ethers";
import * as dotenv from "dotenv";
import path from "path";

// Load .env.local from the project root
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const CELO_RPC = "https://forno.celo.org";
const CELO_PRIVATE_KEY = process.env.CELO_PRIVATE_KEY;

if (!CELO_PRIVATE_KEY) {
  console.error("❌  CELO_PRIVATE_KEY is not set in .env.local");
  process.exit(1);
}

async function verifyKey() {
  try {
    const provider = new ethers.providers.JsonRpcProvider(CELO_RPC);
    const wallet = new ethers.Wallet(CELO_PRIVATE_KEY!, provider);

    console.log("✅  CELO_PRIVATE_KEY loaded successfully.");
    console.log("🔑  Derived Wallet Address:", wallet.address);

    const balance = await provider.getBalance(wallet.address);
    console.log("💰  Celo Balance:", ethers.utils.formatEther(balance), "CELO");

    const expected = "0xC57f7ce71FDe55CEE70f509a9B441Db87Be07D60";
    if (wallet.address.toLowerCase() === expected.toLowerCase()) {
      console.log("✅  Address matches target. Key verified.");
    } else {
      console.warn("⚠️   Address does NOT match expected:", expected);
      console.warn("    Got:", wallet.address);
    }
  } catch (err: any) {
    console.error("❌  Verification failed:", err.message);
    process.exit(1);
  }
}

verifyKey();
