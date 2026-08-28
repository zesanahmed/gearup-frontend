"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyOrders } from "@/hooks/use-rentals";

export default function CustomerOverviewPage() {
  const { data: orders, isLoading } = useMyOrders();

  const activeCount =
    orders?.filter((o) =>
      ["PLACED", "CONFIRMED", "PAID", "PICKED_UP"].includes(o.status),
    ).length ?? 0;

  const recentOrders = orders?.slice(0, 5) ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">
              Active Rentals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <p className="text-3xl font-bold">{activeCount}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <p className="text-3xl font-bold">{orders?.length ?? 0}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="font-medium mb-3">Recent Orders</h2>
        {isLoading && <Skeleton className="h-32 w-full" />}
        {!isLoading && recentOrders.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No orders yet.{" "}
            <Link href="/gear" className="text-primary hover:underline">
              Browse gear
            </Link>{" "}
            to get started.
          </p>
        )}
        <div className="space-y-2">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/customer/orders/${order.id}`}
              className="flex items-center justify-between border rounded-md p-3 hover:bg-muted/50"
            >
              <div>
                <p className="text-sm font-medium">
                  {order.items.map((i) => i.gearItem.name).join(", ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  ${order.totalAmount} ·{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
