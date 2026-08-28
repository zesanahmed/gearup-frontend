"use client";

import { Button } from "@/components/ui/button";
import { useUpdateOrderStatus } from "@/hooks/use-provider";
import type { OrderStatus } from "@/types/api";

const NEXT_ACTION: Partial<
  Record<OrderStatus, { label: string; next: OrderStatus }>
> = {
  PLACED: { label: "Confirm", next: "CONFIRMED" },
  PAID: { label: "Mark Picked Up", next: "PICKED_UP" },
  PICKED_UP: { label: "Mark Returned", next: "RETURNED" },
};

export function OrderStatusAction({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const updateStatus = useUpdateOrderStatus();
  const action = NEXT_ACTION[status];

  if (!action) {
    return <span className="text-xs text-muted-foreground">No action</span>;
  }

  return (
    <Button
      size="sm"
      onClick={() => updateStatus.mutate({ orderId, status: action.next })}
      disabled={updateStatus.isPending}
    >
      {action.label}
    </Button>
  );
}
