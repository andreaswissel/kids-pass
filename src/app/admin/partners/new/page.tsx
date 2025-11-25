"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPartnerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      postcode: formData.get("postcode") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
      websiteUrl: formData.get("websiteUrl") as string,
    };

    try {
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create partner");
      }

      router.push("/admin/partners");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/admin/partners"
        className="inline-flex items-center gap-2 text-kidspass-text-muted hover:text-kidspass-text transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Partners
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-kidspass-text">Add New Partner</h1>
        <p className="text-kidspass-text-muted">
          Register a new activity provider
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-[var(--radius-md)] text-red-600">
          {error}
        </div>
      )}

      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Partner Name"
            name="name"
            placeholder="City Soccer Club"
            required
          />

          <div>
            <label className="block text-sm font-semibold text-kidspass-text mb-2">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Brief description of the partner..."
              rows={3}
              className="w-full px-4 py-3 text-base border-2 border-bg-cream rounded-[var(--radius-md)] bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Address"
              name="address"
              placeholder="123 Main Street"
              required
            />
            <Input
              label="City"
              name="city"
              placeholder="Munich"
              required
            />
          </div>

          <Input
            label="Postcode"
            name="postcode"
            placeholder="80331"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              name="contactEmail"
              type="email"
              placeholder="contact@partner.com"
            />
            <Input
              label="Contact Phone"
              name="contactPhone"
              type="tel"
              placeholder="+49 123 456789"
            />
          </div>

          <Input
            label="Website URL"
            name="websiteUrl"
            type="url"
            placeholder="https://partner.com"
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Create Partner
            </Button>
            <Link href="/admin/partners" className="flex-1">
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

