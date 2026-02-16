import { PaymentGate } from "../../skills/payment-gate";
import { RemittanceRouter } from "../../skills/remittance-router";
import { DiceGame } from "../../skills/games/dice_game";

export class PremiumAgentRouter {
    private gate: PaymentGate;
    private remittance: RemittanceRouter;
    private game: DiceGame;

    constructor() {
        this.gate = new PaymentGate();
        this.remittance = new RemittanceRouter();
        this.game = new DiceGame();
    }

    async handleRequest(userText: string, userAddress: string) {
        const lower = userText.toLowerCase();

        // GAME LOGIC
        if (lower.includes("bet") || lower.includes("game") || lower.includes("roll")) {
            return this.game.play(userAddress, "5");
        }

        // PREMIUM REMITTANCE
        if (lower.includes("send") || lower.includes("remit")) {
            const isPaid = await this.gate.verifyPayment(userAddress);
            if (!isPaid) {
                const link = await this.gate.createPaymentLink("Cross-Border Remittance", "0.5");
                return `⚠️ This is a Premium Feature. Please pay 0.5 CELO to proceed: ${link}`;
            }
            return this.remittance.processTransfer(userText);
        }

        return "I can help with Remittances, Payments, and Games (Try saying 'Let's bet').";
    }
}
