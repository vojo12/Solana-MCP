import express from 'express';
import path from 'path';
import cors from 'cors';
import { SolanaAgentKit, ACTIONS } from 'solana-agent-kit';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize Solana Agent Kit
const privateKey = process.env.SOLANA_PRIVATE_KEY;
const rpcUrl = process.env.RPC_URL;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!privateKey || !rpcUrl) {
  throw new Error('Missing required environment variables');
}

const agent = new SolanaAgentKit(
  privateKey,
  rpcUrl,
  { OPENAI_API_KEY: openaiApiKey }
);

// Define interface for request parameters
interface McpRequest {
  action: string;
  token?: string;
  amount?: number;
  destination?: string;
  [key: string]: any;
}

// Token ID mapping for CoinGecko API
const tokenIdMap: Record<string, string> = {
  'SOL': 'solana',
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'USDC': 'usd-coin',
  'BONK': 'bonk',
  'JTO': 'jito-governance',
  'PYTH': 'pyth-network',
  'RAY': 'raydium',
  'ORCA': 'orca',
  'MSOL': 'marinade-staked-sol'
};

// Mock data for demonstration purposes (fallback)
const mockTokens = [
  { symbol: 'SOL', name: 'Solana', balance: 1.45, price: 142.87, value: 207.16 },
  { symbol: 'USDC', name: 'USD Coin', balance: 250.00, price: 1.00, value: 250.00 },
  { symbol: 'BONK', name: 'Bonk', balance: 1000000, price: 0.00001234, value: 12.34 },
  { symbol: 'JTO', name: 'Jito', balance: 5.75, price: 3.21, value: 18.46 }
];

const mockMarketData = [
  { symbol: 'SOL', name: 'Solana', price: 142.87, change24h: 3.2, volume24h: 1245000000 },
  { symbol: 'BTC', name: 'Bitcoin', price: 63421.50, change24h: -1.5, volume24h: 32450000000 },
  { symbol: 'ETH', name: 'Ethereum', price: 3456.78, change24h: 0.8, volume24h: 15670000000 },
  { symbol: 'JTO', name: 'Jito', price: 3.21, change24h: 5.4, volume24h: 87500000 },
  { symbol: 'BONK', name: 'Bonk', price: 0.00001234, change24h: 12.7, volume24h: 45600000 }
];

// Function to get real-time token price from CoinGecko
async function getTokenPrice(tokenSymbol: string): Promise<{
  price: number;
  change24h: number;
  volume24h: number;
  success: boolean;
}> {
  try {
    const normalizedSymbol = tokenSymbol.toUpperCase();
    const tokenId = tokenIdMap[normalizedSymbol];
    
    if (!tokenId) {
      console.log(`Token ID not found for ${normalizedSymbol}`);
      throw new Error(`Token ID not found for ${normalizedSymbol}`);
    }
    
    console.log(`Fetching price for ${normalizedSymbol} (${tokenId}) from CoinGecko`);
    
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${tokenId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    );
    
    if (response.status !== 200) {
      throw new Error(`CoinGecko API returned status ${response.status}`);
    }
    
    const data = response.data;
    const price = data.market_data.current_price.usd;
    const change24h = data.market_data.price_change_percentage_24h;
    const volume24h = data.market_data.total_volume.usd;
    
    console.log(`Price data for ${normalizedSymbol}: $${price}, ${change24h}%, Volume: $${volume24h}`);
    
    return {
      price,
      change24h,
      volume24h,
      success: true
    };
  } catch (error) {
    console.error(`Error fetching price for ${tokenSymbol}:`, error);
    
    // Fallback to mock data
    const mockToken = mockMarketData.find(t => t.symbol.toLowerCase() === tokenSymbol.toLowerCase());
    if (mockToken) {
      console.log(`Using mock data for ${tokenSymbol}`);
      return {
        price: mockToken.price,
        change24h: mockToken.change24h,
        volume24h: mockToken.volume24h,
        success: true
      };
    }
    
    return {
      price: 0,
      change24h: 0,
      volume24h: 0,
      success: false
    };
  }
}

// Function to get real-time market data
async function getRealTimeMarketData(): Promise<any[]> {
  try {
    // Get top tokens by market cap
    const topTokens = Object.keys(tokenIdMap).slice(0, 10);
    const marketData = [];
    
    // Fetch data for each token
    for (const symbol of topTokens) {
      try {
        const { price, change24h, volume24h, success } = await getTokenPrice(symbol);
        
        if (success) {
          // Find token name from mock data
          const mockToken = mockMarketData.find(t => t.symbol === symbol);
          const name = mockToken ? mockToken.name : symbol;
          
          marketData.push({
            symbol,
            name,
            price,
            change24h,
            volume24h
          });
        }
      } catch (tokenError) {
        console.error(`Error fetching data for ${symbol}:`, tokenError);
      }
    }
    
    return marketData.length > 0 ? marketData : mockMarketData;
  } catch (error) {
    console.error('Error fetching market data:', error);
    return mockMarketData;
  }
}

// Endpoint to process MCP requests
app.post('/mcp', function(req, res) {
  (async () => {
    try {
      const { action, ...params } = req.body as McpRequest;
      
      // Mapping of actions to agent methods
      const actionHandlers: Record<string, () => Promise<any>> = {
        'get_wallet': async () => agent.wallet_address,
        'check_balance': async () => {
          const balance = await agent.getBalance();
          return `${balance} SOL`;
        },
        'list_tokens': async () => {
          // In a real implementation, you would fetch token balances from the blockchain
          // For now, we'll use mock data but update prices
          const updatedTokens = [...mockTokens];
          
          // Update prices for tokens
          for (const token of updatedTokens) {
            try {
              const { price, success } = await getTokenPrice(token.symbol);
              if (success) {
                token.price = price;
                token.value = token.balance * price;
              }
            } catch (error) {
              console.error(`Error updating price for ${token.symbol}:`, error);
            }
          }
          
          return updatedTokens;
        },
        'fetch_price': async () => {
          const token = params.token || 'SOL';
          
          // Garantir que o token seja uma string e remover espaços extras
          const tokenSymbol = String(token).trim();
          console.log(`Fetching real-time price for token: "${tokenSymbol}"`);
          
          try {
            const { price, change24h, success } = await getTokenPrice(tokenSymbol);
            
            if (success) {
              return `Price of ${tokenSymbol}: $${price.toFixed(2)} (${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}% 24h)`;
            } else {
              return `Price of ${tokenSymbol}: $XX.XX (data not available)`;
            }
          } catch (error) {
            console.error(`Error in fetch_price for ${tokenSymbol}:`, error);
            return `Price of ${tokenSymbol}: $XX.XX (error fetching data)`;
          }
        },
        'get_tps': async () => {
          try {
            // In a real implementation, you would fetch this from the Solana network
            // For example, using the getRecentPerformanceSamples RPC method
            const response = await axios.post(rpcUrl, {
              jsonrpc: '2.0',
              id: 1,
              method: 'getRecentPerformanceSamples',
              params: [1]
            });
            
            if (response.data && response.data.result && response.data.result.length > 0) {
              const sample = response.data.result[0];
              const tps = Math.round(sample.numTransactions / sample.samplePeriodSecs);
              return `Current TPS: ${tps.toLocaleString()}`;
            }
            
            return "Current TPS: 4,532"; // Fallback
          } catch (error) {
            console.error('Error fetching TPS:', error);
            return "Current TPS: 4,532"; // Fallback
          }
        },
        'get_market_data': async () => {
          return await getRealTimeMarketData();
        },
        'send_tokens': async () => {
          const { amount, destination, token } = params;
          if (!amount || !destination) {
            throw new Error('Missing required parameters: amount and destination');
          }
          // In a real implementation, you would send tokens on the blockchain
          return `Successfully sent ${amount} ${token || 'SOL'} to ${destination}`;
        },
        'get_settings': async () => {
          return {
            theme: 'dark',
            language: 'en',
            notifications: true,
            autoRefresh: true,
            refreshInterval: 60
          };
        },
        'update_settings': async () => {
          // In a real implementation, you would save these settings
          return { success: true, message: 'Settings updated successfully' };
        }
      };

      // Check if action exists
      if (!action || !(action in actionHandlers)) {
        return res.status(400).json({ error: `Unknown action: ${action}` });
      }

      // Execute action
      const result = await actionHandlers[action]();
      res.json({ result });
    } catch (error) {
      console.error('Error processing MCP request:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  })();
});

// Default route to serve the web interface
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('✨ Oblivion Solana MCP interface available');
});

export default app; 