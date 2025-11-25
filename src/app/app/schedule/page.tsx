"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TopNav } from "@/components/layout";
import { Card, Badge, Button, Tabs, TabsList, TabsTrigger, TabsContent, Modal } from "@/components/ui";
import { Calendar, Clock, MapPin, X, AlertCircle } from "lucide-react";
import { formatDate, formatTime, CATEGORY_LABELS } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";

interface Booking {
  id: string;
  status: string;
  child: {
    id: string;
    name: string;
  };
  session: {
    id: string;
    startDateTime: string;
    endDateTime: string;
    activity: {
      id: string;
      title: string;
      category: string;
      locationAddress: string;
      partner: {
        name: string;
      };
    };
  };
}

export default function SchedulePage() {
  const queryClient = useQueryClient();
  const [cancelBooking, setCancelBooking] = useState<Booking | null>(null);
  const [cancelError, setCancelError] = useState("");

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<Booking[]>;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to cancel");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setCancelBooking(null);
    },
    onError: (error: Error) => {
      setCancelError(error.message);
    },
  });

  const now = new Date();
  const upcomingBookings = bookings?.filter(
    (b) => b.status === "BOOKED" && new Date(b.session.startDateTime) > now
  ) || [];
  const pastBookings = bookings?.filter(
    (b) => b.status !== "BOOKED" || new Date(b.session.startDateTime) <= now
  ) || [];

  const handleCancelClick = (booking: Booking) => {
    setCancelError("");
    setCancelBooking(booking);
  };

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

  const BookingCard = ({ booking, showCancel = false }: { booking: Booking; showCancel?: boolean }) => (
    <Card padding="md" className="mb-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <Link
              href={`/app/activities/${booking.session.activity.id}`}
              className="font-bold text-kidspass-text hover:text-primary transition-colors"
            >
              {booking.session.activity.title}
            </Link>
            {getStatusBadge(booking.status)}
          </div>

          <div className="space-y-1 text-sm text-kidspass-text-muted">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(booking.session.startDateTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {formatTime(booking.session.startDateTime)} - {formatTime(booking.session.endDateTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{booking.session.activity.partner.name}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Badge variant="default" size="sm">
              {booking.child.name}
            </Badge>
            <Badge variant="default" size="sm">
              {CATEGORY_LABELS[booking.session.activity.category]}
            </Badge>
          </div>
        </div>

        {showCancel && booking.status === "BOOKED" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCancelClick(booking)}
            className="text-kidspass-text-muted hover:text-error"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="py-6 space-y-6">
      <TopNav title="My Schedule" />

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-bg-cream rounded-[var(--radius-lg)] animate-pulse" />
              ))}
            </div>
          ) : upcomingBookings.length > 0 ? (
            <div>
              {upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} showCancel />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">📅</p>
              <h3 className="text-xl font-bold text-kidspass-text mb-2">
                No upcoming activities
              </h3>
              <p className="text-kidspass-text-muted mb-6">
                Time to book your next adventure!
              </p>
              <Link href="/app/activities">
                <Button>Browse Activities</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-bg-cream rounded-[var(--radius-lg)] animate-pulse" />
              ))}
            </div>
          ) : pastBookings.length > 0 ? (
            <div>
              {pastBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">📚</p>
              <h3 className="text-xl font-bold text-kidspass-text mb-2">
                No past activities
              </h3>
              <p className="text-kidspass-text-muted">
                Your activity history will appear here
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel confirmation modal */}
      <Modal
        isOpen={!!cancelBooking}
        onClose={() => setCancelBooking(null)}
        title="Cancel Booking"
      >
        {cancelBooking && (
          <div className="space-y-4">
            {cancelError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[var(--radius-md)] text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {cancelError}
              </div>
            )}

            <p className="text-kidspass-text">
              Are you sure you want to cancel the booking for{" "}
              <strong>{cancelBooking.session.activity.title}</strong> on{" "}
              <strong>{formatDate(cancelBooking.session.startDateTime)}</strong>?
            </p>

            <p className="text-sm text-kidspass-text-muted">
              You can cancel up to 24 hours before the activity starts.
              Your credit will be restored.
            </p>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setCancelBooking(null)}
                className="flex-1"
              >
                Keep Booking
              </Button>
              <Button
                variant="danger"
                onClick={() => cancelMutation.mutate(cancelBooking.id)}
                isLoading={cancelMutation.isPending}
                className="flex-1"
              >
                Cancel Booking
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

