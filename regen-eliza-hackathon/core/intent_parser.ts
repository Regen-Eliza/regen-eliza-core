export class VoiceParser {
    
    parse(text: string) {
        const lower = text.toLowerCase();

        // Detect "Send" Intent
        if (lower.includes("send") || lower.includes("pay") || lower.includes("transfer")) {
            return this.extractPaymentDetails(text);
        }

        return { type: "UNKNOWN", raw: text };
    }

    private extractPaymentDetails(text: string) {
        // Regex to find amount (number) and simple address (0x...)
        const amountMatch = text.match(/(\d+(\.\d+)?)/);
        const addressMatch = text.match(/(0x[a-fA-F0-9]{40})/);

        if (!amountMatch) return { type: "ERROR", message: "Could not find amount" };

        return {
            type: "SEND_CRYPTO",
            amount: amountMatch[0],
            token: "cUSD",
            recipient: addressMatch ? addressMatch[0] : null
        };
    }
}
