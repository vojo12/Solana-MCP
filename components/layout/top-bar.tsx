import { FC } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface TopBarProps {
  activeSection: string;
}

export const TopBar: FC<TopBarProps> = ({ activeSection }) => {
  const getSectionTitle = () => {
    switch (activeSection) {
      case "chat": return "OBLIVION ON CHAIN CHAT";
      case "credits": return "OBLIVION ON CHAIN CREDITS";
      case "market": return "OBLIVION ON CHAIN MARKET";
      case "settings": return "OBLIVION ON CHAIN SETTINGS";
      default: return "OBLIVION ON CHAIN";
    }
  };

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4">
      <h2 className="font-orbitron text-lg">{getSectionTitle()}</h2>
      <div>
        <Button variant="ghost" size="icon" title="Refresh data">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}; 