"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllUsers,
  useAllGearAdmin,
  useAllRentalsAdmin,
} from "@/hooks/use-admin";

export default function AdminOverviewPage() {
  const { data: users, isLoading: usersLoading } = useAllUsers();
  const { data: gear, isLoading: gearLoading } = useAllGearAdmin();
  const { data: rentals, isLoading: rentalsLoading } = useAllRentalsAdmin();

  const activeRentals =
    rentals?.filter((r) =>
      ["PAID", "PICKED_UP", "CONFIRMED"].includes(r.status),
    ).length ?? 0;

  const stats = [
    { label: "Total Users", value: users?.length, loading: usersLoading },
    {
      label: "Active Gear Listings",
      value: gear?.length,
      loading: gearLoading,
    },
    { label: "Total Rentals", value: rentals?.length, loading: rentalsLoading },
    { label: "Active Rentals", value: activeRentals, loading: rentalsLoading },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
