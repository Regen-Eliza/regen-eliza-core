export class MiniPayGenerator {
    static generateLink(recipient: string, amount: string, currency: 'cUSD' | 'cEUR' = 'cUSD'): string {
        const baseUrl = "https://valoraapp.com/pay";
        return `${baseUrl}?address=${recipient}&amount=${amount}&currencyCode=${currency}`;
    }

    static generateSplitLinks(total: number, participants: string[]): string[] {
        const splitAmount = (total / (participants.length + 1)).toFixed(2);
        return participants.map(p => this.generateLink(p, splitAmount));
    }
}
