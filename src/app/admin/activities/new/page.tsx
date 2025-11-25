"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input, Select } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/utils";

interface Partner {
  id: string;
  name: string;
  address: string;
  city: string;
}

const ANIMAL_OPTIONS = [
  { value: "fox", label: "🦊 Fox" },
  { value: "rabbit", label: "🐰 Rabbit" },
  { value: "bear", label: "🐻 Bear" },
  { value: "dog", label: "🐕 Dog" },
  { value: "panda", label: "🐼 Panda" },
];

export default function NewActivityPage() {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/partners")
      .then((res) => res.json())
      .then((data) => setPartners(data))
      .catch(console.error);
  }, []);

  const handlePartnerChange = (partnerId: string) => {
    const partner = partners.find((p) => p.id === partnerId);
    setSelectedPartner(partner || null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      partnerId: formData.get("partnerId") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      ageMin: parseInt(formData.get("ageMin") as string),
      ageMax: parseInt(formData.get("ageMax") as string),
      locationAddress: formData.get("locationAddress") as string,
      city: formData.get("city") as string,
      animalIcon: formData.get("animalIcon") as string,
    };

    try {
      const res = await fetch("/api/admin/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create activity");
      }

      router.push("/admin/activities");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const partnerOptions = partners.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/admin/activities"
        className="inline-flex items-center gap-2 text-kidspass-text-muted hover:text-kidspass-text transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Activities
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-kidspass-text">
          Create New Activity
        </h1>
        <p className="text-kidspass-text-muted">
          Add a new activity to the platform
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
            label="Partner"
            name="partnerId"
            options={partnerOptions}
            placeholder="Select a partner"
            required
            onChange={(e) => handlePartnerChange(e.target.value)}
          />

          <Input
            label="Activity Title"
            name="title"
            placeholder="Basketball for Kids"
            required
          />

          <div>
            <label className="block text-sm font-semibold text-kidspass-text mb-2">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe the activity..."
              rows={3}
              className="w-full px-4 py-3 text-base border-2 border-bg-cream rounded-[var(--radius-md)] bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label="Category"
              name="category"
              options={categoryOptions}
              placeholder="Select category"
              required
            />
            <Select
              label="Animal Icon"
              name="animalIcon"
              options={ANIMAL_OPTIONS}
              placeholder="Select icon"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Minimum Age"
              name="ageMin"
              type="number"
              min="3"
              max="14"
              placeholder="3"
              required
            />
            <Input
              label="Maximum Age"
              name="ageMax"
              type="number"
              min="3"
              max="14"
              placeholder="10"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Location Address"
              name="locationAddress"
              placeholder="456 Sports Ave"
              defaultValue={selectedPartner?.address || ""}
              required
            />
            <Input
              label="City"
              name="city"
              placeholder="Munich"
              defaultValue={selectedPartner?.city || ""}
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Create Activity
            </Button>
            <Link href="/admin/activities" className="flex-1">
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

