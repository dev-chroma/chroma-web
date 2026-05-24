import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import { requireRole } from "@/lib/requireRole";

import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find()
      .sort({
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      categories,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to fetch categories",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const auth = await requireRole(req, ["Admin", "Editor"]);

    if (auth.error) {
      return auth.error;
    }

    const body = await req.json();

    const { name } = body;

    let { slug } = body;

    if (!name) {
      return NextResponse.json(
        {
          message: "Name is required",
        },
        {
          status: 400,
        },
      );
    }

    if (!slug) {
      slug = name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    }

    const exists = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (exists) {
      return NextResponse.json(
        {
          message: "Category already exists",
        },
        {
          status: 400,
        },
      );
    }

    const category = await Category.create({
      name,
      slug,
    });

    return NextResponse.json(category, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to create category",
      },
      {
        status: 500,
      },
    );
  }
}
