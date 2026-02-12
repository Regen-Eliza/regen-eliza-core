import { parseEther } from 'viem';

export class MiniPayGenerator {
    
    /**
     * Generates a deeplink for Celo MiniPay
     * Format: celo://wallet/pay?address=0x...&amount=10&currency=cUSD
     */
    static generateLink(recipient: string, amount: string, currency: 'cUSD' | 'cEUR' = 'cUSD'): string {
        const baseUrl = "https://valoraapp.com/pay";
        // In a real app, this would be a deep link. For the hackathon web demo, we use a web fallback.
        return `${baseUrl}?address=${recipient}&amount=${amount}&currencyCode=${currency}`;
    }

    static generateSplitLinks(total: number, participants: string[]): string[] {
        const splitAmount = (total / (participants.length + 1)).toFixed(2);
        return participants.map(p => this.generateLink(p, splitAmount));
    }
}
