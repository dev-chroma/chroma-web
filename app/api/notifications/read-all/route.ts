import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";

import Notification from "@/models/Notification";

export async function PATCH() {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await Notification.updateMany(
      {
        $or: [{ isGlobal: true }, { recipients: user._id }],
      },
      {
        $addToSet: {
          readBy: user._id,
        },
      },
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to mark all as read" },
      { status: 500 },
    );
  }
}
