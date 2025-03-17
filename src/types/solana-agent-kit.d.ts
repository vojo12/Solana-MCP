declare module 'solana-agent-kit' {
  import { Connection } from '@solana/web3.js';
  import { Keypair } from '@solana/web3.js';
  
  export const ACTIONS: any;
  
  export interface SolanaAgentKitConfig {
    OPENAI_API_KEY?: string;
    // Add other config properties as needed
  }
  
  export class SolanaAgentKit {
    connection: Connection;
    wallet: Keypair;
    wallet_address: any; // Replace 'any' with the actual type if known
    config: SolanaAgentKitConfig;
    
    constructor(
      privateKey: string,
      rpcUrl: string,
      config?: SolanaAgentKitConfig
    );
    
    // Add these methods that are referenced in the errors
    requestFaucetFunds(): Promise<any>;
    deployToken(): Promise<any>;
    deployCollection(): Promise<any>;
    getBalance(): Promise<any>;
    // Add other methods that might be used in your code
  }
  
  export function startMcpServer(
    actions: any,
    agent: SolanaAgentKit,
    options?: any
  ): void;
} 

console.log("Available actions:", Object.keys(ACTIONS)); 