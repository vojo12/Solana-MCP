"use client";

import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { ChatSection } from "@/components/chat/chat-section";
import { CreditsSection } from "@/components/credits/credits-section";
import { MarketSection } from "@/components/market/market-section";
import { SettingsSection } from "@/components/settings/settings-section";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const orbitron = Orbitron({ 
  subsets: ["latin"], 
  variable: "--font-orbitron",
  weight: ["400", "500", "700"]
});

export const metadata = {
  title: "Oblivion On Chain",
  description: "A futuristic interface for interacting with the Solana blockchain",
};

export default function RootLayout({ children }) {
  const [activeSection, setActiveSection] = useState("chat");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
      </head>
      <body className={`${inter.variable} ${orbitron.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
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
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
