"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-24 text-center gap-4 px-4">
      <XCircle className="size-16 text-destructive" />
      <h1 className="text-2xl font-semibold">Payment Cancelled</h1>
      <p className="text-muted-foreground max-w-md">
        No charge was made. You can try again anytime from your orders page.
      </p>
      <Button
        render={<Link href="/dashboard/customer/orders" />}
        nativeButton={false}
      >
        Back to orders
      </Button>
    </main>
  );
}
