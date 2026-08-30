"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GearCard } from "@/components/shared/gear-card";
import { GearGridSkeleton } from "@/components/shared/gear-grid-skeleton";
import { useGearList } from "@/hooks/use-gear";
import Image from "next/image";

export default function HomePage() {
  const { data, isLoading, isError } = useGearList({ limit: 8 });

  return (
    <main className="flex-1">
      <section className="relative border-b overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&q=80"
          alt="Outdoor adventure gear"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />{" "}
        {/* readability-র জন্য dark overlay */}
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight">
            Rent Sports & Outdoor Gear Instantly
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-white/90">
            From camping tents to mountain bikes — find quality gear from local
            providers, ready when you are.
          </p>
          <Button
            render={<Link href="/gear" />}
            nativeButton={false}
            size="lg"
            className="mt-6"
          >
            Browse Gear
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Featured Gear</h2>
          <Link
            href="/gear"
            className="text-sm text-muted-foreground hover:underline"
          >
            View all →
          </Link>
        </div>

        {isLoading && <GearGridSkeleton />}

        {isError && (
          <p className="text-center text-muted-foreground py-12">
            Couldn&apos;t load gear right now. Please try again shortly.
          </p>
        )}

        {data && data.items.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No gear available yet — check back soon!
          </p>
        )}

        {data && data.items.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.items.map((gear) => (
              <GearCard key={gear.id} gear={gear} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
