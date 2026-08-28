"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyOrders, useCancelOrder } from "@/hooks/use-rentals";

export default function CustomerOrdersPage() {
  const { data: orders, isLoading } = useMyOrders();
  const cancelOrder = useCancelOrder();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-12 text-center">
        You haven&apos;t placed any orders yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-md p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">
                {order.items
                  .map((i) => `${i.gearItem.name} ×${i.quantity}`)
                  .join(", ")}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(order.startDate).toLocaleDateString()} —{" "}
                {new Date(order.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm font-medium mt-1">${order.totalAmount}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              render={<Link href={`/dashboard/customer/orders/${order.id}`} />}
              nativeButton={false}
            >
              View details
            </Button>

            {order.status === "CONFIRMED" && (
              <Button
                size="sm"
                render={
                  <Link href={`/dashboard/customer/orders/${order.id}/pay`} />
                }
                nativeButton={false}
              >
                Pay Now
              </Button>
            )}

            {order.status === "PLACED" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => cancelOrder.mutate(order.id)}
                disabled={cancelOrder.isPending}
              >
                Cancel
              </Button>
            )}

            {order.status === "RETURNED" && (
              <Button
                variant="outline"
                size="sm"
                render={
                  <Link
                    href={`/gear/${order.items[0]?.gearItemId}?review=true`}
                  />
                }
                nativeButton={false}
              >
                Leave Review
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
