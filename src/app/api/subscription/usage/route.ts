import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId: session.user.id, status: "ACTIVE" },
      include: { plan: true },
    });

    if (!subscription) {
      return NextResponse.json({ used: 0, total: 4, hasSubscription: false });
    }

    const usage = await prisma.usage.findFirst({
      where: {
        subscriptionId: subscription.id,
        periodStart: subscription.currentPeriodStart,
      },
    });

    return NextResponse.json({
      used: usage?.usedCredits || 0,
      total: subscription.plan.creditsPerPeriod,
      hasSubscription: true,
      periodStart: subscription.currentPeriodStart,
      periodEnd: subscription.currentPeriodEnd,
    });
  } catch (error) {
    console.error("Get usage error:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage" },
      { status: 500 }
    );
  }
}

