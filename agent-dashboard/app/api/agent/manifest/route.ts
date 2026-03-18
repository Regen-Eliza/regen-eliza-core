import { NextResponse } from "next/server";

export const dynamic = "force-static";

const manifest = {
  name: "Regen Eliza",
  version: "2.0.0",
  description:
    "An autonomous ERC-8004 agent deployed on Celo and Base that funds verified public goods projects, executes stablecoin swaps via Uniswap, and routes x402 micro-payments to ENS contacts.",
  agent_type: "ERC-8004",
  erc8004_ids: {
    celo: 1851,
    base: "COMPROMISED_MIGRATED",
  },
  chains: [
    {
      name: "Celo",
      chain_id: 42220,
      rpc: "https://forno.celo.org",
      wallet: "0xC57f7ce71FDe55CEE70f509a9B441Db87Be07D60",
    },
    {
      name: "Base",
      chain_id: 8453,
      rpc: "https://mainnet.base.org",
      wallet: "0xC57f7ce71FDe55CEE70f509a9B441Db87Be07D60",
    },
  ],
  skills: [
    "finance_and_business/micro_donations",
    "finance_and_business/defi/automated_swapping",
    "technology/blockchain/cross_chain_routing",
    "public_goods/data_collection/impact_signals",
    "natural_language_processing/public_goods/qualitative_analysis",
    "agentic_public_goods",
    "donations_to_verified_projects",
  ],
  capabilities: {
    voice_commands: true,
    intent_parsing: true,
    on_chain_execution: true,
    a2a_commerce: true,
  },
  tracks: ["ecology", "builders", "desci", "agents"],
  socials: {
    twitter: "https://twitter.com/RegenEliza",
    github: "https://github.com/regen-eliza-core",
  },
};

export async function GET() {
  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
