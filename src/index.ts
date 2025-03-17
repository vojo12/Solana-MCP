import { ACTIONS, SolanaAgentKit, startMcpServer } from "solana-agent-kit";
import * as dotenv from "dotenv";

// Redirect logs to stderr instead of stdout
const logToStderr = (message: string) => {
  process.stderr.write(`[Solana MCP] ${message}\n`);
};

// Load environment variables
dotenv.config();

// Verify that required environment variables are set
if (!process.env.SOLANA_PRIVATE_KEY || !process.env.RPC_URL) {
    logToStderr("Error: SOLANA_PRIVATE_KEY and RPC_URL must be defined in .env file");
    process.exit(1);
}

// Initialize the Solana Agent Kit
logToStderr("Initializing Solana MCP Server...");

// Create agent instance
const agent = new SolanaAgentKit(
    process.env.SOLANA_PRIVATE_KEY!,
    process.env.RPC_URL!,
    {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
    },
);

logToStderr(`✅ Connected to Solana via ${process.env.RPC_URL}`);
logToStderr(`💰 Wallet: ${agent.wallet_address.toString()}`);

// Define a subset of DeFi actions for the MCP following the Record<string, Action> format
const mcp_actions = {
    // Core wallet operations
    "get_wallet": ACTIONS.WALLET_ADDRESS_ACTION,
    "check_balance": ACTIONS.BALANCE_ACTION,
    "list_tokens": ACTIONS.TOKEN_BALANCES_ACTION, // Use a different action for token balances
    
    // Market data and trading
    "fetch_price": ACTIONS.FETCH_PRICE_ACTION,
    "trade_tokens": ACTIONS.TRADE_ACTION,
    "get_tps": ACTIONS.GET_TPS_ACTION,
    
    // Token operations
    "get_token_data": ACTIONS.GET_TOKEN_DATA_ACTION,
    
    // Uncomment additional actions as needed
    // "get_asset": ACTIONS.GET_ASSET_ACTION,
    // "deploy_token": ACTIONS.DEPLOY_TOKEN_ACTION,
};

logToStderr(`🚀 Starting Solana MCP Server...`);
logToStderr(`📊 Available DeFi actions: ${Object.keys(mcp_actions).length}`);

try {
    // Start the MCP server with defined actions
    startMcpServer(mcp_actions, agent, { 
        name: "solana-mcp", 
        version: "1.0.0" 
    });
    logToStderr(`✨ Solana MCP Server started. Ready to perform DeFi operations on Solana!`);
} catch (error) {
    logToStderr(`❌ Error starting MCP Server: ${error}`);
    process.exit(1);
} 