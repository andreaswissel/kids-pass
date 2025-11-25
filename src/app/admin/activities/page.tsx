import { prisma } from "@/lib/prisma";
import { Card, Button, Badge } from "@/components/ui";
import Link from "next/link";
import { Plus, Edit, Users, MapPin } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/utils";

async function getActivities() {
  return prisma.activity.findMany({
    include: {
      partner: { select: { name: true } },
      _count: {
        select: { sessions: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-kidspass-text">Activities</h1>
          <p className="text-kidspass-text-muted">
            Manage activities on the platform
          </p>
        </div>
        <Link href="/admin/activities/new">
          <Button>
            <Plus className="h-5 w-5 mr-2" />
            Add Activity
          </Button>
        </Link>
      </div>

      {activities.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <Card key={activity.id} padding="md">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-kidspass-text">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-kidspass-text-muted">
                    {activity.partner.name}
                  </p>
                </div>
                <Link href={`/admin/activities/${activity.id}`}>
                  <button className="p-2 hover:bg-bg-cream rounded-full transition-colors">
                    <Edit className="h-4 w-4 text-kidspass-text-muted" />
                  </button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="primary">
                  {CATEGORY_LABELS[activity.category] || activity.category}
                </Badge>
                <Badge variant="default">
                  Ages {activity.ageMin}-{activity.ageMax}
                </Badge>
                <Badge variant="default">
                  {activity._count.sessions} sessions
                </Badge>
              </div>

              {activity.description && (
                <p className="text-sm text-kidspass-text-muted line-clamp-2 mb-3">
                  {activity.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-sm text-kidspass-text-muted">
                <MapPin className="h-4 w-4" />
                <span className="truncate">
                  {activity.locationAddress}, {activity.city}
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="lg" className="text-center">
          <p className="text-5xl mb-4">🎯</p>
          <h3 className="text-xl font-bold text-kidspass-text mb-2">
            No activities yet
          </h3>
          <p className="text-kidspass-text-muted mb-6">
            Create your first activity to get started
          </p>
          <Link href="/admin/activities/new">
            <Button>Create Your First Activity</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

