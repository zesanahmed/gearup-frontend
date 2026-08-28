"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGearDetail } from "@/hooks/use-gear";
import { useSession } from "@/hooks/use-session";
import { RentGearForm } from "@/components/shared/rent-gear-form";

export default function GearDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: gear, isLoading, isError } = useGearDetail(params.id);
  const { data: session, isLoading: sessionLoading } = useSession();

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl w-full px-4 py-8 grid md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      </main>
    );
  }

  if (isError || !gear) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-24 gap-4">
        <h2 className="text-lg font-medium">Gear not found</h2>
        <Button render={<Link href="/gear" />} nativeButton={false}>
          Back to browse
        </Button>
      </main>
    );
  }

  const imageUrl = gear.images?.[0] || "/placeholder-gear.svg";

  return (
    <main className="mx-auto max-w-5xl w-full px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
          <Image src={imageUrl} alt={gear.name} fill className="object-cover" />
          {!gear.isAvailable && (
            <Badge variant="destructive" className="absolute top-3 right-3">
              Currently unavailable
            </Badge>
          )}
        </div>

        <div>
          {gear.category && (
            <Badge variant="secondary" className="mb-2">
              {gear.category.name}
            </Badge>
          )}
          <h1 className="text-2xl font-semibold">{gear.name}</h1>
          {gear.brand && <p className="text-muted-foreground">{gear.brand}</p>}

          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-2xl font-bold">${gear.pricePerDay}</span>
            <span className="text-muted-foreground">/ day</span>
          </div>

          {gear.description && (
            <p className="mt-4 text-sm text-muted-foreground">
              {gear.description}
            </p>
          )}

          {gear.provider && (
            <p className="mt-4 text-sm">
              Offered by{" "}
              <span className="font-medium">{gear.provider.name}</span>
            </p>
          )}

          <p className="text-sm text-muted-foreground mt-1">
            {gear.stock} in stock
          </p>

          {!sessionLoading && !session && (
            <Button
              render={<Link href={`/auth/login?redirectTo=/gear/${gear.id}`} />}
              nativeButton={false}
              size="lg"
              className="mt-6 w-full"
            >
              Sign in to Rent
            </Button>
          )}

          {session?.role === "CUSTOMER" &&
            gear.isAvailable &&
            gear.stock > 0 && <RentGearForm gear={gear} />}

          {session && session.role !== "CUSTOMER" && (
            <p className="text-sm text-muted-foreground mt-6">
              Only customer accounts can rent gear.
            </p>
          )}
        </div>
      </div>

      {gear.reviews && gear.reviews.length > 0 && (
        <>
          <Separator className="my-10" />
          <h2 className="text-lg font-semibold mb-4">Reviews</h2>
          <div className="space-y-4">
            {gear.reviews.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {review.customer?.name}
                  </span>
                  <span className="text-yellow-500 text-sm">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
