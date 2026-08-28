"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <main className="flex-1 flex flex-col items-center justify-center py-24 text-center gap-4 px-4">
      <CheckCircle2 className="size-16 text-green-500" />
      <h1 className="text-2xl font-semibold">Payment Successful</h1>
      <p className="text-muted-foreground max-w-md">
        Your payment has been received. It may take a few seconds for your order
        status to update.
      </p>
      {sessionId && (
        <p className="text-xs text-muted-foreground">Reference: {sessionId}</p>
      )}
      <Button
        render={<Link href="/dashboard/customer/orders" />}
        nativeButton={false}
      >
        View my orders
      </Button>
    </main>
  );
}
