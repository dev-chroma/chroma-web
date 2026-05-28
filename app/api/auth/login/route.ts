import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body;
    const user = await User.findOne({
      email,
    });

    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        {
          status: 401,
        },
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "30d",
      },
    );

    // CREATE RESPONSE
    const response = NextResponse.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
        role: user.role,
      },
    });

    // SET COOKIE
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Login failed",
      },
      {
        status: 500,
      },
    );
  }
}
