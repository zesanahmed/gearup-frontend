import { DashboardNav } from "@/components/shared/dashboard-nav";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard/provider" },
  { label: "Inventory", href: "/dashboard/provider/gear" },
  { label: "Orders", href: "/dashboard/provider/orders" },
];

export default function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Provider Dashboard</h1>
      <DashboardNav items={NAV_ITEMS} />
      {children}
    </main>
  );
}
