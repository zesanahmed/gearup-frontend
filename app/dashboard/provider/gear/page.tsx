"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useProviderGear,
  useDeleteGear,
  useUpdateGear,
} from "@/hooks/use-provider";
import type { GearItem } from "@/types/api";

function AvailabilityToggle({ gear }: { gear: GearItem }) {
  const updateGear = useUpdateGear(gear.id);
  return (
    <Switch
      checked={gear.isAvailable}
      onCheckedChange={(checked) => updateGear.mutate({ isAvailable: checked })}
    />
  );
}

function DeleteGearButton({
  gearId,
  gearName,
}: {
  gearId: string;
  gearName: string;
}) {
  const deleteGear = useDeleteGear();
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="ghost" size="sm" className="text-destructive" />
        }
        nativeButton={false}
      >
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {gearName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This cannot be undone. The listing will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteGear.mutate(gearId)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function ProviderGearPage() {
  const { data: gear, isLoading } = useProviderGear();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium">Your Inventory</h2>
        <Button
          render={<Link href="/dashboard/provider/gear/new" />}
          nativeButton={false}
        >
          + Add Gear
        </Button>
      </div>

      {isLoading && <Skeleton className="h-64 w-full" />}

      {!isLoading && gear && gear.length === 0 && (
        <p className="text-muted-foreground py-12 text-center">
          You haven&apos;t listed any gear yet.
        </p>
      )}

      {!isLoading && gear && gear.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price/day</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Available</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gear.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>${item.pricePerDay}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>
                  <AvailabilityToggle gear={item} />
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    render={
                      <Link href={`/dashboard/provider/gear/${item.id}/edit`} />
                    }
                    nativeButton={false}
                  >
                    Edit
                  </Button>
                  <DeleteGearButton gearId={item.id} gearName={item.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
