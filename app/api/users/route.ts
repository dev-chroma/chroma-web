import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    const admin = await getUserFromToken(req);

    if (!admin || admin.role !== "Admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const users = await User.find().select("-password");

    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
