import { prisma } from "@/lib/prisma";
import { Card, Button, Badge } from "@/components/ui";
import Link from "next/link";
import { Plus, Calendar, Clock, Users } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

async function getSessions() {
  return prisma.session_.findMany({
    include: {
      activity: {
        select: {
          title: true,
          partner: { select: { name: true } },
        },
      },
      _count: {
        select: { bookings: { where: { status: "BOOKED" } } },
      },
    },
    orderBy: { startDateTime: "asc" },
  });
}

export default async function SessionsPage() {
  const sessions = await getSessions();
  const now = new Date();
  const upcomingSessions = sessions.filter(
    (s) => new Date(s.startDateTime) > now
  );
  const pastSessions = sessions.filter((s) => new Date(s.startDateTime) <= now);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-kidspass-text">Sessions</h1>
          <p className="text-kidspass-text-muted">
            Manage activity sessions and schedules
          </p>
        </div>
        <Link href="/admin/sessions/new">
          <Button>
            <Plus className="h-5 w-5 mr-2" />
            Add Session
          </Button>
        </Link>
      </div>

      {/* Upcoming sessions */}
      <div>
        <h2 className="text-xl font-bold text-kidspass-text mb-4">
          Upcoming Sessions ({upcomingSessions.length})
        </h2>
        {upcomingSessions.length > 0 ? (
          <div className="space-y-3">
            {upcomingSessions.slice(0, 20).map((session) => (
              <Card key={session.id} padding="md">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-kidspass-text">
                      {session.activity.title}
                    </h3>
                    <p className="text-sm text-kidspass-text-muted">
                      {session.activity.partner.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-kidspass-text-muted">
                      <Calendar className="h-4 w-4" />
                      {formatDate(session.startDateTime)}
                    </div>
                    <div className="flex items-center gap-1 text-kidspass-text-muted">
                      <Clock className="h-4 w-4" />
                      {formatTime(session.startDateTime)}
                    </div>
                    <Badge
                      variant={
                        session._count.bookings >= session.capacity
                          ? "error"
                          : session._count.bookings > session.capacity * 0.7
                          ? "warning"
                          : "success"
                      }
                    >
                      <Users className="h-3 w-3 mr-1" />
                      {session._count.bookings}/{session.capacity}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card padding="lg" className="text-center">
            <p className="text-kidspass-text-muted">No upcoming sessions</p>
          </Card>
        )}
      </div>

      {/* Past sessions */}
      {pastSessions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-kidspass-text mb-4">
            Past Sessions ({pastSessions.length})
          </h2>
          <div className="space-y-3 opacity-60">
            {pastSessions.slice(0, 10).map((session) => (
              <Card key={session.id} padding="md">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-kidspass-text">
                      {session.activity.title}
                    </h3>
                    <p className="text-sm text-kidspass-text-muted">
                      {session.activity.partner.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-kidspass-text-muted">
                      <Calendar className="h-4 w-4" />
                      {formatDate(session.startDateTime)}
                    </div>
                    <Badge variant="default">
                      {session._count.bookings} attended
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

