"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-auth";

export function LogoutButton() {
  const logout = useLogout();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
    >
      Log out
    </Button>
  );
}
