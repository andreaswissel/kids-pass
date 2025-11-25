"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input, Select } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Activity {
  id: string;
  title: string;
  partner: { name: string };
}

export default function NewSessionPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/activities")
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const date = formData.get("date") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;

    const data = {
      activityId: formData.get("activityId") as string,
      startDateTime: `${date}T${startTime}:00`,
      endDateTime: `${date}T${endTime}:00`,
      capacity: parseInt(formData.get("capacity") as string),
    };

    try {
      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create session");
      }

      router.push("/admin/sessions");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const activityOptions = activities.map((a) => ({
    value: a.id,
    label: `${a.title} (${a.partner.name})`,
  }));

  // Default to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/admin/sessions"
        className="inline-flex items-center gap-2 text-kidspass-text-muted hover:text-kidspass-text transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sessions
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-kidspass-text">
          Schedule New Session
        </h1>
        <p className="text-kidspass-text-muted">
          Create a new activity session
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-[var(--radius-md)] text-red-600">
          {error}
        </div>
      )}

      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            label="Activity"
            name="activityId"
            options={activityOptions}
            placeholder="Select an activity"
            required
          />

          <Input
            label="Date"
            name="date"
            type="date"
            defaultValue={defaultDate}
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Start Time"
              name="startTime"
              type="time"
              defaultValue="14:00"
              required
            />
            <Input
              label="End Time"
              name="endTime"
              type="time"
              defaultValue="15:00"
              required
            />
          </div>

          <Input
            label="Capacity"
            name="capacity"
            type="number"
            min="1"
            max="50"
            defaultValue="10"
            required
            helperText="Maximum number of children that can book this session"
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Create Session
            </Button>
            <Link href="/admin/sessions" className="flex-1">
              <Button type="button" variant="secondary" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

