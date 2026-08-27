"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GearCard } from "@/components/shared/gear-card";
import { GearGridSkeleton } from "@/components/shared/gear-grid-skeleton";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { useGearList, useCategories } from "@/hooks/use-gear";

export default function GearBrowsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = (searchParams.get("category") || undefined) as
    | string
    | undefined;
  const search = (searchParams.get("search") || undefined) as
    | string
    | undefined;
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const { data: categories } = useCategories();
  const { data, isLoading, isError } = useGearList({
    category,
    search,
    minPrice,
    maxPrice,
    page,
    limit: 12,
  });

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      // filter পাল্টালে page 1-এ ফিরিয়ে আনি (page ছাড়া অন্য কিছু পাল্টালে)
      if (!("page" in updates)) {
        params.delete("page");
      }
      router.push(`/gear?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Browse Gear</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Input
          placeholder="Search gear..."
          defaultValue={search}
          className="max-w-52"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParams({ search: e.currentTarget.value });
            }
          }}
        />
        <Select
          value={category || "all"}
          onValueChange={(val) =>
            updateParams({ category: val && val !== "all" ? val : undefined })
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Min price"
          defaultValue={minPrice}
          className="w-28"
          onBlur={(e) =>
            updateParams({ minPrice: e.currentTarget.value || undefined })
          }
        />
        <Input
          type="number"
          placeholder="Max price"
          defaultValue={maxPrice}
          className="w-28"
          onBlur={(e) =>
            updateParams({ maxPrice: e.currentTarget.value || undefined })
          }
        />
      </div>

      {isLoading && <GearGridSkeleton count={12} />}

      {isError && (
        <p className="text-center text-muted-foreground py-12">
          Couldn&apos;t load gear right now. Please try again.
        </p>
      )}

      {data && data.items.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No gear matches your filters. Try adjusting them.
        </p>
      )}

      {data && data.items.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.items.map((gear) => (
              <GearCard key={gear.id} gear={gear} />
            ))}
          </div>
          <PaginationControls
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={(newPage) => updateParams({ page: String(newPage) })}
          />
        </>
      )}
    </main>
  );
}
