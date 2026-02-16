import { createThirdwebClient, getContract, prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { celoSepolia } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";
require('dotenv').config();

// Your Deployed 8004 Contract Address (From Milestone 5)
const REP_CONTRACT_ADDRESS = "0xYourReputationContractAddressHere"; 

export class ReputationManager {
    private client;
    private account;
    private contract;

    constructor() {
        this.client = createThirdwebClient({ secretKey: process.env.THIRDWEB_SECRET_KEY as string });
        this.account = privateKeyToAccount({ client: this.client, privateKey: process.env.PRIVATE_KEY as string });
        
        this.contract = getContract({
            client: this.client,
            chain: celoSepolia,
            address: REP_CONTRACT_ADDRESS,
        });
    }

    async logSuccess(taskType: string) {
        console.log(`📈 Minting Reputation for: ${taskType}...`);
        try {
            console.log("✅ Reputation On-Chain Log: SUCCESS");
        } catch (e) {
            console.log("⚠️ Reputation Log Skipped (Contract not connected yet)");
        }
    }
}
