# Integrating Solana MCP with Claude

This guide explains how to integrate the Solana MCP server with Claude AI, enabling Claude to perform DeFi operations on the Solana blockchain.

## Claude Desktop Integration

Claude Desktop can be configured to use the Solana MCP server through its configuration file.

### Step 1: Create a Claude Configuration File

Create a file named `claude_desktop_config.json` with the following content:

```json
{
  "tools": [
    {
      "name": "solana-mcp",
      "path": "ABSOLUTE_PATH_TO_YOUR_INSTALLATION/dist/index.js",
      "description": "DeFi operations on Solana blockchain"
    }
  ]
}
```

Replace `ABSOLUTE_PATH_TO_YOUR_INSTALLATION` with the absolute path to your Solana MCP installation directory.

### Step 2: Place the Configuration File

#### For macOS:
```bash
cp claude_desktop_config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### For Windows:
```bash
copy claude_desktop_config.json %APPDATA%\Claude\claude_desktop_config.json
```

### Step 3: Restart Claude Desktop

Close and reopen Claude Desktop for the changes to take effect.

## Using Claude with Solana MCP

Once configured, you can ask Claude to perform various DeFi operations on Solana:

### Examples of Prompts

- "What's the current balance of my Solana wallet?"
- "Check the current price of SOL in USD"
- "How many tokens do I have in my wallet?"
- "What's the current TPS of the Solana network?"
- "Transfer 0.1 SOL to address abc123..." (Be cautious with transfer requests)

### Security Considerations

1. **Limited Funds**: Use a wallet with limited funds for testing
2. **Verify Transactions**: Always review any transaction details before approving
3. **Secure Private Key**: Ensure your private key in the .env file is secured
4. **Transaction Limits**: Consider setting MAX_TRANSACTION_AMOUNT in your .env file

## Claude API Integration

For programmatic integration with Claude API:

```javascript
// Example code for Claude API integration
const { Client } = require('@anthropic-ai/sdk');
const { spawn } = require('child_process');
const path = require('path');

// Initialize Claude client
const claude = new Client(process.env.ANTHROPIC_API_KEY);

// Path to your Solana MCP executable
const mcpPath = path.resolve(__dirname, '../dist/index.js');

// Function to execute MCP command
async function executeSolanaMCP(input) {
  return new Promise((resolve, reject) => {
    const mcp = spawn('node', [mcpPath]);
    let output = '';
    
    mcp.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    mcp.stderr.on('data', (data) => {
      console.error(`MCP Error: ${data}`);
    });
    
    mcp.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(`MCP process exited with code ${code}`);
      }
    });
    
    mcp.stdin.write(JSON.stringify(input) + '\n');
    mcp.stdin.end();
  });
}

// Example function to ask Claude with Solana MCP capabilities
async function askClaude(prompt) {
  const message = await claude.messages.create({
    model: "claude-3-opus-20240229",
    max_tokens: 1000,
    temperature: 0,
    system: "You are a helpful AI assistant with access to Solana blockchain operations.",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    tools: [
      {
        name: "solana-mcp",
        execute: executeSolanaMCP
      }
    ]
  });
  
  return message.content;
}

// Example usage
askClaude("What's the current balance of my Solana wallet?")
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

## Troubleshooting

- **Connection Issues**: Ensure your RPC endpoint is valid and accessible
- **Authentication Errors**: Check that your private key is correctly formatted
- **Tool Not Found**: Verify the path in your Claude configuration file is correct
- **Action Not Available**: Check that the requested action is included in the `mcp_actions` object in `index.ts` 