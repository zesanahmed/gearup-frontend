import Link from "next/link";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/shared/logout-button";

const DASHBOARD_LINK: Record<string, string> = {
  CUSTOMER: "/dashboard/customer",
  PROVIDER: "/dashboard/provider",
  ADMIN: "/dashboard/admin",
};

export async function Navbar() {
  const session = await getSession();

  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          GearUp
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/gear"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Browse Gear
          </Link>

          {session ? (
            <>
              <Link
                href={DASHBOARD_LINK[session.role]}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                render={<Link href="/auth/login" />}
                nativeButton={false}
              >
                Sign in
              </Button>
              <Button
                size="sm"
                render={<Link href="/auth/register" />}
                nativeButton={false}
              >
                Get started
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
