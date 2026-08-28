"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProviderGear, useProviderOrders } from "@/hooks/use-provider";

export default function ProviderOverviewPage() {
  const { data: gear, isLoading: gearLoading } = useProviderGear();
  const { data: orders, isLoading: ordersLoading } = useProviderOrders();

  const pendingCount = orders?.filter((o) => o.status === "PLACED").length ?? 0;
  const activeRentals =
    orders?.filter((o) => ["PAID", "PICKED_UP"].includes(o.status)).length ?? 0;

  const stats = [
    { label: "Gear Listed", value: gear?.length, loading: gearLoading },
    { label: "Pending Orders", value: pendingCount, loading: ordersLoading },
    { label: "Active Rentals", value: activeRentals, loading: ordersLoading },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stat.loading ? (
              <Skeleton className="h-8 w-10" />
            ) : (
              <p className="text-3xl font-bold">{stat.value ?? 0}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
