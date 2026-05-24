import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email } = body;

    console.log(`Password reset link sent to ${email}`);

    return NextResponse.json({
      message: "If that email is registered, a reset link has been sent.",
    });
  } catch {
    return NextResponse.json(
      {
        message: "Failed to process request",
      },
      {
        status: 500,
      },
    );
  }
}
