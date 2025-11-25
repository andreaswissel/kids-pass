"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Card } from "@/components/ui";
import { ChevronRight, Check, ArrowLeft } from "lucide-react";
import { INTEREST_OPTIONS } from "@/lib/utils";
import { signIn } from "next-auth/react";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Please enter your name"),
  city: z.string().min(2, "Please enter your city"),
});

const childSchema = z.object({
  name: z.string().min(2, "Please enter child's name"),
  birthYear: z.string().min(4, "Please select birth year"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
});

type SignupForm = z.infer<typeof signupSchema>;
type ChildForm = z.infer<typeof childSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [parentData, setParentData] = useState<SignupForm | null>(null);
  const [childData, setChildData] = useState<ChildForm>({
    name: "",
    birthYear: "",
    interests: [],
  });

  const {
    register: registerParent,
    handleSubmit: handleParentSubmit,
    formState: { errors: parentErrors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const currentYear = new Date().getFullYear();
  const birthYearOptions = Array.from({ length: 15 }, (_, i) => ({
    value: String(currentYear - 3 - i),
    label: String(currentYear - 3 - i),
  }));

  const onParentSubmit = (data: SignupForm) => {
    setParentData(data);
    setStep(2);
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
    if (!parentData) return;
    if (!childData.name || !childData.birthYear || childData.interests.length === 0) {
      setError("Please fill in all child information");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parentData,
          child: childData,
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

      router.push("/app");
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
        <div
          className={`w-3 h-3 rounded-full transition-colors ${
            step >= 1 ? "bg-primary" : "bg-bg-cream"
          }`}
        />
        <div className="w-12 h-0.5 bg-bg-cream">
          <div
            className={`h-full bg-primary transition-all ${
              step >= 2 ? "w-full" : "w-0"
            }`}
          />
        </div>
        <div
          className={`w-3 h-3 rounded-full transition-colors ${
            step >= 2 ? "bg-primary" : "bg-bg-cream"
          }`}
        />
      </div>

      {step === 1 && (
        <Card className="animate-fadeIn">
          <div className="text-center mb-6">
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
                Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const isSelected = childData.interests.includes(interest.value);
                  return (
                    <button
                      key={interest.value}
                      type="button"
                      onClick={() => toggleInterest(interest.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                        isSelected
                          ? "bg-primary text-kidspass-text shadow-sm"
                          : "bg-bg-cream text-kidspass-text-muted hover:bg-primary-light"
                      }`}
                    >
                      <span>{interest.icon}</span>
                      <span>{interest.label}</span>
                      {isSelected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={onFinalSubmit}
              isLoading={isLoading}
              className="w-full mt-6"
            >
              Create Account
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

