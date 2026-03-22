import { transferService } from '../services/transferService';
import { swapService } from '../services/swapService';
import { DonationService } from '../services/donationService';
import contacts from '../data/contacts.json';

const defaultKey = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
const privateKey = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_REGEN_ELIZA_PRIVATE_KEY) || defaultKey;
const donationService = new DonationService(privateKey);

// Celo token addresses for the hackathon demo
const TOKEN_ADDRESSES: Record<string, string> = {
  "USDC": "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
  "USDT": "0x48065fbBE25f71C9282ddf5e1cD6D6A88248A9df",
  "USDC": "0x765DE816845861e75A25fCA122bb6898B8B1282a",
};

/* ─── Levenshtein distance for fuzzy matching ─── */
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/**
 * Fuzzy-match a spoken name against contacts.json.
 * Returns the best matching contact, or null if nothing is close enough.
 * Threshold: Levenshtein distance <= 40% of the longer string length.
 */
function fuzzyMatchContact(spoken: string): typeof contacts[number] | null {
  const input = spoken.toLowerCase().trim();
  let bestContact: typeof contacts[number] | null = null;
  let bestScore = Infinity;

  for (const c of contacts) {
    // Compare against all known aliases
    const candidates = [
      c.name.toLowerCase(),
      c.name.replace('.eth', '').toLowerCase(),
      (c as any).spokenName?.toLowerCase(),
    ].filter(Boolean) as string[];

    for (const candidate of candidates) {
      // Exact match — instant return
      if (candidate === input) return c;

      const dist = levenshtein(input, candidate);
      const maxLen = Math.max(input.length, candidate.length);
      const threshold = Math.ceil(maxLen * 0.4); // 40% tolerance

      if (dist < bestScore && dist <= threshold) {
        bestScore = dist;
        bestContact = c;
      }
    }
  }

  if (bestContact) {
    console.log(`[IntentParser] Fuzzy matched "${spoken}" → ${bestContact.name} (distance: ${bestScore})`);
  }
  return bestContact;
}

/**
 * Parses a natural language intent.
 * Master router triggering donationService, swapService, or transferService.
 *
 * Supports relaxed patterns:
 *   "send 10 USDC to ottox"
 *   "Send $10 to ottox"
 *   "give money to ozkite"
 *   "send money to Orthodox"   → fuzzy resolves to ottox.eth
 *   "transfer 5 to vitalik"
 */
export async function parseIntentAndExecuteTransfer(voiceCommand: string): Promise<any> {
  console.log(`[IntentParser] Processing command: "${voiceCommand}"`);
  const transcript = voiceCommand.toLowerCase().trim();

  try {
    // ─── 1. SWAP intent ───
    if (transcript.includes("swap") || transcript.includes("trade") || transcript.includes("exchange")) {
      const match = transcript.match(/(?:swap|trade|exchange)\s+([\d.]+)\s+(usdc|usdt|cusd)\s+(?:to|for|into)\s+(usdc|usdt|cusd)/i);
      if (match) {
        const amount = match[1];
        const fromToken = match[2].toUpperCase();
        const toToken = match[3].toUpperCase();
        console.log(`[IntentParser] Swap intent: ${amount} ${fromToken} → ${toToken}`);
        return { type: "swap", amount, fromToken, toToken, needsConfirmation: true };
      }
      // Default swap: 1 USDC → USDT
      console.log(`[IntentParser] Swap intent (default): 1 USDC → USDT`);
      return { type: "swap", amount: "1", fromToken: "USDC", toToken: "USDT", needsConfirmation: true };
    }

    // ─── 2. DONATION intent ───
    if (transcript.includes("fund") || transcript.includes("donate") || transcript.includes("support")) {
      let category: "desci" | "eco" | "builders" | "agents" = "eco";
      if (transcript.includes("desci")) category = "desci";
      if (transcript.includes("builder")) category = "builders";
      if (transcript.includes("agent")) category = "agents";

      const projects = await donationService.distributeFunds(category, 100);
      return { type: "donate", projects };
    }

    // ─── 3. TRANSFER / PAYMENT intent (relaxed parsing) ───

    // Pattern A: "send <amount> <token> to <name>"
    const patternA = transcript.match(/(?:send|transfer|give|pay)\s+\$?([\d.]+)\s+(usdc|usdt|cusd)\s+(?:to|for)\s+(.+)/i);
    // Pattern B: "send $<amount> to <name>" or "send <amount> to <name>" (no token — default USDC)
    const patternB = transcript.match(/(?:send|transfer|give|pay)\s+\$?([\d.]+)\s+(?:to|for)\s+(.+)/i);
    // Pattern C: "send money to <name>" or "give money to <name>" (no amount — default $10 USDC)
    const patternC = transcript.match(/(?:send|transfer|give|pay)\s+(?:money|funds|tokens?|crypto)\s+(?:to|for)\s+(.+)/i);

    let amount: string;
    let tokenSymbol: string;
    let spokenContact: string;

    if (patternA) {
      amount = patternA[1];
      tokenSymbol = patternA[2].toUpperCase();
      spokenContact = patternA[3].trim();
    } else if (patternB) {
      amount = patternB[1];
      tokenSymbol = "USDC"; // default stablecoin
      spokenContact = patternB[2].trim();
    } else if (patternC) {
      amount = "10"; // default demo amount
      tokenSymbol = "USDC";
      spokenContact = patternC[1].trim();
    } else {
      throw new Error(
        `Could not parse intent from: "${voiceCommand}". ` +
        `Try: "Send 10 USDC to ottox" or "give money to vitalik"`
      );
    }

    // ─── Resolve contact (exact → fuzzy) ───
    const spokenLower = spokenContact.toLowerCase();

    // Try exact match first
    let contact = contacts.find(c =>
      c.name.toLowerCase() === spokenLower ||
      c.name.replace('.eth', '').toLowerCase() === spokenLower ||
      (c as any).spokenName?.toLowerCase() === spokenLower
    );

    // Fall back to fuzzy matching
    if (!contact) {
      console.log(`[IntentParser] No exact match for "${spokenContact}", trying fuzzy match...`);
      contact = fuzzyMatchContact(spokenContact) || undefined;
    }

    if (!contact) {
      throw new Error(
        `Could not resolve contact "${spokenContact}". ` +
        `Available contacts: ${contacts.map(c => c.name).join(', ')}`
      );
    }

    const contactName = contact.name;
    const tokenAddress = TOKEN_ADDRESSES[tokenSymbol];

    if (!tokenAddress) {
      throw new Error(`Unsupported token: ${tokenSymbol}. Supported: ${Object.keys(TOKEN_ADDRESSES).join(', ')}`);
    }

    console.log(`[IntentParser] Intent parsed. Preparing transfer to: ${contactName}`);
    console.log(`[IntentParser] Amount: ${amount} ${tokenSymbol}, Wallet: ${contact.walletAddress}`);

    // Execute the transfer
    const result = await transferService.executeTransfer(contactName, amount, tokenAddress);

    return {
      type: "transfer",
      ...result,
      symbol: tokenSymbol,
      resolvedAlias: contactName,
    };
  } catch (error) {
    console.error(`[IntentParser] Error:`, error);
    throw error;
  }
}
