"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { TopNav } from "@/components/layout";
import { ActivityCard, ActivityCardSkeleton, ActivityFilters } from "@/components/activities";
import { Input } from "@/components/ui";
import { Search } from "lucide-react";

interface Child {
  id: string;
  name: string;
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

export default function ActivitiesPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialChildId = searchParams.get("childId") || "";

  const [search, setSearch] = useState("");
  const [selectedChild, setSelectedChild] = useState(initialChildId);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDay, setSelectedDay] = useState("");

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

      {/* Filters */}
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

      {/* Activities grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ActivityCardSkeleton key={i} />
          ))}
        </div>
      ) : activities && activities.length > 0 ? (
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

