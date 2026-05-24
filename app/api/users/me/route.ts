import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    const userData = await getUserFromToken(req);

    if (!userData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userData.id).select("-password");

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const userData = await getUserFromToken(req);

    if (!userData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const updatedUser = await User.findByIdAndUpdate(userData.id, body, {
      new: true,
    }).select("-password");

    return NextResponse.json(updatedUser);
  } catch {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
