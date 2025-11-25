"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { TopNav } from "@/components/layout";
import { Button, Badge, Card, Select, Modal } from "@/components/ui";
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  ArrowLeft,
  Check,
  AlertCircle
} from "lucide-react";
import { formatDate, formatTime, CATEGORY_LABELS, calculateAge } from "@/lib/utils";

interface Session {
  id: string;
  startDateTime: string;
  endDateTime: string;
  capacity: number;
  _count?: { bookings: number };
}

interface Activity {
  id: string;
  title: string;
  description: string | null;
  category: string;
  ageMin: number;
  ageMax: number;
  animalIcon: string | null;
  locationAddress: string;
  city: string;
  partner: {
    name: string;
    description: string | null;
  };
  sessions: Session[];
}

interface Child {
  id: string;
  name: string;
  birthDate: string;
}

// Animal SVG components
const AnimalHero: Record<string, React.FC<{ className?: string }>> = {
  fox: ({ className }) => (
    <svg viewBox="0 0 200 200" className={className}>
      <ellipse cx="100" cy="120" rx="45" ry="55" fill="#E8A855" />
      <ellipse cx="100" cy="110" rx="35" ry="42" fill="#FAE5C3" />
      <circle cx="85" cy="100" r="6" fill="#2D3B3B" />
      <circle cx="115" cy="100" r="6" fill="#2D3B3B" />
      <ellipse cx="100" cy="115" rx="8" ry="6" fill="#2D3B3B" />
      <polygon points="55,50 80,100 30,100" fill="#E8A855" />
      <polygon points="145,50 120,100 170,100" fill="#E8A855" />
      <polygon points="62,60 75,92 40,92" fill="#FAE5C3" />
      <polygon points="138,60 125,92 160,92" fill="#FAE5C3" />
      <rect x="85" y="165" width="30" height="20" rx="5" fill="#5DBDBA" />
    </svg>
  ),
  rabbit: ({ className }) => (
    <svg viewBox="0 0 200 200" className={className}>
      <ellipse cx="100" cy="130" rx="40" ry="50" fill="#F5F0E8" />
      <ellipse cx="100" cy="120" rx="30" ry="38" fill="#FFFFFF" />
      <rect x="65" y="25" width="22" height="65" rx="11" fill="#F5F0E8" />
      <rect x="113" y="25" width="22" height="65" rx="11" fill="#F5F0E8" />
      <rect x="72" y="32" width="10" height="50" rx="5" fill="#F8C8C8" />
      <rect x="118" y="32" width="10" height="50" rx="5" fill="#F8C8C8" />
      <circle cx="85" cy="108" r="6" fill="#2D3B3B" />
      <circle cx="115" cy="108" r="6" fill="#2D3B3B" />
      <ellipse cx="100" cy="122" rx="8" ry="6" fill="#F8C8C8" />
      <rect x="80" y="168" width="40" height="20" rx="6" fill="#5DBDBA" />
    </svg>
  ),
  bear: ({ className }) => (
    <svg viewBox="0 0 200 200" className={className}>
      <circle cx="55" cy="50" r="22" fill="#8B6914" />
      <circle cx="145" cy="50" r="22" fill="#8B6914" />
      <circle cx="55" cy="50" r="12" fill="#D4A855" />
      <circle cx="145" cy="50" r="12" fill="#D4A855" />
      <ellipse cx="100" cy="115" rx="52" ry="58" fill="#8B6914" />
      <ellipse cx="100" cy="125" rx="35" ry="38" fill="#D4A855" />
      <circle cx="80" cy="100" r="8" fill="#2D3B3B" />
      <circle cx="120" cy="100" r="8" fill="#2D3B3B" />
      <ellipse cx="100" cy="120" rx="12" ry="8" fill="#2D3B3B" />
      <rect x="80" y="170" width="40" height="18" rx="6" fill="#5DBDBA" />
    </svg>
  ),
  dog: ({ className }) => (
    <svg viewBox="0 0 200 200" className={className}>
      <ellipse cx="100" cy="115" rx="48" ry="55" fill="#A67B5B" />
      <ellipse cx="45" cy="70" rx="22" ry="35" fill="#A67B5B" />
      <ellipse cx="155" cy="70" rx="22" ry="35" fill="#A67B5B" />
      <ellipse cx="100" cy="112" rx="35" ry="42" fill="#D4B896" />
      <circle cx="82" cy="95" r="8" fill="#2D3B3B" />
      <circle cx="118" cy="95" r="8" fill="#2D3B3B" />
      <ellipse cx="100" cy="115" rx="15" ry="12" fill="#2D3B3B" />
      <ellipse cx="100" cy="135" rx="12" ry="6" fill="#E88B8B" />
      <rect x="80" y="165" width="40" height="18" rx="6" fill="#5DBDBA" />
    </svg>
  ),
};

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedChild, setSelectedChild] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const { data: activity, isLoading } = useQuery({
    queryKey: ["activity", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/activities/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<Activity>;
    },
  });

  const { data: children } = useQuery({
    queryKey: ["children"],
    queryFn: async () => {
      const res = await fetch("/api/children");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<Child[]>;
    },
  });

  const bookMutation = useMutation({
    mutationFn: async (data: { sessionId: string; childId: string }) => {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to book");
      }
      return res.json();
    },
    onSuccess: () => {
      setBookingSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["activity", params.id] });
    },
    onError: (error: Error) => {
      setBookingError(error.message);
    },
  });

  const handleBookClick = () => {
    setBookingError("");
    setBookingSuccess(false);
    setShowModal(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedSession || !selectedChild) {
      setBookingError("Please select a session and child");
      return;
    }
    bookMutation.mutate({
      sessionId: selectedSession,
      childId: selectedChild,
    });
  };

  if (isLoading) {
    return (
      <div className="py-6 animate-pulse">
        <div className="h-64 bg-bg-cream rounded-[var(--radius-xl)] mb-6" />
        <div className="space-y-4">
          <div className="h-8 bg-bg-cream rounded w-2/3" />
          <div className="h-4 bg-bg-cream rounded w-1/2" />
          <div className="h-4 bg-bg-cream rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="py-6 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-xl font-bold text-kidspass-text mb-2">
          Activity not found
        </h2>
        <Link href="/app/activities" className="text-primary hover:underline">
          Browse activities
        </Link>
      </div>
    );
  }

  const AnimalIcon = AnimalHero[activity.animalIcon || "fox"] || AnimalHero.fox;

  const getCategoryBg = (category: string) => {
    const colors: Record<string, string> = {
      SPORTS: "bg-sports",
      MUSIC: "bg-music",
      ARTS: "bg-arts",
      OUTDOOR: "bg-outdoor",
      CREATIVE: "bg-creative",
      DANCE: "bg-dance",
      SWIMMING: "bg-swimming",
      MARTIAL_ARTS: "bg-martial-arts",
    };
    return colors[category] || "bg-accent-butter";
  };

  return (
    <div className="py-6 space-y-6 animate-fadeIn">
      {/* Back button */}
      <Link
        href="/app/activities"
        className="inline-flex items-center gap-2 text-kidspass-text-muted hover:text-kidspass-text transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to activities
      </Link>

      {/* Hero image */}
      <div className={`relative rounded-[var(--radius-xl)] overflow-hidden ${getCategoryBg(activity.category)}`}>
        <div className="flex justify-center py-8">
          <AnimalIcon className="w-40 h-40" />
        </div>
      </div>

      {/* Activity info */}
      <div className="space-y-4">
        <div>
          <Badge variant="primary" className="mb-2">
            {CATEGORY_LABELS[activity.category] || activity.category}
          </Badge>
          <h1 className="text-2xl font-bold text-kidspass-text">
            {activity.title}
          </h1>
        </div>

        <div className="flex flex-wrap gap-4 text-kidspass-text-muted">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>{activity.partner.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>Ages {activity.ageMin}-{activity.ageMax}</span>
          </div>
        </div>

        {activity.description && (
          <p className="text-kidspass-text-muted leading-relaxed">
            {activity.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-sm text-kidspass-text-muted">
          <MapPin className="h-4 w-4" />
          <span>{activity.locationAddress}, {activity.city}</span>
        </div>
      </div>

      {/* Sessions */}
      <Card padding="md">
        <h2 className="text-lg font-bold text-kidspass-text mb-4">
          Available Sessions
        </h2>
        {activity.sessions.length > 0 ? (
          <div className="space-y-3">
            {activity.sessions.slice(0, 5).map((session) => {
              const spotsLeft = session.capacity - (session._count?.bookings || 0);
              const isFull = spotsLeft <= 0;

              return (
                <div
                  key={session.id}
                  className={`p-4 rounded-[var(--radius-md)] border-2 transition-colors ${
                    isFull
                      ? "bg-gray-50 border-gray-200 opacity-60"
                      : "bg-bg-cream border-transparent hover:border-primary"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-kidspass-text">
                        <Calendar className="h-4 w-4" />
                        {formatDate(session.startDateTime)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-kidspass-text-muted mt-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(session.startDateTime)} - {formatTime(session.endDateTime)}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={isFull ? "error" : spotsLeft <= 3 ? "warning" : "success"}>
                        {isFull ? "Full" : `${spotsLeft} spots left`}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-kidspass-text-muted text-center py-4">
            No upcoming sessions available
          </p>
        )}
      </Card>

      {/* Book button */}
      <div className="sticky bottom-20 bg-bg pt-4">
        <Button onClick={handleBookClick} className="w-full" size="lg">
          Book Activity
        </Button>
      </div>

      {/* Booking modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          if (bookingSuccess) {
            router.push("/app/schedule");
          }
        }}
        title={bookingSuccess ? "Booking Confirmed!" : "Book Activity"}
      >
        {bookingSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-kidspass-text mb-2">
              You're all set!
            </h3>
            <p className="text-kidspass-text-muted mb-6">
              {activity.title} has been added to your schedule.
            </p>
            <Button onClick={() => router.push("/app/schedule")}>
              View Schedule
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookingError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-[var(--radius-md)] text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {bookingError}
              </div>
            )}

            <Select
              label="Select Child"
              placeholder="Choose a child"
              options={
                children?.map((child) => ({
                  value: child.id,
                  label: `${child.name} (Age ${calculateAge(child.birthDate)})`,
                })) || []
              }
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
            />

            <Select
              label="Select Session"
              placeholder="Choose a session"
              options={activity.sessions
                .filter((s) => {
                  const spotsLeft = s.capacity - (s._count?.bookings || 0);
                  return spotsLeft > 0;
                })
                .map((session) => ({
                  value: session.id,
                  label: `${formatDate(session.startDateTime)} at ${formatTime(session.startDateTime)}`,
                }))}
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
            />

            <Button
              onClick={handleConfirmBooking}
              isLoading={bookMutation.isPending}
              className="w-full"
            >
              Confirm Booking
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

