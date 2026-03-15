import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

// Define the supported categories
export type DonationCategory = "desci" | "eco" | "builders" | "agents";

export interface Recipient {
  address: string;
  weight: number; // For proportional distribution of the total amount
}

export interface FundedProject {
  name: string;
  description: string;
}

/**
 * Scaffolding for a service that distributes funds to a category of Web3 projects
 * using the x402 payment protocol on the Celo network.
 */
export class DonationService {
  private sdk: ThirdwebSDK;

  constructor(privateKey: string) {
    // Initialize standard Celo network using thirdweb
    this.sdk = ThirdwebSDK.fromPrivateKey(privateKey, "celo");
  }

  /**
   * Distribute funds to a specific category.
   * @param category The category as defined above
   * @param amount The total amount in stablecoins (e.g., USDT/USDm) to distribute
   * @returns A Promise resolving to an array of funded projects or false when it fails
   */
  async distributeFunds(category: DonationCategory, amount: number): Promise<FundedProject[] | false> {
    try {
      console.log(`Starting funding process for category: ${category} with amount: ${amount}`);

      // 1. Dynamically import the corresponding JSON file which contains the recipients
      const recipientsData = await import(`../data/${category}.json`);
      const recipients: any[] = recipientsData.default || [];

      if (!recipients || recipients.length === 0) {
        console.warn(`No recipients found for category: ${category}`);
        return false;
      }

      console.log(`Found ${recipients.length} recipients for ${category}. Select and set up x402 payload...`);

      // 2. Randomly select 1 to 3 projects to fund
      const numToSelect = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...recipients].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, numToSelect);

      const distributionPayload = selected.map(r => {
        const address = r.agent_wallet || r["Wallet Address"] || r.wallet_address || r.Wallet || "0x0000000000000000000000000000000000000000";
        const share = amount / selected.length;
        
        return {
          to: address,
          amount: ethers.utils.parseUnits(share.toString(), 18) // Assuming 18 decimals like standard ERC20
        };
      });

      console.log("x402 Payment Payload Prepared:", distributionPayload);

      // 3. Execute the batch transaction or interact with the x402 distribution contract
      // const tx = await this.sdk.wallet.sendRawTransaction({...})
      console.log("Distributing stablecoins (USDT/USDm) on Celo network...");

      // Simulate a successful transaction
      const fundedProjects: FundedProject[] = selected.map(r => ({
        name: r.name || r.Name || r["Project Name"] || "Unknown Project",
        description: r.description || r.Description || "No description provided."
      }));

      return fundedProjects;
    } catch (error) {
      console.error(`Failed to distribute funds for category ${category}:`, error);
      return false;
    }
  }
}
