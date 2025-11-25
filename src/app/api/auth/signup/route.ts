import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  city: z.string().min(2),
  child: z.object({
    name: z.string().min(2),
    birthYear: z.string(),
    interests: z.array(z.string()),
  }),
  planId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Get the selected plan or default to first active plan
    let plan = null;
    if (validatedData.planId) {
      plan = await prisma.plan.findUnique({
        where: { id: validatedData.planId },
      });
    }
    if (!plan) {
      plan = await prisma.plan.findFirst({
        where: { isActive: true },
        orderBy: { priceCents: "asc" },
      });
    }

    // Create subscription period (first month free!)
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    // Create user with child and subscription in a transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create user with child
      const newUser = await tx.user.create({
        data: {
          email: validatedData.email,
          passwordHash,
          name: validatedData.name,
          city: validatedData.city,
          role: "PARENT",
          children: {
            create: {
              name: validatedData.child.name,
              birthDate: new Date(`${validatedData.child.birthYear}-01-01`),
              interests: validatedData.child.interests,
            },
          },
        },
        include: {
          children: true,
        },
      });

      // Create subscription (mocked as active - free trial)
      if (plan) {
        await tx.subscription.create({
          data: {
            userId: newUser.id,
            planId: plan.id,
            status: "ACTIVE",
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
            // Mock Stripe IDs for now
            stripeCustomerId: `mock_cus_${newUser.id}`,
            stripeSubscriptionId: `mock_sub_${newUser.id}`,
          },
        });
      }

      return newUser;
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      subscription: plan ? {
        planName: plan.name,
        trialEnds: periodEnd.toISOString(),
      } : null,
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data provided", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
