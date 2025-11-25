import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CANCELLATION_CUTOFF_HOURS = 24;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get booking and verify ownership
    const booking = await prisma.booking.findFirst({
      where: { id, userId: session.user.id },
      include: {
        session: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== "BOOKED") {
      return NextResponse.json(
        { error: "Booking is not active" },
        { status: 400 }
      );
    }

    // Check cancellation cutoff
    const sessionStart = new Date(booking.session.startDateTime);
    const cutoffTime = new Date(
      sessionStart.getTime() - CANCELLATION_CUTOFF_HOURS * 60 * 60 * 1000
    );

    if (new Date() > cutoffTime) {
      return NextResponse.json(
        {
          error: `Cannot cancel within ${CANCELLATION_CUTOFF_HOURS} hours of activity start`,
        },
        { status: 400 }
      );
    }

    // Cancel booking and restore credit
    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
        },
      });

      // Get user's subscription
      const subscription = await tx.subscription.findFirst({
        where: { userId: session.user.id, status: "ACTIVE" },
      });

      if (subscription) {
        // Restore credit
        await tx.usage.updateMany({
          where: {
            subscriptionId: subscription.id,
            periodStart: subscription.currentPeriodStart,
            usedCredits: { gt: 0 },
          },
          data: {
            usedCredits: { decrement: 1 },
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}

