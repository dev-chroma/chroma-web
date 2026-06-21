// lib/requireAdmin.ts

import { NextResponse } from "next/server";
import { getCurrentUser } from "./getCurrentUser";
import { isAdminRole } from "./roles";

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!isAdminRole(user.role)) {
    return {
      error: NextResponse.json({ message: "Access denied" }, { status: 403 }),
    };
  }

  return { user };
}
