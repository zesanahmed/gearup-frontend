"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { useOrderDetail, useCancelOrder } from "@/hooks/use-rentals";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrderDetail(params.id);
  const cancelOrder = useCancelOrder();

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!order) {
    return (
      <p className="text-muted-foreground py-12 text-center">
        Order not found.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h2>
        <StatusBadge status={order.status} />
      </div>

      <div className="border rounded-md p-4 space-y-2">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.gearItem.name} × {item.quantity}
            </span>
            <span>${item.priceAtBooking} /day</span>
          </div>
        ))}
        <div className="border-t pt-2 flex justify-between font-medium">
          <span>Total</span>
          <span>${order.totalAmount}</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {new Date(order.startDate).toLocaleDateString()} —{" "}
        {new Date(order.endDate).toLocaleDateString()}
      </p>

      {order.payment && (
        <p className="text-sm">
          Payment status:{" "}
          <span className="font-medium">{order.payment.status}</span>
        </p>
      )}

      <div className="flex gap-2">
        {order.status === "CONFIRMED" && (
          <Button
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
            onClick={() => cancelOrder.mutate(order.id)}
            disabled={cancelOrder.isPending}
          >
            Cancel Order
          </Button>
        )}
        {order.status === "RETURNED" && (
          <Button
            variant="outline"
            render={<Link href={`/gear/${order.items[0]?.gearItemId}`} />}
            nativeButton={false}
          >
            Leave Review
          </Button>
        )}
      </div>
    </div>
  );
}
