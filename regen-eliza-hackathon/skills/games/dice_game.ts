export class DiceGame {
    async play(userAddress: string, betAmount: string) {
        console.log(`🎲 ${userAddress} is betting ${betAmount} cUSD...`);

        // 1. Roll the Dice (1-6)
        const roll = Math.floor(Math.random() * 6) + 1;

        // 2. Determine Winner (House vs Player)
        const won = roll > 3; // Win on 4, 5, 6

        if (won) {
            return `🎲 Rolled a ${roll}! YOU WIN! I am sending ${Number(betAmount) * 2} cUSD to your wallet.`;
        } else {
            return `🎲 Rolled a ${roll}. You lost this time. The House (Agent) keeps the pot.`;
        }
    }
}
