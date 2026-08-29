"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { useAllUsers, useUpdateUserStatus } from "@/hooks/use-admin";

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAllUsers();
  const updateStatus = useUpdateUserStatus();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // সার্চ করলে প্রথম পাতায় ফিরিয়ে আনি
        }}
        className="max-w-sm"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{user.role}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.status === "ACTIVE" ? "secondary" : "destructive"
                  }
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {user.role !== "ADMIN" && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={updateStatus.isPending}
                    onClick={() =>
                      updateStatus.mutate({
                        userId: user.id,
                        status:
                          user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
                      })
                    }
                  >
                    {user.status === "ACTIVE" ? "Suspend" : "Activate"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pageItems.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No users found.
        </p>
      )}

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
