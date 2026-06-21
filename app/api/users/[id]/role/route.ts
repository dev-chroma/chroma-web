import { NextResponse } from "next/server";
import mongoose from "mongoose";

import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import { createNotification } from "@/lib/createNotification";
import { isAdminRole, isAssignableRole } from "@/lib/roles";

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

    if (!admin || !isAdminRole(admin.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
    }

    if (!isAssignableRole(body.role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    const user = await User.findById(id).select("role");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (
      admin.role !== "Owner" &&
      (user.role === "Admin" || user.role === "Owner" || body.role === "Admin")
    ) {
      return NextResponse.json(
        { message: "Only the owner can manage admin roles" },
        { status: 403 },
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        role: body.role,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    try {
      await createNotification({
        title: "Role Updated",
        message: `Your role has been changed to ${body.role}.`,
        createdBy: admin.id,
        recipients: [id],
        type: "Role",
      });
    } catch (error) {
      console.error("Failed to create role update notification", error);
    }

    return NextResponse.json(updatedUser);
  } catch {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
