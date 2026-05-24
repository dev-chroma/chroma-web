import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/requireAuth";

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

    const auth = await requireAuth(req);

    if (auth.error) {
      return auth.error;
    }

    const userId = auth.user.id;

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

    const isBookmarked = article.bookmarkedBy.includes(userId);

    if (isBookmarked) {
      await Article.findByIdAndUpdate(id, {
        $pull: {
          bookmarkedBy: userId,
        },
        $inc: {
          bookmarksCount: -1,
        },
      });

      return NextResponse.json({
        message: "Bookmark removed",
        bookmarked: false,
      });
    }

    await Article.findByIdAndUpdate(id, {
      $push: {
        bookmarkedBy: userId,
      },
      $inc: {
        bookmarksCount: 1,
      },
    });

    return NextResponse.json({
      message: "Article bookmarked",
      bookmarked: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to bookmark article",
      },
      {
        status: 500,
      },
    );
  }
}
