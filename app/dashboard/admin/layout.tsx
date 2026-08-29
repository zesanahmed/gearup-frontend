import { DashboardNav } from "@/components/shared/dashboard-nav";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard/admin" },
  { label: "Users", href: "/dashboard/admin/users" },
  { label: "Gear", href: "/dashboard/admin/gear" },
  { label: "Rentals", href: "/dashboard/admin/rentals" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 mx-auto max-w-6xl w-full px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      <DashboardNav items={NAV_ITEMS} />
      {children}
    </main>
  );
}
