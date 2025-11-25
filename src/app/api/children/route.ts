import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const childSchema = z.object({
  name: z.string().min(2),
  birthYear: z.string(),
  interests: z.array(z.string()),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const children = await prisma.child.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(children);
  } catch (error) {
    console.error("Get children error:", error);
    return NextResponse.json(
      { error: "Failed to fetch children" },
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
    const validatedData = childSchema.parse(body);

    const child = await prisma.child.create({
      data: {
        userId: session.user.id,
        name: validatedData.name,
        birthDate: new Date(`${validatedData.birthYear}-01-01`),
        interests: validatedData.interests,
      },
    });

    return NextResponse.json(child);
  } catch (error) {
    console.error("Create child error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create child" },
      { status: 500 }
    );
  }
}

