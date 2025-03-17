import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Copy, DollarSign } from "lucide-react";
import { useToast } from "../ui/use-toast";

export const PaymentDialog = ({
  isOpen,
  onClose,
  packageAmount,
  packagePrice,
  onConfirm,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("USDC");
  const [qrCode, setQrCode] = useState(null);
  const { toast } = useToast();
  
  const paymentAddress = "solana:5FHwkrdxD5AKmYoRvejJZVNBUg5PfEUXLYAQzg8RZxSP";

  useEffect(() => {
    if (isOpen) {
      // Generate QR code using an API
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(paymentAddress)}&size=180x180&margin=1`;
      setQrCode(qrCodeUrl);
    }
  }, [isOpen, paymentAddress]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(paymentAddress);
    toast({
      title: "Address copied",
      description: "Payment address copied to clipboard",
    });
  };

  const handleConfirm = () => {
    onConfirm(paymentMethod);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase Credits</DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-between items-center p-4 bg-muted rounded-md mb-4">
          <div className="text-lg font-bold">{packageAmount} Credits</div>
          <div className="text-lg font-medium text-primary">${packagePrice.toFixed(2)}</div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Select Cryptocurrency</h4>
            <RadioGroup 
              defaultValue={paymentMethod} 
              onValueChange={setPaymentMethod}
              className="space-y-2"
            >
              <div className="flex items-center justify-between space-x-2 p-3 rounded-md border">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="USDC" id="usdc" />
                  <Label htmlFor="usdc" className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" /> USD Coin (USDC)
                  </Label>
                </div>
                <div className="font-medium text-primary">{packagePrice.toFixed(2)} USDC</div>
              </div>
              
              <div className="flex items-center justify-between space-x-2 p-3 rounded-md border">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="USDT" id="usdt" />
                  <Label htmlFor="usdt" className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" /> Tether (USDT)
                  </Label>
                </div>
                <div className="font-medium text-primary">{packagePrice.toFixed(2)} USDT</div>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Payment Details</h4>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Send to this address:</div>
              <div className="p-3 bg-muted rounded-md font-mono text-xs break-all">
                {paymentAddress}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleCopyAddress}
              >
                <Copy className="h-4 w-4 mr-2" /> Copy Address
              </Button>
            </div>
            
            {qrCode && (
              <div className="flex justify-center mt-4 bg-white p-4 rounded-md">
                <img 
                  src={qrCode} 
                  alt="Payment QR Code" 
                  width={180} 
                  height={180} 
                />
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 