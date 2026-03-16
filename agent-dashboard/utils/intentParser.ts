import { transferService } from '../services/transferService';
import { swapService } from '../services/swapService';
import { DonationService } from '../services/donationService';
import contacts from '../data/contacts.json';

const defaultKey = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
const privateKey = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_REGEN_ELIZA_PRIVATE_KEY) || defaultKey;
const donationService = new DonationService(privateKey);

// Celo token addresses for the hackathon demo
const TOKEN_ADDRESSES: Record<string, string> = {
  "USDC": "0xcebA9300f2b948710d2653dD7B07f33A8B32118C", // Celo USDC
  "USDT": "0x48065fbBE25f71C9282ddf5e1cD6D6A88248A9df", // Celo USDT
  "cUSD": "0x765DE816845861e75A25fCA122bb6898B8B1282a", // Celo Dollar
};

/**
 * Parses a natural language intent
 * Master router triggering donationService, swapService, or transferService.
 */
export async function parseIntentAndExecuteTransfer(voiceCommand: string): Promise<any> {
  console.log(`[IntentParser] Processing command: "${voiceCommand}"`);
  const transcript = voiceCommand.toLowerCase();

  try {
    // 1. Check for SWAP (Uniswap on Celo)
    if (transcript.includes("swap") || transcript.includes("trade") || transcript.includes("exchange")) {
      const match = transcript.match(/(?:swap|trade|exchange) ([\d\.]+) (usdc|usdt|cusd) (?:to|for|into) (usdc|usdt|cusd)/i);
      if (match) {
        const amount = match[1];
        const fromToken = match[2].toUpperCase();
        const toToken = match[3].toUpperCase();
        const receipt = await swapService.executeSwap(amount, fromToken, toToken);
        return { type: "swap", receipt, amount, fromToken, toToken };
      }
      // Demo fallback: swap 1 USDC to USDT on Celo via Uniswap
      const receipt = await swapService.executeSwap("1", "USDC", "USDT");
      return { type: "swap", receipt, amount: "1", fromToken: "USDC", toToken: "USDT" };
    }

    // 2. Check for DONATIONS
    if (transcript.includes("fund") || transcript.includes("donate") || transcript.includes("support")) {
      let category: "desci" | "eco" | "builders" | "agents" = "eco";
      if (transcript.includes("desci")) category = "desci";
      if (transcript.includes("builder")) category = "builders";
      if (transcript.includes("agent")) category = "agents";

      const projects = await donationService.distributeFunds(category, 100);
      return { type: "donate", projects };
    }

    // 3. Fallback to DIRECT PAYMENTS / TRANSFER
    const match = transcript.match(/send ([\d\.]+) (usdc|usdt|cusd) to (.+)/i);
    if (!match) {
      throw new Error("Could not parse intent. Expected format: 'Send 10 USDC to Alice'");
    }

    const amount = match[1];
    const tokenSymbol = match[2].toUpperCase();
    const spokenContact = match[3].trim().toLowerCase();

    const contact = contacts.find(c => 
      c.name.toLowerCase() === spokenContact || 
      c.name.replace('.eth', '').toLowerCase() === spokenContact ||
      (c as any).spokenName?.toLowerCase() === spokenContact
    );

    if (!contact) {
      throw new Error(`Could not find contact for '${match[3].trim()}'`);
    }

    const contactName = contact.name;
    const tokenAddress = TOKEN_ADDRESSES[tokenSymbol];
    
    if (!tokenAddress) {
      throw new Error(`Unsupported token: ${tokenSymbol}`);
    }

    console.log(`[IntentParser] Extracted - Amount: ${amount}, Token: ${tokenSymbol}, Contact: ${contactName}`);
    
    // Pass extracted params to the TransferService
    const result = await transferService.executeTransfer(contactName, amount, tokenAddress);
    
    return {
      type: "transfer",
      ...result,
      symbol: tokenSymbol
    };
  } catch (error) {
    console.error(`[IntentParser] Error:`, error);
    throw error;
  }
}
