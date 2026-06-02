import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import User from "@/models/User";

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    await connectDB();

    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (currentUser._id.toString() === id) {
      return NextResponse.json(
        {
          message: "You cannot delete your own account",
        },
        {
          status: 400,
        },
      );
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to delete user",
      },
      {
        status: 500,
      },
    );
  }
}
