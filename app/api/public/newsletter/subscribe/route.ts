import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import Newsletter from "@/models/Newsletter";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { email } = body;

    if (!email) {
      return NextResponse.json(
        {
          message: "Email is required",
        },
        {
          status: 400,
        },
      );
    }

    const exists = await Newsletter.findOne({
      email,
    });

    if (exists) {
      return NextResponse.json(
        {
          message: "Already subscribed",
        },
        {
          status: 400,
        },
      );
    }

    await Newsletter.create({
      email,
    });

    return NextResponse.json(
      {
        message: "Subscribed successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to subscribe",
      },
      {
        status: 500,
      },
    );
  }
}
