"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { OrderStatusAction } from "@/components/shared/order-status-action";
import { useProviderOrders } from "@/hooks/use-provider";

export default function ProviderOrdersPage() {
  const { data: orders, isLoading } = useProviderOrders();

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  if (!orders || orders.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center">
        No incoming orders yet.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <p className="font-medium text-sm">
                {order.items.map((i) => i.gearItem.name).join(", ")}
              </p>
              <p className="text-xs text-muted-foreground">
                ${order.totalAmount}
              </p>
            </TableCell>
            <TableCell className="text-sm">{order.customer?.name}</TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {new Date(order.startDate).toLocaleDateString()} –{" "}
              {new Date(order.endDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <StatusBadge status={order.status} />
            </TableCell>
            <TableCell className="text-right">
              <OrderStatusAction orderId={order.id} status={order.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
