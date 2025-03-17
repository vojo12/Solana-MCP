"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { ChatSection } from "@/components/chat/chat-section";
import { CreditsSection } from "@/components/credits/credits-section";
import { MarketSection } from "@/components/market/market-section";
import { SettingsSection } from "@/components/settings/settings-section";

export default function Home() {
  const [activeSection, setActiveSection] = useState("chat");

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar activeSection={activeSection} />
        <div className="flex-1 overflow-auto p-4">
          {activeSection === "chat" && <ChatSection />}
          {activeSection === "credits" && <CreditsSection />}
          {activeSection === "market" && <MarketSection />}
          {activeSection === "settings" && <SettingsSection />}
        </div>
      </main>
    </div>
  );
} 