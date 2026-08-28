import { z } from "zod";

export const gearFormSchema = z.object({
  categoryId: z.string().min(1, "Please select a category"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  brand: z.string().optional(),
  description: z.string().optional(),
  pricePerDay: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  images: z.string().optional(), // textarea-তে newline-separated URL, submit করার আগে array-তে split করব
});

export type GearFormValues = z.infer<typeof gearFormSchema>;
