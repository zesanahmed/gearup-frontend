import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/api";

const STATUS_STYLES: Record<OrderStatus, string> = {
  PLACED: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  CONFIRMED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  PAID: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  PICKED_UP: "bg-green-100 text-green-800 hover:bg-green-100",
  RETURNED: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  CANCELLED: "bg-red-100 text-red-800 hover:bg-red-100",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={STATUS_STYLES[status]} variant="secondary">
      {status.replace("_", " ")}
    </Badge>
  );
}
