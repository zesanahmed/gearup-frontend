import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GearItem } from "@/types/api";

export function GearCard({ gear }: { gear: GearItem }) {
  const imageUrl = gear.images?.[0] || "/placeholder-gear.svg";

  return (
    <Link href={`/gear/${gear.id}`}>
      <Card className="overflow-hidden py-0 hover:shadow-md transition-shadow">
        <div className="relative aspect-square bg-muted">
          <Image
            src={imageUrl}
            alt={gear.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          {!gear.isAvailable && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Unavailable
            </Badge>
          )}
        </div>
        <CardContent className="px-4 pt-4">
          {gear.category && (
            <p className="text-xs text-muted-foreground mb-1">
              {gear.category.name}
            </p>
          )}
          <h3 className="font-medium line-clamp-1">{gear.name}</h3>
          {gear.brand && (
            <p className="text-sm text-muted-foreground">{gear.brand}</p>
          )}
        </CardContent>
        <CardFooter className="px-4 pb-4 flex items-baseline justify-between">
          <span className="font-semibold">${gear.pricePerDay}</span>
          <span className="text-xs text-muted-foreground">/ day</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
