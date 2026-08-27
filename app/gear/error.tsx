"use client";

import { Button } from "@/components/ui/button";

export default function GearError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-24 gap-4">
      <h2 className="text-lg font-medium">Something went wrong</h2>
      <p className="text-muted-foreground text-sm">
        We couldn&apos;t load the gear listings.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </main>
  );
}
