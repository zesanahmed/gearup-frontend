"use client";

import Link from "next/link";
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
import { useAllGearAdmin } from "@/hooks/use-admin";

export default function AdminGearPage() {
  const { data: gear, isLoading } = useAllGearAdmin();

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price/day</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gear?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              <Link href={`/gear/${item.id}`} className="hover:underline">
                {item.name}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {item.provider?.name}
            </TableCell>
            <TableCell>{item.category?.name}</TableCell>
            <TableCell>${item.pricePerDay}</TableCell>
            <TableCell>{item.stock}</TableCell>
            <TableCell>
              <Badge variant={item.isAvailable ? "secondary" : "destructive"}>
                {item.isAvailable ? "Available" : "Unavailable"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
