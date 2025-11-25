import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        partner: {
          select: {
            name: true,
            description: true,
            address: true,
            city: true,
          },
        },
        sessions: {
          where: {
            startDateTime: { gt: new Date() },
          },
          orderBy: { startDateTime: "asc" },
          include: {
            _count: {
              select: { bookings: { where: { status: "BOOKED" } } },
            },
          },
        },
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Get activity error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}

