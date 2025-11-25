import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const activitySchema = z.object({
  partnerId: z.string(),
  title: z.string().min(2),
  description: z.string().optional(),
  category: z.enum([
    "SPORTS",
    "MUSIC",
    "ARTS",
    "OUTDOOR",
    "CREATIVE",
    "DANCE",
    "SWIMMING",
    "MARTIAL_ARTS",
  ]),
  ageMin: z.number().min(3).max(14),
  ageMax: z.number().min(3).max(14),
  locationAddress: z.string().min(2),
  city: z.string().min(2),
  animalIcon: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activities = await prisma.activity.findMany({
      include: {
        partner: { select: { name: true } },
        _count: { select: { sessions: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Get activities error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
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
    const validatedData = activitySchema.parse(body);

    // Verify partner exists
    const partner = await prisma.partner.findUnique({
      where: { id: validatedData.partnerId },
    });

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    const activity = await prisma.activity.create({
      data: {
        partnerId: validatedData.partnerId,
        title: validatedData.title,
        description: validatedData.description || null,
        category: validatedData.category,
        ageMin: validatedData.ageMin,
        ageMax: validatedData.ageMax,
        locationAddress: validatedData.locationAddress,
        city: validatedData.city,
        animalIcon: validatedData.animalIcon || "fox",
      },
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Create activity error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}

