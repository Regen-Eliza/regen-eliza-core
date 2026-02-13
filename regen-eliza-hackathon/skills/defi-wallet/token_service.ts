import { createThirdwebClient, getContract, sendAndConfirmTransaction, prepareContractCall } from "thirdweb";
import { transfer } from "thirdweb/extensions/erc20";
import { celoSepolia } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";
require('dotenv').config();

const TOKENS = {
    cUSD: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1", 
    CELO: "0x471EcE3750Da237f93B8E339c536989b8978a438"
};

export class TokenService {
    private client;
    private account;

    constructor() {
        this.client = createThirdwebClient({ secretKey: process.env.THIRDWEB_SECRET_KEY as string });
        this.account = privateKeyToAccount({ client: this.client, privateKey: process.env.PRIVATE_KEY as string });
    }

    async sendStablecoin(toAddress: string, amount: string) {
        console.log(`💸 Initiating Transfer: ${amount} cUSD -> ${toAddress}`);
        const contract = getContract({ client: this.client, chain: celoSepolia, address: TOKENS.cUSD });
        const transaction = transfer({ contract, to: toAddress, amount: amount });
        const receipt = await sendAndConfirmTransaction({ transaction, account: this.account });
        console.log(`✅ Transfer Successful! Tx Hash: ${receipt.transactionHash}`);
        return receipt.transactionHash;
    }
}
