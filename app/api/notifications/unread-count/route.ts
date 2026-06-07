import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";

import Notification from "@/models/Notification";

export async function GET() {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ count: 0 }, { status: 401 });
    }

    const notifications = await Notification.find({
      $or: [{ isGlobal: true }, { recipients: user._id }],
    }).lean();

    const unreadCount = notifications.filter(
      (notification) =>
        !notification.readBy?.some(
          (id: string) => id.toString() === user._id.toString(),
        ),
    ).length;

    return NextResponse.json({
      count: unreadCount,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
