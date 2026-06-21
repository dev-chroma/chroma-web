import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

interface JwtPayload {
  id: string;
  email?: string;
  role?: string;
}

export async function getUserFromToken(req: Request) {
  let token: string | undefined;

  const authHeader = req.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value;
    } catch {
      // Ignore
    }
  }

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret",
    ) as JwtPayload;

    await connectDB();

    const user = await User.findById(decoded.id).select("email role").lean<{
      _id: unknown;
      email?: string;
      role: string;
    } | null>();

    if (!user) {
      return null;
    }

    return {
      id: decoded.id,
      email: user.email || decoded.email || "",
      role: user.role,
    };
  } catch {
    return null;
  }
}
