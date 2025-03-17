import { FC } from "react";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Coins, 
  LineChart, 
  Settings,
  Wallet
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Sidebar: FC<SidebarProps> = ({ 
  activeSection, 
  setActiveSection 
}) => {
  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="text-orange-500 text-2xl">◉</div>
          <h1 className="font-orbitron font-bold text-lg">OBLIVION ON CHAIN</h1>
        </div>
      </div>
      
      <div className="p-4 border-b border-border">
        <div className="text-xs text-muted-foreground mb-1">CONNECTED WALLET</div>
        <div className="font-mono text-xs truncate mb-1" id="wallet-address">
          5FHwkrdxD5AKmYoRvejJZVNBUg5PfEUXLYAQzg8RZxSP
        </div>
        <div className="text-sm font-medium" id="wallet-balance">2.45 SOL</div>
      </div>
      
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs">MAINNET</span>
        </div>
        <div className="text-xs" id="tps-indicator">1,245 TPS</div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant={activeSection === "chat" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("chat")}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Chat
        </Button>
        
        <Button
          variant={activeSection === "credits" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("credits")}
        >
          <Coins className="mr-2 h-4 w-4" />
          Credits
        </Button>
        
        <Button
          variant={activeSection === "market" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("market")}
        >
          <LineChart className="mr-2 h-4 w-4" />
          Market
        </Button>
        
        <Button
          variant={activeSection === "settings" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveSection("settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground mb-1">v1.0.0</div>
        <a 
          href="https://solana.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Powered by Solana
        </a>
      </div>
    </div>
  );
}; 