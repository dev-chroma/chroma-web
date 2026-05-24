import { NextResponse } from "next/server";

import { getUserFromToken } from "@/lib/auth";

export async function requireAuth(req: Request) {
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

  return { user };
}
