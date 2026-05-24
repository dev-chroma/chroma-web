import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import Article from "@/models/Article";

export async function POST(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const article = await Article.findById(id);

    if (!article) {
      return NextResponse.json(
        {
          message: "Article not found",
        },
        {
          status: 404,
        },
      );
    }

    if (!article.viewedBy) {
      article.viewedBy = [];
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous";

    const alreadyViewed = article.viewedBy.includes(ip);

    if (!alreadyViewed) {
      article.reads += 1;

      article.viewedBy.push(ip);

      await article.save();
    }

    return NextResponse.json({
      reads: article.reads,
    });
  } catch (error) {
    console.error("VIEW ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to increment views",
      },
      {
        status: 500,
      },
    );
  }
}
