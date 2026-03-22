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
