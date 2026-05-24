import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function PATCH(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    await connectDB();

    const admin = await getUserFromToken(req);

    if (!admin || admin.role !== "Admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const { id } = await context.params;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        role: body.role,
      },
      {
        new: true,
      },
    );

    return NextResponse.json(updatedUser);
  } catch {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
