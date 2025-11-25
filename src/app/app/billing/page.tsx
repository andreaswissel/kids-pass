"use client";

import { useQuery } from "@tanstack/react-query";
import { TopNav } from "@/components/layout";
import { Card, Button, Badge } from "@/components/ui";
import { CreditCard, Calendar, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function BillingPage() {
  const { data: subscription, isLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const res = await fetch("/api/subscription");
      if (!res.ok) return null;
      return res.json();
    },
  });

  const { data: usage } = useQuery({
    queryKey: ["usage"],
    queryFn: async () => {
      const res = await fetch("/api/subscription/usage");
      if (!res.ok) return { used: 0, total: 4 };
      return res.json();
    },
  });

  const handleManageSubscription = async () => {
    const res = await fetch("/api/subscription/portal", {
      method: "POST",
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  const handleSubscribe = async () => {
    const res = await fetch("/api/subscription/create-checkout-session", {
      method: "POST",
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  if (isLoading) {
    return (
      <div className="py-6 space-y-6">
        <TopNav title="Billing" showBack />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-bg-cream rounded-[var(--radius-lg)] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <TopNav title="Billing" showBack />

      {/* Current plan */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-kidspass-text">Current Plan</h2>
          <Badge variant={subscription?.status === "ACTIVE" ? "success" : "warning"}>
            {subscription?.status || "No subscription"}
          </Badge>
        </div>

        {subscription ? (
          <div className="space-y-4">
            <div className="p-4 bg-primary-light rounded-[var(--radius-md)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-[var(--radius-md)] flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-kidspass-text" />
                </div>
                <div>
                  <p className="font-bold text-kidspass-text">
                    {subscription.plan?.name || "4 Activities / Month"}
                  </p>
                  <p className="text-sm text-kidspass-text-muted">
                    €{(subscription.plan?.priceCents || 2900) / 100}/month
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-kidspass-text-muted">Activities this month</span>
                <span className="font-semibold text-kidspass-text">
                  {usage?.used || 0} of {usage?.total || 4}
                </span>
              </div>
              <div className="h-3 bg-bg-cream rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${((usage?.used || 0) / (usage?.total || 4)) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-kidspass-text-muted">
              <Calendar className="h-4 w-4" />
              <span>
                Renews on{" "}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <Button
              variant="secondary"
              onClick={handleManageSubscription}
              className="w-full"
            >
              Manage Subscription
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-5xl mb-4">🎫</p>
            <h3 className="text-xl font-bold text-kidspass-text mb-2">
              No active subscription
            </h3>
            <p className="text-kidspass-text-muted mb-6">
              Subscribe to start booking activities for your children
            </p>
            <Button onClick={handleSubscribe}>
              Start Subscription
            </Button>
          </div>
        )}
      </Card>

      {/* Plan features */}
      <Card padding="lg">
        <h2 className="text-lg font-bold text-kidspass-text mb-4">Plan Features</h2>
        <ul className="space-y-3">
          {[
            "4 activity bookings per month",
            "Access to all partner locations",
            "Flexible cancellation up to 24h before",
            "Personalized recommendations",
            "Family calendar sync",
            "Priority customer support",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
              <span className="text-kidspass-text">{feature}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Help section */}
      <Card padding="md" className="bg-bg-cream border-0">
        <div className="text-center">
          <p className="text-kidspass-text-muted mb-2">
            Questions about billing?
          </p>
          <Link
            href="mailto:support@kidspass.com"
            className="text-primary font-semibold hover:underline"
          >
            Contact Support
          </Link>
        </div>
      </Card>
    </div>
  );
}

