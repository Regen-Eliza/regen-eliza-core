"use server";

import { ethers } from "ethers";

/* ─── Constants ─── */
const MICRO_AMOUNT = "0.0001"; // ETH — tiny demo micro-donation

// Verified public-goods / demo recipient addresses per target
const TARGET_ADDRESSES: Record<string, string> = {
  ecology:  "0x7a300060b39350A8dD5eBa7b028a73C8004AE004", // Regen Eliza agent address (demo loop-back)
  builders: "0x7a300060b39350A8dD5eBa7b028a73C8004AE004",
  desci:    "0x7a300060b39350A8dD5eBa7b028a73C8004AE004",
  agents:   "0x7a300060b39350A8dD5eBa7b028a73C8004AE004",
};

export interface DonationResult {
  success: boolean;
  txHash?: string;
  error?: string;
  target: string;
  amount: string;
  network: string;
}

/**
 * Executes a micro-donation on the Base Mainnet network.
 *
 * This is a Next.js Server Action — it runs exclusively on the server
 * so the private key never reaches the browser.
 */
export async function executeDonation(target: string): Promise<DonationResult> {
  const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC;
  const privateKey = process.env.BASE_PRIVATE_KEY;

  if (!rpcUrl) {
    return { success: false, error: "BASE_RPC not configured", target, amount: MICRO_AMOUNT, network: "Base" };
  }
  if (!privateKey) {
    return { success: false, error: "BASE_PRIVATE_KEY not configured", target, amount: MICRO_AMOUNT, network: "Base" };
  }

  const toAddress = TARGET_ADDRESSES[target.toLowerCase()];
  if (!toAddress) {
    return { success: false, error: `Unknown target: ${target}`, target, amount: MICRO_AMOUNT, network: "Base" };
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log(`[ServerAction] Sending ${MICRO_AMOUNT} ETH to ${toAddress} on Base for target "${target}"...`);

    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: ethers.utils.parseEther(MICRO_AMOUNT),
    });

    console.log(`[ServerAction] TX broadcasted: ${tx.hash}`);

    // Wait for 1 confirmation to ensure the tx lands on-chain
    await tx.wait(1);

    console.log(`[ServerAction] TX confirmed: ${tx.hash}`);

    return {
      success: true,
      txHash: tx.hash,
      target,
      amount: MICRO_AMOUNT,
      network: "Base",
    };
  } catch (err: any) {
    console.error("[ServerAction] Donation failed:", err);
    return {
      success: false,
      error: err.reason || err.message || "Transaction failed",
      target,
      amount: MICRO_AMOUNT,
      network: "Base",
    };
  }
}
