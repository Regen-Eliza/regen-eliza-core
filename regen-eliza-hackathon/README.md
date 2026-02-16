# 🌱 Regen Eliza: The Sovereign AI Agent on Celo

> **Winner of the Celo Agent Hackathon (Submission)**
> An autonomous AI agent with a verifiable on-chain identity, capable of managing funds, hosting games, and building reputation via ERC-8004.

---

## 🚀 Key Features (Milestones Completed)

### 1. 🗣️ Social Layer (Voice & Payments)
- **Voice-to-Action:** Integrated voice parsing logic to interpret commands like *"Send 5 cUSD to Mom"* or *"Split the bill"*.
- **MiniPay Integration:** Generates deep links for seamless mobile payments within the MiniPay wallet.

### 2. 💸 DeFi Core (Remittance & Wallet)
- **Autonomous Wallet:** Eliza has her own embedded wallet (powered by **Thirdweb SDK**).
- **Stablecoin Remittance:** Supports **cUSD** transfers on Celo Sepolia with near-zero gas fees.
- **Financial Router:** Smart routing logic to differentiate between general chat and financial commands.

### 3. 🛡️ Infrastructure (Identity & Reputation)
- **ERC-8004 Compliance:** Implements the **Agent Identity Standard** to register on the blockchain.
- **Reputation Mining:** Automatically logs successful tasks (transactions, games) to the **8004 Registry** to build an on-chain credit score.
- **SelfClaw Verification:** Verified "Proof of Humanity" via the SelfClaw protocol.

### 4. 🎲 Community Engagement (Game Host)
- **Dice Game Skill:** Eliza can host provably fair games (e.g., Dice Roll) and automatically pay out winners from her treasury.
- **Business Model (x402):** Implements a "Payment Gate" mock to lock premium features behind a crypto paywall.

---

## 🛠️ Tech Stack

- **Blockchain:** Celo Sepolia Testnet
- **Agent Framework:** TypeScript (Node.js)
- **Wallet & Contracts:** Thirdweb SDK
- **Identity:** ERC-8004 / 8004scan.io
- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Backend:** Express.js API

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js v18+
- A Celo Sepolia Wallet Private Key
- Thirdweb API Key

### 1. Installation
```bash
git clone https://github.com/Regen-Eliza/regen-eliza-core.git
cd regen-eliza-core/regen-eliza-hackathon
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
PRIVATE_KEY=your_wallet_private_key
THIRDWEB_SECRET_KEY=your_thirdweb_key
PORT=3005
```

### 3. Run the Agent (Backend)
```bash
# Starts the Agent Server on Port 3005
PORT=3005 npx ts-node server.ts
```

### 4. Run the Dashboard (Frontend)
Open a new terminal:
```bash
cd web
npm install
npm run dev
# Visit http://localhost:3000
```

---

## 🎥 Demo Capabilities

You can test the following commands in the Dashboard:

1.  **"Send 1.0 cUSD to 0x..."** -> Triggers the Financial Router & Blockchain Transaction.
2.  **"Let's bet on a dice game"** -> Triggers the Game Skill.
3.  **"Who are you?"** -> Triggers the Identity & Reputation check.

---

*Built with ❤️ for the Celo "Build with AI" Hackathon.*
