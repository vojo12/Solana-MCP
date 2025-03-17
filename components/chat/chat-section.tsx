"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ChatMessage } from "@/components/chat/chat-message";
import { QuickActions } from "@/components/chat/quick-actions";

export const ChatSection = () => {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      type: "system",
      content: "Welcome to the Oblivion On Chain futuristic interface! Type a command or choose one of the actions below.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date()
    }]);

    // Simulate response (in a real app, this would call an API)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content: `Received your message: "${input}"`,
        timestamp: new Date()
      }]);
    }, 1000);

    setInput("");
  };

  const handleAction = (action: string) => {
    // Add user action
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: "user",
      content: `/${action}`,
      timestamp: new Date()
    }]);

    // Simulate response based on action
    let responseContent = "";
    switch (action) {
      case "get_wallet":
        responseContent = "Your wallet address is 5FHwkrdxD5AKmYoRvejJZVNBUg5PfEUXLYAQzg8RZxSP";
        break;
      case "check_balance":
        responseContent = "Your current balance is 2.45 SOL (≈ $245.00)";
        break;
      case "list_tokens":
        responseContent = "Your tokens:\n- SOL: 2.45 ($245.00)\n- USDC: 150.00 ($150.00)\n- BONK: 1,500,000 ($15.00)";
        break;
      case "get_tps":
        responseContent = "Current Solana network TPS: 1,245";
        break;
      case "fetch_price":
        responseContent = "Current SOL price: $100.00 (+2.5% in 24h)";
        break;
      default:
        responseContent = "Unknown command";
    }

    // Add agent response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content: responseContent,
        timestamp: new Date()
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.map(message => (
          <ChatMessage
            key={message.id}
            type={message.type}
            content={message.content}
            timestamp={message.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <QuickActions onAction={handleAction} />
      
      <div className="flex items-center gap-2 mt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command or message..."
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1"
        />
        <Button onClick={handleSendMessage} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}; 