"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMyPayments } from "@/hooks/use-payments";

const STATUS_VARIANT: Record<string, "secondary" | "destructive" | "outline"> =
  {
    COMPLETED: "secondary",
    PENDING: "outline",
    FAILED: "destructive",
  };

export default function CustomerPaymentsPage() {
  const { data: payments, isLoading } = useMyPayments();

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  if (!payments || payments.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center">
        No payments yet.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-mono text-xs">
              {payment.transactionId.slice(0, 16)}...
            </TableCell>
            <TableCell>${payment.amount}</TableCell>
            <TableCell>{payment.method}</TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[payment.status] ?? "outline"}>
                {payment.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {payment.paidAt
                ? new Date(payment.paidAt).toLocaleDateString()
                : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
