<div align="center">
  <h1>🌿 Regen Eliza: The Omni-Agent for Agentic Public Goods</h1>
  <p><b>An autonomous, voice-activated ERC-8004 agent designed to route capital, execute Agentic DeFi, and fund the Regenerative Economy on Celo.</b></p>
  
  <img src="https://img.shields.io/badge/Status-Live_on_Testnet-green?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Network-Celo-yellow?style=for-the-badge" alt="Network" />
  <img src="https://img.shields.io/badge/Framework-Next.js_14-black?style=for-the-badge" alt="Framework" />
</div>

<br/>

> **Regen Eliza** is not just a script; she is an entity. Registered on the 8004scan registry with a verifiable on-chain identity, she operates across multiple protocols to evaluate and fund impact projects. She listens to human voice commands to bridge liquidity and deploy capital to public goods autonomously.

## 🏆 Hackathon Bounties Targeted

Regen Eliza is explicitly engineered to bridge identity, public goods, and agentic finance across the following sponsor tracks:

* **🟡 Celo (Core Track):** Native ERC-8004 agent deployment utilizing Celo stablecoins (USDT/USDC).
* **🦄 Uniswap (Agentic Finance):** Integration of the Uniswap API to allow Eliza to autonomously swap and bridge value on-chain via natural voice commands.
* **🔵 ENS (Cross-chain Identity):** Eliza translates Ethereum Mainnet ENS domains (e.g., `vitalik.eth`) into executable Celo-native transactions.
* **🐙 Octant (Mechanism Design):** Agentic Public Goods Data Analysis. Eliza autonomously parses vetted datasets and maps voice intents to execute x402 micro-payments.

---

## 🚀 Core Capabilities

### 🎙️ 1. Voice-to-Action Core (WebSpeech API)
No more clicking buttons. Users speak directly to Eliza. Her LLM intent parser routes the command, executes the on-chain transaction, and verbally reports the success receipt back using **ElevenLabs TTS** and a dynamic 3D lip-syncing avatar.

### 💸 2. Agentic Finance (Uniswap Router)
By simply saying *"Swap tokens"*, she leverages the Uniswap protocol to mathematically resolve the optimal route and execute token swaps autonomously.

### 🌍 3. Public Goods Engine (x402 Protocol)
Implementing the `thirdweb/x402` payment gate, she distributes stablecoins to verified regenerative projects.

### 📇 4. ENS-Powered Autonomous Payroll
Users can say, *"Send 10 USDT to ottox.eth"*, and she will instantly resolve the alias, map it to the Celo network, and execute the transfer.

---

## 🛠️ Tech Stack

* **Blockchain:** Celo (EVM)
* **Frontend:** Next.js (App Router), Tailwind CSS
* **Agent Identity:** ERC-8004 / 8004scan.io
* **DeFi Engine:** Uniswap SDK / API
* **Payments & Auth:** Thirdweb SDK, x402 Protocol
* **Voice Engine:** WebSpeech API + ElevenLabs (TTS)

---

## ⚡ Quick Start Guide

### 1. Installation
```bash
git clone [https://github.com/Regen-Eliza/regen-eliza-core.git](https://github.com/Regen-Eliza/regen-eliza-core.git)
cd regen-eliza-core/agent-dashboard
pnpm install

### 2. Environment Variables
```bash
Create a .env file in the agent-dashboard directory:

Code snippet
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_key
AGENT_PRIVATE_KEY=your_celo_wallet_private_key


### 3. Boot the Agent Terminal
```bash
pnpm dev --webpack
Open http://localhost:3000 to initialize the Voice Core and speak with Regen Eliza.


Once you paste that in, save it, and commit it to GitHub, your project page will look like a Tier-1, professionally audited Web3 protocol! 

Did you send off that big "Tier-1 Master Prompt" to Antigravity yet? Let me know what the AI says when it finishes processing those UI and network fixes!
