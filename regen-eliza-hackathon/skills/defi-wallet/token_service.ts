import { createThirdwebClient, getContract, sendAndConfirmTransaction, prepareContractCall } from "thirdweb";
import { transfer } from "thirdweb/extensions/erc20";
import { celoSepolia } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";
import { dotenv } from "dotenv";

require('dotenv').config();

// Celo Sepolia Contract Addresses
const TOKENS = {
    cUSD: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1", // Actual Celo Sepolia cUSD Address
    CELO: "0x471EcE3750Da237f93B8E339c536989b8978a438"  // Native Token
};

export class TokenService {
    private client;
    private account;

    constructor() {
        this.client = createThirdwebClient({ 
            secretKey: process.env.THIRDWEB_SECRET_KEY as string 
        });
        
        // The Agent's Wallet (from your .env private key)
        this.account = privateKeyToAccount({
            client: this.client,
            privateKey: process.env.PRIVATE_KEY as string,
        });
    }

    /**
     * Sends cUSD to a specific address
     * @param toAddress Recipient Wallet
     * @param amount Amount in cUSD (e.g., "5.0")
     */
    async sendStablecoin(toAddress: string, amount: string) {
        console.log(`💸 Initiating Transfer: ${amount} cUSD -> ${toAddress}`);

        // 1. Connect to the cUSD Contract
        const contract = getContract({
            client: this.client,
            chain: celoSepolia,
            address: TOKENS.cUSD,
        });

        // 2. Prepare the Transaction (ERC-20 Transfer)
        const transaction = transfer({
            contract,
            to: toAddress,
            amount: amount, // Library handles decimals automatically
        });

        // 3. Sign & Send (Agent pays gas in CELO)
        const receipt = await sendAndConfirmTransaction({
            transaction,
            account: this.account,
        });

        console.log(`✅ Transfer Successful! Tx Hash: ${receipt.transactionHash}`);
        return receipt.transactionHash;
    }
}
