import { MentoService } from "./mento_swap";

export class RemittanceRouter {
    private mento: MentoService;

    constructor() {
        this.mento = new MentoService();
    }

    async processTransfer(text: string) {
        console.log(`✈️ Analyze Remittance: "${text}"`);

        const amountMatch = text.match(/(\d+)/);
        const amount = amountMatch ? parseInt(amountMatch[0]) : 0;
        
        if (amount === 0) return "I could not figure out how much to send.";

        const targetCurrency = text.toLowerCase().includes("euro") ? 'cEUR' : 'cREAL';
        
        const convertedAmount = await this.mento.swapTokens(amount, 'cUSD', targetCurrency);
        
        return `Done. I swapped ${amount} cUSD into ${convertedAmount} ${targetCurrency} and sent it.`;
    }
}
