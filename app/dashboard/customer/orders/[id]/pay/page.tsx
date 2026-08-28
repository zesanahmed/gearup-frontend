"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PayOrderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    async function createPayment() {
      try {
        const data = await apiClient<{ checkoutUrl: string }>(
          "/payments/create",
          {
            method: "POST",
            body: JSON.stringify({ rentalOrderId: params.id }),
          },
        );
        window.location.href = data.checkoutUrl; // Stripe Checkout-এ সরাসরি পাঠিয়ে দেওয়া
      } catch (err) {
        setStatus("error");
        toast.error((err as Error).message);
      }
    }
    createPayment();
  }, [params.id]);

  if (status === "error") {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">
          Couldn&apos;t start the payment.
        </p>
        <Button
          onClick={() => router.push(`/dashboard/customer/orders/${params.id}`)}
        >
          Back to order
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">Redirecting to secure payment...</p>
    </div>
  );
}
