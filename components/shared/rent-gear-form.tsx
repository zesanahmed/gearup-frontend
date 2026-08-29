"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateRentalOrder } from "@/hooks/use-rentals";
import type { GearItem } from "@/types/api";

export function RentGearForm({ gear }: { gear: GearItem }) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [quantity, setQuantity] = useState(1);
  const createOrder = useCreateRentalOrder();

  const days =
    range?.from && range?.to
      ? Math.max(
          1,
          Math.ceil(
            (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
          ),
        )
      : 0;
  const estimate = days * Number(gear.pricePerDay) * quantity;

  const handleSubmit = () => {
    if (!range?.from || !range?.to) return;
    createOrder.mutate({
      items: [{ gearItemId: gear.id, quantity }],
      startDate: range.from.toISOString(),
      endDate: range.to.toISOString(),
    });
  };

  return (
    <div className="border rounded-lg p-4 space-y-3 mt-6">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className="w-full justify-start font-normal"
            />
          }
        >
          <CalendarIcon className="mr-2 size-4" />
          {range?.from && range?.to
            ? `${format(range.from, "MMM d")} – ${format(range.to, "MMM d, yyyy")}`
            : "Select rental dates"}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={{ before: new Date() }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2">
        <label htmlFor="quantity" className="text-sm">
          Quantity
        </label>
        <Input
          id="quantity"
          type="number"
          min={1}
          max={gear.stock}
          value={quantity}
          onChange={(e) =>
            setQuantity(
              Math.min(gear.stock, Math.max(1, Number(e.target.value) || 1)),
            )
          }
          className="w-20"
        />
        <span className="text-sm text-muted-foreground">
          ({gear.stock} available)
        </span>
      </div>

      {days > 0 && (
        <p className="text-sm">
          {days} day{days > 1 ? "s" : ""} × ${gear.pricePerDay} × {quantity} ={" "}
          <span className="font-semibold">${estimate.toFixed(2)}</span>
        </p>
      )}

      <Button
        className="w-full"
        disabled={!range?.from || !range?.to || createOrder.isPending}
        onClick={handleSubmit}
      >
        {createOrder.isPending ? "Placing order..." : "Rent Now"}
      </Button>
    </div>
  );
}
