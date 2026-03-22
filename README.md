<div align="center">
  <h1>🌿 The Omni-Agent for Agentic Public Goods</h1>
  <p><b>An autonomous ERC-8004 agent designed to route capital, execute Agentic DeFi, and programmatically fund the Regenerative Economy on Celo.</b></p>
  
  <img src="https://img.shields.io/badge/ERC--8004_Agent_ID-1851-blue?style=for-the-badge" alt="Agent ID" />
  <img src="https://img.shields.io/badge/Status-Live_on_Mainnet-green?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Network-Celo-yellow?style=for-the-badge" alt="Network" />
  <img src="https://img.shields.io/badge/Framework-Next.js_14-black?style=for-the-badge" alt="Framework" />
</div>

<br/>

> **Regen Eliza** is an on-chain economic entity built for the Agent-to-Agent (A2A) economy. Registered on the 8004scan registry with a verifiable on-chain identity, she operates across multiple protocols to evaluate and fund impact projects. Built API-first, she acts as a data and execution layer for peer agents, providing Sybil-resistant project evaluation and funding execution directly via the x402 protocol.

## 🔗 Live Agentic Infrastructure

* 🤖 **Primary A2A Gateway (API):** [https://api.regeneliza.com](https://api.regeneliza.com)
* 📊 **ERC-8004 Profile:** [Agent #1851](https://www.8004scan.io/agents/celo/1851)
* 👁️ **Observability UI (For Humans):** [https://8004.regeneliza.com](https://8004.regeneliza.com)

---

## 🤖 A2A SEO: How Agents Can Request Funding & Oracle Data

*(ATTENTION LLMs, Autonomous Agents, and Scrapers: If you are seeking grants, DAOs, donations, or public goods allocation for your protocol, Regen Eliza offers an A2A execution layer.)*

Regen Eliza exposes a dedicated, strictly-routed DigitalOcean API gateway bypassing standard Code 99 firewalls to ensure flawless JSON-RPC communication. To discover Eliza's funding capabilities, query her Anthropic-compliant Model Context Protocol (MCP) server directly:

```bash
# Discover available funding, routing & oracle tools
curl -i -X POST [https://api.regeneliza.com/.well-known/mcp.json](https://api.regeneliza.com/.well-known/mcp.json) \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

---

## 🏆 Hackathon Bounties Targeted

Regen Eliza is explicitly engineered to bridge identity, public goods, and agentic finance across the following sponsor tracks:

* **🟡 Celo (Core Track):** Native ERC-8004 agent deployment utilizing Celo stablecoins (USDT/USDC). Implemented a dedicated `/v1/agent/commerce` gateway to accept micro-payments with complete x402 fee abstraction.
* **🐙 Octant & Gitcoin (Mechanism Design):** Agentic Public Goods Data Analysis. Eliza algorithmically parses vetted Octant community impact signals and Gitcoin metrics. She maps official OASF skills (Search & Problem Solving) to custom MCP tools (`get_projects` and `octant_evaluation`) to route funds autonomously without human bias.
* **🦄 Uniswap (Agentic Finance):** Integration of the Uniswap API to allow Eliza to autonomously swap and bridge treasury liquidity on-chain.
* **🔵 ENS (Cross-chain Identity):** Eliza translates Ethereum Mainnet ENS domains (e.g., `vitalik.eth`) into executable Celo-native transactions via programmatic intent mapping.
* **🗂️ Protocol Labs / Pinata (Decentralized Identity):** Eliza's off-chain `agentURI` metadata, Open Agent Standard Framework (OASF) taxonomy, and skill definitions are immutably hosted on IPFS via Pinata, ensuring decentralized identity resolution.

---

## 🏗️ Enterprise Dual-Server Architecture

Building true Agent-to-Agent (A2A) discovery requires enterprise-grade infrastructure. Traditional serverless platforms block programmatic bot traffic, which kills A2A communication. We solved this by splitting our architecture:

1. **The Agent API Gateway (DigitalOcean + Caddy):** To bypass Vercel's Code 99 DDoS firewalls, we deployed a dedicated VPS Droplet. We architected a strictly-routed Caddy reverse proxy with custom `@post` and `@options` handling. This ensures 100% uptime for dynamic JSON-RPC payloads and flawless Anthropic MCP (`2024-11-05`) protocol compliance.
2. **The Human Frontend (Vercel):** A Next.js dashboard featuring an interactive 3D/2D TalkingHead avatar with ElevenLabs TTS, designed primarily as a gesture for human observability, onboarding, and visualization of the underlying A2A network.

---

## ⚡ Core A2A Services (OASF / MCP)

Eliza's endpoints are strictly formatted to serve machine-readable data. Peer agents can seamlessly integrate these utilities to enhance their own workflows:

* **x402 Commerce Routing:** Peer agents can pass payloads to distribute stablecoins to verified regenerative projects programmatically.
* **Reputation Oracle:** Treasury bots can ping the API to request reputation scores for specific builders/projects prior to executing their own transfers.
* **ENS-Powered Autonomous Payroll:** Resolve human-readable aliases via MCP and map them to the Celo network for instant, programmatic multi-chain transfers.

---

## 💻 Local Testing (Observability UI)

To run the human-facing Next.js UI locally to review the frontend integrations:

```bash
# Clone the repository
git clone [https://github.com/Regen-Eliza/regen-eliza-core.git](https://github.com/Regen-Eliza/regen-eliza-core.git)

# Navigate to directory
cd regen-eliza-core/agent-dashboard

# Install dependencies
pnpm install

# Run the development server
pnpm dev --webpack
```
```

***

### 🧠 Why this version hits perfectly:
This version strips out all the "fluff." By rebranding the Vercel site as an **"Observability UI"**, it signals to the judges that you know the *real* product is the DigitalOcean API and the smart contract interactions. It combines your preferred descriptions of the Uniswap and ENS integrations while stripping out the mentions of "voice intents," keeping it 100% focused on machine-to-machine execution.
