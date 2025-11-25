"use client";

import { useState } from "react";
import { cn, CATEGORY_LABELS, INTEREST_OPTIONS } from "@/lib/utils";
import { Button, Select } from "@/components/ui";
import { Filter, X } from "lucide-react";

interface Child {
  id: string;
  name: string;
}

interface ActivityFiltersProps {
  children?: Child[];
  selectedChild?: string;
  selectedCategory?: string;
  selectedDay?: string;
  onChildChange?: (childId: string) => void;
  onCategoryChange?: (category: string) => void;
  onDayChange?: (day: string) => void;
  onReset?: () => void;
  className?: string;
}

const DAY_OPTIONS = [
  { value: "", label: "Any Day" },
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

export function ActivityFilters({
  children = [],
  selectedChild = "",
  selectedCategory = "",
  selectedDay = "",
  onChildChange,
  onCategoryChange,
  onDayChange,
  onReset,
  className,
}: ActivityFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = selectedChild || selectedCategory || selectedDay;

  const categoryOptions = [
    { value: "", label: "All Activities" },
    ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  const childOptions = [
    { value: "", label: "All Children" },
    ...children.map((child) => ({
      value: child.id,
      label: child.name,
    })),
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quick filter pills */}
      <div className="flex flex-wrap gap-2 items-center">
        {children.length > 0 && (
          <div className="flex gap-2">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => onChildChange?.(selectedChild === child.id ? "" : child.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                  selectedChild === child.id
                    ? "bg-primary text-kidspass-text"
                    : "bg-bg-cream text-kidspass-text-muted hover:bg-primary-light"
                )}
              >
                {child.name}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
            isExpanded || hasActiveFilters
              ? "bg-primary text-kidspass-text"
              : "bg-bg-cream text-kidspass-text-muted hover:bg-primary-light"
          )}
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-white rounded-full px-2 py-0.5 text-xs">
              {[selectedChild, selectedCategory, selectedDay].filter(Boolean).length}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-2 text-sm text-kidspass-text-muted hover:text-kidspass-text transition-colors"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-bg-cream rounded-[var(--radius-lg)] animate-fadeIn">
          {children.length > 0 && (
            <Select
              label="Child"
              options={childOptions}
              value={selectedChild}
              onChange={(e) => onChildChange?.(e.target.value)}
            />
          )}

          <Select
            label="Category"
            options={categoryOptions}
            value={selectedCategory}
            onChange={(e) => onCategoryChange?.(e.target.value)}
          />

          <Select
            label="Day of Week"
            options={DAY_OPTIONS}
            value={selectedDay}
            onChange={(e) => onDayChange?.(e.target.value)}
          />
        </div>
      )}

      {/* Category quick filters */}
      <div className="flex flex-wrap gap-2">
        {INTEREST_OPTIONS.map((interest) => (
          <button
            key={interest.value}
            onClick={() =>
              onCategoryChange?.(
                selectedCategory === interest.value ? "" : interest.value
              )
            }
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
              selectedCategory === interest.value
                ? "bg-primary text-kidspass-text shadow-sm"
                : "bg-white text-kidspass-text-muted hover:bg-bg-cream border border-bg-cream"
            )}
          >
            <span>{interest.icon}</span>
            <span>{interest.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

