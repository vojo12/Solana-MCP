import { FC } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { MessageSquare, Bot, Info } from "lucide-react";

interface ChatMessageProps {
  type: "user" | "agent" | "system";
  content: string;
  timestamp: Date;
}

export const ChatMessage: FC<ChatMessageProps> = ({ 
  type, 
  content, 
  timestamp 
}) => {
  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg",
      type === "user" ? "bg-muted ml-12" : "bg-card",
      type === "agent" ? "border border-border" : "",
      type === "system" ? "bg-muted/50 border border-border" : ""
    )}>
      {type !== "user" && (
        <Avatar className={cn(
          "h-10 w-10 rounded-full",
          type === "agent" ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20"
        )}>
          {type === "agent" ? (
            <Bot className="h-5 w-5" />
          ) : (
            <Info className="h-5 w-5 text-muted-foreground" />
          )}
        </Avatar>
      )}
      
      <div className="flex-1">
        <div className="text-xs text-muted-foreground mb-1">
          {timestamp.toLocaleTimeString()}
        </div>
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
      
      {type === "user" && (
        <Avatar className="h-10 w-10 rounded-full bg-primary text-primary-foreground">
          <MessageSquare className="h-5 w-5" />
        </Avatar>
      )}
    </div>
  );
}; 