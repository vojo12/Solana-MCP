"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";
import { CreditsSummary } from "./credits-summary";
import { CreditsPackages } from "./credits-packages";
import { TransactionHistory } from "./transaction-history";
import { PaymentDialog } from "./payment-dialog";

export const CreditsSection = () => {
  const [credits, setCredits] = useState(100);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState({ amount: 0, price: 0 });
  const [transactions, setTransactions] = useState([
    { date: "2023-07-15", type: "Purchase (SOL)", amount: 100, balance: 100 },
    { date: "2023-07-15", type: "Usage", amount: -5, balance: 95 },
    { date: "2023-07-16", type: "Usage", amount: -10, balance: 85 },
    { date: "2023-07-18", type: "Purchase (USDC)", amount: 50, balance: 135 },
    { date: "2023-07-20", type: "Usage", amount: -35, balance: 100 }
  ]);

  const handleBuyCredits = (amount, price) => {
    setSelectedPackage({ amount, price });
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentConfirm = (paymentMethod) => {
    // Add credits
    setCredits(prev => prev + selectedPackage.amount);
    
    // Add transaction
    const newTransaction = {
      date: new Date().toISOString().split('T')[0],
      type: `Purchase (${paymentMethod})`,
      amount: selectedPackage.amount,
      balance: credits + selectedPackage.amount
    };
    
    setTransactions([newTransaction, ...transactions]);
    setIsPaymentDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Chat Credits</h2>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
      
      <CreditsSummary credits={credits} />
      
      <CreditsPackages onBuyCredits={handleBuyCredits} />
      
      <TransactionHistory transactions={transactions} />
      
      <PaymentDialog 
        isOpen={isPaymentDialogOpen} 
        onClose={() => setIsPaymentDialogOpen(false)}
        packageAmount={selectedPackage.amount}
        packagePrice={selectedPackage.price}
        onConfirm={handlePaymentConfirm}
      />
    </div>
  );
}; 