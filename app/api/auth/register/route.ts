import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      firstName,
      surname,
      email,
      password,
      role,
      school,
      bio,
      dateOfBirth,
    } = body;

    const userExists = await User.findOne({
      email,
    });

    if (userExists) {
      return NextResponse.json(
        {
          message: "User already exists",
        },
        {
          status: 400,
        },
      );
    }

    const user = await User.create({
      firstName,
      surname,
      email,
      password,
      role,
      school,
      bio,
      dateOfBirth,
    });

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

    return NextResponse.json(
      {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          surname: user.surname,
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Registration failed",
      },
      {
        status: 500,
      },
    );
  }
}
