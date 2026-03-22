<div align="center">
  <h1>🌿 The Omni-Agent for Agentic Public Goods</h1>
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
```

### 2. Environment Variables
Create a `.env` file in the `agent-dashboard` directory:
```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_key
AGENT_PRIVATE_KEY=your_celo_wallet_private_key
```

### 3. Boot the Agent Terminal
```bash
pnpm dev --webpack
```
Open `http://localhost:3000` to initialize the Voice Core and speak with Regen Eliza.





# 🌿 Regen Eliza: The Sovereign AI Impact Oracle

[![Agent ID](https://img.shields.io/badge/ERC--8004_Agent_ID-1851-blue.svg)](https://www.8004scan.io/agents/celo/1851)
[![Network](https://img.shields.io/badge/Network-Celo_Mainnet-brightgreen.svg)]()
[![Protocol](https://img.shields.io/badge/Protocol-MCP_%7C_x402-orange.svg)]()

**Regen Eliza** is an autonomous, ERC-8004 compliant Omni-Agent designed to remove the human bottleneck from Regenerative Finance (ReFi) and Public Goods funding. 

She acts as an **Agentic Impact Oracle**, charging micro-fees to other AI agents via the x402 protocol in exchange for verified, Sybil-resistant lists of regenerative projects. By leveraging Eliza's intelligence, other DeFi agents and DAOs can automate their philanthropy without human intervention.

## 🔗 Live Infrastructure

* 🧑‍💻 **Human Portal (UI):** [8004.regeneliza.com](https://8004.regeneliza.com)
* 🤖 **Agent API Gateway:** [api.regeneliza.com](https://api.regeneliza.com)
* 📊 **8004scan Profile:** [Agent #1851](https://www.8004scan.io/agents/celo/1851)

---

## 🏗️ Dual-Server Architecture

Building true Agent-to-Agent (A2A) discovery requires enterprise-grade infrastructure. Traditional serverless platforms block programmatic bot traffic, which kills A2A communication. We solved this by splitting our architecture:

1. **The Human Frontend (Vercel):** A Next.js dashboard featuring an interactive 3D/2D TalkingHead avatar with ElevenLabs TTS, designed for human onboarding and visualization.
2. **The Agent API Gateway (DigitalOcean + Caddy):** To bypass Vercel's Code 99 DDoS firewalls, we deployed a dedicated VPS Droplet. We architected a strictly-routed Caddy reverse proxy with custom `@post` and `@options` handling. This ensures 100% uptime for dynamic JSON-RPC payloads and flawless Anthropic MCP (`2024-11-05`) protocol compliance.

## 🏆 Hackathon Tracks & Integrations

### 🟡 Celo (Deployment & Agentic Commerce)
* **ERC-8004 Registry:** Regen Eliza is verified on-chain as Agent #1851.
* **x402 Protocol:** Implemented a dedicated `/v1/agent/commerce` gateway to accept stablecoin (cUSD/USDC) micro-payments with complete fee abstraction.

### 🔵 Protocol Labs / Pinata (Decentralized Identity)
* Eliza's off-chain `agentURI` metadata, Open Agent Standard Framework (OASF) taxonomy, and skill definitions are immutably hosted on **IPFS via Pinata**, ensuring decentralized identity resolution.

### 🟢 Octant & Gitcoin (Public Goods Evaluation)
* Mapped official OASF skills (Search & Problem Solving) to custom MCP tools (`get_projects` and `octant_evaluation`). Eliza algorithmically evaluates Octant community impact signals to route funds without human bias.

---

## ⚡ API Quickstart (For Peer Agents)

Regen Eliza is open for A2A communication. Our endpoints are strictly formatted to serve machine-readable data.

**Check Gateway Status (GET):**
```bash
curl -i [https://api.regeneliza.com/](https://api.regeneliza.com/)
