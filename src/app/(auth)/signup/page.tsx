"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Card } from "@/components/ui";
import { ChevronRight, Check, ArrowLeft, Sparkles, Rocket, Star } from "lucide-react";
import { INTEREST_OPTIONS, cn } from "@/lib/utils";
import { signIn } from "next-auth/react";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Please enter your name"),
  city: z.string().min(2, "Please enter your city"),
});

type SignupForm = z.infer<typeof signupSchema>;

interface Plan {
  id: string;
  code: string;
  name: string;
  description: string;
  priceCents: number;
  creditsPerPeriod: number;
}

interface ChildData {
  name: string;
  birthYear: string;
  interests: string[];
}

const PLAN_ICONS: Record<string, React.ReactNode> = {
  LITTLE_EXPLORER: <Sparkles className="h-8 w-8" />,
  SUPER_STAR: <Star className="h-8 w-8" />,
  UNLIMITED_FUN: <Rocket className="h-8 w-8" />,
};

const PLAN_COLORS: Record<string, string> = {
  LITTLE_EXPLORER: "from-accent-mint to-accent-sage",
  SUPER_STAR: "from-primary-light to-primary",
  UNLIMITED_FUN: "from-accent-lavender to-accent-coral",
};

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [parentData, setParentData] = useState<SignupForm | null>(null);
  const [childData, setChildData] = useState<ChildData>({
    name: "",
    birthYear: "",
    interests: [],
  });
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [plans, setPlans] = useState<Plan[]>([]);

  const {
    register: registerParent,
    handleSubmit: handleParentSubmit,
    formState: { errors: parentErrors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  // Fetch available plans
  useEffect(() => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then((data) => {
        setPlans(data);
        // Pre-select the middle plan (Super Star)
        const superStar = data.find((p: Plan) => p.code === "SUPER_STAR");
        if (superStar) setSelectedPlan(superStar.id);
      })
      .catch(console.error);
  }, []);

  const currentYear = new Date().getFullYear();
  const birthYearOptions = Array.from({ length: 15 }, (_, i) => ({
    value: String(currentYear - 3 - i),
    label: String(currentYear - 3 - i),
  }));

  const onParentSubmit = (data: SignupForm) => {
    setParentData(data);
    setStep(2);
  };

  const onChildSubmit = () => {
    if (!childData.name || !childData.birthYear || childData.interests.length === 0) {
      setError("Please fill in all child information");
      return;
    }
    setError("");
    setStep(3);
  };

  const toggleInterest = (interest: string) => {
    setChildData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const onFinalSubmit = async () => {
    if (!parentData || !selectedPlan) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parentData,
          child: childData,
          planId: selectedPlan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Sign in automatically
      const signInResult = await signIn("credentials", {
        email: parentData.email,
        password: parentData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error("Failed to sign in automatically");
      }

      // Show success and redirect
      setStep(4);
      setTimeout(() => {
        router.push("/app");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                step >= s
                  ? "bg-primary text-kidspass-text"
                  : "bg-bg-cream text-kidspass-text-muted"
              )}
            >
              {step > s ? <Check className="h-4 w-4" /> : s}
            </div>
            {i < 2 && (
              <div className="w-8 h-0.5 bg-bg-cream mx-1">
                <div
                  className={cn(
                    "h-full bg-primary transition-all",
                    step > s ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Parent Details */}
      {step === 1 && (
        <Card className="animate-fadeIn">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">👋</div>
            <h1 className="text-2xl font-bold text-kidspass-text mb-2">
              Create your account
            </h1>
            <p className="text-kidspass-text-muted">
              Start your family's adventure today
            </p>
          </div>

          <form onSubmit={handleParentSubmit(onParentSubmit)} className="space-y-4">
            <Input
              label="Your Name"
              placeholder="Emma Smith"
              {...registerParent("name")}
              error={parentErrors.name?.message}
            />

            <Input
              label="Email"
              type="email"
              placeholder="emma@example.com"
              {...registerParent("email")}
              error={parentErrors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              {...registerParent("password")}
              error={parentErrors.password?.message}
            />

            <Input
              label="City"
              placeholder="Munich"
              {...registerParent("city")}
              error={parentErrors.city?.message}
            />

            <Button type="submit" className="w-full mt-6">
              Continue
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <p className="text-center text-sm text-kidspass-text-muted mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>
        </Card>
      )}

      {/* Step 2: Child Details */}
      {step === 2 && (
        <Card className="animate-fadeIn">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1 text-kidspass-text-muted hover:text-kidspass-text mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="text-center mb-6">
            <div className="text-5xl mb-3">👶</div>
            <h1 className="text-2xl font-bold text-kidspass-text mb-2">
              Add your first child
            </h1>
            <p className="text-kidspass-text-muted">
              We'll personalize activity recommendations
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-[var(--radius-md)] text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <Input
              label="Child's Name"
              placeholder="Alex"
              value={childData.name}
              onChange={(e) =>
                setChildData((prev) => ({ ...prev, name: e.target.value }))
              }
            />

            <div>
              <label className="block text-sm font-semibold text-kidspass-text mb-2">
                Birth Year
              </label>
              <select
                value={childData.birthYear}
                onChange={(e) =>
                  setChildData((prev) => ({ ...prev, birthYear: e.target.value }))
                }
                className="w-full px-4 py-3 text-base border-2 border-bg-cream rounded-[var(--radius-md)] bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select year</option>
                {birthYearOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-kidspass-text mb-3">
                What does {childData.name || "your child"} enjoy?
              </label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const isSelected = childData.interests.includes(interest.value);
                  return (
                    <button
                      key={interest.value}
                      type="button"
                      onClick={() => toggleInterest(interest.value)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                        isSelected
                          ? "bg-primary text-kidspass-text shadow-sm"
                          : "bg-bg-cream text-kidspass-text-muted hover:bg-primary-light"
                      )}
                    >
                      <span>{interest.icon}</span>
                      <span>{interest.label}</span>
                      {isSelected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button onClick={onChildSubmit} className="w-full mt-6">
              Choose Your Plan
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Plan Selection */}
      {step === 3 && (
        <div className="animate-fadeIn space-y-6">
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-1 text-kidspass-text-muted hover:text-kidspass-text transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h1 className="text-2xl font-bold text-kidspass-text mb-2">
              Choose {childData.name}'s adventure plan
            </h1>
            <p className="text-kidspass-text-muted">
              Pick the perfect plan for your explorer!
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-[var(--radius-md)] text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const isPopular = plan.code === "SUPER_STAR";

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={cn(
                    "relative p-5 rounded-[var(--radius-xl)] cursor-pointer transition-all duration-300",
                    isSelected
                      ? "ring-2 ring-primary shadow-lg scale-[1.02]"
                      : "bg-white shadow-sm hover:shadow-md",
                    isSelected && `bg-gradient-to-br ${PLAN_COLORS[plan.code] || "from-bg-cream to-white"}`
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 bg-primary text-kidspass-text text-xs font-bold rounded-full shadow-sm">
                        Most Popular ⭐
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-[var(--radius-lg)] flex items-center justify-center",
                        isSelected ? "bg-white/50" : "bg-bg-cream"
                      )}
                    >
                      {PLAN_ICONS[plan.code] || <Sparkles className="h-8 w-8" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-kidspass-text">
                          {plan.name}
                        </h3>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-kidspass-text">
                            €{plan.priceCents / 100}
                          </span>
                          <span className="text-kidspass-text-muted text-sm">/mo</span>
                        </div>
                      </div>
                      <p className="text-sm text-kidspass-text-muted mb-2">
                        {plan.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-semibold",
                            isSelected
                              ? "bg-white/50 text-kidspass-text"
                              : "bg-bg-cream text-kidspass-text-muted"
                          )}
                        >
                          {plan.creditsPerPeriod === 99
                            ? "Unlimited"
                            : `${plan.creditsPerPeriod} activities`}
                        </span>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-kidspass-text-light"
                      )}
                    >
                      {isSelected && <Check className="h-4 w-4 text-white" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-accent-butter/30 rounded-[var(--radius-lg)] p-4 text-center">
            <p className="text-sm text-kidspass-text">
              🎁 <strong>First month free!</strong> No credit card required.
              <br />
              <span className="text-kidspass-text-muted">
                Cancel anytime, no questions asked.
              </span>
            </p>
          </div>

          <Button
            onClick={onFinalSubmit}
            isLoading={isLoading}
            disabled={!selectedPlan}
            className="w-full"
            size="lg"
          >
            Start Free Trial
            <Rocket className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <Card className="animate-fadeIn text-center py-8">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h1 className="text-2xl font-bold text-kidspass-text mb-2">
            Welcome to KidsPass!
          </h1>
          <p className="text-kidspass-text-muted mb-4">
            {childData.name}'s adventure begins now!
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }} />
          </div>
          <p className="text-sm text-kidspass-text-muted mt-4">
            Taking you to your dashboard...
          </p>
        </Card>
      )}
    </div>
  );
}
