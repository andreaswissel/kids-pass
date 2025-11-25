import { prisma } from "@/lib/prisma";
import { Card, Badge } from "@/components/ui";
import { User, Calendar, CreditCard } from "lucide-react";

async function getUsers() {
  return prisma.user.findMany({
    where: { role: "PARENT" },
    include: {
      _count: {
        select: { children: true, bookings: true },
      },
      subscription: {
        select: { status: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-kidspass-text">Users</h1>
        <p className="text-kidspass-text-muted">
          Manage parent accounts on the platform
        </p>
      </div>

      {users.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user.id} padding="md">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                    <User className="h-5 w-5 text-kidspass-text" />
                  </div>
                  <div>
                    <h3 className="font-bold text-kidspass-text">
                      {user.name || "No name"}
                    </h3>
                    <p className="text-sm text-kidspass-text-muted">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="default">
                  {user._count.children} children
                </Badge>
                <Badge variant="default">
                  {user._count.bookings} bookings
                </Badge>
                {user.subscription ? (
                  <Badge
                    variant={
                      user.subscription.status === "ACTIVE"
                        ? "success"
                        : "warning"
                    }
                  >
                    <CreditCard className="h-3 w-3 mr-1" />
                    {user.subscription.status}
                  </Badge>
                ) : (
                  <Badge variant="warning">No subscription</Badge>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-kidspass-text-muted">
                <Calendar className="h-3 w-3" />
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="lg" className="text-center">
          <p className="text-5xl mb-4">👥</p>
          <h3 className="text-xl font-bold text-kidspass-text mb-2">
            No users yet
          </h3>
          <p className="text-kidspass-text-muted">
            Users will appear here once they sign up
          </p>
        </Card>
      )}
    </div>
  );
}

