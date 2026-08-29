"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "@/hooks/use-reviews";
import { cn } from "@/lib/utils";

export function ReviewForm({ gearItemId }: { gearItemId: string }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const createReview = useCreateReview(gearItemId);

  const submit = () => {
    if (rating === 0) return;
    createReview.mutate(
      { rating, comment: comment || undefined },
      {
        onSuccess: () => {
          setRating(0);
          setComment("");
        },
      },
    );
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <p className="text-sm font-medium">Leave a review</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            aria-label={`Rate ${star} stars`}
          >
            <Star
              className={cn(
                "size-6 transition-colors",
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground",
              )}
            />
          </button>
        ))}
      </div>
      <Textarea
        placeholder="How was the gear? (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <Button
        onClick={submit}
        disabled={rating === 0 || createReview.isPending}
      >
        {createReview.isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  );
}
