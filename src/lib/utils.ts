import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)}, ${formatTime(date)}`;
}

export function calculateAge(birthDate: Date | string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function getAgeGroup(age: number): string {
  if (age <= 5) return "3-5";
  if (age <= 8) return "6-8";
  if (age <= 10) return "9-10";
  if (age <= 12) return "11-12";
  return "13+";
}

export function getCategoryColor(category: string): string {
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
}

export function getCategoryGradient(category: string): string {
  const gradients: Record<string, string> = {
    SPORTS: "activity-card-sports",
    MUSIC: "activity-card-music",
    ARTS: "activity-card-arts",
    OUTDOOR: "activity-card-outdoor",
    CREATIVE: "activity-card-creative",
    DANCE: "activity-card-dance",
    SWIMMING: "activity-card-swimming",
    MARTIAL_ARTS: "activity-card-martial-arts",
  };
  return gradients[category] || "activity-card-sports";
}

export function getAnimalEmoji(animal: string | null): string {
  const animals: Record<string, string> = {
    fox: "🦊",
    rabbit: "🐰",
    bear: "🐻",
    dog: "🐕",
    cat: "🐱",
    panda: "🐼",
    koala: "🐨",
    lion: "🦁",
    tiger: "🐯",
    elephant: "🐘",
    monkey: "🐵",
    penguin: "🐧",
    owl: "🦉",
    unicorn: "🦄",
  };
  return animal ? animals[animal] || "🎯" : "🎯";
}

export const CATEGORY_LABELS: Record<string, string> = {
  SPORTS: "Sports",
  MUSIC: "Music",
  ARTS: "Arts",
  OUTDOOR: "Outdoor",
  CREATIVE: "Creative",
  DANCE: "Dance",
  SWIMMING: "Swimming",
  MARTIAL_ARTS: "Martial Arts",
};

export const INTEREST_OPTIONS = [
  { value: "SPORTS", label: "Ball Sports", icon: "⚽" },
  { value: "MUSIC", label: "Music", icon: "🎵" },
  { value: "ARTS", label: "Arts & Crafts", icon: "🎨" },
  { value: "OUTDOOR", label: "Outdoor", icon: "🏕️" },
  { value: "CREATIVE", label: "Creative", icon: "✨" },
  { value: "DANCE", label: "Dance", icon: "💃" },
  { value: "SWIMMING", label: "Swimming", icon: "🏊" },
  { value: "MARTIAL_ARTS", label: "Martial Arts", icon: "🥋" },
];

