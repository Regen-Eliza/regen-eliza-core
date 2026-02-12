const { generateKeyPairSync } = require("crypto");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🔐 Generating Agent Identity (Ed25519)...");

    // 1. Generate the Keypair
    const { publicKey, privateKey } = generateKeyPairSync("ed25519");

    // 2. Convert to format SelfClaw expects (SPKI / PKCS8)
    const publicKeySpki = publicKey.export({ type: "spki", format: "der" }).toString("base64");
    const privateKeyPkcs8 = privateKey.export({ type: "pkcs8", format: "der" }).toString("base64");

    console.log("\n✅ IDENTITY GENERATED SUCCESSFULLY!");
    console.log("---------------------------------------------------");
    console.log("🔑 Public Key (COPY THIS FOR WEBSITE):");
    console.log(publicKeySpki); 
    console.log("---------------------------------------------------");

    // 3. Save to .env file
    const envPath = path.resolve(__dirname, "../.env");
    
    // Check if .env exists, if not create it
    if (!fs.existsSync(envPath)) {
        fs.writeFileSync(envPath, "");
    }

    const envContent = `
# SelfClaw Agent Identity
AGENT_PUBLIC_KEY=${publicKeySpki}
AGENT_PRIVATE_KEY=${privateKeyPkcs8}
`;

    fs.appendFileSync(envPath, envContent);
    console.log("💾 Keys have been saved to your .env file.");
}

main();
