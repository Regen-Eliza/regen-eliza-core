"use server";

import { ethers } from "ethers";
import projects from "../data/projects.json";

/* ─── Constants ─── */
const MICRO_AMOUNT = "0.0001"; // ETH — tiny demo micro-donation

export interface DonationResult {
  success: boolean;
  txHash?: string;
  error?: string;
  target: string;
  projectName?: string;
  amount: string;
  network: string;
}

/**
 * Executes a micro-donation on the Base Mainnet network.
 *
 * Dynamically routes to the correct project wallet by looking up
 * the category in app/data/projects.json — no more hardcoded addresses.
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

  // Dynamic routing: find a matching project for the requested category
  const normalizedTarget = target.toLowerCase();
  const project = projects.find(
    (p) => p.category === normalizedTarget || p.id === normalizedTarget || p.name.toLowerCase().includes(normalizedTarget)
  );

  if (!project) {
    return {
      success: false,
      error: `No project found for target: "${target}". Available categories: ecology, builders, desci, agents.`,
      target,
      amount: MICRO_AMOUNT,
      network: "Base",
    };
  }

  const toAddress = project.wallet;

  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log(`[ServerAction] Dynamic routing → Project: "${project.name}" (${project.id})`);
    console.log(`[ServerAction] Recipient Address: ${toAddress}`);
    console.log(`[ServerAction] Sending ${MICRO_AMOUNT} ETH on Base for target "${target}"...`);

    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: ethers.utils.parseEther(MICRO_AMOUNT),
    });

    console.log(`[ServerAction] TX broadcasted: ${tx.hash}`);

    // Wait for 1 confirmation to ensure the tx lands on-chain
    await tx.wait(1);

    console.log(`[ServerAction] TX confirmed: ${tx.hash} → ${project.name}`);

    return {
      success: true,
      txHash: tx.hash,
      target,
      projectName: project.name,
      amount: MICRO_AMOUNT,
      network: "Base",
    };
  } catch (err: any) {
    console.error("[ServerAction] Donation failed:", err);
    return {
      success: false,
      error: err.reason || err.message || "Transaction failed",
      target,
      projectName: project.name,
      amount: MICRO_AMOUNT,
      network: "Base",
    };
  }
}
