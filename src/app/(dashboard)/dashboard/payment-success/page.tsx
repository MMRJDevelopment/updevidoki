"use client";

import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card/Card";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="max-w-md mx-auto text-center shadow-lg">
        <CardContent className="p-8">
          <CheckCircle className="mx-auto text-green-500 mb-6" size={64} />
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Payment Successful!
          </h1>
        </CardContent>
      </Card>
    </div>
  );
}
