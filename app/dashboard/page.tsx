"use client"

import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import { useUsersStore } from "@/store/table-store";


export default function DashboardPage() {
  const users = useUsersStore((s) => s.users);

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (u) => u.status === "active"
  ).length;

  const inactiveUsers = users.filter(
    (u) => u.status === "inactive"
  ).length;

  const onLeaveUsers = users.filter(
    (u) => u.status === "on-leave"
  ).length;

  const departments = new Set(users.map((u) => u.department)).size;

  const adminUsers = users.filter((u) => u.role === "Admin").length;
  const managers = users.filter((u) => u.role === "Manager").length;
  const supportUsers = users.filter((u) => u.role === "Support").length;


  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your team performance and structure.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Employees" value={totalUsers} />
          <StatCard title="Active Employees" value={activeUsers} />
          <StatCard title="Inactive Employees" value={inactiveUsers} />
          <StatCard title="On Leave" value={onLeaveUsers} />
        </div>

        {/* Second Row */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Departments"
            value={departments}
          />
          <StatCard
            title="Admins"
            value={adminUsers}
          />
          <StatCard
            title="Managers"
            value={managers}
          />
          <StatCard
            title="Support Users"
            value={supportUsers}
          />

        </div>

        {/* Simple List Preview */}
        <div className="rounded-2xl border bg-white dark:border-white/55 dark:bg-slate-900 p-6">
          <h2 className="text-lg font-semibold mb-4">
            Recent Employees
          </h2>

          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between border-b last:border-none py-2"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.role} • {user.department}
                  </p>
                </div>

                <span className="text-sm font-mono">
                  {user.email}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border bg-white dark:border-white/55 dark:bg-slate-900 p-6 hover:shadow-sm transition">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}