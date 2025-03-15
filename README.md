# Solana MCP (Model Context Protocol)

![Solana](https://img.shields.io/badge/Solana-black?style=for-the-badge&logo=solana)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![DeFi](https://img.shields.io/badge/DeFi-purple?style=for-the-badge)

A powerful Model Context Protocol (MCP) server for AI agents to interact with the Solana blockchain and DeFi protocols.

## 🚀 Overview

Solana MCP provides a standardized interface for AI agents (like Claude, ChatGPT, etc.) to perform DeFi operations on the Solana blockchain. It bridges the gap between artificial intelligence and decentralized finance, allowing AI systems to:

- Query wallet balances and token holdings
- Transfer SOL and SPL tokens
- Execute token swaps
- Fetch real-time price data
- Perform advanced DeFi operations

Built on top of the [Solana Agent Kit](https://github.com/sendaifun/solana-agent-kit) and the Model Context Protocol (MCP), this tool provides a secure, efficient, and standardized interface for automated DeFi operations.

## 📋 Prerequisites

- Node.js v22.x or later
- npm or yarn package manager
- Solana wallet (keypair)
- RPC endpoint for Solana (e.g., Helius, Alchemy, or your own node)

## 🔧 Installation

1. Clone this repository:
```bash
git clone https://github.com/caiovicentino/Solana-MCP.git
cd Solana-MCP
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
SOLANA_PRIVATE_KEY=your_private_key_here
RPC_URL=your_rpc_url_here
OPENAI_API_KEY=optional_if_using_openai
```

> ⚠️ **Security Warning**: Never commit your `.env` file or expose your private key. Add `.env` to your `.gitignore` file.

4. Build the project:
```bash
npm run build
```

## 🚀 Usage

Start the MCP server:

```bash
npm start
```

When successfully started, you should see:
```
✅ Connected to Solana
🔗 Using RPC: [your-rpc-endpoint]
👛 Wallet configured: [your-wallet-address]
🚀 Starting Yield AI MCP Server...
📊 Available DeFi actions: 8
✨ Yield AI MCP Server started. Ready to perform DeFi operations on Solana!
```

## 💬 Available Actions

The following DeFi actions are available through the MCP server:

| Action | Description |
|--------|-------------|
| `get_wallet` | Get the current wallet address |
| `check_balance` | Check SOL balance of the wallet |
| `transfer_sol` | Transfer SOL to another wallet |
| `list_tokens` | List all tokens in the wallet |
| `fetch_price` | Fetch current price of a token |
| `trade_tokens` | Execute a trade between tokens |
| `get_tps` | Get current Solana network TPS |
| `swap_tokens` | Swap tokens via liquidity pools |

## 🔌 Integration with AI Models

This MCP server is designed to be used with AI models that support the Model Context Protocol. The server uses standard input/output for communication, making it compatible with various AI integration frameworks.

Example of using with Claude:

```typescript
// Example code for integrating with Claude API
// (Placeholder - actual integration depends on your specific AI framework)
```

## 🔒 Security Considerations

- Always review transactions before they are executed
- Consider implementing transaction limits
- Secure your private key with proper key management practices
- Use a dedicated wallet with limited funds for testing
- Monitor for any suspicious activities

## 🛠️ Advanced Configuration

For more advanced configurations, you can modify the following files:

- `src/index.ts`: Main entry point
- `.env`: Environment configuration

## 📚 Resources

- [Solana Documentation](https://docs.solana.com/)
- [Model Context Protocol](https://github.com/anthropics/anthropic-cookbook/tree/main/mcp)
- [Solana Agent Kit](https://github.com/sendaifun/solana-agent-kit)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 