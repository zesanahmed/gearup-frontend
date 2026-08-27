import { GearGridSkeleton } from "@/components/shared/gear-grid-skeleton";

export default function Loading() {
  return (
    <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-8">
      <div className="h-8 w-40 bg-muted rounded animate-pulse mb-6" />
      <GearGridSkeleton count={12} />
    </main>
  );
}
