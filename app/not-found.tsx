import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4 text-center py-24">
      <h2 className="text-lg font-medium">Page not found</h2>
      <p className="text-muted-foreground text-sm">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button render={<Link href="/" />} nativeButton={false}>
        Back to home
      </Button>
    </main>
  );
}
