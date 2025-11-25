import { prisma } from "@/lib/prisma";
import { Card, Badge } from "@/components/ui";
import { Calendar, Clock, User } from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";

async function getBookings() {
  return prisma.booking.findMany({
    include: {
      child: { select: { name: true } },
      user: { select: { name: true, email: true } },
      session: {
        include: {
          activity: {
            select: {
              title: true,
              partner: { select: { name: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export default async function BookingsPage() {
  const bookings = await getBookings();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "BOOKED":
        return <Badge variant="primary">Booked</Badge>;
      case "ATTENDED":
        return <Badge variant="success">Attended</Badge>;
      case "CANCELLED":
        return <Badge variant="error">Cancelled</Badge>;
      case "NO_SHOW":
        return <Badge variant="warning">No Show</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-kidspass-text">Bookings</h1>
        <p className="text-kidspass-text-muted">
          View and manage all bookings on the platform
        </p>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <Card key={booking.id} padding="md">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-kidspass-text">
                    {booking.session.activity.title}
                  </h3>
                  <p className="text-sm text-kidspass-text-muted">
                    {booking.session.activity.partner.name}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-sm">
                    <div className="flex items-center gap-1 text-kidspass-text-muted">
                      <User className="h-4 w-4" />
                      <span className="font-medium text-kidspass-text">
                        {booking.child.name}
                      </span>
                    </div>
                    <p className="text-kidspass-text-muted text-xs">
                      {booking.user.name}
                    </p>
                  </div>

                  <div className="text-sm text-kidspass-text-muted">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(booking.session.startDateTime)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTime(booking.session.startDateTime)}
                    </div>
                  </div>

                  {getStatusBadge(booking.status)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="lg" className="text-center">
          <p className="text-5xl mb-4">📋</p>
          <h3 className="text-xl font-bold text-kidspass-text mb-2">
            No bookings yet
          </h3>
          <p className="text-kidspass-text-muted">
            Bookings will appear here once users start booking activities
          </p>
        </Card>
      )}
    </div>
  );
}

