"use client";

import { cn, getCategoryGradient, CATEGORY_LABELS, formatDate, formatTime } from "@/lib/utils";
import { Badge } from "@/components/ui";
import Link from "next/link";
import { MapPin, Clock, Users } from "lucide-react";

// Animal SVG components for activity cards
const AnimalIcons: Record<string, React.FC<{ className?: string }>> = {
  fox: ({ className }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <ellipse cx="50" cy="60" rx="25" ry="30" fill="#E8A855" />
      <ellipse cx="50" cy="55" rx="18" ry="22" fill="#FAE5C3" />
      <circle cx="42" cy="50" r="3" fill="#2D3B3B" />
      <circle cx="58" cy="50" r="3" fill="#2D3B3B" />
      <ellipse cx="50" cy="58" rx="4" ry="3" fill="#2D3B3B" />
      <polygon points="30,35 40,55 20,55" fill="#E8A855" />
      <polygon points="70,35 60,55 80,55" fill="#E8A855" />
      <polygon points="33,40 38,52 25,52" fill="#FAE5C3" />
      <polygon points="67,40 62,52 75,52" fill="#FAE5C3" />
      <rect x="45" y="85" width="10" height="8" rx="2" fill="#5DBDBA" />
    </svg>
  ),
  rabbit: ({ className }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <ellipse cx="50" cy="65" rx="22" ry="25" fill="#F5F0E8" />
      <ellipse cx="50" cy="60" rx="15" ry="18" fill="#FFFFFF" />
      <rect x="35" y="15" width="12" height="35" rx="6" fill="#F5F0E8" />
      <rect x="53" y="15" width="12" height="35" rx="6" fill="#F5F0E8" />
      <rect x="38" y="20" width="6" height="25" rx="3" fill="#F8C8C8" />
      <rect x="56" y="20" width="6" height="25" rx="3" fill="#F8C8C8" />
      <circle cx="43" cy="55" r="3" fill="#2D3B3B" />
      <circle cx="57" cy="55" r="3" fill="#2D3B3B" />
      <ellipse cx="50" cy="62" rx="4" ry="3" fill="#F8C8C8" />
      <rect x="42" y="85" width="16" height="10" rx="3" fill="#5DBDBA" />
    </svg>
  ),
  bear: ({ className }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="30" cy="30" r="12" fill="#8B6914" />
      <circle cx="70" cy="30" r="12" fill="#8B6914" />
      <circle cx="30" cy="30" r="6" fill="#D4A855" />
      <circle cx="70" cy="30" r="6" fill="#D4A855" />
      <ellipse cx="50" cy="60" rx="28" ry="30" fill="#8B6914" />
      <ellipse cx="50" cy="65" rx="18" ry="18" fill="#D4A855" />
      <circle cx="40" cy="52" r="4" fill="#2D3B3B" />
      <circle cx="60" cy="52" r="4" fill="#2D3B3B" />
      <ellipse cx="50" cy="62" rx="6" ry="4" fill="#2D3B3B" />
      <rect x="42" y="88" width="16" height="8" rx="3" fill="#5DBDBA" />
    </svg>
  ),
  dog: ({ className }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <ellipse cx="50" cy="60" rx="25" ry="28" fill="#A67B5B" />
      <ellipse cx="25" cy="40" rx="12" ry="18" fill="#A67B5B" />
      <ellipse cx="75" cy="40" rx="12" ry="18" fill="#A67B5B" />
      <ellipse cx="50" cy="58" rx="18" ry="20" fill="#D4B896" />
      <circle cx="42" cy="50" r="4" fill="#2D3B3B" />
      <circle cx="58" cy="50" r="4" fill="#2D3B3B" />
      <ellipse cx="50" cy="60" rx="8" ry="6" fill="#2D3B3B" />
      <ellipse cx="50" cy="72" rx="6" ry="3" fill="#E88B8B" />
      <rect x="42" y="88" width="16" height="8" rx="3" fill="#5DBDBA" />
    </svg>
  ),
  panda: ({ className }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <ellipse cx="50" cy="60" rx="28" ry="30" fill="#FFFFFF" />
      <circle cx="28" cy="35" r="14" fill="#2D3B3B" />
      <circle cx="72" cy="35" r="14" fill="#2D3B3B" />
      <ellipse cx="38" cy="52" rx="10" ry="12" fill="#2D3B3B" />
      <ellipse cx="62" cy="52" rx="10" ry="12" fill="#2D3B3B" />
      <circle cx="38" cy="52" r="4" fill="#FFFFFF" />
      <circle cx="62" cy="52" r="4" fill="#FFFFFF" />
      <ellipse cx="50" cy="65" rx="6" ry="4" fill="#2D3B3B" />
      <rect x="42" y="88" width="16" height="8" rx="3" fill="#5DBDBA" />
    </svg>
  ),
};

interface ActivityCardProps {
  id: string;
  title: string;
  category: string;
  partnerName: string;
  locationAddress: string;
  nextSession?: {
    startDateTime: Date | string;
    spotsLeft?: number;
  };
  animalIcon?: string | null;
  className?: string;
}

export function ActivityCard({
  id,
  title,
  category,
  partnerName,
  locationAddress,
  nextSession,
  animalIcon = "fox",
  className,
}: ActivityCardProps) {
  const AnimalIcon = AnimalIcons[animalIcon || "fox"] || AnimalIcons.fox;

  return (
    <Link href={`/app/activities/${id}`}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-[var(--radius-xl)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
          getCategoryGradient(category),
          className
        )}
      >
        <div className="p-5">
          {/* Animal illustration */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 transition-transform duration-300 group-hover:scale-110">
              <AnimalIcon className="w-full h-full" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-kidspass-text truncate">
              {title}
            </h3>

            {nextSession && (
              <div className="flex items-center gap-1.5 text-sm text-kidspass-text-muted">
                <Clock className="h-4 w-4" />
                <span>
                  {formatDate(nextSession.startDateTime)}, {formatTime(nextSession.startDateTime)}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-sm text-kidspass-text-muted">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{partnerName}</span>
            </div>

            <div className="pt-2">
              <Badge variant="default" size="sm">
                {CATEGORY_LABELS[category] || category}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface ActivityCardSkeletonProps {
  className?: string;
}

export function ActivityCardSkeleton({ className }: ActivityCardSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-xl)] bg-bg-cream animate-pulse",
        className
      )}
    >
      <div className="p-5">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-white/50" />
        </div>
        <div className="space-y-3">
          <div className="h-5 bg-white/50 rounded w-3/4" />
          <div className="h-4 bg-white/50 rounded w-1/2" />
          <div className="h-4 bg-white/50 rounded w-2/3" />
          <div className="h-6 bg-white/50 rounded-full w-20 mt-2" />
        </div>
      </div>
    </div>
  );
}

