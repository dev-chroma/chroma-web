import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import "@/models/User";
import "@/models/Category";

import Article from "@/models/Article";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(req: Request) {
  try {
    await connectDB();

    const auth = await requireAdmin();

    if (auth.error) {
      return auth.error;
    }

    const articles = await Article.find({
      $or: [
        {
          deletedAt: {
            $exists: true,
          },
        },
        {
          status: "Draft",
        },
      ],
    })
      .populate("author", "firstName surname avatar")
      .populate("category", "name slug")
      .sort({
        updatedAt: -1,
      })
      .lean();

    return NextResponse.json({
      articles,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to fetch recovery articles",
      },
      {
        status: 500,
      },
    );
  }
}
