import { TokenService } from "../../skills/defi-wallet/token_service";
import { VoiceParser } from "../intent_parser";

export class FinancialRouter {
    private tokens: TokenService;
    private parser: VoiceParser;

    constructor() {
        this.tokens = new TokenService();
        this.parser = new VoiceParser();
    }

    async handle(command: string) {
        const intent = this.parser.parse(command);
        if (intent.type === "SEND_CRYPTO") {
            if (!intent.recipient) return "I heard the amount, but who should I send it to? (Missing 0x address)";
            try {
                const txHash = await this.tokens.sendStablecoin(intent.recipient, intent.amount);
                return `Done! I sent ${intent.amount} cUSD. View on Explorer: https://sepolia.celoscan.io/tx/${txHash}`;
            } catch (error) {
                console.error(error);
                return "I tried to send the funds, but the blockchain transaction failed. Do I have enough CELO for gas?";
            }
        }
        return "I am not sure how to handle that financial command yet.";
    }
}
