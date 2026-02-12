export type Intent = 'TRANSFER' | 'SWAP' | 'SPLIT_BILL' | 'CHAT' | 'UNKNOWN';

export class IntentClassifier {
    
    // Simple keyword matching for MVP (Will upgrade to LLM later)
    async classify(userMessage: string): Promise<Intent> {
        const msg = userMessage.toLowerCase();

        if (msg.includes('send') || msg.includes('pay')) return 'TRANSFER';
        if (msg.includes('swap') || msg.includes('change')) return 'SWAP';
        if (msg.includes('split') || msg.includes('bill')) return 'SPLIT_BILL';
        
        return 'CHAT';
    }
}
