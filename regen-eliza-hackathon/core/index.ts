import dotenv from 'dotenv';
import persona from './config/agent_persona.json';

dotenv.config();

class RegenEliza {
    constructor() {
        console.log(`🌱 Initializing ${persona.name} System...`);
    }

    async wakeUp() {
        console.log(`🧠 Loading Persona: ${persona.bio}`);
        console.log("🔗 Connecting to Celo Alfajores...");
        
        // Simulating connection delay
        await new Promise(r => setTimeout(r, 1000));
        
        console.log("✅ System Online. Ready for commands.");
    }
}

// Start the Agent
const agent = new RegenEliza();
agent.wakeUp();
