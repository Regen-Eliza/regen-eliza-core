import express from "express";
import cors from "cors";
import { PremiumAgentRouter } from "./core/router/premium_router";
import { FinancialRouter } from "./core/router/financial_router"; 
import { ReputationService } from "./skills/reputation/erc8004_service";

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3005;

// Initialize All Systems
const premiumAgent = new PremiumAgentRouter();
const financialAgent = new FinancialRouter();
const reputation = new ReputationService();

app.use(cors());
app.use(express.json());
app.use(express.static("public")); 

app.post("/api/chat", async (req, res) => {
    try {
        const { message, userAddress } = req.body;
        console.log(`📩 Received: "${message}"`);

        let response;
        const lowerMsg = message.toLowerCase();

        // ROUTER LOGIC
        if (lowerMsg.includes("pay") || (lowerMsg.includes("send") && lowerMsg.includes("0x"))) {
            response = await financialAgent.handle(message);
            reputation.mineReputation("finance_transfer");
        } else {
            response = await premiumAgent.handleRequest(message, userAddress || "0x000");
             reputation.mineReputation("general_interaction");
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
