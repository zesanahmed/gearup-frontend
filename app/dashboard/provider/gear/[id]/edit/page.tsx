"use client";

import { useParams, useRouter } from "next/navigation";
import { GearForm } from "@/components/shared/gear-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useGearDetail } from "@/hooks/use-gear";
import { useUpdateGear } from "@/hooks/use-provider";

export default function EditGearPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: gear, isLoading } = useGearDetail(params.id);
  const updateGear = useUpdateGear(params.id);

  if (isLoading) return <Skeleton className="h-96 w-full max-w-lg" />;
  if (!gear) return <p className="text-muted-foreground">Gear not found.</p>;

  return (
    <div>
      <h2 className="font-medium mb-4">Edit {gear.name}</h2>
      <GearForm
        defaultValues={gear}
        onSubmit={(values) =>
          updateGear.mutate(values, {
            onSuccess: () => router.push("/dashboard/provider/gear"),
          })
        }
        isSubmitting={updateGear.isPending}
        submitLabel="Save Changes"
      />
    </div>
  );
}
