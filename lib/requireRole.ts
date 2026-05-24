import { NextResponse } from "next/server";

import { getUserFromToken } from "@/lib/auth";

export async function requireRole(req: Request, roles: string[]) {
  const user = await getUserFromToken(req);

  if (!user) {
    return {
      error: NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      ),
    };
  }

  if (!roles.includes(user.role)) {
    return {
      error: NextResponse.json(
        {
          message: "Access denied",
        },
        {
          status: 403,
        },
      ),
    };
  }

  return { user };
}
