import dotenv from 'dotenv';
import { createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { celoAlfajores } from 'viem/chains';
import persona from './config/agent_persona.json';

// Load Environment
dotenv.config();

async function main() {
    console.log("🌱 Initializing OpenClaw Engine for:", persona.name);

    // 1. Setup Identity (The Body)
    if (!process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY missing in .env");
    
    const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}` as `0x${string}`);
    const client = createWalletClient({
        account,
        chain: celoAlfajores,
        transport: http(process.env.RPC_URL)
    }).extend(publicActions);

    const balance = await client.getBalance({ address: account.address });
    
    console.log(`🤖 Identity Loaded: ${account.address}`);
    console.log(`💰 Balance: ${balance.toString()} wei`);
    console.log(`🧠 Persona Loaded: ${persona.traits.join(", ")}`);

    // 2. Keep Alive (Heartbeat)
    setInterval(() => {
        console.log("❤️ Regen Eliza is thinking...");
    }, 60000); // Pulse every 60 seconds
}

main().catch((error) => {
    console.error("❌ Fatal Error:", error);
    process.exit(1);
});
