# 🌿 Regen Eliza: The Sovereign AI Agent

**An autonomous, voice-activated ERC-8004 agent designed to route capital, execute Agentic DeFi, and fund the Regenerative Economy on the Celo network.**

![Regen Eliza UI](https://img.shields.io/badge/Status-Live_on_Testnet-green) ![Network](https://img.shields.io/badge/Network-Celo-yellow) ![Framework](https://img.shields.io/badge/Framework-Next.js_14-black)

## 🏆 Hackathon Bounties Targeted

Regen Eliza is explicitly engineered to bridge identity, public goods, and agentic finance across the following sponsor tracks:

* **🟡 Celo (Core Track):** Native ERC-8004 agent deployment utilizing Celo stablecoins (USDT/USDC/cUSD) for low-fee, high-speed public goods distribution.
* **🦄 Uniswap (Agentic Finance):** Native integration of the Uniswap API/SDK to allow Regen Eliza to autonomously swap and bridge value on-chain via natural voice commands.
* **🔵 ENS:** Cross-chain identity resolution. Eliza translates Ethereum Mainnet ENS domains (e.g., `vitalik.eth`) into executable Celo-native transactions via her voice-activated Address Book.
* **🐙 Octant (Mechanism Design):** Agentic Public Goods Data Analysis. Eliza autonomously parses vetted datasets (DeSci, Eco, Builders) and maps voice intents to execute x402 micro-payments to verified impact projects.

---

## 🚀 Core Capabilities

### 1. 🎙️ Voice-to-Action Core (Full Autonomous UI)
No more clicking buttons. Users speak directly to Eliza using native **WebSpeech API** recognition. Her LLM intent parser routes the command, executes the on-chain transaction, and verbally reports the success receipt back using **ElevenLabs TTS** and a dynamic 3D lip-syncing avatar.

### 2. 💸 Agentic Finance (Uniswap Router)
Eliza can manage her own treasury. By simply saying *"Swap tokens"*, she leverages the Uniswap protocol to mathematically resolve the optimal route and execute token swaps autonomously, acting as a liquidity magnet for the ecosystem.

### 3. 🌍 Public Goods Donation Engine (x402)
Eliza serves as a public goods routing service. Implementing the `thirdweb/x402` payment gate, she can distribute stablecoins to verified regenerative projects, providing instant audio-visual terminal receipts of the exact project funded.

### 4. 📇 ENS-Powered Address Book
Eliza acts as an autonomous payroll and remittance agent. Users can say, *"Send 10 USDT to ottox.eth"*, and she will instantly resolve the alias, map it to the Celo network, and execute the transfer.

### 5. 🤖 Sovereign Identity (ERC-8004)
Eliza is not a script; she is an entity. She is registered on the 8004scan registry with a verifiable on-chain identity and reputation score, allowing other agents (A2A) to discover and utilize her routing services.

---

## 🛠️ Tech Stack

* **Blockchain:** Celo (EVM)
* **Frontend:** Next.js (App Router), Tailwind CSS, Framer Motion
* **Agent Identity:** ERC-8004 / 8004scan.io
* **DeFi Engine:** Uniswap SDK / API
* **Payments & Auth:** Thirdweb SDK, x402 Protocol
* **Voice Engine:** Native WebSpeech API (STT) + ElevenLabs (TTS)
* **Avatar:** `met4citizen/TalkingHead` (3D Lip-sync)

---

## ⚡ Quick Start Guide

### Prerequisites
* Node.js v18+
* `pnpm` package manager
* A funded Celo Wallet Private Key (for the Agent)

### 1. Installation

```bash
git clone [https://github.com/Regen-Eliza/regen-eliza-core.git](https://github.com/Regen-Eliza/regen-eliza-core.git)
cd regen-eliza-core/agent-dashboard
pnpm install
