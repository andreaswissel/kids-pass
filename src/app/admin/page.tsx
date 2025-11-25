import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui";
import Link from "next/link";
import { Users, Building, Calendar, Ticket, TrendingUp } from "lucide-react";

async function getStats() {
  const [users, partners, activities, sessions, bookings] = await Promise.all([
    prisma.user.count({ where: { role: "PARENT" } }),
    prisma.partner.count(),
    prisma.activity.count(),
    prisma.session_.count({ where: { startDateTime: { gt: new Date() } } }),
    prisma.booking.count({ where: { status: "BOOKED" } }),
  ]);

  return { users, partners, activities, sessions, bookings };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: Users,
      href: "/admin/users",
      color: "bg-accent-sky",
    },
    {
      title: "Partners",
      value: stats.partners,
      icon: Building,
      href: "/admin/partners",
      color: "bg-accent-mint",
    },
    {
      title: "Activities",
      value: stats.activities,
      icon: TrendingUp,
      href: "/admin/activities",
      color: "bg-accent-butter",
    },
    {
      title: "Upcoming Sessions",
      value: stats.sessions,
      icon: Calendar,
      href: "/admin/sessions",
      color: "bg-accent-lavender",
    },
    {
      title: "Active Bookings",
      value: stats.bookings,
      icon: Ticket,
      href: "/admin/bookings",
      color: "bg-accent-coral",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-kidspass-text">Dashboard</h1>
        <p className="text-kidspass-text-muted">
          Overview of your KidsPass platform
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card
              padding="md"
              hover
              className={`${stat.color} border-0`}
            >
              <div className="flex items-center gap-3">
                <stat.icon className="h-8 w-8 text-kidspass-text/70" />
                <div>
                  <p className="text-3xl font-bold text-kidspass-text">
                    {stat.value}
                  </p>
                  <p className="text-sm text-kidspass-text-muted">{stat.title}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card padding="lg">
          <h2 className="text-xl font-bold text-kidspass-text mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/partners/new"
              className="block p-3 bg-bg-cream rounded-[var(--radius-md)] hover:bg-primary-light transition-colors"
            >
              <p className="font-semibold text-kidspass-text">Add New Partner</p>
              <p className="text-sm text-kidspass-text-muted">
                Register a new activity provider
              </p>
            </Link>
            <Link
              href="/admin/activities/new"
              className="block p-3 bg-bg-cream rounded-[var(--radius-md)] hover:bg-primary-light transition-colors"
            >
              <p className="font-semibold text-kidspass-text">
                Create New Activity
              </p>
              <p className="text-sm text-kidspass-text-muted">
                Add a new activity to the platform
              </p>
            </Link>
            <Link
              href="/admin/sessions/new"
              className="block p-3 bg-bg-cream rounded-[var(--radius-md)] hover:bg-primary-light transition-colors"
            >
              <p className="font-semibold text-kidspass-text">
                Schedule Sessions
              </p>
              <p className="text-sm text-kidspass-text-muted">
                Create new activity sessions
              </p>
            </Link>
          </div>
        </Card>

        <Card padding="lg">
          <h2 className="text-xl font-bold text-kidspass-text mb-4">
            Recent Activity
          </h2>
          <div className="text-center py-8 text-kidspass-text-muted">
            <p>Activity feed coming soon</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

