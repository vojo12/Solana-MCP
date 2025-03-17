import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Coins, List, Gauge, Tag } from "lucide-react";

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export const QuickActions: FC<QuickActionsProps> = ({ onAction }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="rounded-full"
        onClick={() => onAction("get_wallet")}
      >
        <Wallet className="mr-2 h-4 w-4" /> View Wallet
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="rounded-full"
        onClick={() => onAction("check_balance")}
      >
        <Coins className="mr-2 h-4 w-4" /> Check Balance
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="rounded-full"
        onClick={() => onAction("list_tokens")}
      >
        <List className="mr-2 h-4 w-4" /> List Tokens
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="rounded-full"
        onClick={() => onAction("get_tps")}
      >
        <Gauge className="mr-2 h-4 w-4" /> Network TPS
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="rounded-full"
        onClick={() => onAction("fetch_price")}
      >
        <Tag className="mr-2 h-4 w-4" /> Check Price
      </Button>
    </div>
  );
}; 