export class DiceGame {
    async play(userAddress: string, betAmount: string) {
        console.log(`🎲 ${userAddress} is betting ${betAmount} cUSD...`);
        const roll = Math.floor(Math.random() * 6) + 1;
        const won = roll > 3; 
        
        if (won) {
            return `🎲 Rolled a ${roll}! YOU WIN! I am sending ${Number(betAmount) * 2} cUSD to your wallet.`;
        } else {
            return `🎲 Rolled a ${roll}. You lost this time. The House (Agent) keeps the pot.`;
        }
    }
}
