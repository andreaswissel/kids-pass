"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ActivityCard, ActivityCardSkeleton } from "@/components/activities";
import { Badge, Avatar } from "@/components/ui";
import { ChevronRight, Sparkles } from "lucide-react";
import { calculateAge } from "@/lib/utils";

interface Child {
  id: string;
  name: string;
  birthDate: string;
  interests: string[];
}

interface Activity {
  id: string;
  title: string;
  category: string;
  animalIcon: string | null;
  partner: { name: string };
  locationAddress: string;
  sessions: { startDateTime: string }[];
}

export default function DashboardPage() {
  const { data: session } = useSession();

  const { data: children, isLoading: childrenLoading } = useQuery({
    queryKey: ["children"],
    queryFn: async () => {
      const res = await fetch("/api/children");
      if (!res.ok) throw new Error("Failed to fetch children");
      return res.json() as Promise<Child[]>;
    },
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["activities", "recommended"],
    queryFn: async () => {
      const res = await fetch("/api/activities?limit=6");
      if (!res.ok) throw new Error("Failed to fetch activities");
      return res.json() as Promise<Activity[]>;
    },
  });

  const firstChild = children?.[0];
  const childAge = firstChild ? calculateAge(firstChild.birthDate) : null;

  return (
    <div className="py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-kidspass-text">
            Hi, {session?.user?.name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-kidspass-text-muted">
            Ready to discover new activities?
          </p>
        </div>
        <Link href="/app/profile">
          <Avatar
            src={session?.user?.image}
            fallback={session?.user?.name || "U"}
            size="lg"
          />
        </Link>
      </div>

      {/* Child selector pills */}
      {!childrenLoading && children && children.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {children.map((child) => (
            <Link
              key={child.id}
              href={`/app/activities?childId=${child.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full hover:bg-primary transition-colors"
            >
              <span className="font-semibold text-kidspass-text">{child.name}</span>
              <Badge variant="default" size="sm">
                Age {calculateAge(child.birthDate)}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-accent-mint rounded-[var(--radius-lg)]">
          <p className="text-sm text-kidspass-text-muted mb-1">This month</p>
          <p className="text-2xl font-bold text-kidspass-text">0 of 4</p>
          <p className="text-sm text-kidspass-text-muted">activities booked</p>
        </div>
        <Link
          href="/app/schedule"
          className="p-4 bg-accent-butter rounded-[var(--radius-lg)] hover:shadow-md transition-shadow"
        >
          <p className="text-sm text-kidspass-text-muted mb-1">Upcoming</p>
          <p className="text-2xl font-bold text-kidspass-text">0</p>
          <p className="text-sm text-kidspass-text-muted">activities</p>
        </Link>
      </div>

      {/* Recommended activities */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-kidspass-text">
              {firstChild ? `Recommended for ${firstChild.name}` : "Recommended"}
            </h2>
          </div>
          <Link
            href="/app/activities"
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {activitiesLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <ActivityCardSkeleton key={i} />
            ))}
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {activities.slice(0, 4).map((activity, index) => (
              <ActivityCard
                key={activity.id}
                id={activity.id}
                title={activity.title}
                category={activity.category}
                partnerName={activity.partner.name}
                locationAddress={activity.locationAddress}
                animalIcon={activity.animalIcon}
                nextSession={
                  activity.sessions[0]
                    ? { startDateTime: activity.sessions[0].startDateTime }
                    : undefined
                }
                className={`animate-fadeIn stagger-${index + 1}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-bg-cream rounded-[var(--radius-lg)]">
            <p className="text-4xl mb-4">🎨</p>
            <p className="text-kidspass-text-muted">
              No activities available yet.
              <br />
              Check back soon!
            </p>
          </div>
        )}
      </section>

      {/* Category shortcuts */}
      <section>
        <h2 className="text-lg font-bold text-kidspass-text mb-4">
          Browse by category
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { emoji: "⚽", label: "Sports", category: "SPORTS" },
            { emoji: "🎵", label: "Music", category: "MUSIC" },
            { emoji: "🎨", label: "Arts", category: "ARTS" },
            { emoji: "💃", label: "Dance", category: "DANCE" },
          ].map((item) => (
            <Link
              key={item.category}
              href={`/app/activities?category=${item.category}`}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-[var(--radius-lg)] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-sm font-semibold text-kidspass-text">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

