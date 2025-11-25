import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const childId = searchParams.get("childId");
    const dayOfWeek = searchParams.get("dayOfWeek");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit");
    const city = searchParams.get("city"); // Allow explicit city filter

    // Get current user's city for default filtering
    const session = await getServerSession(authOptions);
    let userCity: string | null = null;
    
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { city: true },
      });
      userCity = user?.city || null;
    }

    // Build where clause
    const where: Record<string, unknown> = {};

    // Filter by city - use explicit city param, or user's city, or show all
    const filterCity = city || userCity;
    if (filterCity) {
      where.city = { equals: filterCity, mode: "insensitive" };
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // If childId is provided, filter by age
    if (childId && session?.user?.id) {
      const child = await prisma.child.findFirst({
        where: { id: childId, userId: session.user.id },
      });

      if (child) {
        const age = Math.floor(
          (Date.now() - new Date(child.birthDate).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000)
        );
        where.ageMin = { lte: age };
        where.ageMax = { gte: age };
      }
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        partner: {
          select: { name: true },
        },
        sessions: {
          where: {
            startDateTime: { gt: new Date() },
          },
          orderBy: { startDateTime: "asc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit) : 50,
    });

    // Filter by day of week if specified
    let filteredActivities = activities;
    if (dayOfWeek) {
      const day = parseInt(dayOfWeek);
      filteredActivities = activities.filter((activity) =>
        activity.sessions.some(
          (session) => new Date(session.startDateTime).getDay() === day
        )
      );
    }

    return NextResponse.json(filteredActivities);
  } catch (error) {
    console.error("Get activities error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
