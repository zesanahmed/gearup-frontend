"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { gearFormSchema, type GearFormValues } from "@/lib/validations/gear";
import { useCategories } from "@/hooks/use-gear";
import type { GearItem } from "@/types/api";

interface GearFormProps {
  defaultValues?: Partial<GearItem>;
  onSubmit: (values: {
    categoryId: string;
    name: string;
    brand?: string;
    description?: string;
    pricePerDay: number;
    stock: number;
    images?: string[];
  }) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export function GearForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: GearFormProps) {
  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GearFormValues>({
    resolver: zodResolver(gearFormSchema),
    defaultValues: {
      categoryId: defaultValues?.categoryId ?? "",
      name: defaultValues?.name ?? "",
      brand: defaultValues?.brand ?? "",
      description: defaultValues?.description ?? "",
      pricePerDay: defaultValues?.pricePerDay
        ? Number(defaultValues.pricePerDay)
        : undefined,
      stock: defaultValues?.stock ?? undefined,
      images: defaultValues?.images?.join("\n") ?? "",
    },
  });

  const submit = (values: GearFormValues) => {
    onSubmit({
      categoryId: values.categoryId,
      name: values.name,
      brand: values.brand || undefined,
      description: values.description || undefined,
      pricePerDay: values.pricePerDay,
      stock: values.stock,
      images: values.images
        ? values.images
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          defaultValue={defaultValues?.categoryId}
          onValueChange={(val) => val && setValue("categoryId", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="text-sm text-destructive">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Gear name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="brand">Brand (optional)</Label>
        <Input id="brand" {...register("brand")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pricePerDay">Price per day ($)</Label>
          <Input
            id="pricePerDay"
            type="number"
            step="0.01"
            {...register("pricePerDay")}
          />
          {errors.pricePerDay && (
            <p className="text-sm text-destructive">
              {errors.pricePerDay.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" {...register("stock")} />
          {errors.stock && (
            <p className="text-sm text-destructive">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Image URLs (one per line, optional)</Label>
        <Textarea
          id="images"
          rows={3}
          placeholder="https://example.com/photo1.jpg"
          {...register("images")}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
