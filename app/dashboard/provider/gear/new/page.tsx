"use client";

import { useRouter } from "next/navigation";
import { GearForm } from "@/components/shared/gear-form";
import { useCreateGear } from "@/hooks/use-provider";

export default function NewGearPage() {
  const router = useRouter();
  const createGear = useCreateGear();

  return (
    <div>
      <h2 className="font-medium mb-4">Add New Gear</h2>
      <GearForm
        onSubmit={(values) =>
          createGear.mutate(values, {
            onSuccess: () => router.push("/dashboard/provider/gear"),
          })
        }
        isSubmitting={createGear.isPending}
        submitLabel="Add Gear"
      />
    </div>
  );
}
