import { transferService } from '../services/transferService';

// Celo token addresses for the hackathon demo
const TOKEN_ADDRESSES: Record<string, string> = {
  "USDC": "0xcebA9300f2b948710d2653dD7B07f33A8B32118C", // Celo USDC
  "USDT": "0x48065fbBE25f71C9282ddf5e1cD6D6A88248A9df", // Celo USDT
  "cUSD": "0x765DE816845861e75A25fCA122bb6898B8B1282a", // Celo Dollar
};

/**
 * Parses a natural language intent like "Send 10 USDC to Alice"
 * Extracts the amount, token, and contact name, then fires the transfer.
 */
export async function parseIntentAndExecuteTransfer(voiceCommand: string): Promise<any> {
  try {
    console.log(`[IntentParser] Processing command: "${voiceCommand}"`);
    
    // Very simple regex for parsing "Send [Amount] [Token] to [Contact]"
    const match = voiceCommand.match(/send ([\d\.]+) (usdc|usdt|cusd) to (\w+)/i);
    
    if (!match) {
      throw new Error("Could not parse intent. Expected format: 'Send 10 USDC to Alice'");
    }

    const amount = match[1];
    const tokenSymbol = match[2].toUpperCase();
    const contactName = match[3];

    const tokenAddress = TOKEN_ADDRESSES[tokenSymbol];
    
    if (!tokenAddress) {
      throw new Error(`Unsupported token: ${tokenSymbol}`);
    }

    console.log(`[IntentParser] Extracted - Amount: ${amount}, Token: ${tokenSymbol}, Contact: ${contactName}`);
    
    // Pass extracted params to the TransferService
    const result = await transferService.executeTransfer(contactName, amount, tokenAddress);
    
    return {
      ...result,
      symbol: tokenSymbol
    };
  } catch (error) {
    console.error(`[IntentParser] Error:`, error);
    throw error;
  }
}
