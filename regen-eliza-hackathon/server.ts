import express from "express";
import cors from "cors";
import { PremiumAgentRouter } from "./core/router/premium_router";
import { FinancialRouter } from "./core/router/financial_router"; // Import the new skill

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize both brains
const premiumAgent = new PremiumAgentRouter();
const financialAgent = new FinancialRouter();

app.use(cors());
app.use(express.json());
app.use(express.static("public")); 

app.post("/api/chat", async (req, res) => {
    try {
        const { message, userAddress } = req.body;
        console.log(`📩 Received: "${message}" from ${userAddress}`);
        
        let response;
        const lowerMsg = message.toLowerCase();

        // ROUTING LOGIC: Decide which agent handles the request
        if (lowerMsg.includes("send") || lowerMsg.includes("pay") || lowerMsg.includes("transfer")) {
            // Route to Financial Brain (Voice Wallet)
            response = await financialAgent.handle(message);
        } else {
            // Route to Standard/Premium Brain (Chat & Remittance)
            response = await premiumAgent.handleRequest(message, userAddress || "0x000");
        }
        
        res.json({ reply: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Agent brain overheat!" });
    }
});

app.listen(port, () => {
    console.log(`🚀 Regen Eliza Server running on port ${port}`);
});
