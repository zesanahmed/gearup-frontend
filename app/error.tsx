"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4 text-center py-24">
      <h2 className="text-lg font-medium">Something went wrong</h2>
      <p className="text-muted-foreground text-sm max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </main>
  );
}
