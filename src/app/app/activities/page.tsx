"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { TopNav } from "@/components/layout";
import { ActivityCard, ActivityCardSkeleton, ActivityFilters, ActivityMap } from "@/components/activities";
import { Input, Button } from "@/components/ui";
import { Search, Map, List, MapPin } from "lucide-react";

interface Child {
  id: string;
  name: string;
}

interface Activity {
  id: string;
  title: string;
  category: string;
  animalIcon: string | null;
  latitude: number | null;
  longitude: number | null;
  partner: { name: string };
  locationAddress: string;
  sessions: { startDateTime: string }[];
}

function ActivitiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialChildId = searchParams.get("childId") || "";
  const initialView = searchParams.get("view") || "list";

  const [search, setSearch] = useState("");
  const [selectedChild, setSelectedChild] = useState(initialChildId);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDay, setSelectedDay] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">(initialView as "list" | "map");

  const { data: children } = useQuery({
    queryKey: ["children"],
    queryFn: async () => {
      const res = await fetch("/api/children");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<Child[]>;
    },
  });

  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities", selectedCategory, selectedChild, selectedDay, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedChild) params.set("childId", selectedChild);
      if (selectedDay) params.set("dayOfWeek", selectedDay);
      if (search) params.set("search", search);

      const res = await fetch(`/api/activities?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<Activity[]>;
    },
  });

  const handleReset = () => {
    setSelectedChild("");
    setSelectedCategory("");
    setSelectedDay("");
    setSearch("");
  };

  const handleActivitySelect = (activityId: string) => {
    router.push(`/app/activities/${activityId}`);
  };

  // Count activities with coordinates for the map badge
  const activitiesWithCoords = activities?.filter(a => a.latitude && a.longitude).length || 0;

  return (
    <div className="py-6 space-y-6">
      <TopNav title="Activities" />

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-kidspass-text-muted" />
        <Input
          placeholder="Search activities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12"
        />
      </div>

      {/* View toggle and Filters */}
      <div className="flex items-center justify-between gap-4">
        <ActivityFilters
          children={children || []}
          selectedChild={selectedChild}
          selectedCategory={selectedCategory}
          selectedDay={selectedDay}
          onChildChange={setSelectedChild}
          onCategoryChange={setSelectedCategory}
          onDayChange={setSelectedDay}
          onReset={handleReset}
        />

        {/* View Toggle */}
        <div className="flex bg-bg-cream rounded-full p-1 shrink-0">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              viewMode === "list"
                ? "bg-white text-kidspass-text shadow-sm"
                : "text-kidspass-text-muted hover:text-kidspass-text"
            }`}
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              viewMode === "map"
                ? "bg-white text-kidspass-text shadow-sm"
                : "text-kidspass-text-muted hover:text-kidspass-text"
            }`}
          >
            <Map className="h-4 w-4" />
            <span className="hidden sm:inline">Map</span>
            {activitiesWithCoords > 0 && (
              <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                {activitiesWithCoords}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        viewMode === "list" ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ActivityCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="h-[500px] bg-bg-cream rounded-[var(--radius-xl)] animate-pulse" />
        )
      ) : activities && activities.length > 0 ? (
        viewMode === "list" ? (
          <div className="grid grid-cols-2 gap-4">
            {activities.map((activity, index) => (
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
                className={`animate-fadeIn`}
                style={{ animationDelay: `${index * 0.05}s` } as React.CSSProperties}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <ActivityMap
              activities={activities}
              onActivitySelect={handleActivitySelect}
              className="h-[500px]"
            />
            
            {/* Activity list below map for quick reference */}
            <div className="bg-white rounded-[var(--radius-xl)] p-4">
              <h3 className="font-semibold text-kidspass-text mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {activitiesWithCoords} activities on map
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                {activities
                  .filter(a => a.latitude && a.longitude)
                  .map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => handleActivitySelect(activity.id)}
                      className="flex-shrink-0 bg-bg-cream hover:bg-primary-light rounded-[var(--radius-lg)] p-3 text-left transition-colors min-w-[160px]"
                    >
                      <p className="font-medium text-sm text-kidspass-text truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-kidspass-text-muted truncate">
                        {activity.partner.name}
                      </p>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="text-xl font-bold text-kidspass-text mb-2">
            No activities found
          </h3>
          <p className="text-kidspass-text-muted">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
}

function ActivitiesLoading() {
  return (
    <div className="py-6 space-y-6">
      <div className="h-8 bg-bg-cream rounded animate-pulse w-32" />
      <div className="h-12 bg-bg-cream rounded-[var(--radius-lg)] animate-pulse" />
      <div className="flex gap-2">
        <div className="h-10 bg-bg-cream rounded-full animate-pulse w-24" />
        <div className="h-10 bg-bg-cream rounded-full animate-pulse w-24" />
        <div className="h-10 bg-bg-cream rounded-full animate-pulse w-24" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ActivityCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function ActivitiesPage() {
  return (
    <Suspense fallback={<ActivitiesLoading />}>
      <ActivitiesContent />
    </Suspense>
  );
}
