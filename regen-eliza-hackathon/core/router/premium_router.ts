import { PaymentGate } from "../../skills/payment-gate";
import { RemittanceRouter } from "../../skills/remittance-router";

export class PremiumAgentRouter {
    private gate: PaymentGate;
    private remittance: RemittanceRouter;

    constructor() {
        this.gate = new PaymentGate();
        this.remittance = new RemittanceRouter();
    }

    async handleRequest(userText: string, userAddress: string) {
        // 1. Check if they want to use the Premium Remittance feature
        if (userText.includes("send") || userText.includes("remit")) {
            
            // 2. Gate the feature!
            const isPaid = await this.gate.verifyPayment(userAddress);
            
            if (!isPaid) {
                const link = await this.gate.createPaymentLink("Cross-Border Remittance", "0.5");
                return `⚠️ This is a Premium Feature. Please pay 0.5 CELO to proceed: ${link}`;
            }

            // 3. If paid, execute the logic
            return this.remittance.processTransfer(userText);
        }

        return "I can only help with Premium Remittances right now.";
    }
}
