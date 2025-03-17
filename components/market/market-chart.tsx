"use client";

import { FC, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateCandleData } from "@/lib/market-data";
import { formatNumber } from "@/lib/utils";

interface MarketChartProps {
  token: any;
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

export const MarketChart: FC<MarketChartProps> = ({
  token,
  timeframe,
  onTimeframeChange,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token && typeof window !== "undefined") {
      loadChartData();
    }
  }, [token, timeframe]);

  const loadChartData = async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const data = await generateCandleData(token.symbol, timeframe);
      setChartData(data);
      
      // Initialize TradingView widget
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = '';
        
        // Map symbols to TradingView symbols
        const symbolMap = {
          'BTC': 'BINANCE:BTCUSDT',
          'ETH': 'BINANCE:ETHUSDT',
          'SOL': 'BINANCE:SOLUSDT',
          'USDC': 'BINANCE:USDCUSDT',
          'BONK': 'BINANCE:BONKUSDT',
          'JUP': 'BINANCE:JUPUSDT',
          'RNDR': 'BINANCE:RNDRUSDT',
          'PYTH': 'BINANCE:PYTHUSDT',
          'USDT': 'BINANCE:USDTUSDC',
          'RAY': 'BINANCE:RAYUSDT'
        };
        
        const tvSymbol = symbolMap[token.symbol] || `BINANCE:${token.symbol}USDT`;
        
        // @ts-ignore
        new TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: timeframe,
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: chartContainerRef.current.id,
        });
      }
    } catch (error) {
      console.error("Error loading chart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {token ? `${token.name} (${token.symbol})` : "Select a token to view chart"}
        </CardTitle>
        <div className="flex space-x-2">
          {["1D", "1W", "1M", "1Y"].map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => onTimeframeChange(tf)}
            >
              {tf}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {token ? (
          <div className="space-y-4">
            <div 
              ref={chartContainerRef} 
              id="tradingview-chart" 
              className="h-[400px] w-full"
            />
            
            {chartData && (
              <div className="grid grid-cols-5 gap-4 mt-4">
                <div className="bg-muted p-3 rounded-md text-center">
                  <div className="text-xs text-muted-foreground">Open</div>
                  <div className="font-medium">${chartData.open.toFixed(2)}</div>
                </div>
                <div className="bg-muted p-3 rounded-md text-center">
                  <div className="text-xs text-muted-foreground">Close</div>
                  <div className="font-medium">${chartData.close.toFixed(2)}</div>
                </div>
                <div className="bg-muted p-3 rounded-md text-center">
                  <div className="text-xs text-muted-foreground">High</div>
                  <div className="font-medium">${chartData.high.toFixed(2)}</div>
                </div>
                <div className="bg-muted p-3 rounded-md text-center">
                  <div className="text-xs text-muted-foreground">Low</div>
                  <div className="font-medium">${chartData.low.toFixed(2)}</div>
                </div>
                <div className="bg-muted p-3 rounded-md text-center">
                  <div className="text-xs text-muted-foreground">Volume</div>
                  <div className="font-medium">${formatNumber(chartData.volume)}</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] bg-muted/50 rounded-md">
            <LineChart className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">Select a token to view chart</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 