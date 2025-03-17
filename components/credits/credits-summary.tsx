import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface CreditsSummaryProps {
  credits: number;
}

export const CreditsSummary: FC<CreditsSummaryProps> = ({ credits }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Available Credits</h3>
            <div className="text-3xl font-bold mt-1">{credits}</div>
          </div>
          <div className="text-sm text-muted-foreground max-w-[50%]">
            <p>Credits are used to send messages in the chat.</p>
            <p>Each message costs 1 credit.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 