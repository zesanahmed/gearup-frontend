"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAllRentalsAdmin } from "@/hooks/use-admin";

export default function AdminRentalsPage() {
  const { data: rentals, isLoading } = useAllRentalsAdmin();

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rentals?.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium text-sm">
              {order.items.map((i) => i.gearItem.name).join(", ")}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {order.customer?.name}
            </TableCell>
            <TableCell>${order.totalAmount}</TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {new Date(order.startDate).toLocaleDateString()} –{" "}
              {new Date(order.endDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <StatusBadge status={order.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
