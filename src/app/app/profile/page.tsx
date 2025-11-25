"use client";

import { useSession, signOut } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { TopNav } from "@/components/layout";
import { Card, Button, Avatar, Badge, Input, Modal } from "@/components/ui";
import { 
  User, 
  CreditCard, 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut,
  ChevronRight,
  Check
} from "lucide-react";
import { calculateAge, INTEREST_OPTIONS } from "@/lib/utils";
import Link from "next/link";

interface Child {
  id: string;
  name: string;
  birthDate: string;
  interests: string[];
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [showAddChild, setShowAddChild] = useState(false);
  const [editChild, setEditChild] = useState<Child | null>(null);
  const [childForm, setChildForm] = useState({
    name: "",
    birthYear: "",
    interests: [] as string[],
  });

  const { data: children, isLoading } = useQuery({
    queryKey: ["children"],
    queryFn: async () => {
      const res = await fetch("/api/children");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<Child[]>;
    },
  });

  const { data: subscription } = useQuery({
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

  const addChildMutation = useMutation({
    mutationFn: async (data: { name: string; birthYear: string; interests: string[] }) => {
      const res = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add child");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      setShowAddChild(false);
      resetForm();
    },
  });

  const updateChildMutation = useMutation({
    mutationFn: async (data: { id: string; name: string; birthYear: string; interests: string[] }) => {
      const res = await fetch(`/api/children/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update child");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
      setEditChild(null);
      resetForm();
    },
  });

  const deleteChildMutation = useMutation({
    mutationFn: async (childId: string) => {
      const res = await fetch(`/api/children/${childId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete child");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["children"] });
    },
  });

  const resetForm = () => {
    setChildForm({ name: "", birthYear: "", interests: [] });
  };

  const openEditChild = (child: Child) => {
    setChildForm({
      name: child.name,
      birthYear: new Date(child.birthDate).getFullYear().toString(),
      interests: child.interests,
    });
    setEditChild(child);
  };

  const toggleInterest = (interest: string) => {
    setChildForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSaveChild = () => {
    if (editChild) {
      updateChildMutation.mutate({
        id: editChild.id,
        ...childForm,
      });
    } else {
      addChildMutation.mutate(childForm);
    }
  };

  const currentYear = new Date().getFullYear();
  const birthYearOptions = Array.from({ length: 15 }, (_, i) => currentYear - 3 - i);

  return (
    <div className="py-6 space-y-6">
      <TopNav title="Profile" />

      {/* User info card */}
      <Card padding="lg">
        <div className="flex items-center gap-4">
          <Avatar
            src={session?.user?.image}
            fallback={session?.user?.name || "U"}
            size="xl"
          />
          <div>
            <h2 className="text-xl font-bold text-kidspass-text">
              {session?.user?.name}
            </h2>
            <p className="text-kidspass-text-muted">{session?.user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Subscription card */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-kidspass-text">Subscription</h3>
          </div>
          <Badge variant={subscription?.status === "ACTIVE" ? "success" : "warning"}>
            {subscription?.status || "No subscription"}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-kidspass-text-muted">Plan</span>
            <span className="font-semibold text-kidspass-text">
              {subscription?.plan?.name || "4 Activities / Month"}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-kidspass-text-muted">This month</span>
              <span className="font-semibold text-kidspass-text">
                {usage?.used || 0} of {usage?.total || 4} used
              </span>
            </div>
            <div className="h-2 bg-bg-cream rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${((usage?.used || 0) / (usage?.total || 4)) * 100}%` }}
              />
            </div>
          </div>

          <Link href="/app/billing">
            <Button variant="secondary" className="w-full mt-2">
              Manage Subscription
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Children section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-kidspass-text flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Children
          </h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              resetForm();
              setShowAddChild(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Child
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-bg-cream rounded-[var(--radius-lg)] animate-pulse" />
            ))}
          </div>
        ) : children && children.length > 0 ? (
          <div className="space-y-3">
            {children.map((child) => (
              <Card key={child.id} padding="md">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-kidspass-text">{child.name}</span>
                      <Badge variant="primary" size="sm">
                        Age {calculateAge(child.birthDate)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {child.interests.slice(0, 3).map((interest) => {
                        const interestData = INTEREST_OPTIONS.find((i) => i.value === interest);
                        return (
                          <span
                            key={interest}
                            className="text-xs bg-bg-cream px-2 py-1 rounded-full text-kidspass-text-muted"
                          >
                            {interestData?.icon} {interestData?.label}
                          </span>
                        );
                      })}
                      {child.interests.length > 3 && (
                        <span className="text-xs bg-bg-cream px-2 py-1 rounded-full text-kidspass-text-muted">
                          +{child.interests.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditChild(child)}
                      className="p-2 hover:bg-bg-cream rounded-full transition-colors"
                    >
                      <Edit2 className="h-4 w-4 text-kidspass-text-muted" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to remove this child?")) {
                          deleteChildMutation.mutate(child.id);
                        }
                      }}
                      className="p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-error" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card padding="lg" className="text-center">
            <p className="text-4xl mb-2">👶</p>
            <p className="text-kidspass-text-muted">
              Add your children to get personalized activity recommendations
            </p>
          </Card>
        )}
      </div>

      {/* Sign out button */}
      <Button
        variant="ghost"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-full text-kidspass-text-muted hover:text-error"
      >
        <LogOut className="h-5 w-5 mr-2" />
        Sign Out
      </Button>

      {/* Add/Edit Child Modal */}
      <Modal
        isOpen={showAddChild || !!editChild}
        onClose={() => {
          setShowAddChild(false);
          setEditChild(null);
          resetForm();
        }}
        title={editChild ? "Edit Child" : "Add Child"}
      >
        <div className="space-y-4">
          <Input
            label="Child's Name"
            placeholder="Alex"
            value={childForm.name}
            onChange={(e) => setChildForm((prev) => ({ ...prev, name: e.target.value }))}
          />

          <div>
            <label className="block text-sm font-semibold text-kidspass-text mb-2">
              Birth Year
            </label>
            <select
              value={childForm.birthYear}
              onChange={(e) => setChildForm((prev) => ({ ...prev, birthYear: e.target.value }))}
              className="w-full px-4 py-3 text-base border-2 border-bg-cream rounded-[var(--radius-md)] bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select year</option>
              {birthYearOptions.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
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
                const isSelected = childForm.interests.includes(interest.value);
                return (
                  <button
                    key={interest.value}
                    type="button"
                    onClick={() => toggleInterest(interest.value)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? "bg-primary text-kidspass-text shadow-sm"
                        : "bg-bg-cream text-kidspass-text-muted hover:bg-primary-light"
                    }`}
                  >
                    <span>{interest.icon}</span>
                    <span>{interest.label}</span>
                    {isSelected && <Check className="h-3 w-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={handleSaveChild}
            isLoading={addChildMutation.isPending || updateChildMutation.isPending}
            className="w-full"
            disabled={!childForm.name || !childForm.birthYear}
          >
            {editChild ? "Save Changes" : "Add Child"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

