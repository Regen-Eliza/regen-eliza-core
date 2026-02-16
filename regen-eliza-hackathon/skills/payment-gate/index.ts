import { createThirdwebClient } from "thirdweb";
require('dotenv').config();

export class PaymentGate {
    private client;

    constructor() {
        this.client = createThirdwebClient({ 
            secretKey: process.env.THIRDWEB_SECRET_KEY as string 
        });
    }

    async createPaymentLink(serviceName: string, price: string): Promise<string> {
        console.log(`🔒 Locking ${serviceName} behind x402 Gateway...`);
        const recipient = process.env.AGENT_PUBLIC_KEY || "0x0000000000000000000000000000000000000000";
        return `https://checkout.x402.com/pay?to=${recipient}&amount=${price}&chain=celo`;
    }

    async verifyPayment(userAddress: string): Promise<boolean> {
        console.log(`🔍 Verifying payment status for ${userAddress}...`);
        return true; // Mocked for Hackathon
    }
}
