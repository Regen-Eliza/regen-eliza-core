import { ReputationService } from "../skills/reputation/erc8004_service";

async function main() {
    const service = new ReputationService();
    
    console.log("🚀 Starting Agent Registration Protocol...");
    
    // Registering 'Regen Eliza' on the Celo Network
    await service.registerAgent("Regen Eliza", "regen-eliza.celo");
    
    console.log("🎉 Registration Complete. View on 8004scan.io");
}

main().catch(console.error);
