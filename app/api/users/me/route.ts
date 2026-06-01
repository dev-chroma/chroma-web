import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET() {
  try {
    await connectDB();

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(currentUser._id).select("-password");

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const updatedUser = await User.findByIdAndUpdate(currentUser._id, body, {
      new: true,
      runValidators: true,
    }).select("-password");

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
