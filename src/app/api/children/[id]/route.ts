import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateChildSchema = z.object({
  name: z.string().min(2),
  birthYear: z.string(),
  interests: z.array(z.string()),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const validatedData = updateChildSchema.parse(body);

    // Verify ownership
    const existingChild = await prisma.child.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingChild) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    const child = await prisma.child.update({
      where: { id },
      data: {
        name: validatedData.name,
        birthDate: new Date(`${validatedData.birthYear}-01-01`),
        interests: validatedData.interests,
      },
    });

    return NextResponse.json(child);
  } catch (error) {
    console.error("Update child error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update child" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const existingChild = await prisma.child.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existingChild) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    // Check for future bookings
    const futureBookings = await prisma.booking.count({
      where: {
        childId: id,
        status: "BOOKED",
        session: {
          startDateTime: { gt: new Date() },
        },
      },
    });

    if (futureBookings > 0) {
      return NextResponse.json(
        { error: "Cannot delete child with upcoming bookings" },
        { status: 400 }
      );
    }

    await prisma.child.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete child error:", error);
    return NextResponse.json(
      { error: "Failed to delete child" },
      { status: 500 }
    );
  }
}

