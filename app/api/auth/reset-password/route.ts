import { NextResponse } from "next/server";

export async function POST() {
// req: Request
  try {
    // const body = await req.json();

    // const { token, newPassword } = body;

    return NextResponse.json({
      message: "Password has been reset successfully.",
    });
  } catch {
    return NextResponse.json(
      {
        message: "Failed to reset password",
      },
      {
        status: 500,
      },
    );
  }
}
