import { MiniPayGenerator } from './minipay_link_gen';

export class SocialExpenseManager {
    async processVoiceCommand(transcribedText: string) {
        console.log(`🗣️ Processing Voice Command: "${transcribedText}"`);

        // Scenario: "Split dinner of 100 dollars with Bob"
        const detectedAmount = 100;
        const detectedPerson = "0x123...BobWallet"; 
        
        console.log(`💰 Detected Split: ${detectedAmount} / 2`);
        
        const link = MiniPayGenerator.generateLink(detectedPerson, (detectedAmount / 2).toString());
        
        return {
            speechResponse: `Okay, I have sent a request for ${detectedAmount / 2} dollars to Bob.`,
            paymentLink: link
        };
    }
}
