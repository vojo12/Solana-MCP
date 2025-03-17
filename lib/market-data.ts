export function generateSampleMarketData() {
  const tokens = [
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'USDC', name: 'USD Coin' },
    { symbol: 'BONK', name: 'Bonk' },
    { symbol: 'JUP', name: 'Jupiter' },
    { symbol: 'RNDR', name: 'Render Token' },
    { symbol: 'PYTH', name: 'Pyth Network' },
    { symbol: 'USDT', name: 'Tether' },
    { symbol: 'RAY', name: 'Raydium' }
  ];
  
  return tokens.map(token => {
    // Generate price based on ASCII code of first character (for consistency)
    const basePrice = token.symbol === 'BTC' ? 65000 : 
                     token.symbol === 'ETH' ? 3500 : 
                     token.symbol === 'SOL' ? 150 :
                     token.symbol === 'USDC' || token.symbol === 'USDT' ? 1 :
                     (token.symbol.charCodeAt(0) % 100) + 1;
    
    // Generate price change (between -10% and +10%)
    const changePercent = ((token.symbol.charCodeAt(1) % 20) - 10) + (Math.random() * 2 - 1);
    
    // Generate volume (based on price)
    const volume = basePrice * 1000000 * (0.5 + Math.random());
    
    return {
      symbol: token.symbol,
      name: token.name,
      price: basePrice,
      change24h: parseFloat(changePercent.toFixed(2)),
      volume24h: volume
    };
  });
}

export async function generateCandleData(symbol, timeframe) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate sample data based on symbol and timeframe
  const basePrice = symbol === 'BTC' ? 65000 : 
                   symbol === 'ETH' ? 3500 : 
                   symbol === 'SOL' ? 150 :
                   symbol === 'USDC' || symbol === 'USDT' ? 1 :
                   (symbol.charCodeAt(0) % 100) + 1;
  
  // Generate random price movement (±5%)
  const priceVariation = basePrice * 0.05;
  const open = basePrice - priceVariation/2 + Math.random() * priceVariation;
  const close = basePrice - priceVariation/2 + Math.random() * priceVariation;
  const high = Math.max(open, close) + Math.random() * priceVariation/2;
  const low = Math.min(open, close) - Math.random() * priceVariation/2;
  const volume = basePrice * 1000000 * (0.5 + Math.random());
  
  return {
    open,
    high,
    low,
    close,
    volume
  };
} 