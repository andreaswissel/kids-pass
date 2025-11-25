import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bookingSchema = z.object({
  sessionId: z.string(),
  childId: z.string(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: session.user.id },
      include: {
        child: {
          select: { id: true, name: true },
        },
        session: {
          include: {
            activity: {
              include: {
                partner: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
      orderBy: { session: { startDateTime: "desc" } },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = bookingSchema.parse(body);

    // Verify child belongs to user
    const child = await prisma.child.findFirst({
      where: { id: validatedData.childId, userId: session.user.id },
    });

    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    // Check subscription and usage
    const subscription = await prisma.subscription.findFirst({
      where: { userId: session.user.id, status: "ACTIVE" },
      include: { plan: true },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Active subscription required" },
        { status: 403 }
      );
    }

    // Check usage for current period
    const usage = await prisma.usage.findFirst({
      where: {
        subscriptionId: subscription.id,
        periodStart: subscription.currentPeriodStart,
      },
    });

    const usedCredits = usage?.usedCredits || 0;
    const maxCredits = subscription.plan.creditsPerPeriod;

    if (usedCredits >= maxCredits) {
      return NextResponse.json(
        { error: "Monthly booking limit reached" },
        { status: 403 }
      );
    }

    // Get session and check capacity
    const activitySession = await prisma.session_.findUnique({
      where: { id: validatedData.sessionId },
      include: {
        _count: {
          select: { bookings: { where: { status: "BOOKED" } } },
        },
      },
    });

    if (!activitySession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    if (activitySession._count.bookings >= activitySession.capacity) {
      return NextResponse.json({ error: "Session is full" }, { status: 400 });
    }

    // Check for existing booking
    const existingBooking = await prisma.booking.findFirst({
      where: {
        sessionId: validatedData.sessionId,
        childId: validatedData.childId,
        status: "BOOKED",
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Already booked for this session" },
        { status: 400 }
      );
    }

    // Create booking and update usage
    const booking = await prisma.$transaction(async (tx) => {
      const newBooking = await tx.booking.create({
        data: {
          sessionId: validatedData.sessionId,
          childId: validatedData.childId,
          userId: session.user.id,
          status: "BOOKED",
        },
        include: {
          child: { select: { name: true } },
          session: {
            include: {
              activity: { select: { title: true } },
            },
          },
        },
      });

      // Update or create usage record
      await tx.usage.upsert({
        where: {
          subscriptionId_periodStart: {
            subscriptionId: subscription.id,
            periodStart: subscription.currentPeriodStart,
          },
        },
        update: {
          usedCredits: { increment: 1 },
        },
        create: {
          subscriptionId: subscription.id,
          periodStart: subscription.currentPeriodStart,
          periodEnd: subscription.currentPeriodEnd,
          usedCredits: 1,
        },
      });

      return newBooking;
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error("Create booking error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

