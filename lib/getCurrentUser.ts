import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

interface JwtPayload {
  id: string;
  role: string;
}

export async function getCurrentUser() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret",
    ) as JwtPayload;

    const user = await User.findById(decoded.id).lean();

    if (!user) {
      return null;
    }

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("GET CURRENT USER ERROR:", error);

    return null;
  }
}
