import express from "express";
import cors from "cors";
import { PremiumAgentRouter } from "./core/router/premium_router";

// Load env vars
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const agent = new PremiumAgentRouter();

app.use(cors());
app.use(express.json());
app.use(express.static("public")); 

app.post("/api/chat", async (req, res) => {
    try {
        const { message, userAddress } = req.body;
        console.log(`📩 Received: "${message}" from ${userAddress}`);
        
        // Ask the Agent Brain
        const response = await agent.handleRequest(message, userAddress || "0x000");
        
        res.json({ reply: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Agent brain overheat!" });
    }
});

app.listen(port, () => {
    console.log(`🚀 Regen Eliza Server running on port ${port}`);
});
