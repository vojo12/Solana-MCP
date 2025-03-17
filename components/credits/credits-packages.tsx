import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, DollarSign } from "lucide-react";

interface CreditsPackagesProps {
  onBuyCredits: (amount: number, price: number) => void;
}

export const CreditsPackages: FC<CreditsPackagesProps> = ({ onBuyCredits }) => {
  const packages = [
    { amount: 50, price: 5.00, discount: null },
    { amount: 100, price: 9.00, discount: "10% OFF" },
    { amount: 250, price: 20.00, discount: "20% OFF", featured: true },
    { amount: 500, price: 35.00, discount: "30% OFF" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Credits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg) => (
            <div 
              key={pkg.amount}
              className={`bg-card border rounded-lg p-4 flex flex-col ${
                pkg.featured ? "border-primary" : "border-border"
              }`}
            >
              {pkg.discount && (
                <Badge variant="secondary" className="self-start mb-2">
                  {pkg.discount}
                </Badge>
              )}
              
              <div className="text-xl font-bold mb-1">{pkg.amount} Credits</div>
              <div className="text-lg font-medium text-primary mb-2">${pkg.price.toFixed(2)}</div>
              
              <div className="flex items-center text-xs text-muted-foreground mb-4">
                <DollarSign className="h-3 w-3 mr-1" /> USDC/USDT
              </div>
              
              <Button 
                className="mt-auto"
                onClick={() => onBuyCredits(pkg.amount, pkg.price)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Buy with Stablecoin
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 