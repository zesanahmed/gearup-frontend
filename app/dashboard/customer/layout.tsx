import { DashboardNav } from "@/components/shared/dashboard-nav";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard/customer" },
  { label: "My Orders", href: "/dashboard/customer/orders" },
  { label: "Payments", href: "/dashboard/customer/payments" },
];

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Customer Dashboard</h1>
      <DashboardNav items={NAV_ITEMS} />
      {children}
    </main>
  );
}
