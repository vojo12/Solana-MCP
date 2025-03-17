"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search } from "lucide-react";
import { MarketTable } from "@/components/market/market-table";
import { MarketChart } from "@/components/market/market-chart";
import { generateSampleMarketData } from "@/lib/market-data";

export const MarketSection = () => {
  const [marketData, setMarketData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedToken, setSelectedToken] = useState(null);
  const [timeframe, setTimeframe] = useState("1D");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const data = generateSampleMarketData();
      setMarketData(data);
    } catch (error) {
      console.error("Error loading market data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadMarketData();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectToken = (token) => {
    setSelectedToken(token);
  };

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Market Overview</h2>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10"
        />
      </div>
      
      <MarketTable
        data={marketData}
        searchTerm={searchTerm}
        isLoading={isLoading}
        onSelectToken={handleSelectToken}
      />
      
      <MarketChart
        token={selectedToken}
        timeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
      />
    </div>
  );
}; 