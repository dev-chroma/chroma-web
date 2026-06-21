import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import Article from "@/models/Article";

export async function POST(
  _req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const article = await Article.findByIdAndUpdate(
      id,
      {
        $inc: {
          reads: 1,
        },
      },
      {
        new: true,
        projection: {
          reads: 1,
        },
      },
    );

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
