"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

export const SettingsSection = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    language: "en",
    autoRefresh: true,
    refreshInterval: 60,
    notifications: true,
    hideBalances: false,
    transactionLimit: 10,
    creditCostPerMessage: 1
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem("settings", JSON.stringify(settings));
    
    // Show success toast
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Settings</h2>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" /> Save
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="language">Interface Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => handleChange("language", value)}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="th">Thai</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            Change the language of the user interface. This will affect all text in the application.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Refresh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-refresh">Auto Refresh Market Data</Label>
            <Switch
              id="auto-refresh"
              checked={settings.autoRefresh}
              onCheckedChange={(checked) => handleChange("autoRefresh", checked)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
            <Input
              id="refresh-interval"
              type="number"
              min={10}
              max={300}
              value={settings.refreshInterval}
              onChange={(e) => handleChange("refreshInterval", parseInt(e.target.value))}
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            Configure how often market data is automatically refreshed.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Enable Notifications</Label>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => handleChange("notifications", checked)}
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            Receive notifications for important events like completed transactions.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="hide-balances">Hide Balances</Label>
            <Switch
              id="hide-balances"
              checked={settings.hideBalances}
              onCheckedChange={(checked) => handleChange("hideBalances", checked)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="transaction-limit">Transaction Limit (SOL)</Label>
            <Input
              id="transaction-limit"
              type="number"
              min={0}
              value={settings.transactionLimit}
              onChange={(e) => handleChange("transactionLimit", parseFloat(e.target.value))}
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            Set security preferences to protect your account and transactions.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Credits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="credit-cost">Credit Cost Per Message</Label>
            <Input
              id="credit-cost"
              type="number"
              min={1}
              max={10}
              value={settings.creditCostPerMessage}
              onChange={(e) => handleChange("creditCostPerMessage", parseInt(e.target.value))}
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            Configure how many credits are used for each message sent in the chat.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}; 