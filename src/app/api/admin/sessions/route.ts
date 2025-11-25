import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const sessionSchema = z.object({
  activityId: z.string(),
  startDateTime: z.string(),
  endDateTime: z.string(),
  capacity: z.number().min(1).max(50),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessions = await prisma.session_.findMany({
      include: {
        activity: {
          select: {
            title: true,
            partner: { select: { name: true } },
          },
        },
        _count: {
          select: { bookings: { where: { status: "BOOKED" } } },
        },
      },
      orderBy: { startDateTime: "asc" },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Get sessions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = sessionSchema.parse(body);

    // Verify activity exists
    const activity = await prisma.activity.findUnique({
      where: { id: validatedData.activityId },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    const newSession = await prisma.session_.create({
      data: {
        activityId: validatedData.activityId,
        startDateTime: new Date(validatedData.startDateTime),
        endDateTime: new Date(validatedData.endDateTime),
        capacity: validatedData.capacity,
      },
    });

    return NextResponse.json(newSession);
  } catch (error) {
    console.error("Create session error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

