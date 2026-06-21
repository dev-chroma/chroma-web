import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import { isAdminRole } from "@/lib/roles";
import type { UserRole } from "@/types/user";

export async function GET(req: Request) {
  try {
    await connectDB();

    const admin = await getUserFromToken(req);

    if (!admin || !isAdminRole(admin.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") as UserRole | null;

    const query = role ? { role } : {};

    const users = await User.find(query).select("-password");

    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
