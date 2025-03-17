import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LineChart, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

interface MarketToken {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
}

interface MarketTableProps {
  data: MarketToken[];
  searchTerm: string;
  isLoading: boolean;
  onSelectToken: (token: MarketToken) => void;
}

export const MarketTable: FC<MarketTableProps> = ({
  data,
  searchTerm,
  isLoading,
  onSelectToken,
}) => {
  // Filter data based on search term
  const filteredData = data.filter((token) => {
    const term = searchTerm.toLowerCase();
    return (
      token.name.toLowerCase().includes(term) ||
      token.symbol.toLowerCase().includes(term)
    );
  });

  return (
    <Card>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>24h Change</TableHead>
              <TableHead>24h Volume</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading market data...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No tokens found matching &quot;{searchTerm}&quot;
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((token) => (
                <TableRow key={token.symbol}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-primary">
                        {token.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {token.symbol}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>${token.price.toFixed(2)}</TableCell>
                  <TableCell
                    className={
                      token.change24h >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {token.change24h >= 0 ? "+" : ""}
                    {token.change24h}%
                  </TableCell>
                  <TableCell>${formatNumber(token.volume24h)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectToken(token)}
                      >
                        <LineChart className="h-4 w-4 mr-1" /> Chart
                      </Button>
                      <Button variant="outline" size="sm">
                        <ShoppingCart className="h-4 w-4 mr-1" /> Buy
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}; 